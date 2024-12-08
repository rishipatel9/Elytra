import axios from "axios";

interface storeChatProps {
    sessionId: string;
    message: string;
    sender:string
}
export const storeChats = async({sessionId,message,sender}:storeChatProps) => {
    try{
        const response=await axios.get(`/api/chat?sessionId=${sessionId}&chatmsg=${message}&sender=${sender}`)
        if(response.status===200){
            console.log("Stored chat successfully")
            return response.data
        }

    }catch(error){  
        console.error("Error storing chat:", error);
        return null
    }
}

export const summarizeChat =async (sessionId:string)=>{
    try{
        const response=await axios.post(`/api/summarize`,{sessionId})
        if(response.status===201){
            console.log("Summarized chat successfully")
            return response.data
        }
    }catch(error){
        console.error("Error summarizing chat:", error);
        return null
    }
}