import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, ScrollArea } from './ui-components';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your Excel Data Assistant. I can help you with data analysis, chart creation, and Excel tips. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple pattern matching for responses
    if (lowerMessage.includes('chart') || lowerMessage.includes('visualization')) {
      return "I can help you create amazing charts! Try uploading your data and go to the Charts section. You can create bar charts, line charts, pie charts, and scatter plots. What type of chart are you looking to create?";
    }
    
    if (lowerMessage.includes('upload') || lowerMessage.includes('file')) {
      return "To upload your data, use the file upload area on the main page. I support CSV and Excel files (.xlsx, .xls). Just drag and drop your file or click to browse. Make sure your file has clear column headers!";
    }
    
    if (lowerMessage.includes('filter') || lowerMessage.includes('search')) {
      return "You can filter and search your data in the Data Analysis section. Use the search box to find specific values, or apply column-specific filters. You can also sort by any column!";
    }
    
    if (lowerMessage.includes('export') || lowerMessage.includes('download')) {
      return "You can export your charts as PNG or SVG files, and your filtered data as CSV or JSON. Look for the download buttons in the Charts and Data Analysis sections.";
    }
    
    if (lowerMessage.includes('excel') || lowerMessage.includes('spreadsheet')) {
      return "I'm an expert with Excel files! I can parse .xlsx and .xls files automatically. Make sure your data has headers in the first row for best results. Need help with a specific Excel feature?";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return "Here's what I can help you with:\n• Upload and parse Excel/CSV files\n• Create interactive charts\n• Filter and analyze data\n• Export visualizations\n• Excel tips and tricks\n\nWhat would you like to know more about?";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm here to help you with your data analysis needs. Whether you need help uploading files, creating charts, or analyzing data, I'm here to assist!";
    }
    
    // Default responses
    const defaultResponses = [
      "That's an interesting question! Could you tell me more about what you're trying to accomplish with your data?",
      "I'd be happy to help! Are you looking to create charts, analyze data, or need help with file uploads?",
      "Let me help you with that. Could you be more specific about what you need assistance with?",
      "Great question! I specialize in data analysis and visualization. What specific task are you working on?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: generateBotResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: "Chat cleared! How can I help you today?",
        timestamp: new Date()
      }
    ]);
    toast.success('Chat history cleared');
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full p-4"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`bg-white/95 backdrop-blur-sm shadow-2xl border-slate-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-80 h-96'
      }`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-full">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span>AI Assistant</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </CardTitle>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 h-6 w-6"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1 h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'bot' && (
                          <Bot className="h-4 w-4 mt-0.5 text-slate-600" />
                        )}
                        {message.type === 'user' && (
                          <User className="h-4 w-4 mt-0.5 text-blue-100" />
                        )}
                        <div>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 text-slate-800 p-3 rounded-lg max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-slate-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-slate-200 p-4">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about data analysis..."
                  className="flex-1 text-sm"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isTyping || !inputMessage.trim()}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-slate-500">
                  AI Assistant • Always ready to help
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Clear chat
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIChatbot;
