"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function SitePlotPlans() {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [plotPoints, setPlotPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      // Fetch only permit planning data
      const permitResponse = await fetch(
        `/api/permit-planning?userId=${userData.id}`
      );
      const permitResult = await permitResponse.json();

      if (permitResult.success) {
        // Convert permit data to plot points format
        const convertedPermits = permitResult.data.map((permit) => {
          const coords = parseCoordinates(permit.coordinates, permit.zone);

          return {
            id: permit.id,
            x: coords.x,
            y: coords.y,
            type: getPermitTypeCode(permit.workType),
            status: permit.status.toLowerCase(),
            permitNumber: permit.permitNumber,
            location: permit.workLocation,
            description: permit.workDescription,
            startTime: new Date(permit.startDate).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            endTime: new Date(permit.endDate).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            supervisor: permit.supervisor || "N/A",
            zone: permit.zone,
            contractor: permit.contractor,
            riskLevel: permit.riskLevel,
          };
        });

        setPlotPoints(convertedPermits);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getZoneCoordinates = (zone) => {
    // Berdasarkan layout gambar site plan yang diberikan
    const zoneAreas = {
      PRC: {
        // Processing Area - Area merah di kanan
        minX: 50,
        maxX: 85,
        minY: 15,
        maxY: 65,
      },
      UTL: {
        // Utilities - Area orange di atas tengah
        minX: 25,
        maxX: 50,
        minY: 10,
        maxY: 25,
      },
      BLD: {
        // Building - Area kuning di kiri atas
        minX: 5,
        maxX: 25,
        minY: 15,
        maxY: 40,
      },
      GMS: {
        // Gas Metering Station - Area abu-abu di tengah
        minX: 45,
        maxX: 55,
        minY: 25,
        maxY: 35,
      },
      CCR: {
        // Central Control Room - Area biru di tengah
        minX: 30,
        maxX: 45,
        minY: 20,
        maxY: 35,
      },
      OY: {
        // Open Yard - Area hijau besar di bawah
        minX: 25,
        maxX: 75,
        minY: 40,
        maxY: 75,
      },
      NBL: {
        // New Building/Laboratory - Area hijau di kanan bawah
        minX: 60,
        maxX: 80,
        minY: 50,
        maxY: 70,
      },
      WS: {
        // Workshop/Warehouse - Area hijau di kiri bawah
        minX: 5,
        maxX: 35,
        minY: 60,
        maxY: 85,
      },
    };

    const area = zoneAreas[zone];
    if (!area) {
      // Default area jika zona tidak dikenal
      return {
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      };
    }

    // Generate koordinat random dalam area zona
    return {
      x: Math.random() * (area.maxX - area.minX) + area.minX,
      y: Math.random() * (area.maxY - area.minY) + area.minY,
    };
  };

  const parseCoordinates = (coordinates, zone = null) => {
    if (!coordinates) {
      // Jika tidak ada koordinat, generate berdasarkan zona
      if (zone) {
        return getZoneCoordinates(zone);
      }
      return {
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      };
    }

    try {
      // Try parsing as JSON first
      const parsed = JSON.parse(coordinates);
      if (parsed.x !== undefined && parsed.y !== undefined) {
        return parsed;
      }
    } catch {
      // Try parsing as string format "x,y" or "x;y"
      if (coordinates.includes(",")) {
        const [x, y] = coordinates.split(",");
        const parsedX = parseFloat(x);
        const parsedY = parseFloat(y);
        if (!isNaN(parsedX) && !isNaN(parsedY)) {
          return { x: parsedX, y: parsedY };
        }
      } else if (coordinates.includes(";")) {
        const [x, y] = coordinates.split(";");
        const parsedX = parseFloat(x);
        const parsedY = parseFloat(y);
        if (!isNaN(parsedX) && !isNaN(parsedY)) {
          return { x: parsedX, y: parsedY };
        }
      }
    }

    // Fallback: generate based on zone
    if (zone) {
      return getZoneCoordinates(zone);
    }

    return {
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    };
  };

  const getPermitTypeCode = (workType) => {
    const typeMap = {
      HOT_WORK: "HW-SP",
      COLD_WORK: "CW",
      ELECTRICAL: "CW",
      MECHANICAL: "CW",
      EXCAVATION: "CW-BC",
      CONFINED_SPACE: "HW-SP",
      HEIGHT_WORK: "CW-BC",
      MAINTENANCE: "CW",
    };
    return typeMap[workType] || "CW";
  };

  const getPointColor = (type, status) => {
    if (status === "completed") return "#6B7280"; // gray
    if (status === "pending") return "#F59E0B"; // amber

    switch (type) {
      case "HW-NF":
        return "#EF4444"; // red
      case "HW-SP":
        return "#F59E0B"; // yellow/amber
      case "CW":
        return "#3B82F6"; // blue
      case "CW-BC":
        return "#1F2937"; // black
      default:
        return "#6B7280";
    }
  };

  const getFilteredPoints = () => {
    let filtered = plotPoints;

    if (selectedFilter !== "all") {
      filtered = filtered.filter((point) => point.type === selectedFilter);
    }

    if (selectedArea !== "all") {
      filtered = filtered.filter((point) => point.area === selectedArea);
    }

    return filtered;
  };

  const handlePointClick = (point) => {
    setSelectedPoint(point);
  };

  const filterOptions = [
    { value: "all", label: "Semua", color: "#6B7280" },
    { value: "HW-NF", label: "HW - NF", color: "#EF4444" },
    { value: "HW-SP", label: "HW - SP", color: "#F59E0B" },
    { value: "CW", label: "CW", color: "#3B82F6" },
    { value: "CW-BC", label: "CW - BC", color: "#1F2937" },
  ];

  const areaOptions = [
    { value: "all", label: "Semua Area", color: "#6B7280" },
    { value: "PRC", label: "PRC", color: "#EF4444" },
    { value: "UTL", label: "UTL", color: "#F97316" },
    { value: "BLD", label: "BLD", color: "#EAB308" },
    { value: "OY", label: "OY", color: "#22C55E" },
    { value: "NBL", label: "NBL", color: "#16A34A" },
    { value: "CCR", label: "CCR", color: "#3B82F6" },
    { value: "WS", label: "WS", color: "#06B6D4" },
    { value: "GMS", label: "GMS", color: "#8B5CF6" },
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
       
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading site plot plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-quaternary">
                Site Plot Plans
              </h1>
              <p className="text-gray-600">
                Visualisasi lokasi kerja dan permit planning
              </p>
            </div>
            <h1 className="text-3xl font-bold text-quaternary hidden lg:block">
              Site Plot Plans
            </h1>
            <p className="text-gray-600 mt-2">ORF PHE WMO</p>
            <div className="mt-2">
              <a
                href="/permit-planning"
                className="text-primary hover:text-red-600 text-sm font-medium"
              >
                → Work Permit Planning
              </a>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">1-10 Juli 2025</div>
            <div className="text-sm text-gray-500">History Permit</div>
            <div className="mt-2">
              <span className="text-xs text-gray-500">Total Permit</span>
              <div className="text-4xl font-bold text-quaternary">
                {loading ? "..." : plotPoints.length}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Legend */}
        <div className="space-y-4">
          {/* Work Type Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Filter by Work Type:
            </h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFilter(option.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all ${
                    selectedFilter === option.value
                      ? "bg-quaternary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
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
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Filter by Area:
            </h3>
            <div className="flex flex-wrap gap-2">
              {areaOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedArea(option.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all ${
                    selectedArea === option.value
                      ? "bg-quaternary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
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
            <h2 className="text-xl font-semibold text-quaternary mb-4">
              Layout Denah
            </h2>
            <div className="relative w-full">
              <div className="relative inline-block w-full">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src="/images/layout-orf.png"
                    alt="Site Plot Plan Layout"
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg border"
                    priority
                  />

                  {/* Plot Points Overlay */}
                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">
                          Loading permits...
                        </p>
                      </div>
                    </div>
                  ) : (
                    getFilteredPoints().map((point) => (
                      <button
                        key={point.id}
                        onClick={() => handlePointClick(point)}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all hover:scale-150 ${
                          selectedPoint?.id === point.id
                            ? "scale-150 ring-4 ring-blue-200"
                            : ""
                        }`}
                        style={{
                          left: `${point.x}%`,
                          top: `${point.y}%`,
                          backgroundColor: getPointColor(
                            point.type,
                            point.status
                          ),
                        }}
                        title={`${point.permitNumber} - ${point.location}`}
                      ></button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="space-y-4">
            {/* Permit Details */}
            {selectedPoint ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-quaternary mb-4">
                  Detail Permit
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      No. Permit
                    </label>
                    <div className="text-lg font-semibold">
                      {selectedPoint.permitNumber}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Tipe
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: getPointColor(
                            selectedPoint.type,
                            selectedPoint.status
                          ),
                        }}
                      ></div>
                      <span className="font-medium">{selectedPoint.type}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Area
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            areaOptions.find(
                              (a) => a.value === selectedPoint.area
                            )?.color || "#6B7280",
                        }}
                      ></div>
                      <span className="font-medium">{selectedPoint.area}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Tanggal
                    </label>
                    <div className="font-medium">{selectedPoint.date}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <div
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        selectedPoint.status === "active"
                          ? "bg-green-100 text-green-800"
                          : selectedPoint.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedPoint.status === "active"
                        ? "Aktif"
                        : selectedPoint.status === "pending"
                        ? "Menunggu"
                        : "Selesai"}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Lokasi
                    </label>
                    <div className="font-medium">{selectedPoint.location}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Deskripsi Pekerjaan
                    </label>
                    <div className="text-sm">{selectedPoint.description}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Waktu
                    </label>
                    <div className="text-sm">
                      {selectedPoint.startTime} - {selectedPoint.endTime}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Supervisor
                    </label>
                    <div className="font-medium">
                      {selectedPoint.supervisor}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-quaternary mb-4">
                  Detail Permit
                </h3>
                <div className="text-center text-gray-500 py-8">
                  Klik pada titik di denah untuk melihat detail permit
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-quaternary mb-4">
                Statistik Permit
              </h3>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Permit</span>
                    <span className="font-semibold">
                      {getFilteredPoints().length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Hot Work</span>
                    <span className="font-semibold text-red-600">
                      {
                        getFilteredPoints().filter((p) =>
                          p.type.startsWith("HW")
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cold Work</span>
                    <span className="font-semibold text-blue-600">
                      {
                        getFilteredPoints().filter((p) =>
                          p.type.startsWith("CW")
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Selesai</span>
                    <span className="font-semibold text-green-600">
                      {
                        getFilteredPoints().filter(
                          (p) => p.status === "completed"
                        ).length
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
