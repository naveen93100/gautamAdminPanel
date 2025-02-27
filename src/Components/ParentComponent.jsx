import React, { useState } from "react";
import Card from "./Card";
import CardDetails from "./CardDetails";

const ParentComponent = ({ cards }) => {
  const [openCardId, setOpenCardId] = useState(null);

  const handleOpenCardDetails = (cardId) => {
    setOpenCardId(cardId);
  };

  return (
    <div>
      {/* Render your list of cards */}
      {cards.map((card) => (
        <Card
          key={card._id}
          _id={card._id}
          imageURL={card.imageURL}
          title={card.title}
          description={card.description}
          date={card.date}
          header={card.header}
          isOpen={openCardId === card._id}
          onHeaderClick={() => handleOpenCardDetails(card._id)}
        />
      ))}
      {/* Render the CardDetails if openCardId is not null */}
      {openCardId && (
        <CardDetails
          header={cards.find((card) => card._id === openCardId).header}
          title={cards.find((card) => card._id === openCardId).title}
          date={cards.find((card) => card._id === openCardId).date}
          imageURL={cards.find((card) => card._id === openCardId).imageURL}
          description={cards.find((card) => card._id === openCardId).description}
        />
      )}
    </div>
  );
};

export default ParentComponent;
