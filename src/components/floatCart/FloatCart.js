import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    loadCart,
    removeProduct,
    changeProductQuantity
} from '../../store/cart/actions'
import { updateTotalCart } from '../../store/total/actions'
import CartProduct from './CartProduct'
import { withRouter } from 'react-router-dom'
import { currency } from '../../utils'
import { Translation } from 'react-i18next'
import { IoIosClose } from 'react-icons/io'


class FloatCart extends Component 
{
    static propTypes = {
        loadCart: PropTypes.func.isRequired,
        removeProduct: PropTypes.func,
        changeProductQuantity: PropTypes.func,
        updateTotalCart: PropTypes.func.isRequired,
        cartProducts: PropTypes.array.isRequired,
        newProduct: PropTypes.object,
        productToRemove: PropTypes.object,
        productToChange: PropTypes.object
    }

    state = {
        isOpen: false
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.newProduct !== this.props.newProduct) {
            this.addProduct(nextProps.newProduct)
        }
        if(nextProps.productToRemove !== this.props.productToRemove) {
            this.removeProduct(nextProps.productToRemove)
        }
        if(nextProps.productToChange !== this.props.productToChange) {
            this.changeProductQuantity(nextProps.productToChange)
        }
    }

    openFloatCart = () => {
        document.getElementById('cartOpen').style.visibility = 'visible'
        document.getElementById('cartOpen').style.opacity = '1'
    }

    closeFloatCart = () => {
        document.getElementById('cartOpen').style.visibility = 'hidden'
        document.getElementById('cartOpen').style.opacity = '0'      
    }

    addProduct = product => {
        const { cartProducts , updateTotalCart } = this.props
        let productAlreadyInCart = false
        cartProducts.forEach(cp => {
            if(cp.id === product.id) {
                cp.quantity += product.quantity
                productAlreadyInCart = true
            }
        })
        if(!productAlreadyInCart) {
            cartProducts.push(product)
        }
        updateTotalCart(cartProducts)
        this.openFloatCart()
    }

    removeProduct = product => {
        const { cartProducts , updateTotalCart } = this.props
        const index = cartProducts.findIndex(p => p.id === product.id)
        if(index >= 0) {
            cartProducts.splice(index,1)
            updateTotalCart(cartProducts)
        }
    }

    changeProductQuantity = changedProduct => {
        const { cartProducts , updateTotalCart } = this.props
        const product = cartProducts.find(p => p.id === changedProduct.id)
        product.quantity = changedProduct.quantity
        if(product.quantity <= 0) {
            this.removeProduct(product)
        }
        updateTotalCart(cartProducts)
    }

    proceedToCheckout = () => {
        const { productQuantity } = this.props.cartTotal
        if(!productQuantity) {
            alert('Add some product in the cart!')
        } else {
            this.props.history.push('/checkout')
            this.closeFloatCart()
        }
    }

    // discountPrice = () => {
    //     const { cartTotal } = this.props
    //     return cartTotal.totalPrice / 100 * 3
    // }

    allTotalPrice = () => {
        // const { cartTotal } = this.props
        // const TOTALPRICE = cartTotal.totalPrice - this.discountPrice()
        // return TOTALPRICE
        
        const { cartTotal } = this.props
        const TOTALPRICE = cartTotal.totalPrice
        return TOTALPRICE        
    }

    removeAllProducts = product => {
        const { cartProducts , updateTotalCart } = this.props
        const index = cartProducts.filter(p => p === product)
        if(index >= 0) {
            cartProducts.splice(index)
            updateTotalCart(cartProducts)
        }
    }

    render() {

        const { cartProducts , removeProduct , changeProductQuantity , cartTotal } = this.props

        const products = cartProducts.map(p => {
            return(
                <CartProduct key={p.id} product={p} removeProduct={removeProduct} changeProductQuantity={changeProductQuantity} />
            )
        })

        let classes = ['float-cart']

        if(!!this.state.isOpen) {
            classes.push('float-cart--open')
        }

        return (
            <div 
                className={classes.join(' ')} 
                id="cartOpen"
            >
                <div className="container h-100">
                    <div 
                        className="h-100 col-sm-4 col-md-6 col-lg-8 px-0 d-none d-sm-block float-left"
                        onClick={this.closeFloatCart}
                        style={{
                            cursor: 'pointer'
                        }}
                    />
                    <div className="float-cart__content col-12 col-sm-8 col-md-6 col-lg-4 ml-auto px-0 shadow" id="hover-cart-show">
            
                        {
                            products.length <=0 ? (
                                <>
                                    <div
                                        style={{
                                            padding: '0',
                                            top: '0',
                                            zIndex: '999',
                                            height: '40px',
                                        }}
                                        className="d-flex position-sticky bg-white border-bottom"
                                    >
                                        
                                        <h4 
                                            className="px-3 m-0 align-self-center text-default font-weight-bold flex-grow-1"
                                            style={{
                                                lineHeight: '2',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.shoppingCart')}</>}
                                            </Translation>
                                        </h4>
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="float-cart__close-btn text-center m-0 rounded-0 bg-white text-dark border-left"
                                                style={{
                                                    height: '40px',
                                                    width: '40px',
                                                    lineHeight: '40px',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => this.closeFloatCart()}
                                            >
                                                <IoIosClose />
                                            </div>
                                        </div>
                                    </div>

                                    <div 
                                        className="d-table w-100 px-3 position-relative bg-white"
                                        style={{
                                            height: '320px'
                                        }}
                                    >
                                        <div className="d-table-cell align-middle">
                                            <p 
                                                className="shelf-empty text-center text-custom mb-0 font-weight-bold"
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '0.7rem'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.noItemsInCart')}</>}
                                                </Translation>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="float-cart__footer p-0 bg-white border-bottom">
                                        <div className="p-3 border-top border-bottom">
                                            <button
                                                onClick={() => this.closeFloatCart()}
                                                className="btn px-2 py-1 border-0 bg-default text-light shadow-sm w-100 btn-cart-hover"
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '0.7rem',
                                                    transition: '0.3s ease-in-out',
                                                    background: '#000',
                                                borderRadius: '2px'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.continueShopping')}</>}
                                                </Translation>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div
                                        style={{
                                            padding: '0',
                                            top: '0',
                                            zIndex: '999',
                                            height: '40px'
                                        }}
                                        className="d-flex position-sticky bg-white border-bottom"
                                    >
                                        
                                        <h4 
                                            className="px-3 m-0 align-self-center text-default font-weight-bold flex-grow-1"
                                            style={{
                                                lineHeight: '2',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.shoppingCart')}</>}
                                            </Translation>
                                        </h4>
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="float-cart__close-btn text-center m-0 rounded-0 bg-white text-dark border-left"
                                                style={{
                                                    height: '40px',
                                                    width: '40px',
                                                    lineHeight: '40px',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => this.closeFloatCart()}
                                            >
                                                <IoIosClose />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        className="float-cart__shelf-container bg-white"
                                        style={{
                                            // paddingBottom: '70px'
                                        }}
                                    >
                                        {products}

                                        <div className="px-3">
                                            <button
                                                onClick={this.removeAllProducts}
                                                className="btn p-0 border-0 rounded-0 shadow-none w-100 text-left text-custom font-weight-normal link-default-hover"
                                                style={{
                                                    fontSize: '0.7rem',
                                                    height: '40px',
                                                    color: '#000'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.deleteAllItems')}</>}
                                                </Translation>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="float-cart__footer p-0 bg-white border-bottom">
                                        <div className="px-3 py-2 border-top border-bottom">
                                            <div 
                                                className="d-flex"
                                            >
                                                <div 
                                                    className="flex-grow-1 align-self-center text-dark font-weight-bold" 
                                                    style={{
                                                        lineHeight:'1.5',
                                                        fontSize: '0.7rem'
                                                    }}
                                                >
                                                    <small>
                                                        <Translation>
                                                            {(t) => <>{t('main.subtotal')}</>}
                                                        </Translation>
                                                    </small>
                                                </div>
                                                <div 
                                                    className="text-right align-self-center text-dark font-weight-bold" 
                                                    style={{
                                                        lineHeight:'1.5',
                                                        fontSize: '0.7rem'
                                                    }}
                                                >
                                                    <small>
                                                        {cartTotal.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                                                    </small>
                                                </div>
                                            </div>
                                            {/* <div 
                                                className="d-flex"
                                            >
                                                <div 
                                                    className="flex-grow-1 align-self-center text-dark font-weight-bold" 
                                                    style={{
                                                        lineHeight:'1.5',
                                                        fontSize: '0.7rem'
                                                    }}
                                                >
                                                    <small>
                                                        <Translation>
                                                            {(t) => <>{t('main.discount')}</>}
                                                        </Translation> (3%)
                                                    </small>
                                                </div>
                                                <div 
                                                    className="text-right align-self-center text-dark font-weight-bold" 
                                                    style={{
                                                        lineHeight:'1.5',
                                                        fontSize: '0.7rem'
                                                    }}
                                                >
                                                    <small>
                                                        - {this.discountPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                                                    </small>
                                                </div>
                                            </div> */}
                                            <div 
                                                className="d-flex"
                                            >
                                                <div 
                                                    className="flex-grow-1 align-self-center text-default font-weight-bold" 
                                                    style={{
                                                        lineHeight:'2',
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    <Translation>
                                                        {(t) => <>{t('main.total')}</>}
                                                    </Translation>
                                                </div>
                                                <div 
                                                    className="text-right align-self-center text-default font-weight-bold" 
                                                    style={{
                                                        lineHeight:'2',
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    {this.allTotalPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                                                </div>
                                            </div>
                                        </div>

                                        <div 
                                            className="p-3 d-flex"
                                        >
                                            <button
                                                onClick={() => {
                                                    this.props.history.push('/cart')
                                                    this.closeFloatCart()
                                                }}
                                                className="btn btn-primary px-2 py-1 border-0 text-light bg-default shadow-sm w-50 btn-cart-hover"
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '0.7rem',
                                                    marginRight: '7.5px',
                                                    borderRadius: '2px',
                                                    transition: '0.3s ease-in-out'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.goToCart')}</>}
                                                </Translation>
                                            </button>
                                            <button
                                                onClick={() => this.proceedToCheckout()}
                                                className="btn px-2 py-1 border-0 text-light bg-custom shadow-sm w-50 btn-cart-hover"
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '0.7rem',
                                                    marginLeft: '7.5px',
                                                    transition: '0.3s ease-in-out',
                                                    background: '#000',
                                                    borderRadius: '2px'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.checkout')}</>}
                                                </Translation>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )
                        }

                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    cartProducts: state.cart.products,
    newProduct: state.cart.productToAdd,
    productToRemove: state.cart.productToRemove,
    productToChange: state.cart.productToChange,
    cartTotal: state.total.data
})

export default connect(
    mapStateToProps,
    {
        loadCart, removeProduct , changeProductQuantity , updateTotalCart
    }
)(withRouter(FloatCart))