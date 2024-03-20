import { useState, useEffect } from "react";

const SuccessMessage = ({ message }) => {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={`fixed top-8 right-4 p-4 bg-green-600 text-white rounded-xl z-40 ${
        showToast ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500 ease-in-out`}
    >
      {message}
    </div>
  );
};

export default SuccessMessage;
