"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { getUserByUUID, getReferralCount } from "@/utils/utils";
import SuccessMessage from "@/components/notifications/success";
import ToggleButton from "@/components/ToggleButton";

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
    <header className=" lg:ml-60 py-3 px-4 h-16 w-full xs:mb-[65px]">
      <div className="ml-32 flex text-typography md:absolute right-4 top-4">
        <span className="text-sm">{`Welcome ${
          userData && userData.username
        }`}</span>
      </div>
      <div className="flex justify-between items-center h-16 px-4">
        <div className="md:flex md:mt-10 xs:mt-10  align-items-center text-secondaryx border shadow-sm  bg-gradient-to-l from-violet-700 to-violet-700   lg:rounded-full py-1 px-4 border-borderprimary  xs:w-full lg:w-auto sm:rounded-2xl">
          <span className="inline-flex items-center mr-4 ">
            <svg viewBox="0 0 24 25" fill="none" className="w-6 h-6">
              <path
                d="M19 21.5v-6m-3 3h6m-10-3H8c-1.864 0-2.796 0-3.53.305a4 4 0 00-2.166 2.164C2 18.704 2 19.636 2 21.5M15.5 3.79a4.001 4.001 0 010 7.42m-2-3.71a4 4 0 11-8 0 4 4 0 018 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="font-medium">Referrals: {refsCount}</p>
          </span>

          <div className="flex-1 text-center justify-end align-items-center border shadow-sm rounded-full p-1 border-borderprimary bg-bgprim cursor-pointer">
            <p className="mx-auto max-w-2xl ml-2" onClick={() => handleCopy()}>
              Copy referal code
            </p>
          </div>
        </div>
      </div>

      {copiedRefCode && (
        <SuccessMessage message={`Referel link copied : ${copiedRefCode}`} />
      )}
    </header>
  );
}
