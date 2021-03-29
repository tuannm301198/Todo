import React from 'react'


const Promise = () => {
    const [count,setCount] = React.useState(0)
    const day = new Date().toString()
    console.log(day);
    function counting () {
        setCount(count+1)
    }
    
    return (
        <div>
            <h3>Test Promise</h3>
            <p>{count}</p>
            <p>{day}</p>
        </div>
    )
}

export default Promise
