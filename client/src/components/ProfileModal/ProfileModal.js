import './ProfileModal.css';
import { useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function ProfileModal({ closeModal, continueAction, parentToChild }) {
    const axiosPrivate = useAxiosPrivate();
    const formRef = useRef();
    const [errMsg, setErrMsg] = useState("");

    const MAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const USER_REGEX = /^(?=[A-z0-9-_]).{3,30}$/;
    const userReqString = "Username must be between 3 to 30 characters long. Alphanumeric characters, underscores, and hyphens allowed.";
    const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,}$/;
    const passReqString = "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character (!@#$%).";

    const initialValues = {
        id: parentToChild.id,
        username: parentToChild.username,
        email: parentToChild.email,
        oldPass: "",
        password: "",
        confirmNewPass: ""
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .matches(USER_REGEX, userReqString)
            .required("Username is required!")
        ,
        email: Yup.string()
            .matches(MAIL_REGEX, "Email is not valid!")
            .required("Email is required!")
        ,
        oldPass: Yup.string()
            .required("Current password is required to make changes!")
        ,
        password: Yup.string()
            .matches(PASS_REGEX, passReqString)
        ,
        confirmPass: Yup.string()
            .oneOf([Yup.ref('password')], "Passwords don't match!")
        ,
    });

    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    const makeChanges = async (data) => {
        const userData = {
            username: data.username,
            email: data.email,
            oldPass: data.oldPass,
            password: data.password,
            confirmPass: data.confirmPass
        }
        console.log(userData);

        try {
            await axiosPrivate.put(`users/${data.id}`, userData,
                {
                    headers: { 'Content-Type': 'application/json' },
                    widthCredentials: true
                }
            ).then(() => {
                continueAction();
            });
        }
        catch (err) {
            if (!err?.response) {
                setErrMsg('No server response');
            }
            else {
                setErrMsg(err.response?.data?.message);
            }
        }
    };

    return (
        <div className="profile-modal-background">
            <div className="profile-modal-container">
                <div className="profile-modal-exit">
                    <button onClick={() => closeModal(false)}>X</button>
                    <p className={errMsg ? "error-message" : "offscreen"}>{errMsg}</p>
                </div>
                <div className="profile-modal-body">
                    <Formik
                        innerRef={formRef}
                        initialValues={initialValues}
                        onSubmit={(data) => makeChanges(data)}
                        validationSchema={validationSchema}
                    >
                        <Form className="profile-form-container">
                            <div className="profile-form-item">
                                <label>Username</label>
                                <ErrorMessage name="username" component="span" className="profile-form-error" />
                                <Field
                                    autoComplete="off"
                                    id="input-edit"
                                    name="username"
                                    placeholder="Username"
                                />
                            </div>
                            <div className="profile-form-item">
                                <label>Email</label>
                                <ErrorMessage name="email" component="span" className="profile-form-error" />
                                <Field
                                    autoComplete="off"
                                    id="input-edit"
                                    name="email"
                                    placeholder="Email"
                                />
                            </div>
                            <div className="profile-form-item">
                                <label>New Password</label>
                                <ErrorMessage name="password" component="span" className="profile-form-error" />
                                <Field
                                    type="password"
                                    autoComplete="off"
                                    id="input-edit"
                                    name="password"
                                    placeholder="New Password"
                                />
                            </div>
                            <div className="profile-form-item">
                                <label>Confirm New Password</label>
                                <ErrorMessage name="confirmPass" component="span" className="profile-form-error" />
                                <Field
                                    type="password"
                                    autoComplete="off"
                                    id="input-edit"
                                    name="confirmPass"
                                    placeholder="Confirm New Password"
                                />
                            </div>
                            <div className="profile-form-item">
                                <label>Current Password</label>
                                <ErrorMessage name="oldPass" component="span" className="profile-form-error" />
                                <Field
                                    type="password"
                                    autoComplete="off"
                                    id="input-edit"
                                    name="oldPass"
                                    placeholder="Current Password"
                                />
                            </div>
                        </Form>
                    </Formik>
                </div>
                <div className="profile-modal-footer">
                    <button className="profile-modal-cancel" onClick={() => closeModal(false)}>Cancel</button>
                    <button className="profile-modal-confirm" type="submit" onClick={handleSubmit}>Make Changes</button>
                </div>
            </div>
        </div>
    )
}


export default ProfileModal;