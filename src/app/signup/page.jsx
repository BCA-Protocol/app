"use client";
import { IconFidgetSpinner } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SignUpForm from "@/components/SignUpForm";
import { collectBrowserData, fetchIPAddress } from "@/utils/helper";
import {signUpAction} from '@/server-action/auth-action'
import useAuth from "@/features/base/auth/hooks/use-auth";

export default function Page() {
  const searchParams = useSearchParams();
  // const router = useRouter();
  // const { user } = useAuth()
  const [loading, setLoading] = useState(false);
  const refCode = searchParams.get("ref");

  // useEffect(() => {
  //   if (user) {
  //     router.replace("/dashboard");
  //   }
  // }, [router, user]);

  const handleSignUp = async (formData) => {
    setLoading(true);
    const { email, password, displayName, referalCode } = formData;
    console.log('formData', formData)
    const ip = await fetchIPAddress();
    const browserData = collectBrowserData();
    await signUpAction({email, password, displayName,referedBy: referalCode,ip, browserData})
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
