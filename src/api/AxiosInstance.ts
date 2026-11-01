import axios from 'axios';
import { host } from '../Constants.ts';

export const api = axios.create({
  baseURL: `${host}/api/v1`,
  withCredentials: true,
});