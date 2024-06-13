// Correctly import the 'ms' library
import * as ms from 'ms';

export const getIsoString = (time: string) => {
  // Convert the time string to milliseconds
  const milliseconds = ms(time);

  // Calculate the future time by adding the milliseconds to the current time
  const futureTime = Date.now() + milliseconds;

  // Convert the future time to an ISO string
  const isoString = new Date(futureTime).toISOString();

  return isoString;
};
