// Форматирование даты
export const formatDate = (dateString) => {
    if (!dateString) return 'Сегодня';

    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Вчера';
    } else {
        return date.toLocaleDateString('ru-RU');
    }
};

// Валидация email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Генерация уникального ID
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};