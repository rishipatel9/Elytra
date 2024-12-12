import React, { useState, Fragment } from 'react';
import { Textarea } from './textarea';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

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
     <Label htmlFor="input-02" className='text-[#D8D8D8] font-semibold'>
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
        className={`bg-[#272727] border-2 border-[#2D2D2D] font-sans  font-semibold text-white hover:transition-all placeholder:text-[#6B6B6B] ${className}`}
      />
    </div>
  );
};



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
    <div className="space-y-2 py-2">
      <Label 
        htmlFor={id} 
        className="block text-[#D8D8D8] font-sans font-normal"
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
          className="w-full p-2 bg-[#272727] border border-[#2D2D2D] font-sans text-white rounded-lg px-2"
          style={{borderRadius: '0.7rem'}}
        >
          <SelectValue placeholder="Select option" className='font-semibold text-' />
        </SelectTrigger>
        <SelectContent className="bg-[#272727] rounded-lg border border-[#2D2D2D]">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="text-white hover:bg-[#2D2D2D] hover:text-white font-normal "
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
    <div className="space-y-1 rounded-lg">
      <label htmlFor={id} className="text-[#D8D8D8]">{label}</label>
      <Textarea
        required
        id={id}
        name={name}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        style={{borderRadius: '0.7rem'}}
        className="w-full p-2 border-2 border-[#2D2D2D] bg-[#272727] text-white placeholder:text-[#6B6B6B] font-semibold  rounded-lg"
      />
    </div>
  );
};

import { Check } from "lucide-react";

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
import { TagInput } from 'emblor';

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
    <div className="space-y-2 font-sans py-2">
      <Label htmlFor={id} className="text-white font-semibold ">
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
            style={{borderRadius: '0.7rem'}}
            className="w-full justify-between h-10 border-2 border-[#2D2D2D] bg-[#272727] text-white placeholder:text-[#6B6B6B]"
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
              <span className="text-[#6B6B6B] font-semibold">Select country</span>
            )}
            <ChevronDown
              size={16}
              strokeWidth={2}
              className="shrink-0 text-white"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] bg-[#272727] text-gray-300 border border-[#2D2D2D] rounded-lg p-0 shadow-lg"
          align="start"
        >
          <Command className='bg-[#272727] border-2 border-[#2D2D2D]' >
            <CommandInput
              placeholder="Search country..."
              className="bg-[#272727] text-gray-300 placeholder-gray-500 px-3 py-2"
              required
            />
            <CommandList>
              <CommandEmpty className="text-gray-500 bg-[#272727] p-2">
                No country found.
              </CommandEmpty>
              {countries.map((group) => (
                <Fragment key={group.continent}>
                  <CommandGroup 
                    heading={group.continent} 
                    className='bg-[#272727]'
                  >
                    {group.items.map((country) => (
                      <CommandItem
                        key={country.value}
                        value={country.value}
                        onSelect={(currentValue: string) => {
                          onChange(currentValue);
                          setOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-[#272727] text-white hover:bg-gray-700 font-semibold"
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


const tags = [
  { id: "1", text: "India" },
  { id: "2", text: "Usa" },
  { id: "3", text: "Uk" },
];

interface Tag {
  id: string;
  text: string;
}

interface InputTagsProps {
  id: string;
  name: string;
  value: string[]; 
  label: string;
  onChange: (tags: Tag[]) => void;
}

export const InputTags = ({ id, name, value, label, onChange }: InputTagsProps) => {
  const [exampleTags, setExampleTags] = useState<Tag[]>(
    value.map((text, index) => ({ id: String(index), text }))
  );


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
            "bg-[#272727] border-2 border-[#2D2D2D] font-sans font-normal rounded-xl py-2 text-white hover:transition-all placeholder:text-[#6B6B6B]",
          tag: {
            body: "relative h-7 bg-background border border-input  hover:bg-background rounded-lg font-medium text-xs ps-2 pe-7",
            closeButton:
              "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-lg flex size-7  transition-colors outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 text-muted-foreground/80 hover:text-foreground",
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






import {  forwardRef } from "react";
import { ChevronDown, Phone } from "lucide-react"; 
import { cn } from '@/lib/utils';

export function PhoneInputComponent() {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-2" dir="ltr">
      <label htmlFor="input-46">Phone number input</label>
      <RPNInput.default
        className="flex rounded-lg shadow-sm shadow-black/5"
        international
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={PhoneInput}
        id="input-46"
        placeholder="Enter phone number"
        value={value}
        onChange={(newValue) => setValue(newValue ?? "")}
      />
      <p className="mt-2 text-xs text-muted-foreground" role="region" aria-live="polite">
        Built with{" "}
        <a
          className="underline hover:text-foreground"
          href="https://gitlab.com/catamphetamine/react-phone-number-input"
          target="_blank"
          rel="noopener nofollow"
        >
          react-phone-number-input
        </a>
      </p>
    </div>
  );
}

export const PhoneInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        className={cn("-ms-px rounded-s-none shadow-none focus-visible:z-10", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
};

const CountrySelect = ({ disabled, value, onChange, options }: CountrySelectProps) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as RPNInput.Country);
  };

  return (
    <div className="relative inline-flex items-center self-stretch rounded-s-lg border border-input bg-background py-2 pe-2 ps-3 text-muted-foreground transition-shadow focus-within:z-10 focus-within:border-ring focus-within:outline-none focus-within:ring-[3px] focus-within:ring-ring/20 hover:bg-accent hover:text-foreground has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50">
      <div className="inline-flex items-center gap-1" aria-hidden="true">
        <FlagComponent country={value} countryName={value} aria-hidden="true" />
        <span className="text-muted-foreground/80">
          <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
      <select
        disabled={disabled}
        value={value}
        onChange={handleSelect}
        className="absolute inset-0 text-sm opacity-0"
        aria-label="Select country"
      >
        <option key="default" value="">
          Select a country
        </option>
        {options
          .filter((x) => x.value)
          .map((option, i) => (
            <option key={option.value ?? `empty-${i}`} value={option.value}>
              {option.label} {option.value && `+${RPNInput.getCountryCallingCode(option.value)}`}
            </option>
          ))}
      </select>
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="w-5 overflow-hidden rounded-sm">
      {Flag ? <Flag title={countryName} /> : <Phone size={16} aria-hidden="true" />}
    </span>
  );
};
