import React, { useState } from 'react';

function AdoptionForm({ pet, onSubmit }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [aboutHome, setAboutHome] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      petId: pet.id,
      petName: pet.nombre,
      name,
      address,
      phone,
      email,
      aboutHome,
    };
    onSubmit(formData);
  };

  return (
    <div className="container">
      <h3>Formulario de adopción para {pet.nombre}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Dirección"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Cuéntanos sobre tu hogar"
            value={aboutHome}
            onChange={(e) => setAboutHome(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button">Enviar Solicitud</button>
      </form>
    </div>
  );
}

export default AdoptionForm;
