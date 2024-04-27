"use client";
// import DiscorOauth
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IconFidgetSpinner } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { handleTaskCompletion } from "@/utils/utils";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ContrastOutlined } from "@mui/icons-material";

const auth = getAuth();
const Home = () => {
  const searchParams = useSearchParams();
  const socialCode = searchParams.get("code");
  const errorCode = searchParams.get("error");
  const socialType = searchParams.get("type");
  const [loading, setLoading] = useState(false);
  const [errorSocial, setErrorSocial] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (socialCode !== null && socialType) {
      setLoading(true);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          const gettoken = async (code) => {
            if (socialType == "discord") {
              const discordResponse = await fetch(
                `${window.location.origin}/api/discorduser?code=${code}`
              ).then((res) => res.json());
              if(discordResponse.error) setErrorSocial(discordResponse.error)
              if (discordResponse.userData) {
                const taskRes = await handleTaskCompletion(
                  uid,
                  "connectDiscord",
                  {
                    discordData: discordResponse.userData,
                  }
                );
                router.replace("/dashboard");
              }
            } else if (socialType == "twitter") {
              const twitterResponse = await fetch(
                `${window.location.origin}/api/twitteruser?code=${code}`
              ).then((res) => res.json());
              if(twitterResponse.error) setErrorSocial(twitterResponse.error)
              if (twitterResponse.userData) {
                const taskRes = await handleTaskCompletion(
                  uid,
                  "connectTwitter",
                  {
                    twitterData: twitterResponse.userData,
                  }
                );
                router.replace('/dashboard');
              }
            }
          };

          gettoken(socialCode);
        } else {
          console.log("Not Redirect");
        }
      });
    } else if (errorCode!==null || socialType==="twitter?error=access_denied") setErrorSocial(errorCode==='access_denied' || socialType==="twitter?error=access_denied"? "Connection rejected by the user": "An unknown error has occured")
  }, []);

  useEffect(() => {
    if (errorSocial !== "") {
      router.replace(`/dashboard?error_message=${encodeURIComponent(errorSocial)}`);
    }
  }, [router, errorSocial]);

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-500 bg-opacity-50">
          <IconFidgetSpinner className="w-20 h-20 animate-spin" />
        </div>
      )}
    </>
  );
};

export default Home;
