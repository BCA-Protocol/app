"use client";
import { auth, db } from "../../firebase";
import { IconFidgetSpinner } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { addData } from "@/utils/utils";
import SignUpForm from "@/components/SignUpForm";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { addPointsToUser } from "@/utils/utils";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const refCode = searchParams.get("ref");

  const [createUser] = useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

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
        completedTasks: [],
      });
      if (referalCode)
        await addPointsToUser(referalCode, 1000, "Referral SignUp", "Referral");
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center flex-col">
          <IconFidgetSpinner className="animate-spin w-8 h-8" />
        </div>
      ) : (
        <SignUpForm refCode={refCode} onSignUp={handleSignUp} />
      )}
    </>
  );
}
