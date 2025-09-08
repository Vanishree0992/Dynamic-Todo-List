import React, { useState, useEffect, useRef } from "react";

export default function TodoApp() {
  // Load from localStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem("todo.tasks");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todo.tasks", JSON.stringify(tasks));
  }, [tasks]);

  function makeId() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function addTask(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) {
      setError("Please enter a task");
      inputRef.current?.focus();
      return;
    }
    setTasks([{ id: makeId(), text, done: false }, ...tasks]);
    setInput("");
    setError("");
  }

  function toggleDone(id) {
    setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  function clearCompleted() {
    setTasks(tasks.filter(t => !t.done));
  }

  function clearAll() {
    if (confirm("Delete ALL tasks?")) setTasks([]);
  }

  const remaining = tasks.filter(t => !t.done).length;

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-lg">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dynamic Todo List</h1>
          <p className="text-sm text-gray-500">Add, complete, and remove tasks — saved locally.</p>
        </div>
        <div className="text-sm text-gray-500">{tasks.length} total</div>
      </header>

      <form onSubmit={addTask} className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="What do you want to do?"
          className="input-focus flex-1 rounded-lg border border-gray-200 px-4 py-2 shadow-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition"
        >
          Add
        </button>
      </form>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      <ul className="mt-4 space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleDone(task.id)}
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  task.done ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-gray-200 text-gray-500"
                }`}
              >
                {task.done ? "✓" : "+"}
              </button>
              <span className={`text-sm ${task.done ? "line-through text-gray-400" : "text-gray-700"}`}>
                {task.text}
              </span>
            </div>
            <button onClick={() => removeTask(task.id)} className="text-red-500 hover:text-red-700">✕</button>
          </li>
        ))}
        {tasks.length === 0 && <li className="p-4 text-center text-sm text-gray-500">No tasks yet</li>}
      </ul>

      <footer className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">{remaining} remaining</div>
        <div className="flex gap-2">
          <button onClick={clearCompleted} className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
            Clear completed
          </button>
          <button onClick={clearAll} className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100">
            Clear all
          </button>
        </div>
      </footer>
    </div>
  );
}
