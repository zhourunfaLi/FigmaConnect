
import React from 'react';

export default function PricePage() {
  return (
    {/* A区: 页面容器 */}
    <div className="min-h-screen bg-[#EEEAE2] flex justify-center overflow-x-hidden">
      {/* B区: 内容主体区域 */}
      <div className="relative w-full max-w-[390px] min-h-screen bg-[#8B7C7C] flex-shrink-0 space-y-6">
        {/* C区: 升级提示区域 */}
        <div className="w-full py-10 text-center">
          <div className="text-white text-base">您需要升级至SVIP</div>
          <div className="text-white text-sm mt-1">才能使用此权限</div>
        </div>
        
        {/* Divider Line */}
        <div className="w-full h-[1px] bg-white/30"></div>

        {/* D区: 主要内容区域 */}
        <div className="px-4 space-y-2">
          {/* E区: SVIP特权展示区 */}
          <div className="relative mt-2">
            <div className="text-white text-base text-center tracking-[3px] font-['Zilla_Slab']">
              SVIP特权
            </div>

            <div className="flex justify-between items-center mt-4">
              <img 
                src="/src/assets/design/element/price_img_01.png"
                alt="Price Feature"
                className="w-[163px] h-[235px] object-cover relative z-10 -mt-2"
              />
              
              <div className="w-[206px] space-y-2 relative -ml-16 z-0">
                {['所有作品观看特权', '去除广告', '高清下载', '作品全屏观看'].map((right, index) => (
                  <div key={index} className="w-full h-[43px] bg-[rgba(49,49,49,0.56)] backdrop-blur-[2.5px] rounded-[10px] flex items-center justify-end pr-4">
                    <span className="text-white text-xs">{right}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* F区: 邀请码输入区 */}
          <div className="mt-8 mb-8 p-4 bg-black/20 rounded-lg">
            <div className="relative">
              <div className="text-white text-xs mb-1">优惠邀请码</div>
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="请输入5元优惠邀请码"
                  className="flex-1 h-[34px] bg-transparent text-[#C3BFBF] text-xs px-3 border border-white/50 rounded-lg focus:outline-none focus:border-white"
                />
                <button className="h-[34px] px-4 bg-[#D4AF37] rounded-lg text-[#EEEAE2] text-xs">
                  提交
                </button>
              </div>
            </div>
          </div>

          {/* G区: 会员套餐列表区 */}
          <div className="space-y-4 mt-6">
            {/* 12个月会员 */}
            <div className="w-full h-[80px] bg-[#D4AF37] rounded-xl p-4 flex justify-between items-center shadow-lg border border-white/10 relative">
              <div className="absolute -top-2 -right-2 bg-[#FF3B30] px-2 py-0.5 rounded text-[10px] text-white font-medium">超值</div>
              <div className="text-white">
                <div className="text-sm font-bold tracking-wider">12个月会员</div>
                <div className="text-xs mt-1.5 opacity-90">限时特惠 · 每月仅11.5元</div>
              </div>
              <div className="text-white">
                <span className="text-xl font-bold">¥138</span>
                <span className="text-xs ml-1 opacity-90">/ 年</span>
              </div>
            </div>
            
            {/* 6个月会员 */}
            <div className="w-full h-[70px] bg-[#9F7E2B] rounded-xl p-4 flex justify-between items-center shadow-md border border-white/10 relative">
              <div className="absolute -top-2 -right-2 bg-[#FF9500] px-2 py-0.5 rounded text-[10px] text-white font-medium">推荐</div>
              <div className="text-white">
                <div className="text-sm font-bold tracking-wider">6个月会员</div>
                <div className="text-xs mt-1.5 opacity-90">超值优惠 · 每月仅16.3元</div>
              </div>
              <div className="text-white">
                <span className="text-xl font-bold">¥98</span>
                <span className="text-xs ml-1 opacity-90">/ 半年</span>
              </div>
            </div>
            
            {/* 1个月会员 */}
            <div className="w-full h-[70px] bg-[#876923] rounded-xl p-4 flex justify-between items-center shadow-md border border-white/10">
              <div className="text-white">
                <div className="text-base font-bold">1个月会员</div>
                <div className="text-xs mt-1">随时体验</div>
              </div>
              <div className="text-white">
                <span className="text-2xl font-bold">¥58</span>
                <span className="text-xs ml-1">/ 月</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
