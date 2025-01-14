import { Timestamp } from 'firebase/firestore';

export const getCSTDate = () => {
  const date = new Date();
  return new Date(date.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
};

export const getCSTTimestamp = () => {
  return new Date(getCSTDate()).toISOString();
}; 