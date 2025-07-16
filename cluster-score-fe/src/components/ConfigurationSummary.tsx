import React from "react";

interface ConfigurationSummaryProps {
  formData: {
    inputColumns: string[];
    outputColumns: string[];
    llmPrompt: string;
  };
  isProcessing: boolean;
  onEditClick: () => void;
}

const ConfigurationSummary: React.FC<ConfigurationSummaryProps> = ({
  formData,
  isProcessing,
  onEditClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Review Configuration
        </h2>
        <button
          className="text-blue-600 hover:underline text-sm"
          onClick={onEditClick}
          disabled={isProcessing}
        >
          Edit
        </button>
      </div>

      <div>
        <p className="text-sm text-gray-600 font-semibold mb-1">
          Input Columns:
        </p>
        <ul className="text-gray-700 text-sm list-disc list-inside">
          {formData.inputColumns.map((col) => (
            <li key={col}>{col}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm text-gray-600 font-semibold mb-1">
          Output Columns:
        </p>
        <ul className="text-gray-700 text-sm list-disc list-inside">
          {formData.outputColumns.map((col) => (
            <li key={col}>{col}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm text-gray-600 font-semibold mb-1">LLM Prompt:</p>
        <p className="text-gray-700 text-sm whitespace-pre-line">
          {formData.llmPrompt}
        </p>
      </div>
    </div>
  );
};

export default ConfigurationSummary;
