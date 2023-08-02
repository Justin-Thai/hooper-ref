import './Suggest.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

function Suggest() {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [success, setSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const SPOTIFY_LINK_REGEX = /^.*spotify\.com\/track\/.*$/i;

    const initialValues = {
        song: "",
        artist: "",
        player: "",
        link: ""
    };

    const validationSchema = Yup.object().shape({
        song: Yup.string()
            .min(1)
            .required("Song name is required!")
        ,
        artist: Yup.string()
            .min(1)
            .required("Artist name(s) is required!")
        ,
        player: Yup.string()
            .min(2, "Player name must be at least 2 characters!")
            .required("Player name is required!")
        ,
        link: Yup.string()
            .min(10, "Link must be at least 10 characters!")
            .matches(SPOTIFY_LINK_REGEX, "Link must be a Spotify song link!")
            .notRequired()
    });

    const onSubmit = async (data) => {
        try {
            await axiosPrivate.post('/submissions', data,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            ).then((response) => {
                setErrMsg("");
                setSuccess(true);
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
        <div className="suggest-page">
            {success ? (
                <>
                    <div className="success-text">Your suggestion has been submitted and is under review.</div>
                    <button className="navigate-button" onClick={() => navigate(`/`)}>Back to Home</button>
                </>
            ) : (
                <>
                    <div className="suggest-description">
                        Please fill the indicated fields for the song suggestion and a mod will review it.
                        If a song has references to multiple players, please individually submit a reference for each player.
                    </div>
                    <p className={errMsg ? "error-message" : "offscreen"}>{errMsg}</p>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={validationSchema}
                    >
                        <Form className="form-container">
                            <div className="form-item">
                                <label>Song</label>
                                <ErrorMessage name="song" component="span" className="form-error" />
                                <Field
                                    autoComplete="off"
                                    id="input-suggest"
                                    name="song"
                                    placeholder="Song Name"
                                />
                            </div>
                            <div className="form-item">
                                <label>Artist(s)</label>
                                <ErrorMessage name="artist" component="span" className="form-error" />
                                <Field
                                    autoComplete="off"
                                    id="input-suggest"
                                    name="artist"
                                    placeholder="Artist Name(s)"
                                />
                            </div>
                            <div className="form-item">
                                <label>Player Referenced</label>
                                <ErrorMessage name="player" component="span" className="form-error" />
                                <Field
                                    autoComplete="off"
                                    id="input-suggest"
                                    name="player"
                                    placeholder="Player Name"
                                />
                            </div>
                            <div className="form-item">
                                <label>Spotify Link (optional)</label>
                                <ErrorMessage name="link" component="span" className="form-error" />
                                <Field
                                    autoComplete="off"
                                    id="input-suggest"
                                    name="link"
                                    placeholder="Spotify Song Link"
                                />
                            </div>
                            <div className="form-button">
                                <button type="submit">Suggest<FontAwesomeIcon icon={faLightbulb} className="icon-lightbulb" /></button>
                            </div>
                        </Form>
                    </Formik>
                </>
            )}
        </div>
    )
}

export default Suggest