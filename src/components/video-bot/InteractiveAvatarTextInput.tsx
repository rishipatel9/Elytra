import { Input, Spinner, Tooltip } from "@nextui-org/react";
import { PaperPlaneRight } from "@phosphor-icons/react";
import { Mic, MicOff, Paperclip, Upload } from "lucide-react";
import clsx from "clsx";
import React from "react";

interface StreamingAvatarTextInputProps {
  label: string;
  placeholder: string;
  input: string;
  onSubmit: () => void;
  setInput: (value: string) => void;
  handleVoiceIconClick: () => void;
  isVoiceMode: boolean;
  endContent?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

// Reusable Voice Mode Toggle Button
const VoiceToggleButton = ({
  isVoiceMode,
  onClick,
}: {
  isVoiceMode: boolean;
  onClick: () => void;
}) => (
  <Tooltip content={isVoiceMode ? "Disable Voice Mode" : "Enable Voice Mode"} className="bg-black">
    <button
      onClick={onClick}
      aria-label={isVoiceMode ? "Disable Voice Mode" : "Enable Voice Mode"}
      className="focus:outline-none p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    >
      {isVoiceMode ? (
        <Mic className="text-indigo-500" size={24} />
      ) : (
        <MicOff className="text-gray-400" size={24} />
      )}
    </button>
  </Tooltip>
);

// Reusable Send Button with Loading State
const SendButton = ({
  onClick,
  loading,
  disabled,
}: {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}) => (
  <Tooltip content="Send message" className="bg-black">
    {loading ? (
      <Spinner size="sm" className="text-indigo-300" />
    ) : (
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label="Send message"
        className={clsx(
          "focus:outline-none p-1 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-700 transition",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <PaperPlaneRight
          className={clsx("text-indigo-300", disabled && "opacity-50")}
          size={24}
        />
      </button>
    )}
  </Tooltip>
);

const FileUploadButton = ({
  onChange,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <Tooltip content="Upload a file" className="font-sans  bg-black">
    <label className="focus:outline-none p-2 rounded-lg  transition cursor-pointer">
      <Paperclip className="text-gray-400" size={24} />
      <input
        type="file"
        onChange={onChange}
        className="hidden"
        aria-label="Upload file"
      />
    </label>
  </Tooltip>
);
export default function InteractiveAvatarTextInput({
  label,
  placeholder,
  input,
  onSubmit,
  setInput,
  handleVoiceIconClick,
  isVoiceMode,
  endContent,
  disabled = false,
  loading = false,
}: StreamingAvatarTextInputProps) {
  // Submit Handler
  const handleSubmit = () => {
    if (input.trim() === "") return;
    onSubmit();
    setInput("");
  };

  return (
    <>
     <FileUploadButton  onChange={(e)=>console.log(e.target.value)}/>
    <Input
      endContent={
        <div className="flex items-center gap-2 ">

         
          {/* Voice Toggle Button */}
          <VoiceToggleButton
            isVoiceMode={isVoiceMode}
            onClick={handleVoiceIconClick}
          />

          {/* Additional Custom End Content */}
          {endContent}

          {/* Send Button */}
          <SendButton
            onClick={handleSubmit}
            loading={loading}
            disabled={disabled || input.trim() === ""}
          />
        </div>
      }
      label={label}
      placeholder={placeholder}
      value={input}
      size="sm"
      onValueChange={setInput}
      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      isDisabled={disabled}
      aria-label={label}
      className="focus-within:ring-2 focus-within:ring-indigo-500 rounded-lg shadow-sm"
    />
    </>
  );
}
