'use client';

export default function LoadingSpinner({ size = "md", color = "primary", text = "", variant = "circle" }) {
  const getSizeClasses = () => {
    switch (size) {
      case "sm": return "h-6 w-6";
      case "md": return "h-12 w-12";
      case "lg": return "h-16 w-16";
      case "xl": return "h-20 w-20";
      default: return "h-12 w-12";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "sm": return "text-xs";
      case "md": return "text-sm";
      case "lg": return "text-base";
      case "xl": return "text-lg";
      default: return "text-sm";
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case "primary": return {
        border: "border-primary/20 border-t-primary",
        bg: "bg-primary",
        text: "text-primary"
      };
      case "secondary": return {
        border: "border-secondary/20 border-t-secondary", 
        bg: "bg-secondary",
        text: "text-secondary"
      };
      case "white": return {
        border: "border-white/20 border-t-white",
        bg: "bg-white", 
        text: "text-white"
      };
      default: return {
        border: "border-primary/20 border-t-primary",
        bg: "bg-primary",
        text: "text-primary"
      };
    }
  };

  const colorClasses = getColorClasses();

  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex space-x-2">
            <div className={`w-3 h-3 ${colorClasses.bg} rounded-full animate-bounce-smooth`}></div>
            <div className={`w-3 h-3 ${colorClasses.bg} rounded-full animate-bounce-smooth [animation-delay:0.1s]`}></div>
            <div className={`w-3 h-3 ${colorClasses.bg} rounded-full animate-bounce-smooth [animation-delay:0.2s]`}></div>
          </div>
        );
      
      case "pulse":
        return (
          <div className="relative">
            <div className={`${getSizeClasses()} ${colorClasses.bg} rounded-full animate-pulse-glow opacity-75`}></div>
            <div className={`${getSizeClasses()} ${colorClasses.bg} rounded-full absolute top-0 left-0 opacity-50 animate-ping`}></div>
          </div>
        );
      
      case "gradient":
        return (
          <div className={`${getSizeClasses()} border-4 border-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient bg-clip-border rounded-full animate-spin-slow`}>
            <div className="bg-white rounded-full w-full h-full"></div>
          </div>
        );
      
      case "modern":
        return (
          <div className="relative">
            <div className={`${getSizeClasses()} border-4 border-gray-200 rounded-full`}>
              <div className={`absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin-slow`}></div>
              <div className={`absolute inset-2 ${colorClasses.bg} rounded-full opacity-20 animate-pulse-glow`}></div>
            </div>
          </div>
        );
      
      case "orbit":
        return (
          <div className={`relative ${getSizeClasses()}`}>
            <div className={`absolute inset-0 border-2 ${colorClasses.border} rounded-full animate-spin-slow`}></div>
            <div className={`absolute top-0 left-1/2 w-2 h-2 ${colorClasses.bg} rounded-full transform -translate-x-1/2 -translate-y-1 animate-orbit`}></div>
          </div>
        );
      
      default: // circle
        return (
          <div className="relative">
            <div className={`${getSizeClasses()} border-4 border-solid rounded-full ${colorClasses.border} animate-spin-slow`}></div>
            <div className={`absolute inset-2 ${colorClasses.bg} rounded-full opacity-20 animate-pulse-glow`}></div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      {/* Loading Animation */}
      <div className="relative flex items-center justify-center">
        {renderSpinner()}
      </div>
      
      {/* Loading Text with Typewriter Effect */}
      {text && (
        <div className="text-center max-w-sm">
          <p className={`text-gray-600 font-medium ${getTextSize()} animate-pulse`}>
            {text}
          </p>
          <div className="mt-3 flex justify-center space-x-1">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce-smooth"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce-smooth [animation-delay:0.1s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce-smooth [animation-delay:0.2s]"></div>
          </div>
        </div>
      )}
    </div>
  );
}
