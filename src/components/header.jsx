"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import Image from "next/image";
import { getUserByUUID, getReferralCount } from "@/utils/utils";
import SuccessMessage from "@/components/notifications/success";

export default function Header() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState([]);
  const [copiedRefCode, setCopiedRefLink] = useState(null);
  const [refsCount, setRefsCount] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const userRes = await getUserByUUID(user.uid);
      setUserData(userRes);
      const refCount = await getReferralCount(user.uid);
      setRefsCount(refCount);
    };
    user && user.uid && fetchUsers();
  }, [user]);

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

  return (
    <header className="fixed right-0 top-0 left-60 py-3 px-4 h-16">
      <div class="flex justify-between items-center h-16 px-4">
        <div className="flex flex-row align-items-center border shadow-sm rounded-full py-1 px-4 border-orange-300 bg-green-50 w-3/12 min-w-96">
          <span className="inline-flex items-center mr-4">
            <svg
              viewBox="0 0 24 25"
              F
              fill="none"
              className="w-6 h-6 text-cyan-600"
            >
              <path
                d="M19 21.5v-6m-3 3h6m-10-3H8c-1.864 0-2.796 0-3.53.305a4 4 0 00-2.166 2.164C2 18.704 2 19.636 2 21.5M15.5 3.79a4.001 4.001 0 010 7.42m-2-3.71a4 4 0 11-8 0 4 4 0 018 0z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p className="text-cyan-600 font-medium">Referrals: {refsCount}</p>
          </span>
        
          <div className="flex-1 text-center justify-end align-items-center border shadow-sm rounded-full p-1 border-blue-300 bg-sky-50 cursor-pointer">
            <p
              className="mx-auto max-w-2xl ml-2 text-cyan-600"
              onClick={() => handleCopy()}
            >
              Copy referal code
            </p>
          </div>
          {/* <p className="mx-auto max-w-2xl ml-2 text-lg leading-8 text-cyan-600">
            Points: {userData.referralPoints || 0}
          </p> */}
        </div>

        <div class="flex items-center space-x-4"></div>

        <div className="">
          <div>
            <button
              type="button"
              className="flex items-center focus:outline-none rounded-lg text-gray-600 hover:text-yellow-600 focus:text-yellow-600 font-semibold p-2 border border-transparent hover:border-yellow-300 focus:border-yellow-300 transition"
            >
              <span className="text-sm">{`Welcome ${
                userData && userData.username
              }`}</span>
            </button>
          </div>
        </div>
      </div>

      {copiedRefCode && (
        <SuccessMessage message={`Referel link copied : ${copiedRefCode}`} />
      )}
    </header>
  );
}
