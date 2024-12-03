'use client';

import { useState, useEffect } from 'react';

// Task interface
interface Todo {
  text: string;
  completed: boolean;
  category: string;
  dueDate: string;
  priority: string;
  notes: string;
}

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [sortByPriority, setSortByPriority] = useState(false); // New state for sorting

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }

    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    // Apply dark mode to body element
    if (savedDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newTask: Todo = {
        text: newTodo,
        completed: false,
        category,
        dueDate,
        priority,
        notes,
      };
      setTodos([...todos, newTask]);
      setNewTodo('');
      setCategory('Work');
      setDueDate('');
      setPriority('Medium');
      setNotes('');
    }
  };

  // Edit a todo
  const editTodo = (index: number) => {
    const todo = todos[index];
    setNewTodo(todo.text);
    setCategory(todo.category);
    setDueDate(todo.dueDate);
    setPriority(todo.priority);
    setNotes(todo.notes);
    removeTodo(index); // Remove the todo after editing it
  };

  // Remove a todo
  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  // Toggle task completion
  const toggleComplete = (index: number) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  // Helper function to get priority styles
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500 text-white';
      case 'Medium':
        return 'bg-yellow-500 text-white';
      case 'Low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Function to sort by priority
  const sortTodosByPriority = (todos: Todo[]) => {
    const priorityOrder: { [key: string]: number } = {
      High: 1,
      Medium: 2,
      Low: 3,
    };
    return todos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  // Filter todos based on search term, filter, and sort by priority if enabled
  const filteredTodos = todos
    .filter((todo) => {
      if (filter === 'Active' && todo.completed) return false;
      if (filter === 'Completed' && !todo.completed) return false;
      if (filter !== 'All' && todo.category !== filter) return false;
      return true;
    })
    .filter((todo) => todo.text.toLowerCase().includes(searchTerm.toLowerCase()));

  // Apply sorting when toggling priority sort
  const sortedTodos = sortByPriority ? sortTodosByPriority(filteredTodos) : filteredTodos;

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} dark:text-white transition-all duration-500`}
    >
      <div className="container max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white transition-all duration-500">My To-Do List</h1>

        {/* Dark Mode Toggle Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleDarkMode}
            className="p-3 bg-blue-500 text-white rounded-full shadow-md dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300"
          >
            {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 p-3 rounded-lg w-2/3 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="Search tasks..."
          />
        </div>

        {/* Input Section */}
        <div className="mb-6 flex flex-wrap justify-center gap-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="border-2 p-3 rounded-lg w-2/3 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="New Task"
          />
          <select
            className="border-2 p-3 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border-2 p-3 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border-2 p-3 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border-2 p-3 rounded-lg w-2/3 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="Notes"
          />
          <button
            onClick={addTodo}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md dark:bg-green-600 dark:hover:bg-green-700 transition-all duration-300"
          >
            Add Task
          </button>
        </div>

        {/* Filter Section */}
        <div className="mb-6 flex justify-center gap-4">
          <select
            className="border-2 p-3 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
          </select>

          {/* Sort by Priority Button */}
          <button
            onClick={() => setSortByPriority(!sortByPriority)}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow-md dark:bg-purple-600 dark:hover:bg-purple-700 transition-all duration-300"
          >
            {sortByPriority ? 'Sort by Default' : 'Sort by Priority'}
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-4">
          {sortedTodos.map((todo, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded-lg shadow-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(index)}
                    className="mr-3 transition-all duration-300"
                  />
                  <span className={todo.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}>
                    {todo.text}
                  </span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => editTodo(index)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md dark:bg-yellow-600 dark:hover:bg-yellow-700 transition-all ml-5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeTodo(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md dark:bg-red-600 dark:hover:bg-red-700 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                <p>Priority: <span className={`px-3 py-1 rounded-full ${getPriorityClass(todo.priority)}`}>{todo.priority}</span></p>
                <p>Due Date: {todo.dueDate}</p>
                <p>Notes: {todo.notes}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
