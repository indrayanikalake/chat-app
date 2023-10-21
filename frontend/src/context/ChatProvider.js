import axios from "axios";
import { useHistory } from "react-router-dom";

const { createContext, useContext, useState, useEffect } = require("react");


const ChatContext = createContext();

const ChatProvider = ({children}) =>{
   const history = useHistory();
   
    const [ user, setUser ] = useState({});
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [group, setGroup] =useState(false);
    const [auth, setAuth] = useState(false);
    const [groupMembers, setGroupMembers] =useState();
   

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log(userInfo);
        setUser(userInfo);

        if(!userInfo){
            history?.push('/')
        }
  
    },[auth]);

   

   

   return (
    <ChatContext.Provider value={{groupMembers, setGroupMembers,auth, setAuth, group, setGroup, user,setUser,selectedChat, setSelectedChat,chats,setChats,
    }}>
        {children}
    </ChatContext.Provider>
   )
}



export const ChatState = () =>{
    return useContext(ChatContext);
}

export default ChatProvider;