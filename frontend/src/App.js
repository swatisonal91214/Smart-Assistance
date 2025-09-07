import CreateRolePage from './components/CreateRolePage';
import ManageRolesPage from './components/ManageRolesPage';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SmartAssistance from './components/SmartAssistance';
import ChatComponent from './components/ChatComponent';
import LandingPage from './components/LandingPage';
import RoleSelectionPage from './components/RoleSelectionPage';
import LoginSignupPage from './components/LoginSignupPage';
import UserDashboard from './components/UserDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/select-role" element={<RoleSelectionPage />} />
  <Route path="/login" element={<LoginSignupPage />} />
  <Route path="/user-dashboard" element={<UserDashboard />} />
  <Route path="/manager-dashboard" element={<ManagerDashboard />} />
  <Route path="/admin-dashboard" element={<AdminDashboard />} />
  <Route path="/admin-create-role" element={<CreateRolePage />} />
  <Route path="/manager-roles" element={<ManageRolesPage />} />
  <Route path="/upload" element={<SmartAssistance />} />
  <Route path="/chat" element={<ChatComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
