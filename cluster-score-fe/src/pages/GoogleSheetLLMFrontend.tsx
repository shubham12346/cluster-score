import React from "react";
import StepIndicator from "../components/StepIndicator";
import SetupStep from "../components/SetupStep";
import ConfigureStep from "../components/ConfigureStep";
import ResultsStep from "../components/ResultStep";
import StatusMessage from "../components/StatusMessage";

import { useFormData } from "../hooks/useFormData";
import { fetchMockColumnHeaders, processSheetAPI } from "../services/api";

const GoogleSheetLLMFrontend = () => {
  const {
    formData,
    handleInputChange,
    handleColumnSelection,
    columnHeaders,
    setColumnHeaders,
    isLoading,
    setIsLoading,
    processingStatus,
    setProcessingStatus,
    results,
    setResults,
    currentStep,
    setCurrentStep,
    resetForm,
  } = useFormData();

  const fetchHeaders = async () => {
    setIsLoading(true);
    try {
      const headers = await fetchMockColumnHeaders({
        spreadsheet_url: formData.googleSheetUrl,
        worksheet_name: formData.sheetName,
      });
      console.log("get-headers", headers);
      const validHeader = headers?.headers.filter((item) => item?.length > 2);
      setColumnHeaders(validHeader || []);
      setCurrentStep(2);
    } catch {
      setProcessingStatus("Error: Failed to fetch column headers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessSheet = async () => {
    setIsLoading(true);
    setProcessingStatus("Processing rows...");
    const sheetPayload = {
      spreadsheet_url: formData.googleSheetUrl,
      worksheet_name: formData.sheetName,
      input_column: formData.inputColumns.join(", "),
      output_columns: formData.outputColumns,
      prompt_template: formData.llmPrompt,
    };
    try {
      const result = await processSheetAPI(sheetPayload);
      setResults(result);
      setProcessingStatus("Processing completed successfully!");
      setCurrentStep(3);
    } catch (e) {
      setProcessingStatus("Error: Failed to process sheet");
    } finally {
      setIsLoading(false);
    }
  };

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
            {[1, 2, 3].map((step, index) => (
              <React.Fragment key={step}>
                <StepIndicator
                  step={step}
                  isActive={currentStep === step}
                  isCompleted={currentStep > step}
                />
                {step < 3 && (
                  <div
                    className={`h-1 w-16 ${
                      currentStep > step ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Views */}
        {currentStep === 1 && (
          <SetupStep
            formData={formData}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
            fetchHeaders={fetchHeaders}
          />
        )}
        {currentStep === 2 && (
          <ConfigureStep
            formData={formData}
            columnHeaders={columnHeaders}
            handleColumnSelection={handleColumnSelection}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
            setCurrentStep={setCurrentStep}
            processSheet={handleProcessSheet}
          />
        )}
        {currentStep === 3 && (
          <ResultsStep
            formData={formData}
            results={results}
            resetForm={resetForm}
          />
        )}

        {/* Status Message */}
        {processingStatus && <StatusMessage status={processingStatus} />}
      </div>
    </div>
  );
};

export default GoogleSheetLLMFrontend;
