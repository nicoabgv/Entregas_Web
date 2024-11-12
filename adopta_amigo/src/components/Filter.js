import React, { useState } from 'react';

function Filter({ onFilterChange }) {
  const [tipo, setTipo] = useState('');
  const [edad, setEdad] = useState('');

  const handleFilterChange = () => {
    onFilterChange({ tipo, edad });
  };

  return (
    <div className="container">
      <h3>Filtrar mascotas</h3>
      <div className="form-group">
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
        </select>
      </div>
      <div className="form-group">
        <select value={edad} onChange={(e) => setEdad(e.target.value)}>
          <option value="">Todas las edades</option>
          <option value="Cachorro">Cachorro</option>
          <option value="1 Año">1 Año</option>
          <option value="2 Años">2 Años</option>
          <option value="Adulto">Adulto</option>
        </select>
      </div>
      <button className="button" onClick={handleFilterChange}>Aplicar Filtros</button>
    </div>
  );
}

export default Filter;
