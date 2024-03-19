"use client";

import { useEffect, useState } from "react";
import { getTopUsers } from "@/utils/utils";

export default function Page() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const allusers = await getTopUsers();
      if (allusers && allusers.length > 0) {
        setUsers(allusers);
      }
    };

    fetchUsers();
  }, []);
  return (
    <>
      <div className="relative p-4 bg-bgprim">
        <div className="w-full divide-y divide-slate-400/20 rounded-lg bg-white text-[0.8125rem] leading-5 text-slate-900 shadow-xl shadow-black/5 ring-1 ring-slate-700/10">
          {users && (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="bg-bgprim border border-borderprimary w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3">
                      TotalPoints
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Referral Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users &&
                    users.length > 0 &&
                    users.map((user, index) => (
                      <tr
                        key={index}
                        className="border-b border-borderprimary hover:bg-bgcard"
                      >
                        <td className="px-6 py-4">{index}</td>

                        <th
                          scope="row"
                          className="px-6 font-medium text-gray-900 whitespace-nowrap "
                        >
                          <div className="flex items-center p-4">
                            <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                              <svg
                                className="absolute w-12 h-12 text-gray-400 -left-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </div>
                            {/* <div className="ml-4 flex-auto">
                            <div className="font-medium"></div>
                            <div className="mt-1 text-slate-700"></div>
                          </div> */}
                            <div className="ps-3">
                              <div className="text-base font-semibold">
                                {user.username}
                              </div>
                              <div className="font-normal text-gray-500">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </th>
                        <td className="px-6 py-4">{user.totalPoints || 0}</td>
                        <td className="px-6 py-4">
                          {user.referralPoints || 0}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
