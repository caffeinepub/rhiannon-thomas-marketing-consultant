import { useEffect, useState } from "react";
import { createActorWithConfig } from "../config";

export default function AdminReset() {
  const [status, setStatus] = useState<"resetting" | "done" | "error">(
    "resetting",
  );

  useEffect(() => {
    sessionStorage.removeItem("admin_authed");
    createActorWithConfig()
      .then((actor) => actor.resetAdmin())
      .then(() => {
        setStatus("done");
        setTimeout(() => {
          window.location.href = "/admin";
        }, 1500);
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div style={{ maxWidth: "380px", width: "100%" }}>
        {status === "resetting" && (
          <p className="text-black text-sm" style={{ opacity: 0.5 }}>
            Resetting admin...
          </p>
        )}
        {status === "done" && (
          <p className="text-black text-sm">
            Done. Redirecting to set a new password...
          </p>
        )}
        {status === "error" && (
          <p className="text-black text-sm" style={{ color: "red" }}>
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
