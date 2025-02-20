import React from 'react';

export default function PricePage() {
  return (
    <div className="min-h-screen bg-[#DDD8D0] flex justify-center overflow-x-hidden">
      <div className="relative w-[390px] h-[844px] bg-[#624811] flex-shrink-0 space-y-6">
        {/* Upgrade Notice */}
        <div className="w-full pt-8 pb-6 text-center space-y-2">
          <div className="text-white text-lg font-medium">您需要升级至SVIP</div>
          <div className="text-white text-lg font-medium">才能使用此权限</div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/30" />

        {/* Privileges */}
        <div className="w-full p-6 space-y-4">
          <div className="text-white text-lg font-medium text-center">会员专享特权</div>
          <div className="flex justify-center">
            <img src="/src/assets/design/element/price_img_01.png" alt="privileges" className="w-[340px] h-[143px] object-cover rounded-lg" />
          </div>
        </div>

        {/* Invite Code */}
        <div className="w-full px-6 py-4 bg-[#72510B]/80 backdrop-blur-sm">
          <div className="text-white/90 text-sm font-medium mb-3">邀请码</div>
          <input
            type="text"
            placeholder="请输入邀请码"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        {/* Membership Plans */}
        <div className="mt-8 px-6 space-y-4">
            {/* 12个月会员 */}
            <div className="w-full h-[80px] bg-gradient-to-r from-[#72510B] to-[#D4AF37] rounded-xl p-4 flex justify-between items-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#D4AF37] px-2 py-1 rounded-bl-lg">
                <span className="text-xs text-white">推荐</span>
              </div>
              <div className="text-white">
                <div className="text-base font-medium">12个月会员</div>
                <div className="text-xs mt-1 opacity-80">限时特惠 · 每月仅11.5元</div>
              </div>
              <div className="text-white">
                <span className="text-2xl font-bold">¥138</span>
                <span className="text-xs ml-1 opacity-80">/ 年</span>
              </div>
            </div>

            {/* 6个月会员 */}
            <div className="w-full h-[80px] bg-gradient-to-r from-[#72510B] to-[#8B7355] rounded-xl p-4 flex justify-between items-center shadow-md">
              <div className="text-white">
                <div className="text-base font-medium">6个月会员</div>
                <div className="text-xs mt-1 opacity-80">超值优惠 · 每月仅16.3元</div>
              </div>
              <div className="text-white">
                <span className="text-2xl font-bold">¥98</span>
                <span className="text-xs ml-1 opacity-80">/ 半年</span>
              </div>
            </div>

            {/* 1个月会员 */}
            <div className="w-full h-[80px] bg-gradient-to-r from-[#72510B] to-[#8B7355] opacity-80 rounded-xl p-4 flex justify-between items-center">
              <div className="text-white">
                <div className="text-base font-medium">1个月会员</div>
                <div className="text-xs mt-1 opacity-80">随时体验</div>
              </div>
              <div className="text-white">
                <span className="text-2xl font-bold">¥58</span>
                <span className="text-xs ml-1 opacity-80">/ 月</span>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}