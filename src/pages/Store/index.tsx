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
  // const productIndex = newState.findIndex((val) => val.id == action.payload.id);

  switch (action.type) {
    case ACTION.ADD_TO_CART:
      //   console.log(state,newState);
        
      // if (productIndex < 0) {
      //   newState.push(action.payload);
      // } else newState[productIndex].quantity++;
      
      // return newState;
      return addToCart(action.payload, state)
      
    case ACTION.INCREMENT:
      // newState[action.payload.idx].quantity++;
      // return newState;
      return Increment(action.payload.idx,state)
    case ACTION.DECREMENT:
      if (newState[action.payload.idx].quantity > 1) newState[action.payload.idx].quantity--;
      else return newState.filter((item) => item.id !== action.payload.id);
      return newState;
    case ACTION.REMOVE_FROM_CART:
      // return newState.filter((item) => item.id !== action.payload);
      return removeFromCart(action.payload, state)
    default:
      return;
  }
}

function Increment (index,state) {
  const updatedCart = [...state];
  return updatedCart[index].quantity++;
}
function removeFromCart(id,state) {
  const updatedCart = [...state];
  return updatedCart.filter(item => item.id !== id)
}
export function addToCart (product,state) {
  console.log(product);
  const updatedCart = [...state];
  const updatedCartIndex = updatedCart.findIndex(item => item.id === product.id)
  if (updatedCartIndex < 0) {
    updatedCart.push(product)
  }
  else updatedCart[updatedCartIndex].quantity++;
  return updatedCart
}

const Store = () => {
  const [cart, dispatch] = useReducer(CartReducer, initCart);
  const [value, setValue] = useState('');
  const Total = () => {
    let total = 0;
    cart.map((item) => (total += item.price * item.quantity));

    return total;
  };
  function addToCart(product) {
  dispatch({type: ACTION.ADD_TO_CART, payload: product})

  }
  function removeFromCart(id) {
    dispatch({type:ACTION.REMOVE_FROM_CART, payload:id})
  }
  return (
    <div>
      <div className="d-flex flex-row">
        <ItemList addToCart={addToCart} />
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
                    onClick={removeFromCart(item.id)}
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