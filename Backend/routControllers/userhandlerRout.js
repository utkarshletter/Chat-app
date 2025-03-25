import User from "../Models/userModels.js";
import Conversation from "../Models/conversationModules.js";


export const getUserBySearch=async(req,res)=>{
    try {
        const search=req.query.search || '';//search hi naam hona chahiye frontend se jo aaye
        const currentUserID=req.user._id;
        const user=await User.find({         //ya toh username ya fullname
            $and:[
                {
                $or:[
                    {username:{$regex:'.*'+search+'.*',$options:'i'}},//opttions here helps neglect
                    {fullname:{$regex:'.*'+search+'.*',$options:'i'}},//capitalised wording
                ]
                },{
                    _id:{$ne:currentUserID}
                }
            ]
        }).select("-password").select("email");

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error
        })
        console.log(`error in getUserBySearch ${error}`);
    }
};


export const getcurrentchatters=async(req,res)=>{
    try {
        const currentUserID=req.user._id;
        const currentchatters=await Conversation.find({
            participants:currentUserID
        }).sort({
            updatedAt:-1
            }
            );

        if(currentchatters.length===0) return res.status(200).send([]);

        const participantsIDS=currentchatters.reduce((ids,conversation)=>{
            const otherparticipants=conversation.participants.filter(id => id !== currentUserID);
            return [ ...ids, ...otherparticipants]
        },[]);

        const otherparticipantsIDS=participantsIDS.filter(id => id.toString() !== currentUserID.toString());
        const user = await User.find({_id:{$in:otherparticipantsIDS}}).select("-password").select("-email");
        const users=otherparticipantsIDS.map(id=> user.find(user => user._id.toString() === id.toString()));
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error
        })
        console.log(`error in getcurrentchatters ${error}`);
    }
};