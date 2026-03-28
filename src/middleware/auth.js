import admin from 'firebase-admin';
import logger from '../config/logger.js';

try {
  if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  } else {
    logger.warn('Firebase Admin not fully initialized securely. Add FIREBASE_PROJECT_ID for production.');
    admin.initializeApp();
  }
} catch (error) {
  logger.error('Firebase Admin initialization error: ', error);
}

export const verifyResponder = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // contain user info
    next();
  } catch (error) {
    logger.error(`Auth Error: ${error.message}`);
    // Allowing bypass ONLY for testing if environment variable is set
    if (process.env.NODE_ENV === 'test' || process.env.IGNORE_AUTH === 'true') {
        logger.warn('Bypassing Auth due to IGNORE_AUTH or test environment');
        req.user = { uid: 'test_user' };
        return next();
    }
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
