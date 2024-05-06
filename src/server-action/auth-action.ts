"use server";
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { addPointsToUser, handleTaskCompletion } from "@/server-action/user-action";

export const signUpAction = async ({email, password, displayName, referedBy,ip,browserData}: any) => {
  const origin = headers().get("origin");
  const supabase = createClient();

  const { error, data:signupUserData }:any = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/verifyemail`,
              data: {
                  display_name:displayName,
                  refered_by: referedBy
              }
    },
  });
  console.log("signupUserData",error, signupUserData)
  // if (signupUserData?.user_metadata?.email_verified) {
  //   const { error: authError, data: authUser } =
  //     await supabase.auth.signInWithPassword({
  //       email,
  //       password,
  //     });
  // }

  if (error) {
    return redirect("/signup?message=Could not authenticate user");
  }

  return redirect("/");
};

export const signIn = async ({email,password}:{email:string,password:string}) => {

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log("error", error)
  if (error) {
    console.log("Signin Error:",error.message)
    if (error.message === "Email not confirmed")
      return redirect("/?message=Email not confirmed");
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
export const handleVerifyEmail = async (ip: string, browserData: any) => {
  try {
    const supabase: any = createClient();
    const response = await supabase.auth.getUser();
    console.log("response",response)

    const referedBy = response?.data?.user?.user_metadata?.refered_by;

    if (referedBy) {
        await addPointsToUser({userId: referedBy, pointsToAdd:5000, description:"Referral SignUp", type:"Referral"});
        const updatedUser = await supabase.from('users').update({refered_by: referedBy}).eq('id', response?.data?.user.id!);
        console.log(updatedUser)
    }

    await handleTaskCompletion(response?.data?.user?.id!, "createAccount", {
      email: response?.data?.user?.email,
      ip: ip,
      browser_data: browserData,
    });

    if(response?.data?.user?.email_confirmed_at){
      const taskCOmRes = await handleTaskCompletion(
        response?.data?.user.id,
        "verifyEmail"
    );
    console.log("taskCOmRes",taskCOmRes)

    }
  } catch (error) {
    console.log("handleVerfyEmail Error:", error)    
  }

  return redirect("/dashboard");
}
export const resendEmailVerification = async (email:string) => {
  try {
    const supabase = createClient();
    const origin = headers().get("origin")
    console.log("resendEmailVerification", email)
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${origin}/verifyemail`
      }
    })
    console.log("resendEmailVerification", data, error)
    if(data){
      return { success: true, message: "Verification email sent successfully"};
    }
   
  } catch (error) {
    
  }
}
export const loginWithTwitter = async () => {
  
    const supabase = createClient();
    const origin = headers().get("origin")
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
				redirectTo: `${origin}/withsocial?type=twitter`
			}
    })
  
}
export const getAuthUser = async () => {
  const supabase = createClient();
  return await supabase.auth.getUser();
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