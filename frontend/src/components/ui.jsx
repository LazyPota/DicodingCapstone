import React from "react";

export function Button({ children, onClick }) {
  return <button onClick={onClick} className="btn">{children}</button>;
}

export function Input({ type, placeholder, value, onChange }) {
  return <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="input" />;
}
