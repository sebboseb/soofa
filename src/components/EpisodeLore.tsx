//@ts-nocheck
import React, { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Link, useParams } from 'react-router-dom';
import { getSearchRequest, getEpisodeRequest } from './utils/api';
import { db } from '../firebase';
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';

function EpisodeLore() {

    const { id, seasonId, episodeId } = useParams();

    const [episode, setEpisode] = useState([]);
    const [lolmurloc, setLolmurloc] = useState(0);

    const { currentUser } = useAuth();


    const [isInFavourites, setIsInFavourites] = useState(false);
    const [postId, setPostId] = useState(makeid(9));
    const [reviewInput, setReviewInput] = useState(false);
    const [reviewQuery, setQuery] = useState("");
    const [username, setUsername] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const seriesList = await getSearchRequest(id.replaceAll('-', ' '));
            const episodeLoreList = await getEpisodeRequest(seriesList[0].id, seasonId, episodeId);
            setEpisode(episodeLoreList);
            console.log(episodeLoreList);

            currentUser && db.collection("User").doc(currentUser.uid).collection("Favourites").doc("Episode").get().then(doc => {
                if (doc.data()) {
                    setIsInFavourites(true);
                    if (doc.data()[id.replaceAll('-', ' ') + " " + episodeLoreList.name]) {
                        if (doc.data()[id.replaceAll('-', ' ') + " " + episodeLoreList.name]["star_rating"]) {
                            console.log(doc.data()[id.replaceAll('-', ' ') + " " + episodeLoreList.name]["star_rating"]);
                            setLolmurloc(doc.data()[id.replaceAll('-', ' ') + " " + episodeLoreList.name]["star_rating"]);
                        }
                    }
                }
                else {
                    setIsInFavourites(false);
                    setLolmurloc(0);
                    console.log("lol");
                }
            });

            currentUser && db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
            });
        }

        getUsers();
    }, [currentUser, id, seasonId, episodeId]);

    const userDocumentFav = currentUser ? doc(db, "User", currentUser.uid, "Favourites", "Episode") : null;

    async function addEpisode(murlocEpisode, starrating) {
        setPostId(makeid(9));
        let date = Date().toLocaleLowerCase();
        let datelol = new Date();
        Object.assign(murlocEpisode, starrating, { dateseconds: datelol.getTime() / 360000 }, { user: username }, { date: date }, { seriesname: id.replaceAll('-', ' ') });
        const logRefMurlocMrrrglUpdate = currentUser ? doc(db, "Posts", currentUser.uid, "userPosts", "Logs", "logEpisode", postId) : null;
        await setDoc(logRefMurlocMrrrglUpdate, {
            review: murlocEpisode,
        });
    }

    async function addReviewEpisode(reviewText, starrating, murloc, episodeName) {
        setPostId(makeid(9));
        const reviewRefUpdated = doc(db, "Posts", "Reviews", "userPosts", id.replaceAll('-', ' ') + " " + episodeName, "post", postId);
        const reviewRefMurlocMrrrglUpdate = currentUser ? doc(db, "Posts", currentUser.uid, "userPosts", "Logs", "postEpisode", postId) : null
        let date = Date().toLocaleLowerCase();
        let datelol = new Date();
        Object.assign(murloc, { review: reviewText }, { star_rating: starrating }, { user: username }, { postId: postId }, { date: date }, { seriesname: id.replaceAll('-', ' ') }, { dateseconds: datelol.getTime() / 360000 });

        await setDoc(reviewRefUpdated, {
            user: username,
            review: reviewText,
            starrating: starrating,
            likes: [],
            comments: [],
            reviewId: postId,
            date: date,
            dateNumbers: datelol.getTime() / 360000,
            seriesname: id.replaceAll('-', ' '),
            // index: reviewsUpdate.filter(x => x.user === username).length.toString(), //index === reviews where(username == sebboseb).length + 1
        });

        await setDoc(reviewRefMurlocMrrrglUpdate, {
            review: murloc,
        });
    }

    async function changeRating(newRating, name) {
        setLolmurloc(newRating);
        Object.assign(episode, { star_rating: newRating });
        console.log(episode);
        if ((episode.name).includes(".")) {
            (episode.name) = (episode.name).replace(/\./g, '');
            console.log(episode.name);
        }

        if (isInFavourites) {
            await updateDoc(userDocumentFav, {
                [id.replaceAll('-', ' ') + " " + episode.name]:
                    episode,
            });
        } else {
            await setDoc(userDocumentFav, {
                [id.replaceAll('-', ' ') + " " + episode.name]:
                    episode,
            });
        }

        // await setDoc(starsRef, {

        // })
    }

    const onChange = (e) => {
        e.preventDefault();

        setQuery(e.target.value);
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

    return (
        <div>
            <div className="w-3/4 relative">
                <Link to={{
                    pathname: `/${id}/season-${seasonId}/episodes`,
                }}>
                    <div className=" bg-gradient-to-t via-transparent from-letterboxd-bg h-full w-full absolute"></div>
                    <div className=" bg-gradient-to- via-transparent from-letterboxd-bg h-full w-full absolute"></div>
                    <div className=" bg-gradient-to-l via-transparent from-letterboxd-bg h-full w-full absolute"></div>
                    <div className=" bg-gradient-to-r via-transparent from-letterboxd-bg h-full w-full absolute"></div>
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
                name={episodeId}
                starHoverColor="#f59e0b"
            />}
            <div className="flex space-x-1">
                <button className=" w-32 h-12 bg bg-green-500 rounded shadow hover:bg-green-600 dark:text-white font-semibold mt-2"
                    onClick={() => addEpisode(episode, { star_rating: lolmurloc })}
                >Logga</button>
                <div onClick={() => setReviewInput(!reviewInput)} className="bg-green-500 w-8 h-12 rounded shadow mt-2 cursor-pointer hover:bg-green-600">
                </div>
            </div>
            {reviewInput ?
                <div>
                    <input className=" absolute text-black" type="text" value={reviewQuery} onChange={onChange} />
                    <div onClick={() => addReviewEpisode(reviewQuery, lolmurloc, episode, episode.name)} className="bg-red-500 w-8 h-12 rounded shadow mt-2 cursor-pointer hover:bg-green-600 absolute">
                        <h1>Review</h1>
                    </div>
                </div> : null}
            <div className="text-white">
                <p>{episode.name}</p>
                <p>{episode.overview}</p>
            </div>
        </div>
    )
}

export default EpisodeLore;
