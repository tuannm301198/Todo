import { useState, useEffect } from 'react';
import { Pagination, Button, Select } from 'antd';
import request from 'umi-request';

const {Option} = Select
const api = 'https://reqres.in/api/users';
const Promise = () => {
  const [data, setData] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [perPage, setPerPage] = useState(2);
  const [minPerPage, setMinPerPage] = useState(0);
  const [maxPerPage, setMaxPerPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestPage, setRequestPage] = useState(1);
  const [apiDataLength, setApiDataLength] = useState(0)
  useEffect(async () => {
    await request(api, {
      params: {
        page: requestPage,
      },
    }).then((res) => {
      setData(prev => prev.concat(res.data));
      
      setDataLength(prev => prev + res.data.length);
      setMaxPerPage(perPage);
      setApiDataLength(res.total)
      
    });
  }, [requestPage]);
  useEffect(() => {
    setMaxPerPage(perPage)
  },[perPage])

  const onChange = (page: any) => {
    setCurrentPage(page);
    setMaxPerPage(page * perPage);
    setMinPerPage((page - 1) * perPage);
  };

  return (
    <div>
      <Button disabled={dataLength >= apiDataLength}
        onClick={() => {
          setRequestPage(requestPage + 1);
        }}
      >
        Load more
      </Button>
      <Select
        defaultValue={2}
        onChange={(e) => {
          setPerPage(e);
        }}
      >
        <Option value={2}>2</Option>
        <Option value={3}>3</Option>
        <Option value={4}>4</Option>
        <Option value={5}>5</Option>
        <Option value={6}>6</Option>
      </Select>
      {data.map(
        (item: any, idx) =>
          idx >= minPerPage &&
          idx < maxPerPage && (
            <div key={item.id}>
              <div>{item.email}</div>
            </div>
          ),
      )}
      <Pagination
        current={currentPage}
        onChange={onChange}
        total={dataLength}
        defaultPageSize={perPage}
        pageSize={perPage}
        showTotal={(total) => `Total of ${total} items`}
      />
    </div>
  );
};

export default Promise;