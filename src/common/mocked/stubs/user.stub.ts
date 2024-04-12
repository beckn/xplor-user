class MockKycResponse {
  _id: string;
  phoneNumber: string;
  verified: boolean;
  kycStatus: boolean;
  wallet: any; // You can define the type of wallet property accordingly
  kyc: {
    lastName: string;
    firstName: string;
    address: string;
    email: string;
    gender: string;
    provider: {
      id: string;
      name: string;
    };
    _id: string;
  };

  constructor(
    _id: string,
    phoneNumber: string,
    verified: boolean,
    kycStatus: boolean,
    wallet: any,
    kyc: {
      lastName: string;
      firstName: string;
      address: string;
      email: string;
      gender: string;
      provider: {
        id: string;
        name: string;
      };
      _id: string;
    },
  ) {
    this._id = _id;
    this.phoneNumber = phoneNumber;
    this.verified = verified;
    this.kycStatus = kycStatus;
    this.wallet = wallet;
    this.kyc = kyc;
  }
}

class NewUser {
  _id: string;
  phoneNumber: string;
  verified: boolean;
  kycStatus: boolean;
  wallet: any; // You can define the type of wallet property accordingly
  updated_at: Date;
  created_at: Date;

  constructor(
    _id: string,
    phoneNumber: string,
    verified: boolean,
    kycStatus: boolean,
    wallet: any,
    updated_at: Date,
    created_at: Date,
  ) {
    this._id = _id;
    this.phoneNumber = phoneNumber;
    this.verified = verified;
    this.kycStatus = kycStatus;
    this.wallet = wallet;
    this.updated_at = updated_at;
    this.created_at = created_at;
  }
}

class MockRoleResponse {
  _id: string;
  phoneNumber: string;
  verified: boolean;
  kycStatus: boolean;
  wallet: any; // You can define the type of wallet property accordingly
  role: string;

  constructor(_id: string, phoneNumber: string, verified: boolean, kycStatus: boolean, wallet: any, role: string) {
    this._id = _id;
    this.phoneNumber = phoneNumber;
    this.verified = verified;
    this.kycStatus = kycStatus;
    this.wallet = wallet;
    this.role = role;
  }
}

// Export the MockUser class
export { MockKycResponse, NewUser, MockRoleResponse };
