import React from "react";
// packaging input componment alway needs forwardRef
const Input = React.forwardRef(
  ({ type = "text", placeholder, className = "", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        {...rest}
        className={`w-full h-12 px-4 mt-5
        bg-[#25292e]
        border-2 border-[#555555]
        rounded
        placeholder:text-[#555555]
        text-white
        focus:outline-none
        focus:border-[#00E5FF] ${className}`}
      />
    );
  }
);
export default Input;
