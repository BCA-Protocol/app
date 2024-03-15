"use client";
import { auth } from "@/firebase";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IconFidgetSpinner } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { verifyEmail, handleTaskCompletion } from "@/utils/utils";
const Home = () => {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (oobCode !== null) {
      const handleVerification = async () => {
        setLoading(true);
        try {
          const response = await verifyEmail(oobCode);
          console.log("response", response);
          if (response.emailVerified) {
            const taskCOmRes = await handleTaskCompletion(
              response.localId,
              "verifyEmail"
            );
            console.log("task res", taskCOmRes);
            if (taskCOmRes) {
              setLoading(false);
              router.replace("/dashboard");
            } else {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
          console.log("email verify response", response);
        } catch (error) {
          console.error("Error verifying email:", error);
        }
      };

      handleVerification();
    }
  }, [oobCode]);

  return (
    <>
      {loading && (
        <IconFidgetSpinner className="animate-spin w-12 h-12 mx-auto" />
      )}
    </>
  );
};

export default Home;
