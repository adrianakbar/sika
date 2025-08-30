import { useState } from 'react';
import Button from './Button';
import NotificationToast from './NotificationToast';
import ConfirmModal from './ConfirmModal';

export default function PermitDeleteButton({ permit, user, onDelete, hideNotification = false }) {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const canDelete = () => {
    if (!user || !permit) return false;
    
    // Hanya PTWC yang bisa delete permit miliknya sendiri atau admin
    return (user.role === 'PTWC' && permit.userId === user.id) || user.role === 'ADMIN';
  };

  const handleDelete = async () => {
    if (!canDelete()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/permit-planning/${permit.id}/delete?userId=${user.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        if (!hideNotification) {
          setNotification({
            show: true,
            message: 'Permit deleted successfully!',
            type: 'success'
          });
        }
        setShowConfirmModal(false);
        if (onDelete) onDelete(result.data);
      } else {
        if (!hideNotification) {
          setNotification({
            show: true,
            message: `Failed to delete permit: ${result.message}`,
            type: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error deleting permit:', error);
      if (!hideNotification) {
        setNotification({
          show: true,
          message: 'Failed to delete permit',
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!canDelete()) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setShowConfirmModal(true)}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        {loading ? 'Deleting...' : 'Delete Permit'}
      </Button>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDelete}
        title="Delete Permit"
        message={`Are you sure you want to delete permit #${permit.permitNumber}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Notification Toast - Only show if not hidden by parent */}
      {!hideNotification && (
        <NotificationToast
          notification={notification.show ? notification : null}
          onClose={() => setNotification({ show: false, message: "", type: "" })}
        />
      )}
    </>
  );
}
