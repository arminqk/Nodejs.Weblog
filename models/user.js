import mongoose from "mongoose";
const monoose  = mongoose.connection;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    }

})

const User= module.exports  = mongoose.model('User', UserSchema) ;

