import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent as firebaseLogEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyC3HcBdERvJbl1t8be4a-ycdUI04c8reG0",
  authDomain: "hariken-fa6db.firebaseapp.com",
  projectId: "hariken-fa6db",
  appId: "1:567377828678:web:361ee2695502bb08a46347",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function logEvent(eventName, params = {}) {
  try {
    firebaseLogEvent(analytics, eventName, params);
    console.log('Firebase Event Logged:', eventName, params); // optional confirmation in dev
  } catch (err) {
    console.warn('Failed to log Firebase event:', err);
  }
}

export { analytics, logEvent };
