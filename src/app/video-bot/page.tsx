"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  LiveKitRoom,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  AgentState,
  DisconnectButton,
} from "@livekit/components-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MediaDeviceFailure } from "livekit-client";
import { NoAgentNotification } from "@/components/video-bot/NoAgentNotification";
import { CloseIcon } from "@/components/video-bot/CloseIcon";
import { useKrispNoiseFilter } from "@livekit/components-react/krisp";
import { ConnectionDetails } from "../api/connection-details/route";
import VideoConferenceRenderer from "@/components/video-bot/video-renderer";

export default function Page() {
  const [connectionDetails, updateConnectionDetails] = useState<ConnectionDetails | undefined>(undefined);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  const onConnectButtonClicked = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetailsData = await response.json();
    updateConnectionDetails(connectionDetailsData);
  }, []);

  return (
    <main data-lk-theme="default" className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <LiveKitRoom
        token={connectionDetails?.participantToken}
        serverUrl={connectionDetails?.serverUrl}
        connect={connectionDetails !== undefined}
        audio={true}
        video={true}
        onMediaDeviceFailure={(error) => {
          console.error('Media device failure:', error);
          onDeviceFailure(error);
        }}
        onConnected={() => {
          console.log('Connected to LiveKit room');
        }}
        onDisconnected={() => {
          console.log('Disconnected from LiveKit room');
          updateConnectionDetails(undefined);
        }}
        className="flex flex-col justify-between min-h-screen p-6"
      >
        <div className="flex-grow flex flex-col justify-center space-y-8">
          <h1 className="text-4xl font-bold text-center ">AI Conversation Assistant</h1>
          <VideoConferenceRenderer isAISpeaking={isAISpeaking} />
          <SimpleVoiceAssistant 
            onStateChange={setAgentState} 
            onSpeakingChange={(speaking) => {
              console.log('AI speaking state:', speaking);
              setIsAISpeaking(speaking);
            }} 
          />
        </div>

        <ControlBar 
          onConnectButtonClicked={() => {
            console.log('Connect button clicked');
            onConnectButtonClicked();
          }} 
          agentState={agentState} 
        />
        <RoomAudioRenderer />
        <NoAgentNotification state={agentState} />
      </LiveKitRoom>
    </main>
  );
}

function SimpleVoiceAssistant(props: {
  onStateChange: (state: AgentState) => void;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}) {
  const { state, audioTrack } = useVoiceAssistant();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor audio levels to detect speaking
  useEffect(() => {
    if (!audioTrack?.publication?.track) return;

    const mediaStream = new MediaStream([audioTrack.publication.track.mediaStreamTrack]);
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(mediaStream);
    source.connect(analyser);

    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    let animationFrame: number;

    const checkAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;

      const newIsSpeaking = average > 30; // Adjust threshold as needed
      if (newIsSpeaking) {
        if (speakingTimeoutRef.current) {
          clearTimeout(speakingTimeoutRef.current);
          speakingTimeoutRef.current = null;
        }
        if (!isSpeaking) {
          setIsSpeaking(true);
          props.onSpeakingChange?.(true);
        }
      } else {
        // Set isSpeaking to false only after a delay
        if (!speakingTimeoutRef.current) {
          speakingTimeoutRef.current = setTimeout(() => {
            setIsSpeaking(false);
            props.onSpeakingChange?.(false);
          }, 500); // Adjust debounce time (in ms) as needed
        }
      }

      animationFrame = requestAnimationFrame(checkAudioLevel);
    };

    checkAudioLevel();

    return () => {
      cancelAnimationFrame(animationFrame);
      source.disconnect();
      audioContext.close();
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
    };
  }, [audioTrack, props.onSpeakingChange]);

  useEffect(() => {
    props.onStateChange(state);
  }, [props, state]);

  return (
    <div className="h-[300px] max-w-[90vw] mx-auto">
      <BarVisualizer
        state={state}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
  );
}



function ControlBar(props: { onConnectButtonClicked: () => void; agentState: AgentState }) {
  const krisp = useKrispNoiseFilter();
  useEffect(() => {
    krisp.setNoiseFilterEnabled(true);
  }, []);

  // Simplified version without complex animations
  return (
    <div className="relative h-[100px]">
      {props.agentState === "disconnected" && (
        <button
          className="uppercase absolute left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
          onClick={props.onConnectButtonClicked}
        >
          Start a conversation
        </button>
      )}

      {props.agentState !== "disconnected" && props.agentState !== "connecting" && (
        <div className="flex h-8 absolute left-1/2 transform -translate-x-1/2 justify-center">
          <VoiceAssistantControlBar controls={{ leave: false }} />
          <DisconnectButton>
            <CloseIcon />
          </DisconnectButton>
        </div>
      )}
    </div>
  );
}

function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}
