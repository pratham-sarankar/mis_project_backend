export default class ValidationService {
  static validatePhoneNumber(phoneNumber) {
    if (!phoneNumber.match(/^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){10,15}[0-9]{1}$/)) {
      return "Invalid Phone Number";
    }
    return null;
  }

  static validateGSTNumber(gstNumber) {
    if (
      !gstNumber.match(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      )
    ) {
      return "Invalid GST Number";
    }
    return null;
  }
}
