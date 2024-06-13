import { HttpResponseMessage } from '../common/enums/HttpResponseMessage';
import { getSuccessResponse } from './getSuccessResponse';

/**
 * Determines and returns the user's journey status based on KYC (Know Your Customer) verification, role assignment, and mPin creation.
 * This function evaluates the user's journey status by checking the presence of KYC, role assignment, and mPin in the provided result.
 * It then returns a success response with the status of each condition (kycVerified, roleAssigned, mPinCreated) and an HTTP response message.
 *
 * @param {any} result - The result object containing the user's KYC status, role assignment, and mPin creation status.
 * @returns {Object} - An object containing the user's journey status and an HTTP response message.
 */
export const getUserJourneyChecks = (result: any) => {
  // Determine and return the user's journey status based on KYC and role assignment.
  if (result[0]?.kyc && result[0]?.role && result[0]?.mPin)
    return getSuccessResponse(
      {
        kycVerified: true,
        roleAssigned: true,
        mPinCreated: true,
      },
      HttpResponseMessage.OK,
    );
  else if (result[0]?.kyc && !result[0]?.role && !result[0]?.mPin)
    return getSuccessResponse(
      {
        kycVerified: true,
        roleAssigned: false,
        mPinCreated: false,
      },
      HttpResponseMessage.OK,
    );
  else if (!result[0]?.kyc && result[0]?.role && !result[0]?.mPin)
    return getSuccessResponse(
      {
        kycVerified: false,
        roleAssigned: true,
        mPinCreated: false,
      },
      HttpResponseMessage.OK,
    );
  else if (!result[0]?.kyc && !result[0]?.role && result[0]?.mPin)
    return getSuccessResponse(
      {
        kycVerified: false,
        roleAssigned: false,
        mPinCreated: true,
      },
      HttpResponseMessage.OK,
    );
  else if (!result[0]?.kyc && !result[0]?.role && !result[0]?.mPin)
    return getSuccessResponse(
      {
        kycVerified: false,
        roleAssigned: false,
        mPinCreated: false,
      },
      HttpResponseMessage.OK,
    );
  else if (result[0]?.kyc && result[0]?.role && !result[0]?.mPin)
    return getSuccessResponse(
      {
        kycVerified: true,
        roleAssigned: true,
        mPinCreated: false,
      },
      HttpResponseMessage.OK,
    );
  else if (!result[0]?.kyc && result[0]?.role && result[0]?.mPin)
    return getSuccessResponse(
      {
        kycVerified: false,
        roleAssigned: true,
        mPinCreated: true,
      },
      HttpResponseMessage.OK,
    );
  else
    return getSuccessResponse(
      {
        kycVerified: false,
        roleAssigned: false,
        mPinCreated: false,
      },
      HttpResponseMessage.OK,
    );
};
