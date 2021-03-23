import React, { useState, useReducer } from 'react';
import { SearchBar } from './components/SearchBar';
import { ItemList } from './components/ItemList';
import './styles.css';
const initCart = [];
export const ACTION = {
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
};

function CartReducer(state, action) {
  const newState = [...state];
  const productIndex = newState.findIndex((val) => val.id == action.payload.id);

  switch (action.type) {
    case ACTION.ADD_TO_CART:
      if (productIndex < 0) {
        newState.push(action.payload);
      } else newState[productIndex].quantity++;
      return newState;
    case ACTION.INCREMENT:
      newState[action.payload.idx].quantity++;

      return newState;
    case ACTION.DECREMENT:
      if (newState[action.payload.idx].quantity > 1) newState[action.payload.idx].quantity--;
      else return newState.filter((item) => item.id !== action.payload.id);
      return newState;
    case ACTION.REMOVE_FROM_CART:
      return newState.filter((item) => item.id !== action.payload);
    default:
      return;
  }
}
const Store = () => {
  const [cart, dispatch] = useReducer(CartReducer, initCart);
  const [value, setValue] = useState('');
  const Total = () => {
    let total = 0;
    cart.map((item) => (total += item.price * item.quantity));

    return total;
  };
  
  return (
    <div>
      <div className="d-flex flex-row">
        <ItemList dispatch={dispatch} />
        <SearchBar onChange={e => setValue(e.target.value)} />
        <div>
          {cart && <div>Total value {Total()}</div>}
          <p>Cart Detail:</p>
          {cart && cart.filter(val=> val.name.toLowerCase().includes(value.toLowerCase())).map((item, idx) => {
              return (
                <div key={item.id}>
                  <button
                    onClick={() =>
                      dispatch({
                        type: ACTION.INCREMENT,
                        payload: {
                          idx: idx,
                          id: item.id,
                        },
                      })
                    }
                  >
                    Add
                  </button>
                  <p>Item: {item.name}</p>
                  <p>Price: {item.price}</p>
                  <p>Quantity:{item.quantity}</p>
                  <button
                    onClick={() =>
                      dispatch({ type: ACTION.DECREMENT, payload: { idx: idx, id: item.id } })
                    }
                  >
                    Subtract
                  </button>
                  <button
                    onClick={() => dispatch({ type: ACTION.REMOVE_FROM_CART, payload: item.id })}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Store;
