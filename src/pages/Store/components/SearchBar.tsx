import React from 'react'

export const SearchBar = (props) => {
    return (
        <div>
            <form onSubmit={e => e.preventDefault()}>
                <input value={props.value} onChange={props.onChange}/>
            </form>
        </div>
    )
}
