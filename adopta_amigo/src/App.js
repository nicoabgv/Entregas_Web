import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PetList from './components/PetList';
import AdoptionForm from './components/AdoptionForm';
import './App.css';

function App() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filters, setFilters] = useState({ tipo: '', edad: '' });
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('https://huachitos.cl/api/animales');
        const data = await response.json();
        setPets(data.data);
        setFilteredPets(data.data.slice(0, 10));
      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
      }
    };

    fetchPets();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = pets;

      if (filters.tipo) {
        filtered = filtered.filter((pet) =>
          pet.tipo.toLowerCase().includes(filters.tipo.toLowerCase())
        );
      }

      if (filters.edad) {
        filtered = filtered.filter((pet) =>
          pet.edad.toLowerCase().includes(filters.edad.toLowerCase())
        );
      }

      setFilteredPets(filtered.slice(0, 10));
    };

    applyFilters();
  }, [filters, pets]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSelectPet = (pet) => {
    setSelectedPet(pet);
  };

  const handleSubmitAdoption = (formData) => {
    console.log('Solicitud de adopción enviada:', formData);
    alert('¡Solicitud enviada! Gracias por adoptar a ' + formData.petName);
    setSelectedPet(null);
  };

  return (
    <div className='container'>
      <Filter onFilterChange={handleFilterChange} />
      <PetList pets={filteredPets} onSelectPet={handleSelectPet} />
      {selectedPet && (
        <AdoptionForm pet={selectedPet} onSubmit={handleSubmitAdoption} />
      )}
    </div>
  );
}

export default App;
