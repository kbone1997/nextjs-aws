// lib/init-middleware.ts
import Cors from 'cors';

// Initialize the CORS middleware
const cors = Cors({
    origin: 'http://localhost:1337', // Make sure the origin is without trailing slash
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true, // Allow credentials (cookies)
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
});

// Helper function to run middleware
export function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}
