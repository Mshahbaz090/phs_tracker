import AddEmployeeForm from "./Forms/AddEmployeeForm";
import UpdateEmployeeForm from "./Forms/UpdateEmployeeForm";
import DeleteEmployeeForm from "./Forms/DeleteEmployeeForm";
import { useState } from "react";

const EmployeeForms = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className="px-5 py-10 ">
      <div className="font-semibold text-xl text-center">Employee Forms</div>
      <div className="flex my-5 space-x-10 max-sm:space-x-5">
        <button
          onClick={() => setActiveComponent("Add")}
          className="btn btn-neutral"
        >
          Add Employee
        </button>
        <button
          onClick={() => setActiveComponent("Update")}
          className="btn btn-neutral"
        >
          Update Employee
        </button>
        <button
          onClick={() => setActiveComponent("Delete")}
          className="btn btn-neutral"
        >
          Delete Employee
        </button>
      </div>
      <section>
        {activeComponent === "Add" && <AddEmployeeForm />}
        {activeComponent === "Update" && <UpdateEmployeeForm />}
        {activeComponent === "Delete" && <DeleteEmployeeForm />}
      </section>
    </div>
  );
};

export default EmployeeForms;
