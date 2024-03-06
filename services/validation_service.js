export default class ValidationService{
    static validatePhoneNumber(phoneNumber){
        if(!phoneNumber.match(/^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){10,15}[0-9]{1}$/)){
            return 'Invalid Phone Number';
        }
        return null;
    }
}