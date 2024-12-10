import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full border-t-4 border-gray-300 border-t-black w-12 h-12"></div>
    </div>
  );
};

export default Spinner;
