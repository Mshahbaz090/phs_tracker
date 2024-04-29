import axios from "axios";
import React, { useState } from "react";

function FileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(
    "Please select a file to upload."
  );
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "https://phs.azzappointments.com/apis/public/api/upload-biometric-sheet",
        formData
      );

      //console.log("FileUploadresponse", response.data);
      setUploadStatus("File Uploaded.");

      setTimeout(() => {
        setUploadStatus("Please select a file to upload.");
        setLoading(false); // Stop loading
      }, 3000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Failed to upload file.");
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="btn btn-primary rounded-pill text-white"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Click to Upload"}
      </button>
      {uploadStatus && <p className="file-status">{uploadStatus}</p>}
    </div>
  );
}

export default FileUploader;
