const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;// express is creating this request it comes from app(express.json())


    let user = await User.findOne({ email }); //waiting after that it return user obejct if user is found otherwise null
    if (user) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword }); //creating a js object stored inside the RAM server stores it
    await user.save();

    req.session.user = { id: user._id, name: user.name, email: user.email };  //session making for future login

    res.json({ message: "Registered successfully", user: req.session.user }); //sneds json back to the react
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    await User.findByIdAndUpdate(req.session.user.id, { name, email });
    req.session.user.name = name;
    req.session.user.email = email;
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.session.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to change password" });
  }
};


// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//     req.session.user = { id: user._id, name: user.name, email: user.email };

//     res.json({ message: "Logged in successfully", user: req.session.user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    console.log("EMAIL RECEIVED:", email);

    const user = await User.findOne({ email }); //controller->model->mongodb

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        error: "Password incorrect"
      });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    res.json({
      message: "Logged in successfully",
      user: req.session.user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.logout = (req, res) => {
  req.session.destroy(err => {  //server forgets you
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("connect.sid"); //browser also forgets session
    res.json({ message: "Logged out successfully" });
  });
};


//On front end refresh frontend calls controller checks if user exists
//if yes return req.session.user

exports.me = (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      error: "Not authenticated",
      user: null
    });
  }
1. 
  res.status(200).json({
    user: req.session.user
  });
};

