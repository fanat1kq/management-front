import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const Header = ({ user, onLogout, onProfileOpen }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Закрытие меню при клике вне его области
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUserMenuToggle = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const handleProfileClick = () => {
        setIsUserMenuOpen(false);
        onProfileOpen();
    };

    const handleLogout = () => {
        setIsUserMenuOpen(false);
        onLogout();
    };

    return (
        <header className="header">
            <div className="header-left">
                <motion.div
                    className="header-logo"
                    whileHover={{scale: 1.05, rotate: 5}}
                    transition={{duration: 0.2}}
                >
                    <img
                        src="/images/target.svg"
                        alt="VNK Logo"
                        className="logo-svg-image"
                    />
                </motion.div>

                <motion.div
                    className="demo-badge"
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{delay: 0.3}}
                >
                top-secret
                </motion.div>
            </div>

            <div className="header-right">
                {/* Уведомления */}
                <motion.button
                    className="header-btn notification-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                >
                    🔔
                    <span className="notification-badge">3</span>
                </motion.button>

                {/* Меню пользователя */}
                <div className="user-menu-container" ref={userMenuRef}>
                    <motion.button
                        className="user-menu-trigger"
                        onClick={handleUserMenuToggle}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="user-avatar-sm">
                            {user?.avatar || '👤'}
                        </div>
                        <div className="user-info-sm">
                            <span className="user-name-sm">{user?.name || 'Пользователь'}</span>
                            <span className="user-status">Online</span>
                        </div>
                        <motion.span
                            className="dropdown-arrow"
                            animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            ▼
                        </motion.span>
                    </motion.button>

                    <AnimatePresence>
                        {isUserMenuOpen && (
                            <motion.div
                                className="user-menu-dropdown"
                                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Заголовок меню */}
                                <div className="user-menu-header">
                                    <div className="user-avatar-md">
                                        {user?.avatar || '👤'}
                                    </div>
                                    <div className="user-details">
                                        <div className="user-name-md">{user?.name || 'Пользователь'}</div>
                                        <div className="user-email-md">{user?.email || 'user@example.com'}</div>
                                    </div>
                                </div>

                                <div className="user-menu-divider"></div>

                                {/* Пункты меню */}
                                <button className="user-menu-item" onClick={handleProfileClick}>
                                    <span className="menu-item-icon">👤</span>
                                    <span className="menu-item-text">Мой профиль</span>
                                </button>

                                <button className="user-menu-item">
                                    <span className="menu-item-icon">⚙️</span>
                                    <span className="menu-item-text">Настройки</span>
                                </button>

                                <button className="user-menu-item">
                                    <span className="menu-item-icon">🎨</span>
                                    <span className="menu-item-text">Внешний вид</span>
                                    <span className="theme-badge">Светлая</span>
                                </button>

                                <button className="user-menu-item">
                                    <span className="menu-item-icon">🔔</span>
                                    <span className="menu-item-text">Уведомления</span>
                                    <span className="notification-badge-sm">3</span>
                                </button>

                                <div className="user-menu-divider"></div>

                                {/* Помощь и поддержка */}
                                <button className="user-menu-item">
                                    <span className="menu-item-icon">❓</span>
                                    <span className="menu-item-text">Помощь</span>
                                </button>

                                <button className="user-menu-item">
                                    <span className="menu-item-icon">💬</span>
                                    <span className="menu-item-text">Обратная связь</span>
                                </button>

                                <div className="user-menu-divider"></div>

                                {/* Выход */}
                                <button className="user-menu-item logout-btn" onClick={handleLogout}>
                                    <span className="menu-item-icon">🚪</span>
                                    <span className="menu-item-text">Выйти</span>
                                </button>

                                {/* Футер меню */}
                                <div className="user-menu-footer">
                                    <div className="app-version">v1.0.0</div>
                                    <div className="app-status">
                                        <span className="status-dot"></span>
                                        Система активна
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;