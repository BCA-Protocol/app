"use client";
import { IconFidgetSpinner } from "@tabler/icons-react";
import { useState } from "react";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function Page() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <IconFidgetSpinner className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <ResetPasswordForm />
      )}
    </>
  );
}
