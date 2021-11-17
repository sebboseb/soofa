//@ts-nocheck

import React from 'react';
import Signup from './Signup';
import { useState } from 'react'

export default function Modal() {

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                className=" bg-soofa-orange text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Create account
            </button>
            {showModal ? (
                <>
                    <div className="flex overflow-x-hidden overflow-y-hidden fixed -inset-10 z-50 outline-none focus:outline-none w-max h-96 top-1/3 left-1/3">
                        <div className="relative p-6 flex-auto">
                            <Signup />
                        </div>
                    </div>
                    <div onClick={() => setShowModal(false)} className="opacity-25 fixed -inset-10 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    )
}
