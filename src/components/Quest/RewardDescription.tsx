import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "/public/chains/arbitrum.png";

export default function RewardDescription() {
  return (
    <>
      <div className="flex flex-col h-full justify-between text-white">
        <div className="flex flex-col h-full justify-center text-lg">
          <div className="flex flex-row w-full justify-center mb-8">
            <Image src={logo} alt="Logo" width={192} height={192} />
          </div>

          <p className="font-bold">Rewards from this Quest</p>
          <p className="text-sm">
            Supply USDC on the Arbitrum market through Compound to earn daily
            points based on your total value locked (TVL). The more USD you
            supply, the more points you'll earn Each point will be worth a set
            amount of ARB, which will be distributed by Layer3 at the end of the
            campaign.
          </p>
        </div>
        <div className="flex flex-col justify-center text-lg">
          <div className="flex flex-row w-full justify-end mt-7">
            <button className="bg-continue-button w-40 rounded-md disabled:opacity-25">
              continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
