'use client';
import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Send } from 'lucide-react';
import { getAllStudents } from '@/app/helper/student';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]); // Initially empty, no system message displayed
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    const botMessage: Message = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, botMessage]);
    setIsStreaming(true);
    const response = await getAllStudents();
    console.log(JSON.stringify(response));
    const input_with_context = `You are an expert at recommending which programs/courses students should do. The user's query is: ${input}`;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input_with_context,
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
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
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

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex gap-2 max-w-[80%] items-start ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {message.role === 'user' ? 'S' : 'AI'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === 'user'
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

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
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
  );
};

export default page;
