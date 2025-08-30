"use client";

import { useState, useEffect } from "react";
import withAuth from "../components/withAuth";
import { useRouter } from "next/navigation";
import ApprovalPanel from "../components/ApprovalPanel";

function Dashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();

  // Fetch dashboard data berdasarkan role
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setDataLoading(true);
        const response = await fetch(`/api/dashboard/permits?userId=${user.id}&role=${user.role}`);
        const result = await response.json();

        if (result.success) {
          setDashboardData(result.data);
        } else {
          console.error("Failed to fetch dashboard data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const refreshData = () => {
    if (user) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/dashboard/permits?userId=${user.id}&role=${user.role}`);
          const result = await response.json();
          if (result.success) {
            setDashboardData(result.data);
          }
        } catch (error) {
          console.error("Error refreshing data:", error);
        }
      };
      fetchData();
    }
  };

  const getRoleDescription = (role) => {
    const roles = {
      'PTWC': 'Permit to Work Controller',
      'AA': 'Area Authority',
      'CC': 'Company Controller',
      'ADMIN': 'Administrator'
    };
    return roles[role] || role;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'DRAFT': { color: 'bg-gray-500', text: 'Draft' },
      'PENDING_AA_APPROVAL': { color: 'bg-yellow-500', text: 'Pending AA Approval' },
      'AA_APPROVED': { color: 'bg-blue-500', text: 'AA Approved' },
      'FULLY_APPROVED': { color: 'bg-green-500', text: 'Fully Approved' },
      'ACTIVE': { color: 'bg-green-600', text: 'Active' },
      'REJECTED_BY_AA': { color: 'bg-red-500', text: 'Rejected by AA' },
      'REJECTED_BY_CC': { color: 'bg-red-600', text: 'Rejected by CC' },
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

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-2">Selamat Datang di SIKA</h2>
          <p className="text-xl opacity-90">
            Sistem Izin Kerja Selamat PT. Pertamina Hulu Energi WMO
          </p>
          <p className="text-lg opacity-75 mt-2">
            {user?.name} - {getRoleDescription(user?.role)}
          </p>
        </div>
      </div>

      {dataLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Statistics */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {dashboardData?.title}
              </h3>
              
              {dashboardData?.stats && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Permits</span>
                    <span className="font-semibold text-xl">{dashboardData.stats.total}</span>
                  </div>

                  {dashboardData.stats.draft !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Draft</span>
                      <span className="font-semibold text-gray-500">{dashboardData.stats.draft}</span>
                    </div>
                  )}

                  {dashboardData.stats.pendingAA !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending AA Approval</span>
                      <span className="font-semibold text-yellow-600">{dashboardData.stats.pendingAA}</span>
                    </div>
                  )}

                  {dashboardData.stats.aaApproved !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">AA Approved</span>
                      <span className="font-semibold text-blue-600">{dashboardData.stats.aaApproved}</span>
                    </div>
                  )}

                  {dashboardData.stats.pendingApproval !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending My Approval</span>
                      <span className="font-semibold text-orange-600">{dashboardData.stats.pendingApproval}</span>
                    </div>
                  )}

                  {dashboardData.stats.active !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active</span>
                      <span className="font-semibold text-green-600">{dashboardData.stats.active}</span>
                    </div>
                  )}

                  {dashboardData.stats.rejected !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rejected</span>
                      <span className="font-semibold text-red-600">{dashboardData.stats.rejected}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {user?.role === 'PTWC' && (
                  <button
                    onClick={() => router.push('/permitplanning')}
                    className="w-full text-left px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                  >
                    Create New Permit
                  </button>
                )}
                
                <button
                  onClick={() => router.push('/siteplotplans')}
                  className="w-full text-left px-4 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                >
                  View Site Plot
                </button>
                
                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => router.push('/permitplanning')}
                    className="w-full text-left px-4 py-2 text-sm bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
                  >
                    Manage All Permits
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Permits List and Approval */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Permits List */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {dashboardData?.role === 'PTWC' ? 'My Permits' :
                   dashboardData?.role === 'AA' ? 'Permits Awaiting AA Approval' :
                   dashboardData?.role === 'CC' ? 'Permits Awaiting CC Approval' :
                   'All Permits'}
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {dashboardData?.permits?.length > 0 ? (
                    dashboardData.permits.map((permit) => (
                      <div
                        key={permit.id}
                        onClick={() => setSelectedPermit(permit)}
                        className={`p-3 border rounded cursor-pointer transition-colors ${
                          selectedPermit?.id === permit.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">
                            #{permit.permitNumber}
                          </h4>
                          {getStatusBadge(permit.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {permit.workDescription}
                        </p>
                        <p className="text-xs text-gray-500">
                          {permit.zone} • {permit.workType?.replace('_', ' ')} • {permit.riskLevel}
                        </p>
                        {permit.user && (
                          <p className="text-xs text-gray-500">
                            By: {permit.user.name}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No permits found
                    </div>
                  )}
                </div>
              </div>

              {/* Approval Panel */}
              <div>
                <ApprovalPanel
                  permit={selectedPermit}
                  user={user}
                  onApprove={refreshData}
                  onReject={refreshData}
                  onRefresh={refreshData}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(Dashboard);
