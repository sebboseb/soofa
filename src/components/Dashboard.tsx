// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, addDoc, arrayUnion, deleteDoc, deleteField, getDoc } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import Navbar from './Navbar';
import Tilt from 'react-parallax-tilt';
import StarRatings from 'react-star-ratings';
import { getEpisodesRequest, getPopularRequest, getSearchRequest, getSeasonsRequest } from './utils/api';

function Dashboard() {

    const { currentUser } = useAuth();
    const [addCard, setAddCard] = useState(20);
    const [series, setSeries] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [lol, setLol] = useState(1);
    const items = [];
    const [username, setUsername] = useState("");
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
    const [claimed, setClaimed] = useState([]);
    const [murlocWarleader, setMurlocWarleader] = useState([]);
    const [thisRating, setThisRating] = useState(0);

    useEffect(() => {
        const getUsers = async () => {
            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
                setFavourites([doc.data().Favourites]);
            });

            const docRef = doc(db, "User", currentUser.uid, "Favourites", "Series");
            const docSnap = await getDoc(docRef);
            let mapData = Object.values(docSnap.data());
            setMurlocWarleader(mapData);

            if (docSnap.exists()) {
                console.log("Document data:", mapData[0]);
                setClaimed(mapData);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }

            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
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

        getStars("Succession");
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

    async function changeRating(newRating, name) {
        const starrating = { star_rating: newRating }
        Object.assign(murlocWarleader[name], starrating);
        console.log(name);
        console.log(murlocWarleader[name].name);

        await updateDoc(userDocumentFav, {
            [murlocWarleader[name].name]: murlocWarleader[name]
        });
    }

     async function getStars(coldlight) {
        let bagurgle = 0;
        const docRef = doc(db, "User", currentUser.uid, "Favourites", "Series");
        const docSnap = await getDoc(docRef);
        if (docSnap.data()[coldlight]) {
            bagurgle = await (docSnap.data()[coldlight]["star_rating"]);
        }
        else {
            console.log("lol");
            bagurgle = 0;
        }
        setThisRating(bagurgle);
    }

    function inteAsync() {
        
    }

    for (let i = 1; i <= 20; i++) {
        // {getStars((series[i - 1].name))}
        // {console.log(thisRating)}
        items.push(
            //w16h24
            series[i - 1] &&
            <div><Link key={makeid(5)} to={{
                pathname: `/series/${(series[i - 1].name).replace(/\s/g, '-')}`,
                ///${season[i - 1].name.replace(/\s/g, '-')}
                // state: {
                //     seriesid: mainId,
                //     seasonNumber: season[i - 1].season_number,
                //     seriesPoster: season[i - 1].poster_path
                // }
            }}>
                {/* <Link to={{
                pathname: '/detailspage',
                state: {
                  coldlight: "oracle",
                  tide: "hunter",
                  id: series[i - 1].id,
                }
              }}> */}
                {/* <div key={makeid(5)} onClick={() => {
                addEpisode(series[i - 1], { star_rating: starlol });
            }
            }> */}
                <Tilt tiltEnable={false} glareEnable={true} className=" cursor-pointer" tiltReverse={true} scale={1.05}>
                    <li className="bg-black w-44 h-66 rounded mx-1 my-1 text-white">
                        <img src={`https://image.tmdb.org/t/p/original${series[i - 1].poster_path}`}></img>
                        <p className="text-center font-bold">{series[i - 1].name}</p>
                    </li>
                </Tilt>

                {/* </div> */}
                {/* `https://image.tmdb.org/t/p/original${series[i - 1].poster_path}`
            
             </Link> */}
            </Link>
                {/* <StarRatings
                    rating={
                        {thisRating}
                        // 5
                    }
                    starRatedColor="#f59e0b"
                    numberOfStars={5}
                    starDimension="24px"
                    starSpacing="1px"
                    // changeRating={getStars}
                    name={series[i - 1].name}
                    starHoverColor="#f59e0b"
                /> */}
                <p>{thisRating}</p>
                <div onClick={() => getStars(series[i - 1].name)}>mrrrrrrrrgl</div>
            </div>
        )
    }

    // for (let i = 1; i <= 20; i++) {
    //     seasonsLOL.push(
    //         //w16h24
    //         season[i - 1] &&
    //         <Link key={makeid(5)} to={{
    //             pathname: `/series/${(seriesName).replace(/\s/g, '-')}`,
    //             ///${season[i - 1].name.replace(/\s/g, '-')}
    //             // state: {
    //             //     seriesid: mainId,
    //             //     seasonNumber: season[i - 1].season_number,
    //             //     seriesPoster: season[i - 1].poster_path
    //             // }
    //         }}>
    //             <div onClick={() => { addSeason(season[i - 1], { star_rating: starlol }); }}>
    //                 <Tilt tiltEnable={false} glareEnable={true} className=" cursor-pointer" tiltReverse={true} scale={1.05}>
    //                     <li className="bg-black w-44 h-66 rounded mx-1 my-1 text-white">
    //                         <img src={`https://image.tmdb.org/t/p/original${season[i - 1].poster_path}`}></img>
    //                         <p className="text-center font-bold">{season[i - 1].name}</p>
    //                     </li>
    //                 </Tilt>
    //             </div>
    //             {/* `https://image.tmdb.org/t/p/original${season[i - 1].poster_path}` */}
    //         </Link>
    //     )
    // }

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

    // Promise.all(
    //     series.filter(Boolean).map((thingy) => getStars(thingy.name))
    //   ).then((starThingies) => {
    //     setThisRating(starThingies)
    //   })

    return (
        <>
            <Navbar username={username}></Navbar>
            <div className=" w-screen flex justify-center relative">
                <div className=" w-full max-w-6xl h-auto min-h-screen bg-gray-700 flex justify-center">
                    <div className=" mt-36 flex w-auto flex-col space-y-8 items-center">
                        <span onClick={() => {{getStars("Succession")} {console.log(thisRating)}}}><h1 className="text-white mt-16 font-semibold text-xl">Welcome back {username} here is what your friends have been watching</h1></span>
                        <input type="text" placeholder="Sök efter en serie" value={query} onChange={onChange} />
                        <div className="flex mt-16 space-x-4">

                        </div>
                        {/* {addCard !== 0 ?
                            <ul className="flex flex-wrap list-none pt-2 pb-2 justify-center">
                                {items}
                            </ul>
                            : null} */}
                            <ul className="flex flex-wrap list-none pt-2 pb-2 justify-center">
                            {
                                //onClick upp med meny kolla starrating
  series.filter(Boolean).map((thingy, index) => (
    <div>
        <Link key={makeid(5)} to={{
                pathname: `/series/${(thingy.name).replace(/\s/g, '-')}`,
                ///${season[i - 1].name.replace(/\s/g, '-')}
                // state: {
                //     seriesid: mainId,
                //     seasonNumber: season[i - 1].season_number,
                //     seriesPoster: season[i - 1].poster_path
                // }
            }}>
        
      <li className="bg-black w-52 rounded mx-1 my-1 text-white">
        <img className="" src={`https://image.tmdb.org/t/p/original${series[index].poster_path}`}></img>
      </li>
      </Link>
    </div>
  ))
}
</ul></div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;
