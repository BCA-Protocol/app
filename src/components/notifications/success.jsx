import { useState, useEffect } from 'react';

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
      className={`fixed bottom-4 right-4 p-4 bg-green-500 text-white rounded-md ${
        showToast ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-500 ease-in-out`}
    >
      {message}
    </div>
  );
};

export default SuccessMessage;
