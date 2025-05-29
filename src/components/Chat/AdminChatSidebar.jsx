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
      console.log("Admin: Found", rooms.length, "sale inquiry chat rooms");
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
    <div className="h-full flex flex-col">
      <div
        className="p-4 border-b-2 border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white flex justify-between items-center
                     lg:p-4
                     md:p-3 md:flex-col md:items-start md:gap-2
                     sm:p-3 sm:flex-row sm:items-center
                     max-sm:p-2 max-sm:flex-col max-sm:gap-2 max-sm:items-start"
      >
        <h4
          className="text-lg font-semibold m-0 flex items-center
                      lg:text-lg
                      md:text-base md:w-full
                      sm:text-base sm:flex-1
                      max-sm:text-sm max-sm:w-full"
        >
          <FaComments
            className="mr-2 
                                lg:text-base
                                md:text-sm
                                sm:text-sm
                                max-sm:text-xs"
          />
          <span className="lg:inline md:inline sm:inline max-sm:text-sm">
            Car Inquiries
          </span>
        </h4>
        {unreadCount > 0 && (
          <span
            className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center
                          lg:px-2 lg:py-1 lg:text-xs
                          md:px-2 md:py-1 md:text-xs md:w-auto
                          sm:px-2 sm:py-1 sm:text-xs
                          max-sm:px-2 max-sm:py-1 max-sm:text-xs max-sm:w-auto"
          >
            <FaBell
              className="mr-1 
                              lg:text-xs
                              md:text-xs
                              sm:text-xs
                              max-sm:text-xs"
            />
            <span className="whitespace-nowrap">{unreadCount} new</span>
          </span>
        )}
      </div>

      <div
        className="flex-1 overflow-y-auto bg-gray-50
                     lg:overflow-y-auto
                     md:overflow-y-auto md:max-h-none
                     sm:overflow-y-auto sm:max-h-none
                     max-sm:overflow-y-auto max-sm:flex-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {chatRooms.length === 0 ? (
          <div
            className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full
                         lg:p-8
                         md:p-6 md:min-h-[200px]
                         sm:p-4 sm:min-h-[150px]
                         max-sm:p-4 max-sm:min-h-[120px]"
          >
            <FaComments
              className="text-4xl mb-4 text-gray-400 
                                  lg:text-4xl lg:mb-4
                                  md:text-3xl md:mb-3
                                  sm:text-2xl sm:mb-2
                                  max-sm:text-xl max-sm:mb-2"
            />
            <p
              className="text-base mb-2 
                         lg:text-base lg:mb-2
                         md:text-sm md:mb-2
                         sm:text-sm sm:mb-1
                         max-sm:text-xs max-sm:mb-1"
            >
              No customer inquiries yet
            </p>
            <small
              className="text-sm opacity-70 
                            lg:text-sm
                            md:text-xs
                            sm:text-xs
                            max-sm:text-xs"
            >
              Customer messages will appear here
            </small>
          </div>
        ) : (
          chatRooms.map((room) => (
            <div
              key={room.id}
              className={`p-4 border-b border-gray-200 cursor-pointer transition-all duration-200 relative
                         hover:bg-gray-100
                         lg:p-4
                         md:p-3 md:min-h-[80px]
                         sm:p-3 sm:min-h-[75px]
                         max-sm:p-2 max-sm:min-h-[70px] max-sm:active:bg-gray-100
                         ${
                           selectedChatId === room.id
                             ? "bg-blue-50 border-l-4 border-l-blue-500"
                             : ""
                         } 
                         ${room.unreadByAdmin ? "bg-blue-25 font-medium" : ""}`}
              onClick={() => handleChatSelect(room)}
            >
              <div
                className="flex items-start justify-between mb-2
                            lg:mb-2
                            md:mb-2
                            sm:mb-1
                            max-sm:mb-1"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <FaCar
                    className="text-blue-500 mr-2 flex-shrink-0
                                  lg:text-base lg:mr-2
                                  md:text-sm md:mr-2
                                  sm:text-sm sm:mr-2
                                  max-sm:text-xs max-sm:mr-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h6
                      className="text-sm font-semibold text-gray-800 m-0 truncate
                                  lg:text-sm
                                  md:text-sm
                                  sm:text-xs
                                  max-sm:text-xs max-sm:font-medium"
                    >
                      {room.carName}
                    </h6>
                    <div
                      className="flex items-center mt-1 text-xs text-gray-600
                                   lg:mt-1 lg:text-xs
                                   md:mt-1 md:text-xs
                                   sm:mt-1 sm:text-xs
                                   max-sm:mt-0.5 max-sm:text-xs"
                    >
                      <FaUser className="mr-1 text-gray-400 flex-shrink-0 lg:mr-1 md:mr-1 sm:mr-1   max-sm:mr-0.5 max-sm:text-xs" />
                      <span className="truncate">{room.buyerName}</span>
                    </div>
                  </div>
                </div>
                {room.unreadByAdmin && (
                  <span className="text-blue-500 text-lg leading-none ml-2 flex-shrink-0 lg:text-lg lg:ml-2  md:text-base md:ml-2 sm:text-sm sm:ml-1 max-sm:text-sm max-sm:ml-1">
                    ●
                  </span>
                )}
              </div>
              <div className="mt-2 lg:mt-2 md:mt-2 sm:mt-1 max-sm:mt-1">
                <p className="text-xs text-gray-600 m-0 line-clamp-2 lg:text-xs md:text-xs sm:text-xs max-sm:text-xs max-sm:line-clamp-1">
                  "{room.lastMessage}"
                </p>
                <small className="text-xs text-gray-400 mt-1 block lg:text-xs lg:mt-1 md:text-xs md:mt-1 sm:text-xs sm:mt-0.5 max-sm:text-xs max-sm:mt-0.5">
                  {formatTime(room.lastMessageTime)}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminChatSidebar;
