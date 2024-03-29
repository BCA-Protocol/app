"use client";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  getUserByUUID,
  getUserActivity,
  getGlobalSettings,
} from "@/utils/utils";
import { formatLargeNumber } from "@/utils/helper";
import { sendEmailVerification } from "firebase/auth";
import ReferalChart from "@/components/ReferalChart";
import TaskList from "@/components/TaskList";
import Loader from "@/components/loader";
import Notification from "@/components/notifications/notification";

export default function Page() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [globalSettings, setGlobalSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [userActivity, setUserActivity] = useState([]);

  const actualNumber = globalSettings?.protocolPoints || 1234567;
  const startNumber = Math.max(actualNumber - 100000, 0);
  const [displayNumber, setDisplayNumber] = useState(startNumber);
  const displayNumberRef = useRef(startNumber);

  const router = useRouter();

  useEffect(() => {
    const updateNumber = () => {
      // Stop if we've reached or exceeded the actual number
      if (displayNumberRef.current >= actualNumber) {
        return;
      }

      // Generate a random increment amount between 1000 and 5000
      const incrementAmount =
        Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
      const newNumber = Math.min(
        displayNumberRef.current + incrementAmount,
        actualNumber
      );

      // Update state and ref
      setDisplayNumber(newNumber);
      displayNumberRef.current = newNumber;

      // Generate a random interval duration between 1000ms (1 second) and 10000ms (9 seconds)
      const timeoutDuration =
        Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;

      // Schedule the next update
      setTimeout(updateNumber, timeoutDuration);
    };

    // Start the animation
    updateNumber();

    // Because we're using setTimeout recursively, there's no direct cleanup required here.
    // If needed, you could return a cleanup function to cancel the timeout if the component unmounts.
  }, [actualNumber]);

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

        const globalSettingsData = await getGlobalSettings();
        setGlobalSettings(globalSettingsData);

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
            <div className="text-center text-gray-100/35">
              BCA Token coming soon! Start earning points and get Exclusive
              Access.
            </div>
            <div className="gap-6 lg:grid lg:grid-cols-12">
              <div className="order-first col-span-8 mt-4 lg:hidden">
                <div className="flex flex-col p-4 shadow-sm align-items-center rounded-xl bg-gradient-to-l from-purple-800 to-indigo-900">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-white">
                      Protocol Growth{" "}
                      <p className="text-transparent lg:inline-block bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 bg-clip-text">
                        {formatLargeNumber(displayNumber)} 🔥
                      </p>
                    </h2>
                    <p className="mt-2 text-2xl font-bold text-white">
                      you have got{" "}
                      {formatLargeNumber(
                        (userData.totalPoints || 0) +
                          (userData.referralPoints || 0)
                      )}{" "}
                      points
                    </p>
                  </div>
                  <p className="mt-6 text-lg text-center text-purple-200">
                    Verify your data, earn points &rarr;
                  </p>
                </div>
              </div>

              <div className="mt-4 col-span-4 min-h-[250] h-[250]">
                <TaskList
                  sendEmailVerification={handleTask}
                  user={user}
                  userData={userData}
                />
              </div>

              <div className="order-first col-span-8 mt-4">
                <div className="flex-col hidden p-4 shadow-sm lg:flex align-items-center rounded-xl bg-gradient-to-l from-purple-800 to-indigo-900">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-white">
                      Protocol Growth{" "}
                      <p className="text-transparent lg:inline-block bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 bg-clip-text">
                        {formatLargeNumber(displayNumber)} 🔥
                      </p>
                    </h2>
                    <p className="mt-2 text-2xl font-bold text-white">
                      you have got{" "}
                      {formatLargeNumber(
                        (userData.totalPoints || 0) +
                          (userData.referralPoints || 0)
                      )}{" "}
                      points
                    </p>
                  </div>
                  <p className="mt-6 text-lg text-center text-purple-200">
                    Verify your data, earn points &rarr;
                  </p>
                </div>

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
