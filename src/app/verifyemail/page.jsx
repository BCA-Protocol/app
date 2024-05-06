"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IconFidgetSpinner } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { verifyEmail } from "@/utils/utils";
import { handleVerifyEmail } from "@/server-action/auth-action";
import { collectBrowserData, fetchIPAddress } from "@/utils/helper";

const Home = () => {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {

      const handleVerification = async () => {
        setLoading(true);
        try {
    
          const ip = await fetchIPAddress();
          const browserData = collectBrowserData();

          await handleVerifyEmail( ip, browserData );
          setLoading(false);
          // const response = await verifyEmail(oobCode);
          // if (response.emailVerified) {
          //   const taskCOmRes = await handleTaskCompletion(
          //     response.localId,
          //     "verifyEmail"
          //   );
          //   if (taskCOmRes) {
          //     setLoading(false);
          //     router.replace("/dashboard");
          //     window.location.reload();
          //   } else {
          //     setLoading(false);
          //   }
          // } else {
          //   setLoading(false);
          // }
        } catch (error) {
          console.error("Error verifying email:", error);
        }
      };

      handleVerification();
    
  }, []);

  return (
    <>
      {loading && (
        <IconFidgetSpinner className="w-12 h-12 mx-auto animate-spin" />
      )}
    </>
  );
};

export default Home;
