//
//
import axios from 'axios'

const setAuthToken = accessToken => {
    if (accessToken)
        axios.defaults.headers.common['x-access-token'] = accessToken
    else
        delete axios.defaults.headers.common['x-access-token']
}

export default setAuthToken
