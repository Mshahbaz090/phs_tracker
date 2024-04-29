import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const departmentOptions = [
  { id: 1, name: "Communication Department" },
  { id: 2, name: "RAF Department" },
  { id: 3, name: "MA Department" },
  { id: 4, name: "SCP Department" },
  { id: 5, name: "Billing Department" },
  { id: 6, name: "Technical Department" },
  { id: 7, name: "Marketing Department" },
  { id: 8, name: "Outsourcing Department" },
  { id: 9, name: "Business Department" },
];

const EmployeeDetails = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [response, setResponse] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState([]);
  const [input, setInput] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    department_id: "",
    shift_time: "",
  });

  const notifySuccess = (txt) => toast.success(txt);
  const notifyError = (txt) => toast.error(txt);

  useEffect(() => {
    axios
      .get("https://phs.azzappointments.com/apis/public/api/admin/active-users")
      .then((res) => {
        setResponse(res.data.users);
        setFilteredResponse(res.data.users);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setInput(e.target.value);

    if (input === "" || input === undefined) {
      setFilteredResponse(response);
    } else {
      const filteredData = response
        .map((item) => item)
        .filter((filter) =>
          filter.name.toLowerCase().includes(e.target.value.toLowerCase())
        );

      setFilteredResponse(filteredData);
    }
  };

  const handleEdit = (userId) => {
    const user = response.find((u) => u.id === userId);
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      department_id: user.department_id || "",
      joining_date: user.joining_date,
      emp_code: user.emp_code,
      status: "active",
      shift_time: user.shift_time || "",
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(
        `https://phs.azzappointments.com/apis/public/api/admin/update/${formData.id}`,
        formData
      )
      .then((res) => {
        // console.log("Updated user data:", res.data);

        //Update the user in the state
        const updatedUsers = response.map((user) => {
          if (user.id === formData.id) {
            return res.data; // Use the updated user data from the response
          }
          return user;
        });
        // console.log("updated User:", updatedUsers);
        setResponse(updatedUsers);
        setFilteredResponse(updatedUsers);
        notifySuccess("Employee updated successfully.");
        axios
          .get(
            "https://phs.azzappointments.com/apis/public/api/admin/active-users"
          )
          .then((res) => {
            setResponse(res.data.users);
            setFilteredResponse(res.data.users);
          })
          .catch((error) => {
            console.log("error", error);
          });
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
        notifyError(
          "An error occurred while updating the employee. Please try again."
        );
      });
    setInput("");
  };

  return (
    <>
      <section className="px-5 py-10 bg-[#FEFEFE]">
        <div className="pb-5 font-semibold text-xl text-center">
          Employee Table
        </div>
        <div>
          <Toaster />
        </div>
        <div className="pb-2 flex items-center justify-between">
          <input
            value={input}
            onChange={handleSearch}
            type="text"
            placeholder="Search by Employee Name"
            className="input input-bordered w-full max-w-xs"
          />
          <div className="flex gap-1 font-semibold">
            <div>Total:</div>
            <div>{filteredResponse && filteredResponse.length}</div>
          </div>
        </div>
        <section className="w-[85vw]">
          <div className="w-full border rounded h-[70vh] overflow-y-scroll">
            <table className="table">
              <thead>
                <tr className="">
                  <th className="sticky top-0 bg-blueColor text-black">Id</th>
                  <th className="sticky top-0 bg-blueColor text-black">
                    Employee Code
                  </th>
                  <th className="sticky top-0 bg-blueColor text-black">Name</th>
                  <th className="sticky top-0 bg-blueColor text-black">
                    Email
                  </th>
                  <th className="sticky top-0 bg-blueColor text-black">DOJ</th>
                  <th className="sticky top-0 bg-blueColor text-black">Edit</th>
                  <th className="sticky top-0 bg-blueColor text-black">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredResponse &&
                  filteredResponse.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-blueColor/30 bg-blueColor/10"
                    >
                      <td>{user.id}</td>
                      <td>{user.emp_code}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.joining_date}</td>
                      <td>
                        <button
                          onClick={() => {
                            handleEdit(user.id);
                            document.getElementById("my_modal_3").showModal();
                          }}
                          className="btn btn-sm btn-warning bg-[orange] text-white"
                        >
                          Edit
                        </button>

                        <dialog id="my_modal_3" className="modal">
                          <div className="modal-box">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                ✕
                              </button>
                            </form>
                            <div className="bg-white p-4 rounded-lg px-10 py-5">
                              <h3 className="font-bold text-lg text-center text-blueColor">
                                Edit Employee Details
                              </h3>
                              <form
                                onSubmit={handleUpdate}
                                className="flex flex-col items-start justify-center pt-3 h-fit w-[300px]  ml-10"
                              >
                                <label className="form-control w-full max-w-xs">
                                  <div className="label -mb-2">
                                    <span className="label-text">Name</span>
                                  </div>
                                  <input
                                    required
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        name: e.target.value,
                                      })
                                    }
                                    placeholder="Name"
                                    className="input input-bordered w-full max-w-xs"
                                  />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                  <div className="label -mb-2">
                                    <span className="label-text">Email</span>
                                  </div>
                                  <input
                                    required
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        email: e.target.value,
                                      })
                                    }
                                    placeholder="Email"
                                    className="input input-bordered w-full max-w-xs"
                                  />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                  <div className="label -mb-2">
                                    <span className="label-text">
                                      Joining Date
                                    </span>
                                  </div>
                                  <input
                                    required
                                    name="joining_date"
                                    type="text"
                                    value={formData.joining_date}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        joining_date: e.target.value,
                                      })
                                    }
                                    placeholder="YYYY/MM/DD"
                                    className="input input-bordered w-full max-w-xs"
                                  />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                  <div className="label -mb-2">
                                    <span className="label-text">
                                      Employee Code
                                    </span>
                                  </div>
                                  <input
                                    required
                                    name="emp_code"
                                    type="text"
                                    value={formData.emp_code}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        emp_code: e.target.value,
                                      })
                                    }
                                    placeholder="Employee Code"
                                    className="input input-bordered w-full max-w-xs"
                                  />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                  <div className="label -mb-2">
                                    <span className="label-text">
                                      Shift Time:
                                    </span>
                                  </div>
                                  <input
                                    required
                                    name="shift_time"
                                    type="time"
                                    value={formData.shift_time || ""} // Ensure formData.shift_time is correctly bound
                                    onChange={(e) => {
                                      const inputTime = e.target.value; // Input time in format "HH:mm"
                                      const formattedTime = inputTime + ":00"; // Append ":00" for seconds

                                      setFormData({
                                        ...formData,
                                        shift_time: formattedTime,
                                      });
                                    }}
                                    className="input input-bordered w-full max-w-xs"
                                  />
                                </label>

                                <label className="form-control w-full max-w-xs">
                                  <div className="label -mb-2">
                                    <span className="label-text">
                                      Department
                                    </span>
                                  </div>
                                  <select
                                    required
                                    name="department_id"
                                    value={formData.department_id}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        department_id: e.target.value,
                                      })
                                    }
                                    className="select select-bordered w-full max-w-xs"
                                  >
                                    <option disabled value="">
                                      Select Department
                                    </option>
                                    {departmentOptions.map((option) => (
                                      <option key={option.id} value={option.id}>
                                        {option.name}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <button
                                  type="submit"
                                  onClick={handleUpdate}
                                  className="btn btn-warning bg-[orange] text-white mt-2 w-full"
                                >
                                  Update
                                </button>
                              </form>
                            </div>
                          </div>
                        </dialog>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            document.getElementById("my_modal_2").showModal();
                            setCurrentUserId(user.id);
                          }}
                          className="btn btn-sm btn-error bg-[red] text-white"
                        >
                          Delete
                        </button>
                        <dialog id="my_modal_2" className="modal">
                          <div className="modal-box">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                ✕
                              </button>
                            </form>
                            <h3 className="font-bold text-lg">
                              Are you sure you want to delete this employee?
                            </h3>
                            <div className="flex items-center justify-center mt-5">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();

                                  // Construct the request payload
                                  const data = JSON.stringify({
                                    id: currentUserId,
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
                                    .then(() => {
                                      // console.log(response);
                                      // console.log(
                                      //   "Employee deleted successfully:",
                                      //   response.data
                                      // );
                                      notifySuccess(
                                        "Employee deleted successfully."
                                      );
                                      // Handle success, maybe update UI accordingly
                                      axios
                                        .get(
                                          "https://phs.azzappointments.com/apis/public/api/admin/active-users"
                                        )
                                        .then((res) => {
                                          setResponse(res.data.users);
                                          setFilteredResponse(res.data.users);
                                        })
                                        .catch((error) => {
                                          console.log("error", error);
                                        });
                                    })
                                    .catch(() => {
                                      notifyError(
                                        "An error occurred while deleting the employee. Please try again."
                                      );
                                    });

                                  setInput("");
                                }}
                                className="btn btn-md  btn-error bg-[red] text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </dialog>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </>
  );
};

export default EmployeeDetails;
