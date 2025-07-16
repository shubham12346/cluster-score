import { FileText, Globe } from "lucide-react";

const SetupStep = ({
  formData,
  handleInputChange,
  isLoading,
  fetchHeaders,
}) => (
  <div className="bg-white w-[50%] min-h-[500px] rounded-lg shadow-lg p-8 space-y-6 border-2 ">
    <div className="flex items-center mb-6">
      <FileText className="mr-3 text-blue-500" size={24} />
      <h2 className="text-2xl font-semibold">Sheet & Website Setup</h2>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Google Sheet URL
        </label>
        <input
          type="url"
          value={formData.googleSheetUrl}
          onChange={(e) => handleInputChange("googleSheetUrl", e.target.value)}
          placeholder="https://docs.google.com/spreadsheets/d/..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sheet Name
        </label>
        <input
          type="text"
          value={formData.sheetName}
          onChange={(e) => handleInputChange("sheetName", e.target.value)}
          placeholder="Sheet1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Globe className="inline mr-1" size={16} />
        Website URL (Optional)
      </label>
      <input
        type="url"
        value={formData.websiteUrl}
        onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
        placeholder="https://company.com"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
    </div>

    <button
      onClick={() => {
        fetchHeaders();
      }}
      disabled={!formData.googleSheetUrl || !formData.sheetName || isLoading}
      className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400"
    >
      {isLoading ? "Fetching Headers..." : "Fetch Column Headers"}
    </button>
  </div>
);

export default SetupStep;
