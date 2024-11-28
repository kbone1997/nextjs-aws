"use client"
import Image from "next/image";
import { auth, googleProvider } from './firebase'; // Adjust path as needed
import { getIdToken, signInWithPopup, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await getIdToken(user);
      const json = { token };

      // Send ID token to the API route to store it in an HTTP-only cookie
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });

      if (response.ok) {
        setIsLoggedIn(true);
        // Redirect the user back to Webflow with the token
        router.push(`http://localhost:1337/`);
      } else {
        console.error('No redirect URI provided.');
      }
    } catch (error) {
      console.error('Google Sign-in Error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear session token via API
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        setIsLoggedIn(false);
        console.log('Logged out successfully.');
      } else {
        console.error('Error during logout:', response.statusText);
      }
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {!isLoggedIn ? (
            <>
              <div
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                <Image
                  className="dark:invert"
                  src="/password.svg"
                  alt="Vercel logomark"
                  width={20}
                  height={20}
                />
                Email/Password
              </div>

              <div
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                onClick={handleGoogleSignIn}
              >
                <Image
                  className="dark:invert"
                  src="/google.svg"
                  alt="Vercel logomark"
                  width={20}
                  height={20}
                />
                Continue with Google
              </div>
            </>
          ) : (
            <div
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-red-500 text-white gap-2 hover:bg-red-700 dark:hover:bg-red-400 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              onClick={handleLogout}
            >
              Logout
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
