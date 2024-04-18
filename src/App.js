import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {HomeScreen} from "./screens/home";


const Main = () => {


  return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
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
