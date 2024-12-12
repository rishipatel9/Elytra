'use client';
import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Send } from 'lucide-react';
import { Pinecone } from '@pinecone-database/pinecone';
import { toast } from 'sonner';
import { genAI } from '@/lib/GeminiClient';

const pc = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
});

const index = pc.index('program-recommendations');

const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [usedContexts, setUsedContexts] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      console.log('Getting embeddings for query:', input);
      const embeddingResult = await model.embedContent(input);
      const embeddingVector = embeddingResult.embedding.values;
      console.log('Got embeddings, vector length:', embeddingVector.length);

      console.log('Checking Pinecone connection...');
      if (!process.env.NEXT_PUBLIC_PINECONE_API_KEY) {
        throw new Error('Pinecone API key is not configured');
      }

      console.log('Searching Pinecone...');
      try {
        const searchResults = await index.query({
          vector: embeddingVector,
          topK: 5,
          includeMetadata: true,
        });
        console.log('Pinecone search results:', searchResults);

        if (!searchResults.matches || searchResults.matches.length === 0) {
          console.log('No matches found in Pinecone');
          toast.error('No relevant programs found. Try a different query.');
          return;
        }

        const contexts = searchResults.matches.map((match: any) => {
          console.log('Processing match:', match);
          const metadata = match.metadata;
          return `
Program Details:
- Name: ${metadata.Program || 'Unknown'}
- University: ${metadata.University || 'Unknown'}
- Location: ${metadata.Location || 'Not specified'}
- Specialization: ${metadata.Specialization || 'Not specified'}
- Curriculum: ${metadata.Curriculum || 'Not specified'}
- Special Features: ${metadata.SpecialLocationFeatures || 'Not specified'}
- Co-op/Internship: ${metadata.CoOpInternship || 'Not specified'}
- Key Job Roles: ${metadata.KeyJobRoles || 'Not specified'}
- Eligibility:
  * GPA: ${metadata.EligibilityMinimumGPA || 'Not specified'}
  * Work Experience: ${metadata.EligibilityWorkExperience || 'Not specified'}
  * Background: ${metadata.EligibilityUGBackground || 'Not specified'}
  * Backlogs: ${metadata.EligibilityBacklogs || 'Not specified'}
- Application Requirements:
  * LOR: ${metadata.LOR || 'Not specified'}
  * SOP: ${metadata.SOP || 'Not specified'}
  * Application Fee: ${metadata.ApplicationFee || 'Not specified'}
  * Deposit: ${metadata.Deposit || 'Not specified'}
Relevance Score: ${match.score ? Math.round(match.score * 100) / 100 : 'Not available'}
`;
        });

        console.log('Formatted contexts:', contexts);
        setUsedContexts(contexts);

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);

        const botMessage: Message = { role: 'assistant', content: '' };
        setMessages(prev => [...prev, botMessage]);
        setIsStreaming(true);

        console.log('Sending to chat API...');
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: input,
            contexts: contexts,
            metadata: {
              totalResults: searchResults.matches.length,
              queryType: 'program_search',
            }
          }),
        });

        if (!response.ok) {
          throw new Error(`Chat API returned ${response.status}`);
        }

        if (!response.body) {
          throw new Error('No response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          setMessages(prev =>
            prev.map((msg, idx) =>
              idx === prev.length - 1
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        }
      } catch (error) {
        console.error('Error searching Pinecone:', error);
        toast.error('An error occurred while searching Pinecone');
        setMessages(prev =>
          prev.map((msg, idx) =>
            idx === prev.length - 1
              ? { ...msg, content: 'Sorry, there was an error searching Pinecone.' }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while processing your request');
      setMessages(prev =>
        prev.map((msg, idx) =>
          idx === prev.length - 1
            ? { ...msg, content: 'Sorry, there was an error processing your request.' }
            : msg
        )
      );
    }

    setInput('');
    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background dark:bg-[#202434]">
      <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b dark:border-[#293040] border-[#E9ECF1]">
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
            // onClick={signOut}
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </header>

        {/* Used Contexts */}
        {/* {usedContexts?.length > 0 && (
          <div className="p-4 bg-muted text-muted-foreground">
            <h2 className="text-sm font-semibold mb-1">Programs Found:</h2>
            <ul className="list-disc pl-4 max-h-40 overflow-y-auto">
              {usedContexts.map((context, idx) => (
                <li key={idx} className="text-sm whitespace-pre-wrap">
                  {context}
                </li>
              ))}
            </ul>
          </div>
        )} */}

        {/* Messages Section */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 mb-4">
            {messages?.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${message.role === 'user'
                      ? 'flex-row-reverse items-end'
                      : 'flex-row'
                    }`}
                >
                  {/* Avatar */}
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {message.role === 'user' ? 'U' : 'AI'}
                    </AvatarFallback>
                  </Avatar>

                  {/* Message Content */}
                  <div
                    className={`rounded-lg px-4 py-2 text-sm ${message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {message.role === 'assistant' ? (
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            ?.replace(/\n\n/g, '</p><p>')
                            .replace(/\n/g, '<br/>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/- (.*?)(?=\n|$)/g, '<li>$1</li>')
                            .replace(/((?:<li>.*?<\/li>\n*)+)/g, '<ul>$1</ul>')
                            .replace(/^(.*?)(?=<|$)/g, '<p>$1</p>'),
                        }}
                      />
                    ) : (
                      <p className="whitespace-pre-wrap">
                        {message.content || ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* Scroll to Bottom */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border dark:border-[#3A3F4B] border-[#E9ECF1] bg-background dark:bg-[#222939] shadow-md rounded-xl m-4">
          <div className="flex items-center gap-2 max-w-[1200px] mx-auto p-2">
            <div className="relative flex-1">
              <Input
                placeholder="Type your question about program recommendations..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && !isStreaming && sendMessage()
                }
                className="w-full pr-12 pl-4 py-3 text-sm rounded-md border border-neutral-300 outline-none border-none dark:bg-[#222939] dark:text-white"
                disabled={isStreaming}
              />
              {/* Send Button Inside the Input */}
              <Button
                onClick={sendMessage}
                size="icon"
                disabled={isStreaming}
                aria-label="Send message"
                className="absolute right-2 top-1/2 transform -translate-y-1/2    text-white rounded-xl"
              >
                {isStreaming ? (
                  <span className="text-sm animate-pulse">...</span>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Page;
