import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {HomeScreen} from "./screens/home";
import {FilterPadScreen} from "./screens/filterpad/filterpad";


const Main = () => {


  return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/filterpad" element={<FilterPadScreen />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
};
const App = () => {
  return (
      <Main />
  );
};

export default App;
