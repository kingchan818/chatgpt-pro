import axios from "axios";

function createAxiosFactory(url, headerOpt= {}, ...others) {
  const axiosInstance = axios.create({
	baseURL: url,
	headers: {
	  'Content-Type': 'application/json',
	  ...headerOpt,
	},
	...others,
  });
  return axiosInstance;
}

export default createAxiosFactory;