//@ts-nocheck

import React, { useState, useEffect } from 'react';
import { getPopularRequest } from './utils/api';
import { Link } from 'react-router-dom';


function Mainpage() {

    const [series, setSeries] = useState([]);

    useEffect(() => {
        async function getSeriesRequest() {
            const popularList = await getPopularRequest();
            setSeries(popularList);
            console.log(popularList);
        }

        getSeriesRequest();
    }, [])

    return (
        <>
            <div className="w-screen flex flex-col items-center">
                <div className=" max-w-5xl flex flex-col items-center">
                    <div className="w-full relative -mt-24">
                        <div className=" bg-gradient-to-t dark:via-transparent via-transparent dark:from-letterboxd-bg from-youtube-white-bg h-full w-full absolute"></div>
                        <div className=" bg-gradient-to- dark:via-transparent via-transparent dark:from-letterboxd-bg from-youtube-white-bg h-full w-full absolute"></div>
                        <div className=" bg-gradient-to-l dark:via-transparent via-transparent dark:from-letterboxd-bg from-youtube-white-bg h-full w-full absolute"></div>
                        <div className=" bg-gradient-to-r dark:via-transparent via-transparent dark:from-letterboxd-bg from-youtube-white-bg h-full w-full absolute"></div>
                        <img src={`https://image.tmdb.org/t/p/original/rcA17r3hfHtRrk3Xs3hXrgGeSGT.jpg`} alt="poster"></img>
                    </div>
                    <h1 className="dark:text-white font-semibold text-3xl p-16">Discover, log and discuss new series!</h1>
                    <div className="h-full flex">
                        <ul className="flex h-auto list-none">
                            {
                                series.map((thingy, index) => (
                                    index <= 9 &&
                                    <div>
                                        <Link to={`/series/${(thingy.name).replace(/\s/g, '-')}`}>
                                            {thingy.origin_country == 'US' &&
                                                <li className="bg-black w-44 mx-1 my-1">
                                                    <div className="relative">
                                                        <div className="hover:border-soofa-orange hover:border-4 rounded transform duration-150 w-full h-full absolute"></div>
                                                        <img
                                                            className="rounded border border-white"
                                                            src={`https://image.tmdb.org/t/p/original${thingy.poster_path}`}
                                                            alt={thingy.name}
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                </li>
                                            }
                                        </Link>
                                    </div>
                                ))}
                        </ul>
                    </div>
                    <div>
                        <div>
                            <ul className="grid grid-cols-3 gap-4 mt-16">
                                <li className="bg-soofa-orange w-64 h-32 rounded flex items-center justify-center"><h1 className="text-white font-semibold text-3xl">Track</h1></li>
                                <li className="bg-soofa-blue w-64 h-32 rounded flex items-center justify-center"><h1 className="text-white font-semibold text-3xl">Like</h1></li>
                                <li className="bg-soofa-orange w-64 h-32 rounded flex items-center justify-center"><h1 className="text-white font-semibold text-3xl">Review</h1></li>
                                <li className="bg-soofa-orange w-64 h-32 rounded flex items-center justify-center"><h1 className="text-white font-semibold text-3xl">Rate</h1></li>
                                <li className="bg-soofa-orange w-64 h-32 rounded flex items-center justify-center"><h1 className="text-white font-semibold text-3xl">Diary</h1></li>
                                <li className="bg-soofa-orange w-64 h-32 rounded flex items-center justify-center"><h1 className="text-white font-semibold text-3xl">List</h1></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Mainpage;