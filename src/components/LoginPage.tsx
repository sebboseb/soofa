// @ts-nocheck

import React, { useRef, useState } from 'react';
import '../index.css';
import { useAuth } from './contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';

export default function LoginPage() {

  const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  // const passwordConfirmRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { login } = useAuth();
  const history = useHistory();
  const [error, setError] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
    setError("");
    // setLoading(true);
    await login(emailRef.current.value, passwordRef.current.value);
    history.push("/");
    } catch {
    setError("Failed to log in");
    }
  }

  return (
    <>

        <div className="w-full max-w-xs mt-96">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email" ref={emailRef}></input>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="********" ref={passwordRef}></input>
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Log In
              </button>
              <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/forgot-password">
                Forgot Password?
              </Link>
            </div>
            <h1 className=" text-red-500">{error}</h1>
          </form>
          
        </div>
    </>
  )
}
