import React from 'react';
import { ReviewCardType } from './TourDetail';
// FC for ReviewCard
interface ReviewCardProps {
  review: ReviewCardType;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { user } = review;

  const activeClass = 'reviews__star reviews__star--active';
  const inactiveClass = 'reviews__star reviews__star--inactive';
  return (
    <div className='reviews__card'>
      <div className='reviews__avatar'>
        <img
          src={`/img/users/${user.photo}`}
          alt={user.name}
          className='reviews__avatar-img'
        />
        <h6 className='reviews__user'>{user.name}</h6>
      </div>
      <p className='reviews__text'>{review.review}</p>
      <div className='reviews__rating'>
        <svg className={review.rating > 0 ? activeClass : inactiveClass}>
          <use xlinkHref='/img/icons.svg#icon-star'></use>
        </svg>
        <svg className={review.rating > 1 ? activeClass : inactiveClass}>
          <use xlinkHref='/img/icons.svg#icon-star'></use>
        </svg>
        <svg className={review.rating > 2 ? activeClass : inactiveClass}>
          <use xlinkHref='/img/icons.svg#icon-star'></use>
        </svg>
        <svg className={review.rating > 3 ? activeClass : inactiveClass}>
          <use xlinkHref='/img/icons.svg#icon-star'></use>
        </svg>
        <svg className={review.rating > 3 ? activeClass : inactiveClass}>
          <use xlinkHref='/img/icons.svg#icon-star'></use>
        </svg>
      </div>
    </div>
  );
};
