"use client";

import { auth } from "@/firebase";
import { use, useEffect, useState } from "react";
import { RocketLaunchIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { formatLargeNumber } from "@/utils/helper";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getUserByUUID } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import useAuth from "@/features/base/auth/hooks/use-auth";
import { getUser } from "../dashboard/actions";
import { fetchLeaderboardUsers } from "./actions";


export default function Page() {
  // const [user] = useAuthState(auth);
  const {user} =  useAuth()
  const [users, setUsers] = useState([]);
  const [lastUser, setLastUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        return;
      }
      try {
        // const userDataRes = await getUserByUUID(user.uid);
        const {data,error} = await getUser(user.id);
        data && setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [ user]);

  const fetchUsers = async () => {
    // setUsersLoading(true);

    // try {
    //   const functions = getFunctions();
    //   const fetchLeaderboard = httpsCallable(
    //     functions,
    //     "fetchPaginatedLeaderboard"
    //   );

    //   // Prepare the data object with pagination parameters
    //   const paginationData = lastUser
    //     ? {
    //         lastOverallPoints: lastUser.overallPoints,
    //         lastCreated: lastUser.created,
    //       }
    //     : {};

    //   const result = await fetchLeaderboard(paginationData);
    //   const { users: newUsers, lastUser: newLastUser } = result.data;

    //   setUsers((prevUsers) => [...prevUsers, ...newUsers]);
    //   setLastUser(newLastUser);
    // } catch (error) {
    //   console.error("Failed to fetch users:", error);
    // } finally {
    //   setUsersLoading(false);
    // }
    setUsersLoading(true);
    const {users,count} = await fetchLeaderboardUsers({page})
    setCount(count)
    console.log("users",users)
    if(users){
      setUsers((prevUsers) => [...prevUsers, ...users]);
    }
    
    setUsersLoading(false);
  };
  useEffect(() => {
    fetchUsers( )
  }, [page]);

  // useEffect(() => {
  //   fetchUsers();
  // },[]);
  const loadMoreUsers = () => {
    if(users.length < count){
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <>
      <div className="px-4 pb-24">
        <div className="flex items-center justify-center w-full pt-0 text-center">
          <div class="w-2/5 relative pt-0 z-10">
            <div className="absolute block w-full border-2 border-b rounded-xl border-fuchsia-700 shrink-0 bg-fuchsia-700 bca-glow-top"></div>
          </div>
        </div>

        <div className="mt-12 flex flex-col p-4 bg-[#250C3D] border-purple-950 border align-items-center rounded-xl">
          <div className="mb-2 text-base font-semibold text-white">
            Your statistics
          </div>
          <div className="inline-flex items-center justify-start space-x-4">
            <div className="inline-flex items-center justify-center px-4 py-2 space-x-2 text-sm font-semibold rounded-lg bg-purple-950">
              <RocketLaunchIcon className="w-4 h-4 text-white" />
              <p className="text-white">Total Points:</p>
              <p className="text-fuchsia-600">
                {formatLargeNumber(
                  (userData?.total_points || 1) -
                    1 +
                    ((userData?.referral_points || 1) - 1)
                )}{" "}
              </p>
            </div>
            <div className="inline-flex items-center justify-center px-4 py-2 space-x-2 text-sm font-semibold rounded-lg bg-purple-950">
              <TrophyIcon className="w-4 h-4 text-white" />
              <p className="text-white">Current Tier:</p>
              <p className="text-fuchsia-600">
                {userData?.overall_points > 250000
                  ? "1"
                  : userData?.overall_points > 125000
                  ? "2"
                  : "3"}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full text-[0.8125rem] leading-5 text-slate-900 rounded-xl mt-6 bg-[#250C3D] border-purple-950 border pb-12">
          <div className="p-6 mb-2 text-base font-semibold text-white">
            <p>Leaderboard</p>
            <div className="mt-4 thin-line border-purple-950"></div>
          </div>
          <div className="px-2 lg:px-8">
            {users && (
              <>
                <div className="w-full text-base text-left text-gray-500 rtl:text-right">
                  <div className="flex items-center justify-start w-full px-2 py-4 text-sm font-semibold text-fuchsia-200 dark:text-fuchsia-400">
                    <span scope="col" className="w-1/12 text-left">
                      Rank
                    </span>
                    <span scope="col" className="w-5/12 ml-4 text-left lg:ml-0">
                      User
                    </span>
                    <span
                      scope="col"
                      className="hidden w-2/12 text-left lg:px-0 lg:text-right lg:flex"
                    >
                      Tier
                    </span>
                    <span scope="col" className="w-2/12 lg:text-right">
                      Total Points
                    </span>
                    <span scope="col" className="w-2/12 lg:px-4 lg:text-right">
                      Referral Points
                    </span>
                  </div>
                </div>
                {users.length > 0 && (
                  <div className="flex flex-col space-y-2">
                    {users.map((user, index) => (
                      <div key={index} className="flex items-center justify-start w-full px-2 py-2 overflow-hidden text-sm font-semibold transition ease-out border-t rounded-full cursor-pointer border-fuchsia-800 text-fuchsia-200 bca-purple-row-glow-inside hover:bg-purple-950 bg-[#260C44]">
                        <span scope="col" className="w-1/12 text-left">
                          {index == 0 && (
                            <div className="flex items-center justify-center w-8 h-8 bg-[#CB7E2F] border-2 border-[#CE7613] rounded-full bca-glow-gold-outside">
                              <div className="flex items-center justify-center w-6 h-6 font-semibold text-[#250C3D] bg-[#EEAD2C] rounded-full bca-glow-gold-inside">
                                {index + 1}
                              </div>
                            </div>
                          )}
                          {index == 1 && (
                            <span>
                              <div className="flex items-center justify-center w-8 h-8 bg-[#B9B9B9] border-2 border-[#A0A0A0] rounded-full bca-glow-silver-outside">
                                <div className="flex items-center justify-center w-6 h-6 font-semibold text-[#250C3D] bg-[#A2A2A2] rounded-full bca-glow-silver-inside">
                                  {index + 1}
                                </div>
                              </div>
                            </span>
                          )}
                          {index == 2 && (
                            <span>
                              <div className="flex items-center justify-center w-8 h-8 border-2 rounded-full bg-[#B5907F] border-[#9E6F64] bca-glow-bronze-outside">
                                <div className="flex items-center justify-center w-6 h-6 font-semibold text-[#250C3D] rounded-full bg-[#AB7A71] bca-glow-bronze-inside">
                                  {index + 1}
                                </div>
                              </div>
                            </span>
                          )}
                          {index > 2 && (
                            <span>
                              <div className="flex items-center justify-center w-8 h-8 rounded-full">
                                <div className="flex items-center justify-center w-6 h-6 font-semibold rounded-full text-fuchsia-100">
                                  {index + 1}
                                </div>
                              </div>
                            </span>
                          )}
                        </span>
                        <span
                          scope="col"
                          className="inline-flex w-5/12 ml-4 space-x-2 text-left lg:ml-0"
                        >
                          <p className="text-fuchsia-700">{user.display_name}</p>
                          <p className="flex text-fuchsia-400 lg:hidden">
                            (T1)
                          </p>
                        </span>
                        <span
                          scope="col"
                          className="hidden w-2/12 text-xs text-left lg:text-right lg:text-base lg:flex"
                        >
                          {user?.overall_points > 250000
                            ? "1"
                            : user?.overall_points > 125000
                            ? "2"
                            : "3"}
                        </span>
                        <span
                          scope="col"
                          className="w-2/12 text-xs lg:text-right lg:text-base"
                        >
                          {formatLargeNumber(
                            (user.total_points || 1) -
                              1 +
                              ((user.referral_points || 1) - 1)
                          )}
                        </span>
                        <span
                          scope="col"
                          className="w-2/12 px-4 text-xs lg:text-base lg:text-right"
                        >
                          {formatLargeNumber((user.referral_points || 1) - 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex justify-center mt-12">
            {usersLoading ? (
              <button className="text-base text-white" disabled>
                Loading...
              </button>
            ) : (
              <button
                className="px-8 py-2 text-base text-white bg-transparent border cursor-pointer hover:bg-fuchsia-950 border-purple-950 rounded-2xl"
                onClick={loadMoreUsers}
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
