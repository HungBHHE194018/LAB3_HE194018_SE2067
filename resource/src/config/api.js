import axios from "axios";
const API = axios.create({
    baseURL: "http://localhost:9000/courses"
})
export const getCourses = () => API.get("/courses");
export default API;
