import { useEffect, useState } from "react";
import { createActorWithConfig } from "../config";

export default function AdminReset() {
  const [status, setStatus] = useState<"resetting" | "done" | "error">(
    "resetting",
  );

  useEffect(() => {
    createActorWithConfig()
      .then((actor) => actor.resetAdmin())
      .then(() => {
        setStatus("done");
        setTimeout(() => {
          window.location.replace("/admin");
        }, 1500);
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Inter, sans-serif",
        fontSize: "1rem",
        color: "#000",
      }}
    >
      {status === "resetting" && "Resetting admin access..."}
      {status === "done" && "Done. Redirecting to admin..."}
      {status === "error" && "Something went wrong. Please try again."}
    </div>
  );
}
