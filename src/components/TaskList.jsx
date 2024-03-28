import { Web3Provider } from "@/providers/Web3Provider";
import { classNames } from "@/utils/css-utils";
import ConnectAndCollectButton from "./ConnectAndCollectButton";
import { formatTimestamp } from "@/utils/datetime";
import { getTwitterOauthUrl } from "@/providers/TwitterOauthUrl";
import TelegramLogin from "@/providers/TelegramProvider";

const TaskList = ({ user, userData, sendEmailVerification }) => {
  const discordOauthUrl =`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_APP_ID}&response_type=code&redirect_uri=${process.env.DISCORD_REDIRECT_URI}&scope=identify+email` 
  console.log('temo', getTwitterOauthUrl());
  return (
    <div className="items-center justify-center w-full h-full text-center">
      <ul className="h-full p-4 space-y-2 bg-black border border-fuchsia-700 rounded-xl text-fuchsia-700">
        <li className="mb-4 font-bold">Available tasks</li>

        {/* Connect Wallet */}
        <li
          className={classNames(
            "flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
            userData.completedTasks?.hasOwnProperty("generateCookie")
              ? "bg-fuchsia-950"
              : "hover:bg-fuchsia-950 hover:shadow-cyan-500/60 hover:shadow-lg"
          )}
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
              <span className="w-1/5 text-sm font-bold text-fuchsia-600">
                50,000 Points
              </span>
            </>
          ) : (
            <>
              <Web3Provider className="w-2/3 cursor-pointer hover:-translate-y-1">
                <ConnectAndCollectButton userData={userData} />
              </Web3Provider>
              <span className="w-1/5 text-sm text-gray-100">50,000 Points</span>
            </>
          )}
        </li>
        {/* End of Connect Wallet */}
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
              <span className="w-1/5 text-sm font-bold text-fuchsia-600">
                50,000 Points
              </span>
            </>
          ) : (
            <>
              <div className="w-2/3 cursor-pointer text-white hover:-translate-y-1">
                <a href={getTwitterOauthUrl()}>Connect Twitter</a>
              </div>
              <span className="w-1/5 text-sm text-gray-100">50,000 Points</span>
            </>
          )}
        </li>
        {/* End Of Connect Twitter */}
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
              <span className="w-1/5 text-sm font-bold text-fuchsia-600">
                50,000 Points
              </span>
            </>
          ) : (
            <>
              <div className="w-2/3 cursor-pointer text-white hover:-translate-y-1">
                <a href={discordOauthUrl}>
                  Connect Discord
                </a>
              </div>
              <span className="w-1/5 text-sm text-gray-100">50,000 Points</span>
            </>
          )}
        </li>
        {/* End Of Connect Discord */}
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
              <span className="w-1/5 text-sm font-bold text-fuchsia-600">
                50,000 Points
              </span>
            </>
          ) : (
            <>
              <div className="w-2/3 cursor-pointer text-white hover:-translate-y-1">
                <TelegramLogin uid={user.uid}/>
              </div>
              <span className="w-1/5 text-sm text-gray-100">50,000 Points</span>
            </>
          )}
        </li>
        {/* End Of Connect Telegram */}
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
              <span className="w-1/5 text-sm font-bold text-fuchsia-600">
                10,000 Points
              </span>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  sendEmailVerification(user);
                }}
                className="flex items-center p-2 transition duration-500 ease-in-out transform cursor-pointer select-none rounded-xl text-white disabled:opacity-40 bg-[#383838] to-violet-700 hover:-translate-y-1 hover:shadow-lg disabled:bg-green-400 bg-green"
              >
                <div className="flex pl-1">
                  <div className="font-medium">Verify Email</div>
                </div>
              </button>
              <span className="w-1/5 text-sm text-gray-100">10,000 Points</span>
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
          <span className="w-1/5 text-sm font-bold">10,000 Points</span>
        </li>
        {/* End of Signup */}
      </ul>
    </div>
  );
};

export default TaskList;
