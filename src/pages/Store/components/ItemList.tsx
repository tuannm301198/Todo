import '../styles.css';
import request from 'umi-request';
import {useState} from 'react'
import {useRequest} from '@umijs/hooks'
import {Table, Button} from 'antd'

const {Column} = Table
const api = 'https://reqres.in/api/product?page=1&per_page=12';
export const ItemList = ({ addToCart }: any) => {
  const {error,loading} = useRequest(getList)
  const [list,setList] = useState([])
  function getList() {
    return new Promise((resolve) => {
      setTimeout((page) => {
        resolve(request.get(api + (page || 1))
        .then(json=>setList(json.data))
        .catch(err => console.error(err))
        )
      }, 1000);
    });
  }
  
  // interface itemType {
  //   id: number,
  //   name: string,
  //   quantity: number,
  //   year: number
  // }
  if (error) {
    return <div>Can't process</div>
  }
  if (loading) {
    return <div>Loading</div>
  }
  return (
    <div>
      <Table dataSource={list} rowKey={(key) => key.id} bordered>
        <Column title="Id" dataIndex="id" responsive={['sm']} />
        <Column title="Name" dataIndex="name" responsive={['md']} />
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
