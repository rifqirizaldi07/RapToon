

import axios from 'axios'
import config from '../../config-env'



export const getAllSketch = () => {
  return {
    type: `GET_ALL_SKETCH`,
    payload: axios({
      method: 'GET',
      url: `${config.API_URL}/sketches`
  })
}}


export const getFav = (id, token) => {
  return {
    type: 'GET_FAVS',
    payload: axios({
      method: 'GET',
      headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`
        },
      url: `${config.API_URL}/user/${id}/favorites`
    })
  }}

