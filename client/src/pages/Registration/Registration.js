import './Registration.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Registration() {
    const navigate = useNavigate();
    const mailFormat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const initialValues = {
        email: "",
        username: "",
        password: "",
        confirmPass: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .matches(mailFormat, "Email is not valid!")
        ,
        username: Yup.string()
            .min(3, "Username must be at least 3 characters!")
            .max(30, "Username can be at most 30 characters!")
            .required("Username is required!")
        ,
        password: Yup.string()
            .min(4, "Password must be at least 4 charcters!")
            .required("Password is required!")
        ,
        confirmPass: Yup.string()
            .required("Please confirm your password!")
            .oneOf([Yup.ref('password')], "Passwords don't match!")
        ,
    });

    const onSumbit = () => {
        const data = initialValues;
        console.log(data);
    };


    return (
        <div className="registration-page">
            <Formik
                initialValues={initialValues}
                onSubmit={onSumbit}
                validationSchema={validationSchema}
            >
                <Form>
                    <div className="regi-form-item">
                        <label>Email</label>
                        <ErrorMessage name="email" component="span" className="regi-form-error" />
                        <Field 
                            autoComplete="off"
                            id="input-regi"
                            name="email"
                            placeholder="Email"
                        />
                    </div>
                    <div className="regi-form-item">
                        <label>Username</label>
                        <ErrorMessage name="username" component="span" className="regi-form-error" />
                        <Field 
                            autoComplete="off"
                            id="input-regi"
                            name="username"
                            placeholder="Username"
                        />
                    </div>
                    <div className="regi-form-item">
                        <label>Password</label>
                        <ErrorMessage name="password" component="span" className="regi-form-error" />
                        <Field 
                            type="password"
                            autoComplete="off"
                            id="input-regi"
                            name="password"
                            placeholder="Password"
                        />
                    </div>
                    <div className="regi-form-item">
                        <label>Confirm Password</label>
                        <ErrorMessage name="confirmPass" component="span" className="regi-form-error" />
                        <Field 
                            type="password"
                            autoComplete="off"
                            id="input-regi"
                            name="confirmPass"
                            placeholder="Confirm Password"
                        />
                    </div>
                </Form>
            </Formik>
            <button className="regi-button" onClick={onSumbit}>Sign Up</button>
            <div className="subtext">
                <span>Already have an account?</span>
                <span className="subtext-clickable" onClick={() => navigate(`/login`)}>Sign In</span>
            </div>
        </div>
    )
}

export default Registration