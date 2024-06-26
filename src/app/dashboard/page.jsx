"use client";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserByUUID, getUserActivity } from "@/utils/utils";
import { formatLargeNumber } from "@/utils/helper";
import { sendEmailVerification } from "firebase/auth";
import ReferalChart from "@/components/ReferalChart";
import TaskList from "@/components/TaskList";
import Loader from "@/components/loader";

import animation from "/public/animation.gif";
import mascotSad from "/public/m/1-small.png";
import mascotLove from "/public/m/8-small.png";
import mascotHappy from "/public/m/7-small.png";

import cookieImage from "/public/cookie.png";
import lockImage from "/public/lock.svg";

import Notification from "@/components/notifications/notification";
import Image from "next/image";
import { Web3Provider } from "@/providers/Web3Provider";
import ConnectAndCollectButton from "@/components/ConnectAndCollectButton";

import baseLogo from "/public/chains/base.png";
import arbitrumLogo from "/public/chains/arbitrum.png";
import bnbLogo from "/public/chains/bnb.png";
import optimismLogo from "/public/chains/optimism.png";

export default function Page() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [userActivity, setUserActivity] = useState([]);

  const router = useRouter();
  const params = useSearchParams()
  const errorSocial = params.get("error_message");
  useEffect(() => {
    const fetchIncompleteTasks = async () => {
      if (!user) {
        router.replace("/");
        return;
      }
      try {
        setLoading(true);
        const userDataRes = await getUserByUUID(user.uid);
        // taskData && setIncompleteTasks(taskData);
        userDataRes && setUserData(userDataRes);

        const fullUserActivity = await getUserActivity(user.uid);
        setUserActivity(fullUserActivity);
        setLoading(false);
        // Check if error_message exists in params
      if (errorSocial) {
        setNotification({
          type: "error",
          message: errorSocial,
          show: true,
        });
        // const newParams = new URLSearchParams(params.toString());
        // newParams.delete("error_message");
        // router.replace('/dashboard', undefined, { shallow: true });
      }
      } catch (error) {
        console.error("Error fetching incomplete tasks:", error);
        setLoading(false);
      }
    };
    fetchIncompleteTasks();
  }, [router, user]);

  const handleTask = async (user) => {
    try {
      setLoading(true);
      await sendEmailVerification(user);
      setNotification({
        type: "success",
        message: "Verification email sent successfully",
        show: true,
      });
    } catch (error) {
      if (error.code === "auth/too-many-requests") {
        setNotification({
          type: "error",
          message: "Too many requests. Please try again later.",
          show: true,
        });
      } else {
        setNotification({
          type: "error",
          message: "Failed to send verification email: " + error.message,
          show: true,
        });
      }
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <Loader show={loading} />}
      {notification && notification.show && (
        <Notification message={notification.message} type={notification.type} />
      )}
      {userData && (
        <>
          <div className="px-2">
            <div className="flex items-center justify-center w-full pt-0 text-center">
              <div class="w-2/5 relative pt-0 z-10">
                <div className="absolute block w-full border-2 border-b rounded-xl border-fuchsia-700 shrink-0 bg-fuchsia-700 bca-glow-top"></div>
              </div>
            </div>
            <div className="gap-4 lg:grid lg:grid-cols-3">
              <div className="col-span-2 mb-4 lg:mb-0">
                <div className="flex flex-col items-center justify-center w-full px-8 py-8 space-y-6 font-bold text-center text-white lg:h-16 lg:px-32 lg:py-32">
                  <div className="flex flex-col items-start justify-center w-full text-4xl lg:text-6xl">
                    <span>Train AI with</span>
                    <span>your own data</span>
                  </div>
                  <div className="flex items-start justify-start w-full lg:items-center">
                    <span className="text-base font-normal lg:text-xl">
                      Completely decentralized and in your control
                    </span>
                  </div>
                </div>
                <div className="flex flex-col p-4 bg-[#250C3D] border-purple-950 border lg:h-48 align-items-center rounded-xl">
                  <div className="mb-2 text-lg font-semibold text-white">
                    Points
                  </div>
                  <div className="gap-6 lg:grid lg:grid-cols-2">
                    <div className="relative overflow-hidden flex items-center justify-start w-full px-6 py-4 mb-4 bg-purple-900 rounded-xl lg:mb-0 bca-purple-glow-inside bg-[url('/splash-pink.svg')] bg-right bg-no-repeat">
                      <div className="flex w-full">
                        <div className="flex flex-col items-start justify-center w-1/2 pr-8 font-semibold text-white">
                          <div className="flex flex-col w-1/2 text-base leading-5 text-purple-300">
                            Your Points
                          </div>
                          <div className="text-3xl font-bold tracking-wide">
                            {formatLargeNumber(
                              (userData.totalPoints || 1) -
                                1 +
                                ((userData.referralPoints || 1) - 1)
                            )}{" "}
                          </div>
                        </div>

                        <div className="absolute right-0 flex items-center justify-center object-contain w-1/2 space-x-2 text-3xl font-bold text-white -bottom-4 shrink-0">
                          <Image src={mascotLove} alt="Logo" height={128} />
                          <div className="absolute inset-0 gradient-opacity-purple"></div>
                        </div>
                      </div>
                    </div>

                    <div className="relative overflow-hidden flex items-center justify-start w-full px-6 py-4 mb-4 bg-fuchsia-700 rounded-xl lg:mb-0 bca-fuchsia-glow-inside bg-[url('/splash-purple.svg')] bg-right-top bg-no-repeat">
                      <div className="flex w-full">
                        <div className="flex flex-col items-start justify-center w-1/2 pr-8 font-semibold text-white">
                          <div className="flex flex-col w-1/2 text-base leading-5 text-purple-300">
                            Referral Points
                          </div>
                          <div className="text-3xl font-bold tracking-wide">
                            {formatLargeNumber(
                              (userData.referralPoints || 1) - 1
                            )}{" "}
                          </div>
                        </div>

                        <div className="absolute right-0 flex items-center justify-center object-contain w-1/2 space-x-2 text-3xl font-bold text-white -bottom-4 shrink-0">
                          {(userData.referralPoints || 1) - 1 > 0 ? (
                            <Image src={mascotHappy} alt="Logo" height={128} />
                          ) : (
                            <Image
                              src={mascotSad}
                              alt="Logo"
                              height={128}
                              className=""
                            />
                          )}
                          <div className="absolute inset-0 gradient-opacity-pink"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="mt-2 ml-2 text-xs text-center text-gray-400">
                  * points will be converted into BCA tokens
                </div> */}
              </div>
              <div className="">
                <div className="relative flex flex-col items-center justify-center object-cover font-bold text-center text-white lg:h-16 lg:px-32 lg:py-32">
                  <Image
                    src={animation}
                    alt="Animation"
                    className="absolute inset-0 max-h-[240px]"
                  />
                </div>
                {/* <div className="relative flex flex-col items-center justify-center border-2 border-b rounded-xl border-fuchsia-900 shrink-0 bg-fuchsia-900 text-white overflow-hidden bg-[url('/splash-outline.svg')] bg-right bg-no-repeat">    */}
                  <div className="flex flex-col items-center justify-end h-8 py-2 -mt-4 text-sm font-normal text-center text-fuchsia-300/80">
                    <span>Audited by SecuryX 🔐</span>
                  </div>
                  {/* <div className="font-bold">Connect and Earn</div> */}
                {/* </div> */}
              </div>
            </div>
            <div className="gap-4 lg:grid lg:grid-cols-12">
              <div className="col-span-4 relative flex flex-col justify-center lg:h-[13.5rem] lg:w-full">
                <div className="mt-4">
                  <TaskList
                    sendEmailVerification={handleTask}
                    user={user}
                    userData={userData}
                  />
                </div>
              </div>

              <div className="order-first col-span-8 mt-4">
                <div className="">
                  <ReferalChart userActivity={userActivity} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
