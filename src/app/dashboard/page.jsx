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
import { IconFidgetSpinner } from "@tabler/icons-react";
import { sendEmailVerification } from "firebase/auth";
import SuccessMessage from "@/components/notifications/success";

export default function Page() {
  const [user] = useAuthState(auth);
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copiedRefCode, setCopiedRefLink] = useState(null);
  const [refsCount, setRefsCount] = useState(null);

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

  const handleCopy = () => {
    const inputElement = document.createElement("input");
    const referralCode = userData?.userId;
    const urlToCopy = `${window.location.origin}/signup?ref=${referralCode}`;

    inputElement.value = urlToCopy;
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand("copy");
    document.body.removeChild(inputElement);

    setCopiedRefLink(urlToCopy);

    // Automatically remove the referral code from the URL after 5 seconds
    setTimeout(() => {
      setCopiedRefLink(null); // Reset copiedRefCode to null
    }, 5000);
  };

  const handleTask = async () => {
    // const { name } = task;
    // if (name == "Verify Email") {
    const success = await sendEmailVerification();
    if (success) {
      alert("Sent email");
    }
    // }
  };

  return (
    <>
      {loading ? (
        <IconFidgetSpinner className="animate-spin w-12 h-12 mx-auto" />
      ) : (
        userData && (
          <>
           
            <div className="bg-white ">
              <div className="mx-auto max-w-8xl px-6 lg:px-8 mt-4">
               
                <div className="mt-4 grid grid-cols-6 gap-2">
                  <div className="col-span-6">
                    <div className="flex flex-col align-items-center border shadow-sm rounded-xl p-4 md:p-5 border-orange-300 bg-green-50 dark:bg-gray-800 dark:shadow-slate-700/[.7] dark:text-gray-400">
                      <div className="mx-auto max-w-4xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-teal-600">
                          Welcome {userData?.username}
                        </h2>
                        {/* <h2 className="text-base font-semibold leading-7 text-teal-600">
                          Referral code: {userData?.userId}
                        </h2> */}
                        <p className="mt-2 text-4xl font-bold tracking-tight text-blue-500 sm:text-5xl">
                          you have got {userData.totalPoints || 0} Total Points
                        </p>
                      </div>
                      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-cyan-600">
                        Complete below tasks to get more points
                      </p>
                    </div>
                  </div>
                </div>

                <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                  {/* {incompleteTasks &&
              incompleteTasks.length > 0 &&
              incompleteTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-3xl p-8 ring-1 xl:p-10 ring-yellow-400"
                >
                  <p className="mt-4 text-sm leading-6 text-green-600">
                    {task.Description}
                  </p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-pink-900">
                      {task.points}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-purple-600">
                      Points
                    </span>
                  </p>
                  <a
                    onClick={() => handleTask(task)}
                    aria-describedby="tier-freelancer"
                    className="mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-cyan-600 text-gray-600 shadow-sm hover:bg-red-500 focus-visible:outline-orange-600"
                  >
                    {task.name}
                  </a>
                </div>
              ))} */}
                  <div className="flex items-center justify-center">
                    <div className="rounded-3xl p-8 ring-1 xl:p-10 ring-yellow-400">
                      <p className="mt-4 text-sm leading-6 text-green-600">
                        Email Verification:{" "}
                        {user?.emailVerified ||
                        userData?.completedTasks?.includes("verifyEmail")
                          ? "Completed"
                          : "Not Completed"}
                      </p>
                      <p className="mt-6 flex items-baseline gap-x-1">
                        <span className="text-4xl font-bold tracking-tight text-pink-900">
                          {2000}
                        </span>
                        <span className="text-sm font-semibold leading-6 text-purple-600">
                          Points
                        </span>
                      </p>
                      <button
                        disabled={
                          user?.emailVerified ||
                          userData?.completedTasks?.includes("verifyEmail")
                        }
                        onClick={() => {
                          sendEmailVerification(user).then(() => {
                            alert("Verification Email Sent");
                          });
                        }}
                        aria-describedby="tier-freelancer"
                        className="disabled:opacity-40 mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-cyan-600 text-gray-600 shadow-sm hover:bg-red-500 focus-visible:outline-orange-600"
                      >
                        {user?.emailVerified
                          ? "Email Verified"
                          : "Verify Email"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </>
  );
}
