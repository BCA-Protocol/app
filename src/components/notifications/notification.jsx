import React, { useState, useEffect } from "react";

const Notification = ({ message, type }) => {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Define classes based on the type prop
  const notificationClasses = () => {
    switch (type) {
      case "Success":
        return "bg-green-100 border-green-400 text-green-700";
      case "Error":
        return "bg-red-100 border-red-400 text-red-700";
      case "Warning":
        return "bg-yellow-100 border-yellow-400 text-yellow-700";
      case "Info":
        return "bg-blue-100 border-blue-400 text-blue-700";
      case "Dark":
        return "bg-gray-100 border-gray-400 text-gray-700";
      default:
        return "bg-green-100 border-green-400 text-green-700";
    }
  };

  return (
    <>
      <div></div>
      {showToast && (
        <div
          className={`flex items-center p-4 mb-4 text-sm rounded-lg ${notificationClasses()}`}
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">{type}</span>
          <div>
            <span className="font-medium">{type} alert!</span> {message}
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
