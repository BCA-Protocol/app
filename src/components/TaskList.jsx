import React, { useState, useEffect } from "react";
import { Web3Provider } from "@/providers/Web3Provider";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

const TaskList = ({ user, userData, sendEmailVerification }) => {
  // const { address, isConnecting, isDisconnected } = useAccount();
  // if (isConnecting) return <div>Connecting...</div>;
  // if (isDisconnected) return <div>Disconnected</div>;
  // return <div>Connected Wallet: {address}</div>;

  return (
    <div className="items-center justify-center w-full h-full text-center">
      <ul className="h-full p-4 space-y-2 bg-black border border-fuchsia-700 rounded-xl text-fuchsia-700">
        <li className="mb-4 font-bold">Available tasks</li>

        {/* Connect Wallet */}
        <li className="flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl hover:bg-fuchsia-950">
          <Web3Provider className="w-2/3 cursor-pointer hover:-translate-y-1">
            <ConnectKitButton
              theme="auto"
              mode="dark"
              className="hover:-translate-y-1"
            />
          </Web3Provider>
          <span className="text-sm text-gray-100">50 Points</span>
        </li>

        {/* Verify email */}
        <li className="flex flex-row items-center justify-between p-2 border border-fuchsia-600 rounded-xl hover:bg-fuchsia-950">
          <button
            disabled={
              user?.emailVerified ||
              userData?.completedTasks?.includes("verifyEmail")
            }
            onClick={() => {
              sendEmailVerification(user);
            }}
            className="flex items-center p-2 transition duration-500 ease-in-out transform cursor-pointer select-none rounded-xl text-white disabled:opacity-40 bg-[#383838] hover:bg-green-700 to-violet-700 hover:-translate-y-1 hover:shadow-lg disabled:bg-green-400 bg-green"
          >
            <div className="flex pl-1 ">
              <div className="font-medium">
                {user?.emailVerified ? "Email Verified" : "Verify Email"}
              </div>
            </div>
          </button>
          <span className="text-sm text-gray-100">10 Points</span>
        </li>
      </ul>
    </div>
  );
};

export default TaskList;
