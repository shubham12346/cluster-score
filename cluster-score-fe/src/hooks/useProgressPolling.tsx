import { useEffect, useState } from "react";
import { ProcessingStatusType } from "./useFormData";

export const useProgressPolling = ({
  processingStatus,
  onComplete,
}: {
  processingStatus: string;
  onComplete?: () => void;
}) => {
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false); // track polling status

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const fetchProgress = async () => {
      try {
        setLoading(true);
        console.log("Fetching progress...");
        const res = await fetch(`http://localhost:8000/progress`);
        if (res.ok) {
          const data = await res.json();
          console.log("Progress data received:", data);
          setProgress(data);

          const status = data?.status?.status;
          if (status === "completed" || status === "error") {
            console.log("Polling stopped — status:", status);
            setIsPolling(false);
            if (onComplete) onComplete();
          }
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
        setProgress({});
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch and setup interval
    if (isPolling) {
      fetchProgress();
      intervalId = setInterval(fetchProgress, 5000);
    }

    // Clear interval when unmounted or polling stops
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPolling]); // 🔁 run effect again if polling stops

  useEffect(() => {
    if (processingStatus === "processing") {
      setIsPolling(true);
    }
  }, [processingStatus]);

  return { progress, loading, isPolling };
};
