"use client";
import { auth } from "@/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { IconFidgetSpinner } from "@tabler/icons-react";
import Link from "next/link";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SignInForm from "@/components/SignInForm";

const Home = () => {
  const [user, loading] = useAuthState(auth);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await signInWithEmailAndPassword(
        formData.email,
        formData.password
      );
      console.log({ res });
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
        <IconFidgetSpinner className="animate-spin w-12 h-12 mx-auto" />
      ) : !user && (
        <>
          <SignInForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onForgotPasswordSubmit={handleForgotPasswordSubmit}
          />
        </>
      )}
    </div>
  );
};

export default Home;
