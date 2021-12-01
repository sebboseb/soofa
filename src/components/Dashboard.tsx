// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { useAuth } from './contexts/AuthContext';

import Tilt from 'react-parallax-tilt';

import { getYearRequest } from './utils/api';

function Dashboard() {

    const { currentUser } = useAuth();
    const [series, setSeries] = useState([]);
    const items = [];
    const [username, setUsername] = useState("");
    const [query, setQuery] = useState("Succession");

    useEffect(() => {
        const getUsers = async () => {
            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
                // setFavourites([doc.data().Favourites]);
            });

            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
            });
        }

        async function getSeriesRequest() {
            const popularList = await getYearRequest();
            setSeries(popularList);
            console.log(popularList);
        }

        currentUser && getUsers();
        getSeriesRequest();
    }, [currentUser]);

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

    for (let i = 1; i <= 20; i++) {
        // {getStars((series[i - 1].name))}
        // {console.log(thisRating)}
        items.push(
            //w16h24
            series[i - 1] &&
            <div><Link key={makeid(5)} to={{
                pathname: `/series/${(series[i - 1].name).replace(/\s/g, '-')}`,
            }}>
              
                <Tilt tiltEnable={false} glareEnable={true} className=" cursor-pointer" tiltReverse={true} scale={1.05}>
                    <li className="bg-black w-44 h-66 rounded mx-1 my-1 text-white">
                        <img src={`https://image.tmdb.org/t/p/original${series[i - 1].poster_path}`} alt={series[i - 1].name}></img>
                        <p className="text-center font-bold">{series[i - 1].name}</p>
                    </li>
                </Tilt>
            </Link>
            </div>
        )
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

    return (
        <>
            <div className=" w-screen flex justify-center relative">
                <div className=" w-full max-w-6xl h-auto min-h-screen bg-gray-700 flex justify-center">
                    <div className=" mt-36 flex w-auto flex-col space-y-8 items-center">
                        <span 
                        ><h1 className="text-white mt-16 font-semibold text-xl">Welcome back <Link to={{
                            pathname: `/${username}`,
                        }}>{username}</Link> here is what your friends have been watching</h1></span>
                        <input type="text" placeholder="Sök efter en serie" value={query} onChange={onChange} />
                        <div className="flex mt-16 space-x-4">

                        </div>
                        <ul className="flex flex-wrap list-none pt-2 pb-2 justify-center">
                            {
                                //onClick upp med meny kolla starrating
                                series.filter(Boolean).map((thingy, index) => (
                                    thingy.poster_path &&
                                    <div>
                                        {thingy.origin_country == 'US' ?
                                        <Link key={makeid(5)} to={{
                                            pathname: `/series/${(thingy.name).replace(/\s/g, '-')}`,
                                        }}>

                                            <li className="bg-black w-52 rounded mx-1 my-1 text-white">
                                                <img className="" src={`https://image.tmdb.org/t/p/original${thingy.poster_path}`} alt={thingy.name}></img>
                                            </li>
                                        </Link> : null}
                                    </div>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;