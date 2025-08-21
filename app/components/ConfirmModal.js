'use client';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info', // 'info', 'warning', 'danger'
  children 
}) {
  if (!isOpen) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'warning':
        return {
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          animation: 'animate-pulse'
        };
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmButton: 'bg-red-600 hover:bg-red-700 hover:shadow-lg',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ),
          animation: 'animate-pulse'
        };
      default: // info
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmButton: 'bg-blue-600 hover:bg-blue-700',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          ),
          animation: 'animate-bounce'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-lg max-w-md w-full transform transition-all duration-300 ease-out animate-scaleIn">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className={`w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center mr-3 ${config.animation}`}>
              <div className={config.iconColor}>
                {config.icon}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          
          {message && (
            <p className="text-gray-600 mb-6">
              {message}
            </p>
          )}
          
          {children && (
            <div className="mb-6">
              {children}
            </div>
          )}
          
          {type === 'danger' && (
            <p className="text-red-600 text-sm mb-6 animate-pulse">
              This action cannot be undone.
            </p>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:scale-105"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white ${config.confirmButton} rounded-lg transition-all duration-200 hover:scale-105`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
