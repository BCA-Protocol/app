"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconFidgetSpinner } from "@tabler/icons-react";
import mascot from "/public/m/1-small.png";
import Image from "next/image";
import { handleConfirmNewPassword } from "@/server-action/auth-action"

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  // const oobCode = searchParams.get("oobCode");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.newPassword.trim()) {
      validationErrors.newPassword = "New Password is required";
    }

    if (!formData.confirmPassword.trim()) {
      validationErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // if (!oobCode) {
    //   alert("oob code doesnt exist");
    // }
    if (validateForm()) {
      setLoading(true);
      try {    
        const { success, message, redirectUrl } = await handleConfirmNewPassword(formData.newPassword);
        if (success) {
          alert(message);
          // router.replace(redirectUrl);
        } else {
          alert(message);
          //handle error
        }

        setLoading(false);
      } catch (error) {
        alert(error);

        console.error("Error handling password reset:", error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <IconFidgetSpinner className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center w-full mt-8">
            <Image src={mascot} alt="Logo" width={320} />
          </div>
          <div className="max-w-lg mx-auto">
            <form
              action="#"
              className="px-4 mb-0 space-y-4 rounded-lg shadow-lg sm:px-6 lg:px-8"
              onSubmit={onSubmit}
            >
              <p className="text-lg font-medium text-center">Reset Password</p>

              <div>
                <label htmlFor="newPassword" className="sr-only">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={onChange}
                    className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${
                      errors.newPassword ? "border-red-500" : ""
                    }`}
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-red-500">{errors.newPassword}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={onChange}
                    className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="block w-full px-5 py-3 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-purple-950 to-fuchsia-700 hover:bg-gradient-to-l"
              >
                Reset Password
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ResetPasswordForm;
