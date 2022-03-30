//
//
import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { setAlert } from '../../store/actions/alert'
import { register } from '../../store/actions/auth'


const Register = ({ setAlert, register }) => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    })

    const { email, name, password, confirmPassword } = formData

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value} )
    const onSubmit = async(e) => {
        e.preventDefault()
        if (password !== confirmPassword)
            setAlert('password do not match', 'danger')
        else
            register({ email, password, name })
    }

    return(
        <Fragment>
            <h1 className="large text-primary">Register</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={ e => onSubmit(e) }>

                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={ e => onChange(e) }
                        required
                        />
                    <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                    Gravatar email</small
                    >
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={ e => onChange(e) }
                        required
                        />
                </div>
                <div className="form-group">
                    <input
                    type="password"
                    placeholder="Password"
                    name="password"

                    value={password}
                    onChange={ e => onChange(e) }
                    required
                    />
                </div>
                <div className="form-group">
                    <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"

                    value={confirmPassword}
                    onChange={ e => onChange(e) }
                    required
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
            Already have an account? <Link to="/login">Login</Link>
            </p>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    // isAuthenticated: PropTypes.bool
}


const mapStateToProps = state => ({
    // isAuthenticated: state.auth.isAuthenticated
})

export default connect(
    mapStateToProps,
    { setAlert, register }
)(Register)
