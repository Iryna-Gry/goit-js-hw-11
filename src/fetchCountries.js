import { Notify } from 'notiflix';
const BASE_URL = 'https://restcountries.com/v3.1';
export default function fetchCountries(name) {
  const url = `${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`;
  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.message);
      }
      return res.json();
    })
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}
