// import User from "../Models/userModels.js";
import Message from "../Models/messageSchema.js";
import Conversation from "../Models/conversationModules.js";

export const sendMessage=async(req,res)=>{
    try {
        const {id:receiverId}=req.params;
        const senderId=req.user._id;
        // console.log(senderId);
        if (!req.user._id) {
            console.log("Error: req.user is undefined in sendMessage");
            return res.status(401).json({ success: false, message: "Unauthorized - User not found in request" });
        }
        const {message:messages}=req.body;
        
        let chats=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        });
        
        if(!chats){
            chats= await Conversation.create({
                participants:[senderId,receiverId],
                messages:[]
            })
        };

        const newMessage=new Message({
            senderId,
            receiverId,
            message:messages,
            conversationId:chats._id
        });

        if(newMessage){
            chats.messages.push(newMessage);
        }
        
        await Promise.all([chats.save(),newMessage.save()]);
        console.log(newMessage);
        //


        //Socket.io function to be written afterwards

        
        //
        return res.status(200).send(newMessage);
    }
    catch(error){
        res.status(500).send({
            success:false,
            message:error
        })
        console.log(`error in sendMessage ${error}`);
    }

}

export const getMessage=async(req,res)=>{
    try {
        const {id:receiverId}=req.params;
        const senderId=req.user._id;

        let chats=await Conversation.findOne({
            participants:{$all:[receiverId,senderId]}
        }).populate("messages");
        // console.log(chats.messages);
        if(!chats){
            return res.status(200).send([]);
        }
        const message=chats.messages;
        res.status(200).send(message);

    } catch (error) {
        res.status(500).send({
            success:false,
            message:error
        })
        console.log(`error in getMessage ${error}`);
    }
}