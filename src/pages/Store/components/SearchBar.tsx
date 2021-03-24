export const SearchBar = ({onChange} : any) => {
    
    return (
        <div>
            <form onSubmit={e => e.preventDefault()}>
                <input onChange={onChange}/>
            </form>
        </div>
    )
}
