import React, { useState, useEffect } from "react";
import axios from "axios";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { DateRange } from "react-date-range";

function FileDownloader() {
  const [users, setUsers] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [datePanel, setDatePanel] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://phs.azzappointments.com/apis/public/api/admin/attendance-reports1"
        );
        if (response.data && response.data.length > 0) {
          setUsers(response.data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on component mount

  useEffect(() => {
    if (users.length > 0) {
      extractUniqueDates(users);
    }
  }, [users]); // Run when `users` state changes

  const extractUniqueDates = (userData) => {
    const datesSet = new Set();

    userData.forEach((user) => {
      if (user.biometric_trackings) {
        user.biometric_trackings.forEach((biometric) => {
          const date = new Date(biometric.date).toISOString().substr(0, 10); // Extract YYYY-MM-DD format
          datesSet.add(date);
        });
      }
    });

    const sortedDates = Array.from(datesSet).sort();
    setUniqueDates(sortedDates);
  };

  const handleDownload = () => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      alert("Please select a valid date range to download.");
      return;
    }

    const startDate = dateRange[0].startDate.toISOString().substr(0, 10);
    const endDate = dateRange[0].endDate.toISOString().substr(0, 10);

    const selectedDateData = users.filter((user) =>
      user.biometric_trackings.some((biometric) => {
        const biometricDate = new Date(biometric.date)
          .toISOString()
          .substr(0, 10);
        return biometricDate >= startDate && biometricDate <= endDate;
      })
    );

    if (selectedDateData.length === 0) {
      alert(`No data available for the selected date range.`);
      return;
    }

    // Prepare data rows for Excel export
    const dataRows = {};

    selectedDateData.forEach((user) => {
      user.biometric_trackings.forEach((biometric) => {
        const biometricDate = new Date(biometric.date)
          .toISOString()
          .substr(0, 10); // YYYY-MM-DD format

        if (!dataRows[biometricDate]) {
          dataRows[biometricDate] = [];
        }

        dataRows[biometricDate].push({
          userId: user.id,
          userName: user.name,
          bioInTime: biometric.check_in_time || "No data",
          bioOutTime: biometric.check_out_time || "No data",
        });
      });
    });

    // Prepare column headers for Excel export
    const sortedDates = Object.keys(dataRows).sort();
    const dateColumnHeaders = [
      "User ID",
      "User Name",
      "Working Days",
      ...sortedDates,
    ];

    // Build the rows for the Excel file
    const rowData = [];

    selectedDateData.forEach((user) => {
      const row = {
        "User ID": user.id,
        "User Name": user.name,
        "Working Days": 0, // Initialize working days count
      };

      sortedDates.forEach((date) => {
        const biometrics = dataRows[date].find(
          (biometric) => biometric.userId === user.id
        );

        if (biometrics) {
          row[date] = `${formatDateTime(
            biometrics.bioInTime
          )} - ${formatDateTime(biometrics.bioOutTime)}`;
          row["Working Days"]++; // Increment working days count
        } else {
          row[date] = "No data";
        }
      });

      rowData.push(row);
    });

    // Construct wsData
    const wsData = [
      dateColumnHeaders,
      ...rowData.map((row) => Object.values(row)),
    ];

    // Create worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const fileName = `attendance_report_${startDate}_to_${endDate}.xlsx`;
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    FileSaver.saveAs(blob, fileName);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime || isNaN(new Date(dateTime))) {
      return "No data";
    }
    return new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-start gap-2">
        <div className="w-fit h-fit relative shadow-lg bg-white rounded">
          <div
            onClick={() => setDatePanel(!datePanel)}
            className="rounded border border-gray-400/60 w-[334px] py-1.5 px-2 text-center hover:cursor-pointer relative"
          >
            {dateRange[0].startDate && dateRange[0].endDate ? (
              <>
                {dateRange[0].startDate.toLocaleDateString("en-US")} -{" "}
                {dateRange[0].endDate.toLocaleDateString("en-US")}
              </>
            ) : (
              "Select Date Range"
            )}
          </div>

          <div
            className={
              datePanel ? "border rounded absolute left-0 top-11" : "hidden"
            }
          >
            <DateRange
              maxDate={new Date()}
              className="rounded shadow-lg"
              editableDateInputs={true}
              onChange={(item) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
            />
            <button
              onClick={() => setDatePanel(!datePanel)}
              className="h-11 btn btn-primary text-white text-lg w-full rounded-none rounded-br rounded-bl"
            >
              Apply
            </button>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="btn btn-primary text-white font-bold py-2 px-4 rounded"
          disabled={!dateRange[0].startDate || !dateRange[0].endDate}
        >
          Download as Excel
        </button>
      </div>
    </div>
  );
}

export default FileDownloader;
