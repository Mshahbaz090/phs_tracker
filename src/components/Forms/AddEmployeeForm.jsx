import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function AddEmployeeForm() {
  const notifySuccess = (txt) => toast.success(txt);
  const notifyError = (txt) => toast.error(txt);

  const [formData, setFormData] = useState({
    name: "",
    emp_code: "",
    joining_date: "",
    email: "",
    password: "",
    cnic: "",
    phone: "",
    personal_email: "",
    shift_time: "",
    department_id: 0,
    designation: "",
    leaving_date: "",
    status: "active",
  });

  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "phone") {
      // Format phone number value to "0300-1122333"
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/^(\d{4})(\d{0,7})/, "$1-$2")
        .replace(/^(\d{4}-\d{7})(\d{0,7})/, "$1$2");
      if (formattedValue.length > 12) {
        formattedValue = formattedValue.slice(0, 12);
      }
    }

    if (name === "cnic") {
      // Format CNIC value with hyphens after 5 and 12 characters
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/^(\d{5})(\d{0,7})/, "$1-$2")
        .replace(/^(\d{5}-\d{7})(\d{0,1})/, "$1-$2");
      if (formattedValue.length > 15) {
        formattedValue = formattedValue.slice(0, 15);
      }
    }
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.department_id &&
      formData.designation &&
      formData.emp_code &&
      formData.joining_date &&
      formData.phone &&
      formData.status &&
      formData.shift_time
    ) {
      let data = JSON.stringify({
        name: formData.name,
        emp_code: formData.emp_code,
        joining_date: formData.joining_date,
        email: formData.email,
        password: formData.password,
        cnic: formData.cnic,
        phone: formData.phone,
        personal_email: formData.personal_email,
        shift_time: formData.shift_time,
        department_id: formData.department_id,
        designation: formData.designation,
        leaving_date: formData.leaving_date,
        status: "active",
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://phs.azzappointments.com/apis/public/api/admin",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          notifySuccess("Employee added successfully!");

          setFormData({
            ...formData,
            name: "",
            emp_code: "",
            joining_date: "",
            email: "",
            password: "",
            cnic: "",
            phone: "",
            personal_email: "",
            shift_time: "",
            department_id: 0,
            designation: "",
            leaving_date: "",
          });
        })
        .catch(() => {
          notifyError(
            "An error occurred while adding the employee. Please try again."
          );
        });
    } else {
      notifyError("Please fill out all required fields.");
    }
  };

  return (
    <div className="p-4 w-full flex flex-col items-center justify-center bg-fcfcfc ">
      <h1 className="text-xl mb-4 -mt-2 ">Add Employee</h1>
      <div>
        <Toaster />
      </div>

      <form
        onSubmit={handleSubmit}
        className="px-[100px] py-10 flex flex-col w-fit items-start justify-center border border-gray-300 rounded-xl shadow-xl gap-3 -mt-2 bg-white  hover:shadow-2xl "
      >
        <div className="flex items-center justify-center gap-3">
          <input
            required
            value={formData.name}
            onChange={handleChange}
            name="name"
            type="text"
            placeholder="Employee name*"
            className="input input-bordered w-full "
          />

          <input
            required
            value={formData.emp_code}
            onChange={handleChange}
            name="emp_code"
            type="text"
            placeholder="Employee code*"
            className="input input-bordered w-full  "
          />
        </div>

        <label className="form-control w-full ">
          <div className="label -mb-2">
            <span className="label-text">Date of Joining*</span>
          </div>
          <input
            name="joining_date"
            required
            type="date"
            value={formData.joining_date}
            onChange={handleChange}
            placeholder="Joining date"
            className="input input-bordered w-full "
            pattern="\d{4}-\d{2}-\d{2}"
          />
        </label>

        <input
          value={formData.email}
          onChange={handleChange}
          name="email"
          type="email"
          placeholder="Email address"
          className="input input-bordered w-full"
        />
        <div className="flex items-center justify-center">
          <input
            value={formData.password}
            onChange={handleChange}
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="input input-bordered"
          />
          <div className="form-control pl-3">
            {/* <label className="label cursor-pointer">
              <span className="label-text">Show</span>
              <input
                onChange={() => setShowPass(!showPass)}
                type="checkbox"
                className="checkbox ml-1"
              />
            </label> */}
            <label
              onChange={() => setShowPass(!showPass)}
              className="swap swap-rotate"
            >
              {/* this hidden checkbox controls the state */}
              <input type="checkbox" />

              {/* show icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={32}
                height={32}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-eye swap-on"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx={12} cy={12} r={3} />
              </svg>

              {/* hide icon */}
              {/* <svg
                className="swap-off fill-current w-10 h-10"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={32}
                height={32}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-eye-off swap-rotate swap-off stroke-gray-500"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1={2} x2={22} y1={2} y2={22} />
              </svg>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <input
            required
            value={formData.cnic}
            onChange={handleChange}
            name="cnic"
            type="text"
            placeholder="CNIC*(XXXXX-XXXXXXX-X)"
            className="input input-bordered w-[54%] "
          />

          <input
            required
            value={formData.phone}
            onChange={handleChange}
            name="phone"
            type="tel"
            placeholder="Phone*(0300-0011222)"
            className="input input-bordered w-[46%] "
          />
        </div>
        <input
          value={formData.personal_email}
          onChange={handleChange}
          name="personal_email"
          type="email"
          placeholder="Personal email"
          className="input input-bordered w-full "
        />

        <div className="label -mb-2">
          <span className="label-text -mb-3">Shift time*</span>
        </div>
        <input
          value={formData.shift_time}
          onChange={handleChange}
          name="shift_time"
          type="time"
          placeholder="Personal email"
          className="input input-bordered w-full "
        />

        <select
          name="department_id"
          required={true}
          defaultValue={formData.department_id}
          onChange={handleChange}
          className="select select-bordered w-full "
        >
          <option value={0} disabled selected>
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

        <input
          required
          value={formData.designation}
          onChange={handleChange}
          name="designation"
          type="text"
          placeholder="Designation"
          className="input input-bordered w-full "
        />

        <label className="form-control w-full ">
          <div className="label -mb-2">
            <span className="label-text">Date of Leaving</span>
          </div>
          <input
            name="leaving_date"
            type="date"
            value={formData.leaving_date}
            onChange={handleChange}
            placeholder="Leaving date"
            className="input input-bordered w-full "
            pattern="\d{2}-\d{2}-\d{2}"
          />
        </label>

        <button
          type="submit"
          className="btn btn-primary text-white w-full mt-2 text-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddEmployeeForm;
