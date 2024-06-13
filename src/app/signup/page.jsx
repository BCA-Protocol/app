"use client";
import { auth, db } from "../../firebase";
import { IconFidgetSpinner } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { addData, handleTaskCompletion } from "@/utils/utils";
import SignUpForm from "@/components/SignUpForm";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { addPointsToUser, getReferralIdsList} from "@/utils/utils";
import { Timestamp } from "firebase/firestore";
import { collectBrowserData, fetchIPAddress } from "@/utils/helper";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const refCode = searchParams.get("ref");

  const [createUser] = useCreateUserWithEmailAndPassword(auth);

  const [userCreated, setUserCreated] = useState(false);
  useEffect(() => {
    if (user && userCreated) {
      router.replace("/dashboard");
    }
  }, [router, user, userCreated]);

  const handleSignUp = async (formData) => {
    setLoading(true);
    const { email, password, displayName, referalCode } = formData;
    let res = await createUser(email, password);
    if (res && res.user) {
      let referrals = [];
      if (referalCode) {
        referrals = await getReferralIdsList(referalCode);
      }
      const userRes = await addData("users", {
        userId: res.user.uid,
        displayName: displayName,
        totalPoints: 1,
        referralPoints: 1,
        overallPoints: 2,
        referedBy: referalCode,
        referrals: referrals,
        completedTasks: {},
      });
      if (referalCode) {
        await addPointsToUser(referalCode, 5000, "Referral SignUp", "Referral");
      }

      const ip = await fetchIPAddress();
      const browserData = collectBrowserData();

      // fetch additional relevant data for the user
      await handleTaskCompletion(res.user.uid, "createAccount", {
        email: email,
        ip: ip,
        browserData: browserData,
      });

      setUserCreated(true);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <IconFidgetSpinner className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <SignUpForm refCode={refCode} onSignUp={handleSignUp} />
      )}
    </>
  );
}
