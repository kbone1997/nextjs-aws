import { cookies } from "next/headers";

export async function OPTIONS() {
    // Handle preflight request
    return new Response(null, {
        status: 204, // No content for preflight response
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:1337', // Replace with your client URL
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allowed HTTP methods
            'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allowed headers
            'Access-Control-Allow-Credentials': 'true', // Allow cookies/credentials
        },
    });
}

export async function GET(req: Request) {
    // Set CORS headers for the actual request
    const headers = new Headers({
        'Access-Control-Allow-Origin': 'http://localhost:1337', // Replace with your client URL
        'Access-Control-Allow-Credentials': 'true', // Allow cookies/credentials
        'Content-Type': 'application/json',
    });
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('firebase_token');  // Get the 'firebase_token' cookie

        // If token doesn't exist, send an error response
        if (!token) {
            return new Response(JSON.stringify({ message: 'User not logged in' }), {
                status: 401,
                headers
            });
        }

        // If token exists, return success
        return new Response(JSON.stringify({ message: 'User logged in' }), {
            status: 200,
            headers
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers
        });
    }
}
