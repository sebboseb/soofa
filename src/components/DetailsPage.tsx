// @ts-nocheck

import React, { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getCreditsRequest, getCustomRequest, getEpisodesRequest, getPersonRequest, getSuccessionRequest, getSeasonsRequest, getSearchRequest } from './utils/api';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, addDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import Tilt from 'react-parallax-tilt';

function DetailsPage() {

    const { id } = useParams();
    const { currentUser } = useAuth();
    const [season, setSeason] = useState(6);
    const [castList, setCastList] = useState([]);
    const [starlol, setStarlol] = useState(5);
    const seasonsLOL = [];
    const [succession, setSuccession] = useState([]);
    const [lolmurloc, setLolmurloc] = useState(0);

    useEffect(() => {
        const getUsers = async () => {
            db.collection("User").doc(currentUser.uid).collection("Favourites").doc("Series").get().then(doc => {
                if (doc.data()[id.replaceAll('-', ' ')]) {
                    if (doc.data()[id.replaceAll('-', ' ')]["star_rating"]) {
                        console.log(doc.data()[id.replaceAll('-', ' ')]["star_rating"]);
                        setLolmurloc(doc.data()[id.replaceAll('-', ' ')]["star_rating"]);
                    }
                }
                 else { 
                    setLolmurloc(0); 
                    console.log("lol"); }
            });
        }

        async function getSeriesRequest() {
            const seriesList = await getSearchRequest(id.replaceAll('-', ' '));
            setSuccession(seriesList[0]);

            const seasonList = await getSeasonsRequest(seriesList[0].id);
            setSeason(seasonList);
            console.log(seasonList);
        }

        getUsers();
        getSeriesRequest();
    }, []);

    //getstars if namn (id) matchar firebase get star rating annars gör ny star rating
    const userDocumentFav = doc(db, "User", currentUser.uid, "Favourites", "Series");

    async function addEpisode(murloc, starrating) {
        Object.assign(murloc, starrating);
        console.log(murloc);
        // setFavourites([...favourites, murloc]);
        // console.log(favourites);

        await updateDoc(userDocumentFav, {
            [murloc.name]:
                murloc,
            // deleteField(),
        });
    }

    function changeRating(newRating, name) {
        setLolmurloc(newRating);
    }

    for (let i = 1; i <= 20; i++) {
        seasonsLOL.push(
            season[i - 1] &&
            <Tilt tiltEnable={false} glareEnable={true} className=" cursor-pointer" tiltReverse={true} scale={1.05}>
                <li className="bg-black w-44 h-66 rounded mx-1 my-1 text-white">
                    <img src={`https://image.tmdb.org/t/p/original${season[i - 1].poster_path}`} className=" rounded-t"></img>
                    <p className="text-center font-bold">{season[i - 1].name}</p>
                </li>
            </Tilt>
        )
    }

    return (
        <>
            <p>{JSON.stringify(lolmurloc)}</p>
            <Link to="/" className="font-semibold text-white text-xl">Dashboard</Link>
            <p className="text-white font-semibold">{id.replaceAll('-', ' ')}</p>
            <p className="text-white">{window.location.pathname}</p>
            <div className=" w-screen flex justify-center">
                <div className=" w-full max-w-6xl h-screen bg-white flex">
                    <div className="flex flex-col items-center">
                        <img src={`https://image.tmdb.org/t/p/original${succession.backdrop_path}`} className=" h-90 w-3/4 shadow-inner"></img>
                        <div className="flex">
                            <div className="flex flex-col">
                                <img src={`https://image.tmdb.org/t/p/original${succession.poster_path}`} className="w-44 min-w-max h-72 max-w-sm"></img>
                                <StarRatings
                                    rating={lolmurloc}
                                    starRatedColor="#f59e0b"
                                    numberOfStars={5}
                                    starDimension="24px"
                                    starSpacing="1px"
                                    changeRating={changeRating}
                                    name="rating"
                                    starHoverColor="#f59e0b"
                                /></div>
                            <button className=" w-32 h-12 bg bg-green-500 rounded shadow hover:bg-green-600 text-white font-semibold"
                                onClick={() => addEpisode(succession, { star_rating: lolmurloc })}
                            >Logga</button>
                            <div className="flex flex-col">
                                <h1>{succession.name}</h1>
                                <p>{succession.overview}</p>
                            </div>
                        </div>
                        <h1 className="font-semibold text-xl">Säsonger</h1>
                        <ul className=" list-none flex">
                            {seasonsLOL}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailsPage;
