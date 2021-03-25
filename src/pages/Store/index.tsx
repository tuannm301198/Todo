import { useState, useReducer } from 'react';
import { ItemList } from './components/ItemList';
import './styles.css';
import request from 'umi-request';
import {Table,Typography, Button} from 'antd'
const url = 'https://reqres.in/api/items/';
const {Text} = Typography;
const {Column} = Table;
export const ACTION = {
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
};
function CartReducer(state: any, action: { type: string; payload: any }) {
  switch (action.type) {
    case ACTION.ADD_TO_CART:
      return addToCart(action.payload, state);
    case ACTION.INCREMENT:
      return Increment(action.payload.idx, state);
    case ACTION.DECREMENT:
      return Decrement(action.payload, state);
    case ACTION.REMOVE_FROM_CART:
      return removeFromCart(action.payload, state);
    default:
      return state;
  }
}
interface typeOf {
  idx: number;
  id: number;
  quantity: number;
  name: string;
  price: number;
}
function Decrement(product: typeOf, state: Array<{ id: number; quantity: number }>) {
  const updatedCart = [...state];
  request
    .patch(url, { data: { quantity: updatedCart[product.idx].quantity } })
    .catch((err) => console.log(err));
  if (updatedCart[product.idx].quantity > 1) {
    updatedCart[product.idx].quantity--;
    return updatedCart;
  } else {
    return updatedCart.filter((item) => item.id !== product.id);
  }
}
function Increment(index: number, state: Array<{ id: number; quantity: number }>) {
  const updatedCart = [...state];
  request
    .patch(url, { data: { quantity: updatedCart[index].quantity } })
    .catch((err) => console.log(err));
  updatedCart[index].quantity++;
  return updatedCart;
}
export function addToCart(product: typeOf, state: Array<{ id: number; quantity: number }>) {
  console.log(product);
  const updatedCart = [...state];
  const updatedCartIndex = updatedCart.findIndex((item) => item.id === product.id);
  if (updatedCartIndex < 0) {
    updatedCart.push({ ...product, quantity: 1 });
  } else {
    updatedCart[updatedCartIndex].quantity++;
  }
  request
    .post(url, { data: { id: product.id, name: product.name, year: product.price } })

    .catch((err) => alert(err));
  return updatedCart; 
}
function removeFromCart(product: typeOf, state: Array<{ id: number; quantity: number }>) {
  request.delete(`${url}${product.id}`).catch((err) => {
    alert(err);
  });
  return state.filter((item) => item.id !== product.id);
}

const Store = () => {
  const [cart, dispatch] = useReducer(CartReducer, []);
  // const [value, setValue] = useState('');
  // const [searchValue,setSearchValue] = useState('')
  // const [searchedColumn,setSearchedColumn] = useState('')
 
  function addToCart(product: object) {
    dispatch({ type: ACTION.ADD_TO_CART, payload: product });
  }

  function removeFromCart(product: object) {
    dispatch({ type: ACTION.REMOVE_FROM_CART, payload: product });
  }

  function Increment(product: object) {
    dispatch({ type: ACTION.INCREMENT, payload: product });
  }

  function Decrement(product: object) {
    dispatch({ type: ACTION.DECREMENT, payload: product });
  }

  return (
    <div>
      <div className="d-flex flex-column">
        <ItemList addToCart={addToCart} />
        <div>
         
          <Table locale={{emptyText:'Empty Cart'}}
            dataSource={cart}
            bordered
            rowKey={(item) => item.id}
            summary={(total) => {
              let totalSum = 0;
              total.forEach(({ price, quantity }) => {
                totalSum += price * quantity;
              });
              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell>Total</Table.Summary.Cell>
                    <Table.Summary.Cell colSpan={6} className="total">
                      <Text>{totalSum}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          >
            <Column title="Id" dataIndex="id" />
            <Column title="Name" dataIndex="name" />
            <Column title="Price" dataIndex="price" />
            <Column title="Quantity" dataIndex="quantity"/>
            <Column
              title="Action"
              key="action"
              render={(text, record,index) => (
                <Button onClick={() => Increment({ id: text.id, idx: index })}>+</Button>
              )}
            />
            <Column
              title="Action"
              key="action"
              render={(text,record,index) => (
                <Button onClick={() => Decrement({ id: text.id, idx: index })}>-</Button>
              )}
            />
            <Column
              title="Action"
              key="action"
              render={(text) => (
                <Button onClick={() => removeFromCart({ id: text.id})}>Remove</Button>
              )}
            />
          </Table>
          {/* {cart && <div>Total value {Total()}</div>}
          <p>Cart Detail:</p> */}
          {/* {cart &&
            cart
              .filter((val: { name: string }) =>
                val?.name.toLowerCase().includes(value.toLowerCase()),
              )
              .map(
                (
                  item: { name: string; id: number; price: number; quantity: number },
                  idx: number,
                ) => {
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
                },
              )} */}
        </div>
      </div>
    </div>
  );
};

export default Store;
