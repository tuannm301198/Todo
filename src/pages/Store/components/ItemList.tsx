import React from 'react';
import '../styles.css'
const items = [
  { id: 1, name: 'Fruit', price: 69000 },
  { id: 2, name: 'Veggies', price: 81000 },
  { id: 3, name: 'Meat', price: 130000 },
];

export const ItemList = (props) => {
  return (
    <div>
      {items.map((item) => (
        <div className='d-flex'>
          <div>{item.name}</div>
          <div>{item.price}</div>
          <div>
            <button onClick={props.addToCart}>Add</button>
          </div>
        </div>
      ))}
    </div>
  );
};
