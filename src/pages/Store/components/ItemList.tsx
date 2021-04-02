import '../styles.css';
import request from 'umi-request';
import { useState, useEffect } from 'react';
import { useRequest } from '@umijs/hooks';
import { Table, Button, Spin } from 'antd';

const { Column } = Table;
const api = 'https://reqres.in/api/product';

// list of item
export const ItemList = (props: any) => {
  const { addToCart } = props;
  const { error, loading } = useRequest(getList, { onSuccess: (result) => setList(result) });
  const [list, setList] = useState([]);
  const [paging, setPaging] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    getList();
    console.log(navigator)
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect( () => {
     request(api, {
      params: {
        page: paging,
      },  
    })
      .then((res) => {
        setList(list.concat(res.data));
      })
      .catch((err) => alert(err));
  }, [paging]);
  
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
    console.log(position);
  };

  function getList() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          request(api, {
            params: {
              page: paging,
            },
          })
            .then((res) => {
              return res.data;
            })
            .catch((err) => alert(err)),
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
      <Button onClick={() => setPaging(paging + 1)}>Load more</Button>
      <Table dataSource={list} rowKey={(key) => key.id} bordered>
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
