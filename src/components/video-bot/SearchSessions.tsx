"use client"
import React from 'react'
import { Input } from '../ui/input'
import { MagnifyingGlassIcon } from '@/icons/icons'

const SearchSession = ({ onSearch }: { onSearch: (query: string) => void }) => {
  return (
      <div className="space-y-2 py-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center w-full">
          <div className="absolute inset-y-0 start-0 flex items-center pl-3 text-[#8F8F8F]">
            <MagnifyingGlassIcon  />
          </div>
          <Input
            id="input-25"
            className="pl-12 pr-12 border dark:bg-[#212A39] rounded-xl dark:border-[#3B4254]  border-[#E9ECF1] font-normal hover:border-2 hover:transition-all placeholder:text-[#6B6B6B]"
            placeholder="Search Projects..."
            type="search"
            onChange={(e) => onSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 end-0 flex items-center pr-3 text-[#8F8F8F] ">
            <kbd className="inline-flex h-5 max-h-full items-center rounded border border-[#2D2D2D] px-1 font-[inherit] text-[0.625rem] font-medium text-[#8F8F8F]">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
    </div>

  )
}

export default SearchSession