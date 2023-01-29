import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Pagination, Table } from "react-bootstrap";

function App() {
  const [todos, setTodos] = useState([]);
  // const [paginate, setPaginate] = useState([]);
  const [page, setPage] = useState(1);
  const getTodos = async () => {
    try {
      const { data } = await axios(
        "https://jsonplaceholder.typicode.com/todos"
      );
      setTodos(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  // useEffect(() => {
  //   const help = [];
  //   for (let index = 0; index < todos.length / 20; index++) {
  //     help.push(index + 1);
  //   }
  //   setPaginate(help);
  // }, [todos]);

  const paginate = useMemo(() => {
    const help = [];
    for (let index = 0; index < todos.length / 20; index++) {
      help.push(index + 1);
    }
    return help;
  }, [todos]);

  const show = useMemo(() => {
    return todos.slice((page - 1) * 20, page * 20);
  }, [page, todos]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  useEffect(() => {
    if (!show.length && page > 1) {
      setPage((last) => last - 1);
    }
  }, [todos]);

  return (
    <div className="App">
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>id</th>
            <th>title</th>
            <th>completed</th>
          </tr>
        </thead>
        <tbody>
          {show.map((item, index) => {
            return (
              <tr key={item.id}>
                <td
                  onClick={() =>
                    setTodos((last) => {
                      const help = JSON.parse(JSON.stringify(last));
                      help.splice((page - 1) * 20 + index, 1);
                      return [...help];
                    })
                  }
                >
                  {index}
                </td>
                <td>{item.id}</td>
                <td style={{ color: index % 2 ? "orange" : "lightblue" }}>
                  {item.title}
                </td>
                <td
                  onClick={() => {
                    setTodos((last) => {
                      const help = JSON.parse(JSON.stringify(last));
                      help[(page - 1) * 20 + index].completed =
                        !help[(page - 1) * 20 + index].completed;
                      return [...help];
                    });
                  }}
                  style={{ color: item.completed ? "green" : "red" }}
                >
                  {item.completed.toString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {todos.length ? (
        <Pagination className="pagination">
          <Pagination.First onClick={() => setPage(1)} />
          <Pagination.Prev
            onClick={() => {
              if (page > 1) {
                setPage((last) => last - 1);
              } else {
                window.scrollTo({ top: 0 });
              }
            }}
          />
          {paginate.map((item, index) => (
            <Pagination.Item
              key={index}
              active={page === item}
              onClick={() => setPage(item)}
            >
              {item}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => {
              if (page < paginate[paginate.length - 1]) {
                setPage((last) => last + 1);
              } else {
                window.scrollTo({ top: 0 });
              }
            }}
          />
          <Pagination.Last
            onClick={() => setPage(paginate[paginate.length - 1])}
          />
        </Pagination>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
