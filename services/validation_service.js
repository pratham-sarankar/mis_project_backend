export default class ValidationService{
    static validatePhoneNumber(phoneNumber){
        if(!phoneNumber.match(/^\d{10}$/)){
            return 'Invalid Phone Number';
        }
        return null;
    }
}