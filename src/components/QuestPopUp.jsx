import { useState, useEffect } from 'react';
import Image from "next/image";
import logo from "/public/bca-left.png";
import mascotHappy from "/public/m/4-small.png";
import mascotLove from "/public/m/8-small.png";
import CheckBalance from "@/components/Quest/CheckBalance.tsx";
import SupplyToken from "@/components/Quest/SupplyToken.tsx";
import BorrowToken from "@/components/Quest/BorrowToken.tsx";

import { LockClosedIcon } from '@heroicons/react/24/solid';

export default function QuestPopUp({ isOpen, onClose, selectedQuest }) {
  const [activeButton, setActiveButton] = useState('Tokens');
  console.log('temp',selectedQuest)

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.modal-content')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const buttons = [
    { label: 'Ensure you have tokens', id: 'Tokens' },
    { label: 'Supply ETH on Compound', id: 'Supply' },
    { label: 'Borrow USDC on Compound', id: 'Borrow' },
    { label: 'Repost the announcement', id: 'Repost' },
    { label: 'Claim the rewards', id: 'Claim' },
  ];

  const renderContent = () => {
    switch (activeButton) {
      case 'Tokens':
        return (
            <CheckBalance minimumBalance={5000000000000000n}/>
        );
      case 'Supply':
        return (
            <SupplyToken minimumBalance={1000000n}/>
        );
      case 'Borrow':
        return (
          <BorrowToken minimumBalance={1000000n}/>
        );
      case 'Repost':
        return (
          <div className='text-white'>
            <p>This is content for Repost</p>
            <p>Additional info for Repost...</p>
          </div>
        );
      case 'Claim':
        return (
          <div className='text-white'>
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
                    className={`text-white bg-[#260C44] hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-3xl text-sm py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 ${
                      activeButton === button.id && 'bg-purple-900'
                    }`}
                    onClick={() => setActiveButton(button.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-7 h-7 flex items-center justify-center bg-[#180924] text-white rounded-3xl ml-2 mr-2">
                          {index===4?<Image
                                        src={mascotLove}
                                        alt="Mascot"
                                        width={40}
                                        className="opacity-100"
                                      />: index + 1}
                        </div>
                        {button.label}
                      </div>
                      <LockClosedIcon className="w-4 h-4 ml-2 mr-4" />
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
