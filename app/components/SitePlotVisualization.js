import { useState, useEffect } from 'react';

export default function SitePlotVisualization({ 
  onPointClick, 
  selectedZone, 
  highlightPermitId,
  showOnlyPermits = false 
}) {
  const [visualizationData, setVisualizationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchVisualizationData();
  }, [selectedZone]);

  const fetchVisualizationData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedZone) params.append('zone', selectedZone);
      
      const response = await fetch(`/api/site-plot-visualization?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setVisualizationData(result.data);
      } else {
        console.error('Failed to fetch visualization data:', result.message);
      }
    } catch (error) {
      console.error('Error fetching visualization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePointClick = (point, event) => {
    setSelectedPoint(point);
    if (onPointClick) {
      onPointClick(point);
    }
    
    // Show tooltip
    setTooltipPosition({
      x: event.clientX + 10,
      y: event.clientY - 10
    });
    setShowTooltip(true);
  };

  const hideTooltip = () => {
    setShowTooltip(false);
    setSelectedPoint(null);
  };

  const getPointColor = (point) => {
    if (highlightPermitId && point.id === highlightPermitId) {
      return '#ff0000'; // Highlight color
    }
    
    if (point.type === 'permit') {
      switch (point.status) {
        case 'PENDING': return '#9fc87e';
        case 'APPROVED': return '#075b5e';
        case 'REJECTED': return '#ff3f33';
        case 'EXPIRED': return '#9e9e9e';
        case 'ACTIVE': return '#075b5e';
        default: return '#9fc87e';
      }
    } else {
      // Site plan points
      const zoneColor = visualizationData?.zoneDefinitions[point.zone]?.color;
      return zoneColor || '#757575';
    }
  };

  const getPointSize = (point) => {
    if (highlightPermitId && point.id === highlightPermitId) {
      return 12; // Larger for highlighted
    }
    
    if (point.type === 'permit') {
      switch (point.riskLevel) {
        case 'HIGH': return 10;
        case 'MEDIUM': return 8;
        case 'LOW': return 6;
        default: return 7;
      }
    }
    return 6;
  };

  const formatCoordinates = (coords) => {
    if (!coords) return 'N/A';
    if (coords.x !== undefined && coords.y !== undefined) {
      return `${coords.x}, ${coords.y}`;
    }
    return coords.raw || 'Invalid';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading site plot visualization...</p>
        </div>
      </div>
    );
  }

  if (!visualizationData) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">Failed to load visualization data</p>
      </div>
    );
  }

  const filteredPoints = showOnlyPermits 
    ? visualizationData.allPoints.filter(p => p.type === 'permit')
    : visualizationData.allPoints;

  return (
    <div className="relative">
      {/* Main Visualization Area - Pure Image Only */}
      <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Site Layout Background */}
        <div 
          className="relative w-full h-96 bg-gray-100 cursor-crosshair"
          style={{
            backgroundImage: "url('/images/site-plan-layout.jpeg')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
          onClick={(e) => {
            // Handle click on empty area for coordinate selection
            if (onPointClick && e.target === e.currentTarget) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              
              // Create a temporary point for coordinate selection
              const clickPoint = {
                type: 'coordinate',
                x: Math.round(x * 100) / 100,
                y: Math.round(y * 100) / 100,
                parsedCoordinates: { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 }
              };
              
              onPointClick(clickPoint);
            } else {
              hideTooltip();
            }
          }}
        >
          {/* Empty - No additional elements, pure image only */}
        </div>
      </div>
    </div>
  );
}
