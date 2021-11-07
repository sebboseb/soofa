//@ts-nocheck
import React, { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getCreditsRequest, getCustomRequest, getEpisodesRequest, getPersonRequest, getSuccessionRequest, getSeasonsRequest, getSearchRequest, getEpisodeRequest } from './utils/api';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, addDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import Tilt from 'react-parallax-tilt';
import Navbar from './Navbar';

function EpisodeLore() {

    const { id, seasonId, episodeId } = useParams();

    const [seriesNr, setSeriesNr] = useState([]);
    const [episode, setEpisode] = useState([]);

    const { currentUser } = useAuth();

    useEffect(() => {

        async function getSeriesRequest() {
            const seriesList = await getSearchRequest(id.replaceAll('-', ' '));
            const episodeLoreList = await getEpisodeRequest(seriesList[0].id, seasonId, episodeId);
            setEpisode(episodeLoreList);
            console.log(episodeLoreList);
        }

        getSeriesRequest();
    }, []);

    const userDocumentFav = currentUser ? doc(db, "User", currentUser.uid, "Favourites", "Episodes") : null;

    async function changeRating(newRating, name) {
        const starrating = { star_rating: newRating }
        Object.assign(episode, starrating);
        console.log(name);
        console.log(episode.name);

        await updateDoc(userDocumentFav, {
            [id + " " + episode.name]: episode
        });
    }

    return (
        <div>
            <div className="w-3/4 relative">
                <Link to={{
                    pathname: `/${id}/season-${seasonId}/episodes`,
                }}>
                    <div className=" bg-gradient-to-t via-transparent from-gray-900 h-full w-full absolute"></div>
                    <div className=" bg-gradient-to- via-transparent from-gray-900 h-full w-full absolute"></div>
                    <div className=" bg-gradient-to-l via-transparent from-gray-900 h-full w-full absolute"></div>
                    <div className=" bg-gradient-to-r via-transparent from-gray-900 h-full w-full absolute"></div>
                    <img src={`https://image.tmdb.org/t/p/original${episode.still_path}`} alt="" />
                </Link>
            </div>
            {currentUser && <StarRatings
                                    rating={5}
                                    starRatedColor="#f59e0b"
                                    numberOfStars={5}
                                    starDimension="24px"
                                    starSpacing="1px"
                                    changeRating={changeRating}
                                    name={seasonId}
                                    starHoverColor="#f59e0b"
                                />}
            <div className="text-white">
                <p>{episode.name}</p>
                <p>{episode.overview}</p>
            </div>
        </div>
    )
}

export default EpisodeLore;
