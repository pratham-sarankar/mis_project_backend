import mongoose from "../config/database.js";

export default mongoose.model("User",{
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
})