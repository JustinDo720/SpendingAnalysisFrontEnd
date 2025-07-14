import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SANav from './Navbar';
import Home from './Home';
import ListSummary from './ListSummary';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {

  useEffect(()=>{
    document.title = 'Spending Analysis - JD'
  })
  return (
    <>
      <Router>
        <SANav></SANav>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/summary' element={<ListSummary/>}></Route>
        </Routes>
      </Router>
    
    </>
  );
}

export default App;
