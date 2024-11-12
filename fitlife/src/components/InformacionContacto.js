import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './InformacionContacto.module.css';

const InformacionContacto = ({ onDatosChange }) => {
    const formik = useFormik({
        initialValues: { email: '', telefono: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Email no válido').required('Requerido'),
            telefono: Yup.string().matches(/^[0-9]+$/, 'Debe ser un número').required('Requerido')
        }),
        onSubmit: (values) => onDatosChange(values),
    });

    return (
        <div className={styles.container}>
            <label className={styles.label}>Email</label>
            <input
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={styles.input}
            />
            {formik.touched.email && formik.errors.email ? <div className={styles.error}>{formik.errors.email}</div> : null}
            
            <label className={styles.label}>Teléfono</label>
            <input
                name="telefono"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.telefono}
                className={styles.input}
            />
            {formik.touched.telefono && formik.errors.telefono ? <div className={styles.error}>{formik.errors.telefono}</div> : null}
            
            <button type="button" onClick={formik.handleSubmit} className={styles.button}>Siguiente</button>
        </div>
    );
};

export default InformacionContacto;