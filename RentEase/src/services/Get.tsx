import {API} from '../api/api';

async function get_home_items() {
  const res = await API.get('item/get-all-items');
  return res.data.data;
}

export {get_home_items};
