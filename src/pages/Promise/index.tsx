import { useEffect, useReducer } from 'react';
import { Button } from 'antd';
import request from 'umi-request';

const api = 'https://reqres.in/api/users';
const initState = {
  data: [],
  dataLength: 0,
  requestPage: 1,
  apiDataLength: 0,
};
const addMoreReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MORE':
      return addMore(state, action.payload);
    case 'FETCH_DATA':
      return fetchData(state, action.payload);
    default:
      return state;
  }
};

const addMore = (state, data) => {
  return {
    ...state,
    requestPage: data.requestPage + 1,
  };
};

const fetchData = (state, data) => {
  return {
    ...state,
    data: state.data.concat(data.data),
    requestPage: data.page,
    apiDataLength: data.total,
    dataLength: data.per_page,
  };
};

const Promise = () => {
  const [state, dispatch] = useReducer(addMoreReducer, initState);
  useEffect(async () => {
    await request(api, {
      params: {
        page: state?.requestPage || 1,
      },
    })
      .then((res) => {
        fetchData(res);
      })
      .catch((err) => alert(err));
  }, [state.requestPage]);

  const fetchData = (product) => {
    dispatch({ type: 'FETCH_DATA', payload: product });
  };

  const addMore = (product) => {
    dispatch({ type: 'ADD_MORE', payload: product });
  };

  return (
    <div>
      <Button
        disabled={state.data.length >= 12}
        onClick={() => {
          addMore(state);
        }}
      >
        Load more
      </Button>

      {state?.data?.map((item: any) => (
        <div key={item.id}>
          <div>{item.email}</div>
        </div>
      ))}
    </div>
  );
};

export default Promise;
