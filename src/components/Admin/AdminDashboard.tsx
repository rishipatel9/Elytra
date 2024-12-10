"use client"
import React from 'react';
import SearchBar from './SearchBar';
import ProgramGrid from './ProgramsGrid';

const user={
  name: "Admin",
  image:"https://randomuser.me/api/portraits",
  email:"example@gmail.com"

}
const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="h-screen w-full border rounded-xl bg-background dark:bg-[#202434] dark:border-[#293040]  border-[#E9ECF1] px-4 md:px-16 overflow-y-auto">
      <div className="flex flex-col gap-4 py-6">

        <div className="w-full md:flex justify-between h-auto flex-row ">
          <div className=" text-[#222939] dark:text-white flex justify-center md:items-center text-xl font-bold">Programs</div>
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="w-full">
          <ProgramGrid searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
