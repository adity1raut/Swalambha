import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../context/ThemeContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatComponentProps {
  onClose: () => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ onClose }) => {
  const { theme, colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('query', input);

      console.log('Sending query:', input);

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      console.log('Chat response received:', {
        query: input,
        response: data.response?.substring(0, 100),
        sources: data.source_documents?.length || 0,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.error || 'Sorry, I could not process your request.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.warn('Chat request failed:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'The server is currently unavailable. Please make sure the backend is running and try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStyles = () => ({
    chatContainer: {
      position: 'fixed' as const,
      bottom: '100px',
      right: '30px',
      width: '400px',
      height: '600px',
      background: colors.surfaceGlass,
      borderRadius: '20px',
      boxShadow: theme === 'dark'
        ? '0 20px 60px rgba(0, 0, 0, 0.5)'
        : '0 20px 60px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column' as const,
      border: `1px solid ${colors.border}`,
      backdropFilter: 'blur(20px)',
      transition: 'all 0.3s ease',
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px 25px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    },
    headerTitle: {
      margin: 0,
      color: 'white',
      fontSize: '1.25rem',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    closeButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'white',
      fontSize: '18px',
      transition: 'all 0.3s ease',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '15px',
      background: theme === 'dark' 
        ? 'rgba(17, 24, 39, 0.5)' 
        : 'rgba(249, 250, 251, 0.5)',
    },
    emptyState: {
      textAlign: 'center' as const,
      color: colors.textSecondary,
      padding: '60px 20px',
      fontSize: '14px',
    },
    messageWrapper: {
      display: 'flex',
      animation: 'fadeIn 0.3s ease',
    },
    userMessageWrapper: {
      justifyContent: 'flex-end',
    },
    botMessageWrapper: {
      justifyContent: 'flex-start',
    },
    messageBubble: {
      maxWidth: '80%',
      padding: '12px 16px',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
    },
    userMessage: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderBottomRightRadius: '4px',
    },
    botMessage: {
      background: colors.surfaceGlass,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      borderBottomLeftRadius: '4px',
    },
    messageText: {
      margin: 0,
      fontSize: '14px',
      lineHeight: '1.5',
      whiteSpace: 'pre-wrap' as const,
      wordBreak: 'break-word' as const,
    },
    messageTime: {
      fontSize: '11px',
      marginTop: '6px',
      display: 'block',
      opacity: 0.7,
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
    },
    loadingBubble: {
      background: colors.surfaceGlass,
      padding: '12px 16px',
      borderRadius: '16px',
      borderBottomLeftRadius: '4px',
      border: `1px solid ${colors.border}`,
      display: 'flex',
      gap: '6px',
    },
    loadingDot: {
      width: '8px',
      height: '8px',
      background: '#667eea',
      borderRadius: '50%',
      animation: 'bounce 1.4s infinite ease-in-out',
    },
    inputForm: {
      display: 'flex',
      gap: '12px',
      padding: '20px',
      background: colors.surfaceGlass,
      borderTop: `1px solid ${colors.border}`,
      backdropFilter: 'blur(10px)',
    },
    input: {
      flex: 1,
      padding: '12px 16px',
      border: `2px solid ${colors.border}`,
      borderRadius: '20px',
      fontSize: '14px',
      outline: 'none',
      background: theme === 'dark' 
        ? 'rgba(31, 41, 55, 0.5)' 
        : 'rgba(255, 255, 255, 0.8)',
      color: colors.text,
      transition: 'all 0.3s ease',
    },
    inputDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    submitButton: {
      padding: '12px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '700',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
      minWidth: '50px',
    },
    submitButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  });

  const styles = getStyles();

  return (
    <div style={styles.chatContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          <span>🤖</span> AI Chatbot
        </h2>
        <button
          onClick={onClose}
          style={styles.closeButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Messages Container */}
      <div style={styles.messagesContainer}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <p>👋 Hi! Ask me anything about the uploaded documents.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.messageWrapper,
              ...(message.sender === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper),
            }}
          >
            <div
              style={{
                ...styles.messageBubble,
                ...(message.sender === 'user' ? styles.userMessage : styles.botMessage),
              }}
            >
              {message.sender === 'bot' ? (
                <div className="markdown-body" style={styles.messageText}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p style={styles.messageText}>{message.text}</p>
              )}
              <span style={styles.messageTime}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingBubble}>
              <span style={styles.loadingDot}></span>
              <span style={{...styles.loadingDot, animationDelay: '0.2s'}}></span>
              <span style={{...styles.loadingDot, animationDelay: '0.4s'}}></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          disabled={isLoading}
          style={{
            ...styles.input,
            ...(isLoading ? styles.inputDisabled : {}),
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#667eea';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = colors.border;
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            ...styles.submitButton,
            ...(isLoading || !input.trim() ? styles.submitButtonDisabled : {}),
          }}
          onMouseEnter={(e) => {
            if (!isLoading && input.trim()) {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          {isLoading ? '...' : '➤'}
        </button>
      </form>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .markdown-body p {
          margin: 0 0 8px 0;
        }
        .markdown-body p:last-child {
          margin-bottom: 0;
        }
        .markdown-body h1, .markdown-body h2, .markdown-body h3,
        .markdown-body h4, .markdown-body h5, .markdown-body h6 {
          margin: 12px 0 6px 0;
          font-weight: 600;
          line-height: 1.3;
        }
        .markdown-body h1 { font-size: 1.3em; }
        .markdown-body h2 { font-size: 1.2em; }
        .markdown-body h3 { font-size: 1.1em; }
        .markdown-body ul, .markdown-body ol {
          margin: 4px 0 8px 0;
          padding-left: 20px;
        }
        .markdown-body li {
          margin-bottom: 4px;
        }
        .markdown-body code {
          background: rgba(0, 0, 0, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: 'Fira Code', 'Consolas', monospace;
        }
        .markdown-body pre {
          background: rgba(0, 0, 0, 0.2);
          padding: 10px 12px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 8px 0;
        }
        .markdown-body pre code {
          background: none;
          padding: 0;
        }
        .markdown-body blockquote {
          border-left: 3px solid #667eea;
          margin: 8px 0;
          padding: 4px 12px;
          opacity: 0.9;
        }
        .markdown-body table {
          border-collapse: collapse;
          width: 100%;
          margin: 8px 0;
          font-size: 0.9em;
        }
        .markdown-body th, .markdown-body td {
          border: 1px solid rgba(128, 128, 128, 0.3);
          padding: 6px 10px;
          text-align: left;
        }
        .markdown-body th {
          font-weight: 600;
          background: rgba(0, 0, 0, 0.1);
        }
        .markdown-body strong {
          font-weight: 600;
        }
        .markdown-body a {
          color: #667eea;
          text-decoration: underline;
        }
        .markdown-body hr {
          border: none;
          border-top: 1px solid rgba(128, 128, 128, 0.3);
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
};

export default ChatComponent;