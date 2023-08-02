import './FormModal.css';
import { useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function FormModal({ closeModal, continueAction, parentToChild }) {
    const formRef = useRef();
    const SPOTIFY_LINK_REGEX = /^.*spotify\.com\/track\/.*$/i;

    const initialValues = {
        subId: parentToChild.id,
        song: parentToChild.song,
        artist: parentToChild.artist,
        player: parentToChild.player,
        playerCode: "",
        link: parentToChild.link,
        album: "",
        year: "",
        excerpt: "",
        userId: parentToChild.userId
    }

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
        playerCode: Yup.string()
            .min(5, "Player code must be at least 5 characters!")
            .required("Player code is required!")
        ,
        link: Yup.string()
            .min(10, "Link must be at least 10 characters!")
            .matches(SPOTIFY_LINK_REGEX, "Link must be a Spotify song link!")
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

    const handleSumbit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    }

    return (
        <div className="form-modal-background">
            <div className="form-modal-container">
                <div className="form-modal-exit">
                    <button onClick={() => closeModal(false)}>X</button>
                </div>
                <div className="form-modal-body">
                    <Formik
                        innerRef={formRef}
                        initialValues={initialValues}
                        onSubmit={(data) => continueAction(data)}
                        validationSchema={validationSchema}
                    >
                        <Form className="formik-container">
                            <div className="formik-item">
                                <label>Song</label>
                                <ErrorMessage name="song" component="span" className="formik-error" />
                                <Field 
                                    autoComplete="off"
                                    id="input-suggest"
                                    name="song"
                                    placeholder="Song Name"
                                />
                            </div>
                            <div className="formik-item">
                                <label>Artist(s)</label>
                                <ErrorMessage name="artist" component="span" className="formik-error" />
                                <Field 
                                    autoComplete="off"
                                    id="input-suggest"
                                    name="artist"
                                    placeholder="Artist Name(s)"
                                />
                            </div>
                            <div className="formik-item">
                                <label>Player</label>
                                <ErrorMessage name="player" component="span" className="formik-error" />
                                <Field 
                                    autoComplete="off"
                                    id="input-suggest"
                                    name="player"
                                    placeholder="Player Name"
                                />
                            </div>
                            <div className="formik-item">
                                <label>Player Code</label>
                                <ErrorMessage name="playerCode" component="span" className="formik-error" />
                                <Field 
                                    autoComplete="off"
                                    id="input-suggest"
                                    name="playerCode"
                                    placeholder="Found on Basketball Reference"
                                />
                            </div>
                            <div className="formik-item">
                                <label>Spotify Link</label>
                                <ErrorMessage name="link" component="span" className="formik-error" />
                                <Field 
                                    autoComplete="off"
                                    id="input-suggest"
                                    name="link"
                                    placeholder="Spotify Song Link"
                                />
                            </div>
                            <div className="formik-item">
                                <label>Album</label>
                                <ErrorMessage name="album" component="span" className="formik-error" />
                                <Field 
                                    autoComplete="off"
                                    id="input-suggest"
                                    name="album"
                                    placeholder="Album Name"
                                />
                            </div>
                            <div className="formik-item">
                                <label>Year</label>
                                <ErrorMessage name="year" component="span" className="formik-error" />
                                <Field 
                                    autoComplete="off"
                                    id="input-suggest"
                                    name="year"
                                    placeholder="Year"
                                />
                            </div>
                            <div className="formik-item">
                                <label>Excerpt</label>
                                <ErrorMessage name="excerpt" component="span" className="formik-error" />
                                <Field 
                                    autoComplete="off"
                                    id="input-excerpt"
                                    name="excerpt"
                                    placeholder="Song Excerpt"
                                    as="textarea"
                                />
                            </div>
                        </Form>
                    </Formik>
                </div>
                <div className="form-modal-footer">
                    <button className="form-modal-cancel" onClick={() => closeModal(false)}>Cancel</button>
                    <button className="form-modal-confirm" type="submit" onClick={handleSumbit}>Add Entry</button>
                </div>
            </div>
        </div>
    )
}

export default FormModal;