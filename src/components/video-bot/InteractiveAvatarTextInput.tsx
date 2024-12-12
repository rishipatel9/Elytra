import { Input, Spinner, Tooltip } from "@nextui-org/react";
import { Airplane, ArrowRight, PaperPlaneRight } from "@phosphor-icons/react";
import { Mic, MicOff } from "lucide-react";
import clsx from "clsx";

interface StreamingAvatarTextInputProps {
  label: string;
  placeholder: string;
  input: string;
  onSubmit: () => void;
  setInput: (value: string) => void;
  handleVoiceIconClick: () => void; // New prop for voice toggle
  isVoiceMode: boolean; // New prop to track voice mode
  endContent?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export default function InteractiveAvatarTextInput({
  label,
  placeholder,
  input,
  onSubmit,
  setInput,
  handleVoiceIconClick, // Added
  isVoiceMode, // Added
  endContent,
  disabled = false,
  loading = false,
}: StreamingAvatarTextInputProps) {
  function handleSubmit() {
    if (input.trim() === "") {
      return;
    }
    onSubmit();
    setInput("");
  }

  return (
    <Input
      endContent={
        <div className="flex flex-row items-center h-full space-x-2">
          {/* Voice Mode Toggle */}
          <Tooltip content={isVoiceMode ? "Disable Voice Mode" : "Enable Voice Mode"}>
            <button
              onClick={handleVoiceIconClick}
              className="focus:outline-none border border-red-700"
            >
              {isVoiceMode ? (
                <Mic 
                  className="text-indigo-500 hover:text-indigo-400" 
                  size={24} 
                />
              ) : (
                <MicOff 
                  className="text-gray-400 hover:text-gray-500" 
                  size={24} 
                />
              )}
            </button>
          </Tooltip>

          {/* Existing Send Button */}
          {endContent}
          <Tooltip content="Send message">
            {loading ? (
              <Spinner
                className="text-indigo-300 hover:text-indigo-200"
                size="sm"
                color="default"
              />
            ) : (
              <button
                type="submit"
                className="focus:outline-none"
                onClick={handleSubmit}
              >
                <PaperPlaneRight
                  className={clsx(
                    "text-indigo-300 hover:text-indigo-200",
                    disabled && "opacity-50"
                  )}
                  size={24}
                />
              </button>
            )}
          </Tooltip>
        </div>
      }
      label={label}
      placeholder={placeholder}
      size="sm" 
      value={input}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSubmit();
        }
      }}
      onValueChange={setInput}
      isDisabled={disabled}
    />
  );
}