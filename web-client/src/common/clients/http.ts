import axios from 'axios';
import { TokenService } from '../utils/TokenService';

export const $http = axios.create({
  baseURL: '/api',
  headers: {
    'x-client-name': 'private-axios-client',
    Authorization: `Bearer ${TokenService.getToken()}`,
  },
});
