import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Автоматическая авторизация через 500ms для плавности
        const timer = setTimeout(() => {
            console.log('🔐 Демо-режим: автоматический вход');

            const demoUser = {
                id: 1,
                username: 'demo-user',
                email: 'demo@taskflow.ru',
                name: 'Демо Пользователь',
                avatar: '👤',
                joinDate: new Date().toLocaleDateString('ru-RU'),
                role: 'Пользователь',
                department: 'Отдел разработки'
            };

            setUser(demoUser);
            setIsAuthenticated(true);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const login = async (credentials) => {
        setLoading(true);
        try {
            console.log('🔐 Демо-вход:', credentials);

            const demoUser = {
                id: 1,
                username: credentials.username || 'user',
                email: `${credentials.username || 'user'}@taskflow.ru`,
                name: credentials.username || 'Пользователь',
                avatar: '👤',
                joinDate: new Date().toLocaleDateString('ru-RU'),
                role: 'Пользователь',
                department: 'Отдел разработки'
            };

            setUser(demoUser);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            console.log('📝 Демо-регистрация:', userData);

            // Просто логинимся с теми же данными
            return await login({
                username: userData.username,
                password: userData.password
            });
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        console.log('🚪 Демо-выход');
        // В демо-режиме не выходим, просто обновляем страницу
        window.location.reload();
    };

    return {
        isAuthenticated,
        user,
        loading,
        login,
        register,
        logout
    };
};