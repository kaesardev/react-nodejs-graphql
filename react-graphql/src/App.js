import React, { useState } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  GET_USERS,
  GET_USERS_FILTERED,
  VIEW_USER,
  ADD_USER,
  EDIT_USER,
  DELETE_USER,
} from "./Queries";

function App() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", repo: "", age: "" });
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState("id");
  const filters = ["ID", "NAME", "REPO", "AGE"];

  const { refetch, data } = useQuery(GET_USERS, {
    onCompleted: (res) => {
      setList(res.users);
      setLoading(false);
    },
  });
  const [filterUser, filteredUserResult] = useLazyQuery(GET_USERS_FILTERED, {
    onCompleted: (res) => {
      setList(res.filteredUser);
      setLoading(false);
    },
    onError: (err) => {
      setError(err);
      setLoading(false);
    },
  });
  const [viewUser, viewUserResult] = useLazyQuery(VIEW_USER, {
    onCompleted: (res) => {
      setForm(res.user);
      setLoading(false);
    },
    onError: (err) => {
      setError(err);
      setLoading(false);
    },
  });
  const [addUser] = useMutation(ADD_USER, {
    refetchQueries: refetch,
    onCompleted: () => setLoading(false),
    onError: (err) => {
      setError(err);
      setLoading(false);
    },
  });
  const [editUser] = useMutation(EDIT_USER, {
    refetchQueries: refetch,
    onCompleted: () => setLoading(false),
    onError: (err) => {
      setError(err);
      setLoading(false);
    },
  });
  const [delUser] = useMutation(DELETE_USER, {
    refetchQueries: refetch,
    onCompleted: () => setLoading(false),
    onError: (err) => {
      setError(err);
      setLoading(false);
    },
  });

  if (loading)
    return (
      <div
        className="container d-flex justify-content-center"
        style={{ height: 400, display: "flex", alignItems: "center" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  function clearForm() {
    setForm({ id: "", name: "", repo: "", age: "" });
  }

  function submitHandler(e) {
    e.preventDefault();
    //Get values
    setLoading(true);
    const { id, name, repo, age } = form;
    if (!(name && repo && age)) return setLoading(false);
    //Action
    if (id && id !== "") {
      editUser({ variables: { id, name, repo, age } });
    } else {
      addUser({ variables: { name, repo, age } });
    }
    //Clear
    clearForm();
  }

  const onClickEdit = (id) => {
    const { called, data } = viewUserResult;
    if (called && data?.user?.id === id) {
      setForm(data.user);
      setLoading(false);
    } else {
      setLoading(true);
      viewUser({ variables: { id } });
    }
  };
  const onClickRem = (id) => {
    setLoading(true);
    clearForm();

    delUser({ variables: { id } });
  };

  function submitFilterHandler(e) {
    e.preventDefault();
    //Get values
    if (keyword === "") {
      setList(data.users);
    } else if (filters.includes(filter.toUpperCase())) {
      setLoading(true);
      const { called, data } = filteredUserResult;
      if (called && data?.filteredUser) {
        setList(data.filteredUser);
        setLoading(false);
      } else {
        filterUser({ variables: { filter, keyword } });
      }
    }
  }

  return (
    <div className="App">
      <header>
        <nav className="navbar navbar-light bg-light">
          <div className="container">
            <span className="navbar-brand mb-0 h1">GraphQL CRUD</span>
          </div>
        </nav>
      </header>

      <main>
        <div className="container">
          <div className="row">
            <form className="col col-md col-md-4" onSubmit={submitHandler}>
              <h3>Form {!form.id ? "register" : `update #${form.id}`}</h3>
              <input
                className="form-control mb-1 mr-md-1"
                type="hidden"
                value={form.id}
                readOnly
              />
              <input
                className="form-control mb-1 mr-md-1"
                placeholder="NAME"
                value={form.name}
                onChange={(e) => {
                  var name = e.target.value;
                  setForm((prev) => ({ ...prev, name }));
                }}
              />
              <input
                className="form-control mb-1 mr-md-1"
                placeholder="REPO"
                value={form.repo}
                onChange={(e) => {
                  var repo = e.target.value;
                  setForm((prev) => ({ ...prev, repo }));
                }}
              />
              <input
                className="form-control mb-1 mr-md-1"
                placeholder="AGE"
                value={form.age}
                onChange={(e) => {
                  var age = parseInt(e.target.value) || "";
                  setForm((prev) => ({ ...prev, age }));
                }}
                type="number"
              />
              <button className="btn btn-success mb-1 mr-md-1" type="submit">
                {!form.id ? "INSERT" : "UPDATE"}
              </button>
              {form.id && (
                <button
                  className="btn btn-secondary mb-1 mr-md-1"
                  type="button"
                  onClick={() => clearForm()}
                >
                  CANCEL
                </button>
              )}
              {error && (
                <div className="alert alert-warning" role="alert">
                  {error}
                </div>
              )}
            </form>

            <div className="col col-md col-md-auto">
              <form className="form-inline" onSubmit={submitFilterHandler}>
                <input
                  className="form-control mb-1 mr-md-1"
                  placeholder="KEYWORD"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  type={filter === "age" ? "number" : "text"}
                />
                <select
                  value={filter}
                  onChange={(e) => {
                    var { value } = e.target;
                    filters.includes(value.toUpperCase()) &&
                      setFilter(value.toLowerCase());
                  }}
                  className="form-control  mb-1 mr-md-1"
                >
                  {filters.map((value, index) => (
                    <option key={index} value={value.toLowerCase()}>
                      {value}
                    </option>
                  ))}
                </select>
                <button className="btn btn-primary mb-1 mr-md-1" type="submit">
                  SEARCH
                </button>
              </form>
              <table className="table">
                <thead>
                  <tr>
                    {filters.map((value, index) => (
                      <th key={index} scope="col">
                        {value}
                      </th>
                    ))}
                    <th scope="col">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {list.map(({ id, name, repo, age }) => {
                    return (
                      <tr key={id}>
                        <th scope="row">{id}</th>
                        <th>{name}</th>
                        <th>{repo}</th>
                        <th>{age}</th>
                        <th>
                          <button
                            className="btn btn-primary mb-1 mr-md-1"
                            type="button"
                            onClick={() => onClickEdit(id)}
                          >
                            EDIT
                          </button>
                          <button
                            className="btn btn-danger mb-1 mr-md-1"
                            type="button"
                            onClick={() => onClickRem(id)}
                          >
                            X
                          </button>
                        </th>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
