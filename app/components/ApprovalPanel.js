import { useState, useEffect } from 'react';
import Button from './Button';
import NotificationToast from './NotificationToast';

export default function ApprovalPanel({ permit, user, onApprove, onReject, onRefresh, hideNotification = false }) {
  const [comments, setComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const canApprove = () => {
    if (!user || !permit) return false;

    // AA dapat approve permit dengan status PENDING_AA_APPROVAL
    if (user.role === 'AA' && permit.status === 'PENDING_AA_APPROVAL') {
      return true;
    }

    // SC dapat approve permit dengan status PENDING_SC_APPROVAL
    if (user.role === 'SC' && permit.status === 'PENDING_SC_APPROVAL') {
      return true;
    }

    // CC dapat approve permit dengan status PENDING_SC_APPROVAL (backward compatibility)
    if (user.role === 'CC' && (permit.status === 'PENDING_SC_APPROVAL' || permit.status === 'AA_APPROVED')) {
      return true;
    }

    return false;
  };

  const canReject = () => {
    if (!user || !permit) return false;

    // AA dapat reject permit yang sedang dalam review mereka
    if (user.role === 'AA' && permit.status === 'PENDING_AA_APPROVAL') {
      return true;
    }

    // SC dapat reject permit yang sedang dalam review mereka
    if (user.role === 'SC' && permit.status === 'PENDING_SC_APPROVAL') {
      return true;
    }

    // CC dapat reject permit yang sedang dalam review mereka
    if (user.role === 'CC' && (permit.status === 'PENDING_SC_APPROVAL' || permit.status === 'AA_APPROVED')) {
      return true;
    }

    return false;
  };

  const handleApprove = async () => {
    if (!canApprove()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/permit-planning/${permit.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          role: user.role,
          comments: comments.trim() || null
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (!hideNotification) {
          setNotification({
            show: true,
            message: `Permit approved successfully by ${user.role}`,
            type: 'success'
          });
        }
        setComments('');
        if (onApprove) onApprove(result.data);
        if (onRefresh) onRefresh();
      } else {
        if (!hideNotification) {
          setNotification({
            show: true,
            message: `Failed to approve permit: ${result.message}`,
            type: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error approving permit:', error);
      if (!hideNotification) {
        setNotification({
          show: true,
          message: 'Failed to approve permit',
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!canReject() || !rejectionReason.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/permit-planning/${permit.id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          role: user.role,
          rejectionReason: rejectionReason.trim()
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (!hideNotification) {
          setNotification({
            show: true,
            message: `Permit rejected by ${user.role}`,
            type: 'success'
          });
        }
        setRejectionReason('');
        setShowRejectModal(false);
        if (onReject) onReject(result.data);
        if (onRefresh) onRefresh();
      } else {
        if (!hideNotification) {
          setNotification({
            show: true,
            message: `Failed to reject permit: ${result.message}`,
            type: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error rejecting permit:', error);
      if (!hideNotification) {
        setNotification({
          show: true,
          message: 'Failed to reject permit',
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'DRAFT': { color: 'bg-gray-500', text: 'Draft' },
      'PENDING_AA_APPROVAL': { color: 'bg-yellow-500', text: 'Pending AA Approval' },
      'PENDING_SC_APPROVAL': { color: 'bg-blue-500', text: 'Pending SC Approval' },
      'AA_APPROVED': { color: 'bg-blue-500', text: 'AA Approved' },
      'FULLY_APPROVED': { color: 'bg-green-500', text: 'Fully Approved' },
      'ACTIVE': { color: 'bg-green-600', text: 'Active' },
      'REJECTED_BY_AA': { color: 'bg-red-500', text: 'Rejected by AA' },
      'REJECTED_BY_SC': { color: 'bg-red-600', text: 'Rejected by SC' },
      'COMPLETED': { color: 'bg-gray-600', text: 'Completed' },
      'CANCELLED': { color: 'bg-gray-400', text: 'Cancelled' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-500', text: status };
    return (
      <span className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getRoleDescription = (role) => {
    const roles = {
      'PTWC': 'Permit to Work Controller',
      'AA': 'Area Authority',
      'SC': 'Site Controller',
      'CC': 'Company Controller',
      'ADMIN': 'Administrator'
    };
    return roles[role] || role;
  };

  if (!permit) {
    return <div className="text-gray-500">No permit selected</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Permit #{permit.permitNumber}
        </h3>
        <div className="flex items-center space-x-2 mb-2">
          {getStatusBadge(permit.status)}
          <span className="text-sm text-gray-600">
            Risk Level: <span className={`font-semibold ${
              permit.riskLevel === 'CRITICAL' ? 'text-red-600' :
              permit.riskLevel === 'HIGH' ? 'text-orange-600' :
              permit.riskLevel === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {permit.riskLevel}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Work Details</h4>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Description:</strong> {permit.workDescription}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Location:</strong> {permit.workLocation}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Zone:</strong> {permit.zone}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Work Type:</strong> {permit.workType?.replace('_', ' ')}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Personnel</h4>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Requested by:</strong> {permit.user?.name} ({getRoleDescription(permit.user?.role)})
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Performing Authority:</strong> {permit.performingAuthority}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Company:</strong> {permit.company}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Area Authority:</strong> {permit.areaAuthority}
          </p>
        </div>
      </div>

      {/* Approval History */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-2">Approval History</h4>
        <div className="space-y-2">
          {permit.aaApprover && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>
                <strong>AA Approved</strong> by {permit.aaApprover.name} 
                {permit.aaApprovedAt && ` on ${new Date(permit.aaApprovedAt).toLocaleDateString()}`}
              </span>
              {permit.aaComments && (
                <span className="text-gray-600 italic">- {permit.aaComments}</span>
              )}
            </div>
          )}
          
          {permit.scApprover && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>
                <strong>SC Approved</strong> by {permit.scApprover.name}
                {permit.scApprovedAt && ` on ${new Date(permit.scApprovedAt).toLocaleDateString()}`}
              </span>
              {permit.scComments && (
                <span className="text-gray-600 italic">- {permit.scComments}</span>
              )}
            </div>
          )}

          {permit.rejector && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>
                <strong>Rejected</strong> by {permit.rejector.name}
                {permit.rejectedAt && ` on ${new Date(permit.rejectedAt).toLocaleDateString()}`}
              </span>
              {permit.rejectionReason && (
                <span className="text-red-600 italic">- {permit.rejectionReason}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {(canApprove() || canReject()) && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">
            Action Required ({getRoleDescription(user.role)})
          </h4>

          {canApprove() && (
            <div className="mb-4">
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                Comments (optional)
              </label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder={`Add approval comments as ${user.role}...`}
              />
            </div>
          )}

          <div className="flex space-x-3">
            {canApprove() && (
              <Button
                onClick={handleApprove}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Approving...' : `Approve as ${user.role}`}
              </Button>
            )}

            {canReject() && (
              <Button
                onClick={() => setShowRejectModal(true)}
                disabled={loading}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Reject
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reject Permit
            </h3>
            <div className="mb-4">
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="4"
                placeholder="Please provide a detailed reason for rejection..."
                required
              />
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast - Only show if not hidden by parent */}
      {!hideNotification && (
        <NotificationToast
          notification={notification.show ? notification : null}
          onClose={() => setNotification({ show: false, message: "", type: "" })}
        />
      )}
    </div>
  );
}
