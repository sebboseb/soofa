//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { query, limit, collection, orderBy, getDocs } from "firebase/firestore";
import { Link } from 'react-router-dom';

function Users() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function getUsers() {
            const usersReference = collection(db, "User");
            const q = query(usersReference, limit(9));
            const qreturn = await getDocs(q)
            const followingMurloc = qreturn.docs.map(doc => doc.data());
            setUsers(followingMurloc);
        }

        getUsers();
    }, []);

    return (
        <>
            <ul className="flex flex-col space-y-4">
                {users.map((thingy) =>
                    <li>
                        <div className="flex">
                            <Link to={`/${thingy.Username}`} className="bg-gradient-to-br from-transparent via-green-300 to-blue-200 rounded-full w-12 h-12"></Link>
                            <div>
                                <Link to={`/${thingy.Username}`} className="ml-1 text-white font-semibold">{thingy.Username}</Link>
                                <p className="ml-1 text-gray-300">n reviews</p>
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </>
    )
}

export default Users;