import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import logoHeader from '../image/logo-image.svg';
import closeButton from '../image/close-Icon.svg'

function HeaderControls({email, onSinkOut, className = '', isMenuOpen}) {
    if (isMenuOpen && email) {
        return (
            <div className={`header__wrapper ${className}`}>
                <span className="header__auth-link">{email}</span>
                <Link onClick={onSinkOut} className="header__auth-link" to="/sign-in">
                    Выйти
                </Link>
            </div>
        )
    }

    return null;
}

function HeaderMobileButton({toggleMenu, isMenuOpen}) {
    const location = useLocation();
    const isSignUp = location.pathname === '/sign-up';
    const isSignIn = location.pathname === '/sign-in';

    if (isSignUp || isSignIn) {
        return null
    }

    if (isMenuOpen) {
        return (
            <button className="header__close-button"
                    onClick={toggleMenu}
            ><img className="header__close-icon" src={closeButton} alt="Close"/></button>
        )
    }

    return (
        <button className='header__mobile-button' onClick={toggleMenu}>
            <span className="header__mobile-icon"/>
            <span className="header__mobile-icon"/>
            <span className="header__mobile-icon"/>
        </button>
    )
}

function Header({email, setIsAuthenticated, isAuthenticated}) {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const onSinkOut = () => {
        setIsMenuOpen(false);
        setIsAuthenticated(false);
        localStorage.setItem('is-login', '');
    }

    const isPage = location.pathname === '/page';
    const isSignUp = location.pathname === '/sign-up';
    const isSignIn = location.pathname === '/sign-in';

    return (
        <>
            <HeaderControls
                isMenuOpen={isMenuOpen}
                className='header__wrapper-mobile'
                email={email}
                onSinkOut={onSinkOut}
                setIsAuthenticated={setIsAuthenticated}
            />
            <header className="header">
                <img alt="Логотип место" className="header__logo" src={logoHeader}/>
                <HeaderMobileButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu}/>
                {isPage && isAuthenticated && <HeaderControls email={email} onSinkOut={onSinkOut} isMenuOpen />}
                {isSignUp && <Link className="header__auth-link" to="/sign-in">Войти</Link>}
                {isSignIn && <Link className="header__auth-link" to="/sign-up">Регистрация</Link>}
            </header>
        </>
    );
}

export default Header;
