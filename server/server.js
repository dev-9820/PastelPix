require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const oauthRoutes = require("./routes/oauthRoutes");
const session = require("express-session");
const passport = require("./middleware/passport");
const searchRoutes = require("./routes/searchRoutes");
const app = express();

app.use(express.json());
app.use(cors());

// Database Connection
connectDB();

app.use(session({ secret: "secretkey", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/auth", oauthRoutes);
app.use("/api", searchRoutes );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));