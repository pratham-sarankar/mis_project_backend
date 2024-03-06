import ValidationService from "../services/validation_service.js";
import User from "../models/user.js";
import OTPService from "../services/otp_service.js";
import HashingService from "../services/hashing_service.js";
import TokenService from "../services/token_service.js";
import { Cipher } from "crypto";
import CipherService from "../services/cipher_service.js";

export default class UserController {
  static async fetchById(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is a required parameter" });
    }
    const user = await User.findById(id).populate("company").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  }
  static async login(req, res) {
    //Required Parameters: phoneNumber
    const { phoneNumber } = req.body;

    //Validate phoneNumber
    if (!phoneNumber) {
      return res
        .status(400)
        .json({ message: "Phone Number is a required parameter" });
    } else if (ValidationService.validatePhoneNumber(phoneNumber)) {
      return res
        .status(400)
        .json({ message: ValidationService.validatePhoneNumber(phoneNumber) });
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
  }

  static async verifyOTP(req, res) {
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
  }
}
