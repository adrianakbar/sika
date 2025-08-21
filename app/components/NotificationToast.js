'use client';
import { useEffect } from 'react';

export default function NotificationToast({ notification, onClose }) {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideInRight">
      <div className={`bg-white border-l-4 rounded-lg shadow-xl p-4 max-w-sm w-full transform transition-all duration-500 ease-out hover:scale-105 ${
        notification.type === 'success' 
          ? 'border-green-400 shadow-green-100' 
          : notification.type === 'error' 
          ? 'border-red-400 shadow-red-100' 
          : 'border-blue-400 shadow-blue-100'
      }`}>
        <div className="flex items-center">
          <div className={`flex-shrink-0 animate-bounce ${
            notification.type === 'success' 
              ? 'text-green-400' 
              : notification.type === 'error' 
              ? 'text-red-400' 
              : 'text-blue-400'
          }`}>
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : notification.type === 'error' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <p className={`text-sm font-medium ${
              notification.type === 'success' 
                ? 'text-green-800' 
                : notification.type === 'error' 
                ? 'text-red-800' 
                : 'text-blue-800'
            }`}>
              {notification.message}
            </p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition-all duration-200 hover:scale-110"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Progress bar for auto-hide */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
          <div className={`h-1 rounded-full animate-shrink ${
            notification.type === 'success' 
              ? 'bg-green-400' 
              : notification.type === 'error' 
              ? 'bg-red-400' 
              : 'bg-blue-400'
          }`}></div>
        </div>
      </div>
    </div>
  );
}
