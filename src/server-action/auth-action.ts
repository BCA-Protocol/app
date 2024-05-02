"use server";
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { addPointsToUser, handleTaskCompletion } from "@/server-action/user-action";

export const signUpAction = async ({email, password, displayName, referedBy,ip,browserData}: any) => {
  const origin = headers().get("origin");
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
              data: {
                  display_name:displayName,
                  refered_by: referedBy
              }
    },
  });
  const { error:authError, data:authUser } = await supabase.auth.signInWithPassword({
      email,
      password,
  });
  if (referedBy) {
      await addPointsToUser({userId: referedBy, pointsToAdd:5000, description:"Referral SignUp", type:"Referral"});
      const response = await supabase.from('users').update({refered_by: referedBy}).eq('id', referedBy);
      console.log(response)
  }
  
  console.log(authUser, authError)
  await handleTaskCompletion(authUser?.user?.id!, "createAccount", {
  email: email,
  ip: ip,
  browserData: browserData,
  });
  console.log(error)
  if (error) {
    return redirect("/signup?message=Could not authenticate user");
  }

  return redirect("/dashboard");
};
  export const signIn = async ({email,password}:{email:string,password:string}) => {

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/?message=Could not authenticate user");
    }

    return redirect("/dashboard");
};

export const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/");
}

export const authUserSession = async () => {
  const supabase = createClient();
  const session = await supabase.auth.getSession();
  if (!session) {
    return redirect("/");
  }
  return session;
}

export const handleResetPassword = async (email: string) => {
  try {
    const supabase = createClient();
    const origin = headers().get("origin")

    const { data, error } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      });

    if (error) {
      console.error("Password reset failed:", error);
      return { success: false, message: "Password reset failed", redirectUrl: "/" };
    }
    if (data) {
      console.log("Password reset link sent to", email);
      return { success: true, message: `Password reset link sent to ${email}`, redirectUrl: "/" };
    }
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, message: "Error sending password reset email", redirectUrl: "/" };
  }
};

export const handleConfirmNewPassword = async (newPassword: string) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
      
    if (error) {
      console.error("Confirming new password failed:", error);
      return { success: false, message: "Password reset failed", redirectUrl: "/" };
    }
    if (data) {
      console.log("Confirming new password successful");
      return { success: true, message: "Password reset successful", redirectUrl: "/" };
    } 
  } catch (error) {
    console.error("Error confirming new password:", error);
    return { success: false, message: "Error confirming new password", redirectUrl: "/" };
  }
}

// if (code) {
//   const supabase = createClient();
//   await supabase.auth.exchangeCodeForSession(code);
// }
// import { createClient } from "@/utils/supabase/server";
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
// // The `/auth/callback` route is required for the server-side auth flow implemented
// // by the SSR package. It exchanges an auth code for the user's session.
// // https://supabase.com/docs/guides/auth/server-side/nextjs
// const requestUrl = new URL(request.url);
// const code = requestUrl.searchParams.get("code");
// const origin = requestUrl.origin;