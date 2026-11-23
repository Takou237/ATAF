type ApiErrorNoticeProps = {
  message: string;
  onRetry?: () => void;
  className?: string;
};

export default function ApiErrorNotice({ message, onRetry, className = '' }: ApiErrorNoticeProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <span>{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 self-start rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 sm:self-auto"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
