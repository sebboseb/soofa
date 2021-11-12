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
                <div className="w-3/4 relative">
                    <div className=" bg-gradient-to-t via-transparent from-gray-900 h-full w-full absolute"></div>
                    <div className=" bg-gradient-to- via-transparent from-gray-900 h-full w-full absolute"></div>
                    <div className=" bg-gradient-to-l via-transparent from-gray-900 h-full w-full absolute"></div>
                    <div className=" bg-gradient-to-r via-transparent from-gray-900 h-full w-full absolute"></div>
                    <img src={`https://image.tmdb.org/t/p/original/rcA17r3hfHtRrk3Xs3hXrgGeSGT.jpg`} alt="poster"></img>
                </div>
                <h1 className="text-white font-semibold text-3xl p-16">Discover, log and discuss new series!</h1>
                <div className="h-full flex">
                    <ul className="w-3/4 flex h-auto list-none">
                        {series.map((thingy, index) => (
                            index <= 9 &&
                            <Link to={{
                                pathname: `/series/${(thingy.name).replace(/\s/g, '-')}`,
                            }}>
                                {thingy.origin_country == 'US' &&
                                    <li className="bg-black w-44 rounded mx-1 my-1 text-white">
                                        <img
                                            src={`https://image.tmdb.org/t/p/original${thingy.poster_path}`}
                                            srcSet={`https://image.tmdb.org/t/p/original${thingy.poster_path}`}
                                            alt={thingy.name}
                                            loading="lazy"
                                        />
                                    </li>}
                            </Link>
                        ))}</ul></div>
            </div>
        </>
    )
}

export default Mainpage;