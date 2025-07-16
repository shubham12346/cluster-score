import { AlertCircle, CheckCircle } from "lucide-react";
import { ProcessingStatusType } from "../hooks/useFormData";

const StatusMessage = ({ status }: any) => {
  const isError = status.toLowerCase().includes("error");

  return (
    <div
      className={`mt-6 p-4 rounded-lg ${
        isError
          ? "bg-red-50 border border-red-200"
          : "bg-blue-50 border border-blue-200"
      }`}
    >
      <div className="flex items-center">
        {status === ProcessingStatusType.ERROR ? (
          <AlertCircle className="text-red-500 mr-2" size={20} />
        ) : (
          <CheckCircle className="text-blue-500 mr-2" size={20} />
        )}
        <span className={isError ? "text-red-800" : "text-blue-800"}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default StatusMessage;
