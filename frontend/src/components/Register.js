import React from "react";
import AuthForm from "./AuthForm";
import {UseFormAuth} from "../hooks/use-form-auth";
import {NavLink} from "react-router-dom";
import api from "../utils/api";

function Register({setIsPopupOpen, setIsSuccess}) {

    const {email, setEmail, password, setPassword, isLoading, setLoading} = UseFormAuth();


    const handleRegister = (e) => {
        e.preventDefault();
        setLoading(true);
        api.signup({password, email})
            .then(res => {
                setIsSuccess(true);
                setIsPopupOpen(true);
                setEmail("");
                setPassword("");
            })
            .catch((error)=>{
                console.error("Registration failed:", error);
                setIsSuccess(false);
                setIsPopupOpen(true);
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    return (
        <>
            <AuthForm
                title="Регистрация"
                buttonText="Зарегистрироваться"
                handleSubmit={handleRegister}
                setEmail={setEmail}
                setPassword={setPassword}
                isLoading={isLoading}
                email={email}
                password={password}
            />
            <div className="auth__container">
          <span className="auth__already-registered">
            Уже зарегистрированы?
          </span>
                <NavLink className="auth__login-link" to="/sign-in">
                    Войти
                </NavLink>
            </div>
        </>
    )
}

export default Register;
