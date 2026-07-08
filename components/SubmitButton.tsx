"use client";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useGlobalLoader } from "@/components/GlobalLoaderProvider";

export default function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
}: {
  children: React.ReactNode;
  pendingLabel: string;
  variant?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();
  const { startLoading, stopLoading } = useGlobalLoader();

  useEffect(() => {
    if (pending) {
      startLoading();
    } else {
      stopLoading();
    }

    return () => {
      stopLoading();
    };
  }, [pending, startLoading, stopLoading]);

  return (
    <button
      type="submit"
      disabled={pending}
      className={variant === "primary" ? "btn-primary" : "btn-secondary"}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
