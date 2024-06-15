import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { useAccount, useBlockNumber } from "wagmi";
import Image from "next/image";
import logo from "/public/chains/optimism.png";
import { Warning } from "@/components/Svg.tsx";
import { formatUnits, Address } from "viem";
import { cUSDCv3Abi } from "./abi";

const MY_ADDRESS = "0x030B3cAF855D1A9496937Fa015ED17Cb5827413E";
const COMPOUND_USDC_CONTRACT_ADDRESS_V3 =
  "0x2e44e174f7D53F0212823acC11C01A11d58c5bCB";
const QUEST_START_BLOCK = 121106130n;
// get blcok by timestamp https://coins.llama.fi/block/optimism/1718032312

export default function BorrowToken({
  minimumBalanceUsd,
}: {
  minimumBalanceUsd: bigint;
}) {
  const { address: myAddress0, isConnected } = useAccount();
  const [isMinimalBorrowMet, setIsMinimalBorrowMet] = useState(false);
  const [priceFeedContractAddress, setPriceFeedContractAddress] =
    useState<Address>("" as Address);

  // https://api.coinbase.com/v2/exchange-rates?currency=ETH

  const balanceOfSupplied = useReadContract({
    abi: cUSDCv3Abi,
    address: COMPOUND_USDC_CONTRACT_ADDRESS_V3,
    args: [MY_ADDRESS],
    functionName: "borrowBalanceOf",
    // blockNumber: QUEST_START_BLOCK,
  });
  const decimals = useReadContract({
    abi: cUSDCv3Abi,
    address: COMPOUND_USDC_CONTRACT_ADDRESS_V3,
    args: [],
    functionName: "decimals",
    // blockNumber: QUEST_START_BLOCK,
  });
  const priceFeedContractAddressDep = useReadContract({
    abi: cUSDCv3Abi,
    address: COMPOUND_USDC_CONTRACT_ADDRESS_V3,
    args: [],
    functionName: "baseTokenPriceFeed",
    // blockNumber: QUEST_START_BLOCK,
  });
  const tokenPrice = useReadContract({
    abi: cUSDCv3Abi,
    address: COMPOUND_USDC_CONTRACT_ADDRESS_V3,
    args: [priceFeedContractAddress],
    functionName: "getPrice",
    // blockNumber: QUEST_START_BLOCK,
  });

  useEffect(() => {
    if (
      (balanceOfSupplied.isFetched ||
        decimals.isFetched ||
        tokenPrice.isFetched) &&
      balanceOfSupplied.data != undefined &&
      decimals.data != undefined &&
      tokenPrice.data != undefined
    ) {
      setIsMinimalBorrowMet(balanceOfSupplied.data > minimumBalanceUsd);
      const baseDecimals = +decimals.data.toString();
      const price = +tokenPrice.data.toString();
      const borrowedInUsd: number =
        +formatUnits(balanceOfSupplied.data, baseDecimals) * price;

      console.log("🚀 ~ borrowedInUsd:", borrowedInUsd);
      setIsMinimalBorrowMet(balanceOfSupplied.data > minimumBalanceUsd);
    }
  }, [balanceOfSupplied, decimals, tokenPrice]);

  useEffect(() => {
    if (
      priceFeedContractAddressDep.isFetched &&
      priceFeedContractAddressDep.data != undefined
    ) {
      setPriceFeedContractAddress(priceFeedContractAddressDep.data);
    }
  }, [priceFeedContractAddressDep]);

  return (
    <>
      <div className="flex flex-col h-full justify-between text-white">
        <div className="flex flex-col h-full justify-center text-lg">
          <div className="flex flex-row w-full justify-center mb-8">
            <Image src={logo} alt="Logo" width={192} height={192} />
          </div>

          <p className="font-bold text-center">Borrow USDC on Compound</p>
          <p className="text-center text-sm">
            Borrow at least 1 USDC via Compound on OP Mainnet.
          </p>

          <div className="flex flex-row w-full justify-center mt-8">
            <a
              href="https://app.compound.finance/?market=usdc-op&utm_source=blockchain-ads&utm_medium=quest&utm_campaign=blockchain-ads-quest-op-mainnet"
              target="_blank"
              className="w-fit py-2 px-4 rounded-md border border-border-button bg-button-bg text-sm"
            >
              Open Compound
            </a>
          </div>
        </div>
        {!isMinimalBorrowMet && (
          <button className="text-warning-red text-sm text-center rounded-full border h-11 border-warning-red">
            <div className="flex flex-row justify-center">
              <Warning /> You need to borrow at least 1 USDC!
            </div>
          </button>
        )}
        <div className="flex flex-col justify-center text-lg">
          <div className="flex flex-row w-full justify-center mt-7">
            <button
              className="bg-continue-button w-40 rounded-md disabled:opacity-25"
              disabled={!balanceOfSupplied}
            >
              continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
