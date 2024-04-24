"use client";
import React from "react";
import { auth } from "@/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SignInForm from "@/components/SignInForm";
import Loader from "@/components/loader";
import { signIn } from "@/server-action/auth-action";
import useAuth from "@/features/base/auth/hooks/use-auth";

const Home = () => {
  // const [user, loading] = useAuthState(auth);
  const {loading,user} =  useAuth()
  // const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    await sendPasswordResetEmail(auth, formData.email);
    alert(`Password Rest Link Send To ${formData.email}`);
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
