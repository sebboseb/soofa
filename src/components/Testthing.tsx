//@ts-nocheck

import React, { useState, useEffect } from 'react';
import { getSuccessionRequest, getSeasonsRequest } from './utils/api';
import Tilt from 'react-parallax-tilt';

function Testthing() {

    const [succession, setSuccession] = useState([]);
    const [season, setSeason] = useState([]);
    const seasonsLOL = [];

    useEffect(() => {
        async function getSeriesRequest() {
            const seriesList = await getSuccessionRequest(76331); //useparams id
            setSuccession(seriesList);

            console.log(succession);

            const seasonList = await getSeasonsRequest(76331);
            setSeason(seasonList);
        }

        getSeriesRequest();
    }, [])


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
            <div className=" w-screen flex justify-center">
                <div className=" w-full max-w-6xl h-screen bg-white flex">
                    <div className="flex flex-col items-center">
                        <img src={`https://image.tmdb.org/t/p/original${succession.backdrop_path}`} className=" h-96 w-3/4"></img>
                        <div className="flex">
                            <img src={`https://image.tmdb.org/t/p/original${succession.poster_path}`} className="w-44 h-72"></img>
                            <div className="flex flex-col">
                                <h1>{succession.name}</h1>
                                <p>{succession.overview}</p>
                            </div>
                        </div>
                            <ul className=" list-none flex">
                                {seasonsLOL}
                            </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Testthing;