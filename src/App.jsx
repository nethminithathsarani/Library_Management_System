import Home from './Pages/Home'
import Information from './Pages/Information'
import Review from './Pages/Review'
import AddBooks from './Pages/AddBooks'
import EditBooks from './Pages/EditBooks'
import Addmember from './Pages/Addmember'
import EditMember from './Pages/EditMember'

import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Information" element={<Information />} />
          <Route path="/Review" element={<Review />} />
          <Route path="/AddBooks" element={<AddBooks />} />
          <Route path="/EditBooks" element={<EditBooks />} />
          <Route path="/Addmember" element={<Addmember />} />
          <Route path="/EditMember" element={<EditMember />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

