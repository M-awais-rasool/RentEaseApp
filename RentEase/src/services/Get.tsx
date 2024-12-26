import {API} from '../api/api';

async function get_home_items() {
  const res = await API.get('item/get-all-items');
  return res.data.data;
}

async function get_message(receiverId: string) {
  const res = await API.get(`chat/get-messages?receiverId=${receiverId}`);
  return res.data;
}

async function get_chatList() {
  const res = await API.get('chat/users-with-last-message');
  return res.data.data;
}

export {get_home_items, get_message, get_chatList};
