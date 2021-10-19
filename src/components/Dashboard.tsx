// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import Navbar from './Navbar';
import Tilt from 'react-parallax-tilt';

function Dashboard() {

    const { currentUser } = useAuth();
    const [addCard, setAddCard] = useState(0);
    const [series, setSeries] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [lol, setLol] = useState(1);
    const items = [];
    const [username, setUsername] = useState([]);
    const [descriptionText, setDescriptionText] = useState("Text");
    const [episodes, setEpisodes] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(<span>{doc.data().Username}</span>);
            });
        }

        const getSeriesRequest = async () => {
            const url = "https://api.themoviedb.org/3/tv/popular?api_key=e333684dcb3e9eac6a70505572519a23&language=en-US";

            const urlSolo = "https://api.themoviedb.org/3/tv/87362/season/6?api_key=e333684dcb3e9eac6a70505572519a23&language=en-US";
            const responseSolo = await fetch(urlSolo);
            const responseSoloJson = await responseSolo.json();
            console.log(responseSoloJson);
            console.log(responseSoloJson.episodes);
            console.log(responseSoloJson.episodes[0].guest_stars[2].name);

            console.log(responseSoloJson.episodes[0].guest_stars.length);

            setEpisodes(responseSoloJson.episodes);
            // const apiKey = 'e333684dcb3e9eac6a70505572519a23';
            // const url = `https://api.themoviedb.org/3/tv/1399?api_key=${apiKey}&language=en-US`;
            const response = await fetch(url);
            const responseJson = await response.json();
            const seriesResults = responseJson.results;

            setSeries(seriesResults);
            console.log(series);
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
            // <Link to="/detailspage">
            <div onClick={() => setDescriptionText(series[i - 1].overview)}><Tilt tiltEnable={false} glareEnable={true} className=" cursor-pointer" key={makeid(5)} tiltReverse={true} scale={1.05}><li className="bg-black w-24 h-36 rounded mx-1 my-1 text-white"><img src={`https://image.tmdb.org/t/p/original${series[i - 1].poster_path}`}></img></li></Tilt></div>
            // </Link>
            // {series.map((serie, index) => (<img src={serie[index + 1].Poster}></img>))}
            // series.map((serie, index) => (<li key={i} className="bg-black w-16 h-24 rounded mx-1 my-1 text-white"><img src={serie[index]}></img></li>))
            // series.map((serie, index) => (<img src={series[index].Poster}></img>))
        )
    }

    const userDocument = doc(db, "User", currentUser.uid);

    async function createUser() {
        await updateDoc(userDocument, {
            Name: "Bagurgle"
        })
    }

    async function addEpisode(murloc) {
        await updateDoc(userDocument, {
            Favourites: [murloc]
        })
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
                            <div className=" w-full bg-white max-w-3xl rounded mt-16">
                                <ul className="flex flex-wrap list-none pt-2 pb-2 justify-center">
                                    {items}
                                </ul>
                            </div> : null}
                        {addCard}

                        <div className=" w-3/4 bg-white max-w-6xl h-auto rounded mt-16 flex items-center justify-center">
                            <p className=" text-center">
                                {episodes.name}
                            </p>
                            <div>
                                <ul className="flex overflow-scroll max-w-5xl h-96 flex-wrap list-none pt-2 pb-2 justify-center">
                                    {episodes.map((episode, index) => (

                                        <li className="bg-black text-white w-72 p-4 h-44 rounded shadow mx-1 my-1 flex flex-col" key={index} onClick={() => addEpisode(episodes[index])}>


                                            <div className="flex justify-between">
                                                <li>
                                                    <ul>
                                                        <h1 className="font-medium">{episode.name}</h1>
                                                        <div className="ml-2">
                                                            <li>{episodes[index].guest_stars[0].name}</li>
                                                            <li>{episodes[index].guest_stars[1].name}</li>
                                                            <li>{episodes[index].guest_stars[2].name}</li>
                                                            <li>{episodes[index].guest_stars[3].name}</li>
                                                        </div>
                                                    </ul>
                                                </li>

                                                <img className=" w-24 justify-end" src="https://www.themoviedb.org/t/p/w440_and_h660_face/2FWF65jBENpITVB2NytRk9AR7jN.jpg" alt="" />

                                            </div>

                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;
