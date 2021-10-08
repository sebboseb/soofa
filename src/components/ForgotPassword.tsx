// @ts-nocheck

import React, {useRef, useState} from 'react';
import '../index.css';
import { useAuth } from './contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {

    const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    // const passwordRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    // const passwordConfirmRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const {resetPassword} = useAuth();

    const [message, setMessage] = useState("");

    async function handleSubmit(e: any) {
        e.preventDefault();

        // try {
            setMessage("");
            // setError("");
            // setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage("We've sent a mail");
        // } catch {
            // setError("Failed to log in");
        // }
    }

    return (
        <>
        <div className="w-screen flex items-center mt-96 flex-col">
        <div className="w-full max-w-xs">
            {message && <h1>{message}</h1>}
  <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Email
      </label>
      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email" ref={emailRef}></input>
    </div>
    <div className="flex items-center justify-between">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm" type="submit">
        Reset Password
      </button>
      <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/login">
        Log in
      </Link>
    </div>
  </form>
</div><div className=" text-xl font-sans font-semibold text-gray-200">Don't have an account yet? <Link to="/signup">Sign Up</Link></div></div>
        </>
    )
}
