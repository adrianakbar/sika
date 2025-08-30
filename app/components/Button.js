const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium',
  isLoading = false, 
  disabled = false,
  className = '',
  icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/30 shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300/30",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/30",
    ghost: "text-primary hover:bg-primary/10 focus:ring-primary/30"
  };
  
  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-4 text-lg",
    large: "px-8 py-5 text-xl"
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center">
          {/* Modern Loading Spinner */}
          <div className="flex space-x-1 mr-3">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.1s]"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></div>
          </div>
          <span className="animate-pulse">Processing...</span>
        </div>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
