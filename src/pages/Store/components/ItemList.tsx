import '../styles.css';
import request from 'umi-request'
import { useState } from 'react';
import { useRequest } from '@umijs/hooks';
import { Table, Button, Spin } from 'antd';

const { Column } = Table;
const api = 'https://reqres.in/api/product';

// list of item
export const ItemList = (props: any) => {
  const { addToCart } = props;
  const [paging, setPaging] = useState(1);
  const { data, error, loading } = useRequest({
    url: api,
    params: {
      page: paging,
    },
  },{
    formatResult: (res) => {
      return res.data
    }
    
  });
  const [list,setList] = useState(data)
  function loadMoreData() {
    setPaging(paging + 1)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          request(api,
            {
              params: {
                page: paging,
              }
            })
            .then((res) =>{
              setList(data.concat(res.data))
            })
        );
      }, 1000);
    });
  }
  if (error) {
    return <div>Can't process</div>;
  }

  if (loading) {
    return (
      <div className="loading-icon">
        <Spin />
      </div>
    );
  }
  
  return (
    <div>
      <Button onClick={() => loadMoreData()}>Load more</Button>
      <Table dataSource={list ?? data} rowKey={(key) => key.id} bordered>
        <Column title="Id" dataIndex="id" responsive={['sm']} />
        <Column title="Name" dataIndex="name" responsive={['md']} className="cap" />
        <Column title="Price" dataIndex="year" responsive={['sm']} />
        <Column
          title="Action"
          key="action"
          render={(text) => (
            <Button
              onClick={() => {
                addToCart({
                  id: text.id,
                  name: text.name,
                  price: text.year,
                });
              }}
            >
              Add
            </Button>
          )}
        />
      </Table>
    </div>
  );
};
