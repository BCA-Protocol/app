"use client";

import { useEffect, useState } from "react";
import { getTopUsers } from "@/utils/utils";
import { UserCircleIcon } from "@heroicons/react/24/solid";

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
      <div className="p-4 pt-12">
        <div className="w-full divide-y divide-slate-400/20 text-[0.8125rem] leading-5 text-slate-900 shadow-xl shadow-black/5 ring-1 ring-slate-700/10 border rounded-xl border-fuchsia-700">
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
                      className="border-b border-dashed cursor-pointer border-fuchsia-400 hover:bg-fuchsia-950"
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
                        {user.totalPoints || 0}
                      </td>
                      <td className="text-gray-100 lg:px-6 lg:py-4">
                        {user.referralPoints || 0}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
