"use client";
import { auth } from "@/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SignInForm from "@/components/SignInForm";
import Loader from "@/components/loader";

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

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  const handleSubmit = async () => {
    try {
      // const res = await signInWithEmailAndPassword(
      //   formData.email,
      //   formData.password
      // );
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
