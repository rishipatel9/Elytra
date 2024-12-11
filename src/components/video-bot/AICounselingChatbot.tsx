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
import axios from 'axios'
import { storeChats, summarizeChat } from '@/lib/db'
import { toast, Toaster } from 'sonner'
import UserDataTable from './UserSessions'

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    const [sessionId, setSessionId] = useState<string>("")
    const [subtitles, setSubtitles] = useState("") // Array of subtitle parts
    const [additionalContext, setAdditionalContext] = useState<{
        resources: string[];
        suggestedQuestions: string[];
    }>({
        resources: [],
        suggestedQuestions: []
    });
    let sentenceBuffer = ""

    const userId = user.id
    useEffect(() => {
        // Define an asynchronous function to initialize OpenAI Assistant
        const initializeAssistantAndStream = async () => {
            try {
                // Access media devices for video and audio streams
                if (typeof window !== 'undefined') {
                    const mediaStream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true,
                    });
                    setStream(mediaStream);
                }

                // Initialize OpenAI Assistant
                openaiAssistant.current = new OpenAIAssistant(userId);
                await openaiAssistant.current.initialize();
                console.log("OpenAI Assistant initialized successfully");
            } catch (error) {
                console.error("Error during initialization:", error);
            }
        };

        // Call the asynchronous function
        initializeAssistantAndStream();
    }, [userId]); // Dependency array includes userId


    async function fetchAccessToken() {
        try {
            setLoading(true);
            const response = await axios.post("/api/get-access-token", { userId: user.id })
            console.log('Response:', response.data)
            setSessionId(response.data.sessionId)
            const token = response.data.token
            return token
        } catch (error) {
            toast.error(`Error Creating Session: ${error} Please try again `)
            console.error("Error fetching access token:", error)
            return ""
        }
    }

    // async function startSession() {
    //     const token = await fetchAccessToken()
    //     avatar.current = new StreamingAvatar({ token })
    //     openaiAssistant.current = new OpenAIAssistant(userId)
    //     await openaiAssistant.current.initialize()

    //     try {
    //         const res = await avatar.current.createStartAvatar({
    //             quality: AvatarQuality.Medium,
    //             avatarName: "Wayne_20240711",
    //             language: language,
    //             disableIdleTimeout: true,
    //             voice: { rate: 2.0, emotion: VoiceEmotion.EXCITED },
    //             knowledgeBase:"You are an international student career counsellor"
    //         })
    //        setData(res)
    //     } catch (error) {
    //         toast.error(`Error starting avatar: ${error} Please try again`)
    //         console.error('Failed to start avatar:', error)
    //     }

    //     avatar.current?.startVoiceChat({ useSilencePrompt: false })
    //     setChatMode("voice_mode")
    //     setupAvatarEventListeners()
    // }


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
        
        avatar.current?.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (e) => {
            const message = e.detail.message;
            sentenceBuffer += message;

            // Update the subtitle in real time
            setSubtitles(sentenceBuffer.trim());

            console.log(`Subtule  : ${subtitles}`);

            console.log(`Avatar message: ${message}`);
        });
 
    }

    // async function handleSpeak() {
    //     if (!avatar.current || !openaiAssistant.current) return
    //     try{

    //         setMessages((prev) => [...prev, { text, sender: 'user' }])
    //         const res = await getStudentById(user.id)
    //         console.log('User Details:', res)
    //         const response = await openaiAssistant.current.getResponse(res.message)
    //         setMessages((prev) => [...prev, { text: response, sender: 'ai' }])
    //         await avatar.current.speak({
    //             text: response,
    //             taskType: TaskType.REPEAT,
    //             taskMode: TaskMode.SYNC
    //         })
    //         setText("")
    //         storeChats({sessionId:sessionId,message:text,sender:"USER"})
    //         storeChats({sessionId:sessionId,message:response,sender:"AI"})
    //     }
    //     catch (error) {
    //         toast.error(`Error speaking: ${error} Please try again`)
    //         console.error('Error speaking:', error)
    //     }
    // }


    
    async function handleSpeak() {
        if (!openaiAssistant.current) {
            setDebug("Avatar or OpenAI Assistant not initialized");
            return;
        }
        console.log(`in handle speak`)
        try {
            // Get response from OpenAI Assistanst
            console.log(`text is ${text}`)
            // const studentDetails = await getStudentById(userId);

            //   console.log(`student details are :${JSON.stringify(studentDetails)}`)
            //  setText(`user query is :${text}   for some context this is some info about student${studentDetails} if it helps  `)
            setMessages((prev) => [...prev, { text, sender: 'user' }])

            console.log(`new text is ${text}`)
            const newText = `user query is :${text} `;
            console.log(`new text is ${newText}`)
            const response = await openaiAssistant.current.getResponse(text);
            const additionalContext = await openaiAssistant.current.getAdditionalContext(text);
            console.log(`additionalContext is ${JSON.stringify(additionalContext)}`)
            setAdditionalContext(additionalContext);


        
        
            console.log(`RESP IS :${JSON.stringify(response)}`)
            setMessages((prev) => [...prev, { text: response, sender: 'ai' }])

            //   await avatar.current.speak({ 
            //     text: response, 
            //     taskType: TaskType.REPEAT, 
            //     taskMode: TaskMode.SYNC 
            //   });
        
        
            storeChats({ sessionId: sessionId, message: text, sender: "USER" })
            storeChats({ sessionId: sessionId, message: response, sender: "AI" })
            //     }
        } catch (e: any) {
            setDebug(e.message);
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
        summarizeChat(sessionId)
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

    // useEffect(() => {
    //     return () => {
    //         endSession();
    //     };
    // }, []);

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
                <div className="min-h-screen flex flex-col font-sans">
                    <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 mx-auto w-full">
                        <section className="flex-1 bg-white rounded-md shadow-lg overflow-hidden">
                            <div className="aspect-video bg-gray-200 relative">
                                <video ref={mediaStream} className="w-full h-full object-cover" autoPlay />
                                <div className="absolute bottom-8 w-full text-center">
                                    <p className="text-xl font-bold text-white bg-black bg-opacity-50 px-4 py-2 rounded">
                                        {subtitles || "Waiting for avatar to speak..."}
                                    </p>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4"></div>
                            </div>
                            <div className="flex flex-col gap-2 mt-2 bottom-3 right-3 p-4">
                                <Button className="bg-gradient-to-tr text-white rounded-lg" onClick={handleInterrupt}>
                                    Interrupt task
                                </Button>
                                <Button className="bg-gradient-to-tr to-indigo-300 text-white rounded-lg" onClick={endSession}>
                                    End session
                                </Button>
                            </div>
                            <div className="p-4 border-t bg-gray-50">
                                <h2 className="text-lg font-semibold mb-2">Useful Resources</h2>
                                <ul className="space-y-2">
                                    {additionalContext.resources.length > 0 ? (
                                        additionalContext.resources.map((url, index) => (
                                            <li key={index}>
                                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">
                                                    {url}
                                                </a>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No resources available.</li>
                                    )}
                                </ul>
                            </div>
                            <div className="p-4 border-t bg-gray-50">
                                <h2 className="text-lg font-semibold mb-2">Suggested Questions</h2>
                                <ul className="space-y-2">
                                    {additionalContext.suggestedQuestions.length > 0 ? (
                                        additionalContext.suggestedQuestions.map((question, index) => (
                                            <li key={index}>
                                                <p>{question}</p>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No suggested questions available.</li>
                                    )}
                                </ul>
                            </div>
                        </section>

                        <section className="flex-1 bg-white shadow-md flex flex-col justify-between">
                            <div className="flex-grow overflow-y-auto px-2" style={{ maxHeight: "calc(100vh - 90px)" }}>
                                {messages.map((message, index) => (
                                    <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 my-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    a: ({ href, children }) => (
                                                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                                            {children}
                                                        </a>
                                                    ),
                                                }}
                                            >
                                                {message.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="border-t h-auto relative">
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
                            <Toaster />
                        </section>
                    </main>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-screen bg-background dark:bg-[#202434] font-sans dark:border-[#293040] border-[#E9ECF1]">
                    <div className="max-w-6xl w-full h-full">
                        <UserDataTable />
                    </div>
                </div>
            )}
            {/* Keep the following block for session start if necessary */}
            {!stream && (
                <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-2xl font-bold text-center text-black m-2">AI-Powered Student Counseling</h1>
                    <Button onClick={() => console.log(`start session`)} className="flex items-center justify-center">
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-black border-white"></div>
                                <span>Starting...</span>
                            </div>
                        ) : (
                            "Start Session"
                        )}
                    </Button>
                    <Toaster />
                </div>
            )}
        </>
    );
}