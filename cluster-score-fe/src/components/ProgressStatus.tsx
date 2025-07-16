import { ProcessingStatusType } from "../hooks/useFormData";
import { useProgressPolling } from "../hooks/useProgressPolling";

const ProgressStatus = ({ processingStatus, handleProcessSheetStatus }) => {
  const { progress, loading } = useProgressPolling({
    processingStatus,
    onComplete: handleProcessSheetStatus,
  });
  console.log("Progress data in ProgressStatus:", progress);

  if (
    processingStatus === ProcessingStatusType.IDLE &&
    Object.keys(progress).length === 0
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <div className="text-3xl mb-2 text-blue-600">📝</div>
        <div className="text-lg text-gray-500 font-semibold mb-1">
          No processing started
        </div>
        <div className="text-base text-gray-400">
          Pick columns from your sheet to process and get their relevance.
        </div>
      </div>
    );
  }

  if (!progress || Object.keys(progress).length === 0)
    return (
      <div className="text-center text-gray-400 py-4">No progress yet.</div>
    );

  return (
    <div className="mx-4">
      <h3 className="font-bold mb-6 text-4xl text-center text-gray-800">
        {processingStatus === ProcessingStatusType.PROCESSING
          ? "Processing Progress"
          : "Processing Completed"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 transition-all duration-500 ease-in-out  max-h-screen overflow-y-scroll">
        {Object.entries(progress)
          .sort(([, a], [, b]) => {
            const rowA =
              typeof a === "object" && a && "row" in a ? Number(a.row) : 0;
            const rowB =
              typeof b === "object" && b && "row" in b ? Number(b.row) : 0;
            return rowB - rowA;
          })
          .map(([row, data]) => {
            const d = data as {
              row: number;
              keyword: string;
              score: string;
              reason: string;
              status: string;
            };
            return (
              <div
                key={row}
                className="bg-white shadow-md rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-2xl text-gray-500 font-bold">
                    Row {d.row}
                  </span>
                  <span
                    className={`px-4 py-2 rounded text-2xl font-bold ${
                      d.status === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <div className="mb-5">
                  <div className="font-bold text-blue-700 text-2xl mb-2">
                    {d.keyword}
                  </div>
                  <div className="text-xl text-gray-700 mb-2">
                    <span className="font-semibold text-gray-600">Score: </span>
                    {d.score ? (
                      d.score
                    ) : (
                      <span className="italic text-gray-400">No score</span>
                    )}
                  </div>
                </div>
                <details className="text-lg text-gray-600 mt-3 whitespace-pre-line">
                  <summary className="cursor-pointer font-bold text-blue-500">
                    Reason
                  </summary>
                  <div className="mt-2">{d.reason}</div>
                </details>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ProgressStatus;
