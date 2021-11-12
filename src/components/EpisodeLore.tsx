//@ts-nocheck
import React, { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Link, useParams } from 'react-router-dom';
import { getSearchRequest, getEpisodeRequest } from './utils/api';
import { db } from '../firebase';
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';

function EpisodeLore() {

    const { id, seasonId, episodeId } = useParams();

    const [episode, setEpisode] = useState([]);
    const [lolmurloc, setLolmurloc] = useState(0);

    const { currentUser } = useAuth();

    useEffect(() => {
        const getUsers = async () => {
            const seriesList = await getSearchRequest(id.replaceAll('-', ' '));
            const episodeLoreList = await getEpisodeRequest(seriesList[0].id, seasonId, episodeId);
            setEpisode(episodeLoreList);
            console.log(episodeLoreList);

            db.collection("User").doc(currentUser.uid).collection("Favourites").doc("Episodes").get().then(doc => {
                if (doc.data()) {
                    // setIsInFavourites(true);
                    if (doc.data()[id.replaceAll('-', ' ') + " " + episodeLoreList.name]) {
                        if (doc.data()[id.replaceAll('-', ' ') + " " + episodeLoreList.name]["star_rating"]) {
                            console.log(doc.data()[id.replaceAll('-', ' ') + " " + episodeLoreList.name]["star_rating"]);
                            setLolmurloc(doc.data()[id.replaceAll('-', ' ') + " " + episodeLoreList.name]["star_rating"]);
                        }
                    }
                }
                else {
                    // setIsInFavourites(false);
                    setLolmurloc(0);
                    console.log("lol");
                }
            });
        }

  

        currentUser && getUsers();
    }, [currentUser, id, seasonId, episodeId]);

    const userDocumentFav = currentUser ? doc(db, "User", currentUser.uid, "Favourites", "Episodes") : null;

    async function changeRating(newRating, name) {
        const starrating = { star_rating: newRating }
        Object.assign(episode, starrating);
        console.log(name);
        console.log(episode.name);
        setLolmurloc(newRating);

        await updateDoc(userDocumentFav, {
            [id.replaceAll('-', ' ') + " " + episode.name]: episode
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
                                    rating={lolmurloc}
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
