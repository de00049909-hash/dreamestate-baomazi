'use client';
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, MessageCircle, Phone, Share2, ChevronRight, Facebook, MessageSquare, ArrowRight, X, ChevronLeft, ThumbsUp, User, Smile } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useVisitorIdentity } from "@/hooks/useVisitorIdentity";

/**
 * 桃園報馬仔 - 一頁式網站（重新結構化版本）
 * 設計理念：展示桃園的生活魅力，吸引台北、新竹人來桃園定居
 * 核心 CTA：「留言說旅遊，加 LINE 就能得到兩天一日桃園遊玩資訊」
 * 
 * 新結構：
 * - 英雄區 / 本週精選 / 認識桃園 / 特色公園 / 親子館 / 圖書館 / 藝文活動 / 交通運輸 / 每日報馬仔
 * - 特色公園、親子館、圖書館改為獨立區塊（不在標籤頁中）
 * - 藝文活動合併（文創園區 + 電影院 + 婦女中心）
 * - 本週精選展示桃園美景、美食、活動等
 */

const FEATURED_SELECTIONS = [
  {
    id: 1,
    title: "🏞️ 桃園公園漫步",
    description: "探索 127 座公園的綠意世界，享受親子時光",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/taoyuan-featured-1-park-HXRzzFLenHcFF7nuW6wn7K.webp",
    category: "景點",
  },
  {
    id: 2,
    title: "🍜 在地美食之旅",
    description: "品嚐桃園特色美食，感受在地飲食文化",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/taoyuan-featured-2-food-eEBVbaymBaWfXfmHTceph7.webp",
    category: "美食",
  },
  {
    id: 3,
    title: "🌆 桃園城市風景",
    description: "欣賞現代化的城市夜景，感受都市活力",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/taoyuan-featured-3-night-scene-JdxumHLhdsL3QT22n3XFEx.webp",
    category: "風景",
  },
  {
    id: 4,
    title: "👨‍👩‍👧‍👦 幸福家庭生活",
    description: "在優質社區享受溫暖的家庭時光",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/taoyuan-featured-4-family-casual-8ZJoJZNJN5xVjE4VXS5nQH.webp",
    category: "生活",
  },
  {
    id: 5,
    title: "🎨 文化藝術展覽",
    description: "沉浸在創意與藝術的世界，豐富精神生活",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/taoyuan-featured-5-culture-CRgFat8JRDK5ff7U4U4L5B.webp",
    category: "文化",
  },
];


const DAILY_CONTENT = {
  Monday: {
    title: "🏗️ 桃園建設新聞",
    subtitle: "重大建設帶動發展",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/W8h12DpBuWeB_fab29134.jpg",
    content: [
      {
        icon: "🚀",
        title: "航空城計畫",
        description: "台灣最大國家建設，2026 年底完成先建後遷，明年全面動工。預期將吸引大量產業，帶動經濟成長。",
        details: "航空城計畫是桃園市政府的重大建設，預計在 2026 年底完成先建後遷，2027 年全面動工。此計畫將帶動大園、蘆竹等地區的發展，吸引大量產業進駐，創造就業機會。完成後將成為台灣最大的國家級建設。",
      },
      {
        icon: "🚇",
        title: "捷運綠線通車",
        description: "預計 2026 年通車，大幅改善交通便利性，帶動沿線房市發展。",
        details: "捷運綠線（航空城線）預計 2026 年完工通車，全長約 24 公里，共 14 站。路線從八德經桃園火車站至大園，將大幅改善交通便利性，帶動沿線房市發展。完成後將成為連接桃園各區的重要交通樞紐。",
      },
      {
        icon: "🏢",
        title: "青埔高鐵特區",
        description: "區內規劃六所學校、33 座公園。兩房含車位總價約 1,800～2,200 萬元。",
        details: "青埔高鐵特區位於中壢區，鄰近高鐵桃園站。區內規劃完善，包括六所學校、33 座公園、商業設施等。兩房含車位的住宅總價約 1,800～2,200 萬元，是首購族的熱門選擇。交通便利，生活機能完整。",
      },
    ],
  },
  Tuesday: {
    title: "👨‍👩‍👧 桃園好康政策",
    subtitle: "育兒、老人福利完善",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/3XsMQ8H580bE_f83a725d.webp",
    content: [
      {
        icon: "👶",
        title: "企業育兒補貼加碼",
        description: "勞動部 5 月 1 日起推動新制，每人每年最高補助 1 萬元。不限托育機構，保母、親友帶也能領！",
        details: "勞動部推動的企業育兒補貼加碼方案，自 5 月 1 日起實施。每人每年最高補助 1 萬元，不限托育機構，保母、親友帶也能領。這項政策大幅減輕家庭育兒負擔，是在桃園養育孩子的一大優勢。",
      },
      {
        icon: "👴",
        title: "敬老愛心卡優惠",
        description: "年滿 65 歲享乘車優惠，每月自動驗證儲值補助 800 點社福點數。",
        details: "年滿 65 歲的長者可申辦敬老愛心卡，享受乘車優惠。每月自動驗證儲值補助 800 點社福點數，可用於公車、捷運等交通費用。這項福利照顧銀髮族的日常生活，是桃園市政府的溫暖政策。",
      },
      {
        icon: "🏥",
        title: "中低收入老人津貼",
        description: "符合條件長者每月可領取生活津貼，照顧銀髮族生活。",
        details: "桃園市政府提供中低收入老人津貼，符合條件的長者每月可領取生活津貼。此項政策照顧銀髮族的日常生活，減輕家庭經濟負擔。如有需要，可向各區公所提出申請。",
      },
    ],
  },
  Wednesday: {
    title: "🍜 桃園哪裡吃",
    subtitle: "美食集中地，滿足味蕾",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/xhxArQfKJ03p_130304f2.jpg",
    content: [
      {
        icon: "🍜",
        title: "大溪豆干與油飯",
        description: "百年老店，全台聞名。豆干香脆、油飯香Q，是桃園必吃伴手禮。",
        details: "大溪豆干是桃園最著名的伴手禮，已有百年歷史。豆干香脆可口，油飯香Q軟嫩，是許多遊客必買的特產。大溪老街上有許多豆干店家，每家都有獨特風味。推薦親自造訪，品嚐最道地的滋味。",
      },
      {
        icon: "🍬",
        title: "龍潭花生糖",
        description: "傳統花生糖，甜而不膩。龍情花生糖是排隊名店，必買伴手禮。",
        details: "龍潭花生糖是傳統美食，甜而不膩，香脆可口。龍情花生糖是最著名的排隊名店，每天都吸引大量遊客購買。這是來桃園必買的伴手禮，也是送禮的最佳選擇。",
      },
      {
        icon: "🍰",
        title: "毛毛蟲麵包與蛋糕",
        description: "金時代專業烘焙的毛毛蟲麵包是傳說級秒殺商品。佳樂精緻蛋糕也是人氣推薦。",
        details: "金時代專業烘焙的毛毛蟲麵包是傳說級秒殺商品，每次推出都被搶購一空。佳樂精緻蛋糕也是人氣推薦，特別是波士頓派。這些烘焙美食是桃園美食的代表，值得一試。",
      },
    ],
  },
  Thursday: {
    title: "🎭 桃園哪裡玩",
    subtitle: "親子景點、文化展演",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/jT5tVBUexxpm_6b011666.jpg",
    content: [
      {
        icon: "🎡",
        title: "特色公園與遊戲場",
        description: "八德楓樹腳公園 16 公尺長頸鹿遊戲塔、中壢光明公園、龍潭運動公園等 7 大旗艦公園。",
        details: "桃園擁有許多特色公園，其中八德楓樹腳公園的 16 公尺長頸鹿遊戲塔是最受歡迎的。中壢光明公園、龍潭運動公園等也各具特色。這些公園都是親子同樂的好地方，設施完善、環境優美。",
      },
      {
        icon: "🌊",
        title: "草漯沙丘與濱海景點",
        description: "全國第一座沙丘地質公園，8.1 公里綿延沙丘，台版撒哈拉沙漠。永安漁港、竹圍漁港海邊風景。",
        details: "草漯沙丘是全國第一座沙丘地質公園，8.1 公里綿延沙丘，被譽為台版撒哈拉沙漠。永安漁港、竹圍漁港的海邊風景也很優美。這些景點都是拍照打卡的熱門地點，推薦週末造訪。",
      },
      {
        icon: "🎨",
        title: "文化場館與展演",
        description: "桃園客家文化館、原住民主題公園、各區文化中心，全年不斷的藝文活動。",
        details: "桃園擁有豐富的文化設施，包括桃園客家文化館、原住民主題公園、各區文化中心等。全年舉辦各種藝文活動，展示桃園深厚的文化底蘊。這些場館都免費或低價開放，是認識桃園文化的最佳去處。",
      },
    ],
  },
  Friday: {
    title: "🎊 本週精選",
    subtitle: "週末必玩推薦",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/0qEucKnZ1U2G_6504c98c.jpg",
    content: [
      {
        icon: "🌸",
        title: "2026 桃園燈會",
        description: "飛馬耀桃園主題燈會，璀璨燈飾照亮夜空。",
        details: "2026 桃園燈會以『飛馬耀桃園』為主題，展示璀璨的燈飾藝術。活動地點在桃園市政府廣場及周邊區域，展期為 2 月至 3 月。每晚 6 點至 10 點開放參觀，免費入場。現場還有美食攤位、文創商品展售，是全家同樂的好去處。",
        location: "桃園市政府廣場",
        date: "2 月至 3 月",
        time: "每晚 6 點至 10 點",
        source: "官方網站",
        sourceUrl: "https://2026taoyuanlanternfestival.tycg.tw/",
        sourceLabel: "資訊來源：2026 桃園燈會官網",
      },
      {
        icon: "🌻",
        title: "龍潭魯冰花季",
        description: "冬季限定美景，金黃魯冰花盛開。",
        details: "龍潭魯冰花季是冬季限定的自然美景。每年 12 月至 1 月，龍潭鄉的田間盛開金黃的魯冰花，吸引遊客前往拍照打卡。推薦在清晨或傍晚時分造訪，光線最美。周邊還有客家美食、茶館等，可以享受在地文化。",
        location: "龍潭鄉田間",
        date: "12 月至 1 月",
        time: "全天開放",
        source: "官方網站",
        sourceUrl: "https://travel.tycg.gov.tw/zh-tw/event/calendar/",
        sourceLabel: "資訊來源：桃園觀光導覽網",
      },
      {
        icon: "🎪",
        title: "蘆竹炫 YA 農遊季",
        description: "親子農業體驗，採果、DIY、美食一次滿足。",
        details: "蘆竹炫 YA 農遊季是親子同樂的農業體驗活動。遊客可以參與採果體驗、農業 DIY 工坊、品嚐在地美食等活動。活動期間不定期舉辦，建議事先查詢官方資訊。適合全家大小，是認識在地農業、享受田園樂趣的好機會。",
        location: "蘆竹鄉農業區",
        date: "不定期舉辦",
        source: "官方網站",
        sourceUrl: "https://travel.tycg.gov.tw/zh-tw/event/calendar/",
        sourceLabel: "資訊來源：桃園觀光導覽網",
        time: "依活動公告",
      },
    ],
  },
};

