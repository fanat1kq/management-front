import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import './Application.css';

const Application = ({ user }) => {
    const [applications, setApplications] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        reason: '',
        description: ''
    });

    // Добавление новой заявки
    const handleSubmit = (e) => {
        e.preventDefault();

        const newApplication = {
            id: Date.now(),
            ...formData,
            applicant: user?.name || 'Неизвестный сотрудник',
            createdAt: new Date().toISOString(),
            applicantId: user?.id || 'unknown'
        };

        setApplications(prev => [newApplication, ...prev]);
        setFormData({
            reason: '',
            description: ''
        });
        setShowForm(false);
    };

    // Удаление заявки
    const handleDelete = (applicationId) => {
        setApplications(prev => prev.filter(app => app.id !== applicationId));
    };

    return (
        <motion.div
            className="application"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Заголовок */}
            <div className="application-header">
                <h1>📋 Заявки</h1>
                <p>Управление заявками сотрудников</p>
            </div>

            {/* Кнопка добавления */}
            <div className="application-actions">
                <motion.button
                    className="add-application-btn"
                    onClick={() => setShowForm(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="btn-icon">+</span>
                    Создать заявку
                </motion.button>
            </div>

            {/* Форма добавления заявки */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        className="application-form-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            className="application-form"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="form-header">
                                <h3>📝 Новая заявка</h3>
                                <button
                                    className="close-form-btn"
                                    onClick={() => setShowForm(false)}
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Причина:</label>
                                    <input
                                        type="text"
                                        placeholder="Краткая причина заявки..."
                                        value={formData.reason}
                                        onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Описание:</label>
                                    <textarea
                                        placeholder="Подробное описание заявки..."
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows="4"
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        type="submit"
                                        className="submit-btn"
                                    >
                                        Отправить заявку
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Список заявок */}
            <div className="applications-container">
                <div className="applications-section">
                    <h3 className="section-title">
                        📋 Все заявки ({applications.length})
                    </h3>
                    <div className="applications-grid">
                        {applications.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📭</div>
                                <p>Нет созданных заявок</p>
                            </div>
                        ) : (
                            applications.map(application => (
                                <ApplicationCard
                                    key={application.id}
                                    application={application}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Компонент карточки заявки
const ApplicationCard = ({
                             application,
                             onDelete
                         }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <motion.div
            className="application-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <div className="card-header">
                <div className="application-applicant">
                    <span className="applicant-icon">👤</span>
                    <span className="applicant-name">{application.applicant}</span>
                </div>
            </div>

            <div className="card-content">
                <h4 className="application-reason">{application.reason}</h4>
                <div className="application-meta">
                    <small>
                        Создано: {new Date(application.createdAt).toLocaleDateString('ru-RU')}
                    </small>
                </div>
            </div>

            <div className="card-actions">
                <button
                    className="details-btn"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? 'Скрыть' : 'Подробнее'}
                </button>
                <button
                    className="delete-btn"
                    onClick={() => onDelete(application.id)}
                >
                    Удалить
                </button>
            </div>

            <AnimatePresence>
                {showDetails && application.description && (
                    <motion.div
                        className="card-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <p>{application.description}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Application;