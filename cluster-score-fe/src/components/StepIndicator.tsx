import { CheckCircle } from "lucide-react";

const StepIndicator = ({ step, isActive, isCompleted }: any) => (
  <div
    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
      isCompleted
        ? "bg-green-500 border-green-500 text-white"
        : isActive
        ? "bg-blue-500 border-blue-500 text-white"
        : "border-gray-300 text-gray-400"
    }`}
  >
    {isCompleted ? <CheckCircle size={16} /> : step}
  </div>
);

export default StepIndicator;
