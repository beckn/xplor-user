import { getIsoString } from '../getIsoString';

describe('getIsoString', () => {
  it('should convert a time string to an ISO string representing a future time', () => {
    // Define a time string to test
    const timeString = '1h'; // 1 hour from now

    // Call the getIsoString function with the time string
    const isoString = getIsoString(timeString);

    // Calculate the expected future time in ISO string format
    const expectedIsoString = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Check if the returned ISO string is close to the expected ISO string
    // We use a range because the exact time might differ slightly due to execution time
    const isWithinRange = Math.abs(new Date(isoString).getTime() - new Date(expectedIsoString).getTime()) < 1000;

    expect(isWithinRange).toBe(true);
  });
});
