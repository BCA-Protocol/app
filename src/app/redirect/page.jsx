"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IconFidgetSpinner } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { verifyEmail, handleTaskCompletion } from "@/utils/utils";
import ResetPasswordForm from "@/components/ResetPasswordForm";
const Home = () => {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (oobCode !== null && mode == "verifyEmail") {
      const handleVerification = async () => {
        setLoading(true);
        try {
          const response = await verifyEmail(oobCode);
          if (response.emailVerified) {
            const taskCOmRes = await handleTaskCompletion(
              response.localId,
              "verifyEmail"
            );
            if (taskCOmRes) {
              setLoading(false);
              router.replace("/dashboard");
              window.location.reload();
            } else {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error("Error verifying email:", error);
        }
      };

      handleVerification();
    }
  }, [oobCode]);

  return (
    <>
      {mode == "resetPassword" ? (
        <ResetPasswordForm oobCode={oobCode} />
      ) : (
        loading && (
          <IconFidgetSpinner className="w-12 h-12 mx-auto animate-spin" />
        )
      )}
    </>
  );
};

export default Home;
