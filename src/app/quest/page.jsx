"use client";

import { useEffect, useState } from "react";
// import { RocketLaunchIcon, TrophyIcon, Bol } from "@heroicons/react/24/outline";
import { BoltIcon, UserIcon } from "@heroicons/react/24/solid";
import { getData, addData, editQuests, deleteData } from "@/server-action/base-action";
import { useRouter } from "next/navigation";
import { IconLink,IconCoinBitcoinFilled, IconBrandTwitterFilled, IconBrandDiscordFilled } from "@tabler/icons-react";
import QuestPopUp from "@/components/QuestPopUp";
import useAuth from "@/features/base/auth/hooks/use-auth";

export default function Page() {
  const {user} =  useAuth()
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [questData, setQuestData] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchQuests = async () => {
      if (!user) {
        router.replace("/");
        return;
      }
      try {
        // setLoading(true);
        const questsDataRes = await getData("quests");
        console.log("Quest Data:", questsDataRes, user);
        questsDataRes && setQuestData(questsDataRes);
        // setLoading(false);
        // setQuestUpdated(false);
      } catch (error) {
        console.error("Error fetching Quest Data:", error);
        // setLoading(false);
      }
    };
    user && fetchQuests();
  }, [user]);


  return (
    <>
    {modalOpen && <QuestPopUp isOpen={modalOpen} onClose={() => setModalOpen(false)} selectedQuest={selectedQuest}/>}
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
            {questData && (
              <>
                {questData.length > 0 && (
                  <div className="flex flex-col space-y-2">
                    {questData.map((quest, index) => (
                      <div key={index} className="flex items-center justify-start w-full px-2 py-2 overflow-hidden text-sm font-semibold transition ease-out border-t rounded-full cursor-pointer border-fuchsia-800 text-fuchsia-200 bca-purple-row-glow-inside hover:bg-purple-950 bg-[#260C44]" onClick={() => {setSelectedQuest(quest); setModalOpen(true)}}>
                        <span
                          scope="col"
                          className="inline-flex w-5/12 ml-4 space-x-2 text-left lg:ml-2"
                        >
                          <IconCoinBitcoinFilled/>
                          <p className="text-fuchsia-700">{quest.name}</p>
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
                          {quest.link}
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
                          {quest.twitter}
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
                          {quest.discord}
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
                          {quest.user}
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
                          {quest.light}
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
          </div>
        </div>
      </div>
    </>
  );
}
