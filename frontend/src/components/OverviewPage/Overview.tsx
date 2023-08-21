import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { Card, CardDataType } from './Card';
import { CardContainer } from './CardContainer';
import { Helmet, HelmetProvider } from 'react-helmet-async';

export const Overview: React.FC = () => {
  const data = useLoaderData() as { data: CardDataType[] };
  return (
    <HelmetProvider>
      <Helmet>
        <title>Natours | Exciting tours for adventurous people</title>
      </Helmet>
      {data !== null ? (
        <CardContainer>
          {data.data.map((card) => (
            <Card key={card.name} cardData={card} />
          ))}
        </CardContainer>
      ) : null}
    </HelmetProvider>
  );
};
