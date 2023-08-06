import React, { useCallback, useState } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";

const VideoUpload = () => {
  const [downloadUrl, setDownloadUrl] = useState("");
  const [originalSize, setOriginalSize] = useState("");
  const [compressedSize, setCompressedSize] = useState("");

  const handleDrop = useCallback(async (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setOriginalSize(formatFileSize(selectedFile.size));
    setCompressedSize("");

    try {
      const formData = new FormData();
      formData.append("video", selectedFile);

      const response = await axios.post("/api/compress-and-crop", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDownloadUrl(response.data.downloadUrl);
      setCompressedSize(formatFileSize(response.data.compressedSize));
    } catch (error) {
      console.error("Error compressing video:", error);
    }
  }, []);

  const handleUploadButtonClick = () => {
    document.getElementById("videoInput").click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleDrop([selectedFile]);
  };

  const formatFileSize = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  };

  return (
    <div>
      <Dropzone onDrop={handleDrop} accept="video/*">
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed #ccc",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <input {...getInputProps()} />
            <p>Drag 'n' drop a video file here, or click to select one</p>
          </div>
        )}
      </Dropzone>
      <input
        type="file"
        id="videoInput"
        accept="video/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button onClick={handleUploadButtonClick}>Upload Video</button>
      {originalSize && (
        <div>
          <p>Original Size: {originalSize}</p>
          {compressedSize && <p>Compressed Size: {compressedSize}</p>}
          {downloadUrl && (
            <a href={downloadUrl} download="compressed_video.mp4">
              <button>Download Compressed Video</button>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
