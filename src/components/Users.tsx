//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { query, limit, collection, getDocs } from "firebase/firestore";
import { Link } from 'react-router-dom';

function Users() {

    const [users, setUsers] = useState([]);
    const [userQuery, setUserQuery] = useState([]);
    const [loadUsers, setLoadUsers] = useState([]);

    useEffect(() => {
        async function getUsers() {
            setUsers([]);
            const usersReference = collection(db, "User");
            const q = query(usersReference, limit(9));
            const qreturn = await getDocs(q);
            const followingMurloc = qreturn.docs.map(doc => doc.data());
            // setUsers(followingMurloc);

            followingMurloc.forEach(async murloc => {
                const qk = await db.collection('User').doc(murloc.Uid).collection("Favourites").doc("Series").collection(`ratings`).get();
                const qkn = qk.docs.map(doc => doc.data());
                // setFeed(prevFollowed => prevFollowed.concat(murlocdata));
                const neww = Object.assign(murloc, [qkn])
                console.log(neww);
                setUsers(prevFollowed => prevFollowed.concat([neww]).sort((b, c) => c[0].length - b[0].length));
                // setUsers([neww]); //inte i foreach
            });
        }

        console.log(users)
        getUsers();
    }, []);

    const onChange = async (e) => {
        e.preventDefault();

        setUserQuery(e.target.value);

        async function getQueryUsers() {
            setLoadUsers([]);
            db.collection("User").where("Username", "<=", e.target.value).where("Username", ">=", e.target.value).onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setLoadUsers(doc.data())
                    console.log(doc.data()); // For data inside doc
                    console.log(doc.id); // For doc name
                });
            });
        }

        await getQueryUsers();
        console.log("searched");
    }

    return (
        <>
            <div className=" w-screen flex flex-col items-center mt-24">
                <div>
                    <div className="flex flex-col items-center gap-y-5 text-white font-semibold">
                        <h1 className="text-3xl">Popular Users</h1>
                        <ul className="flex space-x-9 border-t border-white pt-3">
                            {users.map((thingy) =>
                                <li key={thingy.Uid}>
                                    <div className="flex">
                                        <Link to={`/${thingy.Username}`}>
                                            <div className="flex">
                                                <div className="bg-gradient-to-br from-transparent via-green-300 to-blue-200 rounded-full w-32 h-32"></div>
                                                <div>
                                                    <div to={`/${thingy.Username}`} className="ml-1 text-white font-semibold">{thingy.Username}</div>
                                                    <p className="ml-1 text-gray-300">{thingy[0].length} Series</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="">
                    <ul className="flex flex-col gap-y-3 mt-16">
                        {users.map((thingy) =>
                            <li key={thingy.Uid} className="border-b border-white pb-2 w-screen max-w-xl">
                                <div className="flex">
                                    <Link to={`/${thingy.Username}`}>
                                        <div className="flex">
                                            <div className="bg-gradient-to-br from-transparent via-green-300 to-blue-200 rounded-full w-12 h-12"></div>
                                            <div>
                                                <div to={`/${thingy.Username}`} className="ml-1 text-white font-semibold">{thingy.Username}</div>
                                                <Link to={`/${thingy.Username}/series`}><p className="ml-1 text-gray-300">{thingy[0].length} Series</p></Link>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <input className=" mt-44" type="text" value={userQuery} onChange={onChange} />
                {loadUsers.Username &&
                    <div className="flex">
                        <Link to={`/${loadUsers.Username}`}>
                            <div className="flex items-center gap-x-1 text-white font-semibold text-xl">
                                <div className="bg-gradient-to-br from-transparent via-green-300 to-blue-200 rounded-full w-12 h-12"></div>
                                <h1>{loadUsers.Username}</h1>
                                {/* <Link to={`/${loadUsers.Username}`} className="ml-1 text-white font-semibold">{loadUsers.Username}</Link> */}
                            </div>
                        </Link>
                    </div>
                }
        </>
    )
}

export default Users;