import { useEffect } from "react";

export default function AdminReset() {
  useEffect(() => {
    window.location.replace("/");
  }, []);
  return null;
}
