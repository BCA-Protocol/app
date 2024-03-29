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
import { addPointsToUser } from "@/utils/utils";
import { Timestamp } from "firebase/firestore";

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
    const { email, password, userName, referalCode } = formData;
    let res = await createUser(email, password);
    if (res && res.user) {
      const userRes = await addData("users", {
        userId: res.user.uid,
        username: userName,
        totalPoints: 0,
        referedBy: referalCode,
        completedTasks: {}
      });
      if (referalCode) {
        await addPointsToUser(referalCode, 5000, "Referral SignUp", "Referral");
      }

      await handleTaskCompletion(res.user.uid, "createAccount");

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
