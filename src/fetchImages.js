import { Notify } from 'notiflix';
import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api';
const PIXABAY_API_KEY = '32067791-add368f6651f99cb5649ce22d';
export default async function fetchImages(params) {
  const response = await axios.get(`/?key=${PIXABAY_API_KEY}`, {
    params: params,
  });
  return await response;
}
