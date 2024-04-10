import axios from "axios";

const dbURL = process.env.REACT_APP_DATABASE_URL || 'http://localhost:4000';

export default axios.create({
    baseURL: process.env.REACT_APP_DATABASE_URL
});