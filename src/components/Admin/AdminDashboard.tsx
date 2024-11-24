import React from 'react'
import SearchBar from './SearchBar'
import ProgramGrid from './ProgramsGrid'

const AdminDashboard = () => {
  return (
    <div>
      <div className="h-[100vh] w-[100vw] bg-[#151723] px-4 md:px-12 overflow-scroll">
      <div className="flex w-full flex-col">
        <SearchBar />
      </div>
      <ProgramGrid/>
    </div>
    </div>
  )
}

export default AdminDashboard
