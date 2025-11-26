import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useTasks } from './hooks';
import { SidebarMenu, Header } from './components/layout';
import { Dashboard } from './pages';
import './styles/globals.css';
import './styles/variables.css';
import './styles/animations.css';

function App() {
    const { isAuthenticated, user, loading, logout } = useAuth();
    const { tasks, addTask, updateTask, deleteTask } = useTasks(user?.id);

    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const [isMenuExpanded, setIsMenuExpanded] = useState(true);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Переключение между развернутым/свернутым состоянием
    const toggleMenuExpanded = () => {
        setIsMenuExpanded(!isMenuExpanded);
    };

    // Переключение видимости меню
    const toggleMenuVisibility = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    // Полное скрытие меню
    const hideMenu = () => {
        setIsMenuVisible(false);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                color: 'white',
                fontSize: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                Загрузка демо-режима...
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                color: 'white',
                fontSize: '18px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textAlign: 'center',
                padding: '20px'
            }}>
                <div>
                    <h1>🎯 TaskFlow</h1>
                    <p>Ошибка авторизации в демо-режиме</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            marginTop: '20px',
                            background: 'white',
                            color: '#667eea',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Перезагрузить
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="animated-background">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                    <div className="shape shape-5"></div>
                </div>
            </div>

            {/* Кнопка переключения меню - ВСЕГДА ВИДИМА */}
            <motion.button
                className="menu-show-btn"
                onClick={toggleMenuVisibility}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400 }}
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '150px',
                    zIndex: 10000,
                    background: isMenuVisible
                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    width: '50px',
                    height: '50px',
                    color: 'white',
                    fontSize: '20px',
                    cursor: 'pointer',
                    boxShadow: isMenuVisible
                        ? '0 4px 15px rgba(239, 68, 68, 0.4)'
                        : '0 4px 15px rgba(102, 126, 234, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {isMenuVisible ? '✕' : '☰'}
            </motion.button>

            {/* Меню */}
            <AnimatePresence>
                {isMenuVisible && (
                    <SidebarMenu
                        isExpanded={isMenuExpanded}
                        onToggle={toggleMenuExpanded}
                        onHide={hideMenu}
                        activeMenu={activeMenu}
                        onMenuSelect={setActiveMenu}
                        user={user}
                    />
                )}
            </AnimatePresence>

            <div className={`main-content-with-menu ${isMenuVisible ? (isMenuExpanded ? 'menu-expanded' : 'menu-collapsed') : 'menu-hidden'}`}>
                <Header
                    user={user}
                    onLogout={logout}
                    onProfileOpen={() => setIsProfileOpen(true)}
                />

                <main className="main-content">
                    <div className="container">
                        {/* Демо-баннер */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                padding: '15px 20px',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            <p style={{
                                color: 'white',
                                margin: 0,
                                fontSize: '14px',
                                textAlign: 'center'
                            }}>

                            </p>
                        </motion.div>

                        <Dashboard
                            tasks={tasks}
                            onAddTask={addTask}
                            onUpdateTask={updateTask}
                            onDeleteTask={deleteTask}
                            activeMenu={activeMenu}
                            user={user}
                        />
                    </div>
                </main>
            </div>
        </motion.div>
    );
}

export default App;