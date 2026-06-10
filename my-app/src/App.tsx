import { useEffect, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { PinInput } from "./components/base/input/pin-input";

export default function App() {
  console.log("APP LOADED")
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const verifyCode = async (code: string) => {
    if (!code || code.length !== 6) return;
    console.log("Calling backend with:", code);
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await fetch("https://packofgum.onrender.com/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Verification failed");
      }

      setStatus("success");
      setMessage("Code verified successfully ✅");
      console.log("Success:", data);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit when 6 digits are entered
    useEffect(() => {
    console.log("VALUE:", value);
    }, [value]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        
      <input
  value={value}
  onChange={(e) => {
    console.log("INPUT:", e.target.value);
    setValue(e.target.value);
  }}
  maxLength={6}
/>

      <button onClick={() => verifyCode(value)} disabled={loading} style={{ padding: "8px 12px", cursor: loading ? "not-allowed" : "pointer",}}>
        {loading ? "Verifying..." : "Verify"}
      </button>

      {message && (
        <p
          style={{
            color:
              status === "success"
                ? "green"
                : status === "error"
                ? "red"
                : "black",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
