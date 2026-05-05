import { useState } from "react";
import { useLocation } from "wouter";

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function Navbar({ activeTab = "home", setActiveTab }: NavbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const handleTabClick = (tab: string) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
    setOpenDropdown(null);
    // 若目前不在首頁，先跳回首頁再切換 tab
    if (window.location.pathname !== "/") {
      setLocation("/");
    }
  };

  const closeDropdown = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest(".dropdown-wrapper")) {
      setOpenDropdown(null);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-[#d4ede8]">
      <div className="container py-4">
        {/* Top Row: Logo + Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => handleTabClick("home")}
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#2eb89f] to-[#1f8b7f] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              DE
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] bg-clip-text text-transparent">
                  桃園報馬仔
                </h1>
                <span className="text-xs font-medium text-gray-500">/ 夢想不動產</span>
              </div>
              <p className="text-xs text-gray-500">來桃園找個家</p>
            </div>
          </button>

          <div className="flex gap-2 text-sm">
            <a
              href="https://www.dreamestate.com.tw/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-[#2eb89f] hover:bg-[#f0faf8] rounded-lg transition duration-200 font-medium"
            >
              🌐 官網
            </a>
            <a
              href="https://www.facebook.com/tthedreamestate/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-[#2eb89f] hover:bg-[#f0faf8] rounded-lg transition duration-200 font-medium"
            >
              👍 粉專
            </a>
            <a
              href="https://page.line.me/768fuhqm"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white rounded-lg transition duration-200 hover:shadow-lg font-medium"
            >
              💬 加 LINE
            </a>
          </div>
        </div>

        {/* Navigation Row */}
        <nav
          className="flex gap-2 text-sm font-medium items-center flex-wrap"
          onClick={closeDropdown}
        >
          {/* 首頁 */}
          <button
            onClick={() => handleTabClick("home")}
            className={`px-4 py-2 rounded-lg transition duration-200 whitespace-nowrap ${
              activeTab === "home"
                ? "bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white shadow-md"
                : "text-gray-600 hover:bg-[#f0faf8]"
            }`}
          >
            🏠 首頁
          </button>

          {/* 認識桃園 下拉選單 */}
          <div className="dropdown-wrapper relative">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "taoyuan" ? null : "taoyuan")
              }
              className={`px-4 py-2 rounded-lg transition duration-200 flex items-center gap-1 whitespace-nowrap ${
                ["taoyuan", "transportation"].includes(activeTab)
                  ? "bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white shadow-md"
                  : openDropdown === "taoyuan"
                  ? "bg-[#f0faf8] text-[#2eb89f]"
                  : "text-gray-600 hover:bg-[#f0faf8]"
              }`}
            >
              📍 認識桃園
              <span
                className={`text-[10px] transition-transform duration-200 inline-block ${
                  openDropdown === "taoyuan" ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>
            {openDropdown === "taoyuan" && (
              <div className="absolute top-[calc(100%+6px)] left-0 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 min-w-[150px] z-50">
                {[
                  { key: "taoyuan", label: "📜 歷史地理" },
                  { key: "transportation", label: "🚄 交通建設" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleTabClick(item.key)}
                    className={`block w-full text-left px-4 py-2 text-sm transition duration-150 whitespace-nowrap ${
                      activeTab === item.key
                        ? "text-[#1f8b7f] font-semibold bg-[#f0faf8]"
                        : "text-gray-700 hover:bg-[#f0faf8] hover:text-[#2eb89f]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <a
                  href="https://e-services.tycg.gov.tw/TycgOnline/tycgOnline.action?func=home&qword=&cdnCache=Y"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpenDropdown(null)}
                  className="block w-full text-left px-4 py-2 text-sm transition duration-150 whitespace-nowrap text-gray-700 hover:bg-[#f0faf8] hover:text-[#2eb89f]"
                >
                  💰 相關補助
                </a>
              </div>
            )}
          </div>

          {/* 休閒探索 下拉選單 */}
          <div className="dropdown-wrapper relative">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "leisure" ? null : "leisure")
              }
              className={`px-4 py-2 rounded-lg transition duration-200 flex items-center gap-1 whitespace-nowrap ${
                ["parks", "childcare", "libraries", "arts", "food"].includes(activeTab)
                  ? "bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white shadow-md"
                  : openDropdown === "leisure"
                  ? "bg-[#f0faf8] text-[#2eb89f]"
                  : "text-gray-600 hover:bg-[#f0faf8]"
              }`}
            >
              🎡 休閒探索
              <span
                className={`text-[10px] transition-transform duration-200 inline-block ${
                  openDropdown === "leisure" ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>
            {openDropdown === "leisure" && (
              <div className="absolute top-[calc(100%+6px)] left-0 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 min-w-[150px] z-50">
                {[
                  { key: "parks", label: "🌳 特色公園" },
                  { key: "childcare", label: "👶 親子館" },
                  { key: "libraries", label: "📚 圖書館" },
                  { key: "arts", label: "🎨 藝文活動" },
                  { key: "food", label: "🍽️ 美食推薦" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleTabClick(item.key)}
                    className={`block w-full text-left px-4 py-2 text-sm transition duration-150 whitespace-nowrap ${
                      activeTab === item.key
                        ? "text-[#1f8b7f] font-semibold bg-[#f0faf8]"
                        : "text-gray-700 hover:bg-[#f0faf8] hover:text-[#2eb89f]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 特約商店 直連 */}
          <a
            href="/partner-shops"
            className={`px-4 py-2 rounded-lg transition duration-200 whitespace-nowrap ${
              window.location.pathname === "/partner-shops"
                ? "bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white shadow-md"
                : "text-gray-600 hover:bg-[#f0faf8]"
            }`}
          >
            🎁 特約商店
          </a>

          {/* 在地情報 直連 */}
          <button
            onClick={() => handleTabClick("daily")}
            className={`px-4 py-2 rounded-lg transition duration-200 whitespace-nowrap ${
              activeTab === "daily"
                ? "bg-gradient-to-r from-[#2eb89f] to-[#1f8b7f] text-white shadow-md"
                : "text-gray-600 hover:bg-[#f0faf8]"
            }`}
          >
            📰 在地情報
          </button>
        </nav>
      </div>
    </header>
  );
}
