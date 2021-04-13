import { useEffect, useReducer } from 'react';
import { Button } from 'antd';
import request from 'umi-request';

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
  console.log(state);

  const newData = [...state.data];
  console.log(newData);

  return {
    ...state,
    data: newData.concat(data.data),
    requestPage: data.page,
    apiDataLength: data.total,
    dataLength: data.per_page,
  };
  // return newData.data.concat(...state.data);
};
const api = 'https://reqres.in/api/users';
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
  console.log(state);

  const fetchData = (product) => {
    dispatch({ type: 'FETCH_DATA', payload: product });
  };

  const addMore = (product) => {
    dispatch({ type: 'ADD_MORE', payload: product });
  };

  return (
    <div>
      <Button
        disabled={state.dataLength >= state.apiDataLength}
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
