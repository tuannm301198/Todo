import React from 'react';

const Promise = () => {
  const day = new Date().toString();
  console.log(day);
  const today = Date.now();

  let url = new URL('https://chat.zalo.me/');
  console.log(url);
  return (
    <div>
      <p>{day}</p>
      <p>{today}</p>
    </div>
  );
};

export default Promise;
