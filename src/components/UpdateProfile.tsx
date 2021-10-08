// @ts-nocheck

import React, { useRef } from 'react';
import '../index.css';
import { useAuth } from './contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';

export default function UpdateProfile() {

    const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const passwordRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    // const passwordConfirmRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const { currentUser, updateEmail, updatePassword } = useAuth();
    const history = useHistory();

    async function handleSubmit(e: any) {
        const promises = []
        // setLoading(true);
        // setError("");
        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }
        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises).then(() => { history.push("/") }).catch(() => {
            // setError("Error");
        }).finally(
            () => {
                // setLoading(false);
            }
        )

    }

    return (
        <>
            <div className="w-screen flex items-center mt-96 flex-col">
                <div className="w-full max-w-xs">
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email" ref={emailRef} defaultValue={currentUser.email}></input>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="********" ref={passwordRef}></input>
                        </div>jl
                        <div className="flex items-center justify-between">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Sign In
                            </button>
                            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/">
                                Forgot Password?
                            </a>
                        </div>
                    </form>
                </div><Link to="/">Cancel</Link></div>
        </>
    )
}
