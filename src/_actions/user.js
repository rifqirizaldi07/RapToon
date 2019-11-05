

import axios from 'axios'
import config from '../../config-env'


export const getUser = (id,token) => {
  return {
    type: 'GET_USER',
    payload: axios({
      method: 'GET',
      headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`
        },
      url: `${config.API_URL}/user/${id}`
    })
  }}

