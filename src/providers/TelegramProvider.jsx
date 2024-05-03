import React, { useEffect } from "react";
// import { handleTaskCompletion } from "@/utils/utils";
import { handleTaskCompletion } from "@/server-action/user-action";
import { useRouter } from "next/navigation";

const TelegramLogin = ({ uid }) => {
  const router = useRouter();
  useEffect(() => {
    // Create a container element
    const container = document.createElement("div");
    container.id = "telegramLoginContainer";
    document.body.appendChild(container);

    // Dynamically load the Telegram Widget script inside the container
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    document.getElementById("telegramLoginContainer").appendChild(script);
  }, []);

  // Function to handle button click
  const handleTelegramLogin = async () => {
    console.log("Telegram", window.Telegram)
    console.log("BOT ID", process.env.TELEGRAM_BOT_ID)
    
    window.Telegram?.Login?.auth(
      { bot_id: process.env.TELEGRAM_BOT_ID, request_access: true },
      async (data) => {
        if (!data) {
          alert("No Data");
          return true;
        }
        const taskRes = await handleTaskCompletion(uid, "connectTelegram", {
          telegram_data: data,
        });
        router.replace("/");
      }
    );
  };

  return (
    <div>
      <button onClick={handleTelegramLogin}>Connect Telegram</button>
      <div className="w-2/3 text-white cursor-pointer hover:-translate-y-1"></div>
    </div>
  );
};

export default TelegramLogin;
