import React, { useState, useEffect } from "react";
import axios from "axios";
import FileUploader from "./FileUploader";
import FileDownloader from "./Filedownloader";
import { Component } from "react";
import { StickyTable, Row, Cell } from "react-sticky-table";

function AttendanceReport() {
  const [one, setOne] = useState(false);
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(false);
  const [four, setFour] = useState(false);

  const [users, setUsers] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [employeeWorkingDays, setEmployeeWorkingDays] = useState({});

  const [employeeLateCheckIn, setEmployeeLateCheckIn] = useState({});

  useEffect(() => {
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
  }, []);

  const extractUniqueDates = (userData) => {
    const datesSet = new Set();
    const workingDaysByEmployee = {};

    const lateCheckInByEmployee = {};

    userData.forEach((user) => {
      const userId = user.id;
      let workingDaysCount = 0;

      let lateCheckInDaysCount = 0;

      if (user.biometric_trackings) {
        user.biometric_trackings.forEach((biometric) => {
          const date = new Date(biometric.date).toISOString().substr(0, 10);
          datesSet.add(date);
          workingDaysCount++;
        });
      }

      if (user.biometric_trackings) {
        user.biometric_trackings.forEach((biometric) => {
          if (biometric.late_strike !== "False") {
            lateCheckInDaysCount++;
          }
        });
      }

      if (user.trackings) {
        user.trackings.forEach((tracking) => {
          const date = new Date(tracking.check_in_time)
            .toISOString()
            .substr(0, 10);
          datesSet.add(date);
        });
      }

      lateCheckInByEmployee[userId] = lateCheckInDaysCount;
      workingDaysByEmployee[userId] = workingDaysCount;
    });

    const sortedDates = Array.from(datesSet).sort();
    setUniqueDates(sortedDates);
    setEmployeeWorkingDays(workingDaysByEmployee);

    setEmployeeLateCheckIn(lateCheckInByEmployee);
  };
  //console.log(employeeAbsenCellays && employeeAbsenCellays);

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

  const renderAttendanceTable = () => {
    return (
      <div>
        <div style={{ width: "100%", height: "70vh" }}>
          <StickyTable
            borderWidth={0}
            stickyHeaderCount={1}
            leftStickyColumnCount={4}
          >
            <Row>
              <Cell
                style={{ backgroundColor: "#FBA834" }}
                className="border border-gray-400 px-4 py-2 text-nowrap"
              >
                User ID
              </Cell>
              <Cell
                style={{ backgroundColor: "#FBA834" }}
                className="border border-gray-400 px-4 py-2 text-nowrap"
              >
                Name
              </Cell>
              <Cell
                style={{ backgroundColor: "#FBA834" }}
                className="border border-gray-400 px-4 py-2 text-nowrap"
              >
                Working Days
              </Cell>
              <Cell
                style={{ backgroundColor: "#FBA834" }}
                className="border border-gray-400 px-4 py-2 text-nowrap"
              >
                Late Check-In
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
                <Cell className="border border-gray-400 px-4 py-2  bg-white">
                  {user.id}
                </Cell>
                <Cell className="border border-gray-400 px-4 py-2">
                  {user.name}
                </Cell>
                <Cell className="border border-gray-400 px-4 py-2">
                  {employeeWorkingDays[user.id] || 0}
                </Cell>

                <Cell className="border border-gray-400 px-4 py-2">
                  {employeeLateCheckIn[user.id] || 0}
                </Cell>
                {uniqueDates.map((date) => {
                  const biometricTracking = user.biometric_trackings.find(
                    (biometric) =>
                      new Date(biometric.date).toISOString().substr(0, 10) ===
                      date
                  );

                  const backgroundColor =
                    !biometricTracking ||
                    !biometricTracking.late_strike ||
                    !user.shift_time
                      ? "" // Apply yellow background if data is missing
                      : biometricTracking.late_strike === "True"
                      ? "pink" // Apply red background if check_in_time is late
                      : "lightGreen"; // No special background if check_in_time is on time or earlier
                  return (
                    <Cell
                      className="border border-gray-400 px-4 py-2 text-nowrap"
                      key={`${user.id}-${date}`}
                      style={{ backgroundColor }}
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
      <div className="pb-5 font-semibold text-xl text-center ">
        Attendance Report
      </div>

      <section className=" grid grid-cols-12 border-2 py-5 px-2 rounded h-[75vh]">
        <div className=" col-span-2   border-r-2 border-gray-600">
          <ul className="menu bg-base-200 w-full rounded gap-1">
            <li>
              <a
                onClick={() => {
                  setOne(true);
                  setTwo(false);
                  setThree(false);
                  setFour(false);
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
            <div className="w-full h-full">
              <div className="overflow-x-auto border">
                <table className="table text-center">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Employees</th>
                      <th>Worked Days</th>
                      <th>Late Check-In Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    <tr className="hover">
                      <td>Adil Waheed</td>
                      <td>20</td>
                      <td>3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {two && (
            <div className="w-full h-full"> {renderAttendanceTable()}</div>
          )}
          {three && (
            <div className="w-full h-full">
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
