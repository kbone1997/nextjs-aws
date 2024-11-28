import { cookies } from 'next/headers';

export async function POST() {
    // Clear the 'firebase_token' cookie
    return new Response(null, {
        status: 200,
        headers: {
            'Set-Cookie': 'firebase_token=; Path=/; Max-Age=0; HttpOnly; Secure',
            'Content-Type': 'application/json',
        },
    });
}
