import React from "react";
import {useNavigate} from "react-router-dom";
import AuthForm from "./AuthForm";
import {UseFormAuth} from "../hooks/use-form-auth";
import api from "../utils/api";

function Login({setIsSuccess, setIsPopupOpen, setIsAuthenticated}) {

    const {email, setEmail, password, setPassword, isLoading, setLoading} = UseFormAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        api.signin({password, email})
            .then((res) => {
                if (res.token) {
                    setIsAuthenticated(true);
                    localStorage.setItem('token', res.token);
                    setEmail("");
                    setPassword("");
                    navigate("/page");
                }
            })
            .catch((error) => {
                console.error('Ошибка авторизации:', error);
                setIsPopupOpen(true);
                setIsSuccess(false);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <AuthForm
            title="Вход"
            buttonText="Войти"
            handleSubmit={handleLogin}
            setEmail={setEmail}
            setPassword={setPassword}
            isLoading={isLoading}
            email={email}
            password={password}
        />
    )
}

export default Login;
