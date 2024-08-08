import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";

const AppUsage = () => {
  const [response, setResponse] = useState(nul);
  const [users, setUsers] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [options, setOptions] = useState([]);

  const [datePanel, setDatePanel] = useState(false);

  useEffect(() => {
    if (selectedOption) {
      setSelectedUserId(selectedOption.value); // Assuming selectedOption is an object with a 'value' key
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
          "https://phs.azzappointments.com/apis/public/api/admin/app-usage",
          {
            user_id: selectedUserId,
          }
        )
        .then((res) => {
          setResponse(res.data);
          if (response && response.app_usage && response.app_usage === null) {
            setResponse(null);
          }
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
  const formatUsageTime = (seconds) => {
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

  const filteredScreenshots =
    response &&
    response.app_usage &&
    response.app_usage.filter((filter) => {
      const filterDate = new Date(filter.created_at).toISOString().slice(0, 10);
      return (
        (!formattedStartDate || filterDate >= formattedStartDate) &&
        (!formattedEndDate || filterDate <= formattedEndDate)
      );
    });

  return (
    <section className="px-5 py-5 w-full ">
      <div className="pb-5 font-semibold text-xl text-center">App Usage</div>

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
              className="h-11  btn btn-primary bg-appColor text-white text-lg w-full rounded-none rounded-br rounded-bl"
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
      {filteredScreenshots && (
        <section className="flex flex-col items-center justify-center pt-5">
          <section className="w-full ">
            <div className="">
              {filteredScreenshots.length > 0 ? (
                <div className="h-[70vh] overflow-y-scroll">
                  <table className="table border ">
                    {/* head */}
                    <thead className="bg-gray-300">
                      <tr>
                        <th className="sticky top-0 bg-gray-300 text-black">
                          App
                        </th>
                        <th className="sticky top-0 bg-gray-300 text-black">
                          Usage Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredScreenshots.map((usage) =>
                        // Sort the app_usage array based on usage time
                        usage.app_usage
                          .filter(
                            (item) =>
                              item.usage >= 60 &&
                              item.app &&
                              item.app.trim() !== ""
                          )
                          .sort((a, b) => b.usage - a.usage) // Sort by numerical usage in descending order
                          .flatMap((item, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                              <td className="w-[80%] cursor-pointer hover:font-semibold hover:text-appColor">
                                {item.app.replace("● ", "")}
                              </td>
                              <td className="w-[20%] text-red-300 font-medium">
                                {formatUsageTime(item.usage)}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center h-[70vh] text-nowrap max-sm:ml-0 mt-2 border rounded">
                  <div className=" px-3 py-3 ml-[90px] mt-5 text-md font-medium text-gray-400 flex bg-gray-100/50 border rounded w-fit">
                    No data found.
                  </div>
                </div>
              )}
            </div>
          </section>
        </section>
      )}

      {filteredScreenshots ? (
        ""
      ) : (
        <div className="text-center h-[70vh] text-nowrap max-sm:ml-0 mt-7 ">
          <div className=" h-[70vh] border-2 rounded">
            {!selectedUserId ? (
              <div className=" py-3 px-5 ml-[80px] mt-5 text-md font-medium text-gray-400 flex bg-gray-100/50 border rounded w-fit">
                Please select an employee to view the app usage.
              </div>
            ) : date[0].endDate ? (
              ""
            ) : (
              <div className=" py-3 px-5   ml-[80px] mt-5 text-md font-medium text-gray-400 flex bg-gray-100/50 border rounded w-fit">
                Please select a date range to view the app usage.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
export default AppUsage;
