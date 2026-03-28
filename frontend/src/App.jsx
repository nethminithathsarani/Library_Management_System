import Home from './Pages/Home';
import Information from './Pages/Information';
import Borrowings from './Pages/Borrowings';
import MyBorrowingActivities from './Pages/MyBorrowingActivities';
import AddBooks from './Pages/AddBooks';
import EditBooks from './Pages/EditBooks';
import Addmember from './Pages/Addmember';
import EditMember from './Pages/EditMember';
import SignUp from './Pages/signup';
import Login from './Pages/Login';
import ProtectedRoute from './Components/ProtectedRoute';

import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Information" element={<Information />} />

          <Route
            path="/Borrowings"
            element={(
              <ProtectedRoute allowedRoles={['admin']}>
                <Borrowings />
              </ProtectedRoute>
            )}
          />

          <Route
            path="/my-borrowings"
            element={(
              <ProtectedRoute allowedRoles={['user']}>
                <MyBorrowingActivities />
              </ProtectedRoute>
            )}
          />

          <Route
            path="/AddBooks"
            element={(
              <ProtectedRoute allowedRoles={['admin']}>
                <AddBooks />
              </ProtectedRoute>
            )}
          />

          <Route
            path="/EditBooks"
            element={(
              <ProtectedRoute allowedRoles={['admin']}>
                <EditBooks />
              </ProtectedRoute>
            )}
          />

          <Route
            path="/Addmember"
            element={(
              <ProtectedRoute allowedRoles={['admin']}>
                <Addmember />
              </ProtectedRoute>
            )}
          />

          <Route
            path="/EditMember"
            element={(
              <ProtectedRoute allowedRoles={['admin']}>
                <EditMember />
              </ProtectedRoute>
            )}
          />

          <Route path="/Login" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
