import React from 'react';
import { useLocation } from 'react-router-dom';

function MyComponent() {
  const location = useLocation();
  let category = "latest";

  try {
    category = location.pathname.split("/")[1] || "latest";
  } catch (error) {
    console.error("Error parsing URL:", error);
  }


  return (
    <div>
      <h1>Current Category: {category}</h1>
    </div>
  );
}

export default MyComponent;