import React, { useEffect, useState } from 'react';
import { login } from '../../services/fetch';
import { default as errorLogo } from './error-login.svg';
import { AuthContext, ContextType } from '../../context/Provider/AuthProvider';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface LoginProps {}

export const Login: React.FC<LoginProps> = ({}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // const { state, dispatch } = React.useContext(AuthContext) as ContextType;
  const { auth, dispatchAuth } = useAuth() as ContextType;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login(email, password);
      // Handle successful login response here
      console.log('Login successful:', res);

      if (!auth.user) {
        dispatchAuth({
          type: 'logging',
          payload: { user: res.data.user, accessToken: res.accessToken },
        });
      }

      // Reset the form
      setEmail('');
      setPassword('');
      setError('');
      navigate(from, { replace: true });
    } catch (err) {
      // Handle login error here
      console.log('Login error:', err.response.data);
      setEmail('');
      setPassword('');
      setError('Please provide a valid email and password');
    }
  };

  // useEffect(() => {
  //   // Check login status when the component loads
  //   // const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  //   const loggedInUser = localStorage.getItem('user');
  //   if (loggedInUser) {
  //     setUser(loggedInUser);
  //   }
  // }, []);

  return (
    <main className='main'>
      <div className='login-form'>
        <h2 className='heading-secondary ma-bt-lg'>Log into your account</h2>
        <form className='form' onSubmit={handleSubmit}>
          <div className='form__group'>
            <label className='form__label' htmlFor='email'>
              Email address
            </label>
            <input
              id='email'
              className='form__input'
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className='form__group ma-bt-md'>
            <label className='form__label' htmlFor='password'>
              Password
            </label>
            <input
              id='password'
              className='form__input'
              type='password'
              placeholder='••••••••'
              value={password}
              onChange={handlePasswordChange}
              required
              minLength='8'
            />
          </div>
          {error && (
            <div className='error-login-background' style={{ display: 'flex' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={errorLogo}
                  style={{ height: '20px', marginRight: '20px' }}
                />
              </div>
              <div className='error-login'>{error}</div>
            </div>
          )}
          <div className='form__group'>
            <button className='btn btn--green'>Login</button>
          </div>
        </form>
      </div>
    </main>
  );
};
