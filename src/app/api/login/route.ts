import { NextResponse } from 'next/server';
import firebaseAdmin from "../../lib/firebaseAdmin"; // Assuming you have set up Firebase Admin SDK

export async function POST(req: Request) {
    const cookie = require("cookie");
    const idToken = await req.json(); // Get the ID token sent from client
    console.log("inside request")
    console.log(idToken.token)

    // Verify the ID token using Firebase Admin SDK
    try {
        //const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        //const expiresIn = 60 * 60 * 24 * 5; // Token expires in 5 days

        // Set the token as an HTTP-only cookie
        const response = NextResponse.json({ message: 'Logged in successfully' });

        response.headers.set(
            'Set-Cookie',
            cookie.serialize('firebase_token', idToken.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                path: '/', // Available site-wide
            })
        );

        return response;
    } catch (error) {
        return NextResponse.json({ message: 'check something' }, { status: 401 });
    }
}
