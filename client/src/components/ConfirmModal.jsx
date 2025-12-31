const ConfirmModal = ({
  open,
  title = "Confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-[#0f172a] w-[420px] rounded-2xl p-6 border border-white/10">
        <h3 className="text-white font-semibold mb-3">{title}</h3>
        <p className="text-sm text-gray-300 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white text-sm ${
              danger ? "bg-red-600 hover:bg-red-500" : "bg-blue-600"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
