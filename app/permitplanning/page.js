'use client';
import { useState, useEffect } from 'react';
import PermitPlanningForm from '../components/PermitPlanningForm';
import SitePlotVisualization from '../components/SitePlotVisualization';
import Button from '../components/Button';
import NotificationToast from '../components/NotificationToast';
import ConfirmModal from '../components/ConfirmModal';

export default function PermitPlanning() {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPermit, setEditingPermit] = useState(null);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [filterZone, setFilterZone] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // New states for modals and notifications
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [permitToDelete, setPermitToDelete] = useState(null);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchPermits();
  }, []);

  const showNotification = (message, type = 'success') => {
    setIsAnimating(true);
    setTimeout(() => {
      setNotification({ message, type });
      setIsAnimating(false);
    }, 100);
  };

  const fetchPermits = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`/api/permit-planning?userId=${userData.id}`);
      const result = await response.json();
      
      if (result.success) {
        setPermits(result.data);
      } else {
        console.error('Failed to fetch permits:', result.message);
      }
    } catch (error) {
      console.error('Error fetching permits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (newPermit) => {
    if (editingPermit) {
      setPermits(prev => prev.map(p => p.id === newPermit.id ? newPermit : p));
      setEditingPermit(null);
      showNotification('Permit updated successfully!', 'success');
    } else {
      setPermits(prev => [newPermit, ...prev]);
      showNotification('Permit created successfully!', 'success');
    }
    setShowForm(false);
    setShowCreateConfirm(false);
    fetchPermits(); // Refresh data
  };

  const handleCreatePermit = () => {
    setShowCreateConfirm(true);
  };

  const confirmCreatePermit = () => {
    setShowCreateConfirm(false);
    setShowForm(true);
  };

  const handleDeleteClick = (permit) => {
    setPermitToDelete(permit);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!permitToDelete) return;
    
    try {
      const response = await fetch(`/api/permit-planning/${permitToDelete.id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        setPermits(prev => prev.filter(p => p.id !== permitToDelete.id));
        showNotification('Permit deleted successfully!', 'success');
      } else {
        showNotification('Failed to delete permit', 'error');
      }
    } catch (error) {
      console.error('Error deleting permit:', error);
      showNotification('Failed to delete permit', 'error');
    } finally {
      setShowDeleteConfirm(false);
      setPermitToDelete(null);
    }
  };

  const handleEdit = (permit) => {
    setEditingPermit(permit);
    setShowForm(true);
  };

  const handleVisualizationPointClick = (point) => {
    if (point.type === 'permit') {
      setSelectedPermit(point);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      EXPIRED: 'bg-gray-100 text-gray-800',
      ACTIVE: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getRiskLevelBadge = (riskLevel) => {
    const colors = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[riskLevel] || 'bg-gray-100 text-gray-800'}`}>
        {riskLevel}
      </span>
    );
  };

  const filteredPermits = permits.filter(permit => {
    if (filterZone && permit.zone !== filterZone) return false;
    if (filterStatus && permit.status !== filterStatus) return false;
    return true;
  });


  return (
    <div className="bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-quaternary">Work Permit Planning</h1>
          <p className="text-foreground mt-1">Manage work permits and visualize locations on site plot</p>
        </div>
        <Button onClick={handleCreatePermit}>
            Create New Permit
          </Button>
        </div>

      

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-quaternary mb-1">Filter by Zone</label>
              <select
                value={filterZone}
                onChange={(e) => setFilterZone(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
              <option value="">All Zones</option>
              <option value="PRC">PRC - Processing</option>
              <option value="UTL">UTL - Utilities</option>
              <option value="BLD">BLD - Building</option>
              <option value="GMS">GMS - Gas Metering</option>
              <option value="CCR">CCR - Control Room</option>
              <option value="OY">OY - Open Yard</option>
              <option value="NBL">NBL - Laboratory</option>
              <option value="WS">WS - Workshop</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-quaternary mb-1">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          {(filterZone || filterStatus) && (
            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setFilterZone('');
                  setFilterStatus('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

        {/* Permits List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-quaternary">Work Permits</h2>
            <div className="text-sm text-foreground">
              Showing {filteredPermits.length} of {permits.length} permits
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-foreground">Loading permits...</p>
            </div>
          ) : filteredPermits.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-foreground">
                {permits.length === 0 ? 'No permits found. Create your first permit!' : 'No permits match your current filters.'}
              </p>
            </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permit Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPermits.map((permit) => (
                    <tr key={permit.id} className={selectedPermit?.id === permit.id ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {permit.permitNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {permit.workType?.replace('_', ' ')} - {permit.workDescription}
                          </div>
                          <div className="mt-1">
                            {getRiskLevelBadge(permit.riskLevel)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{permit.zone}</div>
                        {permit.coordinates && (
                          <div className="text-sm text-gray-500">
                            Coords: {permit.coordinates}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Start: {new Date(permit.startDate).toLocaleDateString()}</div>
                        <div>End: {new Date(permit.endDate).toLocaleDateString()}</div>
                       
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(permit.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {/* View Button */}
                          <button
                            onClick={() => setSelectedPermit(permit)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors duration-200"
                            title="View Details"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEdit(permit)}
                            className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-lg transition-colors duration-200"
                            title="Edit Permit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteClick(permit)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-200"
                            title="Delete Permit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Selected Permit Details Modal */}
      {selectedPermit && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-quaternary">
                  Permit Details: {selectedPermit.permitNumber}
                </h3>
                <button
                  onClick={() => setSelectedPermit(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Work Type:</strong> {selectedPermit.workType?.replace('_', ' ')}
                  </div>
                  <div>
                    <strong>Risk Level:</strong> {getRiskLevelBadge(selectedPermit.riskLevel)}
                  </div>
                  <div>
                    <strong>Zone:</strong> {selectedPermit.zone}
                  </div>
                  <div>
                    <strong>Status:</strong> {getStatusBadge(selectedPermit.status)}
                  </div>
                </div>
                
                <div>
                  <strong>Work Description:</strong>
                  <p className="mt-1 text-gray-700">{selectedPermit.workDescription}</p>
                </div>
                
                <div>
                  <strong>Contractor:</strong> {selectedPermit.contractor}
                </div>
                
                <div>
                  <strong>Supervisor:</strong> {selectedPermit.supervisorName} ({selectedPermit.supervisorContact})
                </div>
                
                {selectedPermit.equipmentNeeded && (
                  <div>
                    <strong>Equipment Needed:</strong>
                    <p className="mt-1 text-gray-700">{selectedPermit.equipmentNeeded}</p>
                  </div>
                )}
                
                {selectedPermit.safetyMeasures && (
                  <div>
                    <strong>Safety Measures:</strong>
                    <p className="mt-1 text-gray-700">{selectedPermit.safetyMeasures}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Start Date:</strong><br/>
                    {new Date(selectedPermit.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>End Date:</strong><br/>
                    {new Date(selectedPermit.endDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Valid Until:</strong><br/>
                    {new Date(selectedPermit.validUntil).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-2">
                <Button onClick={() => handleEdit(selectedPermit)}>
                  Edit Permit
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setSelectedPermit(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-quaternary">
                  {editingPermit ? 'Edit Work Permit' : 'Create New Work Permit'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingPermit(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <PermitPlanningForm
                editData={editingPermit}
                onSubmitSuccess={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingPermit(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Create Permit Confirmation Modal */}
      <ConfirmModal
        isOpen={showCreateConfirm}
        onClose={() => setShowCreateConfirm(false)}
        onConfirm={confirmCreatePermit}
        title="Create New Permit"
        message="Are you sure you want to create a new work permit? This will open the permit form."
        confirmText="Continue"
        cancelText="Cancel"
        type="info"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm && !!permitToDelete}
        onClose={() => {
          setShowDeleteConfirm(false);
          setPermitToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Permit"
        message="Are you sure you want to delete this permit?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      >
        {permitToDelete && (
          <div className="bg-gray-50 p-3 rounded-lg transform transition-all duration-200 hover:bg-gray-100">
            <p className="text-sm font-medium text-gray-900">{permitToDelete.permitNumber}</p>
            <p className="text-sm text-gray-600">{permitToDelete.workDescription}</p>
          </div>
        )}
      </ConfirmModal>

      {/* Notification Toast */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}
