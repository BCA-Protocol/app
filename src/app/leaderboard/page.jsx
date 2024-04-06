"use client";

import { useEffect, useRef, useState } from "react";
import { getTopUsers } from "@/utils/utils";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { formatLargeNumber } from "@/utils/helper";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [isInZeroPointsPhase, setIsInZeroPointsPhase] = useState(false);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const {
        users: newUsers,
        lastDoc: newLastDoc,
        isInZeroPointsPhase: newIsInZeroPointsPhase,
      } = await getTopUsers(lastDoc, isInZeroPointsPhase);

      setUsers((prev) => [...prev, ...newUsers]);
      setLastDoc(newLastDoc);
      setIsInZeroPointsPhase(newIsInZeroPointsPhase); // Update the phase based on the function response
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="p-4 pt-12">
        <div className="w-full text-[0.8125rem] leading-5 text-slate-900 rounded-xl">
          {users && (
            <table className="w-full text-base text-left text-gray-500 rtl:text-right dark:text-gray-400">
              <thead className="text-xs uppercase text-fuchsia-700 dark:text-fuchsia-400">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left lg:px-6 lg:py-3"
                  >
                    Rank
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left lg:px-6 lg:py-3"
                  >
                    User
                  </th>
                  <th scope="col" className="py-2 text-left lg:px-6 lg:py-3">
                    Total Points
                  </th>
                  <th scope="col" className="py-2 text-left lg:px-6 lg:py-3">
                    Referral Poins
                  </th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.length > 0 &&
                  users.map((user, index) => (
                    <tr
                      key={index}
                      className="cursor-pointer hover:bg-fuchsia-950"
                    >
                      <td className="px-6 py-4 text-fuchsia-700">
                        {index + 1}
                      </td>

                      <td
                        scope="row"
                        className="font-medium text-gray-900 lg:px-6 whitespace-nowrap "
                      >
                        <div className="flex items-center justify-start space-x-2">
                          <UserCircleIcon className="w-12 h-12 text-fuchsia-600/35" />
                          <div className="">
                            <div className="overflow-hidden text-base font-semibold text-fuchsia-700 max-w-24 lg:max-w-[600px]">
                              {user.displayName}
                            </div>
                            <div className="font-normal text-gray-600 overflow-hidden max-w-24 lg:max-w-[600px]">
                              @{user.displayName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-100 lg:px-6 lg:py-4">
                        {formatLargeNumber((user.totalPoints || 0) + (user.referralPoints || 0))}
                      </td>
                      <td className="text-gray-100 lg:px-6 lg:py-4">
                        {formatLargeNumber(user.referralPoints || 0)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          <div className="flex justify-center mt-12">
            {usersLoading ? (
              <button className="text-base text-white" disabled>
                Loading...
              </button>
            ) : (
              <button
                className="px-8 py-2 text-base text-white cursor-pointer hover:bg-fuchsia-950 bg-fuchsia-800 rounded-xl"
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
