import React from 'react';
// FC for PictureBox
interface PictureBoxProps {
  img: string;
  i: number;
  tourName: string;
}

export const PictureBox: React.FC<PictureBoxProps> = ({ img, i, tourName }) => {
  return (
    <div className='picture-box'>
      <img
        className={`picture-box__img picture-box__img--${i + 1}`}
        src={`/img/tours/${img}`}
        alt={`${tourName} Tour ${i + 1}`}
      />
    </div>
  );
};
