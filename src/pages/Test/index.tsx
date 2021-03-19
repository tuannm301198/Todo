import { useState, useEffect } from 'react';
import './styles.less';
import { Button, AutoComplete } from 'antd';
import Modal from './modal';
import EditModal from './editmodal';
import debounce from 'lodash/debounce';
import axios from 'axios';
const Test = () => {
  const [todos, setTodo] = useState([]);
  const [display, setDisplay] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [itemIndex, setIndex] = useState(0);
  const [Id, setId] = useState(0);
  const [newData, setData] = useState([...todos]);
  const [value, setValue] = useState('');
  // useEffect(() => {
  //   if (!localStorage.getItem('list')) {
  //     localStorage.setItem('list', JSON.stringify(todos));
  //   }
  // }, [todos]);
  useEffect(async () => {
    await axios
      .get('https://reqres.in/api/users?page=2')
      .then((res) => {
        setTodo(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const showDisplay = (e) => {
    setDisplay(true);
    e.preventDefault();
    console.log(todos);
    
  };
  const newArr = [...todos].map(item => {
    delete item.id;
    delete item.avatar;
    delete item.email;
    delete item.last_name;
  })
  const hideDisplay = (e) => {
    setDisplay(false);
    e.preventDefault();
  };
  const showEditModal = (id: number, index) => {
    setEditModal(true);
    setIndex(index);
    setId(id);
    console.log(newArr);
  };
  const hideEditModal = (e: any) => {
    e.preventDefault();
    setEditModal(false);
  };
  const addTodos = async (value: string) => {
    await axios.post('https://reqres.in/api/users?', { first_name: value }).then((res) => {
      const newVal = res.data.first_name;
      const newTodos = [...todos, { first_name: newVal }];

      setTodo(newTodos);
    });
  };
  const removeTodos = async (i: number) => {
    await axios
      .delete(`https://reqres.in/api/users/${Id}`)
      .then((res) => {
        const newTodos = [...todos];
        newTodos.splice(i, 1);
        setTodo(newTodos);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const updateTodos = async (index: string) => {
    const EdittedTodos = [...todos];
    await axios
      .patch(`https://reqres.in/api/users/${Id}`, { first_name: index })
      .then((res) => {
        EdittedTodos.splice(itemIndex, 1, { first_name: index });
        console.log(res);
      })
      .catch((err) => console.log(err));
    setTodo(EdittedTodos);
  };
  const search = (val) => {
    setValue(val);
    const filtered = todos.findIndex((x) => x.value == val);
    if (filtered !== -1) {
      setData([{ first_name: val }]);
    } else setData(todos);
  };

  //
  return (
    <div className="container">
      <div className="modal">
        <div className="title">To do list</div>
        <AutoComplete
          autoFocus={true}
          allowClear={true}
          className="auto-com"
          options={todos}
          placeholder="Search something"
          onSearch={debounce(search, 1000)}
          // onSearch={debounce(search,2000)}
          notFoundContent="Nothing was found"
          //     filterOption={(inputValue, option) =>
          // option!.value.toUpperCase().indexOf(inputValue.toUpperCase())   !== -1
          // }
        ></AutoComplete>
        <div className="todo-container">
          {todos.map((todo, i: number) => {
            return (
              <div className="todo-list" key={i}>
                <div className="todo-item">{todo.first_name}</div>
                <Button
                  type="primary"
                  className="mg-right"
                  onClick={() => showEditModal(todo.id, i)}
                >
                  Edit
                </Button>
                <Button onClick={() => removeTodos(i)}>Finish</Button>
              </div>
            );
          })}
        </div>
      </div>
      <Button type="primary" className="open-form" danger onClick={showDisplay}>
        Open form
      </Button>
      <Modal handleClose={hideDisplay} show={display} addTodo={addTodos} />
      <EditModal handleClose={hideEditModal} showEdit={editModal} updatedValue={updateTodos} />
    </div>
  );
};

export default Test;
