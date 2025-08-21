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
      {/* Statistics Panel */}
        <div className="mb-4 p-4 bg-tertiary rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-primary">{visualizationData.statistics.totalSitePlans}</div>
              <div className="text-quaternary">Site Plans</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-secondary">{visualizationData.statistics.totalPermits}</div>
              <div className="text-quaternary">Permits</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-quaternary">{visualizationData.statistics.totalPoints}</div>
              <div className="text-quaternary">Total Points</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-primary">{visualizationData.statistics.zoneCount}</div>
              <div className="text-quaternary">Active Zones</div>
            </div>
          </div>
        </div>

      {/* Main Visualization Area */}
      <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Site Layout Background */}
        <div 
          className="relative w-full h-96 bg-gray-100"
          style={{
            backgroundImage: "url('/images/layout-orf.png')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
          onClick={hideTooltip}
        >
          {/* Zone Labels Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {Object.entries(visualizationData.zoneDefinitions).map(([zoneCode, zoneDef]) => (
              <div
                key={zoneCode}
                className="absolute text-xs font-semibold text-white bg-black bg-opacity-50 px-2 py-1 rounded"
                style={{
                  // Position zones based on typical layout (you may need to adjust these)
                  top: zoneCode === 'PRC' ? '20%' : 
                       zoneCode === 'UTL' ? '40%' :
                       zoneCode === 'BLD' ? '60%' :
                       zoneCode === 'GMS' ? '30%' :
                       zoneCode === 'CCR' ? '50%' :
                       zoneCode === 'OY' ? '70%' :
                       zoneCode === 'NBL' ? '80%' :
                       zoneCode === 'WS' ? '90%' : '10%',
                  left: zoneCode === 'PRC' ? '10%' :
                        zoneCode === 'UTL' ? '30%' :
                        zoneCode === 'BLD' ? '50%' :
                        zoneCode === 'GMS' ? '70%' :
                        zoneCode === 'CCR' ? '85%' :
                        zoneCode === 'OY' ? '20%' :
                        zoneCode === 'NBL' ? '60%' :
                        zoneCode === 'WS' ? '40%' : '80%'
                }}
              >
                {zoneCode}
              </div>
            ))}
          </div>

          {/* Data Points */}
          {filteredPoints
            .filter(point => point.parsedCoordinates && 
                           point.parsedCoordinates.x !== undefined && 
                           point.parsedCoordinates.y !== undefined)
            .map((point, index) => (
            <div
              key={`${point.type}-${point.id}-${index}`}
              className="absolute cursor-pointer hover:scale-125 transition-transform pointer-events-auto"
              style={{
                left: `${Math.min(Math.max(point.parsedCoordinates.x * 0.8, 2), 95)}%`,
                top: `${Math.min(Math.max(point.parsedCoordinates.y * 0.8, 2), 95)}%`,
                width: getPointSize(point),
                height: getPointSize(point),
                backgroundColor: getPointColor(point),
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                transform: 'translate(-50%, -50%)',
                zIndex: highlightPermitId && point.id === highlightPermitId ? 1000 : 10
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePointClick(point, e);
              }}
              title={`${point.type === 'permit' ? point.permitNumber : point.name} - ${point.zone}`}
            />
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg text-xs max-w-xs">
            <div className="font-semibold mb-2 text-quaternary">Legend</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#075b5e'}}></div>
                <span className="text-quaternary">Active Permit</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#075b5e'}}></div>
                <span className="text-quaternary">Approved</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#9fc87e'}}></div>
                <span className="text-quaternary">Pending</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-quaternary">Site Plan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && selectedPoint && (
        <div 
          className="fixed bg-black text-white p-3 rounded-lg shadow-lg z-50 max-w-sm"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            pointerEvents: 'none'
          }}
        >
          <div className="font-semibold mb-2">
            {selectedPoint.type === 'permit' ? selectedPoint.permitNumber : selectedPoint.name}
          </div>
          <div className="text-sm space-y-1">
            <div><strong>Type:</strong> {selectedPoint.type === 'permit' ? 'Work Permit' : 'Site Plan'}</div>
            <div><strong>Zone:</strong> {selectedPoint.zone}</div>
            <div><strong>Coordinates:</strong> {formatCoordinates(selectedPoint.parsedCoordinates)}</div>
            {selectedPoint.type === 'permit' && (
              <>
                <div><strong>Work Type:</strong> {selectedPoint.workType}</div>
                <div><strong>Risk Level:</strong> {selectedPoint.riskLevel}</div>
                <div><strong>Status:</strong> {selectedPoint.status}</div>
                <div><strong>Valid Until:</strong> {new Date(selectedPoint.validUntil).toLocaleDateString()}</div>
              </>
            )}
            {selectedPoint.description && (
              <div><strong>Description:</strong> {selectedPoint.description}</div>
            )}
          </div>
        </div>
      )}

      {/* Zone Filter Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
        >
          All Zones
        </button>
        {Object.entries(visualizationData.zoneDefinitions).map(([zoneCode, zoneDef]) => {
          const zoneData = visualizationData.byZone[zoneCode];
          return (
            <button
              key={zoneCode}
              onClick={() => fetchVisualizationData()}
              className="px-3 py-1 text-xs rounded text-white hover:opacity-80"
              style={{ backgroundColor: zoneDef.color }}
              title={zoneDef.description}
            >
              {zoneCode} ({zoneData?.total || 0})
            </button>
          );
        })}
      </div>
    </div>
  );
}
