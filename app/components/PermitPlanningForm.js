import { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';
import SitePlotVisualization from './SitePlotVisualization';

export default function PermitPlanningForm({ onSubmitSuccess, editData = null, onCancel }) {
  const [formData, setFormData] = useState({
    workType: '',
    workDescription: '',
    riskLevel: 'LOW',
    zone: '',
    coordinates: '',
    startDate: '',
    endDate: '',
    contractor: '',
    supervisorName: '',
    supervisorContact: '',
    safetyMeasures: '',
    status: 'DRAFT'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Zone definitions
  const zones = [
    { code: 'PRC', name: 'Processing/Production Area' },
    { code: 'UTL', name: 'Utilities Area' },
    { code: 'BLD', name: 'Building/Office Area' },
    { code: 'GMS', name: 'Gas Metering Station' },
    { code: 'CCR', name: 'Central Control Room' },
    { code: 'OY', name: 'Open Yard' },
    { code: 'NBL', name: 'New Building/Laboratory' },
    { code: 'WS', name: 'Workshop/Warehouse' }
  ];

  const workTypes = [
    'HOT_WORK', 'COLD_WORK', 'ELECTRICAL', 'MECHANICAL', 
    'EXCAVATION', 'CONFINED_SPACE', 'HEIGHT_WORK', 'MAINTENANCE'
  ];

  const riskLevels = ['LOW', 'MEDIUM', 'HIGH'];

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        startDate: editData.startDate ? editData.startDate.split('T')[0] : '',
        endDate: editData.endDate ? editData.endDate.split('T')[0] : '',
        coordinates: editData.coordinates || ''
      });
    }
  }, [editData]);

  // Auto-set endDate based on work type and risk level if not already set
  useEffect(() => {
    if (formData.startDate && formData.workType && formData.riskLevel && !formData.endDate) {
      const startDate = new Date(formData.startDate);
      let validDays = 7; // default
      
      // Adjust based on work type and risk level
      if (formData.riskLevel === 'HIGH') validDays = 3;
      else if (formData.riskLevel === 'MEDIUM') validDays = 5;
      
      if (formData.workType === 'HOT_WORK') validDays = Math.min(validDays, 1);
      else if (formData.workType === 'CONFINED_SPACE') validDays = Math.min(validDays, 1);
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + validDays);
      
      setFormData(prev => ({
        ...prev,
        endDate: endDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.startDate, formData.workType, formData.riskLevel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateCoordinates = (coords) => {
    if (!coords) return false;
    
    // Support multiple formats: "x,y", "x;y", or JSON
    if (coords.includes(',') || coords.includes(';')) {
      const separator = coords.includes(',') ? ',' : ';';
      const [x, y] = coords.split(separator);
      const xNum = parseFloat(x?.trim());
      const yNum = parseFloat(y?.trim());
      return !isNaN(xNum) && !isNaN(yNum) && xNum >= 0 && xNum <= 100 && yNum >= 0 && yNum <= 100;
    }
    
    try {
      const parsed = JSON.parse(coords);
      return parsed.x !== undefined && parsed.y !== undefined && 
             !isNaN(parsed.x) && !isNaN(parsed.y);
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Get userId from localStorage for validation
    let userData = null;
    let userId = null;
    
    try {
      userData = JSON.parse(localStorage.getItem('user') || '{}');
      userId = userData.id;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
    
    if (!formData.workType) newErrors.workType = 'Work type is required';
    if (!formData.workDescription) newErrors.workDescription = 'Work description is required';
    if (!formData.zone) newErrors.zone = 'Work location (zone) is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!userId || userId === 'undefined') newErrors.userId = 'User ID is required. Please login again.';
    if (!formData.contractor) newErrors.contractor = 'Contractor is required';
    if (!formData.supervisorName) newErrors.supervisorName = 'Supervisor name is required';
    if (!formData.supervisorContact) newErrors.supervisorContact = 'Supervisor contact is required';
    
    if (formData.coordinates && !validateCoordinates(formData.coordinates)) {
      newErrors.coordinates = 'Invalid coordinates format. Use "x,y" or "x;y" (0-100 range)';
    }
    
    if (formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!userData.id) {
        setErrors({ submit: 'User not logged in. Please login again.' });
        setLoading(false);
        return;
      }
      
      const submitData = {
        ...formData,
        userId: userData.id,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      const url = editData 
        ? `/api/permit-planning/${editData.id}`
        : '/api/permit-planning';
      
      const method = editData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();
      
      if (result.success) {
        if (onSubmitSuccess) {
          onSubmitSuccess(result.data);
        }
        
        if (!editData) {
          // Reset form for new entries
          setFormData({
            workType: '',
            workDescription: '',
            riskLevel: 'LOW',
            zone: '',
            coordinates: '',
            startDate: '',
            endDate: '',
            contractor: '',
            supervisorName: '',
            supervisorContact: '',
            safetyMeasures: '',
            status: 'DRAFT'
          });
        }
        
        setErrors({});
        alert(editData ? 'Permit updated successfully!' : 'Permit created successfully!');
      } else {
        setErrors({ submit: result.message || 'Failed to save permit' });
      }
    } catch (error) {
      console.error('Error submitting permit:', error);
      setErrors({ submit: 'Failed to save permit. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (coordinates) => {
    setFormData(prev => ({
      ...prev,
      coordinates: `${coordinates.x},${coordinates.y}`
    }));
    
    // Show brief success feedback
    if (coordinates.type === 'coordinate') {
      // Create temporary visual feedback
      const successAlert = document.createElement('div');
      successAlert.innerHTML = `<div class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        ✓ Coordinates set: ${coordinates.x.toFixed(1)}, ${coordinates.y.toFixed(1)}
      </div>`;
      document.body.appendChild(successAlert);
      
      setTimeout(() => {
        if (document.body.contains(successAlert)) {
          document.body.removeChild(successAlert);
        }
      }, 2000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-quaternary">
          {editData ? 'Edit Work Permit' : 'Create Work Permit'}
        </h2>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-quaternary mb-1">
              Work Type *
            </label>
            <select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select work type</option>
              {workTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
            {errors.workType && <p className="text-red-500 text-sm mt-1">{errors.workType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-quaternary mb-1">
              Risk Level *
            </label>
            <select
              name="riskLevel"
              value={formData.riskLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              {riskLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Input
            label="Work Description *"
            name="workDescription"
            value={formData.workDescription}
            onChange={handleChange}
            placeholder="Describe the work to be performed"
            multiline
            rows={3}
            error={errors.workDescription}
            required
          />
        </div>

        {/* Location Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-quaternary mb-4">Location Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-quaternary mb-1">
                Work Location (Zone) *
              </label>
              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select work location</option>
                {zones.map(zone => (
                  <option key={zone.code} value={zone.code}>
                    {zone.code} - {zone.name}
                  </option>
                ))}
              </select>
              {errors.zone && <p className="text-red-500 text-sm mt-1">{errors.zone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-quaternary mb-1">
                Coordinates (Optional)
              </label>
              
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium text-primary">Interactive Map Mode</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    📍 Click anywhere on the site layout map below to set work location coordinates
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    💡 The coordinates will be automatically filled when you click on the map
                  </p>
                </div>

                <Input
                  name="coordinates"
                  value={formData.coordinates}
                  onChange={handleChange}
                  placeholder="Click on map below to set coordinates"
                  error={errors.coordinates}
                />
                
                <p className="text-xs text-gray-500">
                  Coordinates will be automatically filled when you click on the site layout map below
                </p>
              </div>
              
              <p className="text-xs text-gray-500 mt-1">
                Format: x,y (range 0-100)
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-quaternary mb-4">Schedule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                label="Start Date *"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                error={errors.startDate}
                required
              />
            </div>

            <div>
              <Input
                label="End Date *"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                error={errors.endDate}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Auto-calculated based on work type and risk level</p>
            </div>
          </div>
        </div>

        {/* Personnel Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-quaternary mb-4">Personnel</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contractor *"
              name="contractor"
              value={formData.contractor}
              onChange={handleChange}
              placeholder="Contractor name or company"
              error={errors.contractor}
              required
            />

            <Input
              label="Supervisor Name *"
              name="supervisorName"
              value={formData.supervisorName}
              onChange={handleChange}
              placeholder="Responsible supervisor"
              error={errors.supervisorName}
              required
            />
          </div>

          <div className="mt-4">
            <Input
              label="Supervisor Contact *"
              name="supervisorContact"
              value={formData.supervisorContact}
              onChange={handleChange}
              placeholder="Phone number or email"
              error={errors.supervisorContact}
              required
            />
          </div>
        </div>

        {/* Safety Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-quaternary mb-4">Safety Information</h3>
          
          <div className="space-y-4">
            <Input
              label="Equipment Needed"
              name="equipmentNeeded"
              value={formData.equipmentNeeded}
              onChange={handleChange}
              placeholder="List required equipment and tools"
              multiline
              rows={2}
            />

            <Input
              label="Safety Measures"
              name="safetyMeasures"
              value={formData.safetyMeasures}
              onChange={handleChange}
              placeholder="Describe safety precautions and procedures"
              multiline
              rows={3}
            />

            <Input
              label="Emergency Procedure"
              name="emergencyProcedure"
              value={formData.emergencyProcedure}
              onChange={handleChange}
              placeholder="Emergency contact and procedures"
              multiline
              rows={2}
            />
          </div>
        </div>

        {/* Error Display */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {errors.userId && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{errors.userId}</p>
          </div>
        )}

        {/* Interactive Site Visualization */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-quaternary mb-4">
            🗺️ Site Location Map - Click to Set Coordinates
          </h3>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
            <p className="text-sm text-amber-800 font-medium mb-1">
              📌 How to set coordinates:
            </p>
            <p className="text-xs text-amber-700">
              1. Click anywhere on the site layout image below<br/>
              2. Your coordinates will be automatically filled above<br/>
              3. You can click multiple times to adjust the location
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
            <SitePlotVisualization
              onPointClick={handleMapClick}
              selectedZone={formData.zone}
              showOnlyPermits={false}
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editData ? 'Update Permit' : 'Create Permit')}
          </Button>
          
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
