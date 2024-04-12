import { CountryCode } from '../constant/mocked/phone-number-message';

class PhoneNumberGenerator {
  countryCode: string;

  constructor(countryCode: string) {
    // Map country codes to corresponding dialing codes
    const countryDialingCodes: { [key: string]: string } = {
      IN: CountryCode.India,
      BR: CountryCode.Brazil,
      // Add more country codes and their dialing codes as needed
    };

    // Set the dialing code based on the provided country code
    this.countryCode = countryDialingCodes[countryCode] || '';
  }

  generatePhoneNumber(): string {
    if (!this.countryCode) {
      return this.generateRandomPhoneNumber();
    }

    // Generate random 10-digit phone number excluding the country code
    const remainingDigits = 10 - this.countryCode.length;
    let phoneNumber = this.countryCode;
    for (let i = 0; i < remainingDigits; i++) {
      phoneNumber += Math.floor(Math.random() * 10).toString();
    }

    return phoneNumber;
  }

  private generateRandomPhoneNumber(): string {
    // Generate random 10-digit phone number without country code
    let phoneNumber = '';
    for (let i = 0; i < 10; i++) {
      // Ensure the phone number doesn't start with 0, 1, or 2
      const digit = i === 0 ? Math.floor(Math.random() * 7) + 3 : Math.floor(Math.random() * 10);
      phoneNumber += digit.toString();
    }

    return phoneNumber;
  }
}

export { PhoneNumberGenerator };
