import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../../Firebase";
import {
  FaPaperPlane,
  FaUser,
  FaUserShield,
  FaArrowLeft,
} from "react-icons/fa";

const RenterChatWindow = ({ selectedChat, onBackToSidebar }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const renterName = "Car Owner";
  const currentUser = auth.currentUser;

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
        unreadByRenter: false,
      });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !currentUser) return;

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
        senderId: currentUser.uid,
        senderName: renterName,
        senderRole: "renter",
        timestamp: serverTimestamp(),
        carId: selectedChat.carId,
        carName: selectedChat.carName,
      });

      const chatRoomRef = doc(db, "chatRooms", selectedChat.carId);
      await updateDoc(chatRoomRef, {
        lastMessage: newMessage,
        lastMessageTime: serverTimestamp(),
        unreadByRenter: false,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending renter message:", error);
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
      <div className="h-full flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl text-gray-300 mb-4">🚗</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Select a rental inquiry to start chatting
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Choose a conversation from the sidebar to view and respond to
            customer messages about your rental cars.
          </p>

          <button
            onClick={onBackToSidebar}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 mx-auto md:hidden"
          >
            <FaArrowLeft />
            <span>Back to Conversations</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
        <button
          onClick={onBackToSidebar}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 md:hidden"
        >
          <FaArrowLeft />
        </button>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 m-0">
            {selectedChat.carName}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <FaUser className="mr-1 text-xs" />
            <span>Chatting with {selectedChat.buyerName}</span>
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-base mb-3">
              No messages yet in this conversation
            </p>
            <small className="text-sm opacity-70">
              Start the conversation by sending a message below
            </small>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 max-w-[80%] ${
                message.senderId === currentUser?.uid ? "ml-auto" : "mr-auto"
              }`}
            >
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                {message.senderRole === "renter" ? (
                  <FaUserShield className="w-4 h-4 text-orange-500" />
                ) : (
                  <FaUser className="w-4 h-4 text-blue-500" />
                )}
                <span className="font-semibold">{message.senderName}</span>
                <span className="text-gray-400 ml-auto">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div
                className={`p-3 rounded-2xl shadow-sm break-words ${
                  message.senderId === currentUser?.uid
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your response..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none transition-colors duration-200 focus:border-orange-500 disabled:bg-gray-50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !newMessage.trim()}
            className="bg-orange-500 text-white border-0 rounded-lg px-4 py-2 flex items-center gap-2 cursor-pointer transition-all duration-200 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenterChatWindow;
