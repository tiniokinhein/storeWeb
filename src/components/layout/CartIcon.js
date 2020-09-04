import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { RiShoppingCartLine } from 'react-icons/ri'
import { Translation } from 'react-i18next'

class CartIcon extends Component {

    closeCart = () => {
        document.getElementById('hover-cart').onmouseleave = () => {
            document.getElementById('cartOpen').style.visibility = 'hidden'
            document.getElementById('cartOpen').style.opacity = '0'

            document.getElementById('top-bar-click').style.visibility = 'hidden'
            document.getElementById('top-bar-click').style.opacity = '0'
        }

        document.getElementById('hover-cart-show').onmouseleave = () => {
            document.getElementById('cartOpen').style.visibility = 'hidden'
            document.getElementById('cartOpen').style.opacity = '0'

            document.getElementById('top-bar-click').style.visibility = 'hidden'
            document.getElementById('top-bar-click').style.opacity = '0'
        }
    }

    hoverCart = () => {
        document.getElementById('hover-cart').onmouseover = () => {
            document.getElementById('cartOpen').style.visibility = 'visible'
            document.getElementById('cartOpen').style.opacity = '1'

            document.getElementById('top-bar-click').style.visibility = 'visible'
            document.getElementById('top-bar-click').style.opacity = '1'
        }

        document.getElementById('hover-cart-show').onmouseenter = () => {
            document.getElementById('cartOpen').style.visibility = 'visible'
            document.getElementById('cartOpen').style.opacity = '1'

            document.getElementById('top-bar-click').style.visibility = 'visible'
            document.getElementById('top-bar-click').style.opacity = '1'
        }
    }

    componentDidMount() {
        this.hoverCart()
        this.closeCart()
    }

    render() {

        const { cartTotal } = this.props

        return (
            <div
                className="text-center position-relative rounded-circle"
                style={{
                    width: '48px',
                    height: '48px',
                    lineHeight: '48px'
                }}
            >
                <Link
                    style={{
                        height: '48px'
                    }}
                    className="d-flex text-decoration-none"
                    id="hover-cart"
                    to="/cart"
                >
                    <div
                        className="mx-auto align-self-center justify-content-center align-items-center mb-0 d-flex flex-column text-light"
                        style={{
                            fontSize: '20px',
                            height: '48px'
                        }}
                    >
                        <RiShoppingCartLine />
                        <small
                            style={{
                                fontSize: '10px',
                                lineHeight: '1.6'
                            }}
                            className="text-white font-weight-normal"
                        >
                            <Translation>
                                {(t) => <>{t('main.cartIcon')}</>}
                            </Translation>
                        </small>
                    </div>


                    {
                        cartTotal.productQuantity <= 0 ? (
                            <></>
                        ) : (
                                <span
                                    style={{
                                        fontSize: '8px',
                                        color: '#000',
                                        right: '0',
                                        top: '-2px',
                                        lineHeight: '20px',
                                        display: 'inline-block',
                                        zIndex: '9999',
                                        height: '20px',
                                        width: '20px',
                                        // background: '#fb0000'
                                    }}
                                    className="font-weight-bold position-absolute rounded-circle bg-custom text-white"
                                >
                                    <span
                                        className="d-inline-block"
                                    >{cartTotal.productQuantity}</span>
                                </span>
                            )
                    }

                </Link>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    cartTotal: state.total.data
})

export default connect(mapStateToProps)(withRouter(CartIcon))
