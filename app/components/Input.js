import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  type = 'text', 
  placeholder, 
  error, 
  className = '', 
  icon,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-5 py-4 border-2 rounded-xl outline-none transition-all duration-200 text-lg
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
            ${icon ? 'pr-14' : ''}
            ${className}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
