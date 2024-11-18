import './reset.css';
import './App.css';
import TodoForm from './components/Todoform.js';
import TodoList from './components/TodoList.js';
import CheckAllAndRemaining from './components/CheckAllAndRemaining.js';
import TodoFilter from './components/TodoFilter.js';
import ClearCompletedBtn from './components/ClearCompletedBtn.js';
import { useCallback, useEffect, useState } from 'react';

function App() {

  let [todos, setTodos] = useState([]); 
  let [filteredTodos, setFilteredTodos] = useState(todos); 

  useEffect(() => {
    fetch('http://localhost:8000/todos')
    .then(res => res.json())
    .then((todos) => {
      setTodos(todos);
      setFilteredTodos(todos);
    })
  }, [])


  // filteredBy
  let filteredBy = useCallback(
    (filter) => {
      if(filter === 'All') {
        setFilteredTodos(todos);
      }
      if(filter === 'Active') {
        setFilteredTodos(todos.filter(t => !t.completed));
      }
      if(filter === 'Completed') {
        setFilteredTodos(todos.filter(t => t.completed));
      }
    }, [todos]
  )


  // Add Todo

  let addTodo = (todo) => {
    // update data at server side
    fetch('http://localhost:8000/todos', {
      method: "POST",
      headers: {
        "Content-type" : "application/json"
      },
      body: JSON.stringify(todo)
    })
    // update data at client side
    setTodos(prevState => [...prevState, todo])
  }


  // deleteTodo
  let deleteTodo = (todoId) => {
    // server
    fetch(`http://localhost:8000/todos/${todoId}`,{
      method : "DELETE"
    })
    // client
    setTodos(prevState => {
      return prevState.filter(todo => {
        return todo.id !== todoId;
      });
    })
  }


  
  // update todo
  let updateTodo = (todo) => {
    // server
    fetch(`http://localhost:8000/todos/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-type" : "application/json"
      },
      body: JSON.stringify(todo)
    })
    // client
    setTodos(prevState => {
      return prevState.map(t => {
        if(t.id === todo.id) {
          return todo
        }
        return t;
      }); // [updatedTodo, todo, todo]
    })
  }


  // remaining count
  let remainingCount = todos.filter(t => !t.completed).length


  // checking todos
  let checkAll = () => {
    // server 
    todos.forEach(t => {
      t.completed = true;
      updateTodo(t)
    })
    // client
    setTodos((prevState) => {
      return prevState.map(t => {
        return {...t,completed : true};
      })
    })
    // todos.forEach(t => {
    //   t.completed = true;  
    // })
  }



  // clear completed
  
  let clearCompleted = () => {
    // server
    todos.forEach(t => {
      if(t.completed) {
        deleteTodo(t.id)
      }
    })
    // client
    setTodos(prevState => {
      return prevState.filter(t => !t.completed)
    }) 
  }



  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo App</h2>

        <TodoForm addTodo={addTodo}/>
        

        <TodoList todos = {filteredTodos} deleteTodo = {deleteTodo}  updateTodo={updateTodo} />
        

        <CheckAllAndRemaining remainingCount={remainingCount} checkAll={checkAll} />
        

        <div className="other-buttons-container">

          <TodoFilter filteredBy={filteredBy}/>
          

          <ClearCompletedBtn clearCompleted={clearCompleted} />
          

        </div>
      </div>
    </div>
  );
}

export default App;
