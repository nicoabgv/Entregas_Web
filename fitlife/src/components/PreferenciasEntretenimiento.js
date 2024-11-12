import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './PreferenciasEntrenamiento.module.css';

const PreferenciasEntrenamiento = ({ onDatosChange }) => {
    const formik = useFormik({
        initialValues: { objetivo: '', tipoEntrenamiento: '' },
        validationSchema: Yup.object({
            objetivo: Yup.string().required('Requerido'),
            tipoEntrenamiento: Yup.string().required('Requerido')
        }),
        onSubmit: (values) => onDatosChange(values),
    });

    return (
        <div className={styles.container}>
            <label className={styles.label}>Objetivo</label>
            <select
                name="objetivo"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.objetivo}
                className={styles.select}
            >
                <option value="">Selecciona un objetivo</option>
                <option value="perderPeso">Perder Peso</option>
                <option value="ganarMusculo">Ganar Músculo</option>
                <option value="mejorarSalud">Mejorar Salud</option>
            </select>
            {formik.touched.objetivo && formik.errors.objetivo ? <div className={styles.error}>{formik.errors.objetivo}</div> : null}

            <label className={styles.label}>Tipo de Entrenamiento</label>
            <select
                name="tipoEntrenamiento"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.tipoEntrenamiento}
                className={styles.select}
            >
                <option value="">Selecciona el tipo de entrenamiento</option>
                <option value="cardio">Cardio</option>
                <option value="fuerza">Fuerza</option>
                <option value="yoga">Yoga</option>
            </select>
            {formik.touched.tipoEntrenamiento && formik.errors.tipoEntrenamiento ? <div className={styles.error}>{formik.errors.tipoEntrenamiento}</div> : null}

            <button type="button" onClick={formik.handleSubmit} className={styles.button}>Guardar Preferencias</button>
        </div>
    );
};

export default PreferenciasEntrenamiento;