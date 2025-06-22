import { useState } from "react";
import RenterChatSidebar from "./RenterChatSidebar";
import RenterChatWindow from "./RenterChatWindow";

const RenterChatInterface = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const handleSelectChat = (chatRoom) => {
    setSelectedChat(chatRoom);
    if (window.innerWidth < 1024) {
      setShowSidebar(false);
    }
  };

  const handleBackToSidebar = () => {
    setShowSidebar(true);
    if (window.innerWidth < 1024) {
      setSelectedChat(null);
    }
  };

  return (
    <div className="h-screen w-full p-2 sm:p-4">
      <div
        className="flex h-[calc(100vh-16px)] sm:h-[calc(100vh-32px)] 
                   border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden shadow-lg
                   bg-white"
      >
        {/* Sidebar - Responsive */}
        <div
          className={`
            w-full sm:w-[380px] md:w-[400px] lg:w-[35%] lg:min-w-[320px] xl:min-w-[380px]
            bg-gray-50 border-r-0 sm:border-r-2 border-gray-200 h-full
            ${showSidebar ? "block" : "hidden"}
            ${selectedChat && !showSidebar ? "hidden" : ""}
          `}
        >
          <RenterChatSidebar onSelectChat={handleSelectChat} />
        </div>
        
        {/* Chat Window - Responsive */}
        <div
          className={`
            flex-1 bg-white min-w-0 h-full
            ${!showSidebar || selectedChat ? "block" : "hidden sm:block"}
            ${showSidebar && !selectedChat ? "hidden sm:block" : ""}
          `}
        >
          <RenterChatWindow
            selectedChat={selectedChat}
            onBackToSidebar={handleBackToSidebar}
            userType="renter"
          />
        </div>
      </div>
    </div>
  );
};

export default RenterChatInterface;