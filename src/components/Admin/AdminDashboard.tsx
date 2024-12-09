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
    <div className="h-screen w-full bg-[#000000] px-4 md:px-12 overflow-y-auto">
      <div className="flex flex-col gap-4 py-6">

        <div className="w-full">
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
