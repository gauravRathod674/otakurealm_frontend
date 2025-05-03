"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faPaperPlane,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";

// ✅ Typing Animation Component
function AnimatedText({ text }) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    let typingInterval;
    const startDelay = setTimeout(() => {
      typingInterval = setInterval(() => {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
        if (i >= text.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 10);
    }, 100);

    setDisplayedText("");
    setIsTyping(true);

    return () => {
      clearTimeout(startDelay);
      clearInterval(typingInterval);
    };
  }, [text]);

  useEffect(() => {
    if (!isTyping) {
      setShowCursor(false);
      return;
    }

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [isTyping]);

  return (
    <span className="whitespace-pre-wrap break-words">
      {displayedText}
      {isTyping && showCursor && <span className="typing-cursor">|</span>}
      <style jsx>{`
        .typing-cursor {
          display: inline-block;
          width: 1ch;
          background-color: black;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}

// ✅ Chatbot Modal
export default function ChatbotModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [botTypingText, setBotTypingText] = useState("");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setBotTypingText("");
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botTypingText]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsBotThinking(true);
    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Don't push an empty bot response yet
    setBotTypingText("");

    try {
      const response = await fetch("http://localhost:8000/api/scrape/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) throw new Error("Failed to fetch chatbot response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let accumulatedText = "";
      let done = false;

      while (!done && reader) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value).replace("[END]", "");
          accumulatedText += chunk;
        }
      }

      let trimmedText = accumulatedText.trim();

      if (trimmedText.startsWith("The question is anime-related.")) {
        trimmedText = trimmedText.replace("The question is anime-related.", "").trim();
      }

      if (trimmedText.toLowerCase() === "false") {
        trimmedText = "Ask me questions related to anime and manga only!";
      }

      setIsBotThinking(false);
      setBotTypingText(trimmedText);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: trimmedText },
        ]);
        setBotTypingText("");
      }, trimmedText.length * 10 + 500);
    } catch (error) {
      console.error("Chatbot fetch error:", error);
      setIsBotThinking(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: " + error.message },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-[#191919] text-white w-[90%] max-w-2xl h-[80%] rounded-2xl flex flex-col shadow-lg border border-[#191919] relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#191919] rounded-t-2xl">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FontAwesomeIcon icon={faRobot} />
            OtakuRealm Chatbot
          </h2>
          <button
            className="text-white text-xl hover:text-[#bb5052] transition"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-black">
          {messages.map((msg, index) => {
            const cleanText = msg.text
              .replace(/\s+,/g, ",")
              .replace(/,\s+/g, ", ")
              .replace(/\s+\./g, ".")
              .replace(/\s+/g, " ")
              .trim();

            return (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg text-base font-medium break-words ${
                    msg.sender === "user"
                      ? "bg-[#bb5052] text-black"
                      : "bg-white text-black"
                  }`}
                >
                  <span className="flex flex-wrap items-center gap-10 break-words w-full">
                    {cleanText}
                  </span>
                </div>
              </div>
            );
          })}

          {/* ✅ Loading State */}
          {isBotThinking && (
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-md px-4 py-2 rounded-lg text-sm bg-white text-black animate-pulse">
                <span className="italic">Finding the best response for you...</span>
              </div>
            </div>
          )}

          {/* ✅ Animated Typing Message */}
          {botTypingText && !isBotThinking && (
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-md px-4 py-2 rounded-lg text-sm bg-white text-black">
                <AnimatedText text={botTypingText} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-[#191919] border-t border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <input
              type="text"
              className="flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-full outline-none placeholder:text-[#bbbbbb]"
              placeholder="Type your anime or manga related question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="bg-[#bb5052] text-black px-4 py-2 rounded-full hover:bg-[#a04345] transition"
              onClick={handleSend}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
