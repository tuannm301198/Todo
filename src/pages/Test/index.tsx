import { useState, useEffect, useCallback } from 'react';
import './styles.less';
import { Button, AutoComplete } from 'antd';
import Modal from './modal';
import EditModal from './editmodal';
import debounce from 'lodash/debounce';

const list = JSON.parse(localStorage.getItem('list'))
const Test = () => {
  const [todos, setTodo] = useState(list);
  const [display, setDisplay] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [itemIndex,setIndex] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('list')) {
      localStorage.setItem('list', JSON.stringify(todos));
      
    }
  }, [todos]);

  const addTodos = (value: string) => {
    const newTodos = [...todos, { value }];
    setTodo(newTodos);
    localStorage.setItem('list', JSON.stringify(newTodos));
    
  };
  const showEditModal = (i) => {
    setEditModal(true);
    setIndex(i)
  };
  const hideEditModal = (e: any) => {
    e.preventDefault();
    setEditModal(false);
  };
  const removeTodos = (i) => {
    const newTodos = [...todos];
    newTodos.splice(i, 1);
    setTodo(newTodos);
  };
  const showDisplay = (e) => {
    setDisplay(true);
    e.preventDefault();
  };
  const hideDisplay = (e) => {
    setDisplay(false);
    e.preventDefault();
  };
  
  const updateTodos = (index: string) => {
    const EdittedTodos = [...todos]
    EdittedTodos.splice(itemIndex,1,{value: index})
    setTodo(EdittedTodos)
    localStorage.setItem('list', JSON.stringify(EdittedTodos));
  };
  const debouncedSave = useCallback(
		debounce(nextValue => setTodo(nextValue), 1000),
  )
  const handleChange = event => {
		const { value: nextValue } = event.target;
		setTodo(nextValue);
		// Even though handleChange is created on each render and executed
		// it references the same debouncedSave that was created initially
		debouncedSave(nextValue);
	};
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
          filterOption={false}
          onSearch={handleChange}
    //       filterOption={(inputValue, option) =>
    //   option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
    // }
        ></AutoComplete>
        <div className="todo-container">
          {todos.map((todo, i: number) => {
            return (
              <div className="todo-list" key={i}>
                <div className="todo-item">{todo.value}</div>
                <Button type="primary" className="mg-right" onClick={() => showEditModal(i)}>
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
      <Modal handleClose={hideDisplay} show={display} addTodo={addTodos}  />
      <EditModal handleClose={hideEditModal} showEdit={editModal} updatedValue={updateTodos} />
    </div>
  );
};

export default Test;
