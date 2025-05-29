import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../Firebase";
import { FaComments, FaCar, FaUser, FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RenterChatSidebar = ({ onSelectChat }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0);
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const chatRoomsRef = collection(db, "chatRooms");

    const q = query(chatRoomsRef, orderBy("lastMessageTime", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rooms = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log("RenterChatSidebar - Processing chat room:", {
          docId: doc.id,
          carRole: data.carRole,
          recipientId: data.recipientId,
          currentUserId: user.uid,
          carName: data.carName,
          buyerName: data.buyerName,
        });

        if (data.carRole === "renter" && data.recipientId === user.uid) {
          console.log("RenterChatSidebar - Adding room to list:", data.carName);
          rooms.push({ id: doc.id, ...data });
        } else {
          console.log("RenterChatSidebar - Filtering out room:", {
            reason:
              data.carRole !== "renter"
                ? "carRole mismatch"
                : "recipientId mismatch",
            carRole: data.carRole,
            recipientId: data.recipientId,
            expectedRecipientId: user.uid,
          });
        }
      });

      const currentUnreadCount = rooms.filter(
        (room) => room.unreadByRenter
      ).length;

      if (chatRooms.length > 0 && currentUnreadCount > previousUnreadCount) {
        const newMessages = currentUnreadCount - previousUnreadCount;
        toast.info(
          `🚗 ${newMessages} new rental inquiry message${
            newMessages > 1 ? "s" : ""
          }!`,
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }

      setChatRooms(rooms);
      setPreviousUnreadCount(currentUnreadCount);
      console.log("Renter: Found", rooms.length, "rental inquiry chat rooms");
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

  const unreadCount = chatRooms.filter((room) => room.unreadByRenter).length;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b-2 border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex justify-content-between align-items-center">
        <h4 className="text-lg font-semibold m-0 flex items-center">
          <FaComments className="mr-2" />
          <span>Car Rental Inquiries</span>
        </h4>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <FaBell className="mr-1" />
            <span>{unreadCount} new</span>
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50">
        {chatRooms.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaComments className="text-4xl mb-4 text-gray-400" />
            <p className="text-base mb-2">No rental inquiries yet</p>
            <small className="text-sm opacity-70">
              Customer inquiries about your rental cars will appear here
            </small>
          </div>
        ) : (
          chatRooms.map((room) => (
            <div
              key={room.id}
              className={`p-4 border-b border-gray-200 cursor-pointer transition-all duration-200 hover:bg-gray-100 ${
                selectedChatId === room.id
                  ? "bg-orange-50 border-l-4 border-l-orange-500"
                  : ""
              } ${room.unreadByRenter ? "bg-orange-25 font-medium" : ""}`}
              onClick={() => handleChatSelect(room)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center flex-1 min-w-0">
                  <FaCar className="text-orange-500 mr-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h6 className="text-sm font-semibold text-gray-800 m-0 truncate">
                      {room.carName}
                    </h6>
                    <div className="flex items-center mt-1 text-xs text-gray-600">
                      <FaUser className="mr-1 text-gray-400" />
                      <span className="truncate">From: {room.buyerName}</span>
                    </div>
                  </div>
                </div>
                {room.unreadByRenter && (
                  <span className="text-orange-500 text-lg leading-none ml-2">
                    ●
                  </span>
                )}
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-600 m-0 line-clamp-2">
                  "{room.lastMessage}"
                </p>
                <small className="text-xs text-gray-400 mt-1 block">
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

export default RenterChatSidebar;
