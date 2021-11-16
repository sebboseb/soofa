//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getLolRequest, getSearchPersonRequest } from './utils/api';
import { Link } from 'react-router-dom';

function Person() {

    const { knownforId, actorId } = useParams();

    const [person, setPerson] = useState([]);
    const [profile, setProfile] = useState([]);

    useEffect(() => {
        async function getSeriesRequest() {
            const personId = await getSearchPersonRequest(actorId.replaceAll('-', ' '));
            setProfile(personId[0]);
            console.log(personId[0]);


            const fuck = await getLolRequest(personId[0].id);
            setPerson(fuck);
            console.log(fuck);
        }

        getSeriesRequest();
    }, [actorId])

    return (
        <>
            <div className="text-white">
                <p>{profile.name}</p>
                <div className="flex">
                    <img className="w-44" src={`https://image.tmdb.org/t/p/original${profile.profile_path}`} alt="" />
                    {/* <p>{person.overview}</p> */}
                </div>
            </div>
            {
                <ul className="flex">
                    {profile.known_for && profile.known_for.map((knownfor) => (
                        <div className="p-1">
                            <Link to={{
                                pathname: `/series/${(knownfor.name).replace(/\s/g, '-')}`,
                            }}>
                                <img className=" w-44" src={`https://image.tmdb.org/t/p/original${knownfor.poster_path}`} alt="" />
                                <p className="text-white">{knownfor.name}</p>
                            </Link>
                        </div>
                    ))}
                </ul>
            }
            <div className="flex flex-wrap">
                {
                    person.filter(Boolean).map((thingy, index) => (
                        thingy.poster_path &&
                        <div className="p-1 flex flex-col items-center">
                            <Link to={{
                                pathname: `/series/${(thingy.name).replace(/\s/g, '-')}`,
                            }}>
                                <img className=" w-44" src={`https://image.tmdb.org/t/p/original${thingy.poster_path}`} alt="" />
                                <p className="text-white">{thingy.name}</p>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Person;