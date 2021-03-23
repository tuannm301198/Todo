import React from 'react';
import '../styles.css';
import { ACTION } from '../index';
const items = [
  { id: 1, name: 'Fruit', price: 69000},
  { id: 2, name: 'Veggies', price: 81000 },
  { id: 3, name: 'Meat', price: 130000 },
];

export const ItemList = ({ dispatch }) => {
  return (
    <div>
      {items.map((item) => (
        <div className="d-flex flex-column" key={item.id}>
          <div>Name: {item.name}</div>
          <div>Price: {item.price}</div>
          <div>
            <button
              onClick={()=>dispatch({
                type: ACTION.ADD_TO_CART,
                payload: {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: 1,
                },
              })}
            >
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
