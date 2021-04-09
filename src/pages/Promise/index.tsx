import { useState, useEffect } from 'react';
import { Pagination, Button } from 'antd';
import request from 'umi-request';

const api = 'https://reqres.in/api/users';
const Promise = () => {
  const [data, setData] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [perPage, setPerPage] = useState(2);
  const [minPerPage, setMinPerPage] = useState(0);
  const [maxPerPage, setMaxPerPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(async () => {
    await request(api, {
      params: {
        per_page: 12,
      },
    }).then((res) => {
      setData(res.data);
      setDataLength(res.data.length);
      setMaxPerPage(perPage);
    });
  }, []);

  const onChange = (page: any) => {
    setCurrentPage(page);
    setMaxPerPage(page * perPage);
    setMinPerPage((page - 1) * perPage);
  };

  return (
    <div>
      <Button
        style={{ visibility: currentPage == 1 ? 'visible' : 'hidden' }}
        onClick={() => {
          setPerPage(perPage + 2);
        }}
      >
        Load more
      </Button>
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
