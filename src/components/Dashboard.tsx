// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { useAuth } from './contexts/AuthContext';
import Navbar from './Navbar';
import Tilt from 'react-parallax-tilt';

function Dashboard() {

    const { currentUser } = useAuth();
    const [addCard, setAddCard] = useState(3);
    const [series, setSeries] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [lol, setLol] = useState(1);
    const items = [];
    const [username, setUsername] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(<span>{doc.data().Username}</span>);
            });
        }

        const getSeriesRequest = async () => {
            const url = "http://www.omdbapi.com/?s=Game of Thrones&Season=1&apikey=43a10563";
            const response = await fetch(url);
            const responseJson = await response.json();

            setSeries(responseJson.Search);
            console.log(series[0]);
        }

        getUsers();
        getSeriesRequest();
    }, []);

    function cardOnClick(clickedCard) {
        setFavourites(clickedCard);
        console.log(clickedCard);
    }

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }

    for (let i = 1; i <= addCard; i++) {
        items.push(
            series[i - 1] && <Tilt className=" cursor-pointer" key={makeid(5)} tiltReverse={true} scale={1.05}><li className="bg-black w-16 h-24 rounded mx-1 my-1 text-white" onClick={() => cardOnClick(series[i - 1])} ><img src={series[i - 1].Poster}></img></li></Tilt>
            // {series.map((serie, index) => (<img src={serie[index + 1].Poster}></img>))}
            // series.map((serie, index) => (<li key={i} className="bg-black w-16 h-24 rounded mx-1 my-1 text-white"><img src={serie[index]}></img></li>))
            // series.map((serie, index) => (<img src={series[index].Poster}></img>))
        )
    }

    return (
        <>
            <Navbar></Navbar>
            <div className="absolute w-screen h-screen flex justify-center">
                <div className="w-full h-full max-w-6xl bg-gray-700 flex flex-col items-center">
                    <div className=" mt-36 flex w-auto flex-col space-y-8 items-center">
                        <span><h1 className="text-white mt-16 font-semibold text-xl">Welcome back {username} here is what your friends have been watching</h1></span>
                        <div className="flex mt-16 space-x-4">
                            <Link to="/updateprofile" className=" rounded bg-white w-24 h-14">Update Profile</Link>
                            <button className="rounded bg-white w-24 h-14" onClick={() => setAddCard(addCard + 1)}>Add Card</button>
                            <button className="rounded bg-white w-24 h-14" onClick={() => setAddCard(addCard - 1)}>Remove Card</button>
                            <input type="text" placeholder="Name" onChange={(event) => { setNewName(event.target.value) }} />
                            <input type="number" placeholder="Mana" onChange={(event) => { setNewMana(event.target.value) }} />
                            <button className="rounded bg-white w-24 h-14" onClick={() => createUser()}>Firebase</button>
                        </div>
                        {addCard !== 0 ?
                            <div className=" w-3/4 bg-white max-w-xl rounded mt-16">
                                <ul className="flex flex-wrap list-none pt-2 pb-2 justify-center">
                                    {items}
                                </ul>
                            </div> : null}
                        {/* <div className=" w-3/4 bg-white max-w-xl rounded mt-16">
                            <ul className="flex flex-wrap list-none pt-2 pb-2 justify-center">
                                <img src={favourites.Poster} alt="" />
                            </ul>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;
