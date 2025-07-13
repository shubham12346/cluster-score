import React, { useState } from "react";
import {
  Upload,
  Play,
  Settings,
  FileText,
  Globe,
  Brain,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const GoogleSheetLLMFrontend = () => {
  const [formData, setFormData] = useState({
    googleSheetUrl: "",
    sheetName: "",
    websiteUrl: "",
    inputColumns: [],
    outputColumns: [],
    llmPrompt: "Score the relevance for the company based on the description.",
  });

  const [columnHeaders, setColumnHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [results, setResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchColumnHeaders = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to fetch column headers
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock column headers - replace with actual API call
      const mockHeaders = [
        "Keyword",
        "Category",
        "Volume",
        "Competition",
        "Description",
      ];
      setColumnHeaders(mockHeaders);
      setCurrentStep(2);
    } catch (error) {
      console.error("Error fetching headers:", error);
      setProcessingStatus("Error: Failed to fetch column headers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleColumnSelection = (column, type) => {
    setFormData((prev) => {
      if (type === "input") {
        const newInputColumns = prev.inputColumns.includes(column)
          ? prev.inputColumns.filter((c) => c !== column)
          : [...prev.inputColumns, column];
        return { ...prev, inputColumns: newInputColumns };
      } else {
        const newOutputColumns = prev.outputColumns.includes(column)
          ? prev.outputColumns.filter((c) => c !== column)
          : [...prev.outputColumns, column];
        return { ...prev, outputColumns: newOutputColumns };
      }
    });
  };

  const processSheet = async () => {
    setIsLoading(true);
    setProcessingStatus("Processing rows...");

    try {
      // Simulate API call to process sheet
      const response = await fetch("/score-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleSheetUrl: formData.googleSheetUrl,
          sheetName: formData.sheetName,
          websiteUrl: formData.websiteUrl,
          inputColumns: formData.inputColumns,
          outputColumns: formData.outputColumns,
          llmPrompt: formData.llmPrompt,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setResults(result);
        setProcessingStatus("Processing completed successfully!");
        setCurrentStep(3);
      } else {
        throw new Error("Failed to process sheet");
      }
    } catch (error) {
      console.error("Error processing sheet:", error);
      setProcessingStatus("Error: Failed to process sheet");
    } finally {
      setIsLoading(false);
    }
  };

  const StepIndicator = ({ step, isActive, isCompleted }) => (
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Google Sheet LLM Processor
          </h1>
          <p className="text-gray-600">
            Process your Google Sheets data with AI-powered analysis
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center space-x-4">
            <StepIndicator
              step={1}
              isActive={currentStep === 1}
              isCompleted={currentStep > 1}
            />
            <div
              className={`h-1 w-16 ${
                currentStep > 1 ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
            <StepIndicator
              step={2}
              isActive={currentStep === 2}
              isCompleted={currentStep > 2}
            />
            <div
              className={`h-1 w-16 ${
                currentStep > 2 ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
            <StepIndicator
              step={3}
              isActive={currentStep === 3}
              isCompleted={false}
            />
          </div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex justify-between w-80 text-sm text-gray-600">
            <span>Setup</span>
            <span>Configure</span>
            <span>Process</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Step 1: Setup */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <FileText className="mr-3 text-blue-500" size={24} />
                <h2 className="text-2xl font-semibold">
                  Sheet & Website Setup
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Sheet URL
                  </label>
                  <input
                    type="url"
                    value={formData.googleSheetUrl}
                    onChange={(e) =>
                      handleInputChange("googleSheetUrl", e.target.value)
                    }
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sheet Name
                  </label>
                  <input
                    type="text"
                    value={formData.sheetName}
                    onChange={(e) =>
                      handleInputChange("sheetName", e.target.value)
                    }
                    placeholder="Sheet1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline mr-1" size={16} />
                  Website URL (Optional - for company info scraping)
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) =>
                    handleInputChange("websiteUrl", e.target.value)
                  }
                  placeholder="https://company-website.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={fetchColumnHeaders}
                disabled={
                  !formData.googleSheetUrl || !formData.sheetName || isLoading
                }
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Fetching Headers..." : "Fetch Column Headers"}
              </button>
            </div>
          )}

          {/* Step 2: Configure */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <Settings className="mr-3 text-blue-500" size={24} />
                <h2 className="text-2xl font-semibold">Configure Processing</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Input Columns (select columns to use as LLM input)
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {columnHeaders.map((header) => (
                      <label
                        key={header}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={formData.inputColumns.includes(header)}
                          onChange={() =>
                            handleColumnSelection(header, "input")
                          }
                          className="text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm">{header}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Output Columns (new columns for LLM results)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Add output column name (e.g., 'Score', 'Cluster')"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          handleColumnSelection(
                            e.target.value.trim(),
                            "output"
                          );
                          e.target.value = "";
                        }
                      }}
                    />
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {formData.outputColumns.map((column) => (
                        <div
                          key={column}
                          className="flex items-center justify-between bg-blue-50 p-2 rounded text-sm"
                        >
                          <span>{column}</span>
                          <button
                            onClick={() =>
                              handleColumnSelection(column, "output")
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Brain className="inline mr-1" size={16} />
                  LLM Task Prompt
                </label>
                <textarea
                  value={formData.llmPrompt}
                  onChange={(e) =>
                    handleInputChange("llmPrompt", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your prompt for the LLM..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
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
                  className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Processing..." : "Process Sheet"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {currentStep === 3 && (
            <div className="space-y-6">
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
                onClick={() => {
                  setCurrentStep(1);
                  setFormData({
                    googleSheetUrl: "",
                    sheetName: "",
                    websiteUrl: "",
                    inputColumns: [],
                    outputColumns: [],
                    llmPrompt:
                      "Score the relevance for the company based on the description.",
                  });
                  setColumnHeaders([]);
                  setResults([]);
                  setProcessingStatus("");
                }}
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Process Another Sheet
              </button>
            </div>
          )}

          {/* Status Messages */}
          {processingStatus && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                processingStatus.includes("Error")
                  ? "bg-red-50 border border-red-200"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <div className="flex items-center">
                {processingStatus.includes("Error") ? (
                  <AlertCircle className="text-red-500 mr-2" size={20} />
                ) : (
                  <CheckCircle className="text-blue-500 mr-2" size={20} />
                )}
                <span
                  className={
                    processingStatus.includes("Error")
                      ? "text-red-800"
                      : "text-blue-800"
                  }
                >
                  {processingStatus}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleSheetLLMFrontend;
