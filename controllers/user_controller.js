import ValidationService from "../services/validation_service.js";
import User from "../models/user.js";

export default class UserController{
    static async login(req,res){
        //Required Parameters: phoneNumber
        const { phoneNumber } = req.body;

        //Validate phoneNumber
        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone Number is a required parameter' });
        }else if(ValidationService.validatePhoneNumber(phoneNumber)){
            return res.status(400).json({ message: ValidationService.validatePhoneNumber(phoneNumber) });
        }

        //Find user by phoneNumber
        let user = await User.findOne({phoneNumber});
        let isNewUser = false;
        if (!user) {
            user = new User({phoneNumber});
            await user.save();
            isNewUser = true;
        }
        console.log(user);
        return res.status(200).json({ message: 'User Logged in Successfully.', user:user, isNewUser: isNewUser });
    }/////////////////////////
}