import React from 'react';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

function Review(props: any) {
    return (
        <li key="1" className="flex space-x-4 mb-4 rounded dark:shadow justify-between">
            <Link to={`/${props.user}`} className="bg-gradient-to-br from-transparent via-green-300 to-blue-200 rounded-full w-12 h-12"></Link>
            <div>
                <div className="flex"><span><Link to ={`/${props.user}/${props.series}/${props.reviewIndex}/`}>Review by</Link></span>&nbsp;<Link to={`/${props.user}`}>{props.user}</Link>&nbsp;
                <div className=" -top-0.5 relative">
                    <StarRatings
                        rating={props.stars}
                        starRatedColor="#f59e0b"
                        numberOfStars={5}
                        starDimension="19px"
                        starSpacing="1px"
                        name="rating"
                        starHoverColor="#f59e0b"
                    />
                    </div>
                </div>
                <h1>{props.review}</h1>
            </div>
        </li>

    )
}

export default Review;
