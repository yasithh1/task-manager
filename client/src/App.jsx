import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (title) => {
    try {
      const newTask = await createTask(title);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (task) => {
    try {
      const updated = await updateTask(task._id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (id, title) => {
  try {
    const updated = await updateTask(id, { title });
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  } catch (err) {
    setError(err.message);
  }
};

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm onAdd={handleAdd} />
      {error && <p>{error}</p>}
      {tasks.length === 0 && <p>No tasks yet.</p>}
      <ul>
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;