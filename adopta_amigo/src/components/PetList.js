import React from 'react';
import PetCard from './PetCard';

function PetList({ pets, onSelectPet }) {
  return (
    <div>
      <h3>Mascotas disponibles</h3>
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} onSelect={() => onSelectPet(pet)} />
      ))}
    </div>
  );
}

export default PetList;
