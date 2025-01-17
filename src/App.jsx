import Home from './Pages/Home'
import Information from './Pages/Information'
import Borrowings from './Pages/Borrowings'
import AddBooks from './Pages/AddBooks'
import EditBooks from './Pages/EditBooks'
import Addmember from './Pages/Addmember'
import EditMember from './Pages/EditMember'
import Login from './Pages/Login'

import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Information" element={<Information />} />
          <Route path="/Borrowings" element={<Borrowings />} />
          <Route path="/AddBooks" element={<AddBooks />} />
          <Route path="/EditBooks" element={<EditBooks />} />
          <Route path="/Addmember" element={<Addmember />} />
          <Route path="/EditMember" element={<EditMember />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

