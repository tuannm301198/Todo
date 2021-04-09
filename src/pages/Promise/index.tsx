import  { useState, useEffect } from 'react';
import {Pagination, Table, Button} from 'antd'
import request from 'umi-request'

const api = 'https://reqres.in/api/users';
const Promise = () => {
  const [data, setData] = useState([])
  const [totalData, setTotalData] = useState(0)
  const [perPage, setPerPage] = useState(2)
  const [minPerPage, setMinPerPage] = useState(0)
  const [maxPerPage, setMaxPerPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  useEffect(async () => {
    await request(api,
      {
        params: {
          per_page: 12
        }
      })
    .then(res => {
      setData(res.data)
      setTotalData(res.data.length)
      setMaxPerPage(perPage)
    })
  },[perPage])
  const onChange = (page) => {
    setCurrentPage(page)
    setMaxPerPage(page * perPage)
    setMinPerPage((page - 1) * perPage)
  }

  return (
    <div>
      {data.map((item,idx) => idx >= minPerPage && idx < maxPerPage &&
       (
        <div key={idx}>
        <div>{item.id}</div>
        </div>
      ))}
      <Button onClick={() => {
        setPerPage(perPage + 2)} } >Load more</Button>
      <Pagination current={currentPage} onChange={onChange} total={totalData} defaultPageSize={perPage} pageSize={perPage} showTotal={total => `Total of ${total} items`}  />
    </div>
  );
};

export default Promise;
