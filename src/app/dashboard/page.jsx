"use client";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getUserByUUID, getUserActivity } from "@/utils/utils";
import { formatLargeNumber } from "@/utils/helper";
import { sendEmailVerification } from "firebase/auth";
import ReferalChart from "@/components/ReferalChart";
import TaskList from "@/components/TaskList";
import Loader from "@/components/loader";
import logo from "/public/logo-small.png";
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
          <div className="px-2 pt-12">
            <div className="gap-4 lg:grid lg:grid-cols-3">
              <div className="col-span-2 mb-4 lg:mb-0">
                <div className="flex flex-col items-center justify-end w-full h-16 p-2 font-bold text-center text-gray-100/80">
                  <span>Train AI with your own data</span>
                  <span>Completely decentralized and in your control</span>
                </div>
                <div className="flex flex-col p-4 shadow-sm lg:h-48 align-items-center rounded-xl bg-gradient-to-l from-purple-800 to-indigo-900">
                  <div className="py-2 mb-2 font-semibold text-white">
                    Earnings
                  </div>
                  <div class="lg:grid lg:grid-cols-2 gap-6">
                    <div className="p-6 mb-4 bg-black/50 rounded-xl lg:mb-0 bca-retro">
                      <div className="flex">
                        <div className="flex flex-col items-start justify-center w-1/3 pr-8 text-xl font-bold text-white">
                          <span>Total</span>
                          <span>Earnings</span>
                        </div>
                        <div className="flex items-center justify-center w-2/3 space-x-2 text-3xl font-bold text-white">
                          <span className="p-1 bg-black border rounded-full border-fuchsia-700 animate-pulse">
                            <Image
                              src={logo}
                              alt="Logo"
                              width={18}
                              height={18}
                            />
                          </span>
                          <p>
                            {formatLargeNumber(
                              (userData.totalPoints || 0) +
                                (userData.referralPoints || 0)
                            )}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 rounded-xl bg-fuchsia-900/50 bca-retro">
                      <div className="flex">
                        <div className="flex flex-col items-center justify-center w-1/3 pr-8 text-xl font-semibold text-white">
                          <span>Referral</span>
                          <span>Earnings</span>
                        </div>
                        <div className="flex items-center justify-center w-2/3 space-x-2 text-3xl font-bold text-white">
                          <span className="p-1 bg-black border rounded-full border-fuchsia-700 animate-pulse">
                            <Image
                              src={logo}
                              alt="Logo"
                              width={18}
                              height={18}
                            />
                          </span>
                          <p>
                            {formatLargeNumber(userData.referralPoints || 0)}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 ml-2 text-xs text-gray-400">
                  * points will be converted into BCA tokens
                </div>
              </div>
              <div className="">
                <div>
                  <div className="flex flex-col items-center justify-end p-2 text-sm font-normal text-center lg:h-16 text-gray-500/80">
                    <span>Audited by SecuryX 🔐</span>
                  </div>
                  <div className="flex flex-col h-48 p-4 shadow-sm align-items-center rounded-xl bg-gradient-to-l from-purple-800 to-indigo-900">
                    <Web3Provider className="w-full cursor-pointer hover:-translate-y-1">
                      <ConnectAndCollectButton userData={userData} />
                    </Web3Provider>
                  </div>

                  <div className="inline-flex items-center justify-center w-full pt-2 space-x-2">
                    <p className="text-xs text-gray-300">Supported on:</p>
                    <Image
                      src={arbitrumLogo}
                      alt="Arbitrum"
                      className="max-w-4"
                    />
                    <Image src={baseLogo} alt="Base" className="max-w-4" />
                    <Image src={bnbLogo} alt="BNB" className="max-w-4" />
                    <Image
                      src={optimismLogo}
                      alt="Optimism"
                      className="max-w-4"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="gap-4 lg:grid lg:grid-cols-12">
              <div className="mt-4 col-span-4 min-h-[250] h-[250]">
                <TaskList
                  sendEmailVerification={handleTask}
                  user={user}
                  userData={userData}
                />
              </div>

              <div className="order-first col-span-8 mt-4">
                <div className="mt-2">
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
