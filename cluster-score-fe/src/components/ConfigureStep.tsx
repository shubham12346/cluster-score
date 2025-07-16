import { Settings, Brain } from "lucide-react";

const ConfigureStep = ({
  formData,
  columnHeaders,
  handleColumnSelection,
  handleInputChange,
  isLoading,
  setCurrentStep,
  processSheet,
}: any) => (
  <div className=" bg-white rounded-lg shadow-lg p-8 space-y-6">
    <div className="flex items-center mb-6">
      <Settings className="mr-3 text-blue-500" size={24} />
      <h2 className="text-2xl font-semibold">Configure Processing</h2>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium mb-2">Input Columns</label>
        <div className="border p-3 rounded-lg max-h-40 overflow-y-auto space-y-2">
          {columnHeaders.map((header) => (
            <label key={header} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.inputColumns.includes(header)}
                onChange={() => handleColumnSelection(header, "input")}
              />
              <span>{header}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Output Columns</label>
        <input
          type="text"
          placeholder="e.g., Score"
          className="w-full px-3 py-2 border rounded-lg"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              handleColumnSelection(e.target.value.trim(), "output");
              e.target.value = "";
            }
          }}
        />
        <div className="mt-2 space-y-1">
          {formData.outputColumns.map((col) => (
            <div
              key={col}
              className="bg-blue-100 p-1 px-3 rounded flex justify-between"
            >
              <span>{col}</span>
              <button
                onClick={() => handleColumnSelection(col, "output")}
                className="text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Brain className="inline mr-1" size={16} />
        LLM Task Prompt
      </label>
      <textarea
        rows={3}
        value={formData.llmPrompt}
        onChange={(e) => handleInputChange("llmPrompt", e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Enter your prompt..."
      />
    </div>

    <div className="flex space-x-4">
      <button
        onClick={() => setCurrentStep(1)}
        className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
      >
        Back
      </button>
      <button
        onClick={processSheet}
        disabled={
          formData.inputColumns.length === 0 ||
          formData.outputColumns.length === 0 ||
          isLoading
        }
        className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
      >
        {isLoading ? "Processing..." : "Process Sheet"}
      </button>
    </div>
  </div>
);

export default ConfigureStep;
