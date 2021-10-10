// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { useAuth } from './contexts/AuthContext';
import Navbar from './Navbar';


function Dashboard() {


    const { currentUser } = useAuth();

    const [addCard, setAddCard] = useState(3);

    const items = []

    for (let i = 1; i <= addCard; i++) {
        items.push(
            <li key={i} className="bg-black w-16 h-24 rounded mx-1 my-1 text-white"></li>
        )
    }

    const [lollol, setLol] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setLol(<span>{doc.data().Username}</span>);
            });
        }
        getUsers();
    }, []);

    return (
        <>
            <Navbar></Navbar>
            <div className="absolute w-screen h-screen flex justify-center">
                <div className="w-full h-full max-w-6xl bg-gray-700 flex flex-col items-center">




                    <div className=" mt-36 flex w-auto flex-col space-y-8 items-center">

                        <span><h1 className="text-white mt-16 font-semibold text-xl">Welcome back {lollol} here is what your friends have been watching</h1></span>

                        <div className="flex mt-16 space-x-4">
                            <Link to="/updateprofile" className=" rounded bg-white w-24 h-14">Update Profile</Link>

                            <button className="rounded bg-white w-24 h-14" onClick={() => setAddCard(addCard + 1)}>Add Card</button>
                            <button className="rounded bg-white w-24 h-14" onClick={() => setAddCard(addCard - 1)}>Remove Card</button>

                            <input type="text" placeholder="Name" onChange={(event) => { setNewName(event.target.value) }} />
                            <input type="number" placeholder="Mana" onChange={(event) => { setNewMana(event.target.value) }} />

                            <button className="rounded bg-white w-24 h-14" onClick={() => createUser()}>Firebase</button>
                        </div>

                        {addCard !== 0 ?
                            <div className=" min-w-3/4 bg-white max-w-xl rounded mt-16">
                                <ul className="flex flex-wrap list-none pt-2 justify-center">
                                    {items}
                                </ul>
                            </div> : null}




                    </div>

                </div>
            </div>

        </>
    )
}

export default Dashboard;
