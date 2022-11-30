import mongoose from "mongoose";

export default class MongoDatabase {
    private dbUrl = process.env.DB_URL || "mongodb://localhost:27017/web-exam";

    connect = () => {
        // Connect MongoDB at default port 27017.
        mongoose.connect(this.dbUrl)
            .then(() => {
                console.log("Database was connected successfully");
            })
            .catch((err) => {
                console.log("Error in DB connection: " + err);
            });
    };

    disconnect = () => {
        mongoose.disconnect();
    };
}
