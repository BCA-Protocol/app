"use client";

import { auth } from "@/firebase";
import { useEffect, useState } from "react";
// import { RocketLaunchIcon, TrophyIcon, Bol } from "@heroicons/react/24/outline";
import { BoltIcon, UserIcon } from "@heroicons/react/24/solid";
import { formatLargeNumber } from "@/utils/helper";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getUserByUUID } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { IconLink,IconCoinBitcoinFilled, IconBrandTwitterFilled, IconBrandDiscordFilled } from "@tabler/icons-react";
import QuestPopUp from "@/components/QuestPopUp";

export default function Page() {
  const [user] = useAuthState(auth);
  const [users, setUsers] = useState([]);
  const [lastUser, setLastUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [companyData, setCompanyData] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        router.replace("/");
        return;
      }
      try {
        const userDataRes = await getUserByUUID(user.uid);
        userDataRes && setUserData(userDataRes);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [router, user]);

  const fetchUsers = async () => {
    setUsersLoading(true);

    try {
      const functions = getFunctions();
      const fetchLeaderboard = httpsCallable(
        functions,
        "fetchPaginatedLeaderboard"
      );

      // Prepare the data object with pagination parameters
      const paginationData = lastUser
        ? {
            lastOverallPoints: lastUser.overallPoints,
            lastCreated: lastUser.created,
          }
        : {};

      const result = await fetchLeaderboard(paginationData);
      const { users: newUsers, lastUser: newLastUser } = result.data;

      setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      setLastUser(newLastUser);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchUsers();
  // });
  const test_data = [
    {name: 'CredBull',link: 'credibull.io', twitter:'33k',discord:'33k',user:'7.2k',light:'7.2k'},
    {name: 'CRIPTOKEN',link: 'criptoken.ai', twitter:'33k',discord:'33k',user:'7.2k',light:'7.2k'},
    {name: 'Orochi Network',link: 'orochi.network', twitter:'33k',discord:'33k',user:'7.2k',light:'7.2k'},
    {name: 'Kitty Meme Coin',link: 'www.kittymemecoin.com', twitter:'33k',discord:'33k',user:'7.2k',light:'7.2k'}

  ]

  return (
    <>
    {modalOpen && <QuestPopUp isOpen={modalOpen} onClose={() => setModalOpen(false)} companyData={companyData}/>}
      <div className="px-4 pb-24">
        <div className="flex items-center justify-center w-full pt-0 text-center">
          <div class="w-2/5 relative pt-0 z-10">
            <div className="absolute block w-full border-2 border-b rounded-xl border-fuchsia-700 shrink-0 bg-fuchsia-700 bca-glow-top"></div>
          </div>
        </div>

        <div className="w-full text-[0.8125rem] leading-5 text-slate-900 rounded-xl mt-6 bg-[#250C3D] border-purple-950 border pb-12">
          <div className="p-6 mb-2 text-base font-semibold text-white">
            <p>Quest</p>
            <div className="mt-4 thin-line border-purple-950"></div>
          </div>
          <div className="px-2 lg:px-8">
            {test_data && (
              <>
                {test_data.length > 0 && (
                  <div className="flex flex-col space-y-2">
                    {test_data.map((user, index) => (
                      <div key={index} className="flex items-center justify-start w-full px-2 py-2 overflow-hidden text-sm font-semibold transition ease-out border-t rounded-full cursor-pointer border-fuchsia-800 text-fuchsia-200 bca-purple-row-glow-inside hover:bg-purple-950 bg-[#260C44]" onClick={() => {setCompanyData(user); setModalOpen(true)}}>
                        {/* <span scope="col" className="w-1/12 text-left">
                          
                        </span> */}
                        <span
                          scope="col"
                          className="inline-flex w-5/12 ml-4 space-x-2 text-left lg:ml-2"
                        >
                          <IconCoinBitcoinFilled/>
                          <p className="text-fuchsia-700">{user.name}</p>
                          {/* <p className="flex text-fuchsia-400 lg:hidden">
                            (T1)
                          </p> */}
                        </span>
                        {/* <div className="flex-1 h-0.5 mr-4 ml-2 bg-fuchsia-700"></div> */}
                        <span
                          scope="col"
                          className="w-3/12 px-4 text-xs lg:text-base lg:text-right justify-end lg:flex"
                        >
                        <div className="inline-flex items-center justify-end px-4 py-1 space-x-2 text-sm font-semibold rounded-xl bg-purple-950">
                          <IconLink className="w-3 h-3 text-white"/>
                          <p className="text-white-300">
                          {user.link}
                          </p>
                        </div>
                        </span>
                        <span
                          scope="col"
                          className="w-1/12 px-4 text-xs lg:text-base lg:text-right"
                        >
                        <div className="inline-flex items-center justify-center px-4 py-1 space-x-2 text-sm font-semibold rounded-xl bg-purple-950">
                          <IconBrandTwitterFilled className="w-3 h-3 text-white"/>
                          <p className="text-white">
                          {user.twitter}
                          </p>
                        </div>
                        </span>
                        <span
                          scope="col"
                          className="w-1/12 px-4 text-xs lg:text-base lg:text-right"
                        >
                        <div className="inline-flex items-center justify-center px-4 py-1 space-x-2 text-sm font-semibold rounded-xl bg-purple-950">
                          <IconBrandDiscordFilled className="w-3 h-3 text-white"/>
                          <p className="text-white">
                          {user.discord}
                          </p>
                        </div>
                        </span>
                        <span
                          scope="col"
                          className="w-1/12 px-4 text-xs lg:text-base lg:text-right"
                        >
                        <div className="inline-flex items-center justify-center px-4 py-1 space-x-2 text-sm font-semibold rounded-xl bg-purple-950">
                          <UserIcon className="w-3 h-3 text-white"/>
                          <p className="text-white">
                          {user.user}
                          </p>
                        </div>
                        </span>
                        <span
                          scope="col"
                          className="w-1/12 px-4 text-xs lg:text-base lg:text-right mr-4"
                        >
                        <div className="inline-flex items-center justify-center px-4 py-1 space-x-2 text-sm font-semibold rounded-xl bg-purple-950">
                          <BoltIcon className="w-3 h-3 text-white"/>
                          <p className="text-white">
                          {user.light}
                          </p>
                        </div>
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
                onClick={fetchUsers}
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
