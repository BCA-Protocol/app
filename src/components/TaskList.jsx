import React, { useState, useEffect } from "react";

const TaskList = ({ user, userData, sendEmailVerification }) => {
  return (
    <div className=" h-full items-center justify-center w-full text-center">
      <ul className=" border border-borderprimary bg-black p-4 rounded-2xl h-full">
      <h4 className="mb-2">Available Tasks</h4>

        <li className="border-gray-400 flex flex-row mb-2">
          <button
            disabled={
              user?.emailVerified ||
              userData?.completedTasks?.includes("verifyEmail")
            }
            onClick={() => {
              sendEmailVerification(user);
            }}
            className="disabled:opacity-40 select-none cursor-pointer  bg-gradient-to-l from-violet-700 to-violet-700 border border-borderprimary text-secondaryx rounded-md flex flex-1 items-center p-4  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:bg-green-400 bg-green"
          >
            <div className="flex pl-1 ">
              <div className="font-medium">
                {user?.emailVerified ? "Email Verified" : "Verify Email"}
              </div>
              <div className="text-typography text-sm ml-10">10 Points</div>
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default TaskList;
