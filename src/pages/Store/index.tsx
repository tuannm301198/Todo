import { useReducer } from 'react';
import { ItemList } from './components/ItemList';
import './styles.css';
import request from 'umi-request';
import { Table, Typography, Button, message } from 'antd';
const url = 'https://reqres.in/api/items/';
const { Text } = Typography;
export const ACTION = {
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
};

//reducer
function CartReducer(state: any, action: { type: string; payload: any }) {
  switch (action.type) {
    case ACTION.ADD_TO_CART:
      return addToCart(action.payload, state);
    case ACTION.INCREMENT:
      return increment(action.payload.idx, state);
    case ACTION.DECREMENT:
      return decrement(action.payload, state);
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
  payload: any;
  type: string;
}

//handle logic

function decrement(product: typeOf, state: Array<typeOf>) {
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

function increment(index: number, state: Array<typeOf>) {
  const updatedCart = [...state];
  request
    .patch(url, { data: { quantity: updatedCart[index].quantity } })
    .catch((err) => console.log(err));
  updatedCart[index].quantity++;
  return updatedCart;
}

export function addToCart(product: typeOf, state: Array<typeOf>) {
  const updatedCart = [...state];
  const updatedCartIndex = updatedCart.findIndex((item) => item.id === product.id);
  if (updatedCartIndex < 0) {
    updatedCart.push({ ...product, quantity: 1 });
    message.success(`Successfully added ${product.name.toUpperCase()} to cart`);
  } else {
    updatedCart[updatedCartIndex].quantity++;
  }
  request(url, {
    method: 'post',
    data: { id: product.id, name: product.name, year: product.price },
    headers: { 'Content-Type': 'text / html' },
  }).catch((err) => alert(err));
  return updatedCart;
}

function removeFromCart(product: typeOf, state: Array<typeOf>) {
  request(url, { method: 'delete', params: { id: product.id } }).catch((err) => {
    alert(err);
  });
  message.warn(`Removed ${product.name.toUpperCase()} from cart`);
  return state.filter((item) => item.id !== product.id);
}

//main page
const Store = () => {
  const [cart, dispatch] = useReducer(CartReducer, []);

  const columns: any = [
    {
      title: 'Id',
      dataIndex: 'id',
      responsive: ['sm'],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      responsive: ['md'],
      className: 'cap',
    },
    {
      title: 'Price',
      dataIndex: 'year',
      responsive: ['sm'],
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any, index: number) => (
        <>
          <Button onClick={() => increment({ id: text.id, idx: index })}>+</Button>
          <Button onClick={() => decrement({ id: text.id, idx: index })}>-</Button>
          <Button onClick={() => removeFromCart({ id: text.id, name: text.name })}>Remove</Button>
        </>
      ),
    },
  ];

  function addToCart(product: object) {
    dispatch({ type: ACTION.ADD_TO_CART, payload: product });
  }

  function removeFromCart(product: object) {
    dispatch({ type: ACTION.REMOVE_FROM_CART, payload: product });
  }

  function increment(product: object) {
    dispatch({ type: ACTION.INCREMENT, payload: product });
  }

  function decrement(product: object) {
    dispatch({ type: ACTION.DECREMENT, payload: product });
  }

  return (
    <div>
      <div className="d-flex flex-column">
        <ItemList addToCart={addToCart} />
        <div>
          <Table
            columns={columns}
            locale={{ emptyText: 'Empty Cart' }}
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
          />
        </div>
      </div>
    </div>
  );
};

export default Store;
