import React , { useState, useReducer } from 'react';
import { SearchBar } from './components/SearchBar';
import { ItemList } from './components/ItemList';
import './styles.css';
export const ACTION = {
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
};
function CartReducer(state:any, action:{type: string, payload:any }) {
  const newState = [...state];
  switch (action.type) {
    
    case ACTION.ADD_TO_CART:
      console.log(action);
      return addToCart(action.payload, state);
    case ACTION.INCREMENT:
      return Increment(action.payload.idx, state);
    case ACTION.DECREMENT:
      return Decrement(action.payload, state);
    case ACTION.REMOVE_FROM_CART:
      return removeFromCart(action.payload, state);
    default:
      return newState;
  }
}
interface typeOf {
  idx: number,
  id: number,
  quantity: number,
  name: string,
}

function Decrement(product: typeOf, state:Array<{id: number,quantity: number}>) {
  const updatedCart = [...state];
  if (updatedCart[product.idx].quantity > 1) {
    updatedCart[product.idx].quantity--;
  } else return updatedCart.filter((item) => item.id !== product.id);
  return updatedCart;
}
function Increment(index:number, state:Array<{id: number,quantity: number}>) {
  const updatedCart = [...state];
  updatedCart[index].quantity++;
  return updatedCart;
}
export function addToCart(product:typeOf, state:Array<{id: number,quantity: number}>) {
  const updatedCart = [...state];
  const updatedCartIndex = updatedCart.findIndex((item) => item.id === product.id);
  if (updatedCartIndex < 0) {
    updatedCart.push(product);
  } else updatedCart[updatedCartIndex].quantity++;
  return updatedCart;
}
function removeFromCart(product: typeOf, state:Array<{id: number,quantity: number}>) {
  const updatedCart = [...state];
  // updatedCart[product.idx].quantity = 1;
  return updatedCart.filter((item) => item.id !== product.id);
}
const Store = () => {
  const [cart, dispatch] = useReducer(CartReducer, []);
  const [value, setValue] = useState('');
  const Total = () => {
    let total = 0;
    cart.map((item) => (total += item.price * item.quantity));
    return total;
  };
  function addToCart(product:object) {
    dispatch({ type: ACTION.ADD_TO_CART, payload: product });
    console.log(product);
    
  }
  function removeFromCart(product:object) {
    dispatch({ type: ACTION.REMOVE_FROM_CART, payload: product });
    
  }
  function Increment(product:object) {
    dispatch({ type: ACTION.INCREMENT, payload: product });
  }
  function Decrement(product:object) {
    dispatch({ type: ACTION.DECREMENT, payload: product });
  }

  return (
    <div>
      <div className="d-flex flex-row">
        <ItemList addToCart={addToCart} />
        <SearchBar onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)} />
        <div>
          {cart && <div>Total value {Total()}</div>}
          <p>Cart Detail:</p>
          {cart &&
            cart
              .filter((val) => val.name.toLowerCase().includes(value.toLowerCase()))
              .map((item, idx) => {
                return (
                  <div key={item.id}>
                    <button onClick={() => Increment({ id: item.id, idx: idx })}>Add</button>
                    <p>Item: {item.name}</p>
                    <p>Price: {item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <button onClick={() => Decrement({ idx: idx, id: item.id })}>Subtract</button>
                    <button onClick={() => removeFromCart({ id: item.id, idx: idx })}>
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
