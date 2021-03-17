import { useState } from 'react';
import './styles.less';
import {Button, Input} from 'antd'

const Modal = ({ addTodo, show, handleClose }) => {
  const [value, setValue] = useState('');
  const onSubmit = (e:any) => {
    e.preventDefault();
    if (value) {
      addTodo(value);
      setValue('');
    } else alert('No value found');
  };
  const showOrHide = show ? 'modal-test show' : 'modal-test hide';
  return (
    <div className={showOrHide}>
      <div className="modal-test-content">
          <div>
            <h2>
            To do form
            </h2>
            </div>
          <Input className='input'
            placeholder="What you want to do"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></Input>
          <Button className='submit-btn' onClick={onSubmit}>
            Submit
          </Button>
          <Button className='submit-btn' type='primary' onClick={handleClose}>Close Form</Button>
      </div>
    </div>
  );
};

export default Modal;
