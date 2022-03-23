import React from "react";
import Home from "./views/Home";
import ThemeProvider from 'react-bootstrap/ThemeProvider'

function App() {
  return (
    <div>
      <ThemeProvider>
      <Home/>
      </ThemeProvider>
    </div>
  );
}

export default App;
