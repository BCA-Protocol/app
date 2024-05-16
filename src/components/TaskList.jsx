import { useState } from "react";
import { classNames } from "@/utils/css-utils";
import { formatTimestamp } from "@/utils/datetime";
import { getTwitterOauthUrl } from "@/providers/TwitterOauthUrl";
import { getDiscordOauthUrl } from "@/providers/DiscordOauthUrl";
import TelegramLogin from "@/providers/TelegramProvider";
import { Web3Provider } from "@/providers/Web3Provider";
import ConnectAndCollectButton from "@/components/ConnectAndCollectButton";
import Image from "next/image";

import cookieImage from "/public/cookie.png";
import lockImage from "/public/lock.svg";

import { Dialog, Transition } from "@headlessui/react";


const TaskList = ({ user, userData, sendEmailVerification }) => {
  const [isOpen, setIsOpen] = useState(false);
    const handleConnectBrowser = async () => {
    try {
      alert('test');
      setIsOpen(false); // Close the popup after the task is completed
    } catch (error) {
      console.error("Error:", error);
      // Handle error if needed
    }
  };
    function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }
  return (
    <div className="items-center justify-center w-full h-full text-center">
      <ul className="relative h-full p-4 space-y-1.5 bg-[#250C3D] border-purple-950 border rounded-xl text-fuchsia-700">
        {/* Connect Wallet */}
        <div className="text-white">Available Sources For Training AI</div>
        <li
        >
          {userData.completedTasks?.hasOwnProperty("generateCookie") ? (
            <>
              <div className="flex flex-col items-start justify-center">
                <div className="font-bold">✓ Smart cookie ⭐⭐⭐</div>
                <div className="pl-4 text-xs">
                  {formatTimestamp(
                    userData.completedTasks?.generateCookie?.created || null
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="relative h-48"> {/* Ensure the container takes up full height */}
  <div className="border border-fuchsia-600 rounded-xl cursor-pointer hover:bg-fuchsia-950 hover:shadow-cyan-500/60 hover:shadow-lg h-full"> {/* Ensure the container takes up full height */}
    <div className="relative h-full px-4 shadow-sm align-items-center justify-center rounded-xl bg-[#250C3D] border-purple-950 border z-30 overflow-hidden bg-[url('/splash-outline.svg')] bg-right bg-no-repeat"> {/* Ensure the container takes up full height */}
      <div className="absolute block w-full border-2 border-b rounded-xl border-fuchsia-700 shrink-0 bg-fuchsia-700 bca-glow-top-small"></div>
      <div className="flex flex-row items-center justify-between space-x-4 h-full"> {/* Ensure the container takes up full height */}
        <div className="text-white font-black cursor-pointer hover:-translate-y-1">
          <Web3Provider className="w-full cursor-pointer hover:-translate-y-1">
            <ConnectAndCollectButton userData={userData} />
          </Web3Provider>
        </div>
        <div className="text-white font-black cursor-pointer hover:-translate-y-1">
          {/* Your content for the right side */}
          <button>
            Test
          </button>
        </div>
      </div>
    </div>
  </div>
</div>


          )}
        </li>
        {/* End of Connect Wallet */}

        {/* Connect Twitter */}
        <li
          className={classNames(
            "flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
            userData.completedTasks?.hasOwnProperty("connectTwitter")
              ? "bg-fuchsia-950"
              : "hover:bg-fuchsia-950 hover:shadow-cyan-500/60 hover:shadow-lg"
          )}
        >
          {userData.completedTasks?.hasOwnProperty("connectTwitter") ? (
            <>
              <div className="flex flex-col items-start justify-center">
                <div className="font-bold">✓ Twitter Connected ⭐⭐⭐</div>
                <div className="pl-4 text-xs">
                  {formatTimestamp(
                    userData.completedTasks?.connectTwitter?.created || null
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-2/3 text-white cursor-pointer hover:-translate-y-1">
                <a href={getTwitterOauthUrl()}>Connect Twitter</a>
              </div>
            </>
          )}
        </li>
        {/* End Of Connect Twitter */}

        {/* Connect Discord */}
        <li
          className={classNames(
            "flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
            userData.completedTasks?.hasOwnProperty("connectDiscord")
              ? "bg-fuchsia-950"
              : "hover:bg-fuchsia-950 hover:shadow-cyan-500/60 hover:shadow-lg"
          )}
        >
          {userData.completedTasks?.hasOwnProperty("connectDiscord") ? (
            <>
              <div className="flex flex-col items-start justify-center">
                <div className="font-bold">✓ Discord Connected ⭐⭐⭐</div>
                <div className="pl-4 text-xs">
                  {formatTimestamp(
                    userData.completedTasks?.connectDiscord?.created || null
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-2/3 text-white cursor-pointer hover:-translate-y-1">
                <a href={getDiscordOauthUrl()}>Connect Discord</a>
              </div>
            </>
          )}
        </li>
        {/* End Of Connect Discord */}

        {/* Connect Telegram */}
        <li
          className={classNames(
            "flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
            userData.completedTasks?.hasOwnProperty("connectTelegram")
              ? "bg-fuchsia-950"
              : "hover:bg-fuchsia-950 hover:shadow-cyan-500/60 hover:shadow-lg"
          )}
        >
          {userData.completedTasks?.hasOwnProperty("connectTelegram") ? (
            <>
              <div className="flex flex-col items-start justify-center">
                <div className="font-bold">✓ Telegram Connected ⭐⭐⭐</div>
                <div className="pl-4 text-xs">
                  {formatTimestamp(
                    userData.completedTasks?.connectTelegram?.created || null
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-2/3 text-white cursor-pointer hover:-translate-y-1">
                <TelegramLogin uid={user.uid} />
              </div>
            </>
          )}
        </li>
        {/* End Of Connect Telegram */}

        {/* Verify email */}
        <li
          className={classNames(
            "flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
            user?.emailVerified
              ? "bg-fuchsia-950"
              : "hover:bg-fuchsia-950 hover:shadow-cyan-500/60 hover:shadow-lg"
          )}
        >
          {user?.emailVerified ? (
            <>
              <div className="flex flex-col items-start justify-center">
                <div className="font-bold">✓ Email verified ⭐</div>
                <div className="pl-4 text-xs">
                  {formatTimestamp(
                    userData.completedTasks?.verifyEmail?.created || null
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  sendEmailVerification(user);
                }}
                className="flex items-center p-2 transition duration-500 ease-in-out transform cursor-pointer select-none rounded-lg text-white disabled:opacity-40 bg-[#383838] to-violet-700 hover:-translate-y-1 hover:shadow-lg disabled:bg-green-400 bg-green"
              >
                <div className="flex pl-1">
                  <div className="font-medium">Verify Email</div>
                </div>
              </button>
            </>
          )}
        </li>
        {/* End of Verify email */}

        {/* Signup */}
        <li className="flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl bg-fuchsia-950">
          <div className="flex flex-col items-start justify-center">
            <div className="font-bold">✓ Account created ⭐</div>
            <div className="pl-4 text-xs">
              {formatTimestamp(
                userData.completedTasks?.createAccount?.created || null
              )}
            </div>
          </div>
        </li>
        <li className="flex flex-row items-center justify-between p-2 text-sm text-center lg:absolute text-gray-100/35">
          {/* <div className="flex flex-col group"> */}
          <div className="flex flex-col items-start justify-center">
            <span className=" underline cursor-pointer">
               The number of points depends of the level of the activity of the data sources connected
              {/* <strong>AIRDROP</strong> */}
            </span>
          </div>
          {/* </div> */}
        </li>
        {/* End of Signup */}
      </ul>
    </div>
  );
};

export default TaskList;
