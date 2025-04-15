import React, { useState } from "react";
import SettingsView from "./SettingsView";

const Settings = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    birthDate: "",
  });

  const profileImageUrl = "https://randomuser.me/api/portraits/men/1.jpg"; // Foto Profil dari Header

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return <SettingsView  profileImageUrl={profileImageUrl} handleChange={handleChange} formData={formData}/>;
};

export default Settings;
