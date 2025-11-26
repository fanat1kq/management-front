import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Auth.css';

const AuthPage = ({ onLogin, onRegister }) => {
    const [authMode, setAuthMode] = useState('login');
    const [loading, setLoading] = useState(true); // Начинаем с загрузки
    const [authError, setAuthError] = useState('');
    const [authForm, setAuthForm] = useState({
        username: 'demo',
        email: 'demo@taskflow.ru',
        password: 'demo',
        confirmPassword: 'demo',
        rememberMe: false
    });

    // Автоматический вход при загрузке
    useEffect(() => {
        const autoLogin = async () => {
            try {
                console.log('🔐 Автоматический вход...');
                await onLogin({
                    username: 'demo',
                    password: 'demo'
                });
            } catch (error) {
                console.log('Автоматический вход не удался, показываем форму');
                setLoading(false);
            }
        };

        autoLogin();
    }, [onLogin]);

    const handleAuthInputChange = (field, value) => {
        setAuthForm(prev => ({
            ...prev,
            [field]: value
        }));
        setAuthError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (authMode === 'login') {
                await onLogin({
                    username: authForm.username,
                    password: authForm.password
                });
            } else {
                if (authForm.password !== authForm.confirmPassword) {
                    throw new Error('Пароли не совпадают');
                }
                await onRegister({
                    username: authForm.username,
                    email: authForm.email,
                    password: authForm.password
                });
            }
        } catch (error) {
            setAuthError(error.message);
            setLoading(false);
        }
    };

    const switchAuthMode = () => {
        setAuthMode(prev => prev === 'login' ? 'register' : 'login');
        setAuthForm({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            rememberMe: false
        });
        setAuthError('');
    };

    // Показываем загрузку во время автоматического входа
    if (loading) {
        return (
            <div className="auth-container">
                <div className="auth-background">
                    <div className="auth-shapes">
                        <div className="auth-shape shape-1"></div>
                        <div className="auth-shape shape-2"></div>
                        <div className="auth-shape shape-3"></div>
                        <div className="auth-shape shape-4"></div>
                    </div>
                </div>

                <motion.div
                    className="auth-modal"
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                    <div className="auth-header">
                        <div className="auth-logo">
                            <motion.div
                                className="auth-logo-icon"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                            >
                                🎯
                            </motion.div>
                            <div className="auth-logo-text">
                                <h1>TaskFlow</h1>
                                <p>Умный менеджер задач</p>
                            </div>
                        </div>
                    </div>

                    <div className="auth-content" style={{ textAlign: 'center', padding: '60px 40px' }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div style={{ fontSize: '3em', marginBottom: '20px' }}>⏳</div>
                            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>
                                Выполняется вход...
                            </h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Автоматический вход в демо-режим
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Оригинальная форма аутентификации (показывается если автоматический вход не сработал)
    return (
        <motion.div
            className="auth-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="auth-background">
                <div className="auth-shapes">
                    <div className="auth-shape shape-1"></div>
                    <div className="auth-shape shape-2"></div>
                    <div className="auth-shape shape-3"></div>
                    <div className="auth-shape shape-4"></div>
                </div>
            </div>

            <motion.div
                className="auth-modal"
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                <div className="auth-header">
                    <div className="auth-logo">
                        <motion.div
                            className="auth-logo-icon"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            🎯
                        </motion.div>
                        <div className="auth-logo-text">
                            <h1>TaskFlow</h1>
                            <p>Демо-режим</p>
                        </div>
                    </div>
                </div>

                <div className="auth-content">
                    <div style={{
                        background: 'var(--bg-secondary)',
                        padding: '15px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9em' }}>
                            🚀 Демо-режим: используйте любые данные для входа
                        </p>
                    </div>

                    <div className="auth-tabs">
                        <motion.button
                            className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                            onClick={() => setAuthMode('login')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Вход
                        </motion.button>
                        <motion.button
                            className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                            onClick={() => setAuthMode('register')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Регистрация
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {authError && (
                            <motion.div
                                className="auth-error"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {authError}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <motion.div
                            className="form-group"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <label>Имя пользователя</label>
                            <motion.input
                                type="text"
                                value={authForm.username}
                                onChange={(e) => handleAuthInputChange('username', e.target.value)}
                                placeholder="Введите ваш логин"
                                required
                                className="auth-input"
                                disabled={loading}
                                whileFocus={{ scale: 1.02 }}
                            />
                        </motion.div>

                        {authMode === 'register' && (
                            <motion.div
                                className="form-group"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label>Email адрес</label>
                                <motion.input
                                    type="email"
                                    value={authForm.email}
                                    onChange={(e) => handleAuthInputChange('email', e.target.value)}
                                    placeholder="Введите ваш email"
                                    required
                                    className="auth-input"
                                    disabled={loading}
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </motion.div>
                        )}

                        <motion.div
                            className="form-group"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label>Пароль</label>
                            <motion.input
                                type="password"
                                value={authForm.password}
                                onChange={(e) => handleAuthInputChange('password', e.target.value)}
                                placeholder="Введите ваш пароль"
                                required
                                className="auth-input"
                                disabled={loading}
                                whileFocus={{ scale: 1.02 }}
                            />
                        </motion.div>

                        {authMode === 'register' && (
                            <motion.div
                                className="form-group"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label>Подтверждение пароля</label>
                                <motion.input
                                    type="password"
                                    value={authForm.confirmPassword}
                                    onChange={(e) => handleAuthInputChange('confirmPassword', e.target.value)}
                                    placeholder="Повторите пароль"
                                    required
                                    className="auth-input"
                                    disabled={loading}
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </motion.div>
                        )}

                        {authMode === 'login' && (
                            <div className="auth-options">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={authForm.rememberMe}
                                        onChange={(e) => handleAuthInputChange('rememberMe', e.target.checked)}
                                        className="checkbox-input"
                                        disabled={loading}
                                    />
                                    <span className="checkmark"></span>
                                    Запомнить меня
                                </label>
                                <a href="#" className="forgot-password">Забыли пароль?</a>
                            </div>
                        )}

                        <motion.button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.05 }}
                            whileTap={{ scale: loading ? 1 : 0.95 }}
                        >
                            {loading ? 'Загрузка...' :
                                authMode === 'login' ? 'Войти в систему' : 'Создать аккаунт'}
                        </motion.button>
                    </form>

                    <div className="auth-switch">
                        {authMode === 'login' ? (
                            <p>
                                Нет аккаунта?{' '}
                                <motion.button
                                    type="button"
                                    onClick={switchAuthMode}
                                    className="auth-link"
                                    disabled={loading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Зарегистрироваться
                                </motion.button>
                            </p>
                        ) : (
                            <p>
                                Уже есть аккаунт?{' '}
                                <motion.button
                                    type="button"
                                    onClick={switchAuthMode}
                                    className="auth-link"
                                    disabled={loading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Войти
                                </motion.button>
                            </p>
                        )}
                    </div>
                </div>

                <div className="auth-footer">
                    <p>© 2024 TaskFlow. Демо-версия</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AuthPage;