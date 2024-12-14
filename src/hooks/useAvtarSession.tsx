import React from 'react'

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
import { getStudentById } from '@/helper'
import { useMemoizedFn, usePrevious } from 'ahooks'

import axios from 'axios'
import { storeChats, summarizeChat } from '@/lib/db'
import { toast } from 'sonner'
import { User } from '@/components/video-bot/AICounselingChatbot'
import { Pinecone } from '@pinecone-database/pinecone'
import { genAI } from '@/lib/GeminiClient'

const useAvtarSession = ({ user }: { user: User }) => {
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
    const [isVoiceMode, setIsVoiceMode] = useState(false); // Voice mode toggle
    const [endSessionPage, setEndSessionPage] = useState(false);
    const [startLoading, setStartLoading] = useState(false)
    const [isTyping , setIsTyping]=useState(false)

    const userId = user.id
    // useEffect(() => {
    //     const initializeAssistantAndStream = async () => {
    //         try {
    //           //  Access media devices for video and audio streams
    //             if (typeof window !== 'undefined') {
    //                 const mediaStream = await navigator.mediaDevices.getUserMedia({
    //                     video: true,
    //                     audio: true,
    //                 });
    //                 setStream(mediaStream);
    //             }

    //            // Initialize OpenAI Assistant
    //            openaiAssistant.current = new OpenAIAssistant(userId);
    //             await openaiAssistant.current.initialize();
    //             console.log("OpenAI Assistant initialized successfully");
    //         } catch (error) {
    //             console.error("Error during initialization:", error);
    //         }
    //     };

    //     // Call the asynchronous function
    //     initializeAssistantAndStream();
    // }, [userId]); // Dependency array includes userId


    useEffect(() => {
        const handleBeforeUnload = (event: any) => {
            // Display a custom warning message before the page is unloaded
            event.preventDefault(); // For modern browsers
            event.returnValue = '';  // For older browsers
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    async function fetchAccessToken() {
        try {
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

    async function fetchAccessTokenWithSpecificKey(apiKey:any) {
  try {
    const response = await axios.post("/api/get-access-token", { userId: user.id }, {
      headers: { "x-api-key": apiKey },
    });
    console.log('Response:', response.data);
    setSessionId(response.data.sessionId);
    return response.data.token;
  } catch (error) {
    console.error(`Error fetching token with key ${apiKey}:`, error);
    throw new Error(`Token fetch failed with key: ${apiKey}`);
  }
}

const HEYGEN_API_KEYS = [
    process.env.NEXT_PUBLIC_HEYGEN_API_KEY1,
    process.env.NEXT_PUBLIC_HEYGEN_API_KEY2,
    process.env.NEXT_PUBLIC_HEYGEN_API_KEY2,

].filter(Boolean);
    
console.log(  process.env.HEYGEN_API_KEY1)


console.log(`our keys are ${HEYGEN_API_KEYS}`)
   async function startSession() {
  let currentKeyIndex = 0;
  const MAX_RETRIES = HEYGEN_API_KEYS.length;

  while (currentKeyIndex < MAX_RETRIES) {
    try {
      setStartLoading(true);
      
      // Fetch token using the current API key
      const currentApiKey = HEYGEN_API_KEYS[currentKeyIndex];
      const token = await fetchAccessTokenWithSpecificKey(currentApiKey);

      // Initialize avatar and assistant
      avatar.current = new StreamingAvatar({ token });
      openaiAssistant.current = new OpenAIAssistant(userId);
      await openaiAssistant.current.initialize();

      // Try to create and start avatar
        try {
            const res = await avatar.current.createStartAvatar({
                quality: AvatarQuality.Medium,
                avatarName: "Wayne_20240711",
                language: language,
                disableIdleTimeout: true,
                voice: { rate: 2.0, emotion: VoiceEmotion.EXCITED },
                knowledgeBase: "You are an international student career counsellor",
            });

            setData(res);
            setupAvatarEventListeners();
            setStartLoading(false);
            return; // Exit successfully
        } catch (avatarError) {
            console.error(`Avatar creation failed with key index ${currentKeyIndex}:`, avatarError);
            currentKeyIndex++; // Move to next key if available
            console.log(`trying with new keys index ${currentKeyIndex} key is ${HEYGEN_API_KEYS[currentKeyIndex]};`)
      }
    } catch (tokenError) {
      console.error(`Token fetch failed with key index ${currentKeyIndex}:`, tokenError);
      currentKeyIndex++; // Move to next key if available
    }
  }

  // If we exhaust retries
  toast.error('Failed to create avatar with all available API keys');
  setStartLoading(false);
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

        avatar.current?.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (e) => {
            const message = e.detail.message;
            sentenceBuffer += message;

            // Update the subtitle in real time
            //   setSubtitles(sentenceBuffer.trim());

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

    /* ***Trying to give assistant program context */
    const pc = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
});

const index = pc.index('program-recommendations');
const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    //initialized pinecone and gemini embedding 
    

    async function handleSpeak(question?: string) {
        console.log(`handle speak triggered`);
        const userQuery = question || text || "";
        setMessages((prev) => [...prev, { text: userQuery, sender: 'user' }]);
        setIsTyping(true)

        if (!openaiAssistant.current) {
            setDebug("Avatar or OpenAI Assistant not initialized");
            openaiAssistant.current = new OpenAIAssistant(userId);
            await openaiAssistant.current.initialize();
            console.log(`openai initialized`);
        }

        console.log(`in handle speak`);
        //

        // Fetch program recommendations if the query is related to programs
        let programContexts:any = [];
        const embeddingResult = await model.embedContent(userQuery);
        const embeddingVector = embeddingResult.embedding.values;
        
        // Search Pinecone for relevant programs
        const searchResults = await index.query({
            vector: embeddingVector,
            topK: 3,
            includeMetadata: true,
        });

        if (searchResults.matches && searchResults.matches.length > 0) {
            programContexts = searchResults.matches.map((match: any) => {
                const metadata = match.metadata;
                return `
                Program Details:
                - Name: ${metadata.Program || 'Unknown'}
                - University: ${metadata.University || 'Unknown'}
                - Location: ${metadata.Location || 'Not specified'}
                - Specialization: ${metadata.Specialization || 'Not specified'}
                - Curriculum: ${metadata.Curriculum || 'Not specified'}
                - Key Job Roles: ${metadata.KeyJobRoles || 'Not specified'}
                `;
            });
            console.log('Program contexts:', programContexts);
        }
        console.log(`matching program contexts ${programContexts}`)
        try {
            console.log(`text is ${userQuery}`);

            const newText = `user query is: ${userQuery}`;
            console.log(`new text is ${newText}`);

            const response = await openaiAssistant.current.getResponse(userQuery,programContexts);
            const additionalContext = await openaiAssistant.current.getAdditionalContext(userQuery);
            console.log(`additionalContext is ${JSON.stringify(additionalContext)}`);
            setAdditionalContext(additionalContext);

            console.log(`RESP IS: ${JSON.stringify(response)}`);
            setIsTyping(false)
            setMessages((prev) => [...prev, { text: response, sender: 'ai' }]);

            if (avatar.current) {
                await avatar.current.speak({
                    text: response,
                    taskType: TaskType.REPEAT,
                    taskMode: TaskMode.SYNC,
                });
            }

            // Store the chat history
            storeChats({ sessionId: sessionId, message: userQuery, sender: "USER" });
            storeChats({ sessionId: sessionId, message: response, sender: "AI" });
        } catch (e: any) {
            setIsTyping(false)
            setDebug(e.message);
            console.error(`Error in handleSpeak: ${e.message}`);
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
        setEndSessionPage(true);
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

    // useEffect(() => {
    //     if (!previousText && text) {
    //         avatar.current?.startListening();
    //     } else if (previousText && !text) {
    //         avatar?.current?.stopListening();
    //     }
    // }, [text, previousText]);


    const handleVoiceIconClick = async () => {
        try {
            console.log(`handlevoiceicon clicked`)
            if (!isVoiceMode) {
                if (!avatar.current) {
                    await startSession(); // Your existing session start method
                }

                console.log(`inside this if  `)

                await avatar.current?.startVoiceChat({ useSilencePrompt: false });
                avatar.current?.startListening();
                setIsVoiceMode(true);
                setChatMode("voice_mode");
            } else {
                console.log(`inside this else  `)

                avatar.current?.stopListening();
                avatar.current?.closeVoiceChat();
                setIsVoiceMode(false);
                setChatMode("text_mode");
            }
        } catch (error) {
            console.error("Voice mode toggle error:", error);
            toast.error("Failed to toggle voice mode");
        }
    };

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
    return {
        messages,
        text,
        setText,
        handleSend,
        handleSpeak,
        handleInterrupt,
        handleVoiceIconClick,
        isVoiceMode,
        mediaStream,
        chatMode,
        handleChangeChatMode,
        endSessionPage,
        debug,
        loading,
        subtitles,
        additionalContext,
        endSession,
        messagesEndRef,
        startSession,
        stream,
        setEndSessionPage,
        startLoading,
        setMessages,
        isTyping
    }
}

export default useAvtarSession
