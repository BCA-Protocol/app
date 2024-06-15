import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { useAccount, useBlockNumber } from "wagmi";
import Image from "next/image";
import logo from "/public/chains/optimism.png";
import { Warning } from "@/components/Svg.tsx";
import { formatUnits } from "viem";
import { cUSDCv3Abi } from "./abi";


const MY_ADDRESS = "0x01F0831120AB81F91109e099afB551A091c4c05A";
const COMPOUND_USDC_CONTRACT_ADDRESS_V3 =
  "0x2e44e174f7D53F0212823acC11C01A11d58c5bCB";
const QUEST_START_BLOCK = 121106130n;
// get blcok by timestamp https://coins.llama.fi/block/optimism/1718032312

export default function SupplyToken({
  minimumBalance,
}: {
  minimumBalance: bigint;
}) {
  const { address: myAddress0, isConnected } = useAccount();
  const [isMinimalSupplyMet, setIsMinimalSupplyMet] = useState(false);
  // https://api.coinbase.com/v2/exchange-rates?currency=ETH

  const balanceOfSupplied = useReadContract({
    abi:cUSDCv3Abi,
    address: COMPOUND_USDC_CONTRACT_ADDRESS_V3,
    args: [MY_ADDRESS],
    functionName: "balanceOf",
    // blockNumber: QUEST_START_BLOCK,
  });
  useEffect(() => {
    // balanceOfSupplied.data is the balance of the supplied token plus interest
    // so it may be higher than the initial balance
    if (balanceOfSupplied.isFetched && balanceOfSupplied.data != undefined) {
      setIsMinimalSupplyMet(balanceOfSupplied.data > minimumBalance);
    }
  }, [balanceOfSupplied]);

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
            <a
              href="https://app.compound.finance/?market=usdc-op&utm_source=blockchain-ads&utm_medium=quest&utm_campaign=blockchain-ads-quest-op-mainnet"
              target="_blank"
              className="w-fit py-2 px-4 rounded-md border border-border-button bg-button-bg text-sm"
            >
              Open Compound
            </a>
          </div>
        </div>
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
