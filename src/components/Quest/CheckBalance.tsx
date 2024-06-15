import { useState, useEffect } from "react";
import { useBalance } from "wagmi";
import { useAccount } from "wagmi";
import { formatUnits, Address } from "viem";
import Image from "next/image";
import logo from "/public/chains/optimism.png";
import { Warning } from "@/components/Svg.tsx";

export default function CheckBalance({
  minimumBalance,
  myAddress0,
  isConnected,
}: {
  minimumBalance: bigint;
  myAddress0: Address;
  isConnected: boolean;
}) {
  console.log("🚀 ~ isConnected:", isConnected);
  const balanceInfo = useBalance({
    address: myAddress0,
  });
  const [isMinimalMet, setIsMinimalMet] = useState(false);

  useEffect(() => {
    if (balanceInfo.isFetched && !!balanceInfo.data) {
      setIsMinimalMet(balanceInfo.data.value > minimumBalance);
    }
  }, [balanceInfo]);

  return (
    <>
      <div className="flex flex-col h-full justify-between text-white">
        <div className="flex flex-col h-full justify-center text-lg">
          <div className="flex flex-row w-full justify-center mb-8">
            <Image src={logo} alt="Logo" width={192} height={192} />
          </div>

          <p className="font-bold text-center">
            The next step is on OP Mainnet
          </p>
          <p className="text-center text-sm">
            Make sure you have at least{" "}
            <span className="font-bold">0.005 ETH.</span>
          </p>

          <div className="flex flex-row w-full justify-center mt-8">
            <a
              href="https://app.layer3.xyz/bridge?toChainId=10&toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
              target="_blank"
              className="w-fit py-2 px-4 rounded-md border border-border-button bg-button-bg text-sm"
            >
              Open Compound
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-center text-lg">
          {!isConnected && (
            <button className="text-warning-red text-sm text-center rounded-full border h-11 border-warning-red ">
              <div className="flex flex-row justify-center">
                <Warning /> You are not authenticated!
              </div>
            </button>
          )}
          {!isMinimalMet && isConnected && (
            <button className="text-warning-red text-sm text-center rounded-full border h-11 border-warning-red">
              <div className="flex flex-row justify-center">
                <Warning /> You don&apos;t have enough balance!
              </div>
            </button>
          )}
          <div className="flex flex-row w-full justify-center mt-7">
            <button
              className="bg-continue-button w-40 rounded-md disabled:opacity-25"
              disabled={!isMinimalMet || !isConnected}
            >
              continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
