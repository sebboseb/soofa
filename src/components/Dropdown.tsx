//@ts-nocheck
import react, { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';

function Dropdown() {

    const [series, setSeries] = useState([]);
    const [query, setQuery] = useState("Succession");

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
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
        <Menu as="div" className="relative inline-block text-left z-10">
            <div>
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                    <input type="text" placeholder="Sök efter en serie" value={query} onChange={onChange} />
                    Search

                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href="#"
                                    className={classNames(
                                        active ? ' text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )}
                                >
                                    {
                                        //onClick upp med meny kolla starrating
                                        series.filter(Boolean).map((thingy, index) => (
                                            index < 4 &&
                                            <div className="hover:bg-gray-100">
                                                {thingy.poster_path && <Link to={{
                                                    pathname: `/series/${(thingy.name).replace(/\s/g, '-')}`,
                                                }}>
                                                    <div className="flex">
                                                        <li className="bg-black w-16 rounded mx-1 my-1 text-white">
                                                            <img className=" rounded" src={`https://image.tmdb.org/t/p/original${thingy.poster_path}`}></img>
                                                        </li>
                                                        <p>{thingy.name}</p>
                                                    </div>
                                                </Link>}
                                            </div>
                                        ))
                                    }
                                </a>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default Dropdown;
