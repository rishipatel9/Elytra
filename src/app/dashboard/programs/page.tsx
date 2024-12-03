'use client';
import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Send } from 'lucide-react';
import { getAllStudents } from '@/app/helper/student';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Gemini API
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY || ' ',
});

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || ' ');
const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

const index = pinecone.Index('program-recommendations');

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [usedContexts, setUsedContexts] = useState<string[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    const botMessage: Message = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, botMessage]);
    setIsStreaming(true);

    try {
      const embeddingResult = await model.embedContent(input);
      const embeddingVector = embeddingResult.embedding.values;

      const searchResults = await index.query({
        vector: embeddingVector,
        topK: 3,
        includeMetadata: true,
      });


      console.log(JSON.stringify(searchResults))
      const contexts = searchResults.matches.map(
        (match: any) =>
          `${match.metadata?.name || 'Unknown'}: ${match.metadata?.description || 'No description'}`
      );

      setUsedContexts(contexts);
      console.log(`contexts are ${contexts}`)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `You are an expert at recommending programs/courses. The user's query is: ${input} these are some of the programs Elytra (we) have to offer,${contexts} try to incorporate them in your response as well like we elyta offer these too if u would like to know more about them if the context is not proveded to u  just give them ur genreral response`,
          contexts,
          students: students.map((student) => ({
            name: student.name,
            nationality: student.nationality,
            careerAspirations: student.careerAspirations,
            preferredCountries: student.preferredCountries,
            preferredPrograms: student.preferredPrograms,
          })),
        }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error streaming response:', error);
    }

    setInput('');
    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col h-screen"> {/* Changed to h-screen */}
      {/* Header */}
      <SidebarTrigger />
      <header className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold">Program Recommendation</h1>
            <p className="text-sm text-muted-foreground">
              Helping you choose the right programs for your studies
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut()}
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      {/* Main scrollable container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Context Box */}
        {usedContexts.length > 0 && (
          <div className="p-4 bg-muted text-muted-foreground shrink-0">
            <h2 className="text-sm font-semibold">Used Contexts:</h2>
            <ul className="list-disc pl-4">
              {usedContexts.map((context, idx) => (
                <li key={idx} className="text-sm">
                  {context}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] items-start ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {message.role === 'user' ? 'S' : 'AI'}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg px-4 py-2 ${message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                      }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="text-muted-foreground">
                Program recommender is typing...
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area - Fixed at bottom */}
        <div className="p-4 border-t mt-auto bg-background">
          <div className="flex gap-2 max-w-[1200px] mx-auto">
            <Input
              placeholder="Type your question about program recommendations..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
              disabled={isStreaming}
            />
            <Button
              onClick={sendMessage}
              size="icon"
              disabled={isStreaming}
              aria-label="Send message"
            >
              {isStreaming ? (
                <span className="text-sm">...</span>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
