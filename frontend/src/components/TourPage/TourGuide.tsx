import React from 'react';
import { TourGuideType } from './TourDetail';
// FC for Tour Guides

interface TourGuideProps {
  guide: TourGuideType;
}

export const TourGuide: React.FC<TourGuideProps> = ({ guide }) => {
  return (
    <div className='overview-box__detail'>
      <img
        src={`/img/users/${guide.photo}`}
        alt='Lead guide'
        className='overview-box__img'
      />
      {guide.role === 'lead-guide' ? (
        <span className='overview-box__label'>Lead guide</span>
      ) : (
        <span className='overview-box__label'>Tour guide</span>
      )}
      <span className='overview-box__text'>{guide.name}</span>
    </div>
  );
};
