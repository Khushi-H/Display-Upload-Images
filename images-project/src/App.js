// src/App.js
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import "./App.css"; // Import the CSS file for styles
import Carousel from "./components/Carousel";
import UploadUi from "./components/UploadUi";

const theme = createTheme({
  palette: {
    mode: "dark", // Change to 'light' for light mode
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <div style={{ padding: "20px" }}>
      <h1>Image Carousel</h1>
      <Carousel imageCount={15} />
      <h1>Upload Images</h1>
      <UploadUi />
    </div>
  </ThemeProvider>
);

export default App;
