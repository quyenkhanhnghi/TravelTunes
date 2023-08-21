import React from 'react';

interface NavItemProps {
  link: string;
  text: string;
  icon: string;
  active?: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({
  link,
  text,
  icon,
  active,
}) => {
  return (
    <li className={`${active ? 'side-nav--active' : ''}`}>
      <a href={link}>
        <svg>
          <use xlinkHref={`/img/icons.svg#icon-${icon}`}></use>
        </svg>
        {text}
      </a>
    </li>
  );
};
