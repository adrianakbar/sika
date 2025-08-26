import { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";
import SitePlotVisualization from "./SitePlotVisualization";

export default function PermitPlanningForm({
  onSubmitSuccess,
  editData = null,
  onCancel,
  showNotification,
}) {
  const [formData, setFormData] = useState({
    permitNumber: "",
    workType: "",
    workDescription: "",
    riskLevel: "LOW",
    zone: "",
    coordinates: "",
    startDate: "",
    endDate: "",
    personalAuthority: "",
    company: "",
    areaAuthority: "",
    siteControllerName: "",
    safetyMeasures: "",
    emergencyProcedure: "",
    status: "DRAFT",
    relatedDocuments: {
      l2ra: { checked: false, number: "" },
      confineSpace: { checked: false, number: "" },
      tkiTko: { checked: false, number: "" },
      other: { checked: false, number: "" },
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Zone definitions
  const zones = [
    { code: "PRC", name: "Processing/Production Area" },
    { code: "UTL", name: "Utilities Area" },
    { code: "BLD", name: "Building/Office Area" },
    { code: "GMS", name: "Gas Metering Station" },
    { code: "CCR", name: "Central Control Room" },
    { code: "OY", name: "Open Yard" },
    { code: "NBL", name: "New Building" },
    { code: "WS", name: "Workshop/Warehouse" },
  ];

  const workTypes = [
    { value: "COLD_WORK", label: "Cold Work", color: "blue" },
    {
      value: "COLD_WORK_BREAKING",
      label: "Cold Work - breaking containment",
      color: "black",
    },
    {
      value: "HOT_WORK_SPARK",
      label: "Hot work - spark potential",
      color: "yellow",
    },
    { value: "HOT_WORK_FLAME", label: "Hot work - naked flame", color: "red" },
  ];

  const riskLevels = ["LOW", "MEDIUM", "HIGH"];

  useEffect(() => {
    if (editData) {
      console.log("Edit data received:", editData);

      // Parse relatedDocuments if it's a string (from database)
      let parsedRelatedDocuments = {
        l2ra: { checked: false, number: "" },
        confineSpace: { checked: false, number: "" },
        tkiTko: { checked: false, number: "" },
        other: { checked: false, number: "" },
      };

      if (editData.relatedDocuments) {
        try {
          if (typeof editData.relatedDocuments === "string") {
            parsedRelatedDocuments = JSON.parse(editData.relatedDocuments);
          } else {
            parsedRelatedDocuments = editData.relatedDocuments;
          }
          console.log("Parsed relatedDocuments:", parsedRelatedDocuments);
        } catch (error) {
          console.error("Error parsing relatedDocuments:", error);
          // Use default values if parsing fails
        }
      }

      setFormData({
        ...editData,
        startDate: editData.startDate ? editData.startDate.split("T")[0] : "",
        endDate: editData.endDate ? editData.endDate.split("T")[0] : "",
        coordinates: editData.coordinates || "",
        personalAuthority: editData.personalAuthority || "",
        company: editData.company || "",
        areaAuthority: editData.areaAuthority || "",
        siteControllerName: editData.siteControllerName || "",
        safetyMeasures: editData.safetyMeasures || "",
        emergencyProcedure: editData.emergencyProcedure || "",
        relatedDocuments: parsedRelatedDocuments,
      });

      console.log("Form data set for editing");
    }
  }, [editData]);

  // Auto-set endDate based on work type and risk level if not already set
  useEffect(() => {
    if (
      formData.startDate &&
      formData.workType &&
      formData.riskLevel &&
      !formData.endDate
    ) {
      const startDate = new Date(formData.startDate);
      let validDays = 7; // default

      // Adjust based on work type and risk level
      if (formData.riskLevel === "HIGH") validDays = 3;
      else if (formData.riskLevel === "MEDIUM") validDays = 5;

      if (
        formData.workType === "HOT_WORK_SPARK" ||
        formData.workType === "HOT_WORK_FLAME"
      )
        validDays = Math.min(validDays, 1);
      else if (formData.workType === "COLD_WORK_BREAKING")
        validDays = Math.min(validDays, 1);

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + validDays);

      setFormData((prev) => ({
        ...prev,
        endDate: endDate.toISOString().split("T")[0],
      }));
    }
  }, [formData.startDate, formData.workType, formData.riskLevel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRelatedDocumentChange = (docType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      relatedDocuments: {
        ...prev.relatedDocuments,
        [docType]: {
          ...prev.relatedDocuments[docType],
          [field]: value,
        },
      },
    }));
  };

  const validateCoordinates = (coords) => {
    if (!coords) return false;

    // Support multiple formats: "x,y", "x;y", or JSON
    if (coords.includes(",") || coords.includes(";")) {
      const separator = coords.includes(",") ? "," : ";";
      const [x, y] = coords.split(separator);
      const xNum = parseFloat(x?.trim());
      const yNum = parseFloat(y?.trim());
      return (
        !isNaN(xNum) &&
        !isNaN(yNum) &&
        xNum >= 0 &&
        xNum <= 100 &&
        yNum >= 0 &&
        yNum <= 100
      );
    }

    try {
      const parsed = JSON.parse(coords);
      return (
        parsed.x !== undefined &&
        parsed.y !== undefined &&
        !isNaN(parsed.x) &&
        !isNaN(parsed.y)
      );
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
      userData = JSON.parse(localStorage.getItem("user") || "{}");
      userId = userData.id;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }

    if (!formData.permitNumber) newErrors.permitNumber = "Permit number is required";
    if (!formData.workType) newErrors.workType = "Work type is required";
    if (!formData.workDescription)
      newErrors.workDescription = "Work description is required";
    if (!formData.zone) newErrors.zone = "Work location (zone) is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!userId || userId === "undefined")
      newErrors.userId = "User ID is required. Please login again.";
    if (!formData.personalAuthority)
      newErrors.personalAuthority = "Personal Authority is required";
    if (!formData.company) newErrors.company = "Company is required";
    if (!formData.areaAuthority)
      newErrors.areaAuthority = "Area Authority is required";
    if (!formData.siteControllerName)
      newErrors.siteControllerName = "Site Controller name is required";

    if (formData.coordinates && !validateCoordinates(formData.coordinates)) {
      newErrors.coordinates =
        'Invalid coordinates format. Use "x,y" or "x;y" (0-100 range)';
    }

    if (
      formData.endDate &&
      formData.startDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    // Validate related documents - if checked, number/title is required
    Object.keys(formData.relatedDocuments).forEach((docType) => {
      const doc = formData.relatedDocuments[docType];
      if (doc.checked && !doc.number.trim()) {
        newErrors[`relatedDocuments.${docType}`] =
          "Document number/title is required when checked";
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log("Validation errors:", validationErrors);
      return;
    }

    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      if (!userData.id) {
        setErrors({ submit: "User not logged in. Please login again." });
        setLoading(false);
        return;
      }

      const submitData = {
        ...formData,
        userId: userData.id,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      console.log("Submitting data:", submitData);

      const url = editData
        ? `/api/permit-planning/${editData.id}`
        : "/api/permit-planning";

      const method = editData ? "PUT" : "POST";

      console.log(`Making ${method} request to ${url}`);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();
      console.log("Response:", result);

      if (result.success) {
        if (onSubmitSuccess) {
          onSubmitSuccess(result.data);
        }

        if (!editData) {
          // Reset form for new entries
          setFormData({
            permitNumber: "",
            workType: "",
            workDescription: "",
            riskLevel: "LOW",
            zone: "",
            coordinates: "",
            startDate: "",
            endDate: "",
            personalAuthority: "",
            company: "",
            areaAuthority: "",
            siteControllerName: "",
            safetyMeasures: "",
            emergencyProcedure: "",
            status: "DRAFT",
            relatedDocuments: {
              l2ra: { checked: false, number: "" },
              confineSpace: { checked: false, number: "" },
              tkiTko: { checked: false, number: "" },
              other: { checked: false, number: "" },
            },
          });
        }

        setErrors({});
      } else {
        console.error("Submission failed:", result);
        setErrors({ submit: result.message || "Failed to save permit" });
      }
    } catch (error) {
      console.error("Error submitting permit:", error);
      setErrors({ submit: "Failed to save permit. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (coordinates) => {
    setFormData((prev) => ({
      ...prev,
      coordinates: `${coordinates.x},${coordinates.y}`,
    }));

    // Show brief success feedback using notification system
    if (coordinates.type === "coordinate" && showNotification) {
      showNotification(
        `✓ Coordinates set: ${coordinates.x.toFixed(
          1
        )}, ${coordinates.y.toFixed(1)}`,
        "success"
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-quaternary">
          {editData ? "Edit Work Permit" : "Create Work Permit"}
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
              Work Permit Type *
            </label>
            <select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select Work Permit Type</option>
              {workTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} (pin {type.color})
                </option>
              ))}
            </select>
            {errors.workType && (
              <p className="text-red-500 text-sm mt-1">{errors.workType}</p>
            )}
          </div>

          <Input
            label="Permit Number *"
            name="permitNumber"
            value={formData.permitNumber}
            onChange={handleChange}
            placeholder="Enter unique permit number (e.g., WP-2025-001)"
            error={errors.permitNumber}
            required
          />

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
              {riskLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
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

        {/* Related Documents Permit */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-quaternary mb-4">
            Related Documents Permit
          </h3>

          <div className="space-y-4">
            {/* L2RA */}
            <div className="flex items-start gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="l2ra"
                  checked={formData.relatedDocuments.l2ra.checked}
                  onChange={(e) =>
                    handleRelatedDocumentChange(
                      "l2ra",
                      "checked",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="l2ra"
                  className="block text-sm font-medium text-quaternary mb-1 cursor-pointer"
                >
                  L2RA
                </label>
                {formData.relatedDocuments.l2ra.checked && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter L2RA document number/title"
                      value={formData.relatedDocuments.l2ra.number}
                      onChange={(e) =>
                        handleRelatedDocumentChange(
                          "l2ra",
                          "number",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {errors["relatedDocuments.l2ra"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors["relatedDocuments.l2ra"]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Confine Space Entry Certificate */}
            <div className="flex items-start gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="confineSpace"
                  checked={formData.relatedDocuments.confineSpace.checked}
                  onChange={(e) =>
                    handleRelatedDocumentChange(
                      "confineSpace",
                      "checked",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="confineSpace"
                  className="block text-sm font-medium text-quaternary mb-1 cursor-pointer"
                >
                  Confine Space Entry Certificate
                </label>
                {formData.relatedDocuments.confineSpace.checked && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter certificate number/title"
                      value={formData.relatedDocuments.confineSpace.number}
                      onChange={(e) =>
                        handleRelatedDocumentChange(
                          "confineSpace",
                          "number",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {errors["relatedDocuments.confineSpace"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors["relatedDocuments.confineSpace"]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* TKI / TKO */}
            <div className="flex items-start gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="tkiTko"
                  checked={formData.relatedDocuments.tkiTko.checked}
                  onChange={(e) =>
                    handleRelatedDocumentChange(
                      "tkiTko",
                      "checked",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="tkiTko"
                  className="block text-sm font-medium text-quaternary mb-1 cursor-pointer"
                >
                  TKI / TKO
                </label>
                {formData.relatedDocuments.tkiTko.checked && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter TKI/TKO document number/title"
                      value={formData.relatedDocuments.tkiTko.number}
                      onChange={(e) =>
                        handleRelatedDocumentChange(
                          "tkiTko",
                          "number",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {errors["relatedDocuments.tkiTko"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors["relatedDocuments.tkiTko"]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Other */}
            <div className="flex items-start gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="other"
                  checked={formData.relatedDocuments.other.checked}
                  onChange={(e) =>
                    handleRelatedDocumentChange(
                      "other",
                      "checked",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="other"
                  className="block text-sm font-medium text-quaternary mb-1 cursor-pointer"
                >
                  Other
                </label>
                {formData.relatedDocuments.other.checked && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter other document number/title"
                      value={formData.relatedDocuments.other.number}
                      onChange={(e) =>
                        handleRelatedDocumentChange(
                          "other",
                          "number",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {errors["relatedDocuments.other"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors["relatedDocuments.other"]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-quaternary mb-4">
            Location Information
          </h3>

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
                {zones.map((zone) => (
                  <option key={zone.code} value={zone.code}>
                    {zone.code} - {zone.name}
                  </option>
                ))}
              </select>
              {errors.zone && (
                <p className="text-red-500 text-sm mt-1">{errors.zone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-quaternary mb-1">
                Coordinates (Optional)
              </label>

              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium text-primary">
                      Interactive Map Mode
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    📍 Click anywhere on the site layout map below to set work
                    location coordinates
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    💡 The coordinates will be automatically filled when you
                    click on the map
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
                  Coordinates will be automatically filled when you click on the
                  site layout map below
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
          <h3 className="text-lg font-semibold text-quaternary mb-4">
            Schedule
          </h3>

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
            </div>
          </div>
        </div>

        {/* Personnel Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-quaternary mb-4">
            Personnel
          </h3>

          {/* First row: Personal Authority, Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Personal Authority *"
              name="personalAuthority"
              value={formData.personalAuthority}
              onChange={handleChange}
              placeholder="Personal authority"
              error={errors.personalAuthority}
              required
            />

            <Input
              label="Company *"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company name"
              error={errors.company}
              required
            />
          </div>

          {/* Second row: Site Controller Name, Area Authority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Site Controller Name *"
              name="siteControllerName"
              value={formData.siteControllerName}
              onChange={handleChange}
              placeholder="Site controller name"
              error={errors.siteControllerName}
              required
            />

            <Input
              label="Area Authority *"
              name="areaAuthority"
              value={formData.areaAuthority}
              onChange={handleChange}
              placeholder="Area authority"
              error={errors.areaAuthority}
              required
            />
          </div>
        </div>

        {/* Safety Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-quaternary mb-4">
            Safety Information
          </h3>

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
              1. Click anywhere on the site layout image below
              <br />
              2. Your coordinates will be automatically filled above
              <br />
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
            {loading
              ? "Saving..."
              : editData
              ? "Update Permit"
              : "Create Permit"}
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