const TAOYUAN_REGIONS = [
  { name: "桃園區", population: "40 萬+", feature: "市政中心、商業樞紐", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/02_taoyuan_center_63e177ba.jpg" },
  { name: "中壢區", population: "40 萬+", feature: "交通樞紐、大學城", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/03_zhongyuan_university_f5fa6ba5.jpg" },
  { name: "大園區", population: "12 萬+", feature: "機場所在、航空城核心", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/01_dayuan_airport_086501f0.jpg" },
  { name: "大溪區", population: "8 萬+", feature: "古蹟豐富、文化底蘊", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/04_daxi_oldstreet_59a5ff70.jpg" },
  { name: "觀音區", population: "8 萬+", feature: "客家村、海邊景點", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/05_guanyin_windmill_0ffd9519.jpg" },
  { name: "龍潭區", population: "16 萬+", feature: "客家第一庄、文化深厚", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/06_longtan_flowers_8f1f377a.jpg" },
  { name: "龜山區", population: "20 萬+", feature: "教育重鎮、大學集中" },
  { name: "蘆竹區", population: "15 萬+", feature: "機場捷運、逆勢上漲" },
  { name: "平鎮區", population: "20 萬+", feature: "客家重鎮、工業發達" },
  { name: "八德區", population: "18 萬+", feature: "工業發達、發展迅速" },
  { name: "楊梅區", population: "18 萬+", feature: "客家文化、農業發達" },
  { name: "新屋區", population: "10 萬+", feature: "客家村、海邊景點" },
  { name: "復興區", population: "1 萬+", feature: "泰雅族原住民、山林資源" },
];

const PARKS = [
  { name: "八德楓樹腳公園", location: "八德區", feature: "16 公尺長頸鹿遊戲塔", icon: "🦒", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/park_01_cfadf576.jpg", details: "八德楓樹腳公園是桃園最受歡迎的親子公園之一。公園不僅有了不起的 16 公尺長頸鹿遊戲塔，還有許多其他特色遊戲設施。是家幫子女周末出遊的完美選擇。全年免費開放，靜住在八德區民生路一段。", address: "桃園市八德區民生路一段 50 號" },
  { name: "中壢光明公園", location: "中壢區", feature: "特色遊戲場、親子設施", icon: "🎡", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/park_02_e1f64554.jpg", details: "中壢光明公園是中壢區的海洋主顎公園，公園內有多項特色遊戲設施、光明沙坑、光明沙灘等。是中壢地區最大的公園，靜住在中壢區中山路二段。", address: "桃園市中壢區中山路二段 1 號" },
  { name: "龍潭運動公園", location: "龍潭區", feature: "冒險挑戰區、運動設施", icon: "⛹️", details: "龍潭運動公園是龍潭區最大的運動公園，內有多項運動設施、冒險挑戰區、沙坑等。是上下玩的好地方。靜住在龍潭區中山路一段。", address: "桃園市龍潭區中山路一段" },
  { name: "平鎮金色腳印公園", location: "平鎮區", feature: "親子遊戲場、沙坑", icon: "👣", details: "平鎮金色腳印公園是平鎮區的特色公園，以金色腳印為主顎。公園內有親子遊戲場、沙坑、沙灘等設施。是家幫子女的理想去處。", address: "桃園市平鎮區中山路二段" },
  { name: "新屋蛇頸溪濱河公園", location: "新屋區", feature: "自然生態、濱河步道", icon: "🌿", details: "新屋蛇頸溪濱河公園是新屋區最美的濱河公園。公園不僅有濱河步道、沙灘、沙坑等設施，還是許多自然生物的樊息地。是一個很好的自然教室。", address: "桃園市新屋區中山路二段" },
  { name: "觀音濱海遊憩區", location: "觀音區", feature: "風車、沙灘、海景", icon: "🌊", details: "觀音濱海遊憩區是觀音區最受歡迎的海漏景點。季節不同時有不同的風車、沙灘、海景可以欣賞。是拍照打卡的熱門景點。", address: "桃園市觀音區海漏路" },
  { name: "大溪河濱公園", location: "大溪區", feature: "河景、自行車道", icon: "🚴", details: "大溪河濱公園是大溪區最海漏的公園。公園沙坑河景优美，自行車道平坦安全。是家幫騎車、散步的好地方。", address: "桃園市大溪區和平路" },
  { name: "龜山陶瓷博物館公園", location: "龜山區", feature: "文化特色、藝術展示", icon: "🎨", details: "龜山陶瓷博物館公園是龜山區的文化公園。公園內有陶瓷博物館、藝術展示、文化活動等。是一個很好的文化教室。", address: "桃園市龜山區文化路" },
  { name: "楊梅富岡公園", location: "楊梅區", feature: "客家文化、特色設施", icon: "🏮", details: "楊梅富岡公園是楊梅區的特色公園。公園內有客家文化沙坑、特色遊戲設施、客家美食等。是了解客家文化的好地方。", address: "桃園市楊梅區富岡路" },
  { name: "蘆竹南坑公園", location: "蘆竹區", feature: "親子遊樂、運動設施", icon: "🎪", details: "蘆竹南坑公園是蘆竹區的親子公園。公園內有多項親子遊樂設施、運動設施、沙坑等。是家幫子女周末出遊的好選擇。", address: "桃園市蘆竹區南崁路" },
];

const CHILDCARE_CENTERS = [
  { name: "桃園市立親子館", location: "桃園區", address: "桃園市桃園區三民路一段123號", feature: "0-6歲親子活動、課程", phone: "03-3322528", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/childcare_center_01_9e8c9a14.jpg", details: "桃園市立親子館是桃園最大的親子館，提供 0-6 歲幼兒的親子活動、課程、遊戲設施。館內有寶寶沙坑區、親子互動區、教室等多項設施。不僅免費，需要事先預約。是新手父媽的好幫手。", website: "https://babycare.tycg.gov.tw/" },
  { name: "中壢親子館", location: "中壢區", address: "桃園市中壢區五權路100號", feature: "親子互動、遊戲區", phone: "03-4256969", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/childcare_center_02_e19c2f77.jpg", details: "中壢親子館位於中壢區，是中壢地區的親子館。館內有寶寶沙坑區、親子互動區、遊戲設施。免費開放，需要事先預約。", website: "https://family.safe.org.tw/7/wuchuan/service_results/" },
  { name: "龍潭親子館", location: "龍潭區", address: "龍潭區中興路700號3樓", feature: "親子課程、活動", phone: "03-4793070分機1200", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/childcare_center_03_0a45fa3b.jpg", details: "龍潭親子館是龍潭區的親子館。館內有多項親子課程、活動、遊戲設施。免費開放，需要事先預約。", website: "https://www.longtan.tycg.gov.tw/" },
  { name: "大溪親子館", location: "大溪區", address: "桃園市大溪區和平路", feature: "親子互動、遊戲", phone: "03-3885555", details: "大溪親子館是大溪區的親子館。館內有親子互動區、遊戲設施。免費開放，需要事先預約。", website: "https://babycare.tycg.gov.tw/" },
  { name: "平鎮親子館", location: "平鎮區", address: "桃園市平鎮區中山路", feature: "親子活動、課程", phone: "03-4506666", details: "平鎮親子館是平鎮區的親子館。館內有親子活動、課程、遊戲設施。免費開放，需要事先預約。", website: "https://babycare.tycg.gov.tw/" },
  { name: "蘆竹親子館", location: "蘆竹區", address: "桃園市蘆竹區南崁路", feature: "親子遊戲、互動", phone: "03-3114444", details: "蘆竹親子館是蘆竹區的親子館。館內有親子遊戲、互動、遊戲設施。免費開放，需要事先預約。", website: "https://babycare.tycg.gov.tw/" },
  { name: "楊梅親子館", location: "楊梅區", address: "桃園市楊梅區楊梅路", feature: "親子課程、活動", phone: "03-4752222", details: "楊梅親子館是楊梅區的親子館。館內有親子課程、活動、遊戲設施。免費開放，需要事先預約。", website: "https://babycare.tycg.gov.tw/" },
  { name: "八德親子館", location: "八德區", address: "桃園市八德區建國路", feature: "親子互動、遊戲區", phone: "03-3633333", details: "八德親子館是八德區的親子館。館內有親子互動、遊戲設施。免費開放，需要事先預約。", website: "https://babycare.tycg.gov.tw/" },
  { name: "新屋親子館", location: "新屋區", address: "桃園市新屋區中山路", feature: "親子活動、課程", phone: "03-4771111", details: "新屋親子館是新屋區的親子館。館內有親子活動、課程、遊戲設施。免費開放，需要事先預約。", website: "https://babycare.tycg.gov.tw/" },
];

const LIBRARIES = [
  { name: "桃園市立圖書館新總館", location: "桃園區", address: "桃園市桃園區南平路345號", feature: "新建築、多功能空間", hours: "週二-週日 09:00-21:00", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/library_01_44e1a758.jpg", details: "桃園市立圖書館新總館是桃園最新的圖書館。館內有多項功能空間，包括寶寶閱讀區、自習室、演講室、上網區等。是家幫子女最佳的學習去處。", website: "https://lifetree.typl.gov.tw/" },
  { name: "中壢分館", location: "中壢區", address: "桃園市中壢區中美路76號", feature: "親子閱讀區、自習室", hours: "週二-週六 08:30-21:00", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/library_02_60957248.jpg", details: "中壢分館是中壢地區最大的圖書館。館內有親子閱讀區、自習室、简介區等。是家幫子女的好去處。", website: "https://www.typl.gov.tw/zh-tw/About/Introduce/044" },
  { name: "龍潭分館", location: "龍潭區", address: "桃園市龍潭區", feature: "客家文化特色", hours: "週二-週日 09:00-17:00", details: "龍潭分館是龍潭地區的圖書館，具有客家文化特色。館內有客家文化书籍、客家事物展示、客家文化活動等。", website: "https://www.typl.gov.tw/zh-tw/About/Introduce" },
  { name: "大溪分館", location: "大溪區", address: "桃園市大溪區和平路", feature: "古蹟建築、文化特色", hours: "週二-週日 09:00-17:00", details: "大溪分館是大溪地區的圖書館，位於古蹟建築內。館內有古蹟文化书籍、古蹟事物展示、文化活動等。是了解大溪古蹟文化的好去處。", website: "https://www.typl.gov.tw/zh-tw/About/Introduce" },
  { name: "平鎮分館", location: "平鎮區", address: "桃園市平鎮區中山路", feature: "親子互動區", hours: "週二-週日 09:00-21:00", details: "平鎮分館是平鎮地區的圖書館。館內有親子互動區、自習室、简介區等。是家幫子女的好去處。", website: "https://www.typl.gov.tw/zh-tw/About/Introduce" },
  { name: "蘆竹分館", location: "蘆竹區", address: "桃園市蘆竹區南崁路", feature: "機場捷運旁、便利", hours: "週二-週日 09:00-21:00", details: "蘆竹分館是蘆竹地區的圖書館，位於機場捷運旁。館內有自習室、親子互動區、简介區等。是上下玩的好去處。", website: "https://www.typl.gov.tw/zh-tw/About/Introduce" },
  { name: "楊梅分館", location: "楊梅區", address: "桃園市楊梅區楊梅路", feature: "客家文化展示", hours: "週二-週日 09:00-17:00", details: "楊梅分館是楊梅地區的圖書館，具有客家文化特色。館內有客家文化书籍、客家事物展示、客家文化活動等。", website: "https://www.typl.gov.tw/zh-tw/About/Introduce" },
  { name: "八德分館", location: "八德區", address: "桃園市八德區建國路", feature: "親子閱讀區", hours: "週二-週日 09:00-21:00", details: "八德分館是八德地區的圖書館。館內有親子閱讀區、自習室、简介區等。是家幫子女的好去處。", website: "https://www.typl.gov.tw/zh-tw/About/Introduce" },
  { name: "新屋分館", location: "新屋區", address: "桃園市新屋區中山路", feature: "社區圖書館", hours: "週二-週日 09:00-17:00", details: "新屋分館是新屋地區的社區圖書館。館內有自習室、简介區、社區活動等。", website: "https://www.typl.gov.tw/zh-tw/About/Introduce" },
];

const CULTURAL_ATTRACTIONS = [
  { name: "桃園市客家文化館", location: "龍潭區", address: "桃園市龍潭區中正路三林段500號", feature: "客家文化展示、體驗活動", phone: "03-4096682#5020~5024", hours: "週二-週日 09:00-17:00", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/cultural_01.jpg", details: "桃園市客家文化館是展示客家文化的重要園區。新穎時尚的建築外觀、綠意盎然的園區景緻。館內有客家主題展館、文化體驗活動、定期舉辦文化活動。免費參觀。", website: "https://www.hakka.tycg.gov.tw/" },
  { name: "馬祖新村眷村文創園區", location: "中壢區", address: "桃園市中壢區龍吉二街155號", feature: "眷村文化、文創展示", phone: "03-2841866", hours: "週二-週日 09:00-21:00（室內至18:00）", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/cultural_02.jpg", details: "馬祖新村建於1957年，原為駐守馬祖列島的陸軍第84師眷屬居住區。擁有『星星滿天飛』的美名，集結眾多體階軍官家庭。美式花園洋房風格建築、眷村文化保存園區、文創展示與活動空間。免費參觀。", website: "https://matsu.tyccc.gov.tw/building" },
  { name: "中原文創園區", location: "中壢區", address: "桃園市中壢區", feature: "創意展演、市集、展覽", hours: "依活動時間", details: "前身為國防部軍營，現為創意展演、市集、展覽場地。定期舉辦文創活動、藝術展覽、音樂演出。免費參觀。", website: "https://cycc.org.tw/" },
  { name: "KIRI 國際原住民族文創園區", location: "桃園區", address: "機場捷運A17站對面", feature: "原民文化、文創、美食", details: "以原民文化為基底的創意園區。展示原住民文化、創意商品、美食餐飲。周邊有陽光劇場、橫山書法公園、華泰名品城。", website: "https://communityspace.com.tw/" },
  { name: "虎頭山創新園區", location: "桃園區", address: "桃園市虎頭山腳下", feature: "新創產業、創新基地", details: "面積4.7公頃的新創產業園區。引進新創企業進駐，提供創新創業的支持與資源。", website: "https://tyfdc.org.tw/" },
  { name: "大溪老街", location: "大溪區", address: "桃園市大溪區", feature: "古蹟建築、傳統商業街", hours: "24小時開放", details: "大溪老街是桃園最著名的古蹟文化街區。保留了許多日治時期的建築，是了解桃園歷史文化的最佳去處。街上有許多傳統商店、美食、伴手禮。", website: "https://travel.tycg.gov.tw/" },
  { name: "桃園藝文廣場", location: "桃園區", feature: "藝文展演、文化活動", details: "桃園市重要的藝文表演場所。定期舉辦各類藝文活動、音樂演出、文化展覽。是桃園文化生活的重要場所。", website: "https://travel.tycg.gov.tw/zh-tw/travel/attraction/511" },
];

const CINEMAS = [
  { name: "桃園藝術電影院", location: "桃園區", feature: "政府建立的免費電影院", details: "桃園市政府建立的免費電影院，提供市民免費觀看電影的場所。定期放映各類型電影，是桃園重要的文化設施。", website: "https://www.taoyuan.arts-cinema.com/" },
  { name: "中壢光影電影館", location: "中壢區", feature: "電影放映、文藝電影", details: "中壢地區的電影院，提供各類型電影放映服務。", website: "https://www.taoyuan.arts-cinema.com/" },
];

const WOMENS_CENTERS = [
  { name: "桃園市婦女館", location: "桃園區", address: "桃園市桃園區延平路", phone: "03-3627-555", feature: "免費課程、體適能中心", hours: "依課程時間", details: "提供免費課程、體適能健身中心、多元婦女福利服務。每期雙月課程表。", website: "http://www.womencenter.com.tw/" },
  { name: "桃園市北區婦女中心", location: "桃園區", feature: "免費課程、講座、展覽", details: "提供特殊境遇家庭服務、福利諮詢、婦女學苑、女性講座、性別議題展覽、女性友善空間租借。114年4-6月免費活動。", website: "https://www.taoyuanwdc.org/", facebook: "https://www.facebook.com/taoyuanwdc/" },
  { name: "桃園市南區婦女中心", location: "平鎮區", feature: "免費課程、講座、展覽", details: "提供類似北區婦女中心的服務。114年4-6月免費活動。", website: "https://www.taoyuansdwc.org/", facebook: "https://www.facebook.com/taoyuansdwc/" },
  { name: "桃園市婦女培力中心", location: "桃園市", feature: "免費活動課程", details: "提供免費活動課程。課程內容包括走訪在地、自我成長、藝文共學、健身課程等。", website: "https://www.facebook.com/tytaosis/" },
];

const FEATURED_EVENTS = [
  {
    id: 1,
    icon: "🌸",
    title: "2026 桃園燈會",
    subtitle: "飛馬耀桃園主題燈會",
    description: "璀璨燈飾照亮夜空，全家同樂的好去處",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/0qEucKnZ1U2G_6504c98c.jpg",
    date: "2 月至 3 月",
    time: "每晚 6 點至 10 點",
    location: "桃園市政府廣場",
    details: "2026 桃園燈會以『飛馬耀桃園』為主題，展示璀璨的燈飾藝術。活動地點在桃園市政府廣場及周邊區域，展期為 2 月至 3 月。每晚 6 點至 10 點開放參觀，免費入場。現場還有美食攤位、文創商品展售，是全家同樂的好去處。",
    sourceUrl: "https://2026taoyuanlanternfestival.tycg.tw/",
    sourceLabel: "資訊來源：2026 桃園燈會官網",
    comments: [
      { id: 1, name: "小美", text: "去年的燈會超美的！今年一定要帶家人去看 ✨", timestamp: "2026-03-19 14:30", likes: 5 },
      { id: 2, name: "王先生", text: "免費入場真的很佛心，推薦大家來桃園玩！", timestamp: "2026-03-18 10:15", likes: 3 },
    ],
  },
  {
    id: 2,
    icon: "🎨",
    title: "桃園市客家文化館",
    subtitle: "客家文化展示與體驗",
    description: "認識客家文化，體驗在地特色",
    date: "週二-週日",
    time: "09:00-17:00",
    location: "龍潭區",
    details: "桃園市客家文化館是展示客家文化的重要園區。新穎時尚的建築外觀、綠意盎然的園區景緻。館內有客家主題展館、文化體驗活動、定期舉辦文化活動。免費參觀。",
    sourceUrl: "https://www.hakka.tycg.gov.tw/",
    sourceLabel: "資訊來源：客家文化館官網",
    comments: [
      { id: 1, name: "林媽媽", text: "很適合帶小孩來認識客家文化，工作人員也很親切！", timestamp: "2026-03-17 15:45", likes: 2 },
    ],
  },
  {
    id: 3,
    icon: "🎦",
    title: "桃園藝術電影院",
    subtitle: "免費電影放映",
    description: "政府建立的免費電影院，定期放映各類型電影",
    date: "依放映檔期",
    location: "桃園區",
    details: "桃園市政府建立的免費電影院，提供市民免費觀看電影的場所。定期放映各類型電影，是桃園重要的文化設施。",
    sourceUrl: "https://www.taoyuan.arts-cinema.com/",
    sourceLabel: "資訊來源：藝術電影院官網",
    comments: [
      { id: 1, name: "電影迷", text: "免費看電影根本佛心！片單都很不錯 🎥", timestamp: "2026-03-16 19:20", likes: 4 },
    ],
  },
];

export default function Home() {
  // Auth is not required for this page - visitors comment anonymously
  const { identity, isLoaded, saveIdentity } = useVisitorIdentity();

  const [activeTab, setActiveTab] = useState("home");
  const [message, setMessage] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedPark, setSelectedPark] = useState<any>(null);
  const [selectedCenter, setSelectedCenter] = useState<any>(null);
  const [selectedLibrary, setSelectedLibrary] = useState<any>(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [showEventModal, setShowEventModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  // Identity setup dialog state
  const [showIdentitySetup, setShowIdentitySetup] = useState(false);
  const [setupName, setSetupName] = useState("");
  const [setupAvatar, setSetupAvatar] = useState("🐱");
  const [pendingComment, setPendingComment] = useState("");
  // Liked comment IDs for current visitor
  const [likedCommentIds, setLikedCommentIds] = useState<Set<number>>(new Set());

  const AVATAR_OPTIONS = ["🐱", "🐶", "🐻", "🦊", "🐼", "🐨", "🐸", "🦁", "🐯", "🐺", "🐹", "🐰", "🦄", "🐧", "🦋", "🌸", "⭐", "🌈"];

  // tRPC queries and mutations
  const currentEventId = FEATURED_EVENTS[currentEventIndex]?.id ?? 1;
  const commentsQuery = trpc.comments.list.useQuery(
    { eventId: currentEventId },
    { enabled: showEventModal }
  );
  const createCommentMutation = trpc.comments.create.useMutation({
    onSuccess: () => {
      commentsQuery.refetch();
      setCommentText("");
      setPendingComment("");
      toast.success("評論提交成功！感謝您的分享 💚");
    },
    onError: () => toast.error("提交失敗，請稍後再試"),
  });
  const toggleLikeMutation = trpc.comments.toggleLike.useMutation({
    onSuccess: (data, variables) => {
      commentsQuery.refetch();
      setLikedCommentIds(prev => {
        const next = new Set(prev);
        if (data.liked) next.add(variables.commentId);
        else next.delete(variables.commentId);
        return next;
      });
    },
  });
  const myLikesQuery = trpc.comments.myLikes.useQuery(
    { eventId: currentEventId, visitorToken: identity?.token ?? "" },
    { enabled: showEventModal && !!identity?.token }
  );

  useEffect(() => {
    if (myLikesQuery.data) {
      setLikedCommentIds(new Set(myLikesQuery.data));
    }
  }, [myLikesQuery.data]);
  
  const today = new Date();
  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today.getDay()];
  const todayContent = DAILY_CONTENT[dayName as keyof typeof DAILY_CONTENT] || DAILY_CONTENT.Monday;

  // 自動輪播邏輯
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % FEATURED_EVENTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevEvent = () => {
    setCurrentEventIndex((prev) => (prev - 1 + FEATURED_EVENTS.length) % FEATURED_EVENTS.length);
  };

  const handleNextEvent = () => {
    setCurrentEventIndex((prev) => (prev + 1) % FEATURED_EVENTS.length);
  };

  const handleEventClick = () => {
    setShowEventModal(true);
  };

  const handleCloseModal = () => {
    setShowEventModal(false);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error("請填寫評論內容");
      return;
    }
    // If visitor has no identity yet, show setup dialog
    if (!identity) {
      setPendingComment(commentText);
      setShowIdentitySetup(true);
      return;
    }
    createCommentMutation.mutate({
      eventId: currentEventId,
      eventTitle: currentEvent?.title ?? "",
      visitorName: identity.name,
      visitorAvatar: identity.avatar,
      visitorToken: identity.token,
      content: commentText,
    });
  };

  const handleIdentitySetupComplete = () => {
    if (!setupName.trim()) {
      toast.error("請輸入您的暱稱");
      return;
    }
    const newIdentity = saveIdentity(setupName, setupAvatar);
    setShowIdentitySetup(false);
    // Submit the pending comment if any
    if (pendingComment.trim()) {
      createCommentMutation.mutate({
        eventId: currentEventId,
        eventTitle: currentEvent?.title ?? "",
        visitorName: newIdentity.name,
        visitorAvatar: newIdentity.avatar,
        visitorToken: newIdentity.token,
        content: pendingComment,
      });
    }
  };

  const handleLikeComment = (commentId: number) => {
    if (!identity) {
      toast.error("請先設定您的暱稱才能按讚");
      setShowIdentitySetup(true);
      return;
    }
    toggleLikeMutation.mutate({
      commentId,
      visitorToken: identity.token,
    });
  };

  const currentEvent = FEATURED_EVENTS[currentEventIndex];

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("請輸入留言");
      return;
    }
    toast.success("感謝您的留言！正在跳轉到官方 LINE...");
    setTimeout(() => {
      window.location.href = "https://page.line.me/768fuhqm";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0faf8] via-white to-[#f5f9f8]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-[#d4ede8]">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2eb89f] to-[#1f8b7f] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                DE
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] bg-clip-text text-transparent">桃園報馬仔</h1>
                  <span className="text-xs font-medium text-gray-500">/ 夢想不動產</span>
                </div>
                <p className="text-xs text-gray-500">來桃園找個家</p>
              </div>
            </div>
            <div className="flex gap-2 text-sm">
              <a href="https://www.dreamestate.com.tw/" target="_blank" className="px-4 py-2 text-[#2eb89f] hover:bg-[#f0faf8] rounded-lg transition duration-200 font-medium">官網</a>
              <a href="https://www.facebook.com/tthedreamestate/" target="_blank" className="px-4 py-2 text-[#2eb89f] hover:bg-[#f0faf8] rounded-lg transition duration-200 font-medium">粉專</a>
              <a href="https://page.line.me/768fuhqm" target="_blank" className="px-4 py-2 bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white rounded-lg transition duration-200 hover:shadow-lg font-medium">加 LINE</a>
            </div>
          </div>

          <nav className="flex gap-2 text-sm font-medium flex-wrap">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === "home"
                  ? "bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#f0faf8]"
              }`}
            >
              🏠 首頁
            </button>
            <button
              onClick={() => setActiveTab("taoyuan")}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === "taoyuan"
                  ? "bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#f0faf8]"
              }`}
            >
              📍 認識桃園
            </button>
            <button
              onClick={() => setActiveTab("parks")}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === "parks"
                  ? "bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#f0faf8]"
              }`}
            >
              🎡 特色公園
            </button>
            <button
              onClick={() => setActiveTab("childcare")}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === "childcare"
                  ? "bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#f0faf8]"
              }`}
            >
              👶 親子館
            </button>
            <button
              onClick={() => setActiveTab("libraries")}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === "libraries"
                  ? "bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#f0faf8]"
              }`}
            >
              📚 圖書館
            </button>
            <button
              onClick={() => setActiveTab("arts")}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === "arts"
                  ? "bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#f0faf8]"
              }`}
            >
              🎨 藝文活動
            </button>
            <button
              onClick={() => setActiveTab("transportation")}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === "transportation"
                  ? "bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#f0faf8]"
              }`}
            >
              🚆 交通運輸
            </button>
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === "daily"
                  ? "bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#f0faf8]"
              }`}
            >
              📰 每日報馬仔
            </button>
            <a
              href="/partner-shops"
              className="px-4 py-2 rounded-lg transition duration-200 text-gray-600 hover:bg-[#f0faf8]"
            >
              🏪 特約商店
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {/* Home Tab - Hero + Daily Content */}
        {activeTab === "home" && (
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="mb-16">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96 bg-cover bg-center group" style={{backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/hero_family_taoyuan-G2b6A9ExpvUK8xzTepaaNg.webp)`}}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10 flex flex-col justify-end items-center text-center pb-8">
                  <h2 className="text-3xl font-bold text-white/80 mb-2 animate-fade-in">來桃園找個家</h2>
                  <p className="text-sm text-white/60">不只是房地產投資，更是一個充滿生活魅力的城市</p>
                </div>
              </div>
            </section>

            {/* Featured Selections */}
            <section className="bg-gradient-to-br from-white via-[#f0faf8] to-white rounded-2xl shadow-lg p-10 border border-[#e8f5f1]">
              <div className="mb-10">
                <h3 className="text-4xl font-bold bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] bg-clip-text text-transparent mb-3">✨ 本週精選</h3>
                <p className="text-gray-600 text-lg">發現桃園最美的風景、最好的生活</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {FEATURED_SELECTIONS.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 hover:scale-105 cursor-pointer h-64"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <div className="inline-block mb-2">
                        <span className="bg-[#2eb89f] text-white text-xs font-bold px-3 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:translate-y-[-4px] transition duration-300">
                        {item.title}
                      </h4>
                      <p className="text-white/90 text-sm line-clamp-2 group-hover:translate-y-[-2px] transition duration-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <p className="text-[#1f8b7f] font-bold text-lg mb-4">💚 想更深入了解桃園的美好嗎？</p>
                <a
                  href="https://page.line.me/768fuhqm"
                  target="_blank"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white font-bold rounded-lg hover:shadow-lg transition duration-300"
                >
                  加 LINE 探索更多
                </a>
              </div>
            </section>

            {/* Daily Content */}
            <section className="bg-white rounded-2xl shadow-lg p-10 border border-[#e8f5f1]">
              <div className="mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] bg-clip-text text-transparent mb-2">{todayContent.title}</h3>
                <p className="text-gray-600 text-lg">{todayContent.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {todayContent.content.map((item: any, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => item.details && setSelectedEvent(item)}
                    className={`bg-gradient-to-br from-[#f0faf8] to-white p-6 rounded-xl border border-[#e8f5f1] hover:shadow-lg transition duration-300 hover:translate-y-[-4px] ${item.details ? 'cursor-pointer' : ''}`}
                  >
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h4 className="text-lg font-bold text-[#1f8b7f] mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    {item.details && <p className="text-xs text-[#2eb89f] mt-3 font-medium">👉 點擊查看詳情</p>}
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className="relative rounded-2xl shadow-xl overflow-hidden text-white mb-12">
              <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/cta_section_image-hiRio8YopVSixjMJ48BGQB.webp)`}}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2eb89f]/80 to-[#1f8b7f]/70"></div>
              <div className="relative p-10">
              <h3 className="text-2xl font-bold mb-4">✨ 留言說旅遊，加 LINE 得優惠</h3>
              <p className="text-white/95 mb-6">留言「旅遊」，我們會提供兩天一日桃園遊玩資訊，還有獨家房源推薦！</p>
              
              <form onSubmit={handleComment} className="space-y-4">
                <Textarea
                  placeholder="留言說旅遊..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50 rounded-lg"
                />
                <button
                  type="submit"
                  className="w-full bg-white text-[#2eb89f] font-bold py-3 rounded-lg hover:bg-white/90 transition duration-200 flex items-center justify-center gap-2"
                >
                  提交留言 <ArrowRight size={20} />
                </button>
              </form>
              </div>
            </section>
          </div>
        )}

        {/* Taoyuan Tab */}
        {activeTab === "taoyuan" && (
          <div className="space-y-12">
            {/* Taoyuan Map Section */}
            <section className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#e8f5f1]">
              <div className="relative h-96 bg-cover bg-center" style={{backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/taoyuan_district_map-VtmL98corSPqBsrV8K7oqD.webp)`}}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/5"></div>
              </div>
            </section>

            {/* Taoyuan Regions with Images */}
            <section className="bg-white rounded-2xl shadow-lg p-10 border border-[#e8f5f1]">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] bg-clip-text text-transparent mb-8">🗺️ 認識 13 個行政區</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {TAOYUAN_REGIONS.map((region, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-[#e8f5f1] hover:shadow-lg transition duration-300 overflow-hidden">
                    {region.image && (
                      <div className="relative h-40 bg-cover bg-center" style={{backgroundImage: `url(${region.image})`}}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <h4 className="text-lg font-bold">{region.name}</h4>
                        </div>
                      </div>
                    )}
                    {!region.image && (
                      <div className="bg-gradient-to-br from-[#f0faf8] to-white p-4 border-b border-[#e8f5f1]">
                        <h4 className="text-lg font-bold text-[#1f8b7f]">{region.name}</h4>
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-2">人口：{region.population}</p>
                      <p className="text-sm text-[#2eb89f] font-medium">{region.feature}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Parks Tab */}
        {activeTab === "parks" && (
          <div className="space-y-12">
            <section className="bg-white rounded-2xl shadow-lg p-10 border border-[#e8f5f1]">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] bg-clip-text text-transparent mb-8">🎡 特色公園</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PARKS.map((park, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-[#e8f5f1] hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer" onClick={() => setSelectedPark(park)}>
                    {park.image && (
                      <div className="relative h-40 bg-cover bg-center" style={{backgroundImage: `url(${park.image})`}}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <h4 className="text-lg font-bold">{park.name}</h4>
                        </div>
                      </div>
                    )}
                    {!park.image && (
                      <div className="bg-gradient-to-br from-[#f0faf8] to-white p-4 border-b border-[#e8f5f1]">
                        <h4 className="text-lg font-bold text-[#1f8b7f]">{park.name}</h4>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{park.icon}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">📍 {park.location}</p>
                      <p className="text-sm text-[#2eb89f] font-medium mb-3">{park.feature}</p>
                      <button className="text-xs text-[#2eb89f] font-semibold hover:text-[#1f8b7f] transition">👉 點擊查看詳情</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Childcare Tab */}
        {activeTab === "childcare" && (
          <div className="space-y-12">
            <section className="bg-white rounded-2xl shadow-lg p-10 border border-[#e8f5f1]">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] bg-clip-text text-transparent mb-8">👶 親子館</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CHILDCARE_CENTERS.map((center, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-[#e8f5f1] hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer" onClick={() => setSelectedCenter(center)}>
                    {center.image && (
                      <div className="relative h-40 bg-cover bg-center" style={{backgroundImage: `url(${center.image})`}}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <h4 className="text-lg font-bold">{center.name}</h4>
                        </div>
                      </div>
                    )}
                    {!center.image && (
                      <div className="bg-gradient-to-br from-[#f0faf8] to-white p-4 border-b border-[#e8f5f1]">
                        <h4 className="text-lg font-bold text-[#1f8b7f]">{center.name}</h4>
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-1">📍 {center.location}</p>
                      <p className="text-xs text-gray-500 mb-2">{center.address}</p>
                      <p className="text-sm text-[#2eb89f] font-medium mb-2">{center.feature}</p>
                      <p className="text-xs text-gray-600 mb-3">📞 {center.phone}</p>
                      <button className="text-xs text-[#2eb89f] font-semibold hover:text-[#1f8b7f] transition">👉 點擊查看詳情</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Libraries Tab */}
        {activeTab === "libraries" && (
          <div className="space-y-12">
            <section className="bg-white rounded-2xl shadow-lg p-10 border border-[#e8f5f1]">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] bg-clip-text text-transparent mb-8">📚 圖書館</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {LIBRARIES.map((lib, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-[#e8f5f1] hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer" onClick={() => setSelectedLibrary(lib)}>
                    {lib.image && (
                      <div className="relative h-40 bg-cover bg-center" style={{backgroundImage: `url(${lib.image})`}}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <h4 className="text-lg font-bold">{lib.name}</h4>
                        </div>
                      </div>
                    )}
                    {!lib.image && (
                      <div className="bg-gradient-to-br from-[#f0faf8] to-white p-4 border-b border-[#e8f5f1]">
                        <h4 className="text-lg font-bold text-[#1f8b7f]">{lib.name}</h4>
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-1">📍 {lib.location}</p>
                      <p className="text-xs text-gray-500 mb-2">{lib.address}</p>
                      <p className="text-sm text-[#2eb89f] font-medium mb-2">{lib.feature}</p>
                      <p className="text-xs text-gray-600 mb-3">⏰ {lib.hours}</p>
                      <button className="text-xs text-[#2eb89f] font-semibold hover:text-[#1f8b7f] transition">👉 點擊查看詳情</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Arts & Culture Tab (Merged) */}
        {activeTab === "arts" && (
          <div className="space-y-12">
            {/* Featured Events Carousel */}
            <section className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#e8f5f1]">
              <div className="relative h-80 bg-cover bg-center cursor-pointer group" style={{backgroundImage: `url(${currentEvent.image || 'https://d2xsxph8kpxj0f.cloudfront.net/310519663233628580/JXigwX25GvVGNV8cNtEmFs/0qEucKnZ1U2G_6504c98c.jpg'})`}} onClick={handleEventClick}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 group-hover:from-black/50 group-hover:to-black/20 transition duration-300"></div>
                
                {/* Carousel Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-8">
                  <div className="text-white">
                    <div className="text-5xl mb-3">{currentEvent.icon}</div>
                    <h2 className="text-4xl font-bold mb-2">{currentEvent.title}</h2>
                    <p className="text-xl text-white/90 mb-4">{currentEvent.subtitle}</p>
                    <p className="text-white/80 text-lg max-w-2xl">{currentEvent.description}</p>
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handlePrevEvent}
                      className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition duration-200 backdrop-blur-sm"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    
                    {/* Indicators */}
                    <div className="flex gap-2">
                      {FEATURED_EVENTS.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentEventIndex(idx)}
                          className={`h-2 rounded-full transition duration-300 ${
                            idx === currentEventIndex ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <button
                      onClick={handleNextEvent}
                      className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition duration-200 backdrop-blur-sm"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Event Info Bar */}
              <div className="bg-gradient-to-r from-[#2eb89f]/10 to-[#1f8b7f]/10 p-6 border-t border-[#e8f5f1]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">📅 活動時間</p>
                    <p className="font-bold text-[#1f8b7f]">{currentEvent.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">⏰ 開放時間</p>
                    <p className="font-bold text-[#1f8b7f]">{currentEvent.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">📍 地點</p>
                    <p className="font-bold text-[#1f8b7f]">{currentEvent.location}</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleEventClick}
                    className="px-6 py-2 bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white rounded-lg font-semibold hover:shadow-lg transition duration-300 hover:scale-105"
                  >
                    👉 查看詳情
                  </button>
                </div>
              </div>
            </section>

            {/* Cultural Attractions */}
            <section className="bg-white rounded-2xl shadow-lg p-10 border border-[#e8f5f1]">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] bg-clip-text text-transparent mb-8">🎨 文創園區</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CULTURAL_ATTRACTIONS.map((attraction: any, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedEvent(attraction)}
                    className="bg-gradient-to-br from-[#f0faf8] to-white p-6 rounded-xl border border-[#e8f5f1] hover:shadow-lg transition duration-300 hover:translate-y-[-4px] cursor-pointer"
                  >
                    <h4 className="text-lg font-bold text-[#1f8b7f] mb-2">{attraction.name}</h4>
                    <p className="text-gray-600 text-sm mb-2">📍 {attraction.location}</p>
                    <p className="text-gray-600 text-sm mb-3">{attraction.feature}</p>
                    {attraction.hours && <p className="text-xs text-gray-500 mb-2">⏰ {attraction.hours}</p>}
                    <p className="text-xs text-[#2eb89f] font-medium">👉 點擊查看詳情</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Cinemas */}
            <section className="bg-white rounded-2xl shadow-lg p-10 border border-[#e8f5f1]">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] bg-clip-text text-transparent mb-8">🎬 電影院</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CINEMAS.map((cinema: any, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedEvent(cinema)}
                    className="bg-gradient-to-br from-[#f0faf8] to-white p-6 rounded-xl border border-[#e8f5f1] hover:shadow-lg transition duration-300 hover:translate-y-[-4px] cursor-pointer"
                  >
                    <h4 className="text-lg font-bold text-[#1f8b7f] mb-2">{cinema.name}</h4>
                    <p className="text-gray-600 text-sm mb-2">📍 {cinema.location}</p>
                    <p className="text-gray-600 text-sm mb-2">{cinema.feature}</p>
                    {cinema.hours && <p className="text-xs text-gray-500 mb-2">⏰ {cinema.hours}</p>}
                    <p className="text-xs text-[#2eb89f] font-medium">👉 點擊查看詳情</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Women's Centers */}
            <section className="bg-white rounded-2xl shadow-lg p-10 border border-[#e8f5f1]">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] bg-clip-text text-transparent mb-8">👩 婦女中心 & 免費課程</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {WOMENS_CENTERS.map((center: any, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedEvent(center)}
                    className="bg-gradient-to-br from-[#f0faf8] to-white p-6 rounded-xl border border-[#e8f5f1] hover:shadow-lg transition duration-300 hover:translate-y-[-4px] cursor-pointer"
                  >
                    <h4 className="text-lg font-bold text-[#1f8b7f] mb-2">{center.name}</h4>
                    <p className="text-gray-600 text-sm mb-2">📍 {center.location}</p>
                    <p className="text-gray-600 text-sm mb-2">{center.feature}</p>
                    {center.phone && <p className="text-gray-600 text-sm mb-2">📞 {center.phone}</p>}
                    <p className="text-xs text-[#2eb89f] font-medium">👉 點擊查看詳情</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Transportation Tab */}
        {activeTab === "transportation" && (
          <div className="space-y-12">
            <section className="bg-white rounded-2xl shadow-lg p-10 border border-[#e8f5f1]">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] bg-clip-text text-transparent mb-8">🚆 交通運輸</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#f0faf8] to-white p-6 rounded-xl border border-[#e8f5f1]">
                  <h4 className="text-xl font-bold text-[#1f8b7f] mb-3">✈️ 機場捷運</h4>
                  <p className="text-gray-600 text-sm mb-3">14 站直達台北，快速連接北台灣</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 台北段：5 站</li>
                    <li>• 桃園段：9 站</li>
                    <li>• 車程時間：40 分鐘到台北</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#f0faf8] to-white p-6 rounded-xl border border-[#e8f5f1]">
                  <h4 className="text-xl font-bold text-[#1f8b7f] mb-3">🚄 高鐵 & 台鐵</h4>
                  <p className="text-gray-600 text-sm mb-3">多條路線連接全台</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 高鐵：桃園站直達台北、台中</li>
                    <li>• 台鐵：中壢、桃園等多站</li>
                    <li>• 客運：往返各地便利</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#f0faf8] to-white p-6 rounded-xl border border-[#e8f5f1]">
                  <h4 className="text-xl font-bold text-[#1f8b7f] mb-3">🚌 公車系統</h4>
                  <p className="text-gray-600 text-sm mb-3">完善的在地公車網絡</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 市公車：覆蓋全市</li>
                    <li>• 客運：連接各鄉鎮</li>
                    <li>• 便利的日常交通</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#f0faf8] to-white p-6 rounded-xl border border-[#e8f5f1]">
                  <h4 className="text-xl font-bold text-[#1f8b7f] mb-3">🎫 月票優惠</h4>
                  <p className="text-gray-600 text-sm mb-3">TPASS 月票暢遊基北北桃</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 月票價格：1,200 元</li>
                    <li>• 涵蓋範圍：基隆、台北、新北、桃園</li>
                    <li>• 無限搭乘：公車、捷運、客運</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-[#2eb89f]/10 to-[#1f8b7f]/10 p-6 rounded-xl border border-[#d4ede8]">
                <p className="text-center text-[#1f8b7f] font-bold text-lg">
                  💚 不用擔心交通費，TPASS 月票讓你玩透透！
                </p>
              </div>
            </section>
          </div>
        )}

        {/* Investment Advantages Dashboard */}
        {activeTab === "home" && (
          <div className="space-y-12">
            <section className="bg-gradient-to-br from-white to-[#f0faf8] rounded-2xl shadow-lg p-10 border border-[#e8f5f1]">
              <div className="mb-12">
                <h3 className="text-4xl font-bold bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] bg-clip-text text-transparent mb-3">📊 桃園投資優勢</h3>
                <p className="text-gray-600 text-lg">用數據說話，看見桃園的無限潛力</p>
              </div>

              {/* Investment Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* Transportation */}
                <div className="bg-white rounded-xl p-6 border border-[#e8f5f1] hover:shadow-lg transition duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-[#1f8b7f]">🚆 交通便利度</h4>
                    <span className="text-3xl font-bold text-[#2eb89f]">9.5/10</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>✓ 高鐵、捷運、機場捷運</p>
                    <p>✓ 連接北台灣主要城市</p>
                    <p>✓ 到台北僅需 40 分鐘</p>
                  </div>
                  <div className="mt-4 bg-[#f0faf8] rounded-lg h-2">
                    <div className="bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] h-full rounded-lg" style={{width: '95%'}}></div>
                  </div>
                </div>

                {/* Population */}
                <div className="bg-white rounded-xl p-6 border border-[#e8f5f1] hover:shadow-lg transition duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-[#1f8b7f]">👥 人口規模</h4>
                    <span className="text-3xl font-bold text-[#2eb89f]">230 萬</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>✓ 全台第三大城市</p>
                    <p>✓ 年成長率 2.3%</p>
                    <p>✓ 消費力強勁</p>
                  </div>
                  <div className="mt-4 bg-[#f0faf8] rounded-lg h-2">
                    <div className="bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] h-full rounded-lg" style={{width: '85%'}}></div>
                  </div>
                </div>

                {/* Education */}
                <div className="bg-white rounded-xl p-6 border border-[#e8f5f1] hover:shadow-lg transition duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-[#1f8b7f]">🎓 教育資源</h4>
                    <span className="text-3xl font-bold text-[#2eb89f]">12 所</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>✓ 大學數量豐富</p>
                    <p>✓ 入學率 95%+</p>
                    <p>✓ 完善教育體系</p>
                  </div>
                  <div className="mt-4 bg-[#f0faf8] rounded-lg h-2">
                    <div className="bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] h-full rounded-lg" style={{width: '90%'}}></div>
                  </div>
                </div>

                {/* Parks & Green Spaces */}
                <div className="bg-white rounded-xl p-6 border border-[#e8f5f1] hover:shadow-lg transition duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-[#1f8b7f]">🌳 公園綠地</h4>
                    <span className="text-3xl font-bold text-[#2eb89f]">127 座</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>✓ 綠地面積廣闊</p>
                    <p>✓ 親子休閒首選</p>
                    <p>✓ 生活品質優</p>
                  </div>
                  <div className="mt-4 bg-[#f0faf8] rounded-lg h-2">
                    <div className="bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] h-full rounded-lg" style={{width: '88%'}}></div>
                  </div>
                </div>

                {/* Childcare Benefits */}
                <div className="bg-white rounded-xl p-6 border border-[#e8f5f1] hover:shadow-lg transition duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-[#1f8b7f]">👶 育兒津貼</h4>
                    <span className="text-3xl font-bold text-[#2eb89f]">全台最優</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>✓ 0-2 歲：5,000 元/月</p>
                    <p>✓ 2-4 歲：3,000 元/月</p>
                    <p>✓ 完善托育服務</p>
                  </div>
                  <div className="mt-4 bg-[#f0faf8] rounded-lg h-2">
                    <div className="bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] h-full rounded-lg" style={{width: '92%'}}></div>
                  </div>
                </div>

                {/* Commercial Opportunities */}
                <div className="bg-white rounded-xl p-6 border border-[#e8f5f1] hover:shadow-lg transition duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-[#1f8b7f]">🏪 商業機會</h4>
                    <span className="text-3xl font-bold text-[#2eb89f]">豐富</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>✓ 知名商場眾多</p>
                    <p>✓ 水族館、樂園齊全</p>
                    <p>✓ 消費市場龐大</p>
                  </div>
                  <div className="mt-4 bg-[#f0faf8] rounded-lg h-2">
                    <div className="bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] h-full rounded-lg" style={{width: '87%'}}></div>
                  </div>
                </div>
              </div>

              {/* Investment Potential */}
              <div className="bg-gradient-to-r from-[#2eb89f]/10 to-[#1f8b7f]/10 p-8 rounded-xl border border-[#d4ede8]">
                <h4 className="text-xl font-bold text-[#1f8b7f] mb-4">📈 投資潛力指標</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[#2eb89f] mb-2">1.2%</p>
                    <p className="text-gray-600 font-semibold">生育率成長</p>
                    <p className="text-sm text-gray-500 mt-1">家庭數量持續增加</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[#2eb89f] mb-2">2,000+</p>
                    <p className="text-gray-600 font-semibold">億元建設投資</p>
                    <p className="text-sm text-gray-500 mt-1">未來發展動能強</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[#2eb89f] mb-2">↑ 15%</p>
                    <p className="text-gray-600 font-semibold">房價年成長</p>
                    <p className="text-sm text-gray-500 mt-1">投資增值空間大</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 text-center">
                <p className="text-[#1f8b7f] font-bold text-lg mb-4">💚 看到桃園的潛力了嗎？現在正是投資的好時機！</p>
                <a href="https://page.line.me/768fuhqm" target="_blank" className="inline-block px-8 py-3 bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white font-bold rounded-lg hover:shadow-lg transition duration-300">
                  立即諮詢房源
                </a>
              </div>
            </section>
          </div>
        )}

        {/* Daily Tab */}
        {activeTab === "daily" && (
          <div className="space-y-12">
            <section className="bg-white rounded-2xl shadow-lg p-10 border border-[#e8f5f1]">
              <div className="mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] bg-clip-text text-transparent mb-2">{todayContent.title}</h3>
                <p className="text-gray-600 text-lg">{todayContent.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {todayContent.content.map((item: any, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => item.details && setSelectedEvent(item)}
                    className={`bg-gradient-to-br from-[#f0faf8] to-white p-6 rounded-xl border border-[#e8f5f1] hover:shadow-lg transition duration-300 hover:translate-y-[-4px] ${item.details ? 'cursor-pointer' : ''}`}
                  >
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h4 className="text-lg font-bold text-[#1f8b7f] mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    {item.details && <p className="text-xs text-[#2eb89f] mt-3 font-medium">👉 點擊查看詳情</p>}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Footer CTA */}
        <section className="mt-16 bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] rounded-2xl shadow-xl p-10 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">準備好來桃園了嗎？</h3>
          <p className="text-white/90 mb-6">找好案、問行情，歡迎聯繫我們</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://www.dreamestate.com.tw/" target="_blank" className="px-6 py-3 bg-white text-[#2eb89f] font-bold rounded-lg hover:bg-white/90 transition duration-200">
              🌐 官網看精選
            </a>
            <a href="https://www.facebook.com/tthedreamestate/" target="_blank" className="px-6 py-3 bg-white text-[#2eb89f] font-bold rounded-lg hover:bg-white/90 transition duration-200">
              👍 關注粉專
            </a>
            <a href="https://page.line.me/768fuhqm" target="_blank" className="px-6 py-3 bg-white text-[#2eb89f] font-bold rounded-lg hover:bg-white/90 transition duration-200">
              💬 加官方 LINE
            </a>
          </div>
        </section>
      </main>

      {/* Park Detail Modal */}
      {selectedPark && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPark(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white p-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedPark.name}</h2>
                <p className="text-white/80 text-sm mt-1">📍 {selectedPark.location}</p>
              </div>
              <button onClick={() => setSelectedPark(null)} className="text-white/80 hover:text-white text-2xl flex-shrink-0">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-[#1f8b7f] mb-2">公園介紹</h3>
                <p className="text-gray-700 leading-relaxed">{selectedPark.details}</p>
              </div>
              <div className="bg-[#f0faf8] p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">📍 地址</p>
                <p className="font-bold text-[#1f8b7f]">{selectedPark.address}</p>
              </div>
              <div className="bg-gradient-to-r from-[#2eb89f]/10 to-[#1f8b7f]/10 p-4 rounded-lg border border-[#d4ede8]">
                <p className="text-sm text-[#1f8b7f]">💚 想了解更多桃園景點或房源資訊？歡迎加官方 LINE 詢問！</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Childcare Center Detail Modal */}
      {selectedCenter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCenter(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white p-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedCenter.name}</h2>
                <p className="text-white/80 text-sm mt-1">📍 {selectedCenter.location}</p>
              </div>
              <button onClick={() => setSelectedCenter(null)} className="text-white/80 hover:text-white text-2xl flex-shrink-0">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-[#1f8b7f] mb-2">親子館介紹</h3>
                <p className="text-gray-700 leading-relaxed">{selectedCenter.details}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f0faf8] p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">📍 地址</p>
                  <p className="font-bold text-[#1f8b7f] text-sm">{selectedCenter.address}</p>
                </div>
                <div className="bg-[#f0faf8] p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">📞 電話</p>
                  <p className="font-bold text-[#1f8b7f]">{selectedCenter.phone}</p>
                </div>
              </div>
              {selectedCenter.website && (
                <a href={selectedCenter.website} target="_blank" rel="noopener noreferrer" className="block text-center py-2 bg-[#2eb89f] text-white font-semibold rounded-lg hover:bg-[#1f8b7f] transition">
                  🌐 官方網站
                </a>
              )}
              <div className="bg-gradient-to-r from-[#2eb89f]/10 to-[#1f8b7f]/10 p-4 rounded-lg border border-[#d4ede8]">
                <p className="text-sm text-[#1f8b7f]">💚 想了解更多親子館資訊或房源？歡迎加官方 LINE 詢問！</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Library Detail Modal */}
      {selectedLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedLibrary(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white p-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedLibrary.name}</h2>
                <p className="text-white/80 text-sm mt-1">📍 {selectedLibrary.location}</p>
              </div>
              <button onClick={() => setSelectedLibrary(null)} className="text-white/80 hover:text-white text-2xl flex-shrink-0">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-[#1f8b7f] mb-2">圖書館介紹</h3>
                <p className="text-gray-700 leading-relaxed">{selectedLibrary.details}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f0faf8] p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">📍 地址</p>
                  <p className="font-bold text-[#1f8b7f] text-sm">{selectedLibrary.address}</p>
                </div>
                <div className="bg-[#f0faf8] p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">⏰ 開放時間</p>
                  <p className="font-bold text-[#1f8b7f] text-sm">{selectedLibrary.hours}</p>
                </div>
              </div>
              {selectedLibrary.website && (
                <a href={selectedLibrary.website} target="_blank" rel="noopener noreferrer" className="block text-center py-2 bg-[#2eb89f] text-white font-semibold rounded-lg hover:bg-[#1f8b7f] transition">
                  🌐 官方網站
                </a>
              )}
              <div className="bg-gradient-to-r from-[#2eb89f]/10 to-[#1f8b7f]/10 p-4 rounded-lg border border-[#d4ede8]">
                <p className="text-sm text-[#1f8b7f]">💚 想了解更多圖書館資訊或房源？歡迎加官方 LINE 詢問！</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white p-4 sm:p-6 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 sm:gap-4 min-w-0">
                <div className="text-3xl sm:text-4xl flex-shrink-0">{selectedEvent.icon}</div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold break-words">{selectedEvent.title}</h2>
                  {selectedEvent.location && <p className="text-white/80 text-xs sm:text-sm mt-1 break-words">📍 {selectedEvent.location}</p>}
                </div>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="text-white/80 hover:text-white text-xl sm:text-2xl flex-shrink-0">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <h3 className="font-bold text-[#1f8b7f] mb-2">活動介紹</h3>
                <p className="text-gray-700 leading-relaxed">{selectedEvent.details}</p>
              </div>
              {selectedEvent.date && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-[#f0faf8] p-3 sm:p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">📅 活動時間</p>
                    <p className="font-bold text-[#1f8b7f] text-sm sm:text-base">{selectedEvent.date}</p>
                  </div>
                  {selectedEvent.time && (
                    <div className="bg-[#f0faf8] p-3 sm:p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">⏰ 開放時間</p>
                      <p className="font-bold text-[#1f8b7f] text-sm sm:text-base">{selectedEvent.time}</p>
                    </div>
                  )}
                </div>
              )}
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-2">🔗 官方資訊來源</p>
                {selectedEvent.sourceUrl ? (
                  <a href={selectedEvent.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-xs sm:text-sm block break-words">
                    {selectedEvent.sourceLabel || selectedEvent.source || "查看官方網站"}
                  </a>
                ) : (
                  <p className="text-gray-500 text-xs sm:text-sm">敬請期待更多資訊</p>
                )}
              </div>
              <div className="bg-gradient-to-r from-[#2eb89f]/10 to-[#1f8b7f]/10 p-4 rounded-lg border border-[#d4ede8]">
                <p className="text-sm text-[#1f8b7f]">💚 想了解更多桃園活動或房源資訊？歡迎加官方 LINE 詢問！</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentEvent.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentEvent.title}</h2>
                  <p className="text-white/90 text-sm">{currentEvent.subtitle}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-white/20 p-2 rounded-full transition duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Event Image */}
              {currentEvent.image && (
                <div className="relative h-64 bg-cover bg-center rounded-xl overflow-hidden">
                  <img src={currentEvent.image} alt={currentEvent.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Event Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#f0faf8] p-4 rounded-lg border border-[#e8f5f1]">
                    <p className="text-xs text-gray-600 mb-1">📅 活動時間</p>
                    <p className="font-bold text-[#1f8b7f]">{currentEvent.date}</p>
                  </div>
                  <div className="bg-[#f0faf8] p-4 rounded-lg border border-[#e8f5f1]">
                    <p className="text-xs text-gray-600 mb-1">⏰ 開放時間</p>
                    <p className="font-bold text-[#1f8b7f]">{currentEvent.time}</p>
                  </div>
                  <div className="bg-[#f0faf8] p-4 rounded-lg border border-[#e8f5f1]">
                    <p className="text-xs text-gray-600 mb-1">📍 地點</p>
                    <p className="font-bold text-[#1f8b7f]">{currentEvent.location}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-[#1f8b7f] mb-3">活動介紹</h3>
                <p className="text-gray-600 leading-relaxed">{currentEvent.details}</p>
              </div>

              {/* Source Info */}
              {currentEvent.sourceLabel && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs text-gray-600">{currentEvent.sourceLabel}</p>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {currentEvent.sourceUrl && (
                  <a
                    href={currentEvent.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white rounded-lg font-semibold hover:shadow-lg transition duration-300 text-center"
                  >
                    🔗 查看官方網站
                  </a>
                )}
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
                >
                  關閉
                </button>
              </div>

              {/* Comments Section */}
              <div className="border-t border-[#e8f5f1] pt-6 mt-6">
                <h3 className="text-lg font-bold text-[#1f8b7f] mb-4">💬 訪客評論</h3>

                {/* Visitor Identity Badge */}
                {identity && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-[#f0faf8] rounded-lg border border-[#e8f5f1]">
                    <span className="text-2xl">{identity.avatar}</span>
                    <span className="text-sm font-semibold text-[#1f8b7f]">{identity.name}</span>
                    <span className="text-xs text-gray-400 ml-1">（您的暱稱）</span>
                    <button
                      onClick={() => setShowIdentitySetup(true)}
                      className="ml-auto text-xs text-[#2eb89f] hover:underline"
                    >
                      修改
                    </button>
                  </div>
                )}
                
                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-6 p-4 bg-[#f0faf8] rounded-lg border border-[#e8f5f1]">
                  <div className="mb-3">
                    <textarea
                      placeholder={identity ? `以 ${identity.avatar} ${identity.name} 的身份分享您對這個活動的看法...` : "分享您對這個活動的看法..."}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-[#d4ede8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2eb89f] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={createCommentMutation.isPending}
                    className="w-full px-4 py-2 bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white rounded-lg font-semibold hover:shadow-lg transition duration-300 disabled:opacity-60"
                  >
                    {createCommentMutation.isPending ? "提交中..." : "✨ 提交評論"}
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {commentsQuery.isLoading ? (
                    <p className="text-center text-gray-400 text-sm py-4">載入評論中...</p>
                  ) : commentsQuery.data && commentsQuery.data.length > 0 ? (
                    commentsQuery.data.map((comment) => (
                      <div key={comment.id} className="p-3 bg-white border border-[#e8f5f1] rounded-lg hover:shadow-md transition duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{comment.visitorAvatar}</span>
                            <p className="font-semibold text-[#1f8b7f]">{comment.visitorName}</p>
                          </div>
                          <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString("zh-TW")}</p>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{comment.content}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full transition duration-200 text-sm font-semibold ${
                              likedCommentIds.has(comment.id)
                                ? "bg-[#2eb89f] text-white"
                                : "bg-[#f0faf8] hover:bg-[#e8f5f1] text-[#1f8b7f]"
                            }`}
                          >
                            👍 {comment.likes}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm py-4">還沒有評論，成為第一個留言的人吧！</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visitor Identity Setup Dialog */}
      {showIdentitySetup && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowIdentitySetup(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">{setupAvatar}</div>
              <h3 className="text-xl font-bold text-[#1f8b7f]">
                {identity ? "修改您的暱稱" : "歡迎加入討論！"}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {identity ? "選擇新的頭像和暱稱" : "設定一次，下次直接留言💚"}
              </p>
            </div>

            {/* Avatar Selection */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-[#1f8b7f] mb-2">選擇您的頭像</p>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSetupAvatar(emoji)}
                    className={`text-2xl p-2 rounded-lg transition duration-200 ${
                      setupAvatar === emoji
                        ? "bg-[#2eb89f] ring-2 ring-[#2eb89f] ring-offset-1"
                        : "bg-[#f0faf8] hover:bg-[#e8f5f1]"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-[#1f8b7f] mb-2">您的暱稱</p>
              <input
                type="text"
                placeholder="請輸入您的暱稱..."
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleIdentitySetupComplete()}
                maxLength={20}
                className="w-full px-4 py-3 border-2 border-[#d4ede8] rounded-xl focus:outline-none focus:border-[#2eb89f] text-lg"
                autoFocus
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowIdentitySetup(false)}
                className="flex-1 px-4 py-3 border-2 border-[#e8f5f1] text-gray-500 rounded-xl hover:bg-gray-50 transition duration-200"
              >
                取消
              </button>
              <button
                onClick={handleIdentitySetupComplete}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white font-bold rounded-xl hover:shadow-lg transition duration-300"
              >
                {identity ? "儲存修改" : "開始留言 💬"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-[#e8f5f1] mt-16 py-8">
        <div className="container text-center text-gray-600 text-sm">
          <p>© 2026 夢想不動產 | 桃園報馬仔</p>
          <p className="mt-2">找好案、問行情，歡迎聯繫：<a href="https://page.line.me/768fuhqm" className="text-[#2eb89f] font-bold hover:underline">加官方 LINE</a></p>
        </div>
      </footer>
    </div>
  );
}
