export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border 
      border-red-200 text-center">
      {message}
    </div>
  );
}