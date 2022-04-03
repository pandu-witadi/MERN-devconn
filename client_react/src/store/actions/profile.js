//
//
import axios from 'axios'

import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    ACCOUNT_DELETED
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

// create (and update) profile
export const createProfile = (formData, history, isEdit = false) => async dispatch => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' }
        }
        const res = await axios.post('/api/profile', formData, config)

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


// add experience
export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' }
        }
        const res = await axios.put('/api/profile/experience', formData, config)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch( setAlert('Experience addded', 'success') )
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

// add education
export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' }
        }
        const res = await axios.put('/api/profile/education', formData, config)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch( setAlert('Education addded', 'success') )
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

// delete experience
export const deleteExperience = id => async dispatch => {
    try {
        console.log(id)
        const res = await axios.delete(`/api/profile/experience/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch( setAlert('Experience deleted', 'success') )
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

// delete education
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch( setAlert('Education deleted', 'success') )
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

// delete account & profile
export const deleteAccount = () => async dispatch => {

    // confirmation
    if ( window.confirm('Are you sure? This can NOT be undone') ) {
        try {
            await axios.delete('/api/profile/')
            dispatch({ type: CLEAR_PROFILE })
            dispatch({ type: ACCOUNT_DELETED })
            dispatch( setAlert('Account deleted', 'success') )
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
}
