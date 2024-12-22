import {API} from '../api/api';

async function delete_messages(data: any) {
  console.log(data);
  const res = await API.delete('chat/delete-messages', {data});
  return res.data;
}

export {delete_messages};
