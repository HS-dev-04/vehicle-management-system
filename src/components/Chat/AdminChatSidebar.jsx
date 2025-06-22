import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../../../Firebase";
import { FaComments, FaCar, FaUser, FaBell } from "react-icons/fa";

const AdminChatSidebar = ({ onSelectChat }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  
  useEffect(() => {
    const chatRoomsRef = collection(db, "chatRooms");
    const q = query(chatRoomsRef, orderBy("lastMessageTime", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rooms = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.carRole === "buyer") {
          rooms.push({ id: doc.id, ...data });
        }
      });
      setChatRooms(rooms);
    });

    return () => unsubscribe();
  }, []);

  const handleChatSelect = (chatRoom) => {
    setSelectedChatId(chatRoom.id);
    onSelectChat(chatRoom);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate();
      const now = new Date();
      const diff = now - date;

      if (diff < 60000) return "Just now";
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return "";
    }
  };

  const unreadCount = chatRooms.filter((room) => room.unreadByAdmin).length;

  return (
    <div className="h-full w-full flex flex-col bg-white shadow-sm">
      {/* Professional Header */}
      <div className="flex-shrink-0 p-3 sm:p-4 lg:p-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white flex justify-between items-center min-h-[60px] sm:min-h-[70px] lg:min-h-[75px]">
        <h4 className="text-sm sm:text-base lg:text-lg font-semibold m-0 flex items-center min-w-0 flex-1">
          <FaComments className="mr-2 sm:mr-3 text-sm sm:text-base lg:text-lg flex-shrink-0" />
          <span className="truncate">Customer Inquiries</span>
        </h4>
        {unreadCount > 0 && (
          <span className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center ml-2 sm:ml-3 flex-shrink-0 transition-colors duration-200 shadow-sm">
            <FaBell className="mr-1 text-xs" />
            <span className="hidden sm:inline lg:inline">{unreadCount} new</span>
            <span className="sm:hidden lg:hidden">{unreadCount}</span>
          </span>
        )}
      </div>

      {/* Chat List Container */}
      <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
        {chatRooms.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-10 text-center text-gray-500">
            <div>
              <FaComments className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 lg:mb-5 text-gray-400 mx-auto" />
              <p className="text-sm sm:text-base lg:text-lg mb-2 font-medium">No customer inquiries yet</p>
              <small className="text-xs sm:text-sm lg:text-base opacity-70 leading-relaxed max-w-xs mx-auto block">
                Customer messages about cars will appear here
              </small>
            </div>
          </div>
        ) : (
          <div className="min-h-full">
            {chatRooms.map((room) => (
              <div
                key={room.id}
                className={`p-3 sm:p-4 lg:p-5 border-b border-gray-200 cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:shadow-sm ${
                  selectedChatId === room.id
                    ? "bg-blue-50 border-l-4 border-l-blue-600 shadow-sm"
                    : "hover:border-l-2 hover:border-l-blue-300"
                } ${room.unreadByAdmin ? "bg-blue-25 font-medium shadow-sm" : ""}`}
                onClick={() => handleChatSelect(room)}
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="bg-blue-100 p-2 sm:p-2.5 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                      <FaCar className="text-blue-600 text-sm sm:text-base lg:text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h6 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-800 m-0 truncate leading-tight mb-1">
                        {room.carName}
                      </h6>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <FaUser className="mr-1 sm:mr-2 text-gray-400 text-xs flex-shrink-0" />
                        <span className="truncate">From: {room.buyerName}</span>
                      </div>
                    </div>
                  </div>
                  {room.unreadByAdmin && (
                    <div className="flex items-center ml-2 sm:ml-3 flex-shrink-0">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        New
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 sm:mt-3 ml-11 sm:ml-14 lg:ml-16">
                  <p className="text-xs sm:text-sm text-gray-600 m-0 line-clamp-2 leading-relaxed mb-1">
                    "{room.lastMessage}"
                  </p>
                  <small className="text-xs text-gray-400 block font-medium">
                    {formatTime(room.lastMessageTime)}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatSidebar;