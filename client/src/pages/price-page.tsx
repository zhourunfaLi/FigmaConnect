
import React from 'react';

export default function PricePage() {
  return (
    <div className="min-h-screen bg-[#EEEAE2]">
      <div className="relative w-[390px] h-[844px] bg-[#8B7C7C]">
        {/* Upgrade Notice */}
        <div className="w-full pt-6 pb-4 text-center">
          <div className="text-white text-xl">您需要升级至SVIP</div>
          <div className="text-white text-lg mt-1">才能使用此权限</div>
        </div>
        
        {/* Divider Line */}
        <div className="w-full h-[1px] bg-white/30"></div>

        {/* Membership Introduction */}
        <div className="absolute left-2 top-[116px] w-[374px] h-[630px]">
          <div className="relative w-[347px] h-[300px] ml-[13px] -mt-[9px]">
            {/* SVIP Rights Title */}
            <div className="text-white text-[18px] text-center tracking-[3px] font-['Zilla_Slab'] ml-[115px] mt-5">
              SVIP特权
            </div>

            {/* SVIP Rights List */}
            <div className="absolute left-[141px] top-[94px] w-[206px] h-[202px] space-y-[10px]">
              {['所有作品观看特权', '去除广告', '高清下载', '作品全屏观看'].map((right, index) => (
                <div key={index} className="w-[206px] h-[43px] bg-[rgba(49,49,49,0.56)] backdrop-blur-[2.5px] rounded-[10px] flex items-center justify-end pr-7">
                  <span className="text-white text-[14px] font-normal">{right}</span>
                </div>
              ))}
            </div>

            {/* Left Side Image */}
            <img 
              src="/src/assets/design/works-01.png"
              alt="Price Feature"
              className="absolute left-0 top-[65px] w-[163px] h-[235px] object-cover"
            />
          </div>

          {/* Invite Code Section */}
          <div className="relative mt-[32px] ml-[61px] w-[253px] h-[38px]">
            <div className="relative border border-white rounded-lg w-[182px] h-[34px] mt-[6px]">
              <input 
                type="text"
                placeholder="请输入5元优惠邀请码"
                className="w-full h-full bg-transparent text-[#C3BFBF] text-xs pl-3 pr-2 focus:outline-none"
              />
            </div>
            <div className="absolute left-[26px] top-0 text-white text-[10px]">优惠邀请码</div>
            <div className="absolute left-[9px] top-[14px] w-[18px] h-0 border-t border-white rotate-90"></div>
            <button className="absolute right-0 top-[7px] w-[49px] h-[31px] bg-[#147ADA] rounded-[5px] text-[#EEEAE2] text-xs">
              提交
            </button>
          </div>

          {/* Membership Plans */}
          <div className="mt-[38px] ml-[13px] space-y-3">
            {/* 12个月会员 */}
            <div className="w-[361px] h-[86px] bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] rounded-xl p-4 flex justify-between items-center">
              <div className="text-white">
                <div className="text-xl font-bold">12个月会员</div>
                <div className="text-sm mt-1">限时特惠 · 每月仅11.5元</div>
              </div>
              <div className="text-white">
                <span className="text-3xl font-bold">¥138</span>
                <span className="text-sm ml-1">/ 年</span>
              </div>
            </div>
            
            {/* 6个月会员 */}
            <div className="w-[360px] h-[75px] bg-gradient-to-r from-[#4F46E5] to-[#818CF8] rounded-xl p-4 flex justify-between items-center">
              <div className="text-white">
                <div className="text-xl font-bold">6个月会员</div>
                <div className="text-sm mt-1">超值优惠 · 每月仅16.3元</div>
              </div>
              <div className="text-white">
                <span className="text-3xl font-bold">¥98</span>
                <span className="text-sm ml-1">/ 半年</span>
              </div>
            </div>
            
            {/* 1个月会员 */}
            <div className="w-[358px] h-[74px] bg-gradient-to-r from-[#6B7280] to-[#9CA3AF] rounded-xl p-4 flex justify-between items-center">
              <div className="text-white">
                <div className="text-xl font-bold">1个月会员</div>
                <div className="text-sm mt-1">随时体验</div>
              </div>
              <div className="text-white">
                <span className="text-3xl font-bold">¥58</span>
                <span className="text-sm ml-1">/ 月</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
