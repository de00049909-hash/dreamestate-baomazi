import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function PartnerShops() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    shopName: "",
    phone: "",
    businessType: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.shopName || !formData.phone || !formData.businessType) {
      toast.error("請填寫所有必填欄位");
      return;
    }

    setIsSubmitting(true);
    
    // 模擬提交延遲
    setTimeout(() => {
      toast.success(`感謝 ${formData.shopName} 的加入！報馬仔專員會盡快與您聯繫。`);
      
      // 跳轉到官方 LINE
      window.location.href = "https://page.line.me/768fuhqm";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f5f3] to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-[#26a69a] hover:text-[#1b8a7e] transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">返回</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">夢想不動產 特約商店</h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Hero Section */}
          <section className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              加入夢想不動產特約商店
            </h2>
            <p className="text-lg text-gray-600">
              與我們合作，互相曝光，共同推廣桃園的美好生活
            </p>
          </section>

          {/* Benefits Section */}
          <section className="grid md:grid-cols-3 gap-4">
            <Card className="border-[#a8d5ce]">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#26a69a] text-lg">📱 社群曝光</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  在「桃園報馬仔」網站和粉專上展示妳的商店，獲得更多曝光機會
                </p>
              </CardContent>
            </Card>
            <Card className="border-[#a8d5ce]">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#26a69a] text-lg">🤝 互相推廣</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  與夢想不動產客戶互相推薦，建立長期合作關係
                </p>
              </CardContent>
            </Card>
            <Card className="border-[#a8d5ce]">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#26a69a] text-lg">💼 專業服務</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  報馬仔專員會主動聯繫妳，討論合作細節和推廣方案
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Form Section */}
          <Card className="border-[#a8d5ce] shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#26a69a]">📝 特約商店申請表</CardTitle>
              <CardDescription>
                填寫以下資訊，報馬仔專員會盡快與您聯繫
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shop Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    商店名稱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    placeholder="例：美食餐廳、親子樂園"
                    className="w-full px-4 py-2 border border-[#a8d5ce] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26a69a]"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    聯繫電話 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="例：03-123-4567"
                    className="w-full px-4 py-2 border border-[#a8d5ce] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26a69a]"
                    required
                  />
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    營業項目 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#a8d5ce] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26a69a]"
                    required
                  >
                    <option value="">請選擇營業項目</option>
                    <option value="美食餐廳">🍜 美食餐廳</option>
                    <option value="親子設施">👨‍👩‍👧 親子設施</option>
                    <option value="教育機構">📚 教育機構</option>
                    <option value="生活服務">💇 生活服務</option>
                    <option value="購物商場">🛍️ 購物商場</option>
                    <option value="娛樂休閒">🎭 娛樂休閒</option>
                    <option value="其他">📌 其他</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    商店介紹
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="簡單介紹妳的商店特色、服務內容等（選填）"
                    className="w-full px-4 py-2 border border-[#a8d5ce] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26a69a]"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#26a69a] text-white font-bold py-3 rounded-lg hover:bg-[#1b8a7e] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "提交中..." : "提交申請，聯繫報馬仔專員"}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  提交後將跳轉到官方 LINE，報馬仔專員會盡快與您聯繫
                </p>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">常見問題</h3>
            <div className="space-y-3">
              <Card className="border-[#a8d5ce]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-[#26a69a]">
                    Q: 加入特約商店需要費用嗎？
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    A: 不需要。加入特約商店完全免費，我們只是想建立一個互相推廣的合作生態。
                  </p>
                </CardContent>
              </Card>
              <Card className="border-[#a8d5ce]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-[#26a69a]">
                    Q: 報馬仔專員會多快聯繫我？
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    A: 我們會在 1-2 個工作天內透過 LINE 與您聯繫，討論合作細節。
                  </p>
                </CardContent>
              </Card>
              <Card className="border-[#a8d5ce]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-[#26a69a]">
                    Q: 合作內容包括什麼？
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    A: 合作內容可以包括社群推廣、客戶推薦、聯合活動等，具體內容會根據雙方需求而定。
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
