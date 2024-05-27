import React, { useState, useEffect } from "react";
import axios from "axios";
import FileUploader from "./FileUploader";
import FileDownloader from "./Filedownloader";
import { StickyTable, Row, Cell } from "react-sticky-table";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import toast, { Toaster } from "react-hot-toast";

function AttendanceReport() {
  const [one, setOne] = useState(true);
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(false);
  const [four, setFour] = useState(false);

  const [users, setUsers] = useState([]);
  const [customUsers, setCustomUsers] = useState(null);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [employeeWorkingDays, setEmployeeWorkingDays] = useState({});
  const [employeeLateCheckIn, setEmployeeLateCheckIn] = useState({});
  const [datePanel, setDatePanel] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  //! NEW STATES FOR DATE RANGE *************

  const [myEndDate, setMyEndDate] = useState(new Date());
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const [myStartDate, setMyStartDate] = useState(thirtyDaysAgo);

  const [username, setUserName] = useState("");

  // console.log("myStartDate ", myStartDate);
  // console.log("myEndDate ", myEndDate);

  //! UPDATE TIME *************
  const [updateDate, setUpdateDate] = useState(null);
  const [updateUser, setUpdateUser] = useState(null);
  const [updateType, setUpdateType] = useState(null);
  const [updateTime, setUpdateTime] = useState(null);

  //! NOTIFICATION ****************
  const notifySuccess = (txt) => toast.success(txt);
  const notifyError = (txt) => toast.error(txt);

  useEffect(() => {
    if (users.length <= 0) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://phs.azzappointments.com/apis/public/api/admin/attendance-reports1"
          );
          if (response.data !== null && response.data !== undefined) {
            setUsers(response.data);

            //console.log(users && users);
            extractUniqueDates(response.data);
          } else {
            setUsers([]);
            setUniqueDates([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, []);

  useEffect(() => {
    //! Date Range Filtering Data  [START]******************************************

    // Define your start and end dates
    const startDate = `${myStartDate.getFullYear()}-${String(
      myStartDate.getMonth() + 1
    ).padStart(2, "0")}-${String(myStartDate.getDate()).padStart(2, "0")}`;
    const endDate = `${myEndDate.getFullYear()}-${String(
      myEndDate.getMonth() + 1
    ).padStart(2, "0")}-${String(myEndDate.getDate()).padStart(2, "0")}`;

    // console.log("START Date", startDate);
    // console.log("END Date", endDate);

    // Filter the 'users' array
    const filteredUsers = users
      .map((item) => item)
      .filter((filter) =>
        filter.name.toLowerCase().includes(username.toLowerCase())
      )
      .map((user) => {
        // Filter biometric trackings based on date range
        const filteredTrackings = user.biometric_trackings.filter(
          (tracking) => {
            const trackingDate = new Date(tracking.date);
            return (
              `${trackingDate.getFullYear()}-${String(
                trackingDate.getMonth() + 1
              ).padStart(2, "0")}-${String(trackingDate.getDate()).padStart(
                2,
                "0"
              )}` >= startDate &&
              `${trackingDate.getFullYear()}-${String(
                trackingDate.getMonth() + 1
              ).padStart(2, "0")}-${String(trackingDate.getDate()).padStart(
                2,
                "0"
              )}` <= endDate
            );
          }
        );

        // Return only required fields along with filtered biometric trackings
        return {
          id: user.id,
          name: user.name,
          biometric_trackings: filteredTrackings.map((tracking) => tracking),
        };
      });

    // 'filteredUsers' now contains the filtered user data
    // console.log(filteredUsers);

    //! Date Range Filtering Data  [END]******************************************

    //! CUSTOM USERS  [START]******************************************

    const responses = filteredUsers.map((user) => {
      const id = user.id;
      const name = user.name;
      const bio = user.biometric_trackings;

      // Calculate sum of extra_time
      const extraTimeSum = bio.reduce(
        (acc, track) => acc + (track.extra_time || 0),
        0
      );

      return {
        id: id,
        name: name,
        bio: bio,
        extra_time: extraTimeSum,
      };
    });

    const newResponse = responses.map((res) => {
      const combinedStatus = res.bio.map((item) => ({
        date: item.date,
        leave_status: item.leave_status,
      }));
      const id = res.id;
      const name = res.name;

      // Initialize counts for all leave statuses to 0
      const statusCounts = {
        ok: 0,
        late_strike: 0,
        half_leave: 0,
        short_leave: 0,
      };

      // Count occurrences of each leave status
      combinedStatus.forEach((statusObj) => {
        const status = statusObj.leave_status;
        statusCounts[status]++;
      });

      return {
        id: id,
        name: name,
        status: combinedStatus,
        ...statusCounts, // Spread operator to include status counts
        extra_time: res.extra_time, // Include extra_time from the previous step
      };
    });

    setCustomUsers(newResponse && newResponse);
    // console.log(newResponse && newResponse);

    //! CUSTOM USERS  [END]******************************************
  }, [myEndDate, myStartDate, datePanel, users, username]);

  const extractUniqueDates = (userData) => {
    const datesSet = new Set();
    const workingDaysByEmployee = {};
    const lateCheckInByEmployee = {};

    const startDate = `${myStartDate.getFullYear()}-${String(
      myStartDate.getMonth() + 1
    ).padStart(2, "0")}-${String(myStartDate.getDate()).padStart(2, "0")}`;
    const endDate = `${myEndDate.getFullYear()}-${String(
      myEndDate.getMonth() + 1
    ).padStart(2, "0")}-${String(myEndDate.getDate()).padStart(2, "0")}`;

    userData.forEach((user) => {
      const userId = user.id;
      let workingDaysCount = 0;
      let lateCheckInDaysCount = 0;

      if (user.biometric_trackings) {
        user.biometric_trackings.forEach((biometric) => {
          const date = new Date(biometric.date).toISOString().substr(0, 10);
          if (
            `${new Date(biometric.date).getFullYear()}-${String(
              new Date(biometric.date).getMonth() + 1
            ).padStart(2, "0")}-${String(
              new Date(biometric.date).getDate()
            ).padStart(2, "0")}` >= startDate &&
            `${new Date(biometric.date).getFullYear()}-${String(
              new Date(biometric.date).getMonth() + 1
            ).padStart(2, "0")}-${String(
              new Date(biometric.date).getDate()
            ).padStart(2, "0")}` <= endDate
          ) {
            datesSet.add(date);
            workingDaysCount++;
          }
        });
      }

      if (user.biometric_trackings) {
        user.biometric_trackings.forEach((biometric) => {
          if (
            biometric.late_strike !== "False" &&
            date >= "2024-04-01" &&
            date <= "2024-04-05"
          ) {
            lateCheckInDaysCount++;
          }
        });
      }

      if (user.trackings) {
        user.trackings.forEach((tracking) => {
          const date = new Date(tracking.check_in_time)
            .toISOString()
            .substr(0, 10);
          if (date >= "2024-04-01" && date <= "2024-04-05") {
            datesSet.add(date);
          }
        });
      }

      lateCheckInByEmployee[userId] = lateCheckInDaysCount;
      workingDaysByEmployee[userId] = workingDaysCount;
    });

    const sortedDates = Array.from(datesSet).sort();
    setUniqueDates(sortedDates);
    // setEmployeeWorkingDays(workingDaysByEmployee);
    // setEmployeeLateCheckIn(lateCheckInByEmployee);
  };

  useEffect(() => {
    extractUniqueDates(users);
  }, [users, myStartDate, myEndDate, date]);

  function extractTimeFromDate(dateString) {
    if (!dateString) {
      return "No data"; // or any other appropriate default message
    }
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    const formattedHours = hours12 < 10 ? `0${hours12}` : `${hours12}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
    return formattedTime;
  }

  const startDate = date && date[0] && date[0].startDate;
  const endDate = date && date[0] && date[0].endDate;

  const startDateFormatted = startDate ? new Date(startDate) : null;
  const endDateFormatted = endDate ? new Date(endDate) : null;

  const formattedStartDate = `${startDateFormatted.getFullYear()}-${(
    startDateFormatted.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${startDateFormatted
    .getDate()
    .toString()
    .padStart(2, "0")}`;

  const formattedEndDate =
    endDateFormatted &&
    `${endDateFormatted.getFullYear()}-${(endDateFormatted.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${endDateFormatted
      .getDate()
      .toString()
      .padStart(2, "0")}`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `${date.getDate()}-${(date.getMonth() + 1)
      .toString()
      .padStart(
        2,
        "0"
      )}-${date.getFullYear()} ${formattedHours}:${formattedMinutes}${ampm}`;
  };

  const updateTimeUsers = users.map((user) => {
    let emp_id =
      user.biometric_trackings.length > 0
        ? user.biometric_trackings[0].emp_id
        : null;

    // Check if emp_id is empty, null, or undefined, then set it to "no"
    if (!emp_id) {
      emp_id = "no";
    }

    return { name: user.name, emp_id: emp_id };
  });

  // console.log(updateTimeUsers);

  const handleUpdateTime = (e) => {
    e.preventDefault();

    const checkTypeInOut =
      updateType === "check-in" ? "check_in_time" : "check_out_time";

    let data = JSON.stringify({
      [checkTypeInOut]: updateTime,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `https://phs.azzappointments.com/apis/public/api/biometric/${updateUser}/${updateDate}/${updateType}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        //console.log(JSON.stringify(response.data));
        document.getElementById("update_time").close();
        document.getElementById("time-update-form").reset();
        notifySuccess(response.data.message);

        //! UPDATE USERS AGAIN ******************

        const fetchData = async () => {
          try {
            const response = await axios.get(
              "https://phs.azzappointments.com/apis/public/api/admin/attendance-reports1"
            );
            if (response.data !== null && response.data !== undefined) {
              setUsers(response.data);

              //console.log(users && users);
              extractUniqueDates(response.data);
            } else {
              setUsers([]);
              setUniqueDates([]);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        fetchData();

        setUpdateDate(null);
        setUpdateUser(null);
        setUpdateType(null);
        setUpdateTime(null);
      })
      .catch((err) => {
        //console.log(err.response.data.error);
        notifyError(err.response.data.error);
        setUpdateDate(null);
        setUpdateUser(null);
        setUpdateType(null);
        setUpdateTime(null);
        document.getElementById("update_time").close();
        document.getElementById("time-update-form").reset();
      });
  };

  const renderAttendanceTable = () => {
    return (
      <div>
        <div className="w-full max-md:w-[120%] relative bg-white rounded mb-5 flex items-center justify-between max-md:items-start  flex-wrap   ">
          <div
            onClick={() => setDatePanel(!datePanel)}
            className={
              date && date[0] && date[0].endDate
                ? "rounded border border-gray-400/60  w-[334px] py-1.5 px-2 text-center hover:cursor-pointer relative h-fit "
                : "rounded border border-gray-400/60  w-[334px] py-1.5 px-2 text-center hover:cursor-pointer relative h-fit "
            }
          >
            {date && date[0] && date[0].endDate
              ? new Date(date[0].startDate).toLocaleDateString("en-US", {
                  day: "2-digit",
                }) +
                "-" +
                new Date(date[0].startDate).toLocaleDateString("en-US", {
                  month: "2-digit",
                }) +
                "-" +
                new Date(date[0].startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                }) +
                " - " +
                new Date(date[0].endDate).toLocaleDateString("en-US", {
                  day: "2-digit",
                }) +
                "-" +
                new Date(date[0].endDate).toLocaleDateString("en-US", {
                  month: "2-digit",
                }) +
                "-" +
                new Date(date[0].endDate).toLocaleDateString("en-US", {
                  year: "numeric",
                })
              : "Select Date"}
          </div>

          <div
            className={
              datePanel
                ? "border rounded absolute left-0 !h-fit  top-11 z-[99999] w-[334px] "
                : "hidden"
            }
          >
            <DateRange
              maxDate={new Date()}
              className="rounded shadow-lg "
              editableDateInputs={false}
              onChange={(item) => {
                setDate([item.selection]);
              }}
              moveRangeOnFirstSelection={false}
              ranges={date}
            />
            <button
              onClick={() => {
                date && date[0].endDate && setDatePanel(!datePanel);
                setMyStartDate(date && date[0].startDate);
                setMyEndDate(date && date[0].endDate);
              }}
              className="h-11 btn btn-primary text-white text-lg w-full rounded-none rounded-br "
            >
              Apply
            </button>
          </div>
          <div className="">
            <div
              onClick={() => document.getElementById("update_time").showModal()}
              className="btn btn-primary text-white mr-20    "
            >
              Update Time
            </div>
            <div>
              <Toaster />
            </div>
            <dialog id="update_time" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <form
                  id="time-update-form"
                  onSubmit={handleUpdateTime}
                  className="w-full flex flex-col items-center justify-center "
                >
                  <h3 className="font-bold text-xl text-appColor mb-2">
                    Update Time
                  </h3>
                  <label className="form-control w-[320px] ">
                    <div className="label -mb-2">
                      <span className="label-text">Date</span>
                    </div>
                    <input
                      name="date"
                      required
                      type="date"
                      defaultValue={null}
                      value={updateDate}
                      onChange={(e) => setUpdateDate(e.target.value)}
                      placeholder="Date"
                      className="input input-bordered w-full "
                      pattern="\d{4}-\d{2}-\d{2}"
                    />
                  </label>
                  <label className="form-control w-[320px] ">
                    <div className="label -mb-2">
                      <span className="label-text">User</span>
                    </div>
                    <select
                      required
                      value={updateUser}
                      onChange={(e) => setUpdateUser(e.target.value)}
                      className="select select-bordered w-full max-w-xs"
                    >
                      <option disabled selected>
                        Select User?
                      </option>
                      {updateTimeUsers
                        .filter((filter) => filter.emp_id !== "no")
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((user, index) => (
                          <option value={user.emp_id} key={index}>
                            {user.name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label className="form-control w-[320px] ">
                    <div className="label -mb-2">
                      <span className="label-text">Type</span>
                    </div>
                    <select
                      required
                      defaultValue={0}
                      onChange={(e) => setUpdateType(e.target.value)}
                      className="select select-bordered w-full max-w-xs"
                    >
                      <option defaultValue={0} disabled selected>
                        Select Type?
                      </option>
                      <option value={"check-in"}>Check-In</option>
                      <option value={"check-out"}>Check-Out</option>
                    </select>
                  </label>
                  <div className="w-[320px]">
                    <div className="label -mb-2">
                      <span className="label-text mb-0">New Time</span>
                    </div>
                    <input
                      required
                      onChange={(e) => {
                        const time = e.target.value;
                        const formattedTime = time ? time + ":00" : "";
                        setUpdateTime(formattedTime);
                      }}
                      value={updateTime}
                      name="time"
                      type="time"
                      placeholder="count..."
                      className="input input-bordered w-full "
                    />
                  </div>

                  <div className="mt-5 w-full flex items-center justify-center">
                    <button
                      type="submit"
                      className="tracking-wider btn btn-primary text-white w-[320px] text-lg"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </dialog>
          </div>
        </div>
        <div
          className="border-2 rounded"
          style={{ width: "100%", height: "65vh" }}
        >
          <StickyTable
            borderWidth={0}
            stickyHeaderCount={1}
            leftStickyColumnCount={2}
          >
            <Row>
              <Cell
                style={{ backgroundColor: "#FBA834" }}
                className="border border-gray-400 px-4 py-2 text-nowrap"
              >
                ID
              </Cell>
              <Cell
                style={{ backgroundColor: "#FBA834" }}
                className="border border-gray-400 px-4 py-2 text-nowrap"
              >
                Name
              </Cell>

              {uniqueDates.map((date) => (
                <React.Fragment key={date}>
                  <Cell
                    style={{ backgroundColor: "#FBA834" }}
                    className="border border-gray-400 px-4 py-2 text-nowrap"
                  >
                    {date}
                  </Cell>
                </React.Fragment>
              ))}
            </Row>
            {users.map((user) => (
              <Row key={user.id} className="">
                <Cell className="border border-gray-400 px-4 py-2 align-middle text-center">
                  {user.id}
                </Cell>
                <Cell className="border border-gray-400 px-4 py-2 align-middle">
                  {user.name}
                </Cell>

                {uniqueDates.map((date) => {
                  const biometricTracking = user.biometric_trackings.find(
                    (biometric) =>
                      new Date(biometric.date).toISOString().substr(0, 10) ===
                      date
                  );

                  return (
                    <Cell
                      className="border border-gray-400 px-4 py-2 text-nowrap  "
                      key={`${user.id}-${date}`}
                      style={{
                        backgroundColor:
                          biometricTracking &&
                          biometricTracking.leave_status === "half_leave"
                            ? "#F87171"
                            : biometricTracking &&
                              biometricTracking.leave_status === "short_leave"
                            ? "#FB923C"
                            : biometricTracking &&
                              biometricTracking.leave_status === "late_strike"
                            ? "#FACC15"
                            : "",
                      }}
                    >
                      <div>
                        <span className=" mr-1"> In:</span>
                        {biometricTracking
                          ? biometricTracking.check_in_time.substr(11, 8) ||
                            "No data"
                          : "No data"}
                      </div>
                      <div>
                        <span className=" mr-1 "> Out:</span>
                        {biometricTracking
                          ? biometricTracking.check_out_time
                            ? biometricTracking.check_out_time.substr(11, 8)
                            : biometricTracking.check_out_time || "No data"
                          : "No data"}
                      </div>
                      <div
                        className={
                          biometricTracking && biometricTracking.extra_time > 0
                            ? " text-green-500 font-medium mr-1"
                            : " mr-1 "
                        }
                      >
                        <span>Extra Time:</span>
                        {biometricTracking && biometricTracking.extra_time > 0
                          ? ` ${biometricTracking.extra_time}` || " 0"
                          : " 0"}
                      </div>
                    </Cell>
                  );
                })}
              </Row>
            ))}
          </StickyTable>
        </div>
      </div>
    );
  };

  return (
    <section className="px-5 py-5 w-full ">
      <div className="relative flex items-center justify-center pb-5 font-semibold text-xl text-center w-full max-lg:flex-col max-lg:gap-3">
        Attendance Report
        <div
          className={
            two
              ? " absolute right-5 max-lg:relative"
              : "hidden absolute right-5 max-lg:relative"
          }
        >
          <div className="flex items-center justify-center gap-5 text-sm italic font-normal">
            <div className="flex items-center justify-center gap-1">
              <div className="">Late Strike:</div>
              <div className="border border-slate-400 h-4 w-4 bg-yellow-400"></div>
            </div>
            <div className="flex items-center justify-center gap-1">
              <div>Short Leave:</div>
              <div className="border border-slate-400 h-4 w-4 bg-orange-400"></div>
            </div>
            <div className="flex items-center justify-center gap-1">
              <div>Half Leave:</div>
              <div className="border border-slate-400 h-4 w-4 bg-red-400"></div>
            </div>
            <div className="flex items-center justify-center gap-1">
              <div>Extra Time (Hrs):</div>
              <div className="border border-slate-400 h-4 w-4 bg-green-400"></div>
            </div>
          </div>
        </div>
      </div>

      <section className=" grid grid-cols-12 border-2 py-5 px-2 gap-5 rounded h-[75vh]">
        <div className="  col-span-2   border-r-2 border-gray-600">
          <ul className="menu bg-base-200 w-full rounded gap-1">
            <li>
              <a
                onClick={() => {
                  setOne(true);
                  setTwo(false);
                  setThree(false);
                  setFour(false);
                  setDatePanel(false);
                }}
                className={
                  one
                    ? "rounded btn shadow-none text-appColor"
                    : "rounded btn shadow-none"
                }
              >
                Summary Report
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  setTwo(true);
                  setOne(false);
                  setThree(false);
                  setFour(false);
                  setDatePanel(false);
                }}
                className={
                  two
                    ? "rounded btn shadow-none text-appColor"
                    : "rounded btn shadow-none"
                }
              >
                Monthly Report
              </a>
            </li>

            <li>
              <a
                onClick={() => {
                  setThree(true);
                  setTwo(false);
                  setOne(false);
                  setFour(false);
                }}
                className={
                  three
                    ? "rounded btn shadow-none text-appColor"
                    : "rounded btn shadow-none"
                }
              >
                Upload Biometric
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  setFour(true);
                  setThree(false);
                  setTwo(false);
                  setOne(false);
                }}
                className={
                  four
                    ? "rounded btn shadow-none text-appColor"
                    : "rounded btn shadow-none"
                }
              >
                Download Report
              </a>
            </li>
          </ul>
        </div>
        <div className="col-span-10 ">
          {one && (
            <div
              className=""
              style={{
                width: "100%",
                height: "65vh",
              }}
            >
              <div className="w-full max-md:w-[120%] relative bg-white rounded mb-5 flex items-center justify-start  gap-5 flex-wrap max-lg:">
                <div
                  onClick={() => setDatePanel(!datePanel)}
                  className={
                    date && date[0] && date[0].endDate
                      ? "rounded border border-gray-400/60  w-[334px] py-1.5 px-2 text-center hover:cursor-pointer relative h-fit "
                      : "rounded border border-gray-400/60  w-[334px] py-1.5 px-2 text-center hover:cursor-pointer relative h-fit "
                  }
                >
                  {date && date[0] && date[0].endDate
                    ? new Date(date[0].startDate).toLocaleDateString("en-US", {
                        day: "2-digit",
                      }) +
                      "-" +
                      new Date(date[0].startDate).toLocaleDateString("en-US", {
                        month: "2-digit",
                      }) +
                      "-" +
                      new Date(date[0].startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                      }) +
                      " - " +
                      new Date(date[0].endDate).toLocaleDateString("en-US", {
                        day: "2-digit",
                      }) +
                      "-" +
                      new Date(date[0].endDate).toLocaleDateString("en-US", {
                        month: "2-digit",
                      }) +
                      "-" +
                      new Date(date[0].endDate).toLocaleDateString("en-US", {
                        year: "numeric",
                      })
                    : "Select Date"}
                </div>

                <div
                  className={
                    datePanel
                      ? "border rounded absolute left-0 !h-fit  top-11 z-[99999] w-[334px] "
                      : "hidden"
                  }
                >
                  <DateRange
                    maxDate={new Date()}
                    className="rounded shadow-lg "
                    editableDateInputs={false}
                    onChange={(item) => {
                      setDate([item.selection]);
                    }}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                  />
                  <button
                    onClick={() => {
                      date && date[0].endDate && setDatePanel(!datePanel);
                      setMyStartDate(date && date[0].startDate);
                      setMyEndDate(date && date[0].endDate);
                    }}
                    className="h-11 btn btn-primary text-white text-lg w-full rounded-none rounded-br "
                  >
                    Apply
                  </button>
                </div>
                <input
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  type="text"
                  placeholder="Employee name"
                  className="input input-bordered rounded h-10 !w-[335px]"
                />
              </div>
              <div className="flex items-center justify-center w-full max-md:-ml-2 max-md:w-[124%] max-lg:w-[101.5%] max-lg:h-[94.7%] h-full">
                <div className="overflow-x-auto w-full  h-[96%] border-2 rounded">
                  <table className="table relative w-full border">
                    {/* head */}
                    <thead className="">
                      <tr className="border border-black">
                        <th className=" border border-black sticky top-0 px-6 py-3 text-black bg-appColor">
                          ID
                        </th>
                        <th className="border border-black sticky top-0 px-6 py-3 text-black bg-appColor">
                          Name
                        </th>
                        <th className="border border-black sticky top-0 px-6 py-3 text-black bg-appColor">
                          Working Days
                        </th>
                        <th className="border border-black sticky top-0 px-6 py-3 text-black bg-appColor">
                          Total Strikes
                        </th>
                        <th className="border border-black sticky top-0 px-6 py-3 text-black bg-appColor">
                          Late Check-In
                        </th>
                        <th className="border border-black sticky top-0 px-6 py-3 text-black bg-appColor">
                          Half Leave
                        </th>
                        <th className="border border-black sticky top-0 px-6 py-3 text-black bg-appColor">
                          Short Leave
                        </th>
                        <th className="border border-black sticky top-0 px-6 py-3 text-black bg-appColor">
                          Extra Time (Hrs)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="mt-20">
                      {/* row 1 */}
                      {customUsers &&
                        customUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-appColor/20 border border-black"
                          >
                            <th className="text-center font-medium border border-black">
                              {user.id}
                            </th>
                            <th className="text-left font-medium border border-black">
                              {user.name}
                            </th>
                            <th className="text-center font-medium border border-black">
                              {user.ok +
                                user.late_strike +
                                user.half_leave +
                                user.short_leave}
                            </th>
                            <th className="text-center font-medium border border-black">
                              {user.late_strike +
                                user.half_leave +
                                user.short_leave}
                            </th>
                            <th className="text-center font-medium border border-black">
                              {user.late_strike}
                            </th>
                            <th className="text-center font-medium border border-black">
                              {user.half_leave}
                            </th>
                            <th className="text-center font-medium border border-black">
                              {user.short_leave}
                            </th>
                            <th className="text-center font-medium border border-black">
                              {user.extra_time}
                            </th>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {two && (
            <div className="w-full h-full"> {renderAttendanceTable()}</div>
          )}
          {three && (
            <div className="w-full h-full flex items-start justify-center">
              <FileUploader />
            </div>
          )}
          {four && (
            <div className="w-full h-full">
              <FileDownloader />
            </div>
          )}
        </div>
      </section>
    </section>
  );
}

export default AttendanceReport;
