import React, { useState } from 'react';
import DatosPersonales from './DatosPersonales';
import InformacionContacto from './InformacionContacto';
import PreferenciasEntrenamiento from './PreferenciasEntrenamiento';

const FormularioRegistro = () => {
    const [datos, setDatos] = useState({});

    const handleDatosChange = (seccion, nuevosDatos) => {
        setDatos((prevDatos) => ({ ...prevDatos, [seccion]: nuevosDatos }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
            });
            if (response.ok) {
                console.log('Registro exitoso');
            } else {
                console.log('Error en el registro');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <DatosPersonales onDatosChange={(datos) => handleDatosChange('personales', datos)} />
            <InformacionContacto onDatosChange={(datos) => handleDatosChange('contacto', datos)} />
            <PreferenciasEntrenamiento onDatosChange={(datos) => handleDatosChange('entrenamiento', datos)} />
            <button type="submit">Unirse a FitLife</button>
        </form>
    );
};

export default FormularioRegistro;