import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ShoppingCart from '../components/shoppingCart/ShoppingCart'
import { Translation } from 'react-i18next'
import Layout from '../components/layout/Layout'
import TopLayout from '../components/layout/TopLayout'


class Cart extends Component 
{
    componentDidMount() {
        window.scrollTo(0,0)
    }

    render() {

        const { cartTotal } = this.props

        return (
            <Layout>
                <TopLayout />
                <div 
                    className="py-4"
                    style={{
                        background: 'radial-gradient(circle, #0f4c82 , #003457)'
                    }}
                >
                    <div className="container">
                        <h4
                            className="font-weight-normal mb-0 text-light"
                            style={{
                                lineHeight: '1.5',
                                fontSize: '1.2rem'
                            }}
                        >
                            {
                                cartTotal.productQuantity <= 0 ? (
                                    <>
                                        <Translation>
                                            {(t) => <>{t('main.cartEmpty')}</>}
                                        </Translation>
                                    </>
                                ) : (
                                    <>
                                        <Translation>
                                            {(t) => <>{t('main.shoppingCart')}</>}
                                        </Translation>
                                    </>
                                )
                            }
                        </h4>
                        
                    </div>
                </div>
                <div className="py-5 bg-light-custom">
                    <div className="container">
                        <ShoppingCart />
                    </div>
                </div>
            </Layout>
        )
    }
}

const mapStateToProps = state => ({
    cartTotal: state.total.data
})

export default connect(mapStateToProps)(withRouter(Cart))