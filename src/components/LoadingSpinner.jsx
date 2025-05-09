export default function LoadingSpinner() {
  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Estimating...</span>
      </div>
    </>
  );
}
