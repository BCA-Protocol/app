import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "/public/bca-left.png";
import mascotHappy from "/public/m/4-small.png";
import mascotLove from "/public/m/8-small.png";
import CheckBalance from "@/components/Quest/CheckBalance";
import SupplyToken from "@/components/Quest/SupplyToken";
import BorrowToken from "@/components/Quest/BorrowToken";
import RewardDescription from "@/components/Quest/RewardDescription";
import { arbitrum, optimism } from "wagmi/chains";
import { Address } from "viem";
import { LockClosedIcon } from "@heroicons/react/24/solid";

export type QuestTemplate = {
  chainId: number;
  name: string;
  description: string;
  contractAddress: Address;
  questStartBlock: bigint;
  steps: {
    label: string;
    id: string;
    minimumBalance?: bigint | undefined;
    minimumBorrowUsd?: number | undefined;
    minimumSupplyUSD?: number | undefined;
    description?: string | undefined;
    title?: string | undefined;
    affiliateLink?: string | undefined;
  }[];
};

export default function QuestPopUp({
  isOpen,
  onClose,
  selectedQuest,
  myAddress0,
  isConnected,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedQuest: any;
  myAddress0: Address;
  isConnected: boolean;
}) {
  const questId = 1;
  const questTemplate: QuestTemplate[] = [
    {
      chainId: optimism.id,
      name: "Optimism Borrow",
      description: "Quest Borrow",
      contractAddress: "0x2e44e174f7D53F0212823acC11C01A11d58c5bCB", // https://optimistic.etherscan.io/token/0x2e44e174f7D53F0212823acC11C01A11d58c5bCB
      questStartBlock: BigInt(121106130),
      steps: [
        {
          label: "Ensure you have tokens",
          id: "Tokens",
          minimumBalance: BigInt(5000000000000000),
        },
        {
          label: "Supply ETH on Compound",
          id: "Supply",
          minimumSupplyUSD: 1,
          affiliateLink:
            "https://app.compound.finance/?market=usdc-op&utm_source=blockchain-ads&utm_medium=quest&utm_campaign=blockchain-ads-quest-usdc-arb-mainnet",
          description:
            "Supply USDC via Compound on the Arbitrum network. The more USDC you supply, the more points you'll earn",
        },
        { label: "Borrow USDC on Compound", id: "Borrow", minimumBorrowUsd: 1 },
        { label: "Repost the announcement", id: "Repost" },
        { label: "Claim the rewards", id: "Claim" },
      ],
    },
    {
      chainId: arbitrum.id,
      name: "Arbitrum Borrow",
      description: "Quest Borrow",
      contractAddress: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf", // https://arbiscan.io/address/0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf
      questStartBlock: BigInt(121106130),
      //  222434456
      steps: [
        {
          label: "Reward for this quest",
          id: "Reward description",
          description:
            "Supply USDC on the Arbitrum market through Compound to earn daily points based on your total value locked (TVL). The more USD you supply, the more points you'll earn Each point will be worth a set amount of ARB, which will be distributed by Layer3 at the end of the campaign.",
        },
        {
          label: "Supply USDC via Compound",
          id: "Supply",
          minimumSupplyUSD: 1,
          affiliateLink:
            "https://app.compound.finance/?market=usdc-arb&utm_source=blockchain-ads&utm_medium=quest&utm_campaign=blockchain-ads-quest-usdc-arb-mainnet",
          description:
            "Supply USDC via Compound on the Arbitrum network. The more USDC you supply, the more points you'll earn",
        },
        { label: "Claim the rewards", id: "Claim" },
      ],
    },
  ];
  const [activeButton, setActiveButton] = useState(
    questTemplate[questId].steps[0].id
  );
  const [unlockQuests, setUnlockQuests] = useState<string[]>([
    "Reward description",
  ]);

  console.log("temp", selectedQuest);

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (!e.target.closest(".modal-content")) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const buttons = questTemplate[questId].steps;

  const renderContent = () => {
    switch (activeButton) {
      case "Reward description":
        return (
          <RewardDescription
            unlockQuests={unlockQuests}
            setUnlockQuests={setUnlockQuests}
            setActiveButton={setActiveButton}
          />
        );
      case "Tokens":
        return (
          <CheckBalance
            minimumBalance={BigInt(5000000000000000)}
            myAddress0={myAddress0}
            isConnected={isConnected}
          />
        );
      case "Supply":
        return (
          <SupplyToken
            questTemplate={questTemplate[questId]}
            myAddress0={myAddress0}
            isConnected={isConnected}
            setUnlockQuests={setUnlockQuests}
            setActiveButton={setActiveButton}
          />
        );
      case "Borrow":
        return (
          <BorrowToken
            questTemplate={questTemplate[questId]}
            myAddress0={myAddress0}
            isConnected={isConnected}
          />
        );
      case "Repost":
        return (
          <div className="text-white">
            <p>This is content for Repost</p>
            <p>Additional info for Repost...</p>
          </div>
        );
      case "Claim":
        return (
          <div className="text-white">
            <p>This is content for Claim</p>
            <p>Additional info for Claim...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="modal-content relative h-full w-full max-w-6xl border-2 border-b rounded-3xl bg-[#250C3D] border-purple-950 border flex">
            {/* Left Section (Sidebar) */}
            <div className="h-full w-1/3 flex flex-col justify-between bg-gradient-to-r from-[#210D30] to-[#180924] py-4 px-6 border-b rounded-l-3xl border-purple-950">
              <div className="flex items-center justify-left">
                <div className="w-full mt-8 mb-8">
                  <Image src={logo} alt="Logo" width={120} height={120} />
                </div>
                <h3 className="text-2xl font-medium text-white">
                  {selectedQuest?.name}
                </h3>
              </div>
              <div className="py-4 flex flex-col space-y-4">
                <h3 className="text-md font-medium text-white">
                  Finish All Steps
                </h3>
                {buttons.map((button, index) => (
                  <button
                    key={button.id}
                    className={`text-white bg-[#260C44] ${
                      !!unlockQuests.includes(button.id) &&
                      "hover:bg-purple-800"
                    } focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-3xl text-sm py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 ${
                      activeButton === button.id && "bg-purple-900"
                    }`}
                    onClick={() => setActiveButton(button.id)}
                    disabled={!unlockQuests.includes(button.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-7 h-7 flex items-center justify-center bg-[#180924] text-white rounded-3xl ml-2 mr-2">
                          {index === 4 ? (
                            <Image
                              src={mascotLove}
                              alt="Mascot"
                              width={40}
                              className="opacity-100"
                            />
                          ) : (
                            index + 1
                          )}
                        </div>
                        {button.label}
                      </div>
                      {!unlockQuests.includes(button.id) && (
                        <LockClosedIcon className="w-4 h-4 ml-2 mr-4" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center w-full mt-8">
                <Image
                  src={mascotHappy}
                  alt="Mascot"
                  width={160}
                  className="cursor-pointer opacity-30 hover:opacity-100"
                />
              </div>
            </div>

            {/* Right Section (Content) */}
            <div className="p-4 md:p-5 space-y-4 w-2/3 overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
