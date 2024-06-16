import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { useAccount, useBlockNumber } from "wagmi";
import Image from "next/image";
import logo from "/public/chains/arbitrum.png";
import { Warning } from "@/components/Svg";
import { Address, formatUnits } from "viem";
import { cUSDCv3Abi } from "./abi";
import { QuestTemplate } from "../QuestPopUp";

// const MY_ADDRESS = "0x01F0831120AB81F91109e099afB551A091c4c05A"; // optimism test address
// const MY_ADDRESS = "0x1f8700d3a9659c00c504fef25922a1be378949f2"; // arbitrum test address
// get blcok by timestamp https://coins.llama.fi/block/optimism/1718032312

export default function SupplyToken({
  questTemplate,
  myAddress0,
  isConnected,
  setUnlockQuests,
}: {
  questTemplate: QuestTemplate;
  myAddress0: Address;
  isConnected: boolean;
  setUnlockQuests: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [isMinimalSupplyMet, setIsMinimalSupplyMet] = useState(false);
  const [currentBlockNumber, setCurrentBlockNumber] = useState(0n);

  // https://api.coinbase.com/v2/exchange-rates?currency=ETH
  const blockNumberDep = useBlockNumber();
  const balanceOfSuppliedBefore = useReadContract({
    abi: cUSDCv3Abi,
    address: questTemplate.contractAddress,
    args: [myAddress0],
    functionName: "balanceOf",
    blockNumber: questTemplate.questStartBlock,
  });
  const balanceOfSuppliedAfter = useReadContract({
    abi: cUSDCv3Abi,
    address: questTemplate.contractAddress,
    args: [myAddress0],
    functionName: "balanceOf",
    blockNumber: currentBlockNumber,
  });
  useEffect(() => {
    // balanceOfSupplied.data is the balance of the supplied token plus interest
    // so it may be higher than the initial balance
    console.log(
      "🚀 ~ useEffect ~ balanceOfSuppliedBefore.data:",
      balanceOfSuppliedBefore.data
    );
    console.log(
      "🚀 ~ useEffect ~ balanceOfSuppliedAfter.data:",
      balanceOfSuppliedAfter.data
    );
    if (balanceOfSuppliedBefore.isFetched || balanceOfSuppliedAfter.isFetched) {
      const balanceBefore = balanceOfSuppliedBefore.data ?? 0n;
      const balanceAfter = balanceOfSuppliedAfter.data ?? 0n;

      const minimumSupplyUSD = questTemplate.steps[1].minimumSupplyUSD ?? 0;
      const balanceAddedAfterQuestStart = balanceAfter - balanceBefore;
      setIsMinimalSupplyMet(balanceAddedAfterQuestStart > minimumSupplyUSD);
    }
  }, [balanceOfSuppliedBefore, balanceOfSuppliedAfter]);

  useEffect(() => {
    if (blockNumberDep.isFetched && blockNumberDep.data != undefined) {
      setCurrentBlockNumber(blockNumberDep.data);
    }
  }, [blockNumberDep]);

  return (
    <>
      <div className="flex flex-col h-full justify-between text-white">
        <div className="flex flex-col h-full justify-center text-lg">
          <div className="flex flex-row w-full justify-center mb-8">
            <Image src={logo} alt="Logo" width={192} height={192} />
          </div>
          <p className="font-bold text-center">
            {questTemplate.steps[1].label}
          </p>
          <p className="text-center text-sm">
            {questTemplate.steps[1].description}
          </p>

          <div className="flex flex-row w-full justify-center mt-8">
            <a
              href={questTemplate.steps[1].affiliateLink}
              target="_blank"
              className="w-fit py-2 px-4 rounded-md border border-border-button bg-button-bg text-sm"
            >
              Open Compound
            </a>
          </div>
        </div>
        {!isConnected && (
          <button className="text-warning-red text-sm text-center rounded-full border h-11 border-warning-red ">
            <div className="flex flex-row justify-center">
              <Warning /> You are not authenticated!
            </div>
          </button>
        )}
        {!isMinimalSupplyMet && (
          <button className="text-warning-red text-sm text-center rounded-full border h-11 border-warning-red">
            <div className="flex flex-row justify-center">
              <Warning /> Supply minimum not met !
            </div>
          </button>
        )}
        <div className="flex flex-col justify-center text-lg">
          <div className="flex flex-row w-full justify-center mt-7">
            <button
              className="bg-continue-button w-40 rounded-md disabled:opacity-25"
              disabled={!isMinimalSupplyMet}
            >
              continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
