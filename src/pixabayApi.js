import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = `31765545-8dcac2b42d47ae7ceae61e9ee`;

export const GetPhoto = async function (searchQuery, page) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&orientation=horizontal&safesearch=true&image_type=photo&per_page=40&page=${page}`
  );
  return response;
};