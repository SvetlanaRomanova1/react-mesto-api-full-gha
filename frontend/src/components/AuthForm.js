import React from "react";

function AuthForm
({
     title = '',
     buttonText = '',
     handleSubmit,
     setEmail,
     setPassword,
     isLoading,
     email,
     password,
 }) {

    return (
        <div className="auth">
            <h2 className="auth__title">
                {title}
            </h2>
            <form className="auth__form" onSubmit={handleSubmit}>
                <input
                    className="auth__input"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="auth__input"
                    type="password"
                    placeholder="Пароль"
                    name="password"
                    value={password}
                    minLength="8"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    className="auth__button"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Подождите..." : buttonText}
                </button>
            </form>
        </div>
    );
}

export default AuthForm;



