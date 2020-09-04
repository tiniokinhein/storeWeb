import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    loadCart,
    removeProduct,
    changeProductQuantity
} from '../../store/cart/actions'
import { updateTotalCart } from '../../store/total/actions'
import { withRouter , Link } from 'react-router-dom'
import ShoppingCartProducts from './ShoppingCartProducts'
import { Translation } from 'react-i18next'
import { currency } from '../../utils'
import { db } from '../../firebase'
import { CATEGORIES } from '../../api'
import Skeleton from 'react-loading-skeleton'


const FETCHCATIMG = process.env.REACT_APP_FETCH_CATEGORY

class ShoppingCart extends Component 
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
        category: [],
        isOpen: false
    }

    getCategories = () => {
        db
        .ref(CATEGORIES)
        .on('value' , snapshot => {
            let data = []
            snapshot.forEach(snap => {
                data.push(snap.val())
            })

            this.setState({
                category: data
            })
        })
    }

    componentDidMount() {
        this.getCategories()
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

    addProduct = product => {
        const { cartProducts , updateTotalCart } = this.props
        let productAlreadyInCart = false
        cartProducts.forEach(cp => {
            if(cp.id === product.id) {
                cp.quantity = product.quantity
                cp.selected_color = product.selected_color
                cp.selected_size = product.selected_size
                productAlreadyInCart = true
            }
        })
        if(!productAlreadyInCart) {
            cartProducts.push(product)
        }
        updateTotalCart(cartProducts)
    }

    removeProduct = product => {
        const { cartProducts , updateTotalCart } = this.props
        const index = cartProducts.findIndex(p => p.id === product.id)
        if(index >= 0) {
            cartProducts.splice(index , 1)
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

        const { category } = this.state

        const products = cartProducts.map(p => {
            return(
                <ShoppingCartProducts key={p.id} product={p} removeProduct={removeProduct} changeProductQuantity={changeProductQuantity} />
            )
        })

        let classes = ['float-cart-o h-100']

        if(!!this.state.isOpen) {
            classes.push('float-cart-o--open')
        }

        return (
            <div className={classes.join(' ')}>
                {
                    products.length <=0 ? (
                        <div className="container">
                            <div
                                className="mx-auto py-5 my-5"
                                style={{
                                    width: '640px',
                                    maxWidth: '100%'
                                }}
                            >
                                <h4
                                    className="mb-4 text-center font-weight-normal text-default"
                                    style={{
                                        lineHeight: '1.5',
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.menu.itemCategories')}</>}
                                    </Translation>
                                </h4>
                                <div className="row mx-0">
                                    {
                                        category.length ? (
                                            <>
                                                {
                                                    category.map(p => (
                                                        <div className="col-6 col-sm-4 col-lg-3 mb-4 text-center" key={p.slug}>
                                                            <Link
                                                                to={`/c/${p.slug}`}
                                                                className="text-decoration-none cat-link-hover text-dark"
                                                            >
                                                                <img
                                                                    src={FETCHCATIMG+`/${p.image}`}
                                                                    alt={p.title}
                                                                    className="rounded-0 p-4"
                                                                    style={{
                                                                        width: '140px',
                                                                        maxWidth: '100%',
                                                                        background: '#0f4c82'
                                                                    }}
                                                                /><br />
                                                                <span 
                                                                    className="d-inline-block mt-2 font-weight-normal"
                                                                    style={{
                                                                        fontSize: '0.9rem',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    <Translation>
                                                                        {
                                                                            (t) => 
                                                                            <>
                                                                                {
                                                                                    t(
                                                                                        'main.post.title',
                                                                                        {
                                                                                            title_en: p.title,
                                                                                            title_mm: p.title_mm
                                                                                        }
                                                                                    )
                                                                                }
                                                                            </>
                                                                        }
                                                                    </Translation>
                                                                </span>
                                                            </Link>
                                                        </div>
                                                    ))
                                                }
                                            </>
                                        ) : (
                                            <>
                                                {
                                                    Array(8).fill().map((item,index) => (
                                                        <div className="col-6 col-sm-4 col-lg-3 mb-4" key={index}>
                                                            <Skeleton  height={140} width={140} />
                                                        </div>
                                                    ))
                                                }
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-8 mb-3 mb-md-0">
                                    <div className="bg-white p-4 rounded-sm shadow-sm">
                                        <small className="text-default">
                                            <strong>
                                                ( {cartTotal.productQuantity}&nbsp;
                                                    <Translation>
                                                        {(t) => <>{t('main.items')}</>}
                                                    </Translation> )
                                            </strong>
                                        </small>
                                        <button
                                            className="btn float-right font-weight-normal text-custom p-0 shadow-none border-0 rounded-0"
                                            onClick={this.removeAllProducts}
                                            style={{
                                                cursor: 'pointer',
                                                lineHeight: '16px',
                                                color: '#000'
                                            }}
                                        >
                                            <small
                                                style={{
                                                    lineHeight: '2'
                                                }}
                                                className="font-weight-normal"
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.deleteAllItems')}</>}
                                                </Translation>
                                            </small>
                                        </button>

                                        {products}

                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 mb-3 mb-md-0">    
                                    <div className="bg-white p-4 rounded-sm shadow-sm">   
                                        <div className="d-flex justify-content-between">
                                            <p
                                                className="font-weight-light mb-0"
                                                style={{
                                                    fontSize: '14px',
                                                    lineHeight: '2'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.subtotal')}</>}
                                                </Translation>
                                            </p>
                                            <p
                                                className="font-weight-light mb-0"
                                                style={{
                                                    fontSize: '14px',
                                                    lineHeight: '2'
                                                }}
                                            >
                                                {cartTotal.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                                            </p>
                                        </div>
                                        {/* <div className="d-flex justify-content-between">
                                            <p
                                                className="font-weight-light mb-0"
                                                style={{
                                                    fontSize: '14px',
                                                    lineHeight: '2'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.discount')}</>}
                                                </Translation> <small className="font-weight-bold">(3%)</small>
                                            </p>
                                            <p
                                                className="font-weight-light mb-0"
                                                style={{
                                                    fontSize: '14px',
                                                    lineHeight: '2'
                                                }}
                                            >
                                                <small>( - )</small> {this.discountPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                                            </p>
                                        </div> */}
                                        <div className="d-flex justify-content-between mt-2">
                                            <p
                                                className="font-weight-bold mb-0 text-default"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '2',
                                                    letterSpacing: '0.5px'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.total')}</>}
                                                </Translation>
                                            </p>
                                            <p
                                                className="font-weight-bold mb-0 text-default"
                                                style={{
                                                    fontSize: '16px',
                                                    lineHeight: '2',
                                                    letterSpacing: '0.5px'
                                                }}
                                            >
                                                {this.allTotalPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                                            </p>
                                        </div>
                                        <div className="w-100 mt-4 pt-4 border-top d-none d-md-block">
                                            <button 
                                                className="btn-cart-hover btn shadow-sm w-100 py-2 text-white bg-default" 
                                                onClick={() => this.proceedToCheckout()}
                                                style={{
                                                    background: '#000',
                                                    lineHeight: '1.5',
                                                    borderRadius: '2px'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.checkout')}</>}
                                                </Translation>
                                            </button>
                                        </div>
                                    </div>    
                                </div>

                                <div 
                                    className="border-top d-flex d-md-none py-3 px-3 shadow-sm position-fixed justify-content-between bg-white"
                                    style={{
                                        left: '0',
                                        right: '0',
                                        bottom: '0',
                                        zIndex: '999'
                                    }}
                                >
                                    <p
                                        className="font-weight-light mb-0 text-default"
                                        style={{
                                            fontSize: '13px',
                                            lineHeight: '1.5',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.total')}</>}
                                        </Translation><br />
                                        <strong style={{fontSize:'15px'}} className="font-weight-bold">{this.allTotalPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}</strong>
                                    </p>
                                    <button 
                                        className="btn-cart-hover btn shadow-sm py-0 text-white bg-default flex-grow-1 ml-5" 
                                        onClick={() => this.proceedToCheckout()}
                                        style={{
                                            background: '#000',
                                            lineHeight: '1.5',
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
    { loadCart , removeProduct , changeProductQuantity , updateTotalCart }
)(withRouter(ShoppingCart))