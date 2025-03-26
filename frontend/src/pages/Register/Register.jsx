import React, { useState } from "react";
import RegisterView from "./RegisterView";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div>
      <RegisterView
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
};

export default Register;
