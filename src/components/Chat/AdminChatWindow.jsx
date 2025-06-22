import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../Firebase";
import { FaPaperPlane, FaUser, FaUserShield, FaCar, FaArrowLeft } from "react-icons/fa";

const AdminChatWindow = ({ selectedChat, onBackToSidebar }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const adminName = "Admin Support";
  const adminId = "admin";

  useEffect(() => {
    if (!selectedChat) return;

    const messagesRef = collection(db, "chats", selectedChat.carId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = [];
      snapshot.forEach((doc) => {
        messagesList.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesList);
      markAsRead();
    });

    return () => unsubscribe();
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const markAsRead = async () => {
    if (!selectedChat) return;
    try {
      const chatRoomRef = doc(db, "chatRooms", selectedChat.carId);
      await updateDoc(chatRoomRef, {
        unreadByAdmin: false,
      });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    setIsLoading(true);
    try {
      const messagesRef = collection(
        db,
        "chats",
        selectedChat.carId,
        "messages"
      );
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: adminId,
        senderName: adminName,
        senderRole: "admin",
        timestamp: serverTimestamp(),
        carId: selectedChat.carId,
        carName: selectedChat.carName,
      });

      const chatRoomRef = doc(db, "chatRooms", selectedChat.carId);
      await updateDoc(chatRoomRef, {
        lastMessage: newMessage,
        lastMessageTime: serverTimestamp(),
        unreadByAdmin: false,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending admin message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      return timestamp.toDate().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  if (!selectedChat) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="text-center max-w-md mx-auto">
          {/* Professional Car Icon */}
          <div className="bg-blue-100 p-6 sm:p-8 rounded-full inline-flex mb-6 sm:mb-8">
            <FaCar className="text-3xl sm:text-4xl lg:text-5xl text-blue-600" />
          </div>
          
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
            Select a customer inquiry to start chatting
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 sm:mb-8">
            Choose a conversation from the sidebar to view and respond to
            customer messages about cars.
          </p>

          {/* Mobile Back Button */}
          <button
            onClick={onBackToSidebar}
            className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm md:hidden"
          >
            <FaArrowLeft className="text-sm" />
            <span className="text-sm sm:text-base">Back to Conversations</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white shadow-sm">
      {/* Professional Header */}
      <div className="flex-shrink-0 p-3 sm:p-4 lg:p-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white flex items-center gap-3 sm:gap-4 min-h-[60px] sm:min-h-[70px] lg:min-h-[75px]">
        {/* Mobile Back Button */}
        <button
          onClick={onBackToSidebar}
          className="p-2 text-white hover:bg-blue-700 rounded-full transition-colors duration-200 flex-shrink-0 md:hidden"
        >
          <FaArrowLeft className="text-sm sm:text-base" />
        </button>

        {/* Chat Info */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="bg-blue-500 p-2 sm:p-2.5 rounded-full flex-shrink-0">
            <FaCar className="text-white text-sm sm:text-base lg:text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold m-0 truncate">
              {selectedChat.carName}
            </h3>
            <div className="flex items-center text-xs sm:text-sm text-blue-100 mt-0.5 sm:mt-1">
              <FaUser className="mr-1 sm:mr-2 text-xs flex-shrink-0" />
              <span className="truncate">Chatting with {selectedChat.buyerName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-0"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="bg-gray-200 p-4 sm:p-6 rounded-full inline-flex mb-4 sm:mb-6">
                <FaUser className="text-2xl sm:text-3xl text-gray-400" />
              </div>
              <p className="text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 font-medium">
                No messages yet in this conversation
              </p>
              <small className="text-xs sm:text-sm text-gray-400 block max-w-xs mx-auto leading-relaxed">
                Customer messages will appear here
              </small>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] ${
                  message.senderRole === "admin"
                    ? "ml-auto items-end" 
                    : "mr-auto items-start"
                }`}
              >
                {/* Message Header */}
                <div className={`flex items-center gap-2 mb-2 text-xs sm:text-sm text-gray-600 ${
                  message.senderRole === "admin" ? "flex-row-reverse" : ""
                }`}>
                  {message.senderRole === "admin" ? (
                    <FaUserShield className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <FaUser className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                  )}
                  <span className="font-medium text-xs sm:text-sm">
                    {message.senderName}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {formatTime(message.timestamp)}
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3 sm:p-4 rounded-2xl shadow-sm break-words text-sm sm:text-base leading-relaxed ${
                    message.senderRole === "admin"
                      ? "bg-green-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 p-3 sm:p-4 lg:p-5 border-t border-gray-200 bg-white">
        <div className="flex gap-2 sm:gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Reply to ${selectedChat.buyerName}...`}
              disabled={isLoading}
              rows="1"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl resize-none outline-none transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50 text-sm sm:text-base min-h-[40px] sm:min-h-[44px]"
              style={{ 
                maxHeight: "120px",
                overflowY: "auto"
              }}
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={isLoading || !newMessage.trim()}
            className="bg-green-600 hover:bg-green-700 text-white border-0 rounded-xl px-3 sm:px-4 lg:px-5 py-2 sm:py-3 flex items-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex-shrink-0 min-h-[40px] sm:min-h-[44px]"
          >
            <FaPaperPlane className="text-sm" />
            <span className="hidden sm:inline text-sm sm:text-base">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChatWindow;