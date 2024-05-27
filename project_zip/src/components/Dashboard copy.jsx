import axios from "axios";
import { useState, useEffect } from "react";
const Dashboard = () => {
  const [response, setResponse] = useState(null);
  const [lateCheckIns, setLateCheckIns] = useState(null);
  const [absentToday, setAbsentToday] = useState(null);
  const [riskUsers, setRiskUsers] = useState(null);
  const [checkedOutUsers, setCheckedOutUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState(null);

  // .......................................................................Status Api ...................................................................................

  useEffect(() => {
    if (response === null) {
      let data = "";

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://phs.azzappointments.com/apis/public/api/admin/get-status",
        headers: {},
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          const statuses = response.data.status;
          setResponse(statuses);
          // Filter out users with status === "checked_out"
          const checkedOutEmployees = statuses.filter(
            (user) => user.status === "checked_out"
          );
          setCheckedOutUsers(checkedOutEmployees);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  //................................................................................. Late Check In Api ..............................................................................
  useEffect(() => {
    if (lateCheckIns === null) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://phs.azzappointments.com/apis/public/api/admin/late_check_in"
          );
          const data = response.data;
          // Extract the values from the data object and convert to array
          const lateCheckInsArray = Object.values(data);

          setLateCheckIns(lateCheckInsArray);
        } catch (error) {
          console.error("Error fetching late check-ins:", error);
        }
      };

      fetchData();
    }
  }, []);
  //................................................................................. Ridsk USers  Api ..............................................................................
  useEffect(() => {
    if (riskUsers === null) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://phs.azzappointments.com/apis/public/api/admin/riskUsers"
          );
          const data = response.data.Risk_users;
          // Extract the values from the data object and convert to array
          const riskUsersArray = Object.values(data);

          setRiskUsers(riskUsersArray);
        } catch (error) {
          console.error("Error fetching late check-ins:", error);
        }
      };

      fetchData();
    }
  }, []);
  // ............................................................................................Absent Today Api ..........................................................................
  useEffect(() => {
    if (absentToday === null) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://phs.azzappointments.com/apis/public/api/admin/absents"
          );
          const data = response.data.status;

          setAbsentToday(data);
        } catch (error) {
          console.error("Error fetching late check-ins:", error);
        }
      };

      fetchData();
    }
  }, []);
  //.............................................................Extract time from dateTime ...............................................................................
  function extractTime(dateTimeStr) {
    const dateTime = new Date(dateTimeStr);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const amOrPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
    return formattedTime;
  }

  // -----------------------------Dashbord bottom----------------------------

  useEffect(() => {
    if (activeUsers === null) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://phs.azzappointments.com/apis/public/api/admin/active-users",
        headers: {},
      };

      axios
        .request(config)
        .then((response) => {
          // console.log(JSON.stringify(response.data));
          const filteredUsers = response.data.users
            .map((item) => item)
            .filter((filter) => filter.workstation !== null);
          setActiveUsers(filteredUsers);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <>
      <section className="px-5 py-5 relative w-full bg-fefefe overflow-y-scroll h-[90vh]  ">
        <div className="w-full">
          <div className="pb-5 font-semibold text-xl text-center">
            Dashboard
          </div>
          {/*..................................................................Active User Section....................................................................... */}
          <section className="grid grid-cols-3 w-full gap-5 py-5 justify-items-center"></section>
          <section className="flex flex-row gap-5">
            <div
              onClick={() => document.getElementById("my_modal_1").showModal()}
              className="btn  btn-primary flex flex-col items-center justify-center gap-2 bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className=" font-semibold">Active Users</div>
              <div className="flex items-center justify-evenly gap-5">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user-check"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx={9} cy={7} r={4} />
                    <polyline points="16 11 18 13 22 9" />
                  </svg>
                </div>
                <div className="font-semibold">
                  {response && response.length}
                </div>
              </div>
            </div>

            <dialog id="my_modal_1" className="modal">
              <div className="modal-box ">
                <div className="text-center pb-2 -mt-4 font-semibold text-lg text-blueColor  ">
                  Active Users
                </div>
                <div className="overflow-y-scroll">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="bg-blueColor text-black">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {response &&
                        response.map((item) => (
                          <tr
                            key={item.id}
                            className="bg-blueColor/10 hover:bg-blueColor/30 "
                          >
                            <td>{item.user_id}</td>
                            <td>{item.name}</td>
                            <td>{item.status}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
            {/* <div
              onClick={() => document.getElementById("my_modal_2").showModal()}
              className="bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className="ml-3">
                <p>Currently Working</p>
                <h1>
                  {response &&
                    response
                      .map((item) => item.status)
                      .filter((filter) => filter === "onWork").length}
                </h1>
              </div>
            </div> */}

            <div
              onClick={() => document.getElementById("my_modal_2").showModal()}
              className="btn btn-primary flex flex-col items-center justify-center gap-2 bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className=" font-semibold">Currently Working</div>
              <div className="flex items-center justify-evenly gap-5">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user-cog"
                  >
                    <circle cx={18} cy={15} r={3} />
                    <circle cx={9} cy={7} r={4} />
                    <path d="M10 15H6a4 4 0 0 0-4 4v2" />
                    <path d="m21.7 16.4-.9-.3" />
                    <path d="m15.2 13.9-.9-.3" />
                    <path d="m16.6 18.7.3-.9" />
                    <path d="m19.1 12.2.3-.9" />
                    <path d="m19.6 18.7-.4-1" />
                    <path d="m16.8 12.3-.4-1" />
                    <path d="m14.3 16.6 1-.4" />
                    <path d="m20.7 13.8 1-.4" />
                  </svg>
                </div>
                <div className="font-semibold">
                  {response &&
                    response
                      .map((item) => item.status)
                      .filter((filter) => filter === "onWork").length}
                </div>
              </div>
            </div>
            <dialog id="my_modal_2" className="modal">
              <div className="modal-box">
                <div className="text-center pb-2 -mt-4 font-semibold text-lg text-blueColor">
                  On Work
                </div>
                <div className="overflow-y-scroll">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="bg-blueColor text-black">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {response &&
                        response
                          .filter((filter) => filter.status === "onWork")
                          .map((item) => (
                            <tr
                              key={item.id}
                              className="bg-blueColor/10 hover:bg-blueColor/30"
                            >
                              <td>{item.user_id}</td>
                              <td>{item.name}</td>
                              <td>{item.status}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
            {/* <div
              onClick={() => document.getElementById("my_modal_3").showModal()}
              className="bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className="ml-3">
                <p>Currently on Break</p>
                <h1>
                  {response &&
                    response
                      .map((item) => item.status)
                      .filter((filter) => filter === "onBreak").length}
                </h1>
              </div>
            </div> */}
            <div
              onClick={() => document.getElementById("my_modal_3").showModal()}
              className="btn btn-primary flex flex-col items-center justify-center gap-2 bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className=" font-semibold">Currently on Break</div>
              <div className="flex items-center justify-evenly gap-5">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-coffee"
                  >
                    <path d="M10 2v2" />
                    <path d="M14 2v2" />
                    <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
                    <path d="M6 2v2" />
                  </svg>
                </div>
                <div className="font-semibold">
                  {response &&
                    response
                      .map((item) => item.status)
                      .filter((filter) => filter === "onBreak").length}
                </div>
              </div>
            </div>
            <dialog id="my_modal_3" className="modal">
              <div className="modal-box">
                <div className="text-center pb-2 -mt-4 font-semibold text-lg text-blueColor">
                  On Break
                </div>
                <div className="overflow-y-scroll">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="bg-blueColor text-black">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {response &&
                        response
                          .filter((filter) => filter.status === "onBreak")
                          .map((item) => (
                            <tr
                              key={item.id}
                              className="bg-blueColor/10 hover:bg-blueColor/30"
                            >
                              <td>{item.user_id}</td>
                              <td>{item.name}</td>
                              <td>{item.status}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </section>
          {/*....................................................... Employee Tracking........................................................... */}
          <section className="grid grid-cols-2 max-sm:grid-cols-1 max-sm:mb-[340px] gap-5  mt-6   h-[280px] mb-10 ">
            <div className="bg-blueColor/10 border rounded border-gray-200 hover:shadow-md  ">
              <div className="w-full bg-blueColor text-white  rounded-t  font-semibold pl-2  py-1.5">
                Late Check_in
              </div>

              <div className="px-3 py-2 grid 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1  justify-items-center gap-3 overflow-y-scroll  h-[245px] ">
                {lateCheckIns &&
                  lateCheckIns.map((checkIn) => (
                    <div
                      className="glass hover:bg-blueColor/50 btn bg-blueColor/30 btn-primary bg-[#fefefe] pl-2 border-2 rounded shadow-md hover:shadow-lg w-[210px] h-fit py-3 font-semibold"
                      key={checkIn.id}
                    >
                      <h3 className="font-semibold">{checkIn.name}</h3>

                      {/* <p>{extractTime(checkIn.check_in_time)}</p> */}
                    </div>
                  ))}
              </div>
            </div>
            <div className="bg-blueColor/10 pb-3 border rounded  border-gray-200  hover:shadow-md  ">
              <div className="w-full bg-blueColor text-white  rounded-t  font-semibold pl-2  py-1.5">
                Absent Today
              </div>
              <div className="px-3 py-2 grid 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1  justify-items-center gap-3 overflow-y-scroll  h-[245px]  ">
                {absentToday &&
                  absentToday.map((employee) => (
                    <div
                      key={employee.id}
                      className="glass hover:bg-blueColor/50 btn bg-blueColor/30  btn-primary bg-[#fefefe] pl-2 border-2 rounded shadow-md hover:shadow-lg w-[210px] h-fit py-3 font-semibold"
                    >
                      <h3 className="font-semibold">{employee.name}</h3>
                      {/* <p>Absent today!!</p> */}
                    </div>
                  ))}
              </div>
            </div>
          </section>
          {/*.............................................................Risk Users........................................................ */}

          <section className="grid grid-cols-2 max-sm:grid-cols-1 max-sm:mb-[350px]  gap-5  mt-6   h-[280px]  mb-10">
            <div className="bg-blueColor/10 pb-3 border rounded border-gray-200 hover:shadow-md  ">
              <div className="w-full bg-blueColor text-white  rounded-t  font-semibold pl-2  py-1.5">
                Risk Users
              </div>

              <div className="px-3 py-2 grid 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1  justify-items-center gap-3 overflow-y-scroll  h-[245px] ">
                {riskUsers &&
                  riskUsers.map((employee) => (
                    <div
                      key={employee.id}
                      className="glass hover:bg-blueColor/50 btn bg-blueColor/30 btn-primary bg-[#fefefe] pl-2 border-2 rounded shadow-md hover:shadow-lg w-[210px] h-fit py-3 font-semibold"
                    >
                      <h3 className="font-semibold">{employee.name}</h3>
                      {/* <p>Absent today!!</p> */}
                    </div>
                  ))}
              </div>
            </div>
            <div className="bg-blueColor/10 pb-3 border rounded  border-gray-200  hover:shadow-md  ">
              <div className="w-full bg-blueColor text-white  rounded-t  font-semibold pl-2  py-1.5">
                Checked Out
              </div>
              <div className="px-3 py-2 grid 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 justify-items-center gap-3 overflow-y-scroll h-[245px]">
                {checkedOutUsers.length > 0 ? (
                  // Render the list of checked-out employees if there are any
                  checkedOutUsers.map((user) => (
                    <div
                      key={user.id}
                      className="glass hover:bg-blueColor/50 btn bg-blueColor/30 btn-primary bg-[#fefefe] pl-2 border-2 rounded shadow-md hover:shadow-lg w-[210px] h-fit py-3 font-semibold"
                    >
                      {user.name}
                    </div>
                  ))
                ) : (
                  // Display a message if there are no checked-out employees
                  <div className="text-center text-gray-500">
                    No employees are currently checked out.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* ----------------------------------------Dashboard bottom--------------------------------- */}

        <section className="grid grid-cols-5 place-items-center gap-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 mb-20 mt-10">
          <div>
            <div
              onClick={() => document.getElementById("my_modal_4").showModal()}
              className=" btn  btn-primary flex-col items-center justify-center gap-2 bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className=" font-semibold">System</div>
              <div className="flex items-center justify-evenly gap-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-computer"
                >
                  <rect width={14} height={8} x={5} y={2} rx={2} />
                  <rect width={20} height={8} x={2} y={14} rx={2} />
                  <path d="M6 18h2" />
                  <path d="M12 18h6" />
                </svg>
                <span>
                  {activeUsers &&
                    activeUsers
                      .map((a) => a)
                      .filter((filter) => filter.workstation.system > 0)
                      .map((item) => item.workstation.system)
                      .reduce(
                        (accumulator, currentValue) =>
                          parseInt(accumulator) + parseInt(currentValue),
                        0
                      )}
                </span>
              </div>
            </div>
            <dialog id="my_modal_4" className="modal">
              <div className="modal-box ">
                <div className="text-center pb-2 -mt-4 font-semibold text-lg text-blueColor  ">
                  System
                </div>
                <div className="overflow-y-scroll">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="bg-blueColor text-black">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {activeUsers &&
                        activeUsers
                          .map((a) => a)
                          .filter((filter) => filter.workstation.system > 0)
                          .map((item) => (
                            <tr
                              key={item.id}
                              className="bg-blueColor/10 hover:bg-blueColor/30 "
                            >
                              <td>{item.id}</td>
                              <td>{item.name}</td>
                              <td>
                                {item.workstation && item.workstation.system
                                  ? item.workstation.system
                                  : ""}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
          <div>
            <div
              onClick={() => document.getElementById("my_modal_5").showModal()}
              className=" btn  btn-primary flex-col items-center justify-center gap-2 bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className=" font-semibold">LCD</div>
              <div className="flex items-center justify-evenly gap-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-monitor"
                >
                  <rect width={20} height={14} x={2} y={3} rx={2} />
                  <line x1={8} x2={16} y1={21} y2={21} />
                  <line x1={12} x2={12} y1={17} y2={21} />
                </svg>
                <span>
                  {activeUsers &&
                    activeUsers
                      .map((a) => a)
                      .filter((filter) => filter.workstation.lcd > 0)
                      .map((item) => item.workstation.lcd)
                      .reduce(
                        (accumulator, currentValue) =>
                          parseInt(accumulator) + parseInt(currentValue),
                        0
                      )}
                </span>
              </div>
            </div>
            <dialog id="my_modal_5" className="modal">
              <div className="modal-box ">
                <div className="text-center pb-2 -mt-4 font-semibold text-lg text-blueColor  ">
                  LCD
                </div>
                <div className="overflow-y-scroll">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="bg-blueColor text-black">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {activeUsers &&
                        activeUsers
                          .map((a) => a)
                          .filter((filter) => filter.workstation.lcd > 0)
                          .map((item) => (
                            <tr
                              key={item.id}
                              className="bg-blueColor/10 hover:bg-blueColor/30 "
                            >
                              <td>{item.id}</td>
                              <td>{item.name}</td>
                              <td>
                                {item.workstation && item.workstation.lcd
                                  ? item.workstation.lcd
                                  : ""}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
          <div>
            <div
              onClick={() => document.getElementById("my_modal_6").showModal()}
              className=" btn  btn-primary flex-col items-center justify-center gap-2 bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className=" font-semibold">Keyboard</div>
              <div className="flex items-center justify-evenly gap-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-keyboard"
                >
                  <path d="M10 8h.01" />
                  <path d="M12 12h.01" />
                  <path d="M14 8h.01" />
                  <path d="M16 12h.01" />
                  <path d="M18 8h.01" />
                  <path d="M6 8h.01" />
                  <path d="M7 16h10" />
                  <path d="M8 12h.01" />
                  <rect width={20} height={16} x={2} y={4} rx={2} />
                </svg>
                <span>
                  {activeUsers &&
                    activeUsers
                      .map((a) => a)
                      .filter((filter) => filter.workstation.keyboard > 0)
                      .map((item) => item.workstation.keyboard)
                      .reduce(
                        (accumulator, currentValue) =>
                          parseInt(accumulator) + parseInt(currentValue),
                        0
                      )}
                </span>
              </div>
            </div>
            <dialog id="my_modal_6" className="modal">
              <div className="modal-box ">
                <div className="text-center pb-2 -mt-4 font-semibold text-lg text-blueColor  ">
                  Keyboard
                </div>
                <div className="overflow-y-scroll">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="bg-blueColor text-black">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {activeUsers &&
                        activeUsers
                          .map((a) => a)
                          .filter((filter) => filter.workstation.keyboard > 0)
                          .map((item) => (
                            <tr
                              key={item.id}
                              className="bg-blueColor/10 hover:bg-blueColor/30 "
                            >
                              <td>{item.id}</td>
                              <td>{item.name}</td>
                              <td>
                                {item.workstation && item.workstation.keyboard
                                  ? item.workstation.keyboard
                                  : "0"}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
          <div>
            <div
              onClick={() => document.getElementById("my_modal_7").showModal()}
              className=" btn  btn-primary flex-col items-center justify-center gap-2 bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className=" font-semibold">Mouse</div>
              <div className="flex items-center justify-evenly gap-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mouse"
                >
                  <rect x={5} y={2} width={14} height={20} rx={7} />
                  <path d="M12 6v4" />
                </svg>
                <span>
                  {activeUsers &&
                    activeUsers
                      .map((a) => a)
                      .filter((filter) => filter.workstation.mouse > 0)
                      .map((item) => item.workstation.mouse)
                      .reduce(
                        (accumulator, currentValue) =>
                          parseInt(accumulator) + parseInt(currentValue),
                        0
                      )}
                </span>
              </div>
            </div>
            <dialog id="my_modal_7" className="modal">
              <div className="modal-box ">
                <div className="text-center pb-2 -mt-4 font-semibold text-lg text-blueColor  ">
                  Mouse
                </div>
                <div className="overflow-y-scroll">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="bg-blueColor text-black">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {activeUsers &&
                        activeUsers
                          .map((a) => a)
                          .filter((filter) => filter.workstation.mouse > 0)
                          .map((item) => (
                            <tr
                              key={item.id}
                              className="bg-blueColor/10 hover:bg-blueColor/30 "
                            >
                              <td>{item.id}</td>
                              <td>{item.name}</td>
                              <td>
                                {item.workstation && item.workstation.mouse
                                  ? item.workstation.mouse
                                  : ""}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
          <div>
            <div
              onClick={() => document.getElementById("my_modal_10").showModal()}
              className=" btn  btn-primary flex-col items-center justify-center gap-2 bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className=" font-semibold">USB Headset</div>
              <div className="flex items-center justify-evenly gap-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-usb"
                >
                  <circle cx={10} cy={7} r={1} />
                  <circle cx={4} cy={20} r={1} />
                  <path d="M4.7 19.3 19 5" />
                  <path d="m21 3-3 1 2 2Z" />
                  <path d="M9.26 7.68 5 12l2 5" />
                  <path d="m10 14 5 2 3.5-3.5" />
                  <path d="m18 12 1-1 1 1-1 1Z" />
                </svg>
                <span>
                  {activeUsers &&
                    activeUsers
                      .map((a) => a)
                      .filter((filter) => filter.workstation.headphones_usb > 0)
                      .map((item) => item.workstation.headphones_usb)
                      .reduce(
                        (accumulator, currentValue) =>
                          parseInt(accumulator) + parseInt(currentValue),
                        0
                      )}
                </span>
              </div>
            </div>
            <dialog id="my_modal_10" className="modal">
              <div className="modal-box ">
                <div className="text-center pb-2 -mt-4 font-semibold text-lg text-blueColor  ">
                  USB Headset
                </div>
                <div className="overflow-y-scroll">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="bg-blueColor text-black">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {activeUsers &&
                        activeUsers
                          .map((a) => a)
                          .filter(
                            (filter) => filter.workstation.headphones_usb > 0
                          )
                          .map((item) => (
                            <tr
                              key={item.id}
                              className="bg-blueColor/10 hover:bg-blueColor/30 "
                            >
                              <td>{item.id}</td>
                              <td>{item.name}</td>
                              <td>
                                {item.workstation &&
                                item.workstation.headphones_usb
                                  ? item.workstation.headphones_usb
                                  : ""}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
          <div>
            <div
              onClick={() => document.getElementById("my_modal_11").showModal()}
              className=" btn  btn-primary flex-col items-center justify-center gap-2 bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className=" font-semibold">Phone Headset</div>
              <div className="flex items-center justify-evenly gap-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-headphones"
                >
                  <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                </svg>
                <span>
                  {activeUsers &&
                    activeUsers
                      .map((a) => a)
                      .filter(
                        (filter) => filter.workstation.headphones_phone > 0
                      )
                      .map((item) => item.workstation.headphones_phone)
                      .reduce(
                        (accumulator, currentValue) =>
                          parseInt(accumulator) + parseInt(currentValue),
                        0
                      )}
                </span>
              </div>
            </div>
            <dialog id="my_modal_11" className="modal">
              <div className="modal-box ">
                <div className="text-center pb-2 -mt-4 font-semibold text-lg text-blueColor  ">
                  Phone Headset
                </div>
                <div className="overflow-y-scroll">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="bg-blueColor text-black">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {activeUsers &&
                        activeUsers
                          .map((a) => a)
                          .filter(
                            (filter) => filter.workstation.headphones_phone > 0
                          )
                          .map((item) => (
                            <tr
                              key={item.id}
                              className="bg-blueColor/10 hover:bg-blueColor/30 "
                            >
                              <td>{item.id}</td>
                              <td>{item.name}</td>
                              <td>
                                {item.workstation &&
                                item.workstation.headphones_phone
                                  ? item.workstation.headphones_phone
                                  : ""}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
          <div>
            <div
              onClick={() => document.getElementById("my_modal_8").showModal()}
              className=" btn  btn-primary flex-col items-center justify-center gap-2 bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className=" font-semibold">Cisco Phone</div>
              <div className="flex items-center justify-evenly gap-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-phone-outgoing"
                >
                  <polyline points="22 8 22 2 16 2" />
                  <line x1={16} x2={22} y1={8} y2={2} />
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>
                  {activeUsers &&
                    activeUsers
                      .map((a) => a)
                      .filter((filter) => filter.workstation.phone_cisco > 0)
                      .map((item) => item.workstation.phone_cisco)
                      .reduce(
                        (accumulator, currentValue) =>
                          parseInt(accumulator) + parseInt(currentValue),
                        0
                      )}
                </span>
              </div>
            </div>
            <dialog id="my_modal_8" className="modal">
              <div className="modal-box ">
                <div className="text-center pb-2 -mt-4 font-semibold text-lg text-blueColor  ">
                  Cisco Phone
                </div>
                <div className="overflow-y-scroll">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="bg-blueColor text-black">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {activeUsers &&
                        activeUsers
                          .map((a) => a)
                          .filter(
                            (filter) => filter.workstation.phone_cisco > 0
                          )
                          .map((item) => (
                            <tr
                              key={item.id}
                              className="bg-blueColor/10 hover:bg-blueColor/30 "
                            >
                              <td>{item.id}</td>
                              <td>{item.name}</td>
                              <td>
                                {item.workstation &&
                                item.workstation.phone_cisco
                                  ? item.workstation.phone_cisco
                                  : ""}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
          <div>
            <div
              onClick={() => document.getElementById("my_modal_9").showModal()}
              className=" btn  btn-primary flex-col items-center justify-center gap-2 bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className=" font-semibold">Poly Phone</div>
              <div className="flex items-center justify-evenly gap-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-phone-outgoing"
                >
                  <polyline points="22 8 22 2 16 2" />
                  <line x1={16} x2={22} y1={8} y2={2} />
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>
                  {activeUsers &&
                    activeUsers
                      .map((a) => a)
                      .filter((filter) => filter.workstation.phone_poly > 0)
                      .map((item) => item.workstation.phone_poly)
                      .reduce(
                        (accumulator, currentValue) =>
                          parseInt(accumulator) + parseInt(currentValue),
                        0
                      )}
                </span>
              </div>
            </div>
            <dialog id="my_modal_9" className="modal">
              <div className="modal-box ">
                <div className="text-center pb-2 -mt-4 font-semibold text-lg text-blueColor  ">
                  Poly Phone
                </div>
                <div className="overflow-y-scroll">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="bg-blueColor text-black">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {activeUsers &&
                        activeUsers
                          .map((a) => a)
                          .filter((filter) => filter.workstation.phone_poly > 0)
                          .map((item) => (
                            <tr
                              key={item.id}
                              className="bg-blueColor/10 hover:bg-blueColor/30 "
                            >
                              <td>{item.id}</td>
                              <td>{item.name}</td>
                              <td>
                                {item.workstation && item.workstation.phone_poly
                                  ? item.workstation.phone_poly
                                  : ""}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>

          <div>
            <div
              onClick={() => document.getElementById("my_modal_13").showModal()}
              className=" btn  btn-primary flex-col items-center justify-center gap-2 bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className=" font-semibold">Webcam</div>
              <div className="flex items-center justify-evenly gap-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-webcam"
                >
                  <circle cx={12} cy={10} r={8} />
                  <circle cx={12} cy={10} r={3} />
                  <path d="M7 22h10" />
                  <path d="M12 22v-4" />
                </svg>
                <span>
                  {activeUsers &&
                    activeUsers
                      .map((a) => a)
                      .filter((filter) => filter.workstation.webcam > 0)
                      .map((item) => item.workstation.webcam)
                      .reduce(
                        (accumulator, currentValue) =>
                          parseInt(accumulator) + parseInt(currentValue),
                        0
                      )}
                </span>
              </div>
            </div>
            <dialog id="my_modal_13" className="modal">
              <div className="modal-box ">
                <div className="text-center pb-2 -mt-4 font-semibold text-lg text-blueColor  ">
                  Webcam
                </div>
                <div className="overflow-y-scroll">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="bg-blueColor text-black">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {activeUsers &&
                        activeUsers
                          .map((a) => a)
                          .filter((filter) => filter.workstation.webcam > 0)
                          .map((item) => (
                            <tr
                              key={item.id}
                              className="bg-blueColor/10 hover:bg-blueColor/30 "
                            >
                              <td>{item.id}</td>
                              <td>{item.name}</td>
                              <td>
                                {item.workstation && item.workstation.webcam
                                  ? item.workstation.webcam
                                  : ""}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
        </section>
      </section>
    </>
  );
};

export default Dashboard;
