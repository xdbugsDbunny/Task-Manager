import mongoose from "mongoose";

const databaseConnection = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`
    );
    console.log(
      `\nDATABASE CONNECTED !! DB HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MONGODB CONNECTION ERROR : ", error);
    process.exit(1);
  }
};

export default databaseConnection;
