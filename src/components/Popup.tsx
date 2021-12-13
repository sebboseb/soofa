//@ts-check
import React from 'react'

function Popup() {
    return (
        <div className="w-screen h-screen absolute z-50 flex justify-center items-center">
            <div className="bg-gray-600 opacity-75 w-screen h-screen absolute z-50"></div>
            <div className="w-1/3 h-1/4 bg-blue-500 rounded shadow">

            </div>
        </div>
    )
}

export default Popup;
