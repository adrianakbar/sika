'use client';

import { useState } from 'react';
import Image from 'next/image';
import Sidebar from '../components/Sidebar';

export default function SitePlotPlans() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Data titik-titik di denah dengan koordinat relatif (persentase)
  const plotPoints = [
    {
      id: 1,
      x: 15, // persentase dari kiri
      y: 25, // persentase dari atas
      type: 'HW-NF', // Hot Work - Non Flammable
      status: 'active',
      permitNumber: 'HW-001',
      location: 'Workshop Area',
      description: 'Pengelasan struktur baja',
      startTime: '08:00',
      endTime: '16:00',
      supervisor: 'Ahmad Susanto'
    },
    {
      id: 2,
      x: 35,
      y: 40,
      type: 'HW-SP', // Hot Work - Special Permit
      status: 'active',
      permitNumber: 'HW-002',
      location: 'Storage Tank Area',
      description: 'Perbaikan pipa',
      startTime: '09:00',
      endTime: '15:00',
      supervisor: 'Budi Hartono'
    },
    {
      id: 3,
      x: 60,
      y: 30,
      type: 'CW', // Cold Work
      status: 'active',
      permitNumber: 'CW-001',
      location: 'Control Room',
      description: 'Instalasi kabel listrik',
      startTime: '07:00',
      endTime: '17:00',
      supervisor: 'Sari Wijaya'
    },
    {
      id: 4,
      x: 45,
      y: 65,
      type: 'CW-BC', // Cold Work - Bypass Control
      status: 'pending',
      permitNumber: 'CW-002',
      location: 'Process Unit',
      description: 'Maintenance valve',
      startTime: '10:00',
      endTime: '14:00',
      supervisor: 'Dedi Kurniawan'
    },
    {
      id: 5,
      x: 75,
      y: 55,
      type: 'HW-NF',
      status: 'completed',
      permitNumber: 'HW-003',
      location: 'Utility Area',
      description: 'Perbaikan generator',
      startTime: '06:00',
      endTime: '12:00',
      supervisor: 'Eko Prasetyo'
    },
    {
      id: 6,
      x: 25,
      y: 70,
      type: 'CW',
      status: 'active',
      permitNumber: 'CW-003',
      location: 'Laboratory',
      description: 'Kalibrasi instrumen',
      startTime: '08:30',
      endTime: '16:30',
      supervisor: 'Fitri Handayani'
    },
    {
      id: 7,
      x: 85,
      y: 35,
      type: 'HW-SP',
      status: 'active',
      permitNumber: 'HW-004',
      location: 'Flare Stack',
      description: 'Inspeksi struktur',
      startTime: '09:30',
      endTime: '15:30',
      supervisor: 'Gunawan Adi'
    },
    {
      id: 8,
      x: 55,
      y: 80,
      type: 'CW-BC',
      status: 'pending',
      permitNumber: 'CW-004',
      location: 'Loading Area',
      description: 'Pemasangan safety barrier',
      startTime: '11:00',
      endTime: '17:00',
      supervisor: 'Hendra Saputra'
    },
    {
      id: 9,
      x: 20,
      y: 50,
      type: 'HW-NF',
      status: 'active',
      permitNumber: 'HW-005',
      location: 'Maintenance Shop',
      description: 'Cutting dan grinding',
      startTime: '08:00',
      endTime: '16:00',
      supervisor: 'Indra Kusuma'
    }
  ];

  const getPointColor = (type, status) => {
    if (status === 'completed') return '#6B7280'; // gray
    if (status === 'pending') return '#F59E0B'; // amber
    
    switch (type) {
      case 'HW-NF': return '#EF4444'; // red
      case 'HW-SP': return '#F59E0B'; // yellow/amber
      case 'CW': return '#3B82F6'; // blue
      case 'CW-BC': return '#1F2937'; // black
      default: return '#6B7280';
    }
  };

  const getFilteredPoints = () => {
    let filtered = plotPoints;
    
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(point => point.type === selectedFilter);
    }
    
    if (selectedArea !== 'all') {
      filtered = filtered.filter(point => point.area === selectedArea);
    }
    
    return filtered;
  };

  const handlePointClick = (point) => {
    setSelectedPoint(point);
  };

  const filterOptions = [
    { value: 'all', label: 'Semua', color: '#6B7280' },
    { value: 'HW-NF', label: 'HW - NF', color: '#EF4444' },
    { value: 'HW-SP', label: 'HW - SP', color: '#F59E0B' },
    { value: 'CW', label: 'CW', color: '#3B82F6' },
    { value: 'CW-BC', label: 'CW - BC', color: '#1F2937' }
  ];

  const areaOptions = [
    { value: 'all', label: 'Semua Area', color: '#6B7280' },
    { value: 'PRC', label: 'PRC', color: '#EF4444' },
    { value: 'UTL', label: 'UTL', color: '#F97316' },
    { value: 'BLD', label: 'BLD', color: '#EAB308' },
    { value: 'OY', label: 'OY', color: '#22C55E' },
    { value: 'NBL', label: 'NBL', color: '#16A34A' },
    { value: 'CCR', label: 'CCR', color: '#3B82F6' },
    { value: 'WS', label: 'WS', color: '#06B6D4' },
    { value: 'GMS', label: 'GMS', color: '#8B5CF6' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header Mobile */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-bold text-quaternary">Site Plot Plans</h1>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-quaternary hidden lg:block">Site Plot Plans</h1>
                <p className="text-gray-600 mt-2">ORF PHE WMO</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">1-10 Juli 2025</div>
                <div className="text-sm text-gray-500">History Permit</div>
                <div className="mt-2">
                  <span className="text-xs text-gray-500">Total Permit</span>
                  <div className="text-4xl font-bold text-quaternary">{plotPoints.length}</div>
                </div>
              </div>
            </div>

        {/* Filter Legend */}
            <div className="space-y-4">
              {/* Work Type Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Work Type:</h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedFilter(option.value)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all ${
                        selectedFilter === option.value
                          ? 'bg-quaternary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: option.color }}
                      ></div>
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Area Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Area:</h3>
                <div className="flex flex-wrap gap-2">
                  {areaOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedArea(option.value)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all ${
                        selectedArea === option.value
                          ? 'bg-quaternary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: option.color }}
                      ></div>
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Site Plan */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-quaternary mb-4">Layout Denah</h2>
            <div className="relative w-full">
              <div className="relative inline-block w-full">
                <Image
                  src="/images/layout-orf.png"
                  alt="Site Layout"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-lg border"
                  priority
                />
                
                {/* Plot Points Overlay */}
                {getFilteredPoints().map((point) => (
                  <button
                    key={point.id}
                    onClick={() => handlePointClick(point)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all hover:scale-150 ${
                      selectedPoint?.id === point.id ? 'scale-150 ring-4 ring-blue-200' : ''
                    }`}
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      backgroundColor: getPointColor(point.type, point.status)
                    }}
                    title={`${point.permitNumber} - ${point.location}`}
                  >
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="space-y-4">
          {/* Permit Details */}
          {selectedPoint ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-quaternary mb-4">Detail Permit</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">No. Permit</label>
                  <div className="text-lg font-semibold">{selectedPoint.permitNumber}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipe</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getPointColor(selectedPoint.type, selectedPoint.status) }}
                    ></div>
                    <span className="font-medium">{selectedPoint.type}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Area</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: areaOptions.find(a => a.value === selectedPoint.area)?.color || '#6B7280' }}
                    ></div>
                    <span className="font-medium">{selectedPoint.area}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tanggal</label>
                  <div className="font-medium">{selectedPoint.date}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    selectedPoint.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedPoint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedPoint.status === 'active' ? 'Aktif' :
                     selectedPoint.status === 'pending' ? 'Menunggu' : 'Selesai'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Lokasi</label>
                  <div className="font-medium">{selectedPoint.location}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Deskripsi Pekerjaan</label>
                  <div className="text-sm">{selectedPoint.description}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Waktu</label>
                  <div className="text-sm">{selectedPoint.startTime} - {selectedPoint.endTime}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Supervisor</label>
                  <div className="font-medium">{selectedPoint.supervisor}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-quaternary mb-4">Detail Permit</h3>
              <div className="text-center text-gray-500 py-8">
                Klik pada titik di denah untuk melihat detail permit
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-quaternary mb-4">Statistik Permit</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Permit</span>
                <span className="font-semibold">{getFilteredPoints().length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hot Work</span>
                <span className="font-semibold text-red-600">
                  {getFilteredPoints().filter(p => p.type.startsWith('HW')).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cold Work</span>
                <span className="font-semibold text-blue-600">
                  {getFilteredPoints().filter(p => p.type.startsWith('CW')).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Selesai</span>
                <span className="font-semibold text-green-600">
                  {getFilteredPoints().filter(p => p.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}