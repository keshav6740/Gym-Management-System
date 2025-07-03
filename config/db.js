const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // The options `useNewUrlParser` and `useUnifiedTopology` are deprecated
        // and can be removed.
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;