import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./components/Index";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ProfileTailor from "./components/ProfileTailor";
import TailorDashboard from "./components/TailorDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import {FindTailorsPage}  from "./components/Findtailor";

import type { JSX } from "react";

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/tailor-dashboard" element={<TailorDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/find-tailor" element={<FindTailorsPage />} />


        <Route path="/profile" element={<Profile />} />
        <Route path="/ProfileTailor" element={<ProfileTailor/>}/>
      </Routes>
    </BrowserRouter>
  );
}
