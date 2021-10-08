// @ts-nocheck


import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './Navbar';


function Dashboard() {

    
    const { currentUser} = useAuth();

    return (
        <>
            <Navbar></Navbar>
            <div className="absolute w-screen h-screen flex justify-center">
                <div className="w-full h-full max-w-6xl bg-gray-700 flex flex-col items-center">
                    <h1 className="text-white mt-16 font-semibold text-xl text-center">Welcome back {currentUser.email} here is what your friends have been watching</h1>
                    <Link to="updateprofile" className="mt-16 w-24 h-10 text-center text-sm rounded-lg justify-center items-center font-semibold bg-white"><div className="relative mt-2">Update Profile</div></Link>
                </div>
            </div>

        </>
    )
}

export default Dashboard;
