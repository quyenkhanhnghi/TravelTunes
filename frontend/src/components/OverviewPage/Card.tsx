import React from 'react';
import { Link } from 'react-router-dom';

export type CardDataType = {
  imageCover: string;
  name: string;
  slug: string;
  description: string;
  duration: number;
  difficulty: string;
  summary: string;
  locations: string;
  startLocation: { description: string };
  startDates: string;
  maxGroupSize: number;
  price: number;
  ratingsAverage: number;
  ratingsQuantity: number;
};

interface CardProps {
  cardData: CardDataType;
}

export const Card: React.FC<CardProps> = ({ cardData }) => {
  const dateStart = new Date(cardData.startDates[0]);
  const formattedDate = dateStart.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
  });
  return (
    <div className='card'>
      <div className='card__header'>
        <div className='card__picture'>
          <div className='card__picture-overlay'>&nbsp;</div>
          <img
            src={`/img/tours/${cardData.imageCover}`}
            alt='Tour 1'
            className='card__picture-img'
          />
        </div>

        <h3 className='heading-tertirary'>
          <span>{cardData.name}</span>
        </h3>
      </div>

      <div className='card__details'>
        <h4 className='card__sub-heading'>
          {cardData.difficulty} {cardData.duration}-day tour
        </h4>
        <p className='card__text'>{cardData.summary}</p>
        <div className='card__data'>
          <svg className='card__icon'>
            <use xlinkHref='img/icons.svg#icon-map-pin'></use>
          </svg>
          <span>{cardData.startLocation.description}</span>
        </div>
        <div className='card__data'>
          <svg className='card__icon'>
            <use xlinkHref='img/icons.svg#icon-calendar'></use>
          </svg>
          <span>{formattedDate}</span>
        </div>
        <div className='card__data'>
          <svg className='card__icon'>
            <use xlinkHref='img/icons.svg#icon-flag'></use>
          </svg>
          <span>{cardData.locations.length} stops</span>
        </div>
        <div className='card__data'>
          <svg className='card__icon'>
            <use xlinkHref='img/icons.svg#icon-user'></use>
          </svg>
          <span>{cardData.maxGroupSize} people</span>
        </div>
      </div>

      <div className='card__footer'>
        <p>
          <span className='card__footer-value'>${cardData.price}</span>
          <span className='card__footer-text'> per person</span>
        </p>
        <p className='card__ratings'>
          <span className='card__footer-value'>
            {cardData.ratingsAverage + ' '}
          </span>
          <span className='card__footer-text'>
            rating {' ' + cardData.ratingsQuantity}
          </span>
        </p>
        <Link
          to={`/tours/${cardData.slug}`}
          className='btn btn--green btn--small'
        >
          Details
        </Link>
      </div>
    </div>
  );
};
