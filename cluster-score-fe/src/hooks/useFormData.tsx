// src/hooks/useFormData.js
import { useState } from "react";

const initialForm = {
  googleSheetUrl: "",
  sheetName: "",
  websiteUrl: "",
  inputColumns: [],
  outputColumns: [],
  llmPrompt: "Score the relevance for the company based on the description.",
};

export const ProcessingStatusType = {
  IDLE: "idle",
  PROCESSING: "processing",
  ERROR: "error",
} as const;
export const useFormData = () => {
  const [formData, setFormData] = useState(initialForm);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>(
    ProcessingStatusType.IDLE
  );
  const [results, setResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleColumnSelection = (column, type) => {
    const key = type + "Columns";
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(column)
        ? prev[key].filter((c) => c !== column)
        : [...prev[key], column],
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setColumnHeaders([]);
    setResults([]);
    setProcessingStatus(ProcessingStatusType.IDLE);
    setCurrentStep(1);
  };

  return {
    formData,
    setFormData,
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
  };
};
