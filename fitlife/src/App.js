import React from 'react';
import './App.css';
import FormularioRegistro from './FormularioRegistro';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenido a FitLife</h1>
        <p>¡Únete a nuestro gimnasio y comienza tu viaje hacia una vida más saludable!</p>
        <FormularioRegistro />
      </header>
    </div>
  );
}

export default App;