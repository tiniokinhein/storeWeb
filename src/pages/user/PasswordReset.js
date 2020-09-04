import React, { useState } from 'react'
import Layout from '../../components/layout/Layout'
import TopLayout from '../../components/layout/TopLayout'
import { Translation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { resetemail } from '../../helpers/auth'
import Spinner from '../../components/layout/Spinner'

const PasswordReset = () => {
    const [email, setEmail] = useState("")
    const [emailHasBeenSent, setEmailHasBeenSent] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const onHandleChange = e => {
        const { name , value } = e.currentTarget
        if(name === "userEmail") {
            setEmail(value)
        }
    }

    const sentResetEmail = e => {
        e.preventDefault()

        setLoading(true)

        resetemail(email)
        .then(() => {
            setEmailHasBeenSent(true)
            setLoading(false)
            setTimeout(() => {
                setEmailHasBeenSent(false)
            }, 8000)
        })
        .catch(() => {
            setError(<Translation>{(t) => <>{t('main.error.reset.password')}</>}</Translation>)
            setLoading(false)
        })
    }

    return(
        <Layout>
            <TopLayout />
            {loading === true ? <Spinner /> : null}
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
                        {(t) => <>{t('main.reset.password')}</>}
                    </Translation>
                </h4>
            </div>
            <div
                className="py-5 bg-light-custom"
            >
                <div className="container">
                    <div className="col-12 col-sm-10 col-md-4 mx-auto px-0">
                        <form
                            onSubmit={sentResetEmail}
                            autoComplete="off"
                        >
                            {
                                emailHasBeenSent && (
                                    <p
                                        className="mb-4 font-weight-bold text-center text-dark"
                                        style={{
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.emailHasBeenSent')}</>}
                                        </Translation>
                                    </p>
                                )
                            }
                            {
                                error !== null && (
                                    <p
                                        className="mb-4 font-weight-bold text-center text-danger"
                                        style={{
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        {error}
                                    </p>
                                )
                            }

                            <div className="form-group mb-4">
                                <Translation>
                                    {
                                        (t) =>
                                        <input
                                            type="email"
                                            name="userEmail"
                                            placeholder={t('main.addressEmail')}
                                            value={email}
                                            onChange={onHandleChange}
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
                                <button
                                    type="submit"
                                    className="btn rounded-sm w-100 text-white bg-custom btn-cart-hover shadow-sm"
                                    style={{
                                        height: '50px',
                                        background: '#000'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.reset')}</>}
                                    </Translation>
                                </button>                              
                            </div>
                            <p
                                className="mb-0 font-weight-normal text-center text-secondary"
                            >
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
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PasswordReset