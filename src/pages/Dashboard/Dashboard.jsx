import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    useDroppable,
} from '@dnd-kit/core';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Calendar from '../../components/Calendar';
import './Dashboard.css';
import Application from '../../components/Application'; // или правильный путь к вашему компоненту

// В компоненте Dashboard добавьте условие рендеринга для заявок:


const Dashboard = ({ tasks, onAddTask, onUpdateTask, onDeleteTask, activeMenu, user  }) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskAssignee, setNewTaskAssignee] = useState('');
    const [tasksPerLoad, setTasksPerLoad] = useState(10);
    const [activeDragTask, setActiveDragTask] = useState(null);

    // Список доступных исполнителей
    const availableAssignees = useMemo(() => [
        'Иванов',
        'Петров',
        'Сидоров',
        'Козлова',
        'Смирнов',
        'Васильев'
    ], []);

    // Настройка сенсоров для drag and drop
    // Настройка сенсоров для drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Уменьшите расстояние для более точного срабатывания
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const handleAddTask = () => {
        if (newTaskTitle.trim()) {
            onAddTask({
                title: newTaskTitle.trim(),
                assignee: newTaskAssignee || null,
                description: '',
                priority: 'medium',
                status: 'NEW',
                createdAt: new Date().toISOString()
            });
            setNewTaskTitle('');
            setNewTaskAssignee('');
        }
    };

    // Обработчик перетаскивания между колонками
    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveDragTask(null);

        if (!over) return;

        const activeId = active.id;
        const activeTask = tasks.find(task => task.id === activeId);
        if (!activeTask) return;

        // ОПРАВЛЕННАЯ ЛОГИКА: Ищем колонку, в которую было перетаскивание
        let targetColumnId = over.id;

        // Если перетащили на задачу, а не на колонку, находим родительскую колонку этой задачи
        if (!['new-column', 'active-column', 'completed-column'].includes(over.id)) {
            const overTask = tasks.find(task => task.id === over.id);
            if (overTask) {
                // Определяем ID колонки на основе статуса задачи
                if (overTask.status === 'NEW') targetColumnId = 'new-column';
                else if (overTask.status === 'IN_PROGRESS') targetColumnId = 'active-column';
                else if (overTask.status === 'COMPLETED') targetColumnId = 'completed-column';
            }
        }

        // Определяем целевой статус по ID колонки
        let targetStatus = activeTask.status;

        if (targetColumnId === 'new-column') {
            targetStatus = 'NEW';
        } else if (targetColumnId === 'active-column') {
            targetStatus = 'IN_PROGRESS';
        } else if (targetColumnId === 'completed-column') {
            targetStatus = 'COMPLETED';
        }

        // Обновляем статус задачи
        if (targetStatus !== activeTask.status) {
            onUpdateTask({
                ...activeTask,
                status: targetStatus
            });
        }
    };

    const handleDragStart = (event) => {
        const { active } = event;
        const activeTask = tasks.find(task => task.id === active.id);
        setActiveDragTask(activeTask);
    };

    const handleDragCancel = () => {
        setActiveDragTask(null);
    };

    // Сортируем задачи по дате создания (новые сверху)
    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }, [tasks]);

    const newTasks = sortedTasks.filter(task => task.status === 'NEW');
    const activeTasks = sortedTasks.filter(task => task.status === 'IN_PROGRESS');
    const completedTasks = sortedTasks.filter(task => task.status === 'COMPLETED');

    return (
        <div className="dashboard">
            {activeMenu === 'dashboard' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                        duration: 1.5,
                        type: "spring",
                        stiffness: 100
                    }}
                    className="dashboard-welcome"
                >
                    <div className="welcome-image-container">
                        <motion.img
                            src="/images/man.jpg"
                            alt="Добро пожаловать"
                            className="welcome-image"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.2 }}
                        />
                        {/* Опционально: частицы */}
                        <div className="particles">
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                        </div>
                        <div className="welcome-overlay">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            >
                                Добро пожаловать!
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                            >
                                Выберите раздел в меню для начала работы
                            </motion.p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Задачи */}
            {activeMenu === 'tasks' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="add-task-section">
                        <motion.div
                            className="add-task-card"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="input-group-enhanced">
                                <div className="input-icon">✏️</div>
                                <motion.input
                                    type="text"
                                    placeholder="Что нужно сделать?..."
                                    value={newTaskTitle}
                                    onChange={(event) => setNewTaskTitle(event.target.value)}
                                    onKeyPress={(event) => event.key === 'Enter' && handleAddTask()}
                                    className="task-input-enhanced"
                                    whileFocus={{ scale: 1.02 }}
                                />

                                {/* Селектор исполнителя */}
                                <div className="assignee-selector">
                                    <div className="input-icon">👤</div>
                                    <select
                                        value={newTaskAssignee}
                                        onChange={(e) => setNewTaskAssignee(e.target.value)}
                                        className="assignee-select"
                                    >
                                        <option value="">Без исполнителя</option>
                                        {availableAssignees.map(assignee => (
                                            <option key={assignee} value={assignee}>
                                                {assignee}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <motion.button
                                    onClick={handleAddTask}
                                    className="add-button-enhanced"
                                    disabled={!newTaskTitle.trim()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="button-icon">+</span>
                                    Добавить
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Настройки отображения */}
                        <div className="display-settings">
                            <label>
                                Задач загрузка:
                                <select
                                    value={tasksPerLoad}
                                    onChange={(e) => setTasksPerLoad(Number(e.target.value))}
                                    className="page-select"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                </select>
                            </label>
                            <div className="tasks-stats">
                                Всего задач: {tasks.length}
                            </div>
                        </div>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                    >
                        <div className="tasks-container-enhanced">
                            <div className="tasks-grid-three-columns">
                                <TaskColumn
                                    id="new-column"
                                    title="Новые задачи"
                                    icon="🆕"
                                    tasks={newTasks}
                                    type="new"
                                    onUpdateTask={onUpdateTask}
                                    onDeleteTask={onDeleteTask}
                                    tasksPerLoad={tasksPerLoad}
                                    availableAssignees={availableAssignees}
                                />

                                <TaskColumn
                                    id="active-column"
                                    title="Активные задачи"
                                    icon="🔥"
                                    tasks={activeTasks}
                                    type="active"
                                    onUpdateTask={onUpdateTask}
                                    onDeleteTask={onDeleteTask}
                                    tasksPerLoad={tasksPerLoad}
                                    availableAssignees={availableAssignees}
                                />

                                <TaskColumn
                                    id="completed-column"
                                    title="Выполнено"
                                    icon="✅"
                                    tasks={completedTasks}
                                    type="completed"
                                    onUpdateTask={onUpdateTask}
                                    onDeleteTask={onDeleteTask}
                                    tasksPerLoad={tasksPerLoad}
                                    availableAssignees={availableAssignees}
                                />
                            </div>
                        </div>

                        {/* Overlay для перетаскиваемой задачи */}
                        <DragOverlay
                            dropAnimation={{
                                sideEffects: defaultDropAnimationSideEffects({
                                    styles: {
                                        active: {
                                            opacity: '0.5',
                                        },
                                    },
                                }),
                            }}
                        >
                            {activeDragTask ? (
                                <TaskCardOverlay task={activeDragTask} />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </motion.div>
            )}

            {/* Календарь */}
            {activeMenu === 'calendar' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Calendar />
                </motion.div>
            )}
            {activeMenu === 'application' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Application user={user} />
                </motion.div>
            )}
        </div>
    );
};

