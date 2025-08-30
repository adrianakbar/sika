import { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";
import SitePlotVisualization from "./SitePlotVisualization";
import NotificationToast from "./NotificationToast";

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
    workLocation: "", // Add workLocation field
    riskLevel: "LOW",
    zone: "",
    coordinates: "",
    startDate: "",
    endDate: "",
    performingAuthority: "",
    company: "",
    areaAuthority: "",
    siteControllerName: "",
    safetyMeasures: "",
    ppeRequired: "", // Change from equipmentNeeded to ppeRequired
    emergencyContact: "", // Change from emergencyProcedure to emergencyContact
    status: "DRAFT",
    relatedDocuments: {
      jsa: { checked: false, number: "" },
      ra: { checked: false, number: "" },
      csep: { checked: false, number: "" },
      icc: { checked: false, number: "" },
      tkiTko: { checked: false, number: "" },
      other: { checked: false, number: "" },
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submittingForApproval, setSubmittingForApproval] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

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
    { value: "COLD_WORK", label: "General Work", color: "blue" },
    {
      value: "COLD_WORK_BREAKING",
      label: "Breaking Containment",
      color: "black",
    },
    {
      value: "HOT_WORK_SPARK",
      label: "Critical Work",
      color: "yellow",
    },
    { value: "HOT_WORK_FLAME", label: "Hot Work", color: "red" },
  ];

  const riskLevels = ["LOW", "MEDIUM", "HIGH"];

  // Function to normalize coordinates to "x,y" format
  const normalizeCoordinates = (coords) => {
    if (!coords) return "";
    
    // If already in "x,y" or "x;y" format, convert to "x,y"
    if (typeof coords === "string") {
      if (coords.includes(",") || coords.includes(";")) {
        const separator = coords.includes(",") ? "," : ";";
        const [x, y] = coords.split(separator);
        const xNum = parseFloat(x?.trim());
        const yNum = parseFloat(y?.trim());
        if (!isNaN(xNum) && !isNaN(yNum)) {
          return `${xNum},${yNum}`;
        }
      }
      
      // Try to parse as JSON
      try {
        const parsed = JSON.parse(coords);
        if (parsed.x !== undefined && parsed.y !== undefined) {
          return `${parsed.x},${parsed.y}`;
        }
      } catch {
        // Not JSON, return as is
        return coords;
      }
    }
    
    // If it's an object with x,y properties
    if (typeof coords === "object" && coords.x !== undefined && coords.y !== undefined) {
      return `${coords.x},${coords.y}`;
    }
    
    return "";
  };

  useEffect(() => {
    if (editData) {
      console.log("Edit data received:", editData);

      // Parse relatedDocuments if it's a string (from database)
      let parsedRelatedDocuments = {
        jsa: { checked: false, number: "" },
        ra: { checked: false, number: "" },
        csep: { checked: false, number: "" },
        icc: { checked: false, number: "" },
        tkiTko: { checked: false, number: "" },
        other: { checked: false, number: "" },
      };

      if (editData.relatedDocuments) {
        try {
          let rawData;
          if (typeof editData.relatedDocuments === "string") {
            rawData = JSON.parse(editData.relatedDocuments);
          } else {
            rawData = editData.relatedDocuments;
          }
          
          // Handle backward compatibility - map old field names to new ones
          const fieldMapping = {
            'l2ra': 'ra', // L2RA becomes Risk Assessment (RA)
            'confineSpace': 'csep' // confineSpace becomes CSEP
          };
          
          // Map old data to new structure
          Object.keys(rawData).forEach(key => {
            const newKey = fieldMapping[key] || key;
            if (parsedRelatedDocuments[newKey] !== undefined) {
              parsedRelatedDocuments[newKey] = rawData[key];
            }
          });
          
          console.log("Parsed relatedDocuments:", parsedRelatedDocuments);
        } catch (error) {
          console.error("Error parsing relatedDocuments:", error);
          // Use default values if parsing fails
        }
      }

      setFormData({
        ...editData,
        permitNumber: editData.permitNumber || "",
        workType: editData.workType || "",
        workDescription: editData.workDescription || "",
        workLocation: editData.workLocation || "",
        riskLevel: editData.riskLevel || "LOW",
        zone: editData.zone || "",
        startDate: editData.startDate ? editData.startDate.split("T")[0] : "",
        endDate: editData.endDate ? editData.endDate.split("T")[0] : "",
        coordinates: normalizeCoordinates(editData.coordinates),
        performingAuthority: editData.performingAuthority || "",
        company: editData.company || "",
        areaAuthority: editData.areaAuthority || "",
        siteControllerName: editData.siteControllerName || "",
        safetyMeasures: editData.safetyMeasures || "",
        ppeRequired: editData.ppeRequired || editData.equipmentNeeded || "",
        emergencyContact: editData.emergencyContact || editData.emergencyProcedure || "",
        status: editData.status || "DRAFT",
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
    if (!formData.performingAuthority)
      newErrors.performingAuthority = "Performing Authority is required";
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
            workLocation: "",
            riskLevel: "LOW",
            zone: "",
            coordinates: "",
            startDate: "",
            endDate: "",
            performingAuthority: "",
            company: "",
            areaAuthority: "",
            siteControllerName: "",
            safetyMeasures: "",
            ppeRequired: "",
            emergencyContact: "",
            status: "DRAFT",
            relatedDocuments: {
              jsa: { checked: false, number: "" },
              ra: { checked: false, number: "" },
              csep: { checked: false, number: "" },
              icc: { checked: false, number: "" },
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

  // Submit permit for approval
  const handleSubmitForApproval = async (permitId) => {
    setSubmittingForApproval(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        setErrors({ submit: "User not logged in. Please login again." });
        return;
      }

      const response = await fetch(`/api/permit-planning/${permitId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const result = await response.json();

      if (result.success) {
        setNotification({
          show: true,
          message: "Permit submitted for AA approval successfully!",
          type: "success"
        });
        if (onSubmitSuccess) {
          onSubmitSuccess(result.data);
        }
      } else {
        setErrors({ submit: result.message || "Failed to submit permit for approval" });
      }
    } catch (error) {
      console.error("Error submitting permit for approval:", error);
      setErrors({ submit: "Failed to submit permit for approval. Please try again." });
    } finally {
      setSubmittingForApproval(false);
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
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-quaternary flex items-center">
          <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {editData ? "Edit Work Permit" : "Create New Work Permit"}
        </h2>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-quaternary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Basic Information
          </h3>
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

        <div>
          <Input
            label="Work Location Description"
            name="workLocation"
            value={formData.workLocation}
            onChange={handleChange}
            placeholder="Detailed location description (e.g., Unit 1 Compressor Room, Near Tank 101)"
            error={errors.workLocation}
          />
        </div>
      </div>

        {/* Related Documents Permit */}
        <div className="bg-tertiary/30 p-6 rounded-xl border border-primary/20">
          <h3 className="text-lg font-semibold text-quaternary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Related Documents Permit
          </h3>

          <div className="space-y-4">
            {/* Job Safety Analysis (JSA) */}
            <div className="flex items-start gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="jsa"
                  checked={formData.relatedDocuments.jsa.checked}
                  onChange={(e) =>
                    handleRelatedDocumentChange(
                      "jsa",
                      "checked",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="jsa"
                  className="block text-sm font-medium text-quaternary mb-1 cursor-pointer"
                >
                  Job Safety Analysis (JSA)
                </label>
                {formData.relatedDocuments.jsa.checked && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter JSA document number/title"
                      value={formData.relatedDocuments.jsa.number}
                      onChange={(e) =>
                        handleRelatedDocumentChange(
                          "jsa",
                          "number",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {errors["relatedDocuments.jsa"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors["relatedDocuments.jsa"]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Risk Assessment (RA) */}
            <div className="flex items-start gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ra"
                  checked={formData.relatedDocuments.ra.checked}
                  onChange={(e) =>
                    handleRelatedDocumentChange(
                      "ra",
                      "checked",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="ra"
                  className="block text-sm font-medium text-quaternary mb-1 cursor-pointer"
                >
                  Risk Assessment (RA)
                </label>
                {formData.relatedDocuments.ra.checked && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter RA document number/title"
                      value={formData.relatedDocuments.ra.number}
                      onChange={(e) =>
                        handleRelatedDocumentChange(
                          "ra",
                          "number",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {errors["relatedDocuments.ra"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors["relatedDocuments.ra"]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Confined Space Entry Permit (CSEP) */}
            <div className="flex items-start gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="csep"
                  checked={formData.relatedDocuments.csep.checked}
                  onChange={(e) =>
                    handleRelatedDocumentChange(
                      "csep",
                      "checked",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="csep"
                  className="block text-sm font-medium text-quaternary mb-1 cursor-pointer"
                >
                  Confined Space Entry Permit (CSEP)
                </label>
                {formData.relatedDocuments.csep.checked && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter CSEP document number/title"
                      value={formData.relatedDocuments.csep.number}
                      onChange={(e) =>
                        handleRelatedDocumentChange(
                          "csep",
                          "number",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {errors["relatedDocuments.csep"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors["relatedDocuments.csep"]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Isolation Confirmation Certificate (ICC) */}
            <div className="flex items-start gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="icc"
                  checked={formData.relatedDocuments.icc.checked}
                  onChange={(e) =>
                    handleRelatedDocumentChange(
                      "icc",
                      "checked",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="icc"
                  className="block text-sm font-medium text-quaternary mb-1 cursor-pointer"
                >
                  Isolation Confirmation Certificate (ICC)
                </label>
                {formData.relatedDocuments.icc.checked && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter ICC document number/title"
                      value={formData.relatedDocuments.icc.number}
                      onChange={(e) =>
                        handleRelatedDocumentChange(
                          "icc",
                          "number",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {errors["relatedDocuments.icc"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors["relatedDocuments.icc"]}
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
        <div className="bg-secondary/10 p-6 rounded-xl border border-secondary/30">
          <h3 className="text-lg font-semibold text-quaternary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
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
        <div className="bg-quaternary/10 p-6 rounded-xl border border-quaternary/30">
          <h3 className="text-lg font-semibold text-quaternary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
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
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-quaternary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Personnel
          </h3>

          {/* First row: Performing Authority, Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Performing Authority *"
              name="performingAuthority"
              value={formData.performingAuthority}
              onChange={handleChange}
              placeholder="Performing authority"
              error={errors.performingAuthority}
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
        <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
          <h3 className="text-lg font-semibold text-quaternary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Safety Information
          </h3>

          <div className="space-y-4">
            <Input
              label="PPE Required / Equipment Needed"
              name="ppeRequired"
              value={formData.ppeRequired}
              onChange={handleChange}
              placeholder="List required Personal Protective Equipment and tools"
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
              label="Emergency Contact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Emergency contact person and phone number"
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
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <Button 
            type="submit" 
            disabled={loading || submittingForApproval}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {editData ? "Update Permit" : "Create Permit"}
              </>
            )}
          </Button>

          {/* Submit for Approval Button - Only show for DRAFT permits */}
          {editData && editData.status === 'DRAFT' && (
            <Button 
              type="button" 
              disabled={loading || submittingForApproval}
              onClick={() => handleSubmitForApproval(editData.id)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
            >
              {submittingForApproval ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit for Approval
                </>
              )}
            </Button>
          )}

          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Notification Toast */}
      <NotificationToast
        notification={notification.show ? notification : null}
        onClose={() => setNotification({ show: false, message: "", type: "" })}
      />
    </div>
  );
}
