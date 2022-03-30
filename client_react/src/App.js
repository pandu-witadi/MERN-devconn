//
//
import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'

import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Alert from './components/layout/Alert'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'

import setAuthToken from './utils/setAuthToken'
import { loadUser } from './store/actions/auth'

// redux
import { Provider } from 'react-redux'
import store from './store'

// axios settings
import axios from 'axios'
import { baseURL } from './config'
axios.defaults.baseURL = baseURL


if (localStorage.accessToken)
    setAuthToken(localStorage.accessToken)


const App = () => {
    useEffect( () => {
        store.dispatch( loadUser() )
    }, [])

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Route exact path='/' component={Landing} />

                    <section className="container">
                        <Alert />
                        <Switch>
                            <Route exact path='/register' component={Register} />
                            <Route exact path='/login' component={Login} />
                            <Route exact path='/dashboard' component={Dashboard} />
                        </Switch>
                    </section>
                </Fragment>
            </Router>
        </Provider>
    )
}

export default App
