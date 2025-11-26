import { motion, AnimatePresence } from 'framer-motion';
import './SidebarMenu.css';

const SidebarMenu = ({
                         isExpanded,
                         onToggle,
                         activeMenu,
                         onMenuSelect,
                         isVisible,
                         onHide,
                         onShow
                     }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Главная', icon: '📊' },
        { id: 'tasks', label: 'Задачи', icon: '✅' },
        { id: 'calendar', label: 'Календарь', icon: '📅' },
        { id: 'application', label: 'Заявки', icon: '📈' },
        { id: 'team', label: 'Команда', icon: '👥' },
        { id: 'settings', label: 'Настройки', icon: '⚙️' }
    ];

    // Если меню полностью скрыто, показываем только кнопку для его открытия
    if (!isVisible) {
        return (
            <motion.button
                className="menu-show-btn"
                onClick={onShow}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400 }}
            >
                ☰
            </motion.button>
        );
    }

    return (
        <motion.div
            className={`sidebar-menu ${isExpanded ? 'expanded' : 'collapsed'} ${!isVisible ? 'hidden' : ''}`}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
            }}
        >
            {/* Кнопка переключения размера */}
            <motion.button
                className="menu-toggle-btn"
                onClick={onToggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <motion.span
                    animate={{ rotate: isExpanded ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                >
                    {isExpanded ? '‹' : '›'}
                </motion.span>
            </motion.button>

            {/* Кнопка закрытия меню */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.button
                        className="menu-close-btn"
                        onClick={onHide}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        ×
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Заголовок меню */}
            {/* Заголовок меню */}
            <div className={`menu-header ${!isExpanded ? 'collapsed' : ''}`}>
                <motion.div
                    className="menu-logo"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                >
                    <img
                        src="/images/logo.svg" // Путь от папки public
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

                        {/* Индикатор активного меню */}
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

            {/* Декоративные элементы */}
            <AnimatePresence>
                {isExpanded && (
                    <>
                        <motion.div
                            className="menu-decoration-1"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.7 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        />
                        <motion.div
                            className="menu-decoration-2"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.7 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        />
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SidebarMenu;