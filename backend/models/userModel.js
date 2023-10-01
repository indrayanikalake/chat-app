const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name:{type:String, required:true },
    email:{type:String, required:true, unique:true },
    password:{type:String, required:true },
    pic:{type:String,  default: "https://www.freepik.com/free-photo/blue-user-icon-symbol-website-admin-social-login-element-concept-white-background-3d-rendering_23524384.htm#query=default%20user&position=16&from_view=keyword&track=ais" }
    
},{
    timestamps:true
})

userSchema.methods.matchPassword = async function (enteredPassword){
   return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save', async function(next){
   
    if(!this.isModified) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

})

const User = mongoose.model("User", userSchema);

module.exports = User;