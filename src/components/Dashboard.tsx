// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { useAuth } from './contexts/AuthContext';
import { getPopularRequest } from './utils/api';

function Dashboard() {

    const { currentUser } = useAuth();
    const [series, setSeries] = useState([]);
    const [username, setUsername] = useState("");

    const { pageId } = useParams();

    const maxPage = parseInt(pageId) * 3;

    useEffect(() => {
        setSeries([]);
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
            if (parseInt(pageId) === 1) {
                for (let i = parseInt(pageId); i < maxPage; i++) {
                    const popularList = await getPopularRequest(i);
                    setSeries(prevFollowed => prevFollowed.concat(popularList));
                    console.log(popularList);

                    // console.log(i + "i");
                    // console.log(pageId + "pageId");
                    // console.log(maxPage + "maxPage");
                }
            } else {
                for (let i = parseInt(pageId) * 3; i < maxPage + 2; i++) {
                    const popularList = await getPopularRequest(i);
                    setSeries(prevFollowed => prevFollowed.concat(popularList));
                    console.log(popularList);

                    // console.log(i + "i");
                    // console.log(pageId + "pageId");
                    // console.log(maxPage + "maxPage");
                }
            }
        }

        currentUser && getUsers();
        getSeriesRequest();
    }, [currentUser, pageId, maxPage]);

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
        <>
            <div className=" w-screen flex justify-center relative">
                <div className=" w-full max-w-6xl h-auto min-h-screen bg-letterboxd-bg flex justify-center">
                    <div className=" mt-36 flex max-w-4xl flex-col items-center">
                        <div className="border-white border-b w-screen max-w-full text-center pb-3">
                            <h1 className="text-white mt-16 font-semibold text-xl">Welcome back&nbsp;
                                <Link to={`/${username}`}>
                                    {username}
                                </Link> here is what's popular this week</h1>
                        </div>
                        <ul className="flex flex-wrap list-none justify-center mt-3 border-white border-b pb-3">
                            {
                                //onClick upp med meny kolla starrating
                                series.filter(Boolean).map((thingy, index) => (
                                    // thingy &&
                                    <div>
                                        {
                                            // thingy.origin_country == 'US' ?
                                            <Link key={makeid(5)} to={`/series/${(thingy.name).replace(/\s/g, '-')}`}>
                                                <li className="bg-black w-24 rounded m-1 text-white border border-white">
                                                    <img className="" src={thingy.poster_path !== null ? `https://image.tmdb.org/t/p/original${thingy.poster_path}` : `https://a.ltrbxd.com/resized/sm/upload/cl/dn/kr/f1/4C9LHDxMsoYI0S3iMPZdm3Oevwo-0-230-0-345-crop.jpg?k=ad899f40ce`} alt={thingy.name}></img>
                                                </li>
                                            </Link>
                                            //  : null
                                        }
                                    </div>
                                ))
                            }
                        </ul>
                        <div className="flex flex-row-reverse gap-1">
                            <Link to={`/dashboard/page/${parseInt(pageId) + 1}`} className="w-20 h-10 bg-soofa-orange rounded"><h1 className="p-1 text-xs font-semibold text-white mt-2 text-center">Next</h1></Link>
                            {parseInt(pageId) !== 1 && <Link to={`/dashboard/page/${parseInt(pageId) - 1}`} className="w-20 h-10 bg-soofa-orange rounded"><h1 className="p-1 text-xs font-semibold text-white mt-2 text-center">Previous</h1></Link>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;