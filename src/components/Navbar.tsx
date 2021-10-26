// @ts-nocheck

// import React, {useState} from 'react';
import { useAuth } from './contexts/AuthContext';
import { useHistory, Link } from 'react-router-dom';

function Navbar() {

    const {currentUser, logout} = useAuth();
    // const [error, setError] = useState("");
    const history = useHistory();

    async function handleLogout() {
        // setError("");
        // try {
            await logout();
            history.push("/login");
        // } catch {
            // setError("Error")
        // }
    }

    return (
        <div className="flex w-screen justify-center">
            <div id="back-nav" className="p-4 h-16 justify-center w-screen bg-gray-800 flex space-x-4 absolute z-10"></div>
          <div id="nav" className="p-4 justify-center w-screen h-16 bg-gray-800 flex space-x-4 absolute max-w-6xl z-10">
            <AvatarCircle userName={currentUser.email} />
            <TailwindcssButton children={"Aktivitet"} />
            <TailwindcssButton children={"Text"} />
            <TailwindcssButton children={"Profil"} />
            <button className="text-white font-semibold" onClick={handleLogout}>Log Out</button>
          </div></div>
    )
}

function TailwindcssButton(props: any) {
    return (
      <div className="flex justify-center items-center">
        <button className="bg-gray-400 text-white
       font-medium px-4 py-2 rounded hover:bg-gray-600
       ">{props.children}</button></div>
    )
  }
  
  function AvatarCircle(props: any) {
    return (
      <div className="flex mr-auto items-center space-x-4">
          <div className=""><img src="../images./840FCB11.png" alt="" /></div>
        {/* <div className="circleAvatar rounded-full bg-white w-10 h-10"><Link to="/"></Link></div> */}
        <Link to="/"><img className="w-12 h-auto" src="https://i.imgur.com/4dBDNkO.png" alt="Soofa Logo" /></Link>
        <div className="font-medium text-white">{props.userName}</div>
    </div>
    )
  }

export default Navbar;
