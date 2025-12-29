import clsx from "clsx";

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  type = "button",
  className,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        // base
        "inline-flex items-center justify-center font-medium select-none",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",

        // size
        size === "sm" && "px-3 py-1.5 text-sm rounded-lg",
        size === "md" && "px-4 py-2 text-sm rounded-xl",
        size === "lg" && "px-6 py-3 text-base rounded-2xl",

        // variant
        variant === "primary" &&
          "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md",
        variant === "primary" &&
          "hover:from-blue-400 hover:to-blue-500 hover:-translate-y-[1px]",
        variant === "primary" && "active:translate-y-0",

        variant === "secondary" &&
          "bg-slate-800 text-slate-200 border border-slate-700",
        variant === "secondary" &&
          "hover:bg-slate-700",

        variant === "ghost" &&
          "bg-transparent text-slate-300 hover:bg-slate-800",

        // disabled
        disabled &&
          "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none",

        className
      )}
    >
      {children}
    </button>
  );
}
