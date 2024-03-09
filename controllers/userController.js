const User = require("../models/User");

module.exports={
    deleteUser:async(req,res)=>{
        try {
            const user=await User.findByIdAndDelete(req.params.id);

            if (!user) {
                // User not found, send appropriate response
                return res.status(404).json("No such user exists to delete!");
              }
            res.status(200).json("Successfully Deleted")
            
        } catch (error) {
            res.status(500).json("Failed to delete the User");
            console.log(error);
            
        }
    },
    getUser:async (req,res) =>{
        try {
            const user=await User.findById(req.params.id);

            if(!user){
                return res.status(401).json("Oops..!!!!User Doesn't Exist.....")
            }

            const {password,__v,createdAt,updatedAt,...userData}=user._doc;

            res.status(200).json(userData);

            
        } catch (error) {
            res.status(500).json("Failed to fetch the User");
            console.log(error);
            
        }
    }
}