import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function FileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(
    "Please select a file to upload."
  );
  const [loading, setLoading] = useState(false);

  const notifySuccess = (txt) => toast.success(txt);
  const notifyError = (txt) => toast.error(txt);

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

      notifySuccess(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Failed to upload file.");
      setLoading(false); // Stop loading
      notifyError(error.response.data.error);
    }
  };

  return (
    <div className=" bg-gray-200 mt-[110px] text-center w-[323px] h-[359px] rounded-lg ">
      <div>
        <Toaster />
      </div>
      <input
        className="file-input-primary file-input-bordered file-input  w-full max-w-xs"
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileChange}
      />
      {uploadStatus && <p className="file-status mt-12">{uploadStatus}</p>}
      <button
        onClick={handleUpload}
        className=" btn btn-primary rounded-pill text-white mt-40 align-text-top bg-center "
        disabled={loading}
      >
        {loading ? "Uploading..." : "Click to Upload"}
      </button>
    </div>
  );
}

export default FileUploader;
