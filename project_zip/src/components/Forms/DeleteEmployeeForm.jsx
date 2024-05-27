import { useState } from "react";
import axios from "axios";

const DeleteEmployeeForm = () => {
  const [employeeId, setEmployeeId] = useState("");

  const handleDelete = (e) => {
    e.preventDefault();
    // Construct the request payload
    const data = JSON.stringify({
      id: employeeId,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://phs.azzappointments.com/apis/public/api/admin/delete",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    // Make the API request
    axios
      .request(config)
      .then((response) => {
        // console.log(response);
        // console.log("Employee deleted successfully:", response.data);
        // Handle success, maybe update UI accordingly
      })
      .catch((error) => {
        console.error("Error deleting employee:", error.response);
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Delete Employee</h2>
      <form
        onSubmit={handleDelete}
        className="flex flex-col gap-5 items-start justify-center"
      >
        <input
          required
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <button
          type="submit"
          className="btn btn-error bg-[red] text-white w-1/3"
        >
          Delete Employee
        </button>
      </form>
    </div>
  );
};

export default DeleteEmployeeForm;
