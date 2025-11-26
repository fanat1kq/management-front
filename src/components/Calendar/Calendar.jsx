import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import './Calendar.css';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookings, setBookings] = useState({});
    const [shiftSchedule, setShiftSchedule] = useState({
        dayShift: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        cycle: [1, 0, 2, 3] // День → Ночь → Отсыпной → Выходной
    });

    // Доступные сотрудники
    const availableEmployees = useMemo(() => [
        { id: 1, name: 'Иванов', color: '#3B82F6' },
        { id: 2, name: 'Петров', color: '#EF4444' },
        { id: 3, name: 'Сидоров', color: '#10B981' },
        { id: 4, name: 'Козлова', color: '#8B5CF6' },
        { id: 5, name: 'Смирнов', color: '#F59E0B' }
    ], []);

    // Генерация дней месяца
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        const days = [];

        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    // Определение типа смены для даты
    const getShiftType = (date) => {
        if (!date) return null;

        const startDate = new Date(shiftSchedule.dayShift);
        startDate.setHours(0, 0, 0, 0);

        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const diffTime = targetDate - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'unknown';

        const cycleIndex = diffDays % shiftSchedule.cycle.length;
        const shiftCode = shiftSchedule.cycle[cycleIndex];

        const shiftTypes = {
            0: 'night',
            1: 'day',
            2: 'rest',
            3: 'off'
        };

        return shiftTypes[shiftCode] || 'unknown';
    };

    // Получение названия смены
    const getShiftName = (shiftType) => {
        const names = {
            'day': 'День',
            'night': 'Ночь',
            'rest': 'Отсыпной',
            'off': 'Выходной',
            'unknown': 'Неизвестно'
        };
        return names[shiftType];
    };

    // Получение цвета смены
    const getShiftColor = (shiftType) => {
        const colors = {
            'day': '#3B82F6',
            'night': '#1E293B',
            'rest': '#10B981',
            'off': '#F59E0B',
            'unknown': '#6B7280'
        };
        return colors[shiftType];
    };

    // Бронирование выходного - ТЕПЕРЬ НЕСКОЛЬКО ЧЕЛОВЕК
    const bookDayOff = (date, employeeId) => {
        if (!date) return;

        const dateKey = date.toISOString().split('T')[0];
        const employee = availableEmployees.find(emp => emp.id === employeeId);

        if (employee) {
            setBookings(prev => {
                const currentBookings = prev[dateKey] || [];

                // Проверяем, не забронировал ли уже этот сотрудник
                if (currentBookings.some(booking => booking.employeeId === employeeId)) {
                    return prev; // Уже забронировал
                }

                return {
                    ...prev,
                    [dateKey]: [
                        ...currentBookings,
                        {
                            employeeId: employee.id,
                            employeeName: employee.name,
                            employeeColor: employee.color,
                            bookedAt: new Date()
                        }
                    ]
                };
            });
        }
    };

    // Отмена бронирования - ТЕПЕРЬ ОТДЕЛЬНОГО СОТРУДНИКА
    const cancelBooking = (date, employeeId = null) => {
        if (!date) return;

        const dateKey = date.toISOString().split('T')[0];
        setBookings(prev => {
            const newBookings = { ...prev };

            if (employeeId) {
                // Отмена конкретного сотрудника
                const dateBookings = newBookings[dateKey];
                if (dateBookings) {
                    const filteredBookings = dateBookings.filter(booking => booking.employeeId !== employeeId);
                    if (filteredBookings.length === 0) {
                        delete newBookings[dateKey];
                    } else {
                        newBookings[dateKey] = filteredBookings;
                    }
                }
            } else {
                // Отмена всех бронирований на эту дату
                delete newBookings[dateKey];
            }

            return newBookings;
        });
    };

    // Получение бронирований для даты
    const getBookingsForDate = (date) => {
        if (!date) return [];
        const dateKey = date.toISOString().split('T')[0];
        return bookings[dateKey] || [];
    };

    // Установка начала дневной смены
    const setDayShiftStart = (date) => {
        setShiftSchedule(prev => ({
            ...prev,
            dayShift: new Date(date)
        }));
    };

    // Переход к предыдущему месяцу
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Переход к следующему месяцу
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const days = getDaysInMonth(currentDate);
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    return (
        <motion.div
            className="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="calendar-header">
                <h2>📅 Календарь выходных</h2>
                <p>Бронирование выходных дней для сотрудников</p>
            </div>

            <div className="calendar-container">
                {/* Настройки графика */}
                <div className="schedule-settings">
                    <h4>Настройки графика смен:</h4>
                    <div className="schedule-inputs">
                        <label>
                            Начало дневной смены:
                            <input
                                type="date"
                                value={shiftSchedule.dayShift.toISOString().split('T')[0]}
                                onChange={(e) => setDayShiftStart(new Date(e.target.value))}
                                className="date-input"
                            />
                        </label>
                        <div className="cycle-info">
                            <span>Цикл: День → Ночь → Отсыпной → Выходной</span>
                        </div>
                    </div>
                </div>

                {/* Навигация по месяцам */}
                <div className="calendar-navigation">
                    <button onClick={prevMonth} className="nav-button">
                        ‹
                    </button>
                    <h3 className="current-month">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <button onClick={nextMonth} className="nav-button">
                        ›
                    </button>
                </div>

                {/* Заголовки дней недели */}
                <div className="calendar-grid">
                    {dayNames.map(day => (
                        <div key={day} className="day-header">
                            {day}
                        </div>
                    ))}

                    {/* Дни месяца */}
                    {days.map((date, index) => {
                        if (!date) {
                            return <div key={index} className="calendar-day empty"></div>;
                        }

                        const dateKey = date.toISOString().split('T')[0];
                        const dateBookings = getBookingsForDate(date);
                        const shiftType = getShiftType(date);
                        const shiftName = getShiftName(shiftType);
                        const shiftColor = getShiftColor(shiftType);
                        const isToday = new Date().toDateString() === date.toDateString();
                        const hasBookings = dateBookings.length > 0;

                        return (
                            <div
                                key={index}
                                className={`calendar-day ${shiftType}-shift ${hasBookings ? 'booked' : ''} ${isToday ? 'today' : ''}`}
                                style={{
                                    '--shift-color': shiftColor,
                                    '--employee-color': hasBookings ? dateBookings[0].employeeColor : 'transparent'
                                }}
                                onClick={() => setSelectedDate(date)}
                            >
                                {date && (
                                    <>
                                        <span className="day-number">{date.getDate()}</span>
                                        <div className="day-info">
                                            <div className="shift-indicator" title={shiftName}></div>
                                            {hasBookings && (
                                                <div
                                                    className="booking-indicator"
                                                    title={`Забронировано: ${dateBookings.length} сотрудник(ов)`}
                                                >
                                                    {dateBookings.length > 1 && (
                                                        <span style={{
                                                            fontSize: '6px',
                                                            color: 'white',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {dateBookings.length}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {isToday && <div className="today-indicator"></div>}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Легенда */}
                <div className="calendar-legend">
                    <div className="legend-section">
                        <h5>Смены:</h5>
                        <div className="legend-items">
                            <div className="legend-item">
                                <div className="legend-color day-shift"></div>
                                <span>День</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color night-shift"></div>
                                <span>Ночь</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color rest-shift"></div>
                                <span>Отсыпной</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color off-shift"></div>
                                <span>Выходной</span>
                            </div>
                        </div>
                    </div>
                    <div className="legend-section">
                        <h5>Статус:</h5>
                        <div className="legend-items">
                            <div className="legend-item">
                                <div className="legend-color today"></div>
                                <span>Сегодня</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color booked"></div>
                                <span>Забронировано</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Информация о выбранной дате */}
                {selectedDate && (
                    <motion.div
                        className="selected-date-info"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h4>📅 {selectedDate.toLocaleDateString('ru-RU', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</h4>

                        <div className="shift-info">
                            <strong>Смена:</strong>
                            <span className={`shift-type ${getShiftType(selectedDate)}-shift`}>
                                {getShiftName(getShiftType(selectedDate))}
                            </span>
                        </div>

                        {getBookingsForDate(selectedDate).length > 0 ? (
                            <div className="booking-info">
                                <div className="booking-header">
                                    <strong>Забронировано ({getBookingsForDate(selectedDate).length}):</strong>
                                    <button
                                        className="cancel-booking-btn"
                                        onClick={() => cancelBooking(selectedDate)}
                                    >
                                        Отменить все
                                    </button>
                                </div>
                                <div className="bookings-list-mini">
                                    {getBookingsForDate(selectedDate).map(booking => (
                                        <div key={booking.employeeId} className="employee-badge">
                                            <div
                                                className="employee-color"
                                                style={{ backgroundColor: booking.employeeColor }}
                                            ></div>
                                            <span>{booking.employeeName}</span>
                                            <button
                                                className="cancel-booking-btn small"
                                                onClick={() => cancelBooking(selectedDate, booking.employeeId)}
                                                title="Отменить бронь"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="booking-actions">
                                <h5>Забронировать выходной:</h5>
                                <div className="employees-grid">
                                    {availableEmployees.map(employee => (
                                        <button
                                            key={employee.id}
                                            className="employee-btn"
                                            style={{ '--employee-color': employee.color }}
                                            onClick={() => bookDayOff(selectedDate, employee.id)}
                                        >
                                            <div className="employee-color" style={{ backgroundColor: employee.color }}></div>
                                            {employee.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Общий список бронирований */}
                <div className="bookings-list">
                    <h4>Активные бронирования:</h4>
                    {Object.keys(bookings).length === 0 ? (
                        <p className="no-bookings">Нет активных бронирований</p>
                    ) : (
                        <div className="bookings-grid">
                            {Object.entries(bookings).map(([date, dateBookings]) => (
                                <div key={date} className="booking-date-group">
                                    <div className="booking-date-header">
                                        <strong>{new Date(date).toLocaleDateString('ru-RU')}</strong>
                                        <button
                                            className="cancel-booking-btn small"
                                            onClick={() => cancelBooking(new Date(date))}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    {dateBookings.map(booking => (
                                        <div key={booking.employeeId} className="booking-item">
                                            <div className="booking-employee">
                                                <div
                                                    className="employee-color"
                                                    style={{ backgroundColor: booking.employeeColor }}
                                                ></div>
                                                {booking.employeeName}
                                            </div>
                                            <button
                                                className="cancel-booking-btn small"
                                                onClick={() => cancelBooking(new Date(date), booking.employeeId)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Calendar;