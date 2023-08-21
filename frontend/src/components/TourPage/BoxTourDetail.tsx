import React from 'react';
// FC for Box Tour Detail Fact
interface BoxTourDetailProps {
  label: string;
  text: string;
  icon: string;
}

export const BoxTourDetail: React.FC<BoxTourDetailProps> = ({
  label,
  text,
  icon,
}) => {
  return (
    <div className='overview-box__detail'>
      <svg className='overview-box__icon'>
        <use xlinkHref={`/img/icons.svg#icon-${icon}`}></use>
      </svg>
      <span className='overview-box__label'>{label}</span>
      <span className='overview-box__text'>{text}</span>
    </div>
  );
};
