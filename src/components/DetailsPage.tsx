// @ts-nocheck

import React, { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getCreditsRequest, getCustomRequest, getEpisodesRequest, getPersonRequest } from './utils/api';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, addDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';

function DetailsPage() {

    const { id } = useParams();

    const { currentUser } = useAuth();

    const [episodes, setEpisodes] = useState([]);
    const [personsId, setPersonsId] = useState(1991569);
    const [season, setSeason] = useState(6);
    const [person, setPerson] = useState([]);
    const [murloc, setMurloc] = useState("");
    const [castList, setCastList] = useState([]);
    const [starlol, setStarlol] = useState(4.5);

    const items = [];

    const location = useLocation();
    const { coldlight, tide, seriesid, seasonNumber } = location.state;

    useEffect(() => {
        async function getSeriesRequest() {
            const seriesList = await getEpisodesRequest(seriesid, seasonNumber);
            setEpisodes(seriesList);

            const personList = await getPersonRequest(personsId);
            setPerson(personList);

            const creditsList = await getCreditsRequest(seriesid);
            setCastList(creditsList.cast);


            console.log(person);
            console.log(creditsList);
        }

        getSeriesRequest();
    }, []);

    const userDocumentFavEpisode = doc(db, "User", currentUser.uid, "Favourites", "Episodes");

    async function addActualEpisode(murlocEpisode, starrating) {
        Object.assign(murlocEpisode, starrating);
        console.log(murlocEpisode);
        // setFavourites([...favourites, murlocEpisode]);
        // console.log(favourites);

        await setDoc(userDocumentFavEpisode, {
            Favourites: [murlocEpisode],
        });
    }

    return (
        <>
            {/* <div>
                {personsId !== null ?
                    person.map((person, index) => (
                        <li onClick={() => setMurloc(person.id)} key={person.name} className="text-white list-none font-semibold">
                            {person.name}
                            {murloc}
                            {coldlight}
                            {tide}
                            {id}
                        </li>
                    ))
                    : null}
            </div> */}
            {/* <h1 className="font-semibold text-white">{personsId}</h1> */}
            {id}
            <div className="w-screen flex justify-center items-center mt-8 -mb-8">
                <Link to="/" className="text-white font-bold text-3xl">Dashboard</Link>
            </div>
            <div className=" bg-transparent rounded mt-16 flex items-center justify-center">
                <p className=" text-center">
                    {episodes.name}
                </p>
                <div>
                    <ul className="flex flex-wrap list-none pt-2 pb-2 justify-center">
                        {episodes.map((episode, index) => (
                            <li className="bg-white text-black w-72 p-4 rounded shadow mx-1 my-1 flex flex-col pb-8" key={index}
                                // onClick={() => addEpisode(episodes[index])}
                                onClick={() => addActualEpisode(episodes[index], { star_rating: starlol })}
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <ul>
                                            <h1 className="font-medium">{episode.name}</h1>

                                            <div className="flex flex-col justify-between">

                                                <div className="ml-2 leading-5">

                                                    {/* {episode.cast !== null ?
                                                        episode.guest_stars.map(star => <li key={star.id} onClick={() => setPersonsId(star.id)}>{star.name}</li>) :
                                                        episode.cast.map(star => <li key={star.id}>{star.name}</li>)} */}
                                                    <ul> {castList.map((names) => (
                                                        <li>
                                                            {names.name}
                                                        </li>
                                                    ))}</ul>



                                                </div>
                                                <div className="ml-1">
                                                    <StarRatings rating={4.5} starDimension="20px" starSpacing="1px" starRatedColor="#F59E0B" />
                                                </div>
                                            </div>
                                        </ul>
                                    </div>
                                    <img className=" w-24 h-40 justify-end" src={episodes[index].still_path !== null ? (`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${episodes[index].still_path}`) : ("https://www.themoviedb.org/t/p/w440_and_h660_face/2FWF65jBENpITVB2NytRk9AR7jN.jpg")} alt="" />
                                </div>
                                {/* https://www.themoviedb.org/t/p/w600_and_h900_bestv2/dYEYnVb9p80FDRpWESdxiJjmW5S.jpg */}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default DetailsPage;
