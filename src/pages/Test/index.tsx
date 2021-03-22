import { useState, useEffect } from 'react';
import './styles.less';
import { Button, AutoComplete, Input } from 'antd';
import Modal from './modal';
import EditModal from './editmodal';
import debounce from 'lodash/debounce';
import request from 'umi-request';
import {useRequest} from '@umijs/hooks'

const { Option } = AutoComplete;

const Test = () => {
  const [todos, setTodo] = useState([]);
  const [display, setDisplay] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [itemIndex, setIndex] = useState(0);
  const [Id, setId] = useState(0);
  const [newData, setData] = useState([]);
  // const [value, setValue] = useState('');

  useEffect(async () => {
    await request
      .get('https://reqres.in/api/users?page=2')
      .then((res) => {
        setTodo(res.data);
        setData([...todos]);
      })
      .catch((err) => console.log(err));
  }, []);

  const showDisplay = (e) => {
    setDisplay(true);
    e.preventDefault();
  };
  const hideDisplay = (e) => {
    setDisplay(false);
    e.preventDefault();
    console.log(newData);
  };
  const showEditModal = (id: number, index) => {
    setEditModal(true);
    setIndex(index);
    setId(id);
    console.log(newData);
  };
  const hideEditModal = (e: any) => {
    e.preventDefault();
    setEditModal(false);
  };
  const addTodos = async (val: string) => {
    const newTodos = [...todos, { first_name: val }];
    await request.post('https://reqres.in/api/users', { data: { first_name: val } }).then((res) => {
      console.log(res);
      setTodo(newTodos);
    });
  };
  const removeTodos = async (i: number) => {
    await request
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
    await request
      .patch(`https://reqres.in/api/users/${Id}`, { first_name: index })
      .then((res) => {
        EdittedTodos.splice(itemIndex, 1, { first_name: index });
        console.log(res);
      })
      .catch((err) => console.log(err));
    setTodo(EdittedTodos);
  };
  const search = (val: string) => {
    const filtered = todos.findIndex((x) => x.first_name == val);
    console.log(filtered);
    if (filtered !== -1) {
      setData([{ first_name: val }]);
    } else setData(todos);
  };
  // const {data, loading} = useRequest(() => updateTodos(todos), {
  //   refreshDeps: [todos]
  // } )
  //
  return (
    <div className="container">
      <div className="modal">
        <div className="title">To do list</div>
        <AutoComplete
          autoFocus={true}
          allowClear={true}
          className="auto-com"
          placeholder="Search something"
          onSearch={debounce(search, 1000)}
          notFoundContent="Nothing was found"
          //     filterOption={(inputValue, option) =>
          // option!.value.toUpperCase().indexOf(inputValue.toUpperCase())   !== -1
          // }
        >
          {newData.map((item: array) => (
            <Option key={item.id} value={item.first_name}>
              {item.first_name}
            </Option>
          ))}
        </AutoComplete>
        <div className="todo-container">
          {todos.map((todo: object, i: number) => {
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
