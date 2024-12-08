import React from 'react';
import SearchBar from './SearchBar';
import ProgramGrid from './ProgramsGrid';

const user={
  name: "Admin",
  image:"https://randomuser.me/api/portraits",
  email:"example@gmail.com"

}
const AdminDashboard = () => {
  return (
    <div className="h-screen w-full bg-[#000000] px-4 md:px-12 overflow-y-auto">
      <div className="flex flex-col gap-4 py-6">

        <div className="w-full">
          <SearchBar />
        </div>

        <div className="w-full">
          <ProgramGrid />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
