import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image as ImageIcon, X, MessageCircle } from 'lucide-react';
import { chatWithAI } from '../lib/gemini';

interface Message {
  role: 'user' | 'bot';
  content: string;
  images?: string[];
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: 'Hello! I\'m your Tamil Nadu travel assistant. Ask me anything about places to visit, local culture, food, or travel tips!'
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedImages, setSelectedImages] = useState<Array<{ data: string; mimeType: string; url: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && selectedImages.length === 0) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      images: selectedImages.map(img => img.url)
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const imagesToSend = [...selectedImages];
    setSelectedImages([]);
    setIsLoading(true);

    try {
      const response = await chatWithAI(input, imagesToSend);
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Sorry, I encountered an error. Please make sure your Gemini API key is set up correctly.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.start();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            setSelectedImages(prev => [...prev, {
              data: result.split(',')[1],
              mimeType: file.type,
              url: result
            }]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const formatText = (text: string): string => {
    let html = text;
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/\n/g, '<br />');
    return html;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-[#b415ff] to-[#df8908] text-white rounded-full shadow-2xl hover:opacity-90 transition-all transform hover:scale-110 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[calc(100vw-3rem)] sm:w-96 h-[calc(100vh-6rem)] sm:h-[600px] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col z-50">
      <div className="bg-gradient-to-r from-[#b415ff] to-[#df8908] text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base">Tamil Nadu Travel Assistant</h3>
            <p className="text-xs text-white/80">Ask me anything!</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div ref={chatWindowRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-gradient-to-r from-[#b415ff] to-[#df8908] text-white' : 'bg-gray-800 text-white border border-gray-700'} rounded-2xl p-3`}>
              {msg.images && msg.images.length > 0 && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {msg.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                  ))}
                </div>
              )}
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: formatText(msg.content) }}
              />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#b415ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#df8908] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#b415ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedImages.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-800 flex gap-2 flex-wrap bg-black">
          {selectedImages.map((img, idx) => (
            <div key={idx} className="relative group">
              <img src={img.url} alt="" className="w-16 h-16 object-cover rounded-lg" />
              <button
                onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-gray-800 bg-black">
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="chat-image-upload"
          />
          <label htmlFor="chat-image-upload" className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors border border-gray-700">
            <ImageIcon className="w-5 h-5 text-gray-400" />
          </label>
          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-lg transition-colors border ${isRecording ? 'bg-red-500 text-white border-red-500' : 'hover:bg-gray-800 text-gray-400 border-gray-700'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Tamil Nadu..."
            className="flex-1 px-4 py-2 bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-[#b415ff] focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && selectedImages.length === 0)}
            className="p-2 bg-gradient-to-r from-[#b415ff] to-[#df8908] text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
