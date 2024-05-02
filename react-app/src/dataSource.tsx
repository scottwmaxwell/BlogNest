import axios from "axios";

const apiURL = 'https://www.blognestapi.site' ;

export default axios.create({
    baseURL: apiURL
});
