"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "../components/Sidebar";

export default function GoalPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const goals = [
    {
      id: 1,
      title: "Memastikan bahwa pekerjaan dilakukan dengan aman",
      icon: "🛡️",
      color: "from-blue-400 to-blue-600",
      borderColor: "border-orange-400",
      description:
        "Menjamin setiap aktivitas kerja dilaksanakan dengan mengutamakan keselamatan pekerja dan lingkungan kerja yang aman.",
    },
    {
      id: 2,
      title: "Mencegah terjadinya kecelakaan kerja",
      icon: "⚠️",
      color: "from-green-400 to-green-600",
      borderColor: "border-green-400",
      description:
        "Mengurangi risiko dan mencegah terjadinya kecelakaan yang dapat membahayakan pekerja dan aset perusahaan.",
    },
    {
      id: 3,
      title:
        "Meningkatkan efisiensi dan produktivitas kerja dengan perencanaan yang terstruktur",
      icon: "📈",
      color: "from-purple-400 to-purple-600",
      borderColor: "border-gray-400",
      description:
        "Optimalisasi proses kerja melalui perencanaan yang sistematis dan terorganisir untuk meningkatkan produktivitas.",
    },
    {
      id: 4,
      title: "Membentuk budaya yang mendukung continual improvement",
      icon: "🔄",
      color: "from-yellow-400 to-yellow-600",
      borderColor: "border-gray-400",
      description:
        "Menciptakan lingkungan kerja yang mendorong perbaikan berkelanjutan dalam setiap aspek operasional.",
    },
  ];

  const systemComponents = [
    {
      id: "behavior",
      title: "BEHAVIOR",
      color: "bg-red-500",
      description: "Perilaku aman dalam bekerja",
    },
    {
      id: "program",
      title: "PROGRAM",
      color: "bg-green-500",
      description: "Program keselamatan kerja",
    },
    {
      id: "culture",
      title: "CULTURE",
      color: "bg-blue-500",
      description: "Budaya keselamatan kerja",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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

              <h1 className="ml-4 lg:ml-0 text-2xl font-bold text-quaternary">
                Tujuan SIKA
              </h1>
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">U</span>
                </div>
                <span className="ml-2 text-gray-700 font-medium hidden sm:block">
                  User
                </span>
              </div>

              <button className="p-2 text-gray-500 hover:text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-4">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Target Utama
                </div>
                <h1 className="text-4xl font-bold text-quaternary mb-6">
                  Tujuan Sistem Izin Kerja Selamat
                </h1>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  SIKA bertujuan untuk menciptakan lingkungan kerja yang aman,
                  efisien, dan produktif melalui sistem yang terstruktur dan
                  budaya keselamatan yang berkelanjutan.
                </p>
              </div>

              {/* Goals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${goal.borderColor} overflow-hidden`}
                  >
                    <div className="p-8">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${goal.color} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}
                        >
                          {goal.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-primary font-semibold mb-2">
                            Tujuan {goal.id}
                          </div>
                          <h3 className="font-bold text-quaternary text-lg mb-4 leading-tight">
                            {goal.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {goal.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* System Visualization */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-quaternary mb-4">
                    Sistem Izin Kerja Aman
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Integrasi tiga komponen utama untuk mencapai Zero Incident
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8">
                  {/* System Input */}
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-2xl px-8 py-6 shadow-lg transform rotate-1 hover:rotate-0 transition-transform">
                    <h3 className="text-xl font-bold text-center">
                      SISTEM IZIN
                    </h3>
                    <h3 className="text-xl font-bold text-center">
                      KERJA AMAN
                    </h3>
                  </div>

                  {/* Arrow */}
                  <div className="hidden lg:block">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>

                  {/* System Components */}
                  <div className="flex flex-col space-y-4">
                    {systemComponents.map((component) => (
                      <div
                        key={component.id}
                        className="flex items-center space-x-4"
                      >
                        <div
                          className={`w-20 h-20 ${component.color} rounded-full flex items-center justify-center shadow-lg`}
                        >
                          <span className="text-white font-bold text-sm text-center px-2">
                            {component.title}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 font-medium">
                            {component.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Arrow */}
                  <div className="hidden lg:block">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>

                  {/* Zero Incident Result */}
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl px-8 py-6 shadow-lg mb-4">
                      <h3 className="text-3xl font-bold">ZERO</h3>
                      <h3 className="text-lg font-semibold">INCIDENT</h3>
                    </div>
                    <div className="text-2xl font-bold text-quaternary italic">
                      Kita Bisa!
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-green-500">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-quaternary mb-2">
                    Keamanan Terjamin
                  </h3>
                  <p className="text-gray-600">
                    Proteksi maksimal untuk semua pekerja
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-blue-500">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-quaternary mb-2">
                    Efisiensi Tinggi
                  </h3>
                  <p className="text-gray-600">
                    Perencanaan terstruktur dan produktif
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-purple-500">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-quaternary mb-2">
                    Perbaikan Berkelanjutan
                  </h3>
                  <p className="text-gray-600">Budaya continual improvement</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
