import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../Firebase";
import { FaTimes, FaPaperPlane, FaUser, FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ChatWindow = ({
  carId,
  carName,
  onClose,
  currentUserId,
  carRole,
  carOwnerId,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [recipient, setRecipient] = useState(null);
  const messagesEndRef = useRef(null);
  const getRecipient = () => {
    if (carRole === "buyer") {
      return {
        id: "admin",
        name: "Admin Support",
        role: "admin",
      };
    } else if (carRole === "renter" && carOwnerId) {
      return {
        id: carOwnerId,
        name: "Car Owner",
        role: "renter",
      };
    }
    return null;
  };
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUserId) {
        setUserLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", currentUserId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setCurrentUser({
            id: currentUserId,
            uid: currentUserId,
            ...userDoc.data(),
          });
        } else {

          toast.error("User data not found. Please try logging in again.");
        }
      } catch (error) {
        toast.error("Failed to load user data. Please try again.");
      } finally {
        setUserLoading(false);
      }

      const recipientInfo = getRecipient();
      setRecipient(recipientInfo);
    };

    fetchUserData();
  }, [currentUserId, carRole, carOwnerId]);

  useEffect(() => {
    if (!carId) return;
    const messagesRef = collection(db, "chats", carId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = [];
      snapshot.forEach((doc) => {
        messagesList.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesList);  
    });

    return () => unsubscribe();
  }, [carId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    setIsLoading(true);
    try {
      const messagesRef = collection(db, "chats", carId, "messages");
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: currentUser.uid || currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        senderEmail: currentUser.email,
        timestamp: serverTimestamp(),
        carId: carId,
        carName: carName,
        recipientId: recipient?.id || null,
        recipientRole: recipient?.role || null,
      });
      const chatRoomRef = doc(db, "chatRooms", carId);

      if (carRole === "buyer") {
        await setDoc(
          chatRoomRef,
          {
            carId: carId,
            carName: carName,
            buyerId: currentUser.uid || currentUser.id,
            buyerName: currentUser.name,
            buyerEmail: currentUser.email,
            buyerContact: currentUser.contact,
            recipientId: "admin",
            recipientRole: "admin",
            recipientName: "Admin Support",
            carRole: "buyer",
            lastMessage: newMessage,
            lastMessageTime: serverTimestamp(),
            unreadByAdmin: true,
            unreadByRenter: false,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
        
      } else if (carRole === "renter" && carOwnerId) {
        await setDoc(chatRoomRef, {
          carId: carId,
          carName: carName,
          buyerId: currentUser.uid || currentUser.id,
          buyerName: currentUser.name,
          buyerEmail: currentUser.email,
          buyerContact: currentUser.contact,
          recipientId: carOwnerId,
          recipientRole: "renter",
          recipientName: "Car Owner",
          carRole: "renter",
          lastMessage: newMessage,
          lastMessageTime: serverTimestamp(),
          unreadByAdmin: false,
          unreadByRenter: true,
          createdAt: serverTimestamp(),
        },{merge: true});
      }

      setNewMessage("");
    } catch (error) {
      alert("Failed to send message. Please try again.");
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

  if (userLoading) {
    return (
      <div
        className="fixed bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-gray-200 overflow-hidden
                     lg:w-96 lg:h-[500px] lg:right-4 lg:bottom-4
                     md:w-80 md:h-[450px] md:right-3 md:bottom-3
                     sm:w-[95%] sm:h-[70vh] sm:right-[2.5%] sm:bottom-2
                     max-sm:fixed max-sm:top-0 max-sm:left-0 max-sm:right-0 max-sm:bottom-0 max-sm:w-full max-sm:h-full max-sm:rounded-none max-sm:shadow-none max-sm:border-0 max-sm:z-[1050]"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div
        className="fixed bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-gray-200 overflow-hidden
                     lg:w-96 lg:h-[500px] lg:right-4 lg:bottom-4
                     md:w-80 md:h-[450px] md:right-3 md:bottom-3
                     sm:w-[95%] sm:h-[70vh] sm:right-[2.5%] sm:bottom-2
                     max-sm:fixed max-sm:top-0 max-sm:left-0 max-sm:right-0 max-sm:bottom-0 max-sm:w-full max-sm:h-full max-sm:rounded-none max-sm:shadow-none max-sm:border-0 max-sm:z-[1050]"
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 flex justify-between items-center">
          <h4 className="text-lg font-semibold m-0">Chat Error</h4>
          <button
            onClick={onClose}
            className="bg-transparent border-0 text-white text-lg cursor-pointer p-2 rounded-full hover:bg-white/20"
          >
            <FaTimes />
          </button>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-red-500">
            <p>Unable to load user data. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-gray-200 overflow-hidden
                   lg:w-96 lg:h-[500px] lg:right-4 lg:bottom-4
                   md:w-80 md:h-[450px] md:right-3 md:bottom-3
                   sm:w-[95%] sm:h-[70vh] sm:right-[2.5%] sm:bottom-2
                   max-sm:fixed max-sm:top-0 max-sm:left-0 max-sm:right-0 max-sm:bottom-0 max-sm:w-full max-sm:h-full max-sm:rounded-none max-sm:shadow-none max-sm:border-0 max-sm:z-[1050]"
    >
      <div
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-3 flex justify-between items-center
                     md:px-3 md:py-2 
                     sm:px-3 sm:py-2
                     max-sm:sticky max-sm:top-0 max-sm:z-10 max-sm:shadow-md max-sm:px-4 max-sm:py-3"
      >
        <div className="chat-title">
          <h4
            className="text-lg font-semibold m-0 
                        md:text-base 
                        sm:text-base 
                        max-sm:text-lg"
          >
            💬 Chat about: {carName}
          </h4>
        </div>
        <button
          onClick={onClose}
          className="bg-transparent border-0 text-white text-lg cursor-pointer p-2 rounded-full transition-colors duration-200 flex items-center justify-center
                   hover:bg-white/20 max-sm:p-3 max-sm:text-xl max-sm:min-w-[44px] max-sm:min-h-[44px]"
        >
          <FaTimes />
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 bg-gray-50
                     md:p-3
                     sm:p-3
                     max-sm:p-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {messages.length === 0 ? (
          <div
            className="text-center text-gray-500 mt-20
                         md:mt-16
                         sm:mt-12
                         max-sm:mt-10"
          >
            <p
              className="text-base mb-3 
                         md:text-sm
                         sm:text-sm
                         max-sm:text-lg"
            >
              👋 Start a conversation about this car!
            </p>{" "}
            <small
              className="text-xs opacity-70 
                            md:text-xs
                            sm:text-xs
                            max-sm:text-sm"
            >
              Your messages will be sent to the{" "}
              {carRole === "buyer" ? "admin" : "car owner"}
            </small>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 max-w-[80%] animate-[slideIn_0.3s_ease-in]
                         md:max-w-[85%] md:mb-3
                         sm:max-w-[85%] sm:mb-3
                         max-sm:max-w-[70%] max-sm:mb-4 ${
                           message.senderId ===
                           (currentUser.uid || currentUser.id)
                             ? "ml-auto"
                             : "mr-auto"
                         }`}
            >
              <div
                className="flex items-center gap-2 mb-2 text-xs
                            md:text-xs
                            sm:text-xs
                            max-sm:text-sm"
              >
                {message.senderRole === "buyer" ? (
                  <FaUser
                    className="w-4 h-4 text-blue-500 
                                   md:w-3 md:h-3
                                   sm:w-3 sm:h-3
                                   max-sm:w-5 max-sm:h-5"
                  />
                ) : (
                  <FaUserShield
                    className="w-4 h-4 text-green-500 
                                         md:w-3 md:h-3
                                         sm:w-3 sm:h-3
                                         max-sm:w-5 max-sm:h-5"
                  />
                )}
                <span className="font-semibold text-gray-700">
                  {message.senderName}
                </span>
                <span
                  className="text-gray-500 ml-auto text-xs
                               md:text-xs
                               sm:text-xs
                               max-sm:text-sm"
                >
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div
                className={`p-3 rounded-2xl shadow-sm break-words leading-relaxed
                             md:p-2 md:text-sm
                             sm:p-2 sm:text-sm
                             max-sm:p-4 max-sm:text-base max-sm:leading-normal ${
                               message.senderId ===
                               (currentUser.uid || currentUser.id)
                                 ? "bg-blue-500 text-white"
                                 : "bg-gray-200 text-gray-800"
                             }`}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        className="p-4 border-t border-gray-200 bg-white
                     md:p-3
                     sm:p-3
                     max-sm:p-4 max-sm:sticky max-sm:bottom-0 max-sm:shadow-[0_-2px_4px_rgba(0,0,0,0.1)]"
      >
        <div
          className="flex gap-3 items-center
                       md:gap-2
                       sm:gap-2
                       max-sm:gap-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask about this car as ${currentUser.name}...`}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-3xl outline-none transition-colors duration-200 text-sm
                      focus:border-blue-500 disabled:bg-gray-50 disabled:opacity-70
                      md:px-3 md:py-2 md:text-sm
                      sm:px-3 sm:py-2 sm:text-sm
                      max-sm:text-base max-sm:px-4 max-sm:py-3 max-sm:min-h-[48px]"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !newMessage.trim()}
            className="bg-blue-500 text-white border-0 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md
                      hover:bg-blue-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      lg:w-12 lg:h-12
                      md:w-10 md:h-10 md:text-sm
                      sm:w-10 sm:h-10 sm:text-sm
                      max-sm:w-12 max-sm:h-12 max-sm:min-w-[48px] max-sm:min-h-[48px] max-sm:text-base"
          >
            <FaPaperPlane />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
