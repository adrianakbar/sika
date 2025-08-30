'use client';
import { useState, useEffect } from 'react';
import PermitPlanningForm from '../components/PermitPlanningForm';
import SitePlotVisualization from '../components/SitePlotVisualization';
import Button from '../components/Button';
import NotificationToast from '../components/NotificationToast';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import withAuth from '../components/withAuth';

function PermitPlanning() {
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
        showNotification(result.message || 'Failed to delete permit', 'error');
      }
    } catch (error) {
      console.error('Error deleting permit:', error);
      showNotification('Network error. Failed to delete permit', 'error');
    } finally {
      setShowDeleteConfirm(false);
      setPermitToDelete(null);
    }
  };

  const handleEdit = (permit) => {
    console.log('handleEdit called with permit:', permit);
    try {
      setEditingPermit(permit);
      setShowForm(true);
    } catch (error) {
      console.error('Error in handleEdit:', error);
      showNotification('Error opening edit form', 'error');
    }
  };

  const handleVisualizationPointClick = (point) => {
    if (point.type === 'permit') {
      setSelectedPermit(point);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      DRAFT: 'bg-gray-500 text-white',
      PENDING_AA_APPROVAL: 'bg-yellow-500 text-white',
      AA_APPROVED: 'bg-quaternary text-white',
      FULLY_APPROVED: 'bg-secondary text-white',
      ACTIVE: 'bg-secondary text-white',
      REJECTED_BY_AA: 'bg-primary text-white',
      REJECTED_BY_CC: 'bg-primary text-white',
      COMPLETED: 'bg-quaternary text-white',
      CANCELLED: 'bg-gray-400 text-white',
      EXPIRED: 'bg-gray-400 text-white',
      // Legacy status values for backward compatibility
      PENDING: 'bg-yellow-500 text-white',
      APPROVED: 'bg-secondary text-white',
      REJECTED: 'bg-primary text-white'
    };
    
    const statusLabels = {
      DRAFT: 'Draft',
      PENDING_AA_APPROVAL: 'Pending AA',
      AA_APPROVED: 'AA Approved',
      FULLY_APPROVED: 'Fully Approved',
      ACTIVE: 'Active',
      REJECTED_BY_AA: 'Rejected by AA',
      REJECTED_BY_CC: 'Rejected by CC',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
      EXPIRED: 'Expired',
      // Legacy status values
      PENDING: 'Pending',
      APPROVED: 'Approved',
      REJECTED: 'Rejected'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${colors[status] || 'bg-gray-500 text-white'}`}>
        {statusLabels[status] || status}
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
    if (filterStatus) {
      // Handle grouped status filtering for better UX
      if (filterStatus === 'APPROVED_ALL') {
        return ['AA_APPROVED', 'FULLY_APPROVED'].includes(permit.status);
      } else if (filterStatus === 'REJECTED_ALL') {
        return ['REJECTED_BY_AA', 'REJECTED_BY_CC'].includes(permit.status);
      } else {
        return permit.status === filterStatus;
      }
    }
    return true;
  });


  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-quaternary">Work Permit Planning</h1>
            <p className="text-gray-600 mt-2">Manage work permits and visualize locations on site plot</p>
          </div>
          <Button 
            onClick={handleCreatePermit}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Permit
          </Button>
        </div>
      </div>

      

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-wrap gap-6 items-end">
            <div className="min-w-48">
              <label className="block text-sm font-semibold text-quaternary mb-2">Filter by Zone</label>
              <select
                value={filterZone}
                onChange={(e) => setFilterZone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
              <option value="">All Zones</option>
              <option value="PRC">PRC - Processing</option>
              <option value="UTL">UTL - Utilities</option>
              <option value="BLD">BLD - Building</option>
              <option value="GMS">GMS - Gas Metering</option>
              <option value="CCR">CCR - Control Room</option>
              <option value="OY">OY - Open Yard</option>
              <option value="NBL">NBL - New Building</option>
              <option value="WS">WS - Workshop</option>
            </select>
          </div>
          <div className="min-w-64">
            <label className="block text-sm font-semibold text-quaternary mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_AA_APPROVAL">Pending AA Approval</option>
              <option value="AA_APPROVED">AA Approved</option>
              <option value="FULLY_APPROVED">Fully Approved</option>
              <option value="APPROVED_ALL">All Approved (AA + Fully)</option>
              <option value="ACTIVE">Active</option>
              <option value="REJECTED_BY_AA">Rejected by AA</option>
              <option value="REJECTED_BY_CC">Rejected by CC</option>
              <option value="REJECTED_ALL">All Rejected</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="EXPIRED">Expired</option>
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
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

        {/* Permits List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-quaternary flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Work Permits
            </h2>
            <div className="bg-tertiary px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-quaternary">
                Showing {filteredPermits.length} of {permits.length} permits
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <LoadingSpinner 
                size="xl" 
                variant="orbit" 
                color="secondary" 
                text="Loading permits data..." 
              />
            </div>
          ) : filteredPermits.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {permits.length === 0 ? 'No permits found' : 'No permits match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {permits.length === 0 ? 'Create your first permit to get started!' : 'Try adjusting your filter criteria.'}
              </p>
              {permits.length === 0 && (
                <Button onClick={handleCreatePermit} className="bg-gradient-to-r from-primary to-primary/80">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Permit
                </Button>
              )}
            </div>
        ) : (
          <div className="overflow-hidden">
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
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            {(() => {
                              const workTypeInfo = {
                                'COLD_WORK': { label: 'General Work', color: 'bg-blue-500' },
                                'COLD_WORK_BREAKING': { label: 'Breaking Containment', color: 'bg-black' },
                                'HOT_WORK_SPARK': { label: 'Critical Work', color: 'bg-yellow-500' },
                                'HOT_WORK_FLAME': { label: 'Hot Work', color: 'bg-red-500' }
                              };
                              const info = workTypeInfo[permit.workType] || { label: permit.workType, color: 'bg-gray-500' };
                              return (
                                <>
                                  <div className={`w-2 h-2 rounded-full ${info.color}`}></div>
                                  <span>{info.label}</span>
                                </>
                              );
                            })()}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {permit.workDescription}
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
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4">
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
                {/* Basic Information Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-quaternary mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Work Permit Type:</strong> 
                      <div className="mt-1 flex items-center gap-2">
                        {(() => {
                          const workTypeInfo = {
                            'COLD_WORK': { label: 'General Work', color: 'bg-blue-500' },
                            'COLD_WORK_BREAKING': { label: 'Breaking Containment', color: 'bg-black' },
                            'HOT_WORK_SPARK': { label: 'Critical Work', color: 'bg-yellow-500' },
                            'HOT_WORK_FLAME': { label: 'Hot Work', color: 'bg-red-500' }
                          };
                          const info = workTypeInfo[selectedPermit.workType] || { label: selectedPermit.workType, color: 'bg-gray-500' };
                          return (
                            <>
                              <div className={`w-3 h-3 rounded-full ${info.color}`}></div>
                              <span>{info.label}</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div>
                      <strong>Risk Level:</strong> {getRiskLevelBadge(selectedPermit.riskLevel)}
                    </div>
                    <div>
                      <strong>Zone:</strong> 
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                        {selectedPermit.zone}
                      </span>
                    </div>
                    <div>
                      <strong>Status:</strong> {getStatusBadge(selectedPermit.status)}
                    </div>
                    <div>
                      <strong>Work Location:</strong> 
                      <p className="text-gray-700 text-sm mt-1">{selectedPermit.workLocation}</p>
                    </div>
                    <div>
                      <strong>Coordinates:</strong> 
                      <p className="text-gray-700 text-sm mt-1">{selectedPermit.coordinates || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Work Description Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-quaternary mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Work Description
                  </h4>
                  <p className="text-gray-700">{selectedPermit.workDescription}</p>
                </div>
                
                {/* Schedule Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-quaternary mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Start Date & Time:</strong><br/>
                      <span className="text-green-600 font-medium">
                        {new Date(selectedPermit.startDate).toLocaleDateString('id-ID', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short', 
                          day: 'numeric'
                        })} at {new Date(selectedPermit.startDate).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div>
                      <strong>End Date & Time:</strong><br/>
                      <span className="text-red-600 font-medium">
                        {new Date(selectedPermit.endDate).toLocaleDateString('id-ID', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short', 
                          day: 'numeric'
                        })} at {new Date(selectedPermit.endDate).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <strong>Duration:</strong>
                      <span className="ml-2 text-gray-700">
                        {(() => {
                          const start = new Date(selectedPermit.startDate);
                          const end = new Date(selectedPermit.endDate);
                          const diffMs = end - start;
                          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                          const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                          
                          if (diffDays > 0) {
                            return `${diffDays} day(s) ${diffHours} hour(s)`;
                          } else {
                            return `${diffHours} hour(s)`;
                          }
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Personnel Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-quaternary mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Personnel & Responsibilities
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Performing Authority:</strong> 
                      <p className="text-gray-700 mt-1">{selectedPermit.performingAuthority || 'N/A'}</p>
                    </div>
                    <div>
                      <strong>Company:</strong> 
                      <p className="text-gray-700 mt-1">{selectedPermit.company || 'N/A'}</p>
                    </div>
                    <div>
                      <strong>Site Controller:</strong> 
                      <p className="text-gray-700 mt-1">{selectedPermit.siteControllerName || 'N/A'}</p>
                    </div>
                    <div>
                      <strong>Area Authority:</strong> 
                      <p className="text-gray-700 mt-1">{selectedPermit.areaAuthority || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Related Documents */}
                {selectedPermit.relatedDocuments && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-quaternary mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Related Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(() => {
                        try {
                          const docs = typeof selectedPermit.relatedDocuments === 'string' 
                            ? JSON.parse(selectedPermit.relatedDocuments) 
                            : selectedPermit.relatedDocuments;
                          const documentsList = Object.entries(docs).map(([key, doc]) => {
                            if (doc.checked) {
                              const labels = {
                                // New document types
                                jsa: 'Job Safety Analysis (JSA)',
                                ra: 'Risk Assessment (RA)',
                                csep: 'Confined Space Entry Permit (CSEP)',
                                icc: 'Isolation Confirmation Certificate (ICC)',
                                tkiTko: 'TKI / TKO',
                                other: 'Other',
                                // Legacy document types (for backward compatibility)
                                l2ra: 'Risk Assessment (RA)',
                                confineSpace: 'Confined Space Entry Permit (CSEP)'
                              };
                              return (
                                <div key={key} className="flex items-center p-2 bg-white rounded border border-gray-200">
                                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{labels[key] || key}</div>
                                    <div className="text-xs text-gray-500">Doc #: {doc.number || 'N/A'}</div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }).filter(Boolean);
                          
                          return documentsList.length > 0 ? documentsList : 
                            <div className="text-sm text-gray-500 italic">No documents attached</div>;
                        } catch (e) {
                          return <div className="text-sm text-red-500">Error loading documents</div>;
                        }
                      })()}
                    </div>
                  </div>
                )}
                
                {/* Safety Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-quaternary mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Safety & Equipment
                  </h4>
                  
                  {selectedPermit.equipmentNeeded && (
                    <div className="mb-4">
                      <strong className="text-sm">PPE Required:</strong>
                      <p className="text-gray-700 text-sm mt-1 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                        {selectedPermit.equipmentNeeded}
                      </p>
                    </div>
                  )}
                  
                  {selectedPermit.safetyMeasures && (
                    <div>
                      <strong className="text-sm">Safety Measures:</strong>
                      <p className="text-gray-700 text-sm mt-1 p-2 bg-green-50 border-l-4 border-green-400 rounded">
                        {selectedPermit.safetyMeasures}
                      </p>
                    </div>
                  )}
                  
                  {!selectedPermit.equipmentNeeded && !selectedPermit.safetyMeasures && (
                    <p className="text-gray-500 text-sm italic">No safety information specified</p>
                  )}
                </div>
                
                {/* Approval Workflow */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-quaternary mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Approval Workflow
                  </h4>
                  <div className="space-y-2">
                    {(() => {
                      const workflows = [
                        { status: 'DRAFT', label: 'Draft Created', icon: '📝', completed: !['DRAFT'].includes(selectedPermit.status) },
                        { status: 'PENDING_AA_APPROVAL', label: 'Submitted for AA Approval', icon: '📤', completed: !['DRAFT', 'PENDING_AA_APPROVAL'].includes(selectedPermit.status) },
                        { status: 'AA_APPROVED', label: 'AA Approved', icon: '✅', completed: !['DRAFT', 'PENDING_AA_APPROVAL', 'AA_APPROVED'].includes(selectedPermit.status) },
                        { status: 'FULLY_APPROVED', label: 'CC Approved (Fully Approved)', icon: '✅', completed: ['ACTIVE'].includes(selectedPermit.status) },
                        { status: 'ACTIVE', label: 'Active & Operational', icon: '🟢', completed: selectedPermit.status === 'ACTIVE' }
                      ];
                      
                      return workflows.map((workflow, index) => (
                        <div key={workflow.status} className={`flex items-center p-2 rounded ${
                          selectedPermit.status === workflow.status ? 'bg-blue-100 border border-blue-300' :
                          workflow.completed ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 ${
                            selectedPermit.status === workflow.status ? 'bg-blue-500 text-white' :
                            workflow.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <span className={`text-sm ${
                              selectedPermit.status === workflow.status ? 'font-semibold text-blue-700' :
                              workflow.completed ? 'text-green-700' : 'text-gray-600'
                            }`}>
                              {workflow.icon} {workflow.label}
                            </span>
                          </div>
                          {selectedPermit.status === workflow.status && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">Current</span>
                          )}
                          {workflow.completed && selectedPermit.status !== workflow.status && (
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
                
                {/* Metadata */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-quaternary mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Additional Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Created:</strong><br/>
                      <span className="text-gray-600">
                        {selectedPermit.createdAt ? new Date(selectedPermit.createdAt).toLocaleDateString('id-ID', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <strong>Last Updated:</strong><br/>
                      <span className="text-gray-600">
                        {selectedPermit.updatedAt ? new Date(selectedPermit.updatedAt).toLocaleDateString('id-ID', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <strong>Permit ID:</strong><br/>
                      <span className="text-gray-600 font-mono">#{selectedPermit.id}</span>
                    </div>
                    <div>
                      <strong>Creator:</strong><br/>
                      <span className="text-gray-600">{selectedPermit.user?.name || 'Unknown'}</span>
                    </div>
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
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4">
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
                showNotification={showNotification}
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

export default withAuth(PermitPlanning);
