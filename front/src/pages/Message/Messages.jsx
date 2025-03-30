"use client";

import { useState } from "react";
import {
  ArrowRight,
  Edit,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  Smile,
} from "lucide-react";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const conversations = [
    {
      id: 1,
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thanks for the advice on my pitch deck!",
      time: "10:42 AM",
      unread: true,
    },
    {
      id: 2,
      name: "Marcus Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Looking forward to the networking event next week.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'd love to collaborate on the new project.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 4,
      name: "David Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Can you share those marketing resources we discussed?",
      time: "Monday",
      unread: false,
    },
    {
      id: 5,
      name: "Jessica Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage:
        "The workshop was really helpful. Thanks for recommending it!",
      time: "Sunday",
      unread: false,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Emily Chen",
      content:
        "Hi there! I wanted to ask for your feedback on my startup pitch deck. I'm presenting to investors next week.",
      time: "10:30 AM",
      isMe: false,
    },
    {
      id: 2,
      sender: "Me",
      content:
        "Hey Emily! I'd be happy to take a look. Send it over and I'll review it today.",
      time: "10:32 AM",
      isMe: true,
    },
    {
      id: 3,
      sender: "Emily Chen",
      content:
        "That would be amazing! I've attached the deck. I'm particularly concerned about the market analysis section.",
      time: "10:35 AM",
      isMe: false,
      attachment: "Startup_Pitch_Deck_v2.pdf",
    },
    {
      id: 4,
      sender: "Me",
      content:
        "Just reviewed it. Overall it looks great! For the market analysis, I'd suggest adding more specific data points about your target demographic and perhaps a competitive analysis chart.",
      time: "10:40 AM",
      isMe: true,
    },
    {
      id: 5,
      sender: "Emily Chen",
      content:
        "Thanks for the advice on my pitch deck! That makes a lot of sense. I'll update it and send you the revised version later today.",
      time: "10:42 AM",
      isMe: false,
    },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
        <a
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          href="/dashboard/messages/new"
        >
          <Edit className="h-4 w-4" />
          <span>New Message</span>
        </a>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversation List */}
        <div
          className={`${
            showMobileMenu ? "block" : "hidden"
          } md:block w-full md:w-1/3 bg-white border-r`}
        >
          {/* Search Bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "all"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "unread"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("unread")}
            >
              Unread
            </button>
          </div>

          {/* Conversation Items */}
          <div className="divide-y">
            {conversations
              .filter((conv) => activeTab === "all" || conv.unread)
              .map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer flex items-start gap-3 ${
                    selectedConversation === conversation.id
                      ? "bg-gray-100"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedConversation(conversation.id);
                    setShowMobileMenu(false);
                  }}
                >
                  <div className="flex-shrink-0">
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 truncate">
                        {conversation.name}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {conversation.time}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        conversation.unread
                          ? "font-medium text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Message Thread */}
        <div
          className={`${
            !selectedConversation && "hidden"
          } md:block flex-1 flex flex-col bg-white`}
        >
          {selectedConversation ? (
            <>
              {/* Message Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      conversations.find((c) => c.id === selectedConversation)
                        ?.avatar
                    }
                    alt={
                      conversations.find((c) => c.id === selectedConversation)
                        ?.name
                    }
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {
                        conversations.find((c) => c.id === selectedConversation)
                          ?.name
                      }
                    </h4>
                    <p className="text-xs text-gray-500">
                      Last active 5 minutes ago
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                  </button>
                  {/* Dropdown would go here */}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.isMe
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.attachment && (
                        <div className="mt-2 p-2 bg-white/20 rounded flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-xs">{message.attachment}</span>
                          <button className="ml-auto p-1 rounded hover:bg-white/10">
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      <div
                        className={`mt-1 text-xs ${
                          message.isMe ? "text-blue-100" : "text-gray-500"
                        } text-right`}
                      >
                        {message.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <textarea
                    placeholder="Type your message..."
                    className="flex-1 min-h-[40px] max-h-[150px] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <div className="flex flex-col gap-2">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Smile className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => {
                        // Send message logic
                        setMessageInput("");
                      }}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center flex-col p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-gray-400"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Your Messages
              </h3>
              <p className="text-gray-500 mb-4">
                Select a conversation or start a new one
              </p>
              <a
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                href="/dashboard/messages/new"
              >
                <Edit className="h-4 w-4" />
                <span>New Message</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
