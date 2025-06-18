"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Edit,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  Smile,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { messageService } from "../../services/messageService";

// Utility to validate unreadCount
const fixUnreadCount = (unreadCount, participantIds) => {
  if (typeof unreadCount === "string") {
    try {
      unreadCount = JSON.parse(unreadCount);
    } catch (e) {
      return participantIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
    }
  }
  if (!unreadCount || typeof unreadCount !== "object") {
    return participantIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
  }
  return participantIds.reduce(
    (acc, id) => ({
      ...acc,
      [id]: Number.isInteger(unreadCount[id]) ? unreadCount[id] : 0,
    }),
    {}
  );
};

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const { user } = useAuth();

  const fetchConversations = async () => {
    try {
      const data = await messageService.getConversations();
      const parsedConversations = (data.conversations || []).map((conv) => ({
        ...conv,
        participants:
          typeof conv.participants === "string"
            ? JSON.parse(conv.participants)
            : conv.participants,
        lastMessage:
          typeof conv.lastMessage === "string"
            ? JSON.parse(conv.lastMessage)
            : conv.lastMessage,
        unreadCount: fixUnreadCount(conv.unreadCount, conv.participants),
      }));
      setConversations(parsedConversations);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      const data = await messageService.getMessages(selectedConversation, {
        markAsRead: true,
      });

      setMessages(data.messages || []);

      // Update conversation unread count
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation
            ? {
                ...conv,
                unreadCount: {
                  ...conv.unreadCount,
                  [user.id]: 0, // Explicitly set to 0
                },
              }
            : conv
        )
      );
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      await fetchConversations();
      setLoading(false);
    };
    loadConversations();

    // Poll for new conversations every 30 seconds
    const intervalId = setInterval(fetchConversations, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          setMessagesLoading(true);
          const data = await messageService.getMessages(selectedConversation, {
            markAsRead: true,
          });
          setMessages(data.messages || []);

          // Update the local conversations state to mark messages as read
          setConversations((prevConversations) =>
            prevConversations.map((conv) =>
              conv.id === selectedConversation
                ? {
                    ...conv,
                    unreadCount: {
                      ...conv.unreadCount,
                      [user.id]: 0, // Reset unread count for current user
                    },
                  }
                : conv
            )
          );
        } catch (error) {
          console.error("Failed to load messages:", error);
        } finally {
          setMessagesLoading(false);
        }
      };
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selectedConversation, user.id]);

  // Add to your useEffect for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const eventSource = new EventSource(
      `/api/messages/updates?conversationId=${selectedConversation}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.unreadCount !== undefined) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversation
              ? { ...conv, unreadCount: data.unreadCount }
              : conv
          )
        );
      }
    };

    return () => eventSource.close();
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;
    try {
      const message = await messageService.sendMessage(
        selectedConversation,
        messageInput
      );
      setMessages([...messages, message]);
      setMessageInput("");

      // Update conversation's lastMessage and unreadCount
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation
            ? {
                ...conv,
                lastMessage: {
                  senderId: user.id,
                  content: messageInput,
                  createdAt: message.createdAt,
                },
                unreadCount: {
                  ...conv.unreadCount,
                  [user.id]: 0,
                  [conv.participants.find((id) => id !== user.id)]:
                    (conv.unreadCount[
                      conv.participants.find((id) => id !== user.id)
                    ] || 0) + 1,
                },
              }
            : conv
        )
      );
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleConversationSelect = (conversationId) => {
    setSelectedConversation(conversationId);
    setShowMobileMenu(false);

    // Immediately update the unread count for better UX
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              unreadCount: {
                ...conv.unreadCount,
                [user.id]: 0,
              },
            }
          : conv
      )
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
        <a
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          href={
            user.role === "mentee"
              ? "/dashboard/messages/new"
              : "/mentor/messages/new"
          }
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
            {loading ? (
              <p className="p-4 text-gray-500">Loading...</p>
            ) : conversations.length === 0 ? (
              <p className="p-4 text-gray-500">
                No conversations found. Start a new one!
              </p>
            ) : (
              conversations
                .filter(
                  (conv) =>
                    activeTab === "all" || (conv.unreadCount[user.id] || 0) > 0
                )
                .map((conversation) => {
                  const otherUser = conversation.participants.find(
                    (id) => id !== user.id
                  );
                  const otherUserDetails =
                    conversation.participantDetails?.find(
                      (p) => p.id === otherUser
                    ) || {
                      firstName: "Unknown",
                      lastName: "",
                      profileImage: "/placeholder.svg?height=40&width=40",
                    };
                  const currentUserUnreadCount =
                    conversation.unreadCount[user.id] || 0;

                  return (
                    <div
                      key={conversation.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer flex items-start gap-3 ${
                        selectedConversation === conversation.id
                          ? "bg-gray-100"
                          : ""
                      }`}
                      onClick={() => handleConversationSelect(conversation.id)}
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={otherUserDetails.profileImage}
                          alt={otherUserDetails.firstName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 truncate">
                            {otherUserDetails.firstName}{" "}
                            {otherUserDetails.lastName}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessage?.createdAt
                              ? new Date(
                                  conversation.lastMessage.createdAt
                                ).toLocaleTimeString()
                              : ""}
                          </span>
                        </div>
                        <p
                          className={`text-sm truncate ${
                            currentUserUnreadCount > 0
                              ? "font-medium text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          {conversation.lastMessage?.content ||
                            "No messages yet"}
                        </p>
                      </div>
                      {currentUserUnreadCount > 0 && (
                        <div className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">
                          {currentUserUnreadCount}
                        </div>
                      )}
                    </div>
                  );
                })
            )}
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
                  {(() => {
                    const selectedConv = conversations.find(
                      (c) => c.id === selectedConversation
                    );
                    const otherUser = selectedConv?.participants.find(
                      (id) => id !== user.id
                    );
                    const otherUserDetails =
                      selectedConv?.participantDetails?.find(
                        (p) => p.id === otherUser
                      ) || {
                        firstName: "Unknown",
                        lastName: "",
                        profileImage: "/placeholder.svg?height=40&width=40",
                      };
                    return (
                      <>
                        <img
                          src={otherUserDetails.profileImage}
                          alt={otherUserDetails.firstName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {otherUserDetails.firstName}{" "}
                            {otherUserDetails.lastName}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Last active recently
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="relative">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <p className="p-4 text-gray-500">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="p-4 text-gray-500">
                    No messages in this conversation.
                  </p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === user.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.senderId === user.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={`mt-1 text-xs ${
                            message.senderId === user.id
                              ? "text-blue-100"
                              : "text-gray-500"
                          } text-right`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <textarea
                    placeholder="Type your message..."
                    className="flex-1 min-h-[40px] max-h-[150px] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={messagesLoading}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Smile className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                      onClick={handleSendMessage}
                      disabled={messagesLoading || !messageInput.trim()}
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
                href={
                  user.role === "mentee"
                    ? "/dashboard/messages/new"
                    : "/mentor/messages/new"
                }
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
