import './Suggest.css'
import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';


function Suggest() {

    const initialValues = {
        song: "",
        artist: "",
        player: "",
        link: "",
        album: "",
        year: "",
        excerpt: "",
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
            .required("Link is required!")
        ,
        album: Yup.string()
            .min(1)
            .required("Album is required!")
            ,
        year: Yup.number()
            .typeError("Please enter a year number!")
            .integer()
            .min(1946, "Year must be between 1946 and 2023")
            .max(2023, "Year must be between 1946 and 2023")
            .required("Year is required!")
        ,
        excerpt: Yup.string()
            .min(5, "Excerpt must be at least 5 characters!")
            .required("Excerpt is required!")
        ,
    });

    const onSubmit = (data) => {
        axios.post("http://localhost:3001/entries", data).then((response) => {
            console.log("SUCCESS!");
        });
    };

    return (
        <div className="suggest-page">
            <div className="suggest-description">
                Please fill the indicated fields for the song suggestion and an 
                admin will take a look at it.
            </div>
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
                        <label>Spotify Link</label>
                        <ErrorMessage name="link" component="span" className="form-error" />
                        <Field
                            autoComplete="off"
                            id="input-suggest"
                            name="link"
                            placeholder="Spotify Song Link"
                        />
                    </div>
                    <div className="form-item">
                        <label>Album</label>
                        <ErrorMessage name="album" component="span" className="form-error" />
                        <Field
                            autoComplete="off"
                            id="input-suggest"
                            name="album"
                            placeholder="Album Name"
                        />
                    </div>
                    <div className="form-item">
                        <label>Year</label>
                        <ErrorMessage name="year" component="span" className="form-error" />
                        <Field
                            autoComplete="off"
                            id="input-suggest"
                            name="year"
                            placeholder="Year"
                        />
                    </div>
                    <div className="form-item">
                        <label>Excerpt</label>
                        <ErrorMessage name="excerpt" component="span" className="form-error" />
                        <Field
                            autoComplete="off"
                            id="input-excerpt"
                            name="excerpt"
                            placeholder="Song Excerpt"
                            as="textarea"
                        />
                    </div>
                    <div className="form-button">
                        <button type="submit">Suggest<FontAwesomeIcon icon={faLightbulb} class="icon-lightbulb" /></button>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}

export default Suggest