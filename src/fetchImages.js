import { Notify } from 'notiflix';
import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api';
const PIXABAY_API_KEY = '32067791-add368f6651f99cb5649ce22d';
export default function fetchImages(params) {
  return axios
    .get(`/?key=${PIXABAY_API_KEY}`, {
      params: params,
    })
    .then(({ data, status }) => {
      if (status !== 200) {
        throw new Error(res.message);
      }
      return data;
    })
    .catch(error => {
      // console.log(error);
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}
