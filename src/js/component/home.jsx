import React, { useState, useEffect } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("https://playground.4geeks.com/todo/users/kaylaa", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        setTodos(data.todos || []);
      } catch (error) {
        console.error("Failed to fetch todos", error);
      }
    };
    fetchTodos();
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const addTodo = async (event) => {
    if (event.keyCode === 13 && inputValue.trim()) {
      const newTodo = {
        label: inputValue, 
        done: false,       
      };
  
      try {
        const response = await fetch("https://playground.4geeks.com/todo/todos/kaylaa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        const addedTodo = await response.json();
        setTodos(prevTodos => [...prevTodos, {...addedTodo, id: addedTodo.id || Date.now()}]);
        setInputValue("");
      } catch (error) {
        console.error("Error adding todo", error);
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo", error);
    }
  };

  const handleUpdateTask = async (id) => {
    const updatedTodo = todos.find((todo) => todo.id === id);
    if (!updatedTodo) return;

    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedTodo, completed: !updatedTodo.completed }),
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    } catch (error) {
      console.error("Error updating todo", error);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h1>My Todos</h1>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={addTodo}
        placeholder="What do you need to do?"
        style={{ margin: "20px 0", padding: "10px", width: "80%" }}
      />
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "15px" }}>
            <span style={{marginRight: "10px"}}>{todo.label}</span>
            <button onClick={() => handleUpdateTask(todo.id)} style={{ margin: "0 10px" }}>
              {todo.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;