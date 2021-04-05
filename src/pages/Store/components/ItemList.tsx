import '../styles.css';
import request from 'umi-request'
import { useState } from 'react';
import { useRequest } from '@umijs/hooks';
import { Table, Button, Spin, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const api = 'https://reqres.in/api/product';
interface FilterDropdownProps {
  setSelectedKeys: (selectedKeys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: (param?: boolean) => void;
  clearFilters?: () => void;
}
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
  const [list,setList] = useState(data);
  useRequest(loadMoreData, {refreshDeps: [paging]})
  function loadMoreData() {
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
              if(data) 
              setList(data.concat(res.data))
            })
        );
      }, 1000);
    });
  }

  const columns: any = [
    {
      title: 'Id',
      dataIndex: 'id',
      responsive: ['sm'],
    },
    {
      dataIndex: 'name',
      responsive: ['md'],
      className: 'cap',
      title: 'Name',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }:FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value: string, record: any) =>
        record.name ? record.name.toString().toLowerCase().includes(value.toLowerCase()) : '',
    },
    {
      title: 'Price',
      dataIndex: 'year',
      responsive: ['sm'],
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any) => (
        <Button
          onClick={() => {
            addToCart({
              id: text.id,
              name: text.name,
              price: text.year,
            });
          }}
        >
          Add{' '}
        </Button>
      ),
    },
  ];
  
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
      <Table dataSource={list ?? data} rowKey={(key) => key.id} columns={columns} bordered>
      </Table>
    </div>
  );
};
