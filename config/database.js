import mongoose from "mongoose";

console.log('Connecting to the database...');
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(r => {
    console.log('Successfully connected to the database :)');
});

export default mongoose;