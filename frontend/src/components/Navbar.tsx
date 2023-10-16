import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ContextType } from '../context/Provider/AuthProvider';
import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogOut';

export const Navbar: React.FC = () => {
  // const [user, setUser] = useState('');
  // useEffect(() => {
  //   // Check login status when the component loads
  //   const loggedInUser = localStorage.getItem('user');
  //   if (loggedInUser) {
  //     setUser(JSON.parse(loggedInUser));
  //   }
  // }, []);
  // const { state } = useContext(AuthContext) as ContextType;
  const { auth } = useAuth() as ContextType;
  const user = auth.user;
  const navigate = useNavigate();
  const signOut = useLogout();

  const useSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className='header'>
      <nav className='nav nav--tours'>
        <Link to='/' className='nav__el'>
          All tours
        </Link>
        <form className='nav__search'>
          <button className='nav__search-btn'>
            <svg>
              <use xlinkHref='/img/icons.svg#icon-search'></use>
            </svg>
          </button>
          <input
            type='text'
            placeholder='Search tours'
            className='nav__search-input'
          />
        </form>
      </nav>
      <div className='header__logo'>
        <img src='/img/logo-white.png' alt='Natours logo' />
      </div>
      <nav className='nav nav--user'>
        {/* <a href='#' className='nav__el'>
          My bookings
        </a> */}
        {user ? (
          <>
            {/* <a href='/login' className='nav__el nal__el--logout'>
              Logout
            </a> */}
            <button onClick={useSignOut} className='nav__el nal__el--logout'>
              Logout
            </button>
            <a href='/account' className='nav__el'>
              <img
                src={`/img/users/${user.photo}`}
                alt='User photo'
                className='nav__user-img'
              />
              <span>{user.name}</span>
            </a>
          </>
        ) : (
          <>
            <Link to='/login' style={{ paddingRight: '20px' }}>
              <button className='nav__el'>Log in</button>
            </Link>
            <button className='nav__el nav__el--cta'>Sign up</button>
          </>
        )}
      </nav>
    </header>
  );
};
