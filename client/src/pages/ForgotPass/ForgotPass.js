import './ForgotPass.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

function ForgotPass() {
    const navigate = useNavigate();

    const [sent, setSent] = useState(false);
    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState("");

    const pinRef = useRef([]);
    const [pincode, setPincode] = useState(['', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [disableResend, setDisableResend] = useState(false);

    useEffect(() => {
        let interval = setInterval(() => {
            setTimer((lastCount) => {
                lastCount <= 1 && clearInterval(interval);
                if (lastCount <= 1) {
                    setDisableResend(false);
                }
                if (lastCount <= 0) {
                    return lastCount;
                }
                return lastCount - 1;
            });
        }, 1000);

        changeFieldFocus(0);

        return () => clearInterval(interval);
    }, [disableResend]);

    const sendCode = async () => {
        const data = { email: email };

        try {
            await axios.post('/auth/sendRecoveryCode', data).then(() => {
                setDisableResend(true);
                setTimer(60);
                setSent(true);
                setErrMsg("");
            }) ;
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

    const resendCode = async () => {
        const data = { email: email };

        if (!disableResend) {
            try {
                await axios.post('/auth/sendRecoveryCode', data).then(() => {
                    setDisableResend(true);
                    setTimer(60);
                    setSent(true);
                    setErrMsg("");
                }) ;
            }
            catch (err) {
                if (!err?.response) {
                    setErrMsg('No server response');
                }
                else {
                    setErrMsg(err.response?.data?.message);
                }
            }
        }
    };

    const verifyCode = async () => {
        const code = pincode.join('');
        console.log(code);
        const data = { email: email, code: code };

        try {
            await axios.post('/auth/checkRecoveryCode', data).then((response) => {
                navigate(`/resetpass/${response.data.user}/${response.data.resetToken}`);
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

    const changeFieldFocus = (index) => {
        const ref = pinRef.current[index];
        if (ref) {
            ref.focus();
        }
    };

    const keyPressed = (key, index) => {
        if (key !== 'Backspace') {
            return;
        }

        if (pincode[index] === '') {
            changeFieldFocus(index - 1);
        }
        else {
            let pinCopy = [...pincode];
            pinCopy[index] = '';
            setPincode(pinCopy); 
        }
    };

    const updateField = (input, index) => {
        if (isNaN(input) || input === '') {
            return;
        }

        let pinCopy = [...pincode];
        pinCopy[index] = input;
        setPincode(pinCopy);     
        
        if (index < pinCopy.length - 1) {
            changeFieldFocus(index + 1);
        }
    };

    return (
        <div className="forgot-page">
            {sent ? (
                <>
                    <div className="forgot-page-description">
                        <div>A code has been sent to the email:</div>
                        <div>{email}</div>
                    </div>
                    <p className={errMsg ? "error-message" : "offscreen"}>{errMsg}</p>
                    <label>Verification</label>
                    <div className="forgot-page-pin-container">
                        {pincode.map((value, index) => {
                            return (
                                <input
                                    maxLength={1}
                                    className="recovery-pin-input"
                                    ref={(el) => {
                                        if (el) {
                                            pinRef.current[index] = el;
                                        }
                                    }}
                                    type="text"
                                    onKeyDown={(e) => keyPressed(e.key, index)}
                                    onChange={(e) => updateField(e.target.value, index)}
                                    value={pincode[index] || ''}
                                />
                            );
                        })}
                    </div>
                    <button className="send-button" onClick={verifyCode}>Verify Code</button>
                    <div className="forgot-subtext">
                        <span>Didn't receive a code?</span>
                        {disableResend ? (
                            <span className="forgot-subtext"> Resend code in {timer}</span>
                        ) : (
                            <span
                                className="forgot-subtext-clickable"
                                onClick={resendCode}
                            >
                                Resend code
                            </span>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="forgot-page-description">Please enter your email so a code can be sent to your email to change your password.</div>
                    <p className={errMsg ? "error-message" : "offscreen"}>{errMsg}</p>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <button className="send-button" onClick={sendCode}>Send Code</button>
                </>
            )}
        </div>
    )
}

export default ForgotPass;