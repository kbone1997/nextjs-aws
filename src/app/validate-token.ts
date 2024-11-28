import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

const serviceAccount = require('../../../path-to-service-account.json');
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { token } = req.body;

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            res.status(200).json({ isValid: true, uid: decodedToken.uid });
        } catch (error) {
            res.status(401).json({ isValid: false, error: 'Invalid token' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}