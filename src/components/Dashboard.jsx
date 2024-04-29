import axios from "axios";
import { useState, useEffect } from "react";
const Dashboard = () => {
  const [response, setResponse] = useState(null);
  const [lateCheckIns, setLateCheckIns] = useState(null);
  const [absentToday, setAbsentToday] = useState(null);
  const [riskUsers, setRiskUsers] = useState(null);
  const [checkedOutUsers, setCheckedOutUsers] = useState([]);

  // .......................................................................Status Api ...................................................................................

  useEffect(() => {
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
  }, []);
  //................................................................................. Late Check In Api ..............................................................................
  useEffect(() => {
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
  }, []);
  //................................................................................. Ridsk USers  Api ..............................................................................
  useEffect(() => {
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
  }, []);
  // ............................................................................................Absent Today Api ..........................................................................
  useEffect(() => {
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
            {/* <div
              onClick={() => document.getElementById("my_modal_1").showModal()}
              className="bg-blueColor text-white w-[200px] h-[70px] border rounded border-gray-200 shadow-md  hover:bg-blueColor/50/80 hover:cursor-pointer"
            >
              <div className="ml-3">
                <p>Active Users</p>
                <h1>{response && response.length}</h1>
              </div>
            </div> */}

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
          <section className="grid grid-cols-2 gap-5  mt-6   h-[280px] mb-10 ">
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

          <section className="grid grid-cols-2  gap-5  mt-6   h-[280px]  mb-10">
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
      </section>
    </>
  );
};

export default Dashboard;
