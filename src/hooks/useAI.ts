import { useState } from "react";

export const useAI = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const summarize = async (text: string) => {
    setLoading(true);
    setSummary(null);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to summarize");
      }
      setSummary(data.summary);
    } catch (err) {
      const errMessage =
        err instanceof Error
          ? err.message
          : "Error: Failed to reach the AI module";
      setSummary(errMessage);
      console.log(errMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, summary, summarize };
};
