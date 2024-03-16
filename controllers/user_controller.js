import ValidationService from "../services/validation_service.js";
import User from "../models/user.js";
import OTPService from "../services/otp_service.js";
import HashingService from "../services/hashing_service.js";
import TokenService from "../services/token_service.js";
import { Cipher } from "crypto";
import CipherService from "../services/cipher_service.js";

export default class UserController {
  static async fetchMe(req, res, next) {
    try {
      const userId = req.headers.userId;
      const user = await User.findById(userId)
        .populate({
          path: "company",
          populate: { path: "clients" },
        })
        .exec();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async fetchById(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "id is a required parameter" });
      }
      const user = await User.findById(id).populate("company").exec();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
  static async login(req, res, next) {
    try {
      //Required Parameters: phoneNumber
      const { phoneNumber } = req.body;

      //Validate phoneNumber
      if (!phoneNumber) {
        return res
          .status(400)
          .json({ message: "Phone Number is a required parameter" });
      } else if (ValidationService.validatePhoneNumber(phoneNumber)) {
        return res.status(400).json({
          message: ValidationService.validatePhoneNumber(phoneNumber),
        });
      }

      //Generate an otp
      const otp = OTPService.generateOTP();
      const hashedOTP = await HashingService.generateHash(otp);
      const encryptedData = CipherService.encryptMap(req.body);
      const payload = {
        data: encryptedData,
        otp: hashedOTP,
      };

      //Generate verification token.
      const verificationToken = TokenService.generateVerificationToken(payload);

      return res.status(200).json({
        message: "User Logged in Successfully.",
        //TODO: Temporarily sending otp until we implement the SMS service
        otp: otp,
        verificationToken: verificationToken,
      });
    } catch (err) {
      next(err);
    }
  }

  static async verifyOTP(req, res, next) {
    try {
      //Required Parameters: verificationToken, otp
      const { verificationToken, otp } = req.body;
      if (!verificationToken || !otp) {
        return res.status(400).json({
          message: "Verification Token and OTP are required parameters",
        });
      }

      //Verify the token
      let payload;
      try {
        payload = TokenService.verifyToken(verificationToken);
      } catch (error) {
        return res.status(400).json({ message: "Invalid or Expired Token" });
      }
      //Compare otp hash from payload and otp from body
      const isMatch = await HashingService.compareHash(otp, payload.otp);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      const decryptedData = CipherService.decryptMap(payload.data);
      //Check if user exists, if not create a new user
      let user = await User.findOne({ phoneNumber: decryptedData.phoneNumber });
      let isUserNew = false;
      if (!user) {
        user = new User(decryptedData);
        await user.save();
        isUserNew = true;
      }

      //Generate access token
      const accessToken = TokenService.generateAccessToken({
        id: user.id,
      });

      return res.status(200).json({
        message: "User logged in successfully.",
        accessToken: accessToken,
        isNewUser: isUserNew,
      });
    } catch (err) {
      next(err);
    }
  }

  static async resendOTP(req, res, next) {
    //Required Parameters: verificationToken
    let { verificationToken } = req.body;
    if (!verificationToken) {
      return res
        .status(400)
        .json({ message: "Verification Token is a required parameter" });
    }

    //Verify the token
    let payload;
    try {
      payload = TokenService.verifyToken(verificationToken);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or Expired Token" });
    }

    //Generate an otp
    const otp = OTPService.generateOTP();
    const hashedOTP = await HashingService.generateHash(otp);
    console.log(payload);
    payload = {
      data: payload.data,
      otp: hashedOTP,
    };

    //Generate verification token.
    verificationToken = TokenService.generateVerificationToken(payload);

    return res.status(200).json({
      message: "OTP Sent Successfully.",
      otp: otp,
      verificationToken,
    });
  }
}
