import {API} from '../api/api';

async function get_items_byCategroy(categories: any) {
  const res = await API.post('item/get-items-by-categories', {categories});
  return res.data;
}

async function send_message(data: any) {
  const res = await API.post('chat/send-message', data);
  return res.data;
}

export {get_items_byCategroy, send_message};
