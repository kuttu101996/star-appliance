// import React from 'react'

// import { useNavigate } from "react-router-dom";

const NotFound = () => {
  //   const navigate = useNavigate(); // Hook to navigate through history

  //   const goBack = () => {
  //     navigate(-1); // Go back to the previous page in the history
  //   };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[95%] lg:w-[1000px] bg-blue-500 h-[500px] text-white flex flex-col items-center justify-center">
        <h1 className="text-8xl lg:text-9xl mt-[-40px] mb-1">404</h1>
        <h3 className="text-3xl font-medium mb-1">oops! Page not found!</h3>
        <p className="text-xl text-center ">
          The page you are looking for could not be found.
        </p>
        {/* <button
          onClick={goBack}
          className="mt-6 px-4 py-2 bg-white text-blue-500 rounded hover:bg-blue-100"
        >
          Go Back
        </button> */}
      </div>
    </div>
  );
};

export default NotFound;
