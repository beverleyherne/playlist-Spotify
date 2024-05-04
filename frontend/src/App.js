import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Main from "./Main"; // Make sure the path to Main is correct

const App = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};

export default App;
