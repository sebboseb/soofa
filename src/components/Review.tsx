import React from 'react';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

function Review(props: any) {
    return (
        <li key="1" className="flex space-x-4 mb-4 rounded dark:shadow justify-between">
            <div>
                <div className="flex"><span>Review by</span>&nbsp;<Link to={`/${props.user}`}>{props.user}</Link>&nbsp;
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
                <h1>{props.review}</h1>
            </div>
        </li>

    )
}

export default Review;
