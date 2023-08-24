import './ResetPass.css';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

function ResetPass() {
    let { user, resetToken } = useParams();
    const navigate = useNavigate();

    const [success, setSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,}$/;
    const passReqString = "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character (!@#$%).";

    const changeField = (pass) => {
        setPassword(pass);
        if (!PASS_REGEX.test(pass)) {
            setErrMsg(passReqString);
        }
        else {
            setErrMsg("");
        }
    }

    const resetPassword = async () => {
        const data = { password: password, confirmPass: confirmPass };

        if (!PASS_REGEX.test(data.password)) {
            setErrMsg(passReqString);
            return;
        }

        try {
            await axios.patch(`/auth/resetPassword/${user}/${resetToken}`, data).then(() => {
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
        <div className="reset-page">
            {success ? (
                <>
                    <div className="success-text">Success! Your password has been reset. Please sign in with your new credentials.</div>
                    <button className="navigate-button" onClick={() => navigate(`/login`)}>Sign In</button>
                </>
            ) : (
                <>
                    <div className="reset-page-description">Please fill the required fields to reset your password.</div>
                    <p className={errMsg ? "error-message" : "offscreen"}>{errMsg}</p>
                    <label>New Password</label>
                    <input
                        type="password"
                        onChange={(event) => { changeField(event.target.value); }}
                    />
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        onChange={(event) => { setConfirmPass(event.target.value); }}
                    />
                    <button className="reset-button" onClick={resetPassword}>Reset Password</button>
                </>
            )
            }
        </div>
    )
}

export default ResetPass;