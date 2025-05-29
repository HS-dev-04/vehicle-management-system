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
import { FaPaperPlane, FaUser, FaUserShield, FaCar } from "react-icons/fa";

const AdminChatWindow = ({ selectedChat }) => {
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
      <div
        className="h-full flex flex-col items-center justify-center text-gray-500 p-8 bg-gray-50
                     max-sm:p-6"
      >
        <FaCar className="text-6xl mb-4 text-gray-300 max-sm:text-5xl" />
        <h4 className="text-xl font-semibold mb-2 text-gray-600 max-sm:text-lg">
          Select a car inquiry to start chatting
        </h4>
        <p className="text-center text-gray-500 max-w-sm max-sm:text-sm">
          Choose a conversation from the sidebar to view and respond to customer
          messages.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div
        className="p-4 border-b-2 border-gray-200 bg-white shadow-sm
                     max-sm:p-3"
      >
        <div className="chat-info">
          <h4 className="text-lg font-semibold text-gray-800 m-0 mb-1 max-sm:text-base">
            🚗 {selectedChat.carName}
          </h4>
          <p className="text-sm text-gray-600 m-0 max-sm:text-xs">
            💬 Chatting with:{" "}
            <strong className="text-blue-600">{selectedChat.buyerName}</strong>
          </p>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 bg-gray-50 max-sm:p-3"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 max-sm:mt-6">
            <p className="text-base mb-2 max-sm:text-sm">
              No messages yet for this car
            </p>
            <small className="text-sm opacity-70 max-sm:text-xs">
              Customer messages will appear here
            </small>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 max-w-[85%] animate-[slideIn_0.3s_ease-in] max-sm:mb-3 max-sm:max-w-[90%] ${
                message.senderRole === "admin" ? "ml-auto" : "mr-auto"
              }`}
            >
              <div className="flex items-center gap-2 mb-2 text-xs max-sm:text-sm">
                {message.senderRole === "admin" ? (
                  <FaUserShield className="w-4 h-4 text-green-500 max-sm:w-5 max-sm:h-5" />
                ) : (
                  <FaUser className="w-4 h-4 text-blue-500 max-sm:w-5 max-sm:h-5" />
                )}
                <span className="font-semibold text-gray-700">
                  {message.senderName}
                </span>
                <span className="text-gray-500 ml-auto">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div
                className={`p-3 rounded-2xl shadow-sm break-words leading-relaxed max-sm:p-4 max-sm:text-base ${
                  message.senderRole === "admin"
                    ? "bg-green-500 text-white ml-4"
                    : "bg-white text-gray-800 mr-4 border border-gray-200"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white max-sm:p-3">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Reply to ${selectedChat.buyerName}...`}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-3xl outline-none transition-colors duration-200 text-sm
                      focus:border-green-500 disabled:bg-gray-50 disabled:opacity-70
                      max-sm:text-base max-sm:px-4 max-sm:py-3 max-sm:min-h-[48px]"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !newMessage.trim()}
            className="bg-green-500 text-white border-0 rounded-full w-11 h-11 flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md
                      hover:bg-green-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      max-sm:w-12 max-sm:h-12 max-sm:min-w-[48px] max-sm:min-h-[48px]"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChatWindow;
