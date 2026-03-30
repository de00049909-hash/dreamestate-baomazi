import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database and notification modules
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("comments router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("list returns empty array when db is unavailable", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.comments.list({ eventId: 1 });
    expect(result).toEqual([]);
  });

  it("create throws when db is unavailable", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.comments.create({
        eventId: 1,
        eventTitle: "Test Event",
        visitorName: "TestUser",
        visitorAvatar: "🐱",
        visitorToken: "test_token_123",
        content: "This is a test comment",
      })
    ).rejects.toThrow("Database not available");
  });

  it("toggleLike throws when db is unavailable", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.comments.toggleLike({
        commentId: 1,
        visitorToken: "test_token_123",
      })
    ).rejects.toThrow("Database not available");
  });

  it("myLikes returns empty array when db is unavailable", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.comments.myLikes({
      eventId: 1,
      visitorToken: "test_token_123",
    });
    expect(result).toEqual([]);
  });

  it("create validates input - name too long", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.comments.create({
        eventId: 1,
        eventTitle: "Test Event",
        visitorName: "A".repeat(65), // exceeds max 64 chars
        visitorAvatar: "🐱",
        visitorToken: "test_token_123",
        content: "Valid content",
      })
    ).rejects.toThrow();
  });

  it("create validates input - content too long", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.comments.create({
        eventId: 1,
        eventTitle: "Test Event",
        visitorName: "TestUser",
        visitorAvatar: "🐱",
        visitorToken: "test_token_123",
        content: "A".repeat(1001), // exceeds max 1000 chars
      })
    ).rejects.toThrow();
  });

  it("create validates input - empty content rejected", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.comments.create({
        eventId: 1,
        eventTitle: "Test Event",
        visitorName: "TestUser",
        visitorAvatar: "🐱",
        visitorToken: "test_token_123",
        content: "", // empty content
      })
    ).rejects.toThrow();
  });
});
