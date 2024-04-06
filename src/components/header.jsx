"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { formatLargeNumber } from "@/utils/helper";
import {
  getUserByUUID,
  getReferralCount,
  getGlobalSettings,
} from "@/utils/utils";
import SuccessMessage from "@/components/notifications/success";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState([]);
  const [globalSettings, setGlobalSettings] = useState(null);
  const [copiedRefCode, setCopiedRefLink] = useState(null);
  const [refsCount, setRefsCount] = useState(null);
  const actualNumber = globalSettings?.protocolPoints || 1234567;
  const startNumber = Math.max(actualNumber - 100000, 0);
  const [displayNumber, setDisplayNumber] = useState(startNumber);
  const displayNumberRef = useRef(startNumber);

  const router = useRouter();

  useEffect(() => {
    const fetchUsersAndSettings = async () => {
      const userRes = await getUserByUUID(user.uid);
      setUserData(userRes);
      const refCount = await getReferralCount(user.uid);
      setRefsCount(refCount);

      const globalSettingsData = await getGlobalSettings();
      setGlobalSettings(globalSettingsData);
    };
    user && user.uid && fetchUsersAndSettings();
  }, [user]);

  useEffect(() => {
    const updateNumber = () => {
      // Stop if we've reached or exceeded the actual number
      if (displayNumberRef.current >= actualNumber) {
        return;
      }

      // Generate a random increment amount between 1000 and 5000
      const incrementAmount =
        Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
      const newNumber = Math.min(
        displayNumberRef.current + incrementAmount,
        actualNumber
      );

      // Update state and ref
      setDisplayNumber(newNumber);
      displayNumberRef.current = newNumber;

      // Generate a random interval duration between 1000ms (1 second) and 10000ms (9 seconds)
      const timeoutDuration =
        Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;

      // Schedule the next update
      setTimeout(updateNumber, timeoutDuration);
    };

    // Start the animation
    updateNumber();

    // Because we're using setTimeout recursively, there's no direct cleanup required here.
    // If needed, you could return a cleanup function to cancel the timeout if the component unmounts.
  }, [actualNumber]);

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
      <div className="w-1/4 lg:hidden"></div>

      <div className="flex items-center justify-start space-x-4">
        <div className="items-center justify-center p-2 text-white border shadow-sm lg:p-1 lg:justify-between lg:items-center lg:space-x-4 md:flex align-items-center rounded-xl border-fuchsia-700 text-fuchsia-800">
          <span className="inline-flex items-center justify-center space-x-2 text-center">
            <UserPlusIcon className="w-5 h-5" />
            <p className="font-medium">
              Referrals <strong>{refsCount}</strong>
            </p>
          </span>

          <div className="text-white flex-1 px-2 py-1.5 text-center rounded-md shadow-sm cursor-pointer align-items-center bg-gradient-to-l from-fuchsia-700 to-violet-700 hover:bg-gradient-to-r transition">
            <p
              className="max-w-2xl px-2 mx-auto text-sm"
              onClick={() => handleCopy()}
            >
              Copy referral code
            </p>
          </div>
        </div>
        <p className="hidden text-transparent lg:inline-block bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text">
          &larr; Refer your friends and earn 10% compounded interest
        </p>
      </div>

      <div className="flex flex-col items-end justify-between w-1/4 text-center lg:flex-row">
        <div className="flex flex-col items-center justify-center w-full text-xs lg:hidden text-fuchsia-600">
          <span className="">welcome </span>
          {userData && <span>{userData.displayName}</span>}
        </div>

        <div className="flex flex-col items-center justify-center w-full text-base text-white">
          {displayNumber && (
            <span className="font-bold">
              {formatLargeNumber(displayNumber)}
            </span>
          )}
          <span className="text-xs">Protocol Growth </span>
        </div>

        <div className="flex-col items-end justify-end hidden w-full text-base lg:flex text-fuchsia-600">
          <span className="text-xs">welcome </span>
          {userData && <span>{userData.displayName}</span>}
        </div>
      </div>

      {copiedRefCode && <SuccessMessage message={`Referral link copied`} />}
    </header>
  );
}
