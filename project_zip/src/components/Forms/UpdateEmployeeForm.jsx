import { useState } from "react";
import axios from "axios";

function UpdateEmployeeForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    joining_date: "",
    emp_code: "",
    department_id: "",
    startTime: "", // New field for start time
    endTime: "", // New field for end time
  });
  const [updateStatus, setUpdateStatus] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "https://phs.azzappointments.com/apis/public/api/admin/update",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUpdateStatus(true);
      setUpdateMessage(JSON.stringify(response.data));
      // Reset form after successful update
      setFormData({
        name: "",
        email: "",
        joining_date: "",
        emp_code: "",
        department_id: "",
        startTime: "",
        endTime: "",
      });
    } catch (error) {
      setUpdateStatus(false);
      setUpdateMessage(
        error.response?.data?.message ||
          "An error occurred while updating the employee data."
      );
    }
  };

  return (
    <div>
      <form
        className="flex flex-col items-start justify-center gap-2"
        onSubmit={handleSubmit}
      >
        {/* Name Input */}
        <input
          required
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="input input-bordered w-full max-w-xs"
        />

        {/* Email Input */}
        <input
          required
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="input input-bordered w-full max-w-xs"
        />

        {/* Joining Date Input */}
        <input
          name="joining_date"
          required
          type="date"
          value={formData.joining_date}
          onChange={handleChange}
          placeholder="Joining date"
          className="input input-bordered w-full max-w-xs"
        />

        {/* Employee Code Input */}
        <input
          name="emp_code"
          value={formData.emp_code}
          onChange={handleChange}
          required
          type="text"
          placeholder="Employee Code"
          className="input input-bordered w-full max-w-xs"
        />

        {/* Department Select */}
        <select
          required
          name="department_id"
          onChange={handleChange}
          className="select select-bordered w-full max-w-xs"
          value={formData.department_id}
        >
          <option disabled value="">
            Select Department
          </option>
          <option value={1}>Communication Department</option>
          <option value={2}>RAF Department</option>
          <option value={3}>MA Department</option>
          <option value={4}>SCP Department</option>
          <option value={5}>Billing Department</option>
          <option value={6}>Technical Department</option>
          <option value={7}>Marketing Department</option>
          <option value={8}>Outsourcing Department</option>
          <option value={9}>Business Department</option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-warning bg-[orange] text-white"
        >
          Update
        </button>

        {/* Display Update Status */}
        {updateStatus !== null && (
          <div className={updateStatus ? "text-green-600" : "text-red-600"}>
            {updateMessage}
          </div>
        )}
      </form>
    </div>
  );
}

export default UpdateEmployeeForm;
