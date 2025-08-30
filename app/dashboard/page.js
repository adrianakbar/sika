"use client";

import { useState, useEffect } from "react";
import withAuth from "../components/withAuth";
import { useRouter } from "next/navigation";
import ApprovalPanel from "../components/ApprovalPanel";
import PermitSubmitButton from "../components/PermitSubmitButton";
import PermitDeleteButton from "../components/PermitDeleteButton";
import NotificationToast from "../components/NotificationToast";
import LoadingSpinner from "../components/LoadingSpinner";

function Dashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const router = useRouter();

  // Handle permit submit
  const handlePermitSubmit = (updatedPermit) => {
    setNotification({
      show: true,
      message: "Permit submitted for AA approval successfully!",
      type: "success"
    });
    // Refresh dashboard data
    fetchDashboardData();
    // Update selected permit if it's the same one
    if (selectedPermit && selectedPermit.id === updatedPermit.id) {
      setSelectedPermit(updatedPermit);
    }
  };

  // Handle approval with notification
  const handleApproval = (updatedPermit) => {
    setNotification({
      show: true,
      message: `Permit approved successfully by ${user.role}`,
      type: "success"
    });
    fetchDashboardData();
    if (selectedPermit && selectedPermit.id === updatedPermit.id) {
      setSelectedPermit(updatedPermit);
    }
  };

  // Handle rejection with notification
  const handleRejection = (updatedPermit) => {
    setNotification({
      show: true,
      message: `Permit rejected by ${user.role}`,
      type: "success"
    });
    fetchDashboardData();
    if (selectedPermit && selectedPermit.id === updatedPermit.id) {
      setSelectedPermit(updatedPermit);
    }
  };

  // Fetch dashboard data berdasarkan role
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

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

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
      'PENDING_AA_APPROVAL': { color: 'bg-yellow-500', text: 'Pending AA' },
      'AA_APPROVED': { color: 'bg-quaternary', text: 'AA Approved' },
      'FULLY_APPROVED': { color: 'bg-secondary', text: 'Fully Approved' },
      'ACTIVE': { color: 'bg-secondary', text: 'Active' },
      'REJECTED_BY_AA': { color: 'bg-primary', text: 'Rejected by AA' },
      'REJECTED_BY_SC': { color: 'bg-primary', text: 'Rejected by SC' },
      'COMPLETED': { color: 'bg-quaternary', text: 'Completed' },
      'CANCELLED': { color: 'bg-gray-400', text: 'Cancelled' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-500', text: status };
    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold text-white rounded-full ${config.color} shadow-sm`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-primary text-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Selamat Datang di SIKA</h1>
              <p className="text-xl opacity-90 mb-2">
                Sistem Izin Kerja Selamat PT. Pertamina Hulu Energi WMO
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-lg font-medium">
                    {user?.name}
                  </p>
                  <p className="text-sm opacity-75">
                    {getRoleDescription(user?.role)}
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {dashboardData?.stats?.total || 0}
                  </div>
                  <div className="text-sm opacity-75">Total Permits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {dataLoading ? (
        <div className="min-h-screen bg-gradient-to-br from-tertiary/10 to-white p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-96">
              <LoadingSpinner 
                size="xl" 
                variant="modern" 
                color="primary" 
                text="Loading dashboard data..." 
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Statistics Cards Row */}
          <div className="lg:col-span-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Total Permits Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-primary transform transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Permits</p>
                    <p className="text-3xl font-bold text-quaternary">{dashboardData?.stats?.total || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">All time</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Active Permits Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-secondary transform transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-3xl font-bold text-secondary">{dashboardData?.stats?.active || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Currently running</p>
                  </div>
                  <div className="bg-secondary/10 p-3 rounded-full">
                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Fully Approved Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-green-500 transform transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-3xl font-bold text-green-600">{dashboardData?.stats?.fullyApproved || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Ready to start</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Pending Approval Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-yellow-500 transform transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {(dashboardData?.stats?.pendingAA || 0) + (dashboardData?.stats?.pendingApproval || 0) + (dashboardData?.stats?.draft || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {dashboardData?.stats?.draft ? `${dashboardData.stats.draft} draft` : 'Needs approval'}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Rejected Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-red-500 transform transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rejected</p>
                    <p className="text-3xl font-bold text-red-600">{dashboardData?.stats?.rejected || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Needs revision</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {/* Risk Level Distribution */}
              <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-l-purple-500">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Risk Levels</h4>
                <div className="space-y-1">
                  {(() => {
                    const riskData = dashboardData?.permits?.reduce((acc, permit) => {
                      acc[permit.riskLevel] = (acc[permit.riskLevel] || 0) + 1;
                      return acc;
                    }, {}) || {};
                    
                    return Object.entries(riskData).map(([level, count]) => (
                      <div key={level} className="flex justify-between items-center text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          level === 'HIGH' ? 'bg-red-100 text-red-700' :
                          level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>{level}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
              
              {/* Work Type Distribution */}
              <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-l-blue-500">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Work Types</h4>
                <div className="space-y-1">
                  {(() => {
                    const workTypeData = dashboardData?.permits?.reduce((acc, permit) => {
                      const types = {
                        'COLD_WORK': 'General',
                        'COLD_WORK_BREAKING': 'Breaking',
                        'HOT_WORK_SPARK': 'Critical',
                        'HOT_WORK_FLAME': 'Hot Work'
                      };
                      const typeName = types[permit.workType] || permit.workType;
                      acc[typeName] = (acc[typeName] || 0) + 1;
                      return acc;
                    }, {}) || {};
                    
                    return Object.entries(workTypeData).slice(0, 3).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center text-xs">
                        <span className="text-gray-700">{type}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
              
              {/* Zone Distribution */}
              <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-l-indigo-500">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Active Zones</h4>
                <div className="space-y-1">
                  {(() => {
                    const zoneData = dashboardData?.permits?.reduce((acc, permit) => {
                      if (permit.status === 'ACTIVE' || permit.status === 'FULLY_APPROVED') {
                        acc[permit.zone] = (acc[permit.zone] || 0) + 1;
                      }
                      return acc;
                    }, {}) || {};
                    
                    return Object.entries(zoneData).slice(0, 3).map(([zone, count]) => (
                      <div key={zone} className="flex justify-between items-center text-xs">
                        <span className="text-gray-700">{zone}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
              
              {/* This Week Summary */}
              <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-l-teal-500">
                <h4 className="text-sm font-medium text-gray-600 mb-2">This Week</h4>
                <div className="space-y-1">
                  {(() => {
                    const now = new Date();
                    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                    const thisWeekPermits = dashboardData?.permits?.filter(permit => 
                      new Date(permit.createdAt) >= weekStart
                    ) || [];
                    
                    const approvedThisWeek = thisWeekPermits.filter(p => 
                      p.status === 'FULLY_APPROVED' || p.status === 'ACTIVE'
                    ).length;
                    
                    return (
                      <>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-700">New Created</span>
                          <span className="font-medium">{thisWeekPermits.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-700">Approved</span>
                          <span className="font-medium text-green-600">{approvedThisWeek}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-700">Success Rate</span>
                          <span className="font-medium">
                            {thisWeekPermits.length > 0 ? Math.round((approvedThisWeek / thisWeekPermits.length) * 100) : 0}%
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Left Panel - Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-quaternary mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </h3>
              <div className="space-y-3">
                {user?.role === 'PTWC' && (
                  <button
                    onClick={() => router.push('/permitplanning')}
                    className="w-full flex items-center px-4 py-3 text-sm bg-primary text-white rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all transform hover:scale-105 shadow-md"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Permit
                  </button>
                )}
                
                <button
                  onClick={() => router.push('/siteplotplans')}
                  className="w-full flex items-center px-4 py-3 text-sm bg-primary text-white rounded-lg hover:from-secondary/90 hover:to-secondary/70 transition-all transform hover:scale-105 shadow-md"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  View Site Plot
                </button>
                
                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => router.push('/permitplanning')}
                    className="w-full flex items-center px-4 py-3 text-sm bg-gradient-to-r from-quaternary to-quaternary/80 text-white rounded-lg hover:from-quaternary/90 hover:to-quaternary/70 transition-all transform hover:scale-105 shadow-md"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage All Permits
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Permits List and Approval */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Permits List */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-quaternary flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {dashboardData?.role === 'PTWC' ? 'My Permits' :
                     dashboardData?.role === 'AA' ? 'Permits Awaiting AA Approval' :
                     dashboardData?.role === 'SC' ? 'Permits Awaiting SC Approval' :
                     'All Permits'}
                  </h3>
                  <div className="bg-tertiary px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-quaternary">
                      {dashboardData?.permits?.length || 0} permits
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {dashboardData?.permits?.length > 0 ? (
                    dashboardData.permits.map((permit) => (
                      <div
                        key={permit.id}
                        onClick={() => setSelectedPermit(permit)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-102 ${
                          selectedPermit?.id === permit.id
                            ? 'border-primary bg-primary/5 shadow-lg'
                            : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-quaternary text-lg truncate">
                              #{permit.permitNumber}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {permit.workLocation}
                            </p>
                          </div>
                          {getStatusBadge(permit.status)}
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                          {permit.workDescription}
                        </p>
                        
                        {/* Schedule Information */}
                        <div className="bg-gray-50 p-2 rounded-lg mb-3">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="font-medium text-gray-600">Start:</span>
                              <div className="text-green-600">
                                {new Date(permit.startDate).toLocaleDateString('id-ID', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">End:</span>
                              <div className="text-red-600">
                                {new Date(permit.endDate).toLocaleDateString('id-ID', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {permit.zone}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-quaternary/20 text-quaternary">
                            {(() => {
                              const workTypes = {
                                'COLD_WORK': 'General',
                                'COLD_WORK_BREAKING': 'Breaking',
                                'HOT_WORK_SPARK': 'Critical',
                                'HOT_WORK_FLAME': 'Hot Work'
                              };
                              return workTypes[permit.workType] || permit.workType;
                            })()}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            permit.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                            permit.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {permit.riskLevel}
                          </span>
                        </div>
                        
                        {/* Personnel Info */}
                        <div className="space-y-1 mb-2">
                          {permit.user && (
                            <p className="text-xs text-gray-500 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              PTWC: {permit.user.name}
                            </p>
                          )}
                          {permit.performingAuthority && (
                            <p className="text-xs text-gray-500 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                              </svg>
                              PA: {permit.performingAuthority}
                            </p>
                          )}
                        </div>
                        
                        {/* Duration Indicator */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>Duration:</span>
                          <span className="font-medium">
                            {(() => {
                              const start = new Date(permit.startDate);
                              const end = new Date(permit.endDate);
                              const diffMs = end - start;
                              const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                              const diffDays = Math.floor(diffHours / 24);
                              
                              if (diffDays > 0) {
                                return `${diffDays}d ${diffHours % 24}h`;
                              } else {
                                return `${diffHours}h`;
                              }
                            })()}
                          </span>
                        </div>
                        
                        {/* Submit Button for DRAFT permits */}
                        {permit.status === 'DRAFT' && user && (
                          <div className="mt-3 pt-2 border-t border-gray-200">
                            <PermitSubmitButton 
                              permit={permit} 
                              user={user} 
                              onSubmit={handlePermitSubmit}
                              hideNotification={true}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 text-lg">No permits found</p>
                      <p className="text-gray-400 text-sm mb-4">Create your first permit to get started</p>
                      {user?.role === 'PTWC' && (
                        <button
                          onClick={() => router.push('/permitplanning')}
                          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Create New Permit
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Approval Panel */}
              <div>
                <ApprovalPanel
                  permit={selectedPermit}
                  user={user}
                  onApprove={handleApproval}
                  onReject={handleRejection}
                  onRefresh={fetchDashboardData}
                  hideNotification={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      <NotificationToast
        notification={notification.show ? notification : null}
        onClose={() => setNotification({ show: false, message: "", type: "" })}
      />
    </div>
  );
}

export default withAuth(Dashboard);
