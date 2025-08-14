"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "../components/Sidebar";

export default function BasicPrinciplePage() {
  const [selectedPrinciple, setSelectedPrinciple] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const principles = [
    {
      id: 1,
      title: "Sarana Komunikasi dan Mitigasi Bahaya",
      description:
        "Sarana komunikasi, permintaan persetujuan, verifikasi rencana kerja, dan mitigasi bahaya antar berbagai pihak di lokasi kerja.",
      icon: "💬",
      color: "from-blue-400 to-blue-600",
      borderColor: "border-orange-400",
    },
    {
      id: 2,
      title: "Prosedur Berlaku",
      description:
        "Seluruh pekerjaan harus dilakukan dengan memperhatikan prosedur yang berlaku, memperhatikan peralatan yang dipergunakan dan kondisi lapangan, serta ruang lingkup pekerjaan.",
      icon: "📋",
      color: "from-green-400 to-green-600",
      borderColor: "border-green-400",
    },
    {
      id: 3,
      title: "Pengelolaan Risiko",
      description:
        "Seluruh pekerjaan hanya boleh dilakukan bila telah tersedia pengelolaan risiko pekerjaan tersebut.",
      icon: "⚠️",
      color: "from-yellow-400 to-yellow-600",
      borderColor: "border-green-400",
    },
    {
      id: 4,
      title: "Pelatihan dan Kompetensi",
      description:
        "Seluruh pekerja harus diberikan pelatihan dan memiliki kompetensi yang sesuai untuk dapat memahami risiko pekerjaan.",
      icon: "🎓",
      color: "from-purple-400 to-purple-600",
      borderColor: "border-gray-400",
    },
    {
      id: 5,
      title: "Alat Pelindung Diri",
      description:
        "Alat pelindung diri harus digunakan sesuai dengan hasil kajian risiko dan/atau sesuai dengan persyaratan minimum di lokasi kerja.",
      icon: "🦺",
      color: "from-red-400 to-red-600",
      borderColor: "border-orange-400",
    },
    {
      id: 6,
      title: "Rencana Tanggap Darurat",
      description:
        "Rencana tanggap darurat disusun berdasarkan potensi kecelakaan yang mungkin terjadi dan diterapkan sebelum memulai pekerjaan.",
      icon: "🚨",
      color: "from-indigo-400 to-indigo-600",
      borderColor: "border-gray-400",
    },
    {
      id: 7,
      title: "Wewenang Menghentikan Pekerjaan",
      description:
        "Setiap pekerja memiliki wewenang untuk menghentikan pekerjaan yang tidak selamat dan wajib melaporkan setiap insiden yang terjadi.",
      icon: "✋",
      color: "from-pink-400 to-pink-600",
      borderColor: "border-red-400",
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
                Prinsip Dasar SIKA
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
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
              {/* Title Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-quaternary mb-4">
                  Prinsip Dasar Sistem Izin Kerja Selamat
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Tujuh prinsip fundamental yang harus dipahami dan diterapkan
                  dalam setiap aktivitas kerja untuk memastikan keselamatan dan
                  keamanan di tempat kerja.
                </p>
              </div>

              {/* Principles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {principles.map((principle) => (
                  <div
                    key={principle.id}
                    className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-l-4 ${principle.borderColor}`}
                    onClick={() => setSelectedPrinciple(principle)}
                  >
                    <div className="p-6">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${principle.color} flex items-center justify-center text-white text-xl font-bold mb-4`}
                      >
                        {principle.id}
                      </div>
                      <div className="text-3xl mb-3">{principle.icon}</div>
                      <h3 className="font-bold text-quaternary text-lg mb-3 leading-tight">
                        {principle.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {principle.description}
                      </p>
                      <div className="mt-4 flex items-center text-primary text-sm font-medium">
                        <span>Pelajari lebih lanjut</span>
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Statistics Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-quaternary mb-2">
                    100%
                  </h3>
                  <p className="text-gray-600">Kepatuhan Wajib</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-quaternary mb-2">7</h3>
                  <p className="text-gray-600">Prinsip Utama</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-quaternary mb-2">0</h3>
                  <p className="text-gray-600">Target Kecelakaan</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal for Principle Details */}
      {selectedPrinciple && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${selectedPrinciple.color} flex items-center justify-center text-white text-xl font-bold`}
                  >
                    {selectedPrinciple.id}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-quaternary">
                      Prinsip {selectedPrinciple.id}
                    </h2>
                    <p className="text-gray-600">Sistem Izin Kerja Selamat</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPrinciple(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{selectedPrinciple.icon}</div>
                <h3 className="text-xl font-bold text-quaternary mb-4">
                  {selectedPrinciple.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedPrinciple.description}
                </p>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-quaternary mb-3">
                  Implementasi:
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      Pastikan pemahaman yang mendalam tentang prinsip ini
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Terapkan dalam setiap aktivitas kerja</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Monitor dan evaluasi secara berkala</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setSelectedPrinciple(null)}
                  className="flex-1 px-6 py-3 bg-quaternary text-white rounded-lg font-semibold hover:bg-quaternary/90 transition-colors"
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
