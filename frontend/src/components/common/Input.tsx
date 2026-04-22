import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

const Input = ({ label, error, icon, className = "", id, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-label-md font-label-md text-on-surface"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`w-full bg-slate-50 border border-slate-200 rounded-lg text-body-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all ${icon ? "pl-10" : ""} ${error ? "border-error ring-1 ring-error" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-label-sm text-error">{error}</span>
      )}
    </div>
  );
};

export default Input;
