import { classNames } from "@/utils/css-utils";
import { formatTimestamp } from "@/utils/datetime";
import { getTwitterOauthUrl } from "@/providers/TwitterOauthUrl";
import { getDiscordOauthUrl } from "@/providers/DiscordOauthUrl";
import TelegramLogin from "@/providers/TelegramProvider";

const TaskList = ({ user, userData, sendEmailVerification }) => {
  return (
    <div className="items-center justify-center w-full h-full text-center">
      <ul className="relative h-full p-4 space-y-2 bg-[#250C3D] border-purple-950 border rounded-xl text-fuchsia-700">
        <li className="mb-4 font-bold text-fuchsia-200">
          Available Sources for Training AI
        </li>

        {/* Connect Wallet */}
        {/* <li
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
              <Web3Provider className="w-full cursor-pointer hover:-translate-y-1">
                <ConnectAndCollectButton userData={userData} />
              </Web3Provider>
              <span className="w-1/5 text-sm text-gray-100">50,000 Points</span>
            </>
          )}
        </li> */}
        {/* End of Connect Wallet */}

        {/* Connect Twitter */}
        <li
          className={classNames(
            "flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
            userData?.completed_tasks?.hasOwnProperty("connectTwitter")
              ? "bg-fuchsia-950"
              : "hover:bg-fuchsia-950 hover:shadow-cyan-500/60 hover:shadow-lg"
          )}
        >
          {userData?.completed_tasks?.hasOwnProperty("connectTwitter") ? (
            <>
              <div className="flex flex-col items-start justify-center">
                <div className="font-bold">✓ Twitter Connected ⭐⭐⭐</div>
                <div className="pl-4 text-xs">
                  {formatTimestamp(
                    userData?.completed_tasks?.connectTwitter?.created || null
                  )}
                </div>
              </div>
              <span className="w-1/5 text-sm font-bold text-fuchsia-600">
                30,000 Points
              </span>
            </>
          ) : (
            <>
              <div className="w-2/3 text-white cursor-pointer hover:-translate-y-1">
                <a href={getTwitterOauthUrl()}>Connect Twitter</a>
              </div>
              <span className="w-1/5 text-sm font-bold text-fuchsia-600">
                30,000 Points
              </span>
            </>
          )}
        </li>
        {/* End Of Connect Twitter */}

        {/* Connect Discord */}
        <li
          className={classNames(
            "flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
            userData?.completed_tasks?.hasOwnProperty("connectDiscord")
              ? "bg-fuchsia-950"
              : "hover:bg-fuchsia-950 hover:shadow-cyan-500/60 hover:shadow-lg"
          )}
        >
          {userData?.completed_tasks?.hasOwnProperty("connectDiscord") ? (
            <>
              <div className="flex flex-col items-start justify-center">
                <div className="font-bold">✓ Discord Connected ⭐⭐⭐</div>
                <div className="pl-4 text-xs">
                  {formatTimestamp(
                    userData?.completed_tasks?.connectDiscord?.created || null
                  )}
                </div>
              </div>
              <span className="w-1/5 text-sm font-bold text-fuchsia-600">
                30,000 Points
              </span>
            </>
          ) : (
            <>
              <div className="w-2/3 text-white cursor-pointer hover:-translate-y-1">
                <a href={getDiscordOauthUrl()}>Connect Discord</a>
              </div>
              <span className="w-1/5 text-sm font-bold text-fuchsia-600">
                30,000 Points
              </span>
            </>
          )}
        </li>
        {/* End Of Connect Discord */}

        {/* Connect Telegram */}
        <li
          className={classNames(
            "flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl",
            userData?.completed_tasks?.hasOwnProperty("connectTelegram")
              ? "bg-fuchsia-950"
              : "hover:bg-fuchsia-950 hover:shadow-cyan-500/60 hover:shadow-lg"
          )}
        >
          {userData?.completed_tasks?.hasOwnProperty("connectTelegram") ? (
            <>
              <div className="flex flex-col items-start justify-center">
                <div className="font-bold">✓ Telegram Connected ⭐⭐⭐</div>
                <div className="pl-4 text-xs">
                  {formatTimestamp(
                    userData?.completed_tasks?.connectTelegram?.created || null
                  )}
                </div>
              </div>
              <span className="w-1/5 text-sm font-bold text-fuchsia-600">
                30,000 Points
              </span>
            </>
          ) : (
            <>
              <div className="w-2/3 text-white cursor-pointer hover:-translate-y-1">
                <TelegramLogin uid={user?.id} />
              </div>
              <span className="w-1/5 text-sm font-bold text-fuchsia-600">
                30,000 Points
              </span>
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
                    userData?.completed_tasks?.verifyEmail?.created || null
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
                className="flex items-center p-2 transition duration-500 ease-in-out transform cursor-pointer select-none rounded-lg text-white disabled:opacity-40 bg-[#383838] to-violet-700 hover:-translate-y-1 hover:shadow-lg disabled:bg-green-400 bg-green"
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
                userData?.completed_tasks?.createAccount?.created || null
              )}
            </div>
          </div>
          <span className="w-1/5 text-sm font-bold text-fuchsia-600">
            10,000 Points
          </span>
        </li>
        <li className="flex items-center justify-center text-sm text-center lg:absolute text-gray-100/35 bottom-2">
          <div className="flex flex-col group">
            <span className="hidden p-2 border rounded-md border-fuchsia-600 bg-fuchsia-950 group-hover:block text-fuchsia-100/60">
              A snapshot will be made from the
              <br /> AI-cookie smart contract.
            </span>
            <span className="underline cursor-pointer">
              <strong>Tier 3</strong> Contributors are eligible for{" "}
              <strong>AIRDROP</strong>
            </span>
          </div>
        </li>
        {/* End of Signup */}
      </ul>
    </div>
  );
};

export default TaskList;
