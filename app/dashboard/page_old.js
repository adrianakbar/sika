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
        <div className="bg-gradient-to-r from-primary to-primary/80 text-foreground rounded-2xl p-8">
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
          </p>
          <p className="mt-4 opacity-75">
            Kelola izin kerja Anda dengan aman dan efisien melalui sistem
            terintegrasi
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">
                {dataLoading ? "..." : dashboardData.activePermits}
              </p>
              <p className="text-gray-600">Permit Aktif</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">
                {dataLoading ? "..." : dashboardData.completedPermits}
              </p>
              <p className="text-gray-600">Permit Selesai</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">
                {dataLoading ? "..." : dashboardData.pendingApprovalPermits}
              </p>
              <p className="text-gray-600">Menunggu Approval</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">
                {dataLoading ? "..." : dashboardData.expiredPermits}
              </p>
              <p className="text-gray-600">Expired</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Aktivitas Terbaru
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dataLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-500 mt-2">Memuat aktivitas...</p>
                </div>
              ) : dashboardData.recentActivities.length > 0 ? (
                dashboardData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        activity.type === "success"
                          ? "bg-green-500"
                          : activity.type === "warning"
                          ? "bg-yellow-500"
                          : activity.type === "info"
                          ? "bg-blue-500"
                          : activity.type === "error"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">
                        {activity.action}
                      </p>
                      <p className="text-gray-500 text-sm">{activity.time}</p>
                      {activity.location && (
                        <p className="text-gray-400 text-xs">
                          {activity.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-gray-500">Belum ada aktivitas terbaru</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push("/permitplanning")}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className="text-center">
                  <svg
                    className="w-8 h-8 text-gray-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-gray-600 font-medium">Buat Permit Baru</p>
                </div>
              </button>

              <button
                onClick={() => router.push("/permitplanning")}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className="text-center">
                  <svg
                    className="w-8 h-8 text-gray-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-gray-600 font-medium">Lihat Permit</p>
                </div>
              </button>

              <button
                onClick={() => router.push("/goal")}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className="text-center">
                  <svg
                    className="w-8 h-8 text-gray-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <p className="text-gray-600 font-medium">Tujuan</p>
                </div>
              </button>

              <button
                onClick={() => router.push("/element")}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className="text-center">
                  <svg
                    className="w-8 h-8 text-gray-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <p className="text-gray-600 font-medium">12 Elemen</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
