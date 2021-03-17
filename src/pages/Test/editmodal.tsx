import { useState } from 'react';
import { Button, Input } from 'antd';
import './styles.less';
const editModal = ({ showEdit, handleClose, updatedValue }) => {
  const showOrHide = showEdit ? 'modal-test show' : 'modal-test hide';
  const [updateValue, setUpdateValue] = useState('');

  const onChange = (e: any) => {
    e.preventDefault();
    updatedValue(updateValue);
    setUpdateValue('');
  };
  return (
    <div className={showOrHide}>
      <div className="modal-test-content">
        <div>
          <h2>Edit form</h2>
        </div>
        <Input
          value={updateValue}
          className="input"
          placeholder="Input new change"
          onChange={(e) => setUpdateValue(e.target.value)}
        ></Input>
        <Button className="submit-btn" onClick={onChange}>
          Change
        </Button>
        <Button className="submit-btn" type="primary" onClick={handleClose}>
          Close Form
        </Button>
      </div>
    </div>
  );
};
export default editModal;
