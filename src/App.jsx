import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleUpload = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("video", file);

    axios
      .post("http://localhost:5000/compress", formData, {
        responseType: "blob",
      })
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        setCompressedFile(url);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error uploading video:", error);
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>Video Compression App</h1>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => handleDrop(e.target.files)}
      />
      {file && (
        <div>
          <p>Selected file: {file.name}</p>
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Compressing..." : "Upload and Compress"}
          </button>
        </div>
      )}
      {compressedFile && (
        <div>
          <p>Compressed video ready for download:</p>
          <a href={compressedFile} download>
            Download Compressed Video
          </a>
        </div>
      )}
    </div>
  );
}

export default App;

//--------------------------------------- above working code ------------------------------------ //

// ------------------------- Thumbnail code ------------------------------------------ //
