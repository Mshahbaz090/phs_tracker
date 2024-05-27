import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";

const Screenshots = () => {
  const [response, setResponse] = useState(null);
  const [users, setUsers] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [options, setOptions] = useState([]);

  const [datePanel, setDatePanel] = useState(false);

  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedImgTime, setSelectedImgTime] = useState(null);
  const [selectedName, setSelectedName] = useState(null);

  const [screenshots, setScreenshots] = useState(null);
  const [path, setPath] = useState(null);

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
        // console.log(allUsers);

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

  useEffect(() => {
    if (screenshots === null) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://phs.azzappointments.com/apis/public/api/admin/last-thirty-minute",
        headers: {},
      };

      axios
        .request(config)
        .then((res) => {
          setScreenshots(res.data.screenshots);
          setPath(res.data.screenshot_path);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

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

  const filteredScreenshots =
    (response &&
      response.app_usage &&
      response.app_usage
        .flatMap((item) => item.screen_shots)
        .filter((filter) => {
          const filterDate = new Date(filter.created_at)
            .toISOString()
            .slice(0, 10);
          return (
            (!formattedStartDate || filterDate >= formattedStartDate) &&
            (!formattedEndDate || filterDate <= formattedEndDate)
          );
        })) ||
    [];

  return (
    <>
      {!selectedUserId ? (
        <section className="px-5 py-5 w-full">
          <div className="pb-5 font-semibold text-xl text-center">
            Screenshots
          </div>
          <section className="flex flex-wrap justify-start">
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
              <br />
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
                className="btn hover:bg-appColor bg-appColor text-white text-[16px] h-10 min-h-9 w-22 rounded tracking-wider text-center"
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
          {console.log(screenshots && screenshots)}
          <div className="w-full grid max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 max-2xl:grid-cols-5 grid-cols-6 gap-6 ">
            {screenshots &&
              screenshots
                .sort((a, b) => {
                  return new Date(b.created_at) - new Date(a.created_at);
                })
                .map((shots) => (
                  <div
                    key={shots.id}
                    className="grid grid-cols-1 hover:cursor-zoom-in border rounded w-[200px] bg-white h-fit pt-3 pb-3 px-3 gap-2 font-bold text-center"
                    onClick={() => {
                      document.getElementById("my_modal_3").showModal();
                      setSelectedImg(shots.image);
                      setSelectedImgTime(shots.created_at);
                      setSelectedName(shots.name);
                    }}
                  >
                    <img
                      className="rounded h-28 w-full"
                      draggable={false}
                      src={`${path}${shots.image}`}
                      alt={`Screenshot ${shots.id}`}
                    />
                    <div className="font-medium bg-white grid grid-cols-2 gap-3  text-[14px] justify-items-center  ">
                      <p>{formatDate(shots.created_at).substring(0, 10)}</p>
                      <p className="flex items-center justify-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={16}
                          height={16}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-clock"
                        >
                          <circle cx={12} cy={12} r={10} />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {formatDate(shots.created_at).substring(10, 18)}
                      </p>
                    </div>
                    <div className="text-sm text-center font-bold w-full bg-appColor/50 rounded">
                      {shots.name}
                    </div>
                    <dialog id="my_modal_3" className="modal max cursor-auto">
                      <div
                        onMouseDown={() =>
                          document.getElementById("my_modal_3").close()
                        }
                        className="modal-box max-w-[80rem] h-fit"
                      >
                        <div>{selectedName}</div>
                        <p>{formatDate(selectedImgTime).substring(0, 10)}</p>
                        <p className="flex items-center justify-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-clock mt-[1px]"
                          >
                            <circle cx={12} cy={12} r={10} />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {formatDate(selectedImgTime).substring(10, 18)}
                        </p>

                        <img
                          className="rounded"
                          draggable={false}
                          src={`${path}${selectedImg}`}
                          alt={`Screenshot ${shots.id}`}
                        />
                      </div>
                      <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                      </form>
                    </dialog>
                  </div>
                ))}
          </div>
        </section>
      ) : (
        <section className="px-5 py-5 w-full">
          <div className="pb-5 font-semibold text-xl text-center">
            Screenshots
          </div>
          <section className="flex flex-wrap justify-start">
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
              <br />
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
                className="btn hover:bg-appColor bg-appColor text-white text-[16px] h-10 min-h-9 w-22 rounded tracking-wider text-center"
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
            <section className="w-full h-full  justify-center ">
              <section className="w-full text-center">
                <div className=" grid max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 max-2xl:grid-cols-5 grid-cols-6 gap-6 w-full justify-items-center">
                  {filteredScreenshots.length > 0
                    ? filteredScreenshots.reverse().map((shots) => (
                        <div
                          key={shots.id}
                          className=" grid grid-cols-1 hover:cursor-zoom-in border rounded w-[200px] bg-white h-fit pt-3 pb-3 px-3 gap-2 font-bold"
                          onClick={() => {
                            document.getElementById("my_modal_2").showModal();
                            setSelectedImg(shots.image);
                            setSelectedImgTime(shots.created_at);
                            setSelectedName(shots.name);
                          }}
                        >
                          <img
                            className="grid max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 max-2xl:grid-cols-5 grid-cols-6 gap-6"
                            draggable={false}
                            src={`${response.screenshot_path}${shots.image}`}
                            alt={`Screenshot ${shots.id}`}
                          />
                          <p className="font-medium bg-white grid grid-cols-2 gap-3  text-[14px] justify-items-center">
                            <p>
                              {formatDate(shots.created_at).substring(0, 10)}
                            </p>
                            <p className="flex items-center justify-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-clock"
                              >
                                <circle cx={12} cy={12} r={10} />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              {formatDate(shots.created_at).substring(10, 18)}
                            </p>
                          </p>
                          <dialog
                            id="my_modal_2"
                            className="modal max cursor-auto"
                          >
                            <div
                              onMouseDown={() =>
                                document.getElementById("my_modal_2").close()
                              }
                              className="modal-box max-w-[80rem] h-fit"
                            >
                              <div className="tracking-wider text-center font-semibold mb-5 text-lg max-sm:text-sm max-md:text-md text-black flex items-center justify-center gap-5 ">
                                <p>
                                  {formatDate(selectedImgTime).substring(0, 10)}
                                </p>
                                <p className="flex items-center justify-center gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-clock mt-[1px]"
                                  >
                                    <circle cx={12} cy={12} r={10} />
                                    <polyline points="12 6 12 12 16 14" />
                                  </svg>
                                  {formatDate(selectedImgTime).substring(
                                    10,
                                    18
                                  )}
                                </p>
                              </div>
                              <img
                                className="rounded"
                                draggable={false}
                                src={`${response.screenshot_path}${selectedImg}`}
                                alt={`Screenshot ${shots.id}`}
                              />
                            </div>
                            <form method="dialog" className="modal-backdrop">
                              <button>close</button>
                            </form>
                          </dialog>
                        </div>
                      ))
                    : selectedUserId &&
                      date[0].endDate &&
                      response &&
                      response.app_usage &&
                      filteredScreenshots.length === 0 && (
                        <div className=" py-3 px-5 text-md font-medium text-gray-400 flex bg-gray-100/50 border rounded h-fit">
                          No data found.
                        </div>
                      )}

                  <div className="w-full h-full ">
                    {!selectedUserId ? (
                      <div className="text-nowrap w-fit py-5 px-5 text-md font-medium text-gray-400 flex  bg-gray-100/50 border rounded">
                        Please select a user to view the screenshots.
                      </div>
                    ) : date[0].endDate ? (
                      ""
                    ) : (
                      <div className=" text-nowrap w-fit py-5 px-5 text-md font-medium text-gray-400 flex  bg-gray-100/50 border rounded">
                        Please select a date range to view the screenshots.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </section>
          )}
        </section>
      )}
    </>
  );
};

export default Screenshots;
