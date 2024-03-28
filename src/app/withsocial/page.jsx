"use client";
// import DiscorOauth
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IconFidgetSpinner } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { handleTaskCompletion } from "@/utils/utils";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
const Home = () => {
  const searchParams = useSearchParams();
  const socialCode = searchParams.get("code");
  const socialType = searchParams.get("type");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (socialCode !== null && socialType) {
      setLoading(true);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          const gettoken = async (code) => {
            if (socialType == "discord") {
              const userData = await fetch(`${window.location.origin}/api/discorduser?code=${code}`).then((res) => res.json());
              if (userData) {
                const taskRes = await handleTaskCompletion(
                  uid,
                  "connectDiscord",
                  userData.userData
                );
                router.replace("/");
              }
            } else if (socialType == "twitter") {
              const userData = await fetch(`${window.location.origin}/api/twitteruser?code=${code}`).then((res) => res.json());
              if (userData) {
                const taskRes = await handleTaskCompletion(
                  uid,
                  "connectTwitter",
                  userData.userData
                );
                router.replace("/");
              }
            }
          };
          
          gettoken(socialCode);
        } else {
          console.log('Not Redirect');
        }
      });
    }
  }, []);
  
  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <IconFidgetSpinner className="animate-spin w-20 h-20" />
        </div>
      )}
    </>
  );
};

export default Home;
