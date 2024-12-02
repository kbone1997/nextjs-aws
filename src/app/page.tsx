"use client";
import Image from "next/image";
import { auth, googleProvider, githubProvider } from './firebase'; // Adjust path as needed
import { signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [email1, setEmail1] = useState("");
  const [password1, setPassword1] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = process.env.NEXT_PUBLIC_SHEET_DB_TOKEN;

  const handleSignup = async () => {
    setError("");

    if (password1 !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email1, password1);
      setSuccessMessage("Account created successfully!");
      setEmail1("");
      setPassword1("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Signup Error:", error);
      setError("Something went wrong.");
    }
  };

  const handleGoogleSignIn = async () => {
    handleLogout()
    try {
      await signInWithPopup(auth, googleProvider);
      await updateStatus("TRUE");
      setIsLoggedIn(true);
      router.push(`http://localhost:1337/`);
    } catch (error) {
      console.error('Google Sign-in Error:', error);
    }
  };

  const handleGitHubSignIn = async () => {
    handleLogout()
    try {
      await signInWithPopup(auth, githubProvider);
      await updateStatus("TRUE");
      setIsLoggedIn(true);
      router.push(`http://localhost:1337/`);
    } catch (error) {
      console.error('GitHub Sign-in Error:', error);
    }
  };

  const handleEmailPasswordSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await updateStatus("TRUE");
      setIsLoggedIn(true);
      router.push(`http://localhost:1337/`);
    } catch (error) {
      console.error('Email/Password Sign-in Error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await updateStatus("FALSE");
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const updateStatus = async (status: string) => {
    console.log("token:", token)
    try {
      await fetch('https://sheetdb.io/api/v1/f3vdwvj0et1zj/id/1', {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          data: { 'status': status }
        })
      });
    } catch (error) {
      console.error('Status Update Error:', error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col">
          {!isLoggedIn ? (
            <>
              <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-4">
                <h1 className="text-2xl font-bold">Signup with Email/Password</h1>

                <input
                  type="email"
                  placeholder="Email"
                  className="border rounded p-2 w-full max-w-sm"
                  value={email1}
                  onChange={(e) => setEmail1(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border rounded p-2 w-full max-w-sm"
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="border rounded p-2 w-full max-w-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}

                <button
                  onClick={handleSignup}
                  className="rounded-full bg-blue-500 text-white py-2 px-6 mt-4 hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="border rounded p-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border rounded p-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                  onClick={handleEmailPasswordSignIn}
                >
                  <Image
                    className="dark:invert"
                    src="/password.svg"
                    alt="Vercel logomark"
                    width={20}
                    height={20}
                  />
                  Sign In with Email/Password
                </div>
              </div>

              <div
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                onClick={handleGoogleSignIn}
              >
                <Image
                  className="dark:invert"
                  src="/google.svg"
                  alt="Google logo"
                  width={20}
                  height={20}
                />
                Continue with Google
              </div>

              <button
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] w-[200px] h-14 px-4 py-2"
                onClick={handleGitHubSignIn}
              >
                <Image
                  className="dark:invert"
                  src="/github.svg"
                  alt="GitHub logo"
                  width={20}
                  height={20}
                />
                Continue with GitHub
              </button>
            </>
          ) : (
            <div
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-red-500 text-white gap-2 hover:bg-red-700 dark:hover:bg-red-400 text-sm h-14"
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
