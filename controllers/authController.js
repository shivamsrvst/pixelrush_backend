const User = require("../models/User");
const CryptoJS = require("crypto-js");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pixelrushinfo@gmail.com',
    pass: 'mmoh uxip rnts lnxa'
  }
});

module.exports = {
  createUser: async (req, res) => {
    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(409).json("User with this email already exists");
      }
  
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        location: req.body.location,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.SECRET.toString()
        ),
      });
  
      await newUser.save();
      res.status(201).json("User created Successfully");
    } catch (error) {
      res.status(500).json("Failed to create the User");
      console.log(error);
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if(!user){
        return res.status(401).json("Wrong Credentials....Try Again");
      }


      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET
      );
      const decryptedpass = decryptedPassword.toString(CryptoJS.enc.Utf8);

      if(decryptedpass != req.body.password){
        return res.status(401).json("Wrong Password....Try Again"); 
      }
        

      const userToken = jwt.sign(
        {
          id: user.id,
        },
        process.env.JWT_SEC,
        { expiresIn: "7d" }
      );
      const { password, __v, createdAt, updatedAt, ...userData } = user._doc;

      res.status(200).json({ ...userData, token: userToken });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json("Email not found"); // Informative response
      }

      // Generate a secure random reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiration = Date.now() + 900000; // 15 mins in milliseconds

      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetTokenExpiration;

      await user.save();

      // Create a reset password email
      const resetUrl = `http://localhost:5173/reset-password/${resetToken}`; // Replace with your reset password URL
      const message = {
        from: "pixelrushinfo@gmail.com", // Set your email address
        to: email,
        subject: "Password Reset Request",
        html: `
          <p>You have requested a password reset for your account.</p>
          <p>Click on the following link to reset your password:</p>
          <a href="${resetUrl}">Click here</a>
          <p>This link will expire in 15 minutes.</p>
        `,
      };

      transporter.sendMail(message, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json("Failed to send reset email");
        }

        res.status(200).json("Password reset instructions sent to your email");
      });
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error"); // Generic error for security
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;
      const user = await User.findOne({
        passwordResetToken: resetToken,
        passwordResetExpires: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(400).json("Invalid or expired reset token");
      }

      // Hash the new password securely (replace with a strong hashing algorithm)
      // const hashedPassword = await bcrypt.hash(newPassword, 10); // Use bcrypt or a similar library

      user.password = CryptoJS.AES.encrypt(
        newPassword,
        process.env.SECRET.toString()
      );
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save();

      res.status(200).json("Password reset successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error"); // Generic error for security
    }
  },
};
