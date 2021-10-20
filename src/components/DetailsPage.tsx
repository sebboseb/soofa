// @ts-nocheck

import React, {useState, useEffect} from 'react';
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom';

function DetailsPage() {



    const [episodes, setEpisodes] = useState([]);
    const [seasonNr, setSeasonNr] = useState(6);

    useEffect(() => {

        const getSeriesRequest = async () => {
            const urlSolo = `https://api.themoviedb.org/3/tv/87362/season/${seasonNr}?api_key=e333684dcb3e9eac6a70505572519a23&language=en-US`;
            const responseSolo = await fetch(urlSolo);
            const responseSoloJson = await responseSolo.json();
            console.log(responseSoloJson);
            console.log(responseSoloJson.episodes);
            console.log(responseSoloJson.episodes[0].guest_stars[2].name);

            console.log(responseSoloJson.episodes[0].guest_stars.length);

            setEpisodes(responseSoloJson.episodes);
        }

        getSeriesRequest();
    }, []);


    return (
        <>
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
                                        <li className="bg-white text-black w-72 p-4 h-44 rounded shadow mx-1 my-1 flex flex-col" key={index} onClick={() => addEpisode(episodes[index])}>
                                            <div className="flex justify-between">
                                                <div>
                                                    <ul>
                                                        <h1 className="font-medium">{episode.name}</h1>

                                                        <div className="flex flex-col justify-between h-32">


                                                            <div className="ml-2 leading-5">
                                                                <li>{episodes[index].guest_stars[0].name}</li>
                                                                <li>{episodes[index].guest_stars[1].name}</li>
                                                                <li>{episodes[index].guest_stars[2].name}</li>
                                                                <li>{episodes[index].guest_stars[3].name}</li>
                                                            </div>
                                                            <div className=" ml-1">
                                                                <StarRatings rating={4.5} starDimension="20px" starSpacing="1px" starRatedColor="#F59E0B" />
                                                            </div>
                                                        </div>
                                                    </ul>
                                                </div>
                                                <img className=" w-24 justify-end" src={episodes[index].still_path !== null ? (`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${episodes[index].still_path}`) : ("https://www.themoviedb.org/t/p/w440_and_h660_face/2FWF65jBENpITVB2NytRk9AR7jN.jpg")} alt="" />
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
