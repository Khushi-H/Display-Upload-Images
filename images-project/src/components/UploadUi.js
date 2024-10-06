import React, { useState } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const MAX_FILES = 5;
const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

const UploadUi = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [pauseUpload, setPauseUpload] = useState(false);
  const [uploadTask, setUploadTask] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter((file) =>
      VALID_IMAGE_TYPES.includes(file.type)
    );

    if (validFiles.length + files.length > MAX_FILES) {
      setSnackbarMessage(`You can upload a maximum of ${MAX_FILES} images.`);
      setSnackbarOpen(true);
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const chunks = files.map((file) => ({
      file,
      index: 0,
    }));
    let completedChunks = 0;

    for (let i = 0; i < chunks.length; i++) {
      while (chunks[i].index < 1) {
        // Change this to appropriate chunk logic
        if (pauseUpload) {
          setUploadTask(chunks[i]);
          return; // Pause upload
        }

        const formData = new FormData();
        formData.append("file", chunks[i].file);
        try {
          await axios.get("http://localhost:5000/upload", formData, {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          });
          setUploadedImages((prev) => [...prev, chunks[i].file.name]);
          completedChunks++;
          chunks[i].index++;
        } catch (error) {
          console.error("Error uploading file:", error);
          setSnackbarMessage("Error uploading file.");
          setSnackbarOpen(true);
        }
      }
    }
    setUploading(false);
    setSnackbarMessage("Upload completed successfully!");
    setSnackbarOpen(true);
  };

  const resumeUpload = () => {
    if (uploadTask) {
      uploadFiles(); // Resume from the paused state
      setUploadTask(null);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={uploadFiles}
        disabled={uploading || files.length === 0}
      >
        {uploading ? "Pause Upload" : "Upload Images"}
      </Button>
      {uploading && (
        <LinearProgress variant="determinate" value={uploadProgress} />
      )}
      <Typography variant="h6">Selected Files:</Typography>
      <List>
        {files.map((file, index) => (
          <ListItem key={index}>
            <ListItemText primary={file.name} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h6">Uploaded Files:</Typography>
      <List>
        {uploadedImages.map((name, index) => (
          <ListItem key={index}>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
      {pauseUpload && <Button onClick={resumeUpload}>Resume Upload</Button>}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UploadUi;
