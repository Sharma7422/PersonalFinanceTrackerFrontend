import { useToast } from "./ui/use-toast";

export default function ToastContainer() {
  const { toasts } = useToast();
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded px-4 py-2 shadow-lg
            ${t.variant === "destructive"
              ? "bg-red-600 text-white border-red-500"
              : "bg-white text-black dark:bg-gray-800 dark:text-gray-100 border-green-500"}
            border-l-4
          `}
        >
          <div className="font-bold">{t.title}</div>
          {/* {t.description && <div className="text-sm">{t.description}</div>} */}
        </div>
      ))}
    </div>
  );
}