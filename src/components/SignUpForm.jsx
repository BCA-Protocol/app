import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUserByUUID } from "@/utils/utils";

export default function SignUpForm({ onSignUp, refCode }) {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    referalCode: refCode||""
  });

  const [errors, setErrors] = useState({});
  const [signupDisabled, setSignupDisable] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  useEffect(() => {
    if (refCode) {
        handleReferalBlur()

    }
  }, [refCode]);

  const handleReferalBlur = async () => {
    const validationErrors = {};

    if (!formData.referalCode) {
      setSignupDisable(false);
      return;
    }
    setSignupDisable(true);
    const userdata = await getUserByUUID(formData.referalCode);
    if (userdata?.userId) {
      setSignupDisable(false);
    } else {
      validationErrors.referalCode = "Invalid Referral Code! Add new or remove the current";
    }
    setErrors(validationErrors);

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    

    const validationErrors = {};
    if (!formData.userName.trim()) {
      validationErrors.userName = "User Name is required";
    }
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    }
    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    }
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      onSignUp(formData);
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <form
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          onSubmit={handleSubmit}
        >
          <p className="text-center text-lg font-medium">Sign Up</p>

          <div>
            <label htmlFor="userName" className="sr-only">
              User Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${
                  errors.userName ? "border-red-500" : ""
                }`}
                placeholder="Enter user name"
              />
              {errors.userName && (
                <p className="text-red-500 text-sm">{errors.userName}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
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
                onChange={handleChange}
                className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="referalCode" className="sr-only">
              Referral code
            </label>
            <div className="relative">
              <input
                type="text"
                name="referalCode"
                value={formData.referalCode}
                onChange={handleChange}
                onBlur={handleReferalBlur}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Referral code"
              />
               {errors.referalCode && (
                <p className="text-red-500 text-sm">{errors.referalCode}</p>
              )}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?
            <Link className="underline" href="/">
              {" "}
              Sign In{" "}
            </Link>
          </p>

          <button
            type="submit"
            disabled={signupDisabled}
            className={`block w-full rounded-lg px-5 py-3 text-sm font-medium ${
              signupDisabled
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-indigo-600 text-white"
            }`}
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
