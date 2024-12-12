import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-10 h-10 border-4 border-t-4 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
