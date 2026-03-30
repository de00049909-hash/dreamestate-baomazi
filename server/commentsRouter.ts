import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { comments, commentLikes } from "../drizzle/schema";
import { notifyOwner } from "./_core/notification";

export const commentsRouter = router({
  /** Get all comments for a specific event */
  list: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const rows = await db
        .select()
        .from(comments)
        .where(eq(comments.eventId, input.eventId))
        .orderBy(desc(comments.createdAt));

      return rows;
    }),

  /** Submit a new comment */
  create: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
        eventTitle: z.string(),
        visitorName: z.string().min(1).max(64),
        visitorAvatar: z.string().min(1).max(8),
        visitorToken: z.string().min(1).max(64),
        content: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(comments).values({
        eventId: input.eventId,
        visitorName: input.visitorName,
        visitorAvatar: input.visitorAvatar,
        visitorToken: input.visitorToken,
        content: input.content,
        likes: 0,
      });

      // Notify owner about new comment
      try {
        await notifyOwner({
          title: `💬 新留言通知 - ${input.eventTitle}`,
          content: `訪客「${input.visitorName}」在活動「${input.eventTitle}」留言：\n\n「${input.content}」\n\n請至後台查看並回覆。`,
        });
      } catch (e) {
        // Notification failure should not block comment creation
        console.warn("[Comments] Failed to notify owner:", e);
      }

      return { success: true };
    }),

  /** Toggle like on a comment */
  toggleLike: publicProcedure
    .input(
      z.object({
        commentId: z.number(),
        visitorToken: z.string().min(1).max(64),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if already liked
      const existing = await db
        .select()
        .from(commentLikes)
        .where(
          and(
            eq(commentLikes.commentId, input.commentId),
            eq(commentLikes.visitorToken, input.visitorToken)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // Unlike: remove the like record and decrement count
        await db
          .delete(commentLikes)
          .where(
            and(
              eq(commentLikes.commentId, input.commentId),
              eq(commentLikes.visitorToken, input.visitorToken)
            )
          );

        // Get current likes and decrement
        const comment = await db
          .select()
          .from(comments)
          .where(eq(comments.id, input.commentId))
          .limit(1);

        if (comment.length > 0) {
          const newLikes = Math.max(0, comment[0].likes - 1);
          await db
            .update(comments)
            .set({ likes: newLikes })
            .where(eq(comments.id, input.commentId));
          return { liked: false, likes: newLikes };
        }
      } else {
        // Like: add record and increment count
        await db.insert(commentLikes).values({
          commentId: input.commentId,
          visitorToken: input.visitorToken,
        });

        const comment = await db
          .select()
          .from(comments)
          .where(eq(comments.id, input.commentId))
          .limit(1);

        if (comment.length > 0) {
          const newLikes = comment[0].likes + 1;
          await db
            .update(comments)
            .set({ likes: newLikes })
            .where(eq(comments.id, input.commentId));
          return { liked: true, likes: newLikes };
        }
      }

      return { liked: false, likes: 0 };
    }),

  /** Check which comments a visitor has liked */
  myLikes: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
        visitorToken: z.string().min(1).max(64),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      // Get all comment IDs for this event
      const eventComments = await db
        .select({ id: comments.id })
        .from(comments)
        .where(eq(comments.eventId, input.eventId));

      const commentIds = eventComments.map((c) => c.id);
      if (commentIds.length === 0) return [];

      // Get likes by this visitor for these comments
      const likes = await db
        .select({ commentId: commentLikes.commentId })
        .from(commentLikes)
        .where(eq(commentLikes.visitorToken, input.visitorToken));

      return likes.map((l) => l.commentId);
    }),
});
