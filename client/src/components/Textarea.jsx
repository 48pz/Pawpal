import { forwardRef } from "react";

const Textarea = forwardRef(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm text-gray-400">{label}</label>
        )}

        <textarea
          ref={ref}
          {...props}
          className={`
            w-full
            rounded-xl
            bg-[#020617]
            px-4 py-3
            text-sm text-white
            placeholder-gray-500
            border
            resize-none
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500/40
            transition
            ${error ? "border-red-400/50" : "border-white/10"}
            ${className}
          `}
        />

        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
