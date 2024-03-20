"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { getUserByUUID, getReferralCount } from "@/utils/utils";
import SuccessMessage from "@/components/notifications/success";
import { UserPlusIcon } from "@heroicons/react/24/outline";

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
    <header className="flex items-center justify-between px-4 py-3 pt-8 lg:ml-60 h-18">
      <div className="items-center justify-between px-2 py-2 space-x-4 text-white border shadow-sm md:flex align-items-center rounded-xl border-fuchsia-700 text-fuchsia-800">
        <span className="inline-flex items-center space-x-2">
          <UserPlusIcon className="w-6 h-6" />
          <p className="font-medium">
            Referrals <strong>{refsCount}</strong>
          </p>
        </span>

        <div className="text-white flex-1 px-2 py-1.5 text-center rounded-md shadow-sm cursor-pointer align-items-center bg-gradient-to-l from-fuchsia-700 to-violet-700 hover:bg-gradient-to-r transition">
          <p
            className="max-w-2xl px-2 mx-auto text-sm"
            onClick={() => handleCopy()}
          >
            Copy referal code
          </p>
        </div>
      </div>

      <div className="flex text-fuchsia-600">
        <span className="text-base">{`Welcome ${
          userData && userData.username
        }`}</span>
      </div>

      {copiedRefCode && (
        <SuccessMessage message={`Referral link copied`} />
      )}
    </header>
  );
}
