const mongoose= require('mongoose');

const userSchema = mongoose.Schema({
    name:{type:String, required:true },
    email:{type:String, required:true },
    password:{type:String, required:true },
    pic:{type:String, required:true, default: "https://www.freepik.com/free-photo/blue-user-icon-symbol-website-admin-social-login-element-concept-white-background-3d-rendering_23524384.htm#query=default%20user&position=16&from_view=keyword&track=ais" }
},{
    timestamps:true
})

const User = mongoose.model("User", userSchema);

module.exports = User;