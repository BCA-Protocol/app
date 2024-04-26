"use client";
// import DiscorOauth
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IconFidgetSpinner } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { handleTaskCompletion } from "@/utils/utils";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Notification from "@/components/notifications/notification";

const auth = getAuth();
const Home = () => {
  const searchParams = useSearchParams();
  const socialCode = searchParams.get("code");
  const socialType = searchParams.get("type");
  const [loading, setLoading] = useState(false);
  const [errorSocial, setErrorSocial] = useState("");
  const [notification, setNotification] = useState(null);

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
              if(discordResponse.error){
                setLoading(false);
                setNotification({
                  type: "error",
                  message: "Couldn't Connect To Discord: " + discordResponse.error,
                  show: true,
                });
              }
              if (discordResponse.userData) {
                const taskRes = await handleTaskCompletion(
                  uid,
                  "connectDiscord",
                  {
                    discordData: discordResponse.userData,
                  }
                );
              }
              router.replace(errorSocial?"/?socialerror=discord":"/");
            } else if (socialType == "twitter") {
              const twitterResponse = await fetch(
                `${window.location.origin}/api/twitteruser?code=${code}`
              ).then((res) => res.json());
              if(twitterResponse.error){
                setLoading(false);
                setNotification({
                  type: "error",
                  message: "Couldn't Connect To Twitter: " + twitterResponse.error,
                  show: true,
                });
              }
              if (twitterResponse.userData) {
                const taskRes = await handleTaskCompletion(
                  uid,
                  "connectTwitter",
                  {
                    twitterData: twitterResponse.userData,
                  }
                );
              }
              router.replace("/");
            }
          };

          gettoken(socialCode);
        } else {
          console.log("Not Redirect");
        }
      });
    }
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-500 bg-opacity-50">
          <IconFidgetSpinner className="w-20 h-20 animate-spin" />
        </div>
      )}
      {notification && notification.show && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </>
  );
};

export default Home;
