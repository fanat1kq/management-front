import { useState, useEffect } from 'react';

export const useTasks = (userId) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Демо-задачи
    const demoTasks = [
        {
            id: 1,
            title: 'Добро пожаловать в TaskFlow! 🎯',
            description: 'Это демо-версия приложения для управления задачами. Вы можете добавлять, редактировать и удалять задачи.',
            status: 'NEW',
            priority: 'high',
            createdAt: new Date().toISOString(),
            userId: 1
        },
        {
            id: 2,
            title: 'Создайте свою первую задачу',
            description: 'Используйте поле ввода вверху чтобы добавить новую задачу',
            status: 'IN_PROGRESS',
            priority: 'medium',
            createdAt: new Date().toISOString(),
            userId: 1
        },
        {
            id: 3,
            title: 'Изучите функционал приложения',
            description: 'Перетаскивайте задачи между колонками, редактируйте и удаляйте их',
            status: 'COMPLETED',
            priority: 'low',
            createdAt: new Date().toISOString(),
            userId: 1
        }
    ];

    useEffect(() => {
        // Загружаем демо-задачи с небольшой задержкой
        const timer = setTimeout(() => {
            setTasks(demoTasks);
        }, 300);

        return () => clearTimeout(timer);
    }, [userId]);

    const addTask = async (taskData) => {
        setLoading(true);
        try {
            const newTask = {
                id: Date.now(),
                ...taskData,
                status: 'NEW',
                createdAt: new Date().toISOString(),
                userId: userId || 1
            };

            setTasks(prev => [...prev, newTask]);
            return newTask;
        } finally {
            setLoading(false);
        }
    };

    const updateTask = async (taskId, updates) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
        ));
    };

    const deleteTask = async (taskId) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
    };

    return {
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        loadTasks: () => setTasks(demoTasks) // Простая функция перезагрузки
    };
};