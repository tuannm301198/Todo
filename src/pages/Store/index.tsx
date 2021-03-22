import React, {useReducer} from 'react'
import {SearchBar} from './components/SearchBar'
import {ItemList} from './components/ItemList'
import './styles.css'
const initCart = []
function CartReducer (state,action) {
    switch(action.type) {
        case 'increment':
        case 'decrement':
        default:
            return;    
    }
}
const Store = () => {
    const [state,dispatch] = useReducer(CartReducer,initCart)
    return (
        <div>
            <div className='d-flex flex-row'>

            <ItemList addToCart={() => dispatch({type:'increment'})} />
            <div>Cart Detail:
                {initCart.map(item => (
                    <div>
                        <button>Add</button>
                        <p>{item.name}</p>
                        <p>{item.price}</p>
                        <button>Subtract</button>
                    </div>
                ))}
            </div>
            </div>
        </div>
    )
}

export default Store;