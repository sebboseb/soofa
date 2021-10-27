// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, addDoc, arrayUnion, deleteDoc, deleteField } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import Navbar from './Navbar';
import Tilt from 'react-parallax-tilt';
import StarRatings from 'react-star-ratings';
import { getEpisodesRequest, getPopularRequest, getSearchRequest, getSeasonsRequest } from './utils/api';

function Dashboard() {

    const { currentUser } = useAuth();
    const [addCard, setAddCard] = useState(6);
    const [series, setSeries] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [lol, setLol] = useState(1);
    const items = [];
    const [username, setUsername] = useState([]);
    const [descriptionText, setDescriptionText] = useState("Teawdawdawdawdawdawdawdawdxt");
    const [episodes, setEpisodes] = useState([]);
    const [seasonNr, setSeasonNr] = useState(6);
    const [posters, setPosters] = useState("");
    const [query, setQuery] = useState("Succession");
    const [season, setSeason] = useState([]);
    const [mainId, setMainId] = useState(76331);
    const seasonsLOL = [];
    const [starlol, setStarlol] = useState(4.5);
    const [seriesName, setSeriesName] = useState("");

    useEffect(() => {
        const getUsers = async () => {
            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(<span>{doc.data().Username}</span>);
                setFavourites([doc.data().Favourites]);
            });
        }

        async function getSeriesRequest() {
            const seriesList = await getSearchRequest(query);
            setSeries(seriesList);
            console.log(seriesList);

            const seasonList = await getSeasonsRequest(mainId);
            setSeason(seasonList);
            console.log(seasonList);

        }

        getUsers();
        getSeriesRequest();
    }, []);

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
            // <Link to={{
            //     pathname: '/detailspage',
            //     state: {
            //       coldlight: "oracle",
            //       tide: "hunter",
            //       id: series[i - 1].id,
            //     }
            //   }}>
            <div key={makeid(5)} onClick={() => {
                setMainId(series[i - 1].id);
                refreshSeasons();
                setSeriesName(series[i - 1].name);
                addEpisode(series[i - 1], { star_rating: starlol });
            }
            }>
                <Tilt tiltEnable={false} glareEnable={true} className=" cursor-pointer" tiltReverse={true} scale={1.05}>
                    <li className="bg-black w-44 h-66 rounded mx-1 my-1 text-white">
                        <img src={`https://image.tmdb.org/t/p/original${series[i - 1].poster_path}`}></img>
                        <p className="text-center font-bold">{series[i - 1].name}</p>
                    </li>
                </Tilt>
                <StarRatings rating={starlol} starDimension="20px" starSpacing="1px" starRatedColor="#F59E0B" />
            </div>
            /* `https://image.tmdb.org/t/p/original${series[i - 1].poster_path}`  */
            // </Link>
        )
    }

    for (let i = 1; i <= 20; i++) {
        seasonsLOL.push(
            //w16h24
            season[i - 1] &&
            <Link key={makeid(5)} to={{
                pathname: `/series/episodes/${(seriesName).replace(/\s/g, '-')}/${season[i - 1].name.replace(/\s/g, '-')}`,
                // state: {
                //     seriesid: mainId,
                //     seasonNumber: season[i - 1].season_number,
                //     seriesPoster: season[i - 1].poster_path
                // }
            }}>
                <div onClick={() => { addSeason(season[i - 1], { star_rating: starlol }); }}>
                    <Tilt tiltEnable={false} glareEnable={true} className=" cursor-pointer" tiltReverse={true} scale={1.05}>
                        <li className="bg-black w-44 h-66 rounded mx-1 my-1 text-white">
                            <img src={`https://image.tmdb.org/t/p/original${season[i - 1].poster_path}`}></img>
                            <p className="text-center font-bold">{season[i - 1].name}</p>
                        </li>
                    </Tilt>
                </div>
                {/* `https://image.tmdb.org/t/p/original${season[i - 1].poster_path}` */}
            </Link>
        )
    }

    const userDocument = doc(db, "User", currentUser.uid);
    const userDocumentFav = doc(db, "User", currentUser.uid, "Favourites", "Series");
    const userDocumentFavSeason = doc(db, "User", currentUser.uid, "Favourites", "Season");

    async function createUser() {
        await updateDoc(userDocument, {
            Name: "Bagurgle"
        });
    }

    const stars = { starslol: 5 }

    async function addEpisode(murloc, starrating) {
        Object.assign(murloc, starrating);
        console.log(murloc);
        setFavourites([...favourites, murloc]);
        console.log(favourites);

        await updateDoc(userDocumentFav, {
            [murloc.name]:
                [murloc],
            // deleteField(),
        });
    }

    async function addSeason(murlocSeason, starrating) {
        Object.assign(murlocSeason, starrating);
        console.log(murlocSeason);
        setFavourites([...favourites, murlocSeason]);
        console.log(favourites);

        await setDoc(userDocumentFavSeason, {
            Favourites: [murlocSeason],
        });
    }

    const onChange = (e) => {
        e.preventDefault();

        setQuery(e.target.value);

        fetch(`https://api.themoviedb.org/3/search/tv?api_key=e333684dcb3e9eac6a70505572519a23&language=en-US&query=${query}`).then((res) => res.json()).then((data) => {
            if (!data.errors) {
                setSeries(data.results);
            } else {
                setSeries([]);
            }
        });
    }

    async function refreshSeasons() {
        const seasonList = await getSeasonsRequest(mainId);
        setSeason(seasonList);
        console.log(seasonList);
    }

    return (
        <>
            <Navbar></Navbar>
            <div className="absolute w-screen h-screen flex justify-center">
                <div className="w-full h-full max-w-6xl bg-gray-700 flex flex-col items-center">
                    <div className=" mt-36 flex w-auto flex-col space-y-8 items-center">
                        <span><h1 className="text-white mt-16 font-semibold text-xl">Welcome back {username} here is what your friends have been watching</h1></span>
                        <input type="text" placeholder="Sök efter en serie" value={query} onChange={onChange} />
                        <div className="flex mt-16 space-x-4">
                            <Link to="/updateprofile" className=" rounded bg-white w-24 h-14">Update Profile</Link>
                            <button className="rounded bg-white w-24 h-14" onClick={() => { if (addCard <= series.length - 1) { setAddCard(addCard + 1) } }}>Add Card</button>
                            <button className="rounded bg-white w-24 h-14" onClick={() => { if (addCard >= 1) { setAddCard(addCard - 1) } }}>Remove Card</button>
                            <input type="text" placeholder="Name" onChange={(event) => { setNewName(event.target.value) }} />
                            <input type="number" placeholder="Mana" onChange={(event) => { setNewMana(event.target.value) }} />
                            <button className="rounded bg-white w-24 h-14" onClick={() => addEpisode()}>Firebase</button>
                        </div>
                        {addCard !== 0 ?
                            <div className=" w-full bg-white max-w-6xl rounded mt-16">
                                <ul className="flex flex-wrap list-none pt-2 pb-2 justify-center">
                                    {items}
                                </ul>
                            </div> : null}
                        {addCard}
                        {addCard !== 0 ?
                            <div className=" w-full bg-white max-w-6xl rounded mt-16">
                                <ul className="flex flex-wrap list-none pt-2 pb-2 justify-center">
                                    {seasonsLOL}
                                </ul>
                            </div> : null}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;
