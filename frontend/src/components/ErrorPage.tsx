import React from 'react';
import { useRouteError } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
  const error = useRouteError();
  console.log(error);
  return (
    <main className='main'>
      <div className='error'>
        <div className='error__title'>
          <h2 className='heading-secondary heading-secondary--error'>
            Uh oh! Something went wrong!
          </h2>
          <h2 className='error__emoji'>😢 🤯</h2>
        </div>
        <div className='error__msg'>Page not found!</div>
      </div>
    </main>
  );
};
