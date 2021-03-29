import '../styles.css';
import request from 'umi-request';
import {useRequest} from '@umijs/hooks'
import {Table, Button} from 'antd'

const {Column} = Table
const api = 'https://reqres.in/api/product?page=1&per_page=12';
function getList() {
  return new Promise((resolve) => {
    setTimeout((page) => {
      resolve(
        request
          .get(api + (page || 1))
          .then((json) => {return json.data})
          .catch((err) => console.error(err)),
      );
    }, 1000);
  });
}

// list of item
export const ItemList = ({ addToCart }: any) => {
  const {data,error,loading} = useRequest(getList)

  if (error) {
    return <div>Can't process</div>
  }
  if (loading) {
    return <div>Loading</div>
  }
  return (
    <div>
      <Table dataSource={data} rowKey={(key) => key.id} bordered>
        <Column title="Id" dataIndex="id" responsive={['sm']} />
        <Column title="Name" dataIndex="name" responsive={['md']} className='cap' />
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
