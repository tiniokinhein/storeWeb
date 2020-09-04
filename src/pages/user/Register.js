import React, { Component } from 'react'
import Layout from '../../components/layout/Layout'
import TopLayout from '../../components/layout/TopLayout'
import { Translation } from 'react-i18next'
import { signup } from '../../helpers/auth'
import { Link } from 'react-router-dom'
import { auth } from '../../firebase'
import Spinner from '../../components/layout/Spinner'

class Register extends Component 
{
    state = {
        email: '',
        password: '',
        displayName: '',
        error: null,
        loading: this.props.location.state
    }

    componentDidMount() {
        window.scrollTo(0,0)
    }

    handleOnChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    async handleSubmit(e) {
        e.preventDefault()
        this.setState({
            error: '',
            loading: true
        })

        try {
            await signup(this.state.email , this.state.password)

            var user = auth.currentUser
            user.updateProfile({
                displayName: this.state.displayName
            })

            auth.signOut()

            this.props.history.push('/login')
            
        } catch (error) {
            this.setState({
                error: error.message,
                loading: this.props.location.state
            })
        }
    }

    render() {

        const formList = 
            <form
                onSubmit={this.handleSubmit.bind(this)}
                autoComplete="off"
            >
                <div className="form-group mb-4">
                    <Translation>
                        {
                            (t) =>
                            <input
                                type="text"
                                name="displayName"
                                placeholder={t('main.addressName')}
                                value={this.state.displayName}
                                onChange={this.handleOnChange.bind(this)}
                                className="form-control shadow-sm rounded-sm border-dark px-3 bg-transparent"
                                style={{
                                    height: '50px',
                                    borderWidth: '2px'
                                }}
                                required
                            />
                        }
                    </Translation>                                    
                </div>
                <div className="form-group mb-4">
                    <Translation>
                        {
                            (t) =>
                            <input
                                type="email"
                                name="email"
                                placeholder={t('main.addressEmail')}
                                value={this.state.email}
                                onChange={this.handleOnChange.bind(this)}
                                className="form-control shadow-sm rounded-sm border-dark px-3 bg-transparent"
                                style={{
                                    height: '50px',
                                    borderWidth: '2px'
                                }}
                            />
                        }
                    </Translation>                                    
                </div>
                <div className="form-group mb-4">
                    <Translation>
                        {
                            (t) =>
                            <input
                                type="password"
                                name="password"
                                placeholder={t('main.password')}
                                value={this.state.password}
                                onChange={this.handleOnChange.bind(this)}
                                className="form-control shadow-sm rounded-sm border-dark px-3 bg-transparent"
                                style={{
                                    height: '50px',
                                    borderWidth: '2px'
                                }}
                            />
                        }
                    </Translation>                                    
                </div>
                <div className="form-group mb-4"> 
                    { 
                        this.state.error ? 
                        <p
                            className="text-danger font-weight-normal mb-4"
                            style={{
                                fontSize: '12px'
                            }}
                        >
                            {this.state.error}
                        </p> : null 
                    }  

                    <button
                        type="submit"
                        className="btn rounded-sm w-100 text-white bg-custom btn-cart-hover shadow-sm"
                        style={{
                            height: '50px',
                            background: '#000'
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.signup')}</>}
                        </Translation>
                    </button>                              
                </div>
                <p
                    className="mb-0 font-weight-normal text-center text-secondary"
                >
                    <Translation>
                        {(t) => <>{t('main.already.have.account')}</>}
                    </Translation>
                    &nbsp;
                    <Link
                        to="/login"
                        className="text-decoration-none text-default link-default-hover font-weight-bold"
                        style={{
                            color: '#7f187f'
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.signin')}</>}
                        </Translation>
                    </Link>
                </p>
            </form>

        return (
            <Layout>
                <TopLayout />

                {this.state.loading === true ? <Spinner /> : null}

                <div
                    className="py-5"
                    style={{
                        background: 'radial-gradient(circle, #0f4c82 , #003457)'
                    }}
                >
                    <h4
                        className="font-weight-normal mb-0 text-light text-center"
                        style={{
                            lineHeight: '1.5', 
                            fontSize: '1.3rem'
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.agent.account.register')}</>}
                        </Translation>
                    </h4>
                </div>
                <div
                    className="py-5 bg-light-custom"
                >
                    <div className="container">
                        <div className="col-12 col-md-8 col-lg-4 mx-auto px-0">

                            {formList}  

                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Register