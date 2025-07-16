import { useEffect, useState } from "react";

export const useProgressPolling = ({
  processingStatus,
}: {
  processingStatus: string;
}) => {
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const fetchProgress = async () => {
      try {
        setLoading(true);
        console.log("Fetching progress...");
        const res = await fetch(`http://localhost:8000/progress`);
        if (res.ok) {
          const data = await res.json();
          console.log("Progress data received:", data);
          setProgress(data);
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
        setProgress({});
      } finally {
        console.log("Progress loading state:", false);
        setLoading(false);
      }
    };

    fetchProgress();
    intervalId = setInterval(fetchProgress, 5000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return { progress, loading };
};
