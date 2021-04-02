import '../styles.css';
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
    refreshDeps: [paging],
  });
 
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
      <Button onClick={() => setPaging(paging + 1)}>Load more</Button>
      <Table dataSource={data.data} rowKey={(key) => key.id} bordered>
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
