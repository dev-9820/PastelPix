const express = require("express");
const passport = require("../middleware/passport");
const router = express.Router();

// for redirect 
const successRedirect = (req, res) => {
  const { token } = req.user;
  res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
};

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), successRedirect);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/" }), successRedirect);

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }), successRedirect);

module.exports = router;
