import { useState, useEffect } from "react";
import { getUserById } from "@/server-action/user-action";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/bca-left.png";
import { checkReference } from "@/server-action/base-action"

export default function SignUpForm({ onSignUp, refCode }) {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    referalCode: refCode || "",
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
      handleReferalBlur();
    }
  }, [refCode]);

  const handleReferalBlur = async () => {

    const data = checkReference(formData.referalCode)
    const validationErrors = {};

    if (!formData.referalCode) {
      setSignupDisable(false);
      return;
    }
    setSignupDisable(true);
    // const userdata = await getUserById(formData.referalCode)
    // if (userdata?.id) {
    //   setSignupDisable(false);
    // } else {
    //   validationErrors.referalCode =
    //     "Invalid Referral Code! Add new or remove the current";
    // }
    setErrors(validationErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.displayName.trim()) {
      validationErrors.displayName = "Display name is required";
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

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSignUp(formData);
      formData.displayName = "";
      formData.email = "";
      formData.password = "";
      formData.paconfirmPasswordssword = "";
    }
  };

  return (
    <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
      <div className="flex items-center justify-center w-full mt-8">
        <Image src={logo} alt="Logo" width={320} />
      </div>
      <div className="max-w-lg mx-auto">
        <form
          className="p-2 mt-6 mb-0 space-y-4 rounded-lg shadow-lg sm:p-4 lg:p-6"
          onSubmit={handleSubmit}
        >
          <p className="text-lg font-medium text-center">Sign Up</p>

          <div>
            <label htmlFor="displayName" className="sr-only">
              Display name
            </label>
            <div className="relative">
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${
                  errors.displayName ? "border-red-500" : ""
                }`}
                placeholder="Enter user name"
              />
              {errors.displayName && (
                <p className="text-sm text-red-500">{errors.displayName}</p>
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
                autoComplete="email"
                autoSave="email"
                onChange={handleChange}
                className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
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
                autoComplete="new-password"
                onChange={handleChange}
                className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
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
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
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
                className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${
                  errors.referalCode ? "border-red-500" : ""
                }`}
                placeholder="Referral code"
              />
              {errors.referalCode && (
                <p className="text-sm text-red-500">{errors.referalCode}</p>
              )}
            </div>
          </div>

          <p className="text-sm text-center text-gray-500">
            Already have an account?
            <Link className="underline hover:text-fuchsia-700" href="/">
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
                : "text-white bg-gradient-to-r from-purple-950 to-fuchsia-700 hover:bg-gradient-to-l"
            }`}
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
