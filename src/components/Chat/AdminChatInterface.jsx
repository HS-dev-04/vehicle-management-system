import { useState } from "react";
import AdminChatSidebar from "./AdminChatSidebar";
import AdminChatWindow from "./AdminChatWindow";

const AdminChatInterface = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectChat = (chatRoom) => {
    setSelectedChat(chatRoom);
  };
  return (
    <div className="h-full w-full">
      <div
        className="flex h-[75vh] border border-gray-200 rounded-xl overflow-hidden shadow-lg
                     max-lg:flex-col max-lg:h-[calc(100vh-180px)]
                     max-sm:h-[calc(100vh-150px)] max-sm:rounded-lg"
      >
        <div
          className="w-[35%] min-w-[280px] bg-gray-50 border-r-2 border-gray-200
                       max-lg:w-[40%] max-lg:min-w-[250px]
                       max-md:w-full max-md:h-[45%] max-md:min-w-auto max-md:border-r-0 max-md:border-b-2
                       max-sm:h-[40%]"
        >
          <AdminChatSidebar onSelectChat={handleSelectChat} />
        </div>
        <div
          className="flex-1 bg-white
                       max-md:h-[55%]
                       max-sm:h-[60%]"
        >
          <AdminChatWindow selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  );
};

export default AdminChatInterface;
