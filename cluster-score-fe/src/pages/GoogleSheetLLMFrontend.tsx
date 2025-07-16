import React from "react";
import StepIndicator from "../components/StepIndicator";
import SetupStep from "../components/SetupStep";
import ConfigureStep from "../components/ConfigureStep";
import ResultsStep from "../components/ResultStep";
import StatusMessage from "../components/StatusMessage";

import { ProcessingStatusType, useFormData } from "../hooks/useFormData";
import { fetchMockColumnHeaders, processSheetAPI } from "../services/api";
import ProgressStatus from "../components/ProgressStatus";
import ConfigurationSummary from "../components/ConfigurationSummary";

const GoogleSheetLLMFrontend = () => {
  const [editMode, setEditMode] = React.useState(false);
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
      setResults([]);
      setCurrentStep(2);
    } catch {
      setProcessingStatus("Error: Failed to fetch column headers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessSheet = async () => {
    setIsLoading(true);
    setProcessingStatus(ProcessingStatusType.PROCESSING);
    const sheetPayload = {
      spreadsheet_url: formData.googleSheetUrl,
      worksheet_name: formData.sheetName,
      input_column: formData.inputColumns.join(", "),
      output_columns: formData.outputColumns,
      prompt_template: formData.llmPrompt,
    };
    try {
      const result = await processSheetAPI(sheetPayload);
      setResults([]);
      setProcessingStatus(ProcessingStatusType.PROCESSING);
    } catch (e) {
      setProcessingStatus(ProcessingStatusType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessSheetStatus = () => {
    setProcessingStatus(ProcessingStatusType.IDLE);
  };

  return (
    <div className="  min-h-screen w-[90vw] bg-gradient-to-br from-blue-50 to-indigo-100 p-6 mx-24 my-10">
      <div className=" ">
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
            {[1, 2].map((step, index) => (
              <React.Fragment key={step}>
                <StepIndicator
                  step={step}
                  isActive={currentStep === step}
                  isCompleted={currentStep > step}
                />
                {step < 2 && (
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
        {/* Status Message */}
        {processingStatus != ProcessingStatusType.IDLE && (
          <StatusMessage status={processingStatus} />
        )}
        {/* Step Views */}
        {currentStep === 1 && (
          <div className="flex justify-center  ">
            <SetupStep
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
              fetchHeaders={fetchHeaders}
            />
          </div>
        )}
        {currentStep === 2 && (
          <div className="flex  justify-center">
            <div className="w-2/5 pt-10 mt-10">
              {editMode ? (
                <ConfigureStep
                  formData={formData}
                  columnHeaders={columnHeaders}
                  handleColumnSelection={handleColumnSelection}
                  handleInputChange={handleInputChange}
                  isLoading={
                    processingStatus === ProcessingStatusType.PROCESSING
                  }
                  setCurrentStep={setCurrentStep}
                  processSheet={handleProcessSheet}
                  isProcessing={
                    processingStatus === ProcessingStatusType.PROCESSING
                  }
                />
              ) : (
                <ConfigurationSummary
                  formData={formData}
                  isProcessing={
                    processingStatus === ProcessingStatusType.PROCESSING
                  }
                  onEditClick={() => setEditMode(true)}
                />
              )}
            </div>

            <div className="w-2/5 mt-3">
              <ProgressStatus
                processingStatus={processingStatus}
                handleProcessSheetStatus={handleProcessSheetStatus}
              />
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <ResultsStep
            formData={formData}
            results={results}
            resetForm={resetForm}
          />
        )}
      </div>
    </div>
  );
};

export default GoogleSheetLLMFrontend;
