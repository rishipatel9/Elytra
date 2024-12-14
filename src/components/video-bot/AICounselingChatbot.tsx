'use client'
import InteractiveAvatarTextInput from './InteractiveAvatarTextInput'
import { Chip } from '@nextui-org/chip'
import { Button } from '../ui/button'
import { Toaster } from 'sonner'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useAvtarSession from '../../hooks/useAvtarSession'
import UserSessionsTable from './UserSessions'
import { Logo, LogoIcon } from '../MainSidebar'
import { Brain } from 'lucide-react'

export interface User {
    id: string;
    name: string;
    email: string;
    image: string;
}
export default function AICounselingChatbot({ user }: { user: User }) {
    const {
        messages,
        text,
        setText,
        handleSpeak,
        handleInterrupt,
        handleVoiceIconClick,
        isVoiceMode,
        mediaStream,
        endSessionPage,
        loading,
        subtitles,
        additionalContext,
        endSession,
        messagesEndRef,
        startSession,
        stream,
        setEndSessionPage,
        startLoading,
        handleSend,
        setMessages,
        isTyping
    } = useAvtarSession({ user });
    return (
        <>
            {stream && !endSessionPage ? (
            <div className="min-h-screen flex flex-col font-sans">
                <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 mx-auto w-full dark:bg-[#202434] bg-background">
                    <section className="flex-1 bg-gray-100 dark:bg-[#212A39] rounded-xl border dark:border-[#3B4254] border-[#E9ECF1] shadow-lg overflow-hidden">
                        <div className="aspect-video bg-gray-200 relative">
                            <video ref={mediaStream} className="w-full h-full object-cover" autoPlay />
                            <div className="absolute bottom-8 w-full text-center">
                                <p className="text-xl font-bold text-white bg-black bg-opacity-50 px-4 py-2 rounded">
                                    {subtitles || "Waiting for avatar to speak..."}
                                </p>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4"></div>
                        </div>
                        <div className="flex flex-row w-full gap-2 mt-2 bottom-3 right-3 p-4 border-t dark:border-[#3B4254]">
                            <Button
                                className="bg-gradient-to-tr text-white rounded-lg w-full"
                                onClick={handleInterrupt}
                                style={{ borderRadius: "0.5rem" }}
                            >
                                Interrupt task
                            </Button>
                            <Button
                                className="bg-gradient-to-tr to-indigo-300 w-full text-white rounded-lg"
                                onClick={() => setEndSessionPage(true)}
                                style={{ borderRadius: "0.5rem" }}
                            >
                                End session
                            </Button>



                            <div></div>
                        </div>
                        <div className="p-4 border-t dark:border-[#3B4254] bg-gray-100 dark:bg-[#212A39]">
                            <h2 className="text-lg font-semibold mb-2">Useful Resources</h2>
                            <ul className="space-y-2">
                                {additionalContext.resources.length > 0 ? (
                                    additionalContext.resources.map((url, index) => (
                                        <li key={index}>
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline hover:text-blue-700"
                                            >
                                                {url}
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <li>No resources available.</li>
                                )}
                            </ul>
                        </div>
                      <div className="p-4 border-t dark:border-[#3B4254] bg-gray-100 dark:bg-[#212A39]">
  <h2 className="text-lg font-semibold mb-2">Suggested Questions</h2>
  <ul className="space-y-2">
    {additionalContext.suggestedQuestions.filter(question => question !== "").length > 0 ? (
      additionalContext.suggestedQuestions
        .filter(question => question !== "") // Filter out empty strings
        .map((question, index) => (
          <li key={index} className="flex justify-between w-full">
            <div>{question}</div>
            <div>
              <Button
                className="bg-gradient-to-tr to-indigo-300 w-full text-white"
                style={{ borderRadius: "0.6rem" }}
                onClick={() => handleSpeak(question)}
              >
                Ask
              </Button>
            </div>
          </li>
        ))
    ) : (
      <li>No suggested questions available.</li>
    )}
  </ul>
</div>

                    </section>

                    <section className="flex-1 bg-gray-100 dark:bg-[#212A39] bg-background shadow-md flex flex-col justify-between rounded-xl border dark:border-[#3B4254] border-[#E9ECF1]">
                        <div
                            className="flex-grow overflow-y-auto px-2"
                            style={{ maxHeight: "calc(100vh - 90px)" }}
                        >
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex items-end gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {/* Avatar for sender */}
                                    {message.sender !== "user" && (
                                        <div className="flex-shrink-0">
                                            <div
                                                className="w-8 h-8 flex items-center justify-center rounded-full border-2 shadow-lg dark:bg-[#202434] bg-white dark:border-[#293040] border-[#E9ECF1]"
                                            >
                                                <span className="text-xs font-semibold text-black dark:text-white">
                                                    <Brain className="h-4 w-4 text-purple-500" />
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Message bubble */}
                                    <div
                                        style={{ borderRadius: "0.6rem" }}
                                        className={`max-w-[80%] p-3 my-2 font-medium rounded-lg border dark:border-[#3B4254] border-[#E9ECF1] ${message.sender === "user"
                                            ? "bg-[#7C3AED] text-white"
                                            : "dark:bg-[#202434] bg-background text-black dark:text-white"
                                            }`}
                                    >
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                a: ({ href, children }) => (
                                                    <a
                                                        href={href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 underline"
                                                    >
                                                        {children}
                                                    </a>
                                                ),
                                            }}
                                        >
                                            {message.text}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Avatar for user */}
                                    {message.sender === "user" && (
                                        <div className="flex-shrink-0">
                                            <div
                                                className="w-8 h-8 flex items-center justify-center rounded-full border-2 shadow-lg dark:bg-[#202434] bg-white dark:border-[#293040] border-[#E9ECF1]"
                                            >
                                                <span className="text-xs font-semibold text-black dark:text-white">
                                                    {user.name?.[0] || "U"}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Typing animation */}
                            {isTyping && (
                                <div className="flex items-center gap-2 justify-start p-2">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 shadow-lg dark:bg-[#202434] bg-white dark:border-[#293040] border-[#E9ECF1]">
                                            <span className="text-xs font-semibold text-black dark:text-white">
                                                <Brain className="h-4 w-4 text-purple-500" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        <span className="h-2 w-2 bg-gray-400 dark:bg-gray-200 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                        <span className="h-2 w-2 bg-gray-400 dark:bg-gray-200 rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                        <span className="h-2 w-2 bg-gray-400 dark:bg-gray-200 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                        <div className='bg-transparent p-4 overflow-x-auto'>
                            {additionalContext.suggestedQuestions.length > 0 ? (
                                <ul className='flex space-x-4'>
                                    {additionalContext.suggestedQuestions.map((question, index) => (
                                        <li key={index} className='flex-none bg-[#7C3AED] rounded-2xl shadow-lg text-white p-2 px-4' onClick={()=>handleSpeak(question)}>
                                            <div>{question}</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div></div>
                            )}
                        </div>

                        <div className="border-t h-auto relative dark:border-[#3B4254] border-[#E9ECF1]">
                            <div className="w-full flex items-center">
                                <InteractiveAvatarTextInput
                                    input={text}
                                    label=" "
                                    placeholder="Type a message..."
                                    setInput={setText}
                                    onSubmit={handleSpeak}
                                    handleVoiceIconClick={handleVoiceIconClick}
                                    isVoiceMode={isVoiceMode}
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
                <div className="flex flex-col items-center justify-center h-screen bg-background dark:bg-[#202434] font-sans dark:border-[#293040] border-[#E9ECF1]">
                    <div className="max-w-6xl w-full h-full">
                        {<UserSessionsTable onStartSession={startSession} startLoading={startLoading} />}

                    </div>
                </div>
            )}
            {endSessionPage && (
                <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-2xl font-bold text-center text-white m-2">Session Ended</h1>
                    <Button onClick={() => setEndSessionPage(false)} className="flex items-center justify-center">
                        Start New Session
                    </Button>
                    <Toaster />
                </div>
            )}
        </>
    );
}