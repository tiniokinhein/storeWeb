import React, { Component } from 'react'
import Layout from '../../components/layout/Layout'
import TopLayout from '../../components/layout/TopLayout'
import { Translation } from 'react-i18next'
import { signin , signInWithGoogle , signInWithFacebook } from '../../helpers/auth'
import { Link } from 'react-router-dom'
import { GrFacebookOption } from 'react-icons/gr'
import { IoLogoGoogle } from 'react-icons/io'
import Spinner from '../../components/layout/Spinner'

class SignIn extends Component 
{
    state = {
        email: '',
        password: '',
        error: null,
        loading: this.props.location.state
    }

    componentDidMount() {
        window.scrollTo(0,0)
    }

    handleChange(e) {
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
            await signin(this.state.email , this.state.password)
            this.props.history.push('/manage-account')
        } catch (error) {
            this.setState({
                error: error.message,
                loading: this.props.location.state
            })
        }
    }

    async googleSignIn(e) {
        e.preventDefault()
        
        try {
            await signInWithGoogle()
            this.props.history.push('/manage-account')
        } catch (error) {}
    }

    async fbSignIn(e) {
        e.preventDefault()

        try {
            await signInWithFacebook()
            this.props.history.push('/manage-account')
        } catch (error) {}
    }

    render() {

        const signEmail = 
            <form
                onSubmit={this.handleSubmit.bind(this)}
                autoComplete="off"
            >
                <div className="form-group mb-4">
                    <Translation>
                        {
                            (t) =>
                            <input
                                type="email"
                                name="email"
                                placeholder={t('main.addressEmail')}
                                value={this.state.email}
                                onChange={this.handleChange.bind(this)}
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
                                onChange={this.handleChange.bind(this)}
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
                            {(t) => <>{t('main.signin')}</>}
                        </Translation>
                    </button>                              
                </div>
                <p
                    className="mb-0 font-weight-normal text-center text-secondary"
                >
                    <Translation>
                        {(t) => <>{t('main.dont.have.account')}</>}
                    </Translation>
                    &nbsp;
                    <Link
                        to="/register"
                        className="text-decoration-none text-default link-default-hover font-weight-bold"
                        style={{
                            color: '#7f187f'
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.register')}</>}
                        </Translation>
                    </Link>
                </p>
                <p
                    className="mb-0 mt-1 text-center"
                >
                    <Link
                        to="/password-reset"
                        className="font-weight-normal text-default"
                        style={{
                            color: '#fe9902',
                            fontSize: '0.8rem'
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.forgot.password')}</>}
                        </Translation>
                    </Link>
                </p>
            </form>

        const signSocial =
            <div
                className="text-center bg-white p-4 h-100 shadow-sm rounded-sm"
            >    
                <h4
                    className="mb-4 font-weight-normal text-default"
                    style={{
                        fontSize: '1.2rem'
                    }}
                >
                    <Translation>
                        {(t) => <>{t('main.or')}</>}
                    </Translation>
                    <span
                        className="d-inline-block w-100 text-left text-dark mt-4 font-weight-bold"
                        style={{
                            fontSize: '0.8rem'
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.login.with')}</>}
                        </Translation>
                    </span>
                </h4>            
                <button
                    type="button"
                    onClick={this.fbSignIn.bind(this)}
                    className="w-100 text-light py-2 font-weight-normal border-0 shadow-none mb-3 text-uppercase btn-cart-hover"
                    style={{
                        background: '#4064ad',
                        fontSize: '0.8rem',
                        borderRadius: '2px'
                    }}
                >
                    <div className="d-flex justify-content-center">
                        <div 
                            className="mr-2 align-self-center"
                            style={{
                                fontSize: '1.6rem',
                                height: '25px',
                                lineHeight: '0'
                            }}
                        >
                            <GrFacebookOption />
                        </div>
                        <div className="align-self-center">Facebook</div>
                    </div>
                </button>
                <button
                    type="button"
                    onClick={this.googleSignIn.bind(this)}
                    className="w-100 text-light py-2 font-weight-normal border-0 shadow-none text-uppercase btn-cart-hover"
                    style={{
                        background: '#e44134',
                        fontSize: '0.8rem',
                        borderRadius: '2px'
                    }}
                >
                    <div className="d-flex justify-content-center">
                        <div 
                            className="mr-2 align-self-center"
                            style={{
                                fontSize: '1.6rem',
                                height: '25px',
                                lineHeight: '0'
                            }}
                        >
                            <IoLogoGoogle />
                        </div>
                        <div className="align-self-center">Google</div>
                    </div>
                    
                </button>
            </div>


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
                            {(t) => <>{t('main.agent.account.signin')}</>}
                        </Translation>
                    </h4>
                </div>
                <div
                    className="py-5 bg-light-custom"
                >
                    <div className="container">
                        <div className="col-12 col-md-10 col-lg-8 mx-auto px-0">                            
                            <div className="row">
                                <div className="col-12 col-sm-6 mb-5 mb-sm-0">
                                    {signEmail}
                                </div>
                                <div className="col-12 col-sm-6">
                                    {signSocial}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default SignIn