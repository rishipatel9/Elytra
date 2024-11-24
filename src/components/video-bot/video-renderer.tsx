import React, { useEffect, useRef, useState } from "react";
import { useTracks, VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";

interface VideoConferenceRendererProps {
  isAISpeaking: boolean;
}

export default function VideoConferenceRenderer({ isAISpeaking }: VideoConferenceRendererProps) {
  const trackRefs = useTracks([Track.Source.Camera]);
  const userTrackRef = trackRefs.find((trackRef) => trackRef.participant.isLocal);
  const avatarVideoRef = useRef<HTMLVideoElement>(null);
  const [isTestPlaying, setIsTestPlaying] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    if (avatarVideoRef.current) {
      avatarVideoRef.current.addEventListener('loadeddata', () => {
        setIsVideoReady(true);
      });
    }
  }, []);

  useEffect(() => {
    const videoElement = avatarVideoRef.current;
    if (!videoElement || !isVideoReady) return;

    const playVideo = async () => {
      try {
        if (isAISpeaking || isTestPlaying) {
          if (videoElement.paused) {
            videoElement.currentTime = 0;
            await videoElement.play();
          }
        } else {
          if (!videoElement.paused) {
            videoElement.pause();
            videoElement.currentTime = 0;
          }
        }
      } catch (err) {
        console.error('Video playback error:', err);
      }
    };

    playVideo();
  }, [isAISpeaking, isTestPlaying, isVideoReady]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl -mt-2">
      {/* AI Avatar Video */}
      <div className="relative h-[750px] w-full overflow-hidden rounded-lg shadow-inner">
        <video
          ref={avatarVideoRef}
          src="/ai-vid.mp4"
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
        />
        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
          AI Assistant
        </div>
        <div className={`absolute top-2 right-2 ${isAISpeaking ? 'bg-green-500' : 'bg-red-500'} w-3 h-3 rounded-full`}></div>
        <button
          onClick={() => setIsTestPlaying(!isTestPlaying)}
          className="absolute bottom-2 right-2 bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          {isTestPlaying ? "Stop Test" : "Test Avatar"}
        </button>
        
        {/* Overlay for user's video on small screens */}
        <div className="md:hidden absolute bottom-[656px] right-4 w-1/3 aspect-video max-w-[200px] rounded-lg overflow-hidden shadow-lg">
          {userTrackRef ? (
            <VideoTrack
              trackRef={userTrackRef}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute bottom-1 left-1 bg-black/50 text-white px-1 py-0.5 rounded text-xs">
            You
          </div>
        </div>
      </div>

      {/* User's Video (hidden on small screens) */}
      <div className="relative h-[750px] w-full overflow-hidden rounded-lg shadow-inner hidden md:block">
        {userTrackRef ? (
          <VideoTrack
            trackRef={userTrackRef}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
          You
        </div>
      </div>
    </div>
  );
}

