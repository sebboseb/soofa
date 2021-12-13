//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Dropdown from './Dropdown';
import { useAuth } from './contexts/AuthContext';
import { db } from '../firebase';
import Modal from './Modal';
import LoginPage from './LoginPage';

function MainPageNavbar() {

    const location = useLocation();

    const [username, setUsername] = useState("");
    const { currentUser } = useAuth();
    // const [clicked, setClicked] = useState(false);
    const [inputClicked, setInputClicked] = useState(true);
    const [bgcolor, setBgcolor] = useState("")

    useEffect(() => {
        setBgcolor((location.pathname).includes("/series/") || (location.pathname) === "/" ? "bg-gradient-to-b from-youtube-white-bg dark:bg-transparent dark:bg-gradient-to-b dark:from-transparent" : "bg-letterboxd-navbar-bg");

        const getUsers = async () => {
            currentUser && db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username.charAt(0).toUpperCase() + doc.data().Username.slice(1));
            });
        }

        getUsers();
    }, [currentUser, location]);



    return (
        <>
            <div className="flex w-screen justify-center">
                <div className={` w-full max-w-7xl bg-transparent h-16 z-50 relative flex items-center ${bgcolor}`}>
                    <div className="flex justify-end w-full max-w-6xl items-center h-16 absolute">
                        <ul className="flex space-x-8 h-16 items-center z-10 -mr-24">
                            <div>
                                {currentUser ?
                                    <Link to={`/${username.toLowerCase()}`}>
                                        <h1 className="font-semibold dark:text-white text-xl">{username}</h1>
                                    </Link>
                                    :
                                    <div>
                                        {inputClicked ? <div>
                                            <h1 onClick={() => setInputClicked(false)} className="font-semibold dark:text-white text-xl">Sign in</h1>
                                            </div> :
                                            <div className="mt-80">
                                                <div onClick={() => setInputClicked(true)} className="dark:text-white font-semibold cursor-pointer">
                                                    x</div>
                                                <LoginPage />
                                            </div>}
                                    </div>
                                }
                            </div>
                            {/* {currentUser ? null : <h1 onClick={() => {setClicked(true)}} className="font-semibold text-white text-xl">Create account</h1>} */}
                            {currentUser ? null : <Modal></Modal>}
                            <Link to="/dashboard/page/1"><h1 className="font-semibold dark:text-white text-xl">Series</h1></Link>
                            {currentUser && <Link to="/activity/series" className="font-semibold dark:text-white text-xl">Activity</Link>}
                            <Link to="/users"><h1 className="font-semibold dark:text-white text-xl">Users</h1></Link>
                            <Dropdown></Dropdown>
                            {/* <input className="rounded shadow h-8 w-56 p-4 z-10" type="text" placeholder="Search a series" /> */}
                        </ul>
                    </div>
                    <Link className="flex justify-start items-center h-16 absolute" to="/"><img className="w-20 h-auto" src="https://i.imgur.com/4dBDNkO.png" alt="Soofa Logo" />
                        <h1 className="dark:text-white font-semibold ml-4 text-4xl">Soofa</h1></Link>
                </div>
            </div>
        </>
    )
}

export default MainPageNavbar;