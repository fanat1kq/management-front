import { motion, AnimatePresence } from 'framer-motion';
import './SidebarMenu.css';

const SidebarMenu = ({
                         isExpanded,
                         onToggle,
                         activeMenu,
                         onMenuSelect,
                         user
                     }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Главная', icon: '📊' },
        { id: 'tasks', label: 'Задачи', icon: '✅' },
        { id: 'calendar', label: 'Календарь', icon: '📅' },
        { id: 'application', label: 'Заявки', icon: '📈' },
        { id: 'team', label: 'Команда', icon: '👥' },
        { id: 'settings', label: 'Настройки', icon: '⚙️' }
    ];

    return (
        <>
            {/* ОТДЕЛЬНАЯ КНОПКА - ВНЕ САЙДБАРА, ВСЕГДА ВИДИМА */}
            {/* СОВРЕМЕННАЯ КНОПКА С АНИМАЦИЕЙ */}
            <motion.button
                onClick={onToggle}
                className="menu-toggle-button"
                whileHover={{
                    scale: 1.05,
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 20
                }}
                style={{
                    position: 'fixed',
                    top: '24px',
                    left: isExpanded ? '284px' : '74px',
                    zIndex: 10000,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    boxShadow: `
            0 3px 12px rgba(102, 126, 234, 0.3),
            0 0 0 1.5px rgba(255, 255, 255, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.4)
        `,
                    transition: 'all 0.3s ease'
                }}
            >
                <motion.span
                    key={isExpanded ? "expanded" : "collapsed"}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                >
                    {isExpanded ? '‹' : '›'}
                </motion.span>
            </motion.button>

            {/* Сайдбар */}
            <motion.div
                className={`sidebar-menu ${isExpanded ? 'expanded' : 'collapsed'}`}
                initial={false}
                animate={{ x: 0 }}
            >
                {/* Заголовок меню */}
                <div className={`menu-header ${!isExpanded ? 'collapsed' : ''}`}>
                    <motion.div
                        className="menu-logo"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <img
                            src="/images/logo.svg"
                            alt="Vnk Logo"
                            className="logo-image"
                        />
                    </motion.div>
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.span
                                className="menu-title"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                Vnk
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Навигация */}
                <nav className="menu-nav">
                    {menuItems.map((item, index) => (
                        <motion.button
                            key={item.id}
                            className={`menu-item ${!isExpanded ? 'collapsed' : ''} ${activeMenu === item.id ? 'active' : ''}`}
                            onClick={() => onMenuSelect(item.id)}
                            whileHover={{
                                scale: isExpanded ? 1.02 : 1.1,
                                x: isExpanded ? 4 : 0
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                delay: index * 0.02
                            }}
                        >
                            <motion.span
                                className="menu-icon"
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                {item.icon}
                            </motion.span>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.span
                                        className="menu-text"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{
                                            duration: 0.2,
                                            delay: index * 0.02
                                        }}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {activeMenu === item.id && isExpanded && (
                                    <motion.div
                                        className="active-indicator"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ type: "spring", stiffness: 500 }}
                                    />
                                )}
                            </AnimatePresence>
                        </motion.button>
                    ))}
                </nav>

                {/* Футер меню */}
                <div className={`menu-footer ${!isExpanded ? 'collapsed' : ''}`}>
                    <div className="user-avatar">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    {isExpanded && (
                        <div className="user-info">
                            <div className="user-name">{user?.name || 'Пользователь'}</div>
                            <div className="user-email">{user?.email || 'user@example.com'}</div>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default SidebarMenu;