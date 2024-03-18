import React, { useState, useEffect } from "react";

const TaskList = ({ user, sendEmailVerification }) => {

  return (
    <div className=" h-full items-center justify-center w-full">
      <ul className=" border border-borderprimary bg-bgcard p-4 rounded-lg h-full">
        <li className="border-gray-400 flex flex-row mb-2">
          <button
            onClick={() => {
              sendEmailVerification(user);
            }}
            className="disabled:opacity-40 select-none cursor-pointer bg-bgprim border border-borderprimary text-secondaryx rounded-md flex flex-1 items-center p-4  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
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
