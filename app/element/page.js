"use client";

import { useState } from "react";

export default function ElementPage() {
  const [selectedElement, setSelectedElement] = useState(null);

  const elements = [
    {
      id: 1,
      title: "Prosedur & Strategi Implementasi Tertulis",
      category: "plan",
      color: "bg-blue-500",
      icon: "📋",
    },
    {
      id: 2,
      title: "Peran, Tanggung Jawab & Akuntabilitas",
      category: "plan",
      color: "bg-blue-500",
      icon: "👥",
    },
    {
      id: 3,
      title: "Pelatihan & Kompetensi",
      category: "plan",
      color: "bg-blue-500",
      icon: "🎓",
    },
    {
      id: 4,
      title: "Perencanaan & Penjadwalan",
      category: "plan",
      color: "bg-blue-500",
      icon: "📅",
    },
    {
      id: 5,
      title: "Kajian Risiko",
      category: "do",
      color: "bg-purple-500",
      icon: "⚠️",
    },
    {
      id: 6,
      title: "Izin Kerja",
      category: "do",
      color: "bg-purple-500",
      icon: "📝",
    },
    {
      id: 7,
      title: "Komunikasi Tertulis",
      category: "do",
      color: "bg-purple-500",
      icon: "💬",
    },
    {
      id: 8,
      title: "Pemantauan Pekerjaan yang sedang Berjalan",
      category: "do",
      color: "bg-purple-500",
      icon: "👁️",
    },
    {
      id: 9,
      title: "Meninggalkan Pekerjaan dalam Kondisi Aman",
      category: "do",
      color: "bg-purple-500",
      icon: "🔒",
    },
    {
      id: 10,
      title: "Menghentikan Pekerjaan yang Tidak Aman",
      category: "check",
      color: "bg-red-500",
      icon: "🛑",
    },
    {
      id: 11,
      title: "Pembelajaran Internal & Eksternal",
      category: "check",
      color: "bg-red-500",
      icon: "📚",
    },
    {
      id: 12,
      title: "Inspeksi, Audit & Tinjauan Berkala",
      category: "action",
      color: "bg-green-500",
      icon: "🔍",
    },
  ];

  const getCategoryLabel = (category) => {
    switch (category) {
      case "plan":
        return "PLAN";
      case "do":
        return "DO";
      case "check":
        return "CHECK";
      case "action":
        return "ACT";
      default:
        return "";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "plan":
        return "from-blue-400 to-blue-600";
      case "do":
        return "from-purple-400 to-purple-600";
      case "check":
        return "from-red-400 to-red-600";
      case "action":
        return "from-green-400 to-green-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            12 Elemen Sistem Izin Kerja Selamat
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sistem komprehensif untuk memastikan keselamatan kerja melalui
            implementasi 12 elemen yang terintegrasi dalam siklus PDCA
            (Plan-Do-Check-Act)
          </p>
        </div>

        {/* PDCA Cycle Visual */}
        <div className="relative flex justify-center items-center mb-12">
          <div className="relative w-96 h-96">
            {/* Central Circle */}
            <div className="absolute inset-1/4 bg-white rounded-full shadow-lg border-4 border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900 mb-2">
                  SIKA
                </div>
                <div className="text-sm text-gray-600">
                  Sistem Izin Kerja Aman
                </div>
              </div>
            </div>

            {/* PDCA Segments */}
            <div className="absolute inset-0">
              {/* Plan - Top Left */}
              <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-tl-full flex items-center justify-center text-white font-bold text-2xl">
                PLAN
              </div>

              {/* Do - Top Right */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-400 to-purple-600 rounded-tr-full flex items-center justify-center text-white font-bold text-2xl">
                DO
              </div>

              {/* Check - Bottom Right */}
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-red-400 to-red-600 rounded-br-full flex items-center justify-center text-white font-bold text-2xl">
                CHECK
              </div>

              {/* Act - Bottom Left */}
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-400 to-green-600 rounded-bl-full flex items-center justify-center text-white font-bold text-2xl">
                ACT
              </div>
            </div>
          </div>
        </div>

        {/* Elements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {elements.map((element) => (
            <div
              key={element.id}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-l-4 ${element.color} overflow-hidden`}
              onClick={() => setSelectedElement(element)}
            >
              <div
                className={`bg-gradient-to-r ${getCategoryColor(
                  element.category
                )} p-4`}
              >
                <div className="flex items-center justify-between text-white">
                  <span className="text-sm font-semibold">
                    {getCategoryLabel(element.category)}
                  </span>
                  <span className="text-2xl">{element.icon}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div
                    className={`w-8 h-8 rounded-full ${element.color} text-white flex items-center justify-center font-bold text-sm mr-3`}
                  >
                    {element.id}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 leading-tight">
                    {element.title}
                  </h3>
                </div>

                <div className="mt-4">
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${element.color} text-white`}
                  >
                    Elemen {element.id}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Kategori PDCA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded mr-3"></div>
              <span className="text-sm text-gray-700">
                PLAN - Perencanaan (Elemen 1-4)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded mr-3"></div>
              <span className="text-sm text-gray-700">
                DO - Pelaksanaan (Elemen 5-9)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded mr-3"></div>
              <span className="text-sm text-gray-700">
                CHECK - Pemeriksaan (Elemen 10-11)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded mr-3"></div>
              <span className="text-sm text-gray-700">
                ACT - Tindakan (Elemen 12)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  {
    /* Modal for Element Details */
  }
  {
    selectedElement && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div
            className={`bg-gradient-to-r ${getCategoryColor(
              selectedElement.category
            )} p-6 text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-3">{selectedElement.icon}</span>
                  <span className="text-lg font-semibold">
                    Elemen {selectedElement.id} -{" "}
                    {getCategoryLabel(selectedElement.category)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold">{selectedElement.title}</h2>
              </div>
              <button
                onClick={() => setSelectedElement(null)}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Detail implementasi untuk elemen {selectedElement.id} dalam sistem
              izin kerja selamat. Elemen ini merupakan bagian dari fase{" "}
              {getCategoryLabel(selectedElement.category)}
              dalam siklus PDCA.
            </p>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Kategori:</h4>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${selectedElement.color}`}
              >
                {getCategoryLabel(selectedElement.category)} -{" "}
                {selectedElement.title}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
