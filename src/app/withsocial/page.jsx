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
  const gettoken = async (code) => {
    const data = new URLSearchParams();
    data.append("client_id", CLIENT_ID);
    data.append("client_secret", CLIENT_SECRET);
    data.append("grant_type", "authorization_code");
    data.append("code", code);
    data.append("redirect_uri", REDIRECT_URI);

    try {
      const response = await fetch(`${API_ENDPOINT}/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to exchange code for token");
      }

      const tokenData = await response.json();

      // Now you have the access token, you can use it to make requests to Discord's API
      console.log("Access Token:", tokenData.access_token);

      // Example: Fetch user data using the access token
      const userDataResponse = await fetch(`${API_ENDPOINT}/users/@me`, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = await userDataResponse.json();
      console.log("User Data:", userData);
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw error;
    }
  };

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
