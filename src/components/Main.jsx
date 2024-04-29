import { useState } from "react";
import Dashboard from "./Dashboard";
import AddEmployeeForm from "./Forms/AddEmployeeForm";
import EmployeeDetails from "./EmployeeDetails";
import AttendanceReport from "./AttendanceReport";
import AppUsage from "./AppUsage";
import Screenshots from "./Screenshots";
import { useSelector, useDispatch } from "react-redux";
import { addScreen } from "../Redux/screenSlice";
import HR from "/public/hr.png";
import RiskUser from "./RiskUser";

const Main = () => {
  const currentScreen = useSelector((state) => state.screen[0]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loginEmail, setLoginEmail] = useState(null);
  const [loginPassword, setLoginPassword] = useState(null);
  const [activeComponent, setActiveComponent] = useState("Dashboard");

  const dispatch = useDispatch();

  const handleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (loginEmail === "phs_hr@gmail.com") {
      if (loginPassword === "PHS_HR@123456") {
        dispatch(addScreen(true));
      } else {
        alert("Incorrect password");
      }
    } else {
      alert("Incorrect email address");
    }
  };

  return (
    <>
      {currentScreen ? (
        <>
          <div className="lg:hidden flex justify-between p-5 h-20  ">
            <img className="" draggable={false} src="/logo.png" alt="a" />
            <div className="flex items-center justify-center">
              <div
                onClick={() => setActiveComponent("AddEmployeeForm")}
                className="btn  btn-primary text-white"
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
                    className="lucide lucide-user-plus"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx={9} cy={7} r={4} />
                    <line x1={19} x2={19} y1={8} y2={14} />
                    <line x1={22} x2={16} y1={11} y2={11} />
                  </svg>
                </span>
              </div>
              <div className="flex space-y-0 space-x-2 p-2 cursor-pointer items-center ">
                <details className="dropdown">
                  <summary className="m-1 btn rounded-xl  btn-primary text-white">
                    <img
                      draggable={false}
                      className="w-9 h-9 rounded-full"
                      src={HR}
                      alt=""
                    />
                  </summary>
                  <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-[150px] right-0 ">
                    <li onClick={() => dispatch(addScreen(false))}>
                      <a>Log out</a>
                    </li>
                  </ul>
                </details>
              </div>
              <span
                onClick={handleMobileMenu}
                className="btn btn-md  btn-primary text-white"
              >
                <svg
                  className="cursor-pointer w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </span>
            </div>
          </div>

          <div className=" grid lg:grid-cols-8 grid-cols-1 max-lg:h-fit h-screen  ">
            <div
              id="sidebar"
              className={
                mobileMenu
                  ? " bg-blueColor/10 p-5 gap-4 flex flex-col "
                  : "max-lg:hidden lg:flex col-span-1 bg-blueColor/10 border-r-4 border-gray-500 p-5 gap-4 flex flex-col  "
              }
            >
              <img
                draggable={false}
                src="/logo.png"
                className="hidden lg:block w-4/5 p-2"
              />
              <div className="flex flex-col items-start justify-center gap-5  ">
                <div
                  onClick={() => setActiveComponent("Dashboard")}
                  className="font-semibold flex items-center justify-center gap-2 hover:cursor-pointer group/dashboard  "
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
                      className="lucide lucide-layout-dashboard"
                    >
                      <rect width={7} height={9} x={3} y={3} rx={1} />
                      <rect width={7} height={5} x={14} y={3} rx={1} />
                      <rect width={7} height={9} x={14} y={12} rx={1} />
                      <rect width={7} height={5} x={3} y={16} rx={1} />
                    </svg>
                  </span>
                  <span
                    className={
                      activeComponent === "Dashboard"
                        ? "group-hover/dashboard:underline text-blueColor "
                        : "group-hover/dashboard:underline"
                    }
                  >
                    Dashboard
                  </span>
                </div>

                <div className="flex flex-col items-start justify-center gap-2">
                  <div className="font-semibold flex items-center justify-start gap-2 ">
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
                        className="lucide lucide-user"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx={12} cy={7} r={4} />
                      </svg>
                    </span>
                    Employees
                  </div>

                  <div
                    onClick={() => setActiveComponent("EmployeeDetails")}
                    className={
                      activeComponent === "EmployeeDetails"
                        ? "flex items-center justify-center gap-2 hover:cursor-pointer text-[14px] hover:underline  self-start text-blueColor font-medium "
                        : "flex items-center justify-center gap-2 hover:cursor-pointer text-[14px] hover:underline  self-start"
                    }
                  >
                    Employee Details
                  </div>
                  <div
                    onClick={() => setActiveComponent("AddEmployeeForm")}
                    className={
                      activeComponent === "AddEmployeeForm"
                        ? "flex items-center justify-center gap-2 hover:cursor-pointer text-[14px] hover:underline  self-start  text-blueColor font-medium "
                        : " flex items-center justify-center gap-2 hover:cursor-pointer text-[14px] hover:underline  self-start"
                    }
                  >
                    Add Employee
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center gap-2">
                  <div className="font-semibold flex items-center justify-start gap-2 ">
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
                        className="lucide lucide-notebook-pen"
                      >
                        <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
                        <path d="M2 6h4" />
                        <path d="M2 10h4" />
                        <path d="M2 14h4" />
                        <path d="M2 18h4" />
                        <path d="M18.4 2.6a2.17 2.17 0 0 1 3 3L16 11l-4 1 1-4Z" />
                      </svg>
                    </span>
                    Attendance
                  </div>
                  <div
                    onClick={() => setActiveComponent("AttendanceReport")}
                    className={
                      activeComponent === "AttendanceReport"
                        ? "flex items-center justify-center gap-2 hover:cursor-pointer text-[14px] hover:underline  self-center  text-blueColor font-medium "
                        : " flex items-center justify-center gap-2 hover:cursor-pointer text-[14px] hover:underline  self-center"
                    }
                  >
                    Attendance Report
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center gap-2 ">
                  <div className="font-semibold flex items-center justify-center gap-2 ">
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
                        className="lucide lucide-square-activity"
                      >
                        <rect width={18} height={18} x={3} y={3} rx={2} />
                        <path d="M17 12h-2l-2 5-2-10-2 5H7" />
                      </svg>
                    </span>
                    Tracking
                  </div>
                  <div
                    onClick={() => setActiveComponent("AppUsage")}
                    className={
                      activeComponent === "AppUsage"
                        ? "flex items-center justify-center gap-2 hover:cursor-pointer text-[14px] hover:underline self-start   text-blueColor font-medium "
                        : "flex items-center justify-center gap-2 hover:cursor-pointer text-[14px] hover:underline self-start"
                    }
                  >
                    App Usage
                  </div>
                  <div
                    onClick={() => setActiveComponent("Screenshots")}
                    className={
                      activeComponent === "Screenshots"
                        ? "flex items-center justify-center gap-2 hover:cursor-pointer text-[14px] hover:underline  self-start  text-blueColor font-medium "
                        : "flex items-center justify-center gap-2 hover:cursor-pointer text-[14px] hover:underline  self-start"
                    }
                  >
                    Screenshots
                  </div>
                  <div
                    onClick={() => setActiveComponent("RiskUsers")}
                    className={
                      activeComponent === "RiskUsers"
                        ? "flex items-center justify-center gap-2 hover:cursor-pointer text-[14px] hover:underline  self-start   text-blueColor  font-medium"
                        : "flex items-center justify-center gap-2 hover:cursor-pointer text-[14px] hover:underline  self-start"
                    }
                  >
                    Working Time
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-7 border border-gray-200  ">
              <div className="flex p-5 flex-row justify-between items-center max-lg:hidden">
                <h1 className="font-bold text-blueColor text-xl tracking-wider drop-shadow-sm	  ">
                  PHS Tracking Dashboard
                </h1>
                <div className="flex items-center justify-center">
                  <div
                    onClick={() => setActiveComponent("AddEmployeeForm")}
                    className="btn btn-primary  text-white"
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
                        className="lucide lucide-user-plus"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx={9} cy={7} r={4} />
                        <line x1={19} x2={19} y1={8} y2={14} />
                        <line x1={22} x2={16} y1={11} y2={11} />
                      </svg>
                    </span>
                    Add Employee
                  </div>
                  <div className="flex space-y-0 space-x-2 p-2 cursor-pointer items-center ">
                    <details className="dropdown">
                      <summary className="m-1 btn rounded-xl  btn-primary text-white">
                        <img
                          draggable={false}
                          className="w-9 h-9 rounded-full border-2 border-white"
                          src={HR}
                          alt=""
                        />
                      </summary>
                      <ul className="p-2 shadow menu dropdown-content z-[1] bg-blueColor/20 rounded-box w-[150px] right-0">
                        <li
                          className=""
                          onClick={() => dispatch(addScreen(false))}
                        >
                          <a className="hover:bg-blueColor/30">Log out</a>
                        </li>
                      </ul>
                    </details>
                  </div>
                </div>
              </div>
              <hr />

              <div className="flex items-start justify-center overflow-y-scroll h-[90vh]">
                {activeComponent === "Dashboard" && <Dashboard />}
                {activeComponent === "AddEmployeeForm" && <AddEmployeeForm />}
                {activeComponent === "EmployeeDetails" && <EmployeeDetails />}
                {activeComponent === "AttendanceReport" && <AttendanceReport />}
                {activeComponent === "AppUsage" && <AppUsage />}
                {activeComponent === "Screenshots" && <Screenshots />}
                {activeComponent === "RiskUsers" && <RiskUser />}
              </div>
            </div>
          </div>
        </>
      ) : (
        <section className=" !h-screen w-full">
          <div className="flex items-center justify-center w-full h-full">
            <form
              onSubmit={handleLogin}
              className="py-20 px-28 border-2 shadow-2xl rounded-xl flex flex-col items-center justify-center gap-10"
            >
              <div className="-mt-16  flex flex-col items-center justify-center gap-2 ">
                <img
                  className="h-20  rounded-xl"
                  draggable={false}
                  src="/logo.png"
                  alt="a"
                />
                <div className=" font-bold text-xl text-blueColor tracking-wider">
                  PHS Tracking Dashboard
                </div>
              </div>
              <input
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                type="email"
                placeholder="Enter email address"
                className="input input-bordered w-full max-w-xs"
              />

              <input
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                type="password"
                placeholder="Enter password"
                className="input input-bordered w-full max-w-xs -mt-5 -mb-5"
              />

              <button
                type="submit"
                className="btn btn-primary text-white w-full shadow-lg -mb-10"
              >
                Log in
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default Main;
