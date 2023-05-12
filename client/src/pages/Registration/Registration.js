import './Registration.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from '../../api/axios';

function Registration() {
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    
    const MAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const USER_REGEX = /^(?=[A-z0-9-_]).{3,30}$/;
    const userReqString = "Username must be between 3 to 30 characters long. Alphanumeric characters, underscores, and hyphens allowed.";
    const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,}$/;
    const passReqString = "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character (!@#$%).";

    const initialValues = {
        email: "",
        username: "",
        password: "",
        confirmPass: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .matches(MAIL_REGEX, "Email is not valid!")
            .required("Email is required!")
        ,
        username: Yup.string()
            .matches(USER_REGEX, userReqString)
            .required("Username is required!")
        ,
        password: Yup.string()
            .matches(PASS_REGEX, passReqString)
            .required("Password is required!")
        ,
        confirmPass: Yup.string()
            .oneOf([Yup.ref('password')], "Passwords don't match!")
            .required("Please confirm your password!")
        ,
    });

    const onSumbit = (data) => {
        axios.post("/users", data).then((response) => {
            if (response.data.message) {
                setErrMsg(response.data.message);
            }
            else {
                setSuccess(true);
            }
        });
    };


    return (
        <div className="registration-page">
            {success ? (
                <>
                    <div className="success-text">Success! Your account has been created.</div>
                    <button className="sign-in-button" onClick={() => navigate(`/login`)}>Sign In</button>
                </>
            ) : (
                <>
                    <p className={errMsg ? "error-message" : "offscreen"}>{errMsg}</p>
                    <Formik
                        enableReinitialize
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
                            <button className="regi-button" type="submit">Sign Up</button>
                        </Form>
                    </Formik>
                    <div className="subtext">
                        <span>Already have an account?</span>
                        <span className="subtext-clickable" onClick={() => navigate(`/login`)}>Sign In</span>
                    </div>
                </>
            )}
        </div>
    )
}

export default Registration