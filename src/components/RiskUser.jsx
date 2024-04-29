import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import moment from "moment-timezone";

const RiskUser = () => {
  const [response, setResponse] = useState(null);
  const [users, setUsers] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [options, setOptions] = useState([]);
  const [datePanel, setDatePanel] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState(null); // New state variable for selected user's name

  useEffect(() => {
    if (selectedOption) {
      setSelectedUserId(selectedOption.value); // Assuming selectedOption is an object with a 'value' key
      setSelectedUserName(selectedOption.label);
    }
  }, [selectedOption]); // This effect runs every time selectedOption changes

  //! DATE ******************
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  useEffect(() => {
    axios
      .get("https://phs.azzappointments.com/apis/public/api/admin/active-users")
      .then((res) => {
        const allUsers = res.data.users.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setUsers(allUsers);

        const userList = allUsers
          .map((item) => item.name + -+item.id)
          .map((user) => {
            const [name, id] = user.split("-");

            return { value: id, label: name };
          });
        setOptions(userList);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const handleScreenshots = () => {
    if (selectedUserId && date[0].endDate) {
      axios
        .post(
          "https://phs.azzappointments.com/apis/public/api/admin/idealusage",
          {
            user_id: selectedUserId,
            start_date: date[0].startDate.toISOString().split("T")[0], // Format start date to ISO string
            end_date: date[0].endDate.toISOString().split("T")[0], // Format end date to ISO string
          }
        )
        .then((res) => {
          const responseData = res.data;
          setResponse(responseData);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

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

  const formatIdealTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} ${hours === 1 ? "hour" : "hours"} ${
        remainingMinutes > 0
          ? `${remainingMinutes} ${
              remainingMinutes === 1 ? "minute" : "minutes"
            }`
          : ""
      }`;
    }
  };
  function convertTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const filteredScreenshots =
    response &&
    response.Low_time &&
    response.Low_time.filter((filter) => {
      const filterDate = new Date(filter.created_at).toISOString().slice(0, 10);
      return (
        (!formattedStartDate || filterDate >= formattedStartDate) &&
        (!formattedEndDate || filterDate <= formattedEndDate)
      );
    });

  const calculateWorkingTime = (checkInTime, breakTime, checkOutTime) => {
    const nyTimezone = "America/New_York";
    const currentTimeNY = moment().tz(nyTimezone);
    const checkInTimeNY = moment.tz(checkInTime, nyTimezone);
    //console.log("checkInTimeNY", checkInTimeNY);

    let checkOutTimeNY;
    if (checkOutTime) {
      checkOutTimeNY = moment.tz(checkOutTime, nyTimezone);
    } else {
      checkOutTimeNY = currentTimeNY;
    }
    //console.log("checkOutTimeNY", checkOutTimeNY);
    const checkdiff = checkOutTimeNY.diff(checkInTimeNY, "minutes");
    //console.log("checkdiff", checkdiff);

    const timeDifferenceMinutes = checkOutTimeNY.diff(checkInTimeNY, "minutes");

    const workingTimeSeconds = (timeDifferenceMinutes - breakTime) * 60;
    //console.log("breakTime", breakTime);
    return formatIdealTime(workingTimeSeconds);
  };

  const calculateIdealTime = (
    checkInTime,
    idealTime,
    breakTime,
    checkOutTime
  ) => {
    // Get current time in New York time zone
    const nyTimezone = "America/New_York";
    const currentTimeNY = moment().tz(nyTimezone);
    const checkInTimeNY = moment.tz(checkInTime, nyTimezone);

    let checkOutTimeNY;
    if (checkOutTime) {
      checkOutTimeNY = moment.tz(checkOutTime, nyTimezone);
    } else {
      checkOutTimeNY = currentTimeNY;
    }
    //console.log("checkOutTimeNY", checkOutTimeNY);
    const checkdiff = checkOutTimeNY.diff(checkInTimeNY, "minutes");
    //console.log("checkdiff", checkdiff);

    const timeDifferenceMinutes = checkOutTimeNY.diff(checkInTimeNY, "minutes");

    const workingTime = (timeDifferenceMinutes - breakTime) * 60;
    //console.log(workingTime);
    //console.log(idealTime);
    const idealWorkingTime = workingTime - idealTime;

    return formatIdealTime(idealWorkingTime);
  };

  return (
    <section className="px-5 py-5 w-full ">
      <div className="pb-5 font-semibold text-xl text-center">Working Time</div>

      <section className="flex items-center justify-start gap-2  ">
        <div className="w-[220px] min-w-[220px] h-fit">
          <Select
            className="shadow-lg"
            defaultValue={selectedOption}
            onChange={(Choice) => {
              setSelectedOption(Choice);
              setDate([
                {
                  startDate: new Date(),
                  endDate: null,
                  key: "selection",
                },
              ]);
              setResponse(null);
            }}
            options={options}
            placeholder={"Search Employee"}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,

                "&:hover": {
                  cursor: "pointer",
                },
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: state.isSelected ? "#cce1fc" : "white",
                color: "black",
                "&:hover": {
                  backgroundColor: "#DBEAFE",
                  cursor: "pointer",
                  color: "black",
                },
              }),
            }}
          />
        </div>

        <div className="w-fit h-fit relative shadow-lg bg-white rounded ">
          {selectedUserId && (
            <div
              onClick={() => setDatePanel(!datePanel)}
              className={
                date && date[0] && date[0].endDate
                  ? "rounded border border-gray-400/60  w-[334px] py-1.5 px-2 text-center hover:cursor-pointer relative "
                  : "rounded border border-gray-400/60  w-[334px] py-1.5 px-2 text-center hover:cursor-pointer relative  "
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
          )}

          <div
            style={{ zIndex: "999" }}
            className={
              datePanel ? "border rounded absolute left-0 top-11" : "hidden"
            }
          >
            <DateRange
              maxDate={new Date()}
              className="rounded shadow-lg"
              editableDateInputs={false}
              onChange={(item) => {
                setDate([item.selection]);
                setResponse(null);
              }}
              moveRangeOnFirstSelection={false}
              ranges={date}
            />
            <button
              onClick={() => {
                setDatePanel(!datePanel);
              }}
              className="h-11 hover:bg-blue-600 bg-blue-500 text-white text-lg w-full rounded-none rounded-br rounded-bl"
            >
              Apply
            </button>
          </div>
        </div>
        {date && date[0] && date[0].endDate ? (
          <button
            onClick={handleScreenshots}
            onMouseDown={() => setDatePanel(false)}
            className="btn hover:bg-appColor bg-appColor text-white text-[16px] h-10 min-h-9 w-22 rounded tracking-wider text-center  "
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search"
              >
                <circle cx={11} cy={11} r={8} />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <span>Search</span>
          </button>
        ) : (
          ""
        )}
      </section>

      {response && response.code === "success" && response.Low_time && (
        <section className="flex flex-col items-start justify-start  mt-10 h-[65vh] ">
          <div className="flex flex-wrap  h-[35vh] ">
            <div className=" border-r border-gray-300 w-fit p-4 pt-10  ">
              {selectedUserName}
            </div>
            {filteredScreenshots.map((item, index) => (
              <div>
                <div key={index} className="flex h-fit ml-1 flex-wrap  ">
                  <div className="ml-2 flex flex-col items-start justify-center border rounded w-44  bg-white border-gray-300 shadow-md hover:cursor-pointer  hover:shadow-lg gap-1  ">
                    <div className="text-sm  font-medium text-center bg-gray-200 w-full py-1">
                      {convertTimestamp(item.check_in_time)}
                    </div>
                    <div className="py-2 px-3 flex flex-col gap-1">
                      <div className="text-sm font-medium text-appColor">
                        Working Time
                      </div>
                      <div className="text-sm -mt-1 ">
                        {calculateWorkingTime(
                          item.check_in_time,
                          item.break_time,
                          item.check_out_time
                        )}
                      </div>
                      <div className="text-sm font-semibold text-green-400">
                        Ideal Time
                      </div>
                      <div className="text-sm -mt-1">
                        {calculateIdealTime(
                          item.check_in_time,
                          item.ideal_time,
                          item.break_time,
                          item.check_out_time
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {filteredScreenshots ? (
        ""
      ) : (
        <div className="text-center h-[70vh] text-nowrap max-sm:ml-0 mt-7 ">
          <div className="h-[70vh] border-2 rounded">
            {!selectedUserId ? (
              <div className=" py-3 px-5 ml-[80px] mt-5 text-md font-medium text-gray-400 flex bg-gray-100/50 border rounded w-fit">
                Please select an employee to view the risk users details.
              </div>
            ) : date[0].endDate ? (
              " "
            ) : (
              <div className=" py-3 px-5   ml-[80px] mt-5 text-md font-medium text-gray-400 flex bg-gray-100/50 border rounded w-fit">
                Please select a date range to view risk user details.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
export default RiskUser;
