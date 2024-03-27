import { classNames } from "@/utils/css-utils";
import { useState, useEffect } from "react";

const Notification = ({ message, type }) => {
  const [showToast, setShowToast] = useState(true);
  let notificationClass = "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 30000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  switch (type) {
    case "error":
      notificationClass = "bg-red-600";
      break;
    case "warning":
      notificationClass = "bg-yellow-600";
      break;
    case "info":
      notificationClass = "bg-blue-600";
      break;
    case "dark":
      notificationClass = "bg-gray-600";
      break;
    case "success":
    default:
      notificationClass = "bg-green-600";
      break;
  }
  
  return (
    <div
      className={classNames(
        notificationClass,
        "fixed top-6 right-4 p-4 text-white rounded-xl z-40",
        showToast ? "opacity-100" : "opacity-0",
        "transition-opacity duration-500 ease-in-out"
      )}
    >
      {message}
    </div>
  );
};

export default Notification;
