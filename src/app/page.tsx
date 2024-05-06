"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SignInForm from "@/components/SignInForm";
import Loader from "@/components/loader";
import { signIn } from "@/server-action/auth-action";
import useAuth from "@/features/base/auth/hooks/use-auth";
import { handleResetPassword } from "@/server-action/auth-action"

const Home = () => {
  const { loading, user } = useAuth();
  // const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const searchParams = useSearchParams();
  const message = searchParams.get("message")

  useEffect(() => {
    if (message === "Could not authenticate user") {
      alert(`Email or password is incorrect`);
      router.replace("/");
    } else if (message === "Email not confirmed") {
      alert(`Email not confirmed. Please check your emails.`);
      router.replace("/");
    }
  }, [message]);

  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  

  const handleSubmit = async () => {
    try {
      // const res = await signInWithEmailAndPassword(
      //   formData.email,
      //   formData.password
      // );
      signIn({ email: formData.email, password: formData.password });
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  // const handleForgotPasswordSubmit = async (e) => {
  //   e.preventDefault();
  //   await sendPasswordResetEmail(auth, formData.email);
  //   alert(`Password Rest Link Send To ${formData.email}`);
  // };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    
    const { success, message } = await handleResetPassword(formData.email);
    if (success) {
      alert(message);
    } else {
      alert("Password reest failed");
      console.error("API call failed:", message);
      //handle error
    }
  };
  

  return (
    <div className="">
      {loading ? (
        <Loader show={loading} />
      ) : (
        !user && (
          <>
            <SignInForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onForgotPasswordSubmit={handleForgotPasswordSubmit}
            />
          </>
        )
      )}
    </div>
  );
};

export default Home;