// Компонент Droppable колонки
const DroppableColumn = ({ id, children, type }) => {
    const { isOver, setNodeRef } = useDroppable({
        id,
        data: {
            type,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`tasks-column-card ${type}-column ${isOver ? 'drag-over' : ''}`}
            data-column-id={id}
            data-column-type={type}
        >
            {children}
        </div>
    );
};

// Компонент колонки задач
const TaskColumn = ({ id, title, icon, tasks, type, onUpdateTask, onDeleteTask, tasksPerLoad, availableAssignees }) => {
    const [visibleTasksCount, setVisibleTasksCount] = useState(tasksPerLoad);
    const [isLoading, setIsLoading] = useState(false);
    const loadMoreRef = useRef(null);

    useEffect(() => {
        setVisibleTasksCount(tasksPerLoad);
    }, [tasks.length, tasksPerLoad]);

    const visibleTasks = useMemo(() => {
        return tasks.slice(0, visibleTasksCount);
    }, [tasks, visibleTasksCount]);

    const hasMoreTasks = visibleTasksCount < tasks.length;

    const loadMoreTasks = useCallback(() => {
        if (isLoading || !hasMoreTasks) return;
        setIsLoading(true);
        setTimeout(() => {
            setVisibleTasksCount(prev => prev + tasksPerLoad);
            setIsLoading(false);
        }, 300);
    }, [isLoading, hasMoreTasks, tasksPerLoad]);

    useEffect(() => {
        if (!hasMoreTasks) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    loadMoreTasks();
                }
            },
            { rootMargin: '100px', threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [hasMoreTasks, isLoading, loadMoreTasks]);

    const getEmptyState = () => {
        const states = {
            new: { icon: '📝', text: 'Нет новых задач', hint: 'Добавьте новую задачу' },
            active: { icon: '⏳', text: 'Нет активных задач', hint: 'Перетащите сюда задачи' },
            completed: { icon: '🎉', text: 'Задач нет', hint: 'Перетащите сюда выполненные задачи' }
        };
        return states[type] || states.new;
    };

    const emptyState = getEmptyState();

    const handleManualLoadMore = () => {
        loadMoreTasks();
    };

    return (
        <DroppableColumn id={id} type={type}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="column-header">
                    <div className="column-icon">{icon}</div>
                    <div className="column-title">
                        <h2>{title}</h2>
                        <div className="column-stats">
                            <span className="task-count">{tasks.length}</span>
                            {tasks.length > 0 && (
                                <span className="page-info">
                                    {visibleTasks.length} из {tasks.length}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="tasks-list-enhanced infinite-scroll-list">
                    <AnimatePresence mode="popLayout">
                        {tasks.length === 0 ? (
                            <motion.div
                                className="empty-state-card"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <div className="empty-icon">{emptyState.icon}</div>
                                <h3>{emptyState.text}</h3>
                                <p>{emptyState.hint}</p>
                            </motion.div>
                        ) : (
                            <>
                                {visibleTasks.map((task, index) => (
                                    <SortableTaskCard
                                        key={task.id}
                                        task={task}
                                        onUpdate={onUpdateTask}
                                        onDelete={onDeleteTask}
                                        index={index}
                                        availableAssignees={availableAssignees}
                                    />
                                ))}

                                {hasMoreTasks && (
                                    <div ref={loadMoreRef} className="load-more-sentinel" />
                                )}

                                {isLoading && (
                                    <motion.div
                                        className="loading-indicator"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="loading-spinner"></div>
                                        <span>Загрузка задач...</span>
                                    </motion.div>
                                )}

                                {hasMoreTasks && !isLoading && (
                                    <motion.button
                                        className="manual-load-more-btn"
                                        onClick={handleManualLoadMore}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        📥 Загрузить еще {Math.min(tasksPerLoad, tasks.length - visibleTasks.length)} задач
                                    </motion.button>
                                )}

                                {!hasMoreTasks && tasks.length > 0 && (
                                    <motion.div
                                        className="end-of-list-message"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div className="end-icon">🎉</div>
                                        <p>Все задачи загружены!</p>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </DroppableColumn>
    );
};

// Sortable компонент карточки задачи
const SortableTaskCard = ({ task, onUpdate, onDelete, index, availableAssignees }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <TaskCard
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
                index={index}
                availableAssignees={availableAssignees}
                dragHandleListeners={listeners}
                isDragging={isDragging}
            />
        </div>
    );
};

// Компонент карточки задачи
const TaskCard = ({ task, onUpdate, onDelete, index, availableAssignees, dragHandleListeners, isDragging }) => {
    const [isEditingAssignee, setIsEditingAssignee] = useState(false);
    const [currentAssignee, setCurrentAssignee] = useState(task.assignee || '');

    const handleStatusChange = (newStatus) => {
        onUpdate({
            ...task,
            status: newStatus
        });
    };

    const handleDelete = () => {
        onDelete(task.id);
    };

    const handleAssigneeChange = (newAssignee) => {
        onUpdate({
            ...task,
            assignee: newAssignee || null
        });
        setCurrentAssignee(newAssignee);
        setIsEditingAssignee(false);
    };

    const handleAssigneeClick = () => {
        setIsEditingAssignee(true);
    };

    const handleAssigneeBlur = () => {
        setIsEditingAssignee(false);
    };

    return (
        <motion.div
            layout
            initial={{opacity: 0}}
            animate={{opacity: isDragging ? 0.6 : 1}}
            exit={{opacity: 0}}
            className={`task-card ${task.status === 'COMPLETED' ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
        >
            <div className="task-card-header">
                <div
                    className="drag-handle-enhanced"
                    {...dragHandleListeners}
                    style={{cursor: isDragging ? 'grabbing' : 'grab'}}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M10 9h4v-4h-4v4zm0 10h4v-4h-4v4zm-6-6h4v-4h-4v4zm0 10h4v-4h-4v4zm-6-6h4v-4h-4v4zm0 10h4v-4h-4v4z"/>
                    </svg>
                </div>
                <div className={`task-priority ${task.priority || 'medium'}`}></div>
            </div>

            <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                {task.description && (
                    <p className="task-preview">{task.description.substring(0, 60)}...</p>
                )}

                {/* Блок исполнителя */}
                <div className="task-assignee-section">
                    {isEditingAssignee ? (
                        <select
                            value={currentAssignee}
                            onChange={(e) => handleAssigneeChange(e.target.value)}
                            onBlur={handleAssigneeBlur}
                            className="assignee-select-editable"
                            autoFocus
                        >
                            <option value="">Без исполнителя</option>
                            {availableAssignees.map(assignee => (
                                <option key={assignee} value={assignee}>
                                    {assignee}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div
                            className={`task-assignee ${currentAssignee ? 'has-assignee' : 'no-assignee'}`}
                            onClick={handleAssigneeClick}
                            title="Нажмите чтобы изменить исполнителя"
                        >
                            <span className="assignee-icon">👤</span>
                            {currentAssignee ? (
                                <span className="assignee-name">{currentAssignee}</span>
                            ) : (
                                <span className="assignee-placeholder">Назначить</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="task-footer">
                <span className="task-date">
                    {task.createdAt ? new Date(task.createdAt).toLocaleDateString('ru-RU') : 'Сегодня'}
                </span>
                <div className="task-actions">
                    {task.status !== 'COMPLETED' && (
                        <button
                            className="task-action-btn complete-btn"
                            onClick={() => handleStatusChange('COMPLETED')}
                            title="Отметить выполненной"
                        >
                            ✓
                        </button>
                    )}
                    <button
                        className="task-action-btn delete-btn"
                        onClick={handleDelete}
                        title="Удалить задачу"
                    >
                        ×
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Overlay компонент для перетаскивания
const TaskCardOverlay = ({task}) => {
    return (
        <div className="task-card dragging-overlay">
            <div className="task-card-header">
                <div className="drag-handle-enhanced">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 9h4v-4h-4v4zm0 10h4v-4h-4v4zm-6-6h4v-4h-4v4zm0 10h4v-4h-4v4zm-6-6h4v-4h-4v4zm0 10h4v-4h-4v4z"/>
                    </svg>
                </div>
                <div className={`task-priority ${task.priority || 'medium'}`}></div>
            </div>

            <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                {task.description && (
                    <p className="task-preview">{task.description.substring(0, 60)}...</p>
                )}
                {task.assignee && (
                    <div className="task-assignee-section">
                        <div className="task-assignee has-assignee">
                            <span className="assignee-icon">👤</span>
                            <span className="assignee-name">{task.assignee}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Вспомогательная функция для координат клавиатуры
function sortableKeyboardCoordinates(event, args) {
    const { context } = args;
    const { active, collisionRect, droppableRects, droppableContainers } = context;

    if (event.code === 'ArrowDown') {
        return getNextCoordinate('y', 1);
    }

    if (event.code === 'ArrowUp') {
        return getNextCoordinate('y', -1);
    }

    if (event.code === 'ArrowLeft') {
        return getNextCoordinate('x', -1);
    }

    if (event.code === 'ArrowRight') {
        return getNextCoordinate('x', 1);
    }

    function getNextCoordinate(axis, direction) {
        const activeRect = collisionRect;
        const activeCenter = {
            x: activeRect.left + activeRect.width / 2,
            y: activeRect.top + activeRect.height / 2,
        };

        const candidates = droppableContainers
            .map((container) => {
                const rect = droppableRects.get(container.id);

                if (!rect) {
                    return null;
                }

                const containerCenter = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                };

                if (axis === 'x') {
                    if (
                        (direction === 1 && containerCenter.x <= activeCenter.x) ||
                        (direction === -1 && containerCenter.x >= activeCenter.x)
                    ) {
                        return null;
                    }
                } else {
                    if (
                        (direction === 1 && containerCenter.y <= activeCenter.y) ||
                        (direction === -1 && containerCenter.y >= activeCenter.y)
                    ) {
                        return null;
                    }
                }

                const distance = Math.sqrt(
                    Math.pow(containerCenter.x - activeCenter.x, 2) +
                    Math.pow(containerCenter.y - activeCenter.y, 2)
                );

                return {
                    id: container.id,
                    distance,
                };
            })
            .filter(Boolean)
            .sort((a, b) => a.distance - b.distance);

        if (candidates.length > 0) {
            return {
                x: candidates[0].id === 'new-column' ? 0 :
                    candidates[0].id === 'active-column' ? 400 : 800,
                y: 0,
            };
        }

        return null;
    }

    return null;
}

export default Dashboard;