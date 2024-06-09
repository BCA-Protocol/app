import { useState, useEffect } from "react";
import { useBalance, useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import Image from "next/image";
import logo from "/public/chains/optimism.png";
import { Warning } from "@/components/Svg.tsx";

const MY_ADDRESS = "0xAFcf24E00D67A4857A31734a69C13cD2C0D7219e";
const USDC_CONTRACT_ADDRESS_V3 = "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";
const COMPOUND_USDC_CONTRACT_ADDRESS_V3 =
  "0x2e44e174f7D53F0212823acC11C01A11d58c5bCB";

export default function SupplyToken() {
  const { address: myAddress0, isConnected } = useAccount();
  const abi = [
    {
      type: "function",
      name: "collateralBalanceOf",
      stateMutability: "view",
      inputs: [
        { name: "account", type: "address" },
        { name: "asset", type: "address" },
      ],
      outputs: [{ type: "uint128" }],
    },
  ] as const;

  const result = useReadContract({
    abi,
    address: COMPOUND_USDC_CONTRACT_ADDRESS_V3,
    args: [MY_ADDRESS, USDC_CONTRACT_ADDRESS_V3],
    functionName: "collateralBalanceOf",
  });
  console.log("🚀 ~ Info ~ result:", result.data);

  return (
    <>
      <div className="flex flex-col h-full justify-between text-white">
        <div className="flex flex-col h-full justify-center text-lg">
          <div className="flex flex-row w-full justify-center mb-8">
            <Image src={logo} alt="Logo" width={192} height={192} />
          </div>

          <p className="font-bold text-center">Supply ETH on Compound</p>
          <p className="text-center text-sm">
            Supply at least 0.005 ETH via Compound on OP Mainnet.
          </p>

          <div className="flex flex-row w-full justify-center mt-8">
            <button className="w-fit py-2 px-4 rounded-md border border-border-button bg-button-bg text-sm">
              Open Compound
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-center text-lg">
          <div className="flex flex-row w-full justify-center mt-7">
            <button
              className="bg-continue-button w-40 rounded-md disabled:opacity-25"
              disabled={false}
            >
              continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
