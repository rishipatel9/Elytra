'use client'

import { useState, useEffect, useRef } from 'react'
import StreamingAvatar, {
    AvatarQuality,
    StartAvatarResponse,
    StreamingEvents,
    TaskMode,
    TaskType,
    VoiceEmotion,
} from "@heygen/streaming-avatar"
import { OpenAIAssistant } from '@/lib/openai-assistant'
import InteractiveAvatarTextInput from './InteractiveAvatarTextInput'
import { Chip } from '@nextui-org/chip'
import { getStudentById } from '@/helper'
import { useMemoizedFn, usePrevious } from 'ahooks'
import { Button } from '../ui/button'

interface User {
    id: string;
    name: string;
    email: string;
    image: string;
}

export default function AICounselingChatbot({ user }: { user: User }) {
    const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([])
    const [stream, setStream] = useState<MediaStream>()
    const [language] = useState<string>('en')
    const [data, setData] = useState<StartAvatarResponse>()
    const [text, setText] = useState<string>("")
    const [chatMode, setChatMode] = useState("text_mode")
    const [isUserTalking, setIsUserTalking] = useState(false)
    const mediaStream = useRef<HTMLVideoElement>(null)
    const avatar = useRef<StreamingAvatar | null>(null)
    const openaiAssistant = useRef<OpenAIAssistant | null>(null)
    const [debug, setDebug] = useState<string>();
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    async function fetchAccessToken() {
        try {
            setLoading(true);
            const response = await fetch("/api/get-access-token", { method: "POST" })
            const token = await response.text()
            console.log("Access Token:", token)
            return token
        } catch (error) {
            console.error("Error fetching access token:", error)
            return ""
        }
    }

    async function startSession() {
        const token = await fetchAccessToken()
        avatar.current = new StreamingAvatar({ token })
        openaiAssistant.current = new OpenAIAssistant()
        await openaiAssistant.current.initialize()

        try {
            const res = await avatar.current.createStartAvatar({
                quality: AvatarQuality.Medium,
                avatarName: "Wayne_20240711",
                language: language,
                disableIdleTimeout: true,
                voice: { rate: 2.0, emotion: VoiceEmotion.EXCITED },
            })
            setData(res)
        } catch (error) {
            console.error('Failed to start avatar:', error)
        }

        avatar.current?.startVoiceChat({ useSilencePrompt: false })
        setChatMode("voice_mode")
        setupAvatarEventListeners()
    }


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);


    function setupAvatarEventListeners() {
        avatar.current?.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
            setLoading(false);
            console.log("Avatar started talking", e);
        });
        avatar.current?.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
            console.log("Avatar stopped talking", e);
        });
        avatar.current?.on(StreamingEvents.STREAM_DISCONNECTED, () => {
            console.log("Stream disconnected");
            endSession();
        });
        avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
            console.log(">>>>> Stream ready:", event.detail);
            setStream(event.detail);
        });
        avatar.current?.on(StreamingEvents.USER_START, (event) => {
            console.log(">>>>> User started talking:", event);
            setIsUserTalking(true);
        });
        avatar.current?.on(StreamingEvents.USER_STOP, (event) => {
            console.log(">>>>> User stopped talking:", event);
            setIsUserTalking(false);
        });
    }

    async function handleSpeak() {
        if (!avatar.current || !openaiAssistant.current) return
        try{
            setMessages((prev) => [...prev, { text, sender: 'user' }])
            const userDetails = await getStudentById(user.id)
            console.log('User Details:', userDetails)
            const newText = `user query is :${userDetails} `;
            const response = await openaiAssistant.current.getResponse(JSON.stringify(newText))
            setMessages((prev) => [...prev, { text: response, sender: 'ai' }])
            await avatar.current.speak({
                text: response,
                taskType: TaskType.REPEAT,
                taskMode: TaskMode.SYNC
            })
            setText("")
        }
        catch (error) { 
            console.error('Error speaking:', error)
        }
    }
    async function handleInterrupt() {
        if (!avatar.current) {
            setDebug("Avatar API not initialized");

            return;
        }
        await avatar.current
            .interrupt()
            .catch((e) => {
                setDebug(e.message);
            });
    }
    async function endSession() {
        await avatar.current?.stopAvatar();
        setStream(undefined);
    }
    const handleChangeChatMode = useMemoizedFn(async (v) => {
        if (v === chatMode) {
            return;
        }
        if (v === "text_mode") {
            avatar.current?.closeVoiceChat();
        } else {
            await avatar.current?.startVoiceChat();
        }
        setChatMode(v);
    });

    const previousText = usePrevious(text);

    useEffect(() => {
        if (!previousText && text) {
            avatar.current?.startListening();
        } else if (previousText && !text) {
            avatar?.current?.stopListening();
        }
    }, [text, previousText]);

    useEffect(() => {
        return () => {
            endSession();
        };
    }, []);

    useEffect(() => {
        if (stream && mediaStream.current) {
            mediaStream.current.srcObject = stream
            mediaStream.current.onloadedmetadata = () => mediaStream.current?.play()
        }
    }, [stream])

    async function handleSend() {
        const userDetails = await getStudentById(user.id)
        console.log('User Details:', userDetails)
        setMessages((prev) => [...prev, { text, sender: 'user' }, { text: text, sender: 'ai' }])
        setText("")
    }

    return (
        <>
            {stream ? (
                <div className="min-h-screen bg-gradient-to-b flex flex-col font-sans">
                    <main className="flex-grow flex flex-col md:flex-row p-4 gap-4  mx-auto w-full">
                        <section className="flex-1 bg-white rounded-md shadow-lg overflow-hidden">
                            <div className="aspect-video bg-gray-200 relative">
                                <video ref={mediaStream} className="w-full h-full object-cover" autoPlay />
                                <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-2 bottom-3 right-3 p-4">
                                <Button
                                    className="bg-gradient-to-tr  text-white rounded-lg"
                                    onClick={handleInterrupt}
                                >
                                    Interrupt task
                                </Button>
                                <Button
                                    className="bg-gradient-to-tr  to-indigo-300  text-white rounded-lg"
                                    onClick={endSession}
                                >
                                    End session
                                </Button>
                            </div>
                        </section>

                        <section className="flex-1 bg-white shadow-md flex flex-col justify-between">
                            <div
                                className="flex-grow overflow-y-auto px-2"
                                style={{ maxHeight: "calc(100vh - 90px)" }}
                            >
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 my-2 rounded-lg ${message.sender === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-800'
                                                }`}
                                        >
                                            {message.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="border-t  h-auto relative">
                                <div className="w-full flex items-center">
                                    <InteractiveAvatarTextInput
                                        input={text}
                                        label=" "
                                        placeholder="Type a message..."
                                        setInput={setText}
                                        onSubmit={handleSpeak}
                                    />
                                    {text && (
                                        <Chip className="absolute right-16 top-1/2 -translate-y-1/2">
                                            Listening
                                        </Chip>
                                    )}
                                </div>
                            </div>
                        </section>


                    </main>
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-2xl font-bold text-center text-black m-2">AI-Powered Student Counseling</h1>
                    <Button onClick={startSession} className="flex items-center justify-center">
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-black border-white"></div>
                                <span>Starting...</span>
                            </div>
                        ) : (
                            "Start Session"
                        )}
                    </Button>
                </div>
            )} 
        </>
    )
}
