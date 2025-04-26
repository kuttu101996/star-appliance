import CustomDrawer from "./CustomDrawer";
import { useState } from "react";

interface T {
  name: string;
  mobile: string;
  employeeType: string;
}
// Main Component
const TestServiceRequest = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reqDate, setReqDate] = useState<Date | null>(null);
  const [serviceType, setServiceType] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [serviceDescription, setServiceDescription] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [technicians] = useState<T[]>([
    { name: "Technician A", mobile: "1234567890", employeeType: "TECHNICIAN" },
    { name: "Technician B", mobile: "0987654321", employeeType: "TECHNICIAN" },
  ]);
  const [assignTo, setAssignTo] = useState<T | undefined>(undefined);

  const handleCreateServiceReq = () => {
    // Handle form submission logic here
    console.log({
      reqDate,
      serviceType,
      status,
      assignTo,
      serviceDescription,
      resolutionNote,
    });
    setDrawerOpen(false); // Close the drawer after submission
  };

  return (
    <div className="p-4">
      {/* Button to Open Drawer */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setDrawerOpen(true)}
      >
        Create Service Request
      </button>

      {/* Drawer */}
      <CustomDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {/* Request Date */}
        <div className="flex flex-col mb-3">
          <label className="text-[#eb6462] text-xs tracking-wide">
            Request Date *
          </label>
          <input
            type="date"
            onChange={(e) =>
              setReqDate(e.target.value ? new Date(e.target.value) : null)
            }
            className="border border-gray-300 px-2 py-1 rounded"
            required
          />
        </div>

        {/* Service Type */}
        <div className="flex flex-col mb-3">
          <label className="text-xs tracking-wide">Service Type</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded"
          >
            <option value="" disabled>
              Select service type
            </option>
            <option value="TYPE_A">Type A</option>
            <option value="TYPE_B">Type B</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col mb-3">
          <label className="text-xs tracking-wide">
            Status (Default pending)
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded"
          >
            <option value="PENDING">PENDING</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
        </div>

        {/* Assign To */}
        {status === "ASSIGNED" && (
          <div className="flex flex-col mb-3">
            <label className="text-xs tracking-wide">Assign To</label>
            <select
              value={assignTo ? assignTo.name : ""}
              onChange={(e) =>
                setAssignTo(technicians.find((t) => t.name === e.target.value))
              }
              className="border border-gray-300 px-2 py-1 rounded"
            >
              <option value="" disabled>
                Select technician...
              </option>
              {technicians.map((technician) => (
                <option
                  key={technician.mobile + new Date().toISOString()}
                  value={technician.name}
                >
                  {technician.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Service Description */}
        <div className="flex flex-col mb-3">
          <label className="text-xs tracking-wide">Service Description</label>
          <input
            type="text"
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded"
            placeholder="Service description here..."
          />
        </div>

        {/* Service Resolution */}
        <div className="flex flex-col mb-3">
          <label className="text-xs tracking-wide">Service Resolution</label>
          <input
            type="text"
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded"
            placeholder="Write a resolution note..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleCreateServiceReq}
            className="bg-[#408dfb] hover:bg-blue-500 text-white font-medium px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </CustomDrawer>
    </div>
  );
};

export default TestServiceRequest;
