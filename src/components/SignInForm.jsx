import React, { useState } from 'react';
import Link from 'next/link';

const SignIn = ({ formData, onChange, onSubmit, onForgotPasswordSubmit }) => {
  const [forgotPasswordView, setForgotPasswordView] = useState(false);
  const [errors, setErrors] = useState({});

  const handleToggleForgotPassword = () => {
    setForgotPasswordView(!forgotPasswordView);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email || !formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (!forgotPasswordView && (!formData.password || !formData.password.trim())) {
      errors.password = 'Password is required';
    }

    setErrors(errors);

    // Return true if there are no errors
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();  // Ensure that 'e' is defined and preventDefault is called

    if (validateForm()) {
      // If validation passes, submit the form
      if (forgotPasswordView) {
        onForgotPasswordSubmit();
      } else {
        onSubmit();
      }
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <form
          action="#"
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          onSubmit={handleSubmit}  // Corrected to call handleSubmit with the event object
        >
          <p className="text-center text-lg font-medium">
            {forgotPasswordView ? 'Forgot Password' : 'Sign in to your account'}
          </p>

          {forgotPasswordView ? (
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                    placeholder="Enter email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
                    onChange={onChange}
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                    placeholder="Enter password"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </>
          )}

          <button
            type="submit"
            className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
          >
            {forgotPasswordView ? 'Submit' : 'Sign in'}
          </button>

          {forgotPasswordView ? (
            <p className="text-center text-sm text-gray-500">
              Remember your password?{' '}
              <button
                type="button"
                className="underline focus:outline-none"
                onClick={handleToggleForgotPassword}
              >
                Sign in
              </button>
            </p>
          ) : (
            <p className="text-center text-sm text-gray-500">
              <button
                type="button"
                className="underline focus:outline-none"
                onClick={handleToggleForgotPassword}
              >
                Forgot your password?
              </button>
            </p>
          )}

          {!forgotPasswordView && (
            <p className="text-center text-sm text-gray-500">
              No account?
              <Link className="underline" href="/signup">
                {' '}
                Sign up{' '}
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
