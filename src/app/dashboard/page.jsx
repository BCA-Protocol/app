"use client";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getUserIncompleteTasks,
  getUserByUUID,
  getReferralCount,
} from "@/utils/utils";
import { sendEmailVerification } from "firebase/auth";
import ReferalChart from "@/components/ReferalChart";
import TaskList from "@/components/TaskList";
import Loader from "@/components/loader";
import Notification from "@/components/notifications/notification";

export default function Page() {
  const [user] = useAuthState(auth);
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refsCount, setRefsCount] = useState(null);
  const [notification, setNotification] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchIncompleteTasks = async () => {
      if (!user) {
        router.replace("/");
        return;
      }
      try {
        setLoading(true);
        const taskData = await getUserIncompleteTasks(user.uid);
        if (user?.emailVerified) {
          setUserPoints(userPoints + 20);
        }
        const userDataRes = await getUserByUUID(user.uid);
        taskData && setIncompleteTasks(taskData);
        userDataRes && setUserData(userDataRes);

        const refCount = await getReferralCount(user.uid);
        setRefsCount(refCount);
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
        type: "Success",
        message: "Verification email sent successfully",
        show: true,
      });
    } catch (error) {
      if (error.code === "auth/too-many-requests") {
        setNotification({
          type: "Error",
          message: "Too many requests. Please try again later.",
          show: true,
        });
      } else {
        setNotification({
          type: "Error",
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
        <div className="fixed top-0 left-1/2 w-[500px]">
          <Notification
            type={notification.type}
            message={notification.message}
          />
        </div>
      )}
      {userData && (
        <>
          <div className="bg-bgprim ">
            <div className=" px-2">
              <div className="lg:grid lg:grid-cols-12  gap-2 ">
                <div className="col-span-9 mt-4 ">
                  <div className="flex flex-col align-items-center border shadow-sm rounded-xl p-4 border-borderprimary bg-bgcard">
                    <div className="text-center">
                      <h2 className=" font-semibold  text-secondaryx">
                        Welcome {userData?.username}
                      </h2>
                      <p className="mt-2 text-4xl font-bold text-blue-500">
                        you have got {userData.totalPoints || 0} Total Points
                      </p>
                    </div>
                    <p className="mt-6 max-w-2xl text-center text-lg text-secondaryx">
                      Complete below tasks to get more points
                    </p>
                  </div>

                  <div className="mt-4">
                    <ReferalChart />
                  </div>
                </div>

                <div className="mt-4 col-span-3 min-h-[250] h-[250]">
                  <TaskList
                    sendEmailVerification={handleTask}
                    user={user}
                    userData={userData}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
