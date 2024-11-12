import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './DatosPersonales.module.css';

const DatosPersonales = ({ onDatosChange }) => {
    const formik = useFormik({
        initialValues: { nombre: '', edad: '', genero: '' },
        validationSchema: Yup.object({
            nombre: Yup.string().required('Requerido'),
            edad: Yup.number().required('Requerido').positive().integer(),
            genero: Yup.string().required('Requerido')
        }),
        onSubmit: (values) => onDatosChange(values),
    });

    return (
        <div className={styles.container}>
            <label className={styles.label}>Nombre</label>
            <input
                name="nombre"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
                className={styles.input}
            />
            {formik.touched.nombre && formik.errors.nombre ? <div className={styles.error}>{formik.errors.nombre}</div> : null}

            <label className={styles.label}>Edad</label>
            <input
                name="edad"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.edad}
                className={styles.input}
            />
            {formik.touched.edad && formik.errors.edad ? <div className={styles.error}>{formik.errors.edad}</div> : null}

            <label className={styles.label}>Género</label>
            <select
                name="genero"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.genero}
                className={styles.select}
            >
                <option value="">Seleccione género</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
            </select>
            {formik.touched.genero && formik.errors.genero ? <div className={styles.error}>{formik.errors.genero}</div> : null}

            <button type="button" onClick={formik.handleSubmit} className={styles.button}>Siguiente</button>
        </div>
    );
};

export default DatosPersonales;