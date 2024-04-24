'use server'
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { addPointsToUser, handleTaskCompletion } from "@/server-action/user-action";
import { collectBrowserData, fetchIPAddress } from "@/utils/helper";
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