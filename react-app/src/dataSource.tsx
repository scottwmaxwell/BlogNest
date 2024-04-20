import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL || 'https://www.blognestapi.site/';

export default axios.create({
    baseURL: apiURL
});