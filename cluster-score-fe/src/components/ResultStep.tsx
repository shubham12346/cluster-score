import { CheckCircle } from "lucide-react";

const ResultsStep = ({ formData, results, resetForm }: any) => (
  <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
    <div className="flex items-center mb-6">
      <CheckCircle className="mr-3 text-green-500" size={24} />
      <h2 className="text-2xl font-semibold">Processing Results</h2>
    </div>

    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center">
        <CheckCircle className="text-green-500 mr-2" size={20} />
        <span className="text-green-800 font-medium">
          Sheet processed successfully!
        </span>
      </div>
    </div>

    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold mb-2">Processing Summary:</h3>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>• Input columns: {formData.inputColumns.join(", ")}</li>
        <li>• Output columns: {formData.outputColumns.join(", ")}</li>
        <li>• Prompt: {formData.llmPrompt}</li>
      </ul>
    </div>

    <button
      onClick={resetForm}
      className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600"
    >
      Process Another Sheet
    </button>
  </div>
);

export default ResultsStep;
