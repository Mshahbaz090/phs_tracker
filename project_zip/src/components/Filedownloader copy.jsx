import React, { useState, useEffect } from "react";
import axios from "axios";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";

function Filedownloader() {
  const [users, setUsers] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://phs.azzappointments.com/apis/public/api/admin/attendance-reports1"
        );
        if (response.data !== null && response.data !== undefined) {
          setUsers(response.data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      extractUniqueDates(users);
    }
  }, [users]);

  const extractUniqueDates = (userData) => {
    const datesSet = new Set();

    userData.forEach((user) => {
      if (user.biometric_trackings) {
        user.biometric_trackings.forEach((biometric) => {
          const date = new Date(biometric.date).toISOString().substr(0, 7); // Extract YYYY-MM format
          datesSet.add(date);
        });
      }
    });

    const sortedDates = Array.from(datesSet).sort();
    setUniqueDates(sortedDates);
  };

  const handleDownload = () => {
    if (!selectedMonth) {
      alert("Please select a month to download.");
      return;
    }

    const selectedMonthData = users.filter((user) =>
      user.biometric_trackings.some(
        (biometric) =>
          new Date(biometric.date).toISOString().substr(0, 7) === selectedMonth
      )
    );

    if (selectedMonthData.length === 0) {
      alert(`No data available for the month ${selectedMonth}.`);
      return;
    }

    // Prepare data rows for Excel export
    const dataRows = [];

    // Create a map to store biometric data grouped by date
    const dateBiometricsMap = {};

    selectedMonthData.forEach((user) => {
      user.biometric_trackings.forEach((biometric) => {
        const biometricDate = new Date(biometric.date)
          .toISOString()
          .substr(0, 10); // Extract YYYY-MM-DD format

        // Create an entry for this date if it doesn't exist
        if (!dateBiometricsMap[biometricDate]) {
          dateBiometricsMap[biometricDate] = [];
        }

        // Add biometric data to the corresponding date
        dateBiometricsMap[biometricDate].push({
          userId: user.id,
          userName: user.name,
          bioInTime: biometric.check_in_time || "No data",
          bioOutTime: biometric.check_out_time || "No data",
        });
      });
    });

    // Sort the unique dates in ascending order
    const sortedDates = Object.keys(dateBiometricsMap).sort();

    // Prepare column headers for Excel export
    const dateColumnHeaders = sortedDates.map((date) => `${date}`);

    // Build the rows for the Excel file
    sortedDates.forEach((date) => {
      dateBiometricsMap[date].forEach((biometric) => {
        const { userId, userName, bioInTime, bioOutTime } = biometric;
        const rowData = [
          userId,
          userName,
          formatDateTime(bioInTime),
          formatDateTime(bioOutTime),
        ];

        // Push row data with date as the first column
        dataRows.push([date, ...rowData]);
      });
    });

    // Add column headers to the beginning of dataRows
    const wsData = [
      ["Date", "User ID", "User Name", "Bio In Time", "Bio Out Time"],
      ...dataRows,
    ];

    // Create worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const fileName = `attendance_report_${selectedMonth}.xlsx`;
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
      <label htmlFor="monthSelect">Select Month:</label>
      <select
        id="monthSelect"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        <option value="">-- Select Month --</option>
        {uniqueDates.map((date) => (
          <option key={date} value={date}>
            {new Date(date).toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </option>
        ))}
      </select>
      <button
        onClick={handleDownload}
        className={
          !selectedMonth
            ? "btn text-white font-bold py-2 px-4 rounded mb-5"
            : "btn btn-primary text-white font-bold py-2 px-4 rounded mb-5"
        }
        disabled={!selectedMonth}
      >
        Download as Excel
      </button>
    </div>
  );
}

export default Filedownloader;
