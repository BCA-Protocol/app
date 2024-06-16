import { useState } from "react";
import { classNames } from "@/utils/css-utils";
import { formatTimestamp } from "@/utils/datetime";
import { getTwitterOauthUrl } from "@/providers/TwitterOauthUrl";
import { getDiscordOauthUrl } from "@/providers/DiscordOauthUrl";
import TelegramLogin from "@/providers/TelegramProvider";
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
      <ul className="relative h-full p-4 space-y-4 bg-[#250C3D] border-purple-950 border rounded-xl text-fuchsia-700">
        {/* Connect Wallet */}
        <div className="text-white">Available Data Sources To Monetize</div>
        <li
        >
          {userData?.completed_tasks?.hasOwnProperty("generateCookie") ? (
            <>
              <div className="flex flex-col items-start justify-center">
                <div className="font-bold">✓ Smart cookie ⭐⭐⭐</div>
                <div className="pl-4 text-xs">
                  {formatTimestamp(
                    userData?.completed_tasks?.generateCookie?.created || null
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="">
                  <div className="relative flex flex-col h-48 px-4 shadow-sm align-items-center rounded-xl bg-[#250C3D] border-purple-950 border z-30 overflow-hidden bg-[url('/splash-outline.svg')] bg-right bg-no-repeat">
                    <div className="flex items-center justify-center w-full pt-0 text-center">
                      <div class="w-2/5 relative pt-0 z-10">
                        <div className="absolute block w-full border-2 border-b rounded-xl border-fuchsia-700 shrink-0 bg-fuchsia-700 bca-glow-top-small"></div>
                      </div>
                    </div>

                    <div className="absolute inset-0 top-14 left-6">
                      <Image
                        src={lockImage}
                        alt="Lock"
                        width={42}
                        className="opacity-80"
                      />
                    </div>
                    <div className="absolute inset-0 top-16 left-10">
                      <Image
                        src={cookieImage}
                        alt="Cookie"
                        width={42}
                        className="opacity-80"
                      />
                    </div>
                    <div className="w-full cursor-pointer hover:-translate-y-1">
                      <ConnectAndCollectButton userData={userData} />
                    </div>
                  </div>
                </div>
          )}
        </li>
        {/* End of Connect Wallet */}

        {/* Connect Twitter */}
        <li>
          {userData?.completed_tasks?.hasOwnProperty("connectTwitter") ? (
            <div
              className={classNames(
                "flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
                "bg-fuchsia-950"
              )}
            >
              <div className="flex flex-col items-start justify-center">
                <div className="font-bold">✓ Twitter Connected ⭐⭐⭐</div>
                <div className="pl-4 text-xs">
                  {formatTimestamp(
                    userData?.completed_tasks?.connectTwitter?.created || null
                  )}
                </div>
              </div>
            </div>
          ) : (
            <a
              href={getTwitterOauthUrl()}
              className={classNames(
                "flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
                "hover:bg-fuchsia-950 hover:shadow-cyan-500/60 hover:shadow-lg cursor-pointer hover:-translate-y-1"
              )}
            >
              <div className="w-2/3 text-white">
                Connect Twitter
              </div>
            </a>
          )}
        </li>
        {/* End Of Connect Twitter */}

        {/* Connect Discord */}
        <li>
          {userData?.completed_tasks?.hasOwnProperty("connectDiscord") ? (
            <div
              className={classNames(
                "flex items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
                "bg-fuchsia-950"
              )}
            >
              <div className="flex flex-col items-start justify-center">
                <div className="font-bold">✓ Discord Connected ⭐⭐⭐</div>
                <div className="pl-4 text-xs">
                  {formatTimestamp(
                    userData?.completed_tasks?.connectDiscord?.created || null
                  )}
                </div>
              </div>
            </div>
          ) : (
            <a
              href={getDiscordOauthUrl()}
              className={classNames(
                "flex items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
                "hover:bg-fuchsia-950 hover:shadow-cyan-500/60 hover:shadow-lg cursor-pointer hover:-translate-y-1"
              )}
            >
              <div className="w-2/3 text-white ">
                Connect Discord
              </div>
            </a>
          )}
        </li>
        {/* End Of Connect Discord */}

        {/* Connect Telegram */}
        <li>
          {userData?.completed_tasks?.hasOwnProperty("connectTelegram") ? (
            <div
              className={classNames(
                "flex items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
                "bg-fuchsia-950"
              )}
            >
              <div className="flex flex-col items-start justify-center">
                <div className="font-bold">✓ Telegram Connected ⭐⭐⭐</div>
                <div className="pl-4 text-xs">
                  {formatTimestamp(
                    userData?.completed_tasks?.connectTelegram?.created || null
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={classNames(
                "flex items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
                "hover:bg-fuchsia-950 hover:shadow-cyan-500/60 hover:shadow-lg cursor-pointer hover:-translate-y-1"
              )}>
              <div className="w-2/3 ml-2 text-white cursor-pointer hover:-translate-y-1">
                <TelegramLogin uid={user?.id} />
              </div>
            </div>
          )}
        </li>
        {/* End Of Connect Telegram */}

        {/* Verify email */}
        <li>
          {user?.email_confirmed_at ? (
            <div
              className={classNames(
                "flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
                "bg-fuchsia-950"
              )}
            >
              <div className="flex flex-col items-start justify-center">
                <div className="font-bold">✓ Email verified ⭐</div>
                <div className="pl-4 text-xs">
                  {formatTimestamp(
                    userData?.completed_tasks?.verifyEmail?.created || null
                  )}
                </div>
              </div>
            </div>
          ) : (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                sendEmailVerification(user);
              }}
              className={classNames(
                "flex items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
                "hover:bg-fuchsia-950 hover:shadow-cyan-500/60 hover:shadow-lg cursor-pointer hover:-translate-y-1"
              )}
            >
              <div className="w-2/3 -ml-3 text-white cursor-pointer hover:-translate-y-1">
                <div className="font-medium">Verify Email</div>
              </div>
            </a>
          )}
        </li>
        {/* End of Verify email */}

        {/* Signup */}
        <li className="flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl bg-fuchsia-950">
          <div className="flex flex-col items-start justify-center">
            <div className="font-bold">✓ Account created ⭐</div>
            <div className="pl-4 text-xs">
              {formatTimestamp(
                userData?.completed_tasks?.createAccount?.created || null
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
