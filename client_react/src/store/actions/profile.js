//
//
import axios from 'axios'

import {
    GET_PROFILE,
    PROFILE_ERROR
} from '../types'
import { setAlert } from './alert'


// get current user profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me')
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch(err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
         })
    }
}

// create profile
export const createProfile = (formData, history, isEdit = false) => async dispatch => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' }
        }
        const res = await axios.post('/api/profile', formData, config)
        console.log(res.data)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
        dispatch( setAlert(isEdit ? 'Profile updated' : 'Profile created', 'success') )
        if (isEdit)
            history.push('/dashboard')

    } catch(err) {
        const errors = err.response.data.errors
        if (errors)
            errors.forEach( error => dispatch( setAlert(error.msg, 'danger')) )

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
         })
    }
}