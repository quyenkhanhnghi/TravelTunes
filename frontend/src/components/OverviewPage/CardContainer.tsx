import React from "react";

interface CardContainerProps {
  children: JSX.Element[];
}

export const CardContainer: React.FC<CardContainerProps> = ({ children }) => {
  return (
    <main className="main">
      <div className="card-container">{children}</div>
    </main>
  );
};
