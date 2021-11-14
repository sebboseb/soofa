//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Dropdown from './Dropdown';
import { useAuth } from './contexts/AuthContext';
import { db } from '../firebase';
import Modal from './Modal';
import LoginPage from './LoginPage';

function MainPageNavbar() {

    const [username, setUsername] = useState("");
    const { currentUser, logout } = useAuth();
    const [error, setError] = useState("");
    const history = useHistory();
    // const [clicked, setClicked] = useState(false);
    const [inputClicked, setInputClicked] = useState(true);

    useEffect(() => {
        const getUsers = async () => {
            currentUser && db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
            });
        }

        getUsers();
    }, [currentUser]);

    async function handleLogout() {
        setError("");
        try {
            await logout();
            history.push("/");
        } catch {
            setError("Error")
        }
    }

    return (
        <>
        {error}
            <div className=" min-w-full w-screen bg-transparent h-16 z-50 relative">
                <div className="flex justify-end w-screen items-center h-16 absolute">
                    <ul className="flex space-x-8 mr-16 h-16 items-center z-10">
                        <div>
                            {currentUser ?
                                <Link to={`/${username}`}>
                                    <h1 className="font-semibold text-white text-xl">{username}</h1>
                                </Link>
                                :
                                <div>
                                    {inputClicked ? <div>
                                        <h1 onClick={() => setInputClicked(false)} className="font-semibold text-white text-xl">Sign in</h1></div> :
                                        <div className="mt-96">
                                            <div onClick={() => setInputClicked(true)} className="text-white font-semibold cursor-pointer">
                                                x</div>
                                            <LoginPage />
                                        </div>}
                                </div>
                            }
                        </div>
                        {/* {currentUser ? null : <h1 onClick={() => {setClicked(true)}} className="font-semibold text-white text-xl">Create account</h1>} */}
                        {currentUser ? null : <Modal>Text</Modal>}
                        <Link to="/dashboard"><h1 className="font-semibold text-white text-xl">Series</h1></Link>
                        <Link to="/activity" className="font-semibold text-white text-xl">Activity</Link>
                        <Dropdown></Dropdown>
                        {/* <input className="rounded shadow h-8 w-56 p-4 z-10" type="text" placeholder="Search a series" /> */}
                        {currentUser && <button className="text-white font-semibold" onClick={handleLogout}>Log Out</button>}
                    </ul>
                </div>
                <div className="flex justify-start w-screen items-center h-16 absolute">
                    <Link to="/"><img className="w-20 h-auto ml-16" src="https://i.imgur.com/4dBDNkO.png" alt="Soofa Logo" /></Link>
                </div>
            </div>
        </>
    )
}

export default MainPageNavbar;