import '../styles.css';
import request from 'umi-request';
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
interface Result {
  total: number;
  list: Array<{ id: number; name: string; year: number; first_name: string; email: string }>;
}
// list of item
export const ItemList = (props: any) => {
  const { addToCart } = props;

  const getList = async ({ pageSize, offset }: any): Promise<Result> => {
    let dataSource = await request(api, {
      params: {
        per_page: 12,
      },
    });
 
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          list: dataSource.data.slice(offset, offset + pageSize),
          total: dataSource.total,
        });
      }, 1000);
    });
  };

  const { data, error, loading, loadMore, loadingMore, noMore } = useRequest(
    (d: Result | undefined) => getList({ pageSize: 4, offset: d?.list?.length || 0 }),
    { 
      loadMore: true,
      isNoMore: (d) => (d ? d.list.length >= d.total : false),
    },
  );
  console.log(data);

    const clear = (clearFilter: any) => {
      clearFilter()
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
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: FilterDropdownProps) => (
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
            <Button onClick={() => clear(clearFilters)} size="small" style={{ width: 90 }}>
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
          Add
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
      {noMore ? (
        <span>No more data</span>
      ) : (
        <Button onClick={loadMore} loading={loadingMore}>
          {loadingMore ? 'Loading more' : 'Click to load more'}
        </Button>
      )}
      <span style={{ float: 'right' }}>Total data: {data?.total}</span>
      <Table dataSource={data?.list} rowKey={(key) => key.id} columns={columns} bordered />
    </div>
  );
};
