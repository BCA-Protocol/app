import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/bca-left.png";

const SignIn = ({ formData, onChange, onSubmit, onForgotPasswordSubmit }) => {
  const [forgotPasswordView, setForgotPasswordView] = useState(false);
  const [errors, setErrors] = useState({});

  const handleToggleForgotPassword = () => {
    setForgotPasswordView(!forgotPasswordView);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email || !formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address";
    }

    if (
      !forgotPasswordView &&
      (!formData.password || !formData.password.trim())
    ) {
      errors.password = "Password is required";
    }

    setErrors(errors);

    // Return true if there are no errors
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (forgotPasswordView) {
        onForgotPasswordSubmit(e);
      } else {
        onSubmit();
      }
    }
  };

  return (
    <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
      <div className="flex items-center justify-center w-full mt-8">
        <Image src={logo} alt="Logo" width={320} />
      </div>
      <div className="max-w-lg mx-auto">
        <form
          action="#"
          className="p-2 mt-6 mb-0 space-y-4 rounded-lg shadow-lg sm:p-4 lg:p-6"
          onSubmit={handleSubmit}
        >
          <p className="text-lg font-medium text-center">
            {forgotPasswordView ? "Forgot Password" : "Sign in to your account"}
          </p>

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={onChange}
                className="w-full p-4 text-sm border-gray-200 rounded-lg shadow-sm"
                placeholder="Enter email"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {!forgotPasswordView && (
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  className="w-full p-4 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter password"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="block w-full px-5 py-3 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-purple-950 to-fuchsia-700 hover:bg-gradient-to-l"
          >
            {forgotPasswordView ? "Submit" : "Sign in"}
          </button>

          {forgotPasswordView ? (
            <p className="text-sm text-center text-gray-500">
              Remember your password?{" "}
              <button
                type="button"
                className="underline focus:outline-none hover:text-fuchsia-700"
                onClick={handleToggleForgotPassword}
              >
                Sign in
              </button>
            </p>
          ) : (
            <p className="text-sm text-center text-gray-500">
              <button
                type="button"
                className="underline focus:outline-none hover:text-fuchsia-700"
                onClick={handleToggleForgotPassword}
              >
                Forgot your password?
              </button>
            </p>
          )}

          {!forgotPasswordView && (
            <p className="text-sm text-center text-gray-500">
              No account?
              <Link className="underline hover:text-fuchsia-700" href="/signup">
                {" "}
                Sign up{" "}
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
