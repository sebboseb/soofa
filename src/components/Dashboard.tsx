// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import Navbar from './Navbar';
import Tilt from 'react-parallax-tilt';
import StarRatings from 'react-star-ratings';

function Dashboard() {

    const { currentUser } = useAuth();
    const [addCard, setAddCard] = useState(6);
    const [series, setSeries] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [lol, setLol] = useState(1);
    const items = [];
    const [username, setUsername] = useState([]);
    const [descriptionText, setDescriptionText] = useState("Text");
    const [episodes, setEpisodes] = useState([]);
    const [seasonNr, setSeasonNr] = useState(6);
    const [posters, setPosters] = useState("");

    useEffect(() => {
        const getUsers = async () => {
            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(<span>{doc.data().Username}</span>);
            });
        }

        const getSeriesRequest = async () => {
            // const url = "https://api.themoviedb.org/3/tv/popular?api_key=e333684dcb3e9eac6a70505572519a23&language=se-SE";
            const url = `https://api.themoviedb.org/3/tv/87362?api_key=e333684dcb3e9eac6a70505572519a23&language=en-US`;

            // const apiKey = 'e333684dcb3e9eac6a70505572519a23';
            // const url = `https://api.themoviedb.org/3/tv/1399?api_key=${apiKey}&language=en-US`;
            const response = await fetch(url);
            const responseJson = await response.json();

            // const seriesResults = responseJson.results;
            const seriesResults = responseJson.seasons;


            setPosters(responseJson.poster_path);

            setSeries(seriesResults);
            console.log(responseJson);
            // console.log(series);
        }

        getUsers();
        getSeriesRequest();
    }, []);

    function cardOnClick(clickedCard) {
        setFavourites(clickedCard);
        console.log(clickedCard);
    }

    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    for (let i = 1; i <= addCard; i++) {
        items.push(
            //w16h24
            series[i - 1] &&
            <Link to="/detailspage">
                <div onClick={() => setDescriptionText(series[i - 1].overview)}>
                    <Tilt tiltEnable={false} glareEnable={true} className=" cursor-pointer" key={makeid(5)} tiltReverse={true} scale={1.05}>
                        <li className="bg-black w-44 h-66 rounded mx-1 my-1 text-white">
                            <img src={`https://image.tmdb.org/t/p/original${posters}`}></img>
                            <p className="text-center font-bold">{series[i - 1].name}</p>
                        </li>
                    </Tilt>
                </div>
                {/* `https://image.tmdb.org/t/p/original${series[i - 1].poster_path}` */}
            </Link>
            // {series.map((serie, index) => (<img src={serie[index + 1].Poster}></img>))}
            // series.map((serie, index) => (<li key={i} className="bg-black w-16 h-24 rounded mx-1 my-1 text-white"><img src={serie[index]}></img></li>))
            // series.map((serie, index) => (<img src={series[index].Poster}></img>))
        )
    }

    const userDocument = doc(db, "User", currentUser.uid);
    const userDocumentFav = doc(db, "User", currentUser.uid, "Favourites", "[0]");

    async function createUser() {
        await updateDoc(userDocument, {
            Name: "Bagurgle"
        });
    }

    async function addEpisode(murloc) {
        await updateDoc(userDocument, {
            Favourites: [murloc],
        });
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
                            <button className="rounded bg-white w-24 h-14" onClick={() => { if (addCard <= series.length - 1) { setAddCard(addCard + 1) } }}>Add Card</button>
                            <button className="rounded bg-white w-24 h-14" onClick={() => { if (addCard >= 1) { setAddCard(addCard - 1) } }}>Remove Card</button>
                            <input type="text" placeholder="Name" onChange={(event) => { setNewName(event.target.value) }} />
                            <input type="number" placeholder="Mana" onChange={(event) => { setNewMana(event.target.value) }} />
                            <button className="rounded bg-white w-24 h-14" onClick={() => createUser()}>Firebase</button>
                        </div>



                        {addCard !== 0 ?
                            <div className=" w-full bg-white max-w-6xl rounded mt-16">
                                <ul className="flex flex-wrap list-none pt-2 pb-2 justify-center">
                                    {items}
                                </ul>
                            </div> : null}
                        {addCard}


                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;
