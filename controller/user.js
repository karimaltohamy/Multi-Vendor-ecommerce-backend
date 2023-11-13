const express = require("express");
const path = require("path");
const router = express.Router();
const { upload } = require("../multer");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const sendToken = require("../utils/sendToken");
const { isAuthenticated } = require("../middleware/auth");

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        console.log(err);
        if (err) res.status(500).json({ message: "Error delete file" });
      });

      return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = {
      name,
      email,
      password,
      avatar: fileUrl,
    };

    const newUser = await User.create(user);

    res.status(201).json({
      success: true,
      newUser,
      message: "Successful registration, you must login in",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// login user
router.post("/login-user", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(new ErrorHandler("Please provide all fields", 404));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("User doesn't exists!", 404));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Please provide correct information", 404));
    }

    return sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get user
router.get("/get-user", isAuthenticated, async (req, res, next) => {
  const {_id} = req.user
  try {
    const isUserExist = await User.findById(_id)

    if (!isUserExist) {
      return next(new ErrorHandler("user not found", 400));
    }
    
    res.status(201).json({
      success: true,
      user: isUserExist
    })

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
})

router.put("/update-user", isAuthenticated, async (req, res, next) => {
  const { name, email, phoneNumber, password } = req.body;

  try {
    const isUserExist = await User.findById(req.user.id).select("+password");

    if (!isUserExist) {
      return next(new ErrorHandler("user not found", 400));
    }

    const isPasswordValid = await isUserExist.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Please provide correct information", 404));
    }

    const userUpdated = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: { name, email, phoneNumber },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      user: userUpdated,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

router.put(
  "/update-user-avatar",
  upload.single("file"),
  isAuthenticated,
  async (req, res, next) => {
    const { id } = req.user;

    try {
      const user = await User.findById(id);

      const filePath = `uploads/${user.avatar}`;
      fs.unlink(filePath, (err) => {
        if (err) res.status(500).json({ message: "Error delete file" });
      });
      console.log(user);

      const filename = req.file.filename;
      const fileUrl = path.join(filename);

      user.avatar = fileUrl;

      const updateUser = await user.save();

      res.status(201).json({ success: true, user: updateUser });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update addressess
router.put("/update-address", isAuthenticated, async (req, res, next) => {
  const {addressType} = req.body

  try {
    const sameTypeAddress = await User.findOne({"addresses.addressType": addressType})

    if (sameTypeAddress) {
      return next(new ErrorHandler(`${addressType} address is exist`, 400));
    }

    const upadteUser = await User.findByIdAndUpdate(req.user._id, {$push : {addresses: req.body}}, {new: true})
    
    res.status(201).json({
      success: true,
      user: upadteUser
    })

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));

  }
})

// delete address
router.delete("/delete-address/:id", isAuthenticated, async (req, res, next) => {
  const {id} = req.params
  console.log(id);
  try {
    const isAdressExist = await User.findOne({"addresses._id": id})

    if (!isAdressExist) {
      return next(new ErrorHandler("address not found", 400));
    }

    const removeAddress = await User.findByIdAndUpdate(req.user._id, {$pull:{addresses: {_id: id}}}, {new: true})

    res.status(201).json({
      success: true,
      user: removeAddress
    })
    
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
    
  }
})

// change password
router.put("/change-password-user", isAuthenticated, async (req, res, next) => {
  const {oldPassword, newPassword, confirmPassword} = req.body
  try {

    const user = await User.findById(req.user._id).select("+password");

    const isPasswordValid = await user.comparePassword(oldPassword)

    if (!isPasswordValid) {
      return next(new ErrorHandler("Please provide correct old Password", 404));
    }

    if (newPassword !== confirmPassword) {
      return next(new ErrorHandler("confirm password is not equal new password", 404));
    }

    user.password = newPassword

    
    await  user.save()
    

    res.status(201).json({
      success: true,
      user
    })

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
})

// logout user
router.get("/logout", async (req, res, next) => {
  try {
    res
      .status(201)
      .cookie("token", null)
      .json({ success: true, message: "logout successfull" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

module.exports = router;
