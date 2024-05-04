"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import useAuth from "@/features/base/auth/hooks/use-auth";
import { auth } from "@/firebase";
import { formatLargeNumber } from "@/utils/helper";
import {
  // getUserByUUID,
  // getReferralCount,
  // getGlobalSettings,
} from "@/utils/utils";
import SuccessMessage from "@/components/notifications/success";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { getUserById, getReferralCount } from "@/server-action/user-action";
import { getGlobalSettings } from "@/server-action/base-action";

export default function Header() {
  // const [user] = useAuthState(auth);
  const {user} =  useAuth()
  const [userData, setUserData] = useState(null);
  const [globalSettings, setGlobalSettings] = useState(null);
  const [copiedRefCode, setCopiedRefLink] = useState(null);
  const [refsCount, setRefsCount] = useState(null);
  const actualNumber = globalSettings?.settings?.protocol_points || 1234567;
  const startNumber = Math.max(actualNumber - 100000, 0);
  const [displayNumber, setDisplayNumber] = useState(startNumber);
  const displayNumberRef = useRef(startNumber);

  const router = useRouter();

  useEffect(() => {
    const fetchUsersAndSettings = async () => {
      if (!user?.id) {
        return;
      }
      const userRes = await getUserById(user.id)
      setUserData(userRes);
      const refCount = await getReferralCount(user.id);
      setRefsCount(refCount);

      const globalSettingsData = await getGlobalSettings();
      setGlobalSettings(globalSettingsData);
    };
    user && user.id && fetchUsersAndSettings();
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
    const referralCode = userData?.id;
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
    <header className="flex items-center justify-between px-4 py-6 lg:ml-60 bg-gradient-to-r from-[#180924] to-[#29052D] z-20">
      <div className="w-1/4 lg:hidden"></div>

      <div className="flex items-center justify-start space-x-4">
        <div className="items-center justify-center px-2 lg:py-1 py-2 text-white border shadow-sm lg:p-1 lg:justify-between lg:items-center lg:space-x-4 md:flex align-items-center rounded-xl border-[#8B6DAE] text-fuchsia-800">
          <span className="inline-flex items-center justify-center px-2 space-x-2 text-center">
            <UserPlusIcon className="w-5 h-5 font-bold text-fuchsia-600" />
            <p className="text-sm font-medium">
              Referrals <strong>{refsCount}</strong>
            </p>
          </span>

          <div className="text-white flex-1 px-2 py-1.5 text-center rounded-md shadow-sm cursor-pointer align-items-center bg-gradient-to-l to-fuchsia-700 from-violet-700 hover:bg-gradient-to-r transition">
            <p
              className="max-w-2xl px-2 mx-auto text-sm"
              onClick={() => handleCopy()}
            >
              Copy referral code
            </p>
          </div>
        </div>
        <p className="hidden text-[#D2BAD6] lg:inline-block">
          Refer your friends and earn 10% compounded interest
        </p>
      </div>

      <div className="flex flex-col items-end justify-between w-1/4 text-center lg:flex-row">
        <div className="flex flex-col items-center justify-center w-full text-xs lg:hidden text-fuchsia-600">
          <span className="">welcome </span>
          {userData && <span>{userData.displayName}</span>}
        </div>

        <div className="flex flex-col items-center justify-center w-full text-base text-white lg:items-end">
          <span className="text-xs">Protocol Growth </span>
          {displayNumber && (
            <span className="font-bold text-fuchsia-600">
              {formatLargeNumber(displayNumber)}
            </span>
          )}
        </div>

        <div className="flex-col items-end justify-end hidden w-full text-base text-transparent lg:flex bg-gradient-to-r from-white to-fuchsia-600 bg-clip-text">
          <span className="text-xs">Welcome </span>
          {userData && (
            <span className="font-bold">{userData.displayName}</span>
          )}
        </div>
      </div>

      {copiedRefCode && <SuccessMessage message={`Referral link copied`} />}
    </header>
  );
}
