import React, { useState, Fragment } from 'react';
import { Textarea } from './textarea';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

export const InputDemo = ({
  id,
  label,
  placeholder,
  name,
  onChange,
  className = '',
  value
}: {
  id: string;
  label: string;
  placeholder: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  value: string;
}) => {
  return (
    <div className="space-y-1">
     <Label htmlFor="input-02" className='text-white'>
        {label}<span className="text-destructive">*</span>
      </Label>
      <Input
        id={id}
        name={name}
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        required
        className={`bg-[#0A0A0A] border border-[#2D2D2D] font-sans font-normal text-white hover:transition-all placeholder:text-[#6B6B6B] ${className}`}
      />
    </div>
  );
};


// Select Component

interface SelectDemoProps {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  required?: boolean;
}

export function SelectDemo({
  id,
  label,
  options,
  value,
  onChange,
  name,
  required = false,
}: SelectDemoProps) {
  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className="block text-white font-sans font-normal"
      >
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Select 
        value={value} 
        onValueChange={onChange} 
        name={name}
      >
        <SelectTrigger
          id={id}
          className="w-full p-2 bg-[#0A0A0A] border border-[#2D2D2D] font-sans text-white rounded-md"
        >
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent className="bg-[#0A0A0A] rounded-md border border-[#2D2D2D]">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="text-white hover:bg-[#2D2D2D] hover:text-white"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Textarea Component
export const TextArea = ({
  id,
  name,
  onChange,
  value,
  placeholder,
  label
}: {
  id: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  placeholder: string;
  label: string;
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-white">{label}</label>
      <Textarea
        id={id}
        name={name}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        className="w-full p-2 border border-[#2D2D2D] bg-[#0A0A0A] text-white placeholder:text-[#6B6B6B] rounded-md"
      />
    </div>
  );
};

import { Check, ChevronDown } from "lucide-react";


import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const countries = [
  {
    continent: "America",
    items: [
      { value: "United States", flag: "🇺🇸" },
      { value: "Canada", flag: "🇨🇦" },
      { value: "Mexico", flag: "🇲🇽" },
    ],
  },
  {
    continent: "Africa",
    items: [
      { value: "South Africa", flag: "🇿🇦" },
      { value: "Nigeria", flag: "🇳🇬" },
      { value: "Morocco", flag: "🇲🇦" },
    ],
  },
  {
    continent: "Asia",
    items: [
      { value: "China", flag: "🇨🇳" },
      { value: "Japan", flag: "🇯🇵" },
      { value: "India", flag: "🇮🇳" },
    ],
  },
  {
    continent: "Europe",
    items: [
      { value: "United Kingdom", flag: "🇬🇧" },
      { value: "France", flag: "🇫🇷" },
      { value: "Germany", flag: "🇩🇪" },
    ],
  },
  {
    continent: "Oceania",
    items: [
      { value: "Australia", flag: "🇦🇺" },
      { value: "New Zealand", flag: "🇳🇿" },
    ],
  },
];
interface NationalitySelectProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  id: string;
  required?: boolean;
}

export function NationalitySelect({
  value,
  onChange,
  name,
  id,
  required = false
}: NationalitySelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2 font-sans">
      <Label htmlFor={id} className="text-white font-normal">
        Select Nationality {required && <span className="text-red-500">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            name={name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-10 border-[#2D2D2D] bg-[#0A0A0A] text-white placeholder:text-[#6B6B6B]"
          >
            {value ? (
              <span className="flex min-w-0 items-center gap-2">
                <span className="text-lg leading-none">
                  {countries
                    .flatMap(group => group.items)
                    .find(item => item.value === value)?.flag}
                </span>
                <span className="truncate">{value}</span>
              </span>
            ) : (
              <span className="text-[#6B6B6B] font-normal">Select country</span>
            )}
            <ChevronDown
              size={16}
              strokeWidth={2}
              className="shrink-0 text-gray-400"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] bg-[#0A0A0A] text-gray-300 border border-[#2D2D2D] rounded-md p-0 shadow-lg"
          align="start"
        >
          <Command className='bg-[#0A0A0A] border border-[#2D2D2D]'>
            <CommandInput
              placeholder="Search country..."
              className="bg-[#0A0A0A] text-gray-300 placeholder-gray-500 px-3 py-2"
            />
            <CommandList>
              <CommandEmpty className="text-gray-500 bg-[#0A0A0A] p-2">
                No country found.
              </CommandEmpty>
              {countries.map((group) => (
                <Fragment key={group.continent}>
                  <CommandGroup 
                    heading={group.continent} 
                    className='bg-[#0A0A0A]'
                  >
                    {group.items.map((country) => (
                      <CommandItem
                        key={country.value}
                        value={country.value}
                        onSelect={(currentValue: string) => {
                          onChange(currentValue);
                          setOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-[#0A0A0A] text-white hover:bg-gray-700"
                      >
                        <span className="text-lg leading-none">{country.flag}</span> 
                        {country.value}
                        {value === country.value && (
                          <Check size={16} strokeWidth={2} className="ml-auto" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Fragment>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}


import {  TagInput } from "emblor";

const tags = [
  {
    id: "1",
    text: "India",
  },
  {
    id: "2",
    text: "Usa",
  },
  {
    id: "3",
    text: "Uk",
  },
];
interface Tag {
  id: string;
  text: string;
}

interface InputTagsProps {
  id: string;
  name: string;
  value: string[]; // Parent passes string[]
  label: string;
  onChange: (tags: Tag[]) => void; // Emits Tag[]
}

export const InputTags = ({ id, name, value, label, onChange }: InputTagsProps) => {
  const [exampleTags, setExampleTags] = useState<Tag[]>(
    value.map((text, index) => ({ id: String(index), text })) // Convert string[] to Tag[]
  );

  const handleTagChange = (newTags: Tag[]) => {
    setExampleTags(newTags);
    onChange(newTags); // Notify parent with updated Tag[]
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-white font-sans font-normal">
        {label}
      </Label>
      <TagInput
  id={id}
  name={name}
  tags={exampleTags}
  setTags={(newState) => {
    const updatedTags =
      typeof newState === "function" ? newState(exampleTags) : newState;
    setExampleTags(updatedTags); // Update internal state
    onChange(updatedTags); // Notify parent
  }}
  placeholder="Add a tag"
  styleClasses={{
    tagList: {
      container: "gap-1",
    },
    input:
      "bg-[#0A0A0A] border border-[#2D2D2D] font-sans font-normal text-white hover:transition-all placeholder:text-[#6B6B6B]",
    tag: {
      body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
      closeButton:
        "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-lg flex size-7 transition-colors outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 text-muted-foreground/80 hover:text-foreground",
    },
  }}
  inlineTags={false}
  inputFieldPosition="top"
  activeTagIndex={-1}
  setActiveTagIndex={() => {}}
/>

    </div>
  );
};
