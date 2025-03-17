// const mongoose = require("mongoose");

// const connection = { isConnected: null };

// const connectedToDB = async () => {
//   try {
//     if (connection.isConnected) {
//       return;
//     }
//     const db = await mongoose.connect(process.env.MONGO_URI);
//     connection.isConnected = db.connections[0].readyState;
//   } catch (error) {
//     console.log(`Couldnt connected with database ${error}`);
//   }
// };

// module.exports = connectedToDB;

const mongoose = require("mongoose");

const connectedToDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Already connected to MongoDB");
      return;
    }

    const db = await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,  //The MongoDB Node.js driver v4+ no longer requires the useNewUrlParser option.
      // useUnifiedTopology: true, //The useUnifiedTopology option was required in older versions of MongoDB drivers, but it’s now ignored in v4+.
    });

    console.log(`✅ MongoDB Connected: ${db.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectedToDB;
