import React from 'react';

function PetCard({ pet, onSelect }) {
  return (
    <div className='pet-card'>
      <img src={pet.imagen} alt={pet.nombre} style={{ width: '100px' }} />
      <h4>{pet.nombre}</h4>
      <p>Edad: {pet.edad}</p>
      <p>Tipo: {pet.tipo}</p>
      <button onClick={onSelect}>Seleccionar</button>
    </div>
  );
}

export default PetCard;
