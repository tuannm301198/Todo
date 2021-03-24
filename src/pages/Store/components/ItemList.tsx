import '../styles.css';
const items = [
  { id: 1, name: 'Fruit', price: 69000, quantity: 1 },
  { id: 2, name: 'Veggies', price: 81000, quantity: 1 },
  { id: 3, name: 'Meat', price: 130000, quantity: 1 },
];

export const ItemList = ({ addToCart }:any) => {
  
  return (
    <div>
      {items.map((item) => (
        <div className="d-flex flex-column" key={item.id}>
          <div>Name: {item.name}</div>
          <div>Price: {item.price}</div>
          <div>
            <button onClick={() => {
              addToCart(item)}}>Add</button>
          </div>
        </div>
      ))}
    </div>
  );
};
