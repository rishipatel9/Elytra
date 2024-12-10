import { getStudentById } from '@/helper';
import { storeChats, summarizeChat } from '@/lib/db';
import { OpenAIAssistant } from '@/lib/openai-assistant';
import StreamingAvatar, { AvatarQuality, StartAvatarResponse, StreamingEvents, TaskMode, TaskType, VoiceEmotion } from '@heygen/streaming-avatar';
import { useMemoizedFn, usePrevious } from 'ahooks';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';

const useAvtarSession = ({ user }: { user: any }) => {
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
    const [subtitles, setSubtitles] = useState("")
    let sentenceBuffer = "";

    async function startSession() {

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

        const token = await fetchAccessToken()
        avatar.current = new StreamingAvatar({ token })
        openaiAssistant.current = new OpenAIAssistant(user.id)
        await openaiAssistant.current.initialize()

        try {
            const res = await avatar.current.createStartAvatar({
                quality: AvatarQuality.Medium,
                avatarName: "Wayne_20240711",
                language: language,
                disableIdleTimeout: true,
                voice: { rate: 2.0, emotion: VoiceEmotion.EXCITED },
                knowledgeBase: "You are an international student career counsellor"
            })
            setData(res)
        } catch (error) {
            toast.error(`Error starting avatar: ${error} Please try again`)
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

        avatar.current?.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (e) => {
            const message = e.detail.message;
            sentenceBuffer += message;

            // Update the subtitle in real time
            setSubtitles(sentenceBuffer.trim());

            console.log(`Subtule  : ${subtitles}`);

            console.log(`Avatar message: ${message}`);
        });

    }

    async function handleSpeak() {
        if (!avatar.current || !openaiAssistant.current) return
        try{

            setMessages((prev) => [...prev, { text, sender: 'user' }])
            const res = await getStudentById(user.id)
            console.log('User Details:', res)
            const response = await openaiAssistant.current.getResponse(res.message)
            setMessages((prev) => [...prev, { text: response, sender: 'ai' }])
            await avatar.current.speak({
                text: response,
                taskType: TaskType.REPEAT,
                taskMode: TaskMode.SYNC
            })
            setText("")
            storeChats({sessionId:sessionId,message:text,sender:"USER"})
            storeChats({sessionId:sessionId,message:response,sender:"AI"})
        }
        catch (error) {
            toast.error(`Error speaking: ${error} Please try again`)
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
    return {
        handleSend,
        handleInterrupt,
        handleSpeak,
        handleChangeChatMode,
        endSession,
        startSession,
        stream,
        text,
        sessionId,
        subtitles,
        loading
    }
}
export default useAvtarSession
