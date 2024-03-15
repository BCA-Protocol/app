"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { handleResetPassword } from "@/utils/utils";
import { IconFidgetSpinner } from "@tabler/icons-react";

const ResetPasswordForm = ({ oobCode }) => {
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
    if (!oobCode) {
      alert("oob code doesnt exist");
    }
    if (validateForm()) {
      setLoading(true);
      try {
        const result = await handleResetPassword(oobCode, formData.newPassword);
        if (result.success) {
          alert(result.message);
          router.replace("/");
        } else {
          alert(result.message);        }
        setLoading(false);
      } catch (error) {
        alert(error);

        console.error("Error handling password reset:", error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex justify-center items-center flex-col">
          <IconFidgetSpinner className="animate-spin w-8 h-8" />
        </div>
      ) : (
        <div className="mx-auto max-w-lg">
          <form
            action="#"
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
            onSubmit={onSubmit}
          >
            <p className="text-center text-lg font-medium">Reset Password</p>

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
                  <p className="text-red-500 text-sm">{errors.newPassword}</p>
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
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
            >
              Reset Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordForm;
