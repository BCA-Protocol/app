"use client";
// import DiscorOauth
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IconFidgetSpinner } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import useAuth from "@/features/base/auth/hooks/use-auth";
import { handleTaskCompletion } from "@/server-action/user-action";

const Home = () => {
  const {user} =  useAuth()
  const searchParams = useSearchParams();
  const socialCode = searchParams.get("code");
  const socialType = searchParams.get("type");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (socialCode !== null && socialType) {
      setLoading(true);
        if (user?.id) {
          const uid = user?.id;
          const gettoken = async (code) => {
            if (socialType == "discord") {
              const userData = await fetch(
                `${window.location.origin}/api/discorduser?code=${code}`
              ).then((res) => res.json());
              if (userData) {
                const taskRes = await handleTaskCompletion(
                  uid,
                  "connectDiscord",
                  {
                    discord_data: userData.userData,
                  }
                );
                router.replace("/");
              }
            } else if (socialType == "twitter") {
              const userData = await fetch(
                `${window.location.origin}/api/twitteruser?code=${code}`
              ).then((res) => res.json());
              if (userData) {
                const taskRes = await handleTaskCompletion(
                  uid,
                  "connectTwitter",
                  {
                    twitter_data: userData.userData,
                  }
                );
                router.replace("/");
              }
            }
          };

          gettoken(socialCode);
        } else {
          console.log("Not Redirect");
        }
    }
  }, [user]);

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
