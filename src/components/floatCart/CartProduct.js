import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { currency } from '../../utils'
import { IoIosClose } from 'react-icons/io'
import { withRouter } from 'react-router-dom'
import { Translation } from 'react-i18next'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

class CartProduct extends Component 
{
    static propTypes = {
        product: PropTypes.object.isRequired,
        removeProduct: PropTypes.func.isRequired,
        changeProductQuantity: PropTypes.func.isRequired
    }

    state = {
        product: this.props.product,
        isMouseOver: false
    }

    handleMouseOver = () => {
        this.setState({
            isMouseOver: true
        })
    }

    handleMouseOut = () => {
        this.setState({
            isMouseOver: false
        })
    }

    handleOnIncrease = () => {
        const { changeProductQuantity } = this.props
        const { product } = this.state
        product.quantity = product.quantity + 1
        changeProductQuantity(product)
    }

    handleOnDecrease = () => {
        const { changeProductQuantity } = this.props
        const { product } = this.state
        product.quantity = product.quantity - 1
        changeProductQuantity(product)
    }

    removeItem = product => {
        const { removeProduct } = this.props
        removeProduct(product)
    }

    closeFloatCart = () => {
        document.getElementById('cartOpen').style.visibility = 'hidden'
        document.getElementById('cartOpen').style.height = '0'      
    }

    render() {
        const { product } = this.state
        const classes = ['shelf-item px-3 py-2 d-flex border-bottom']

        if(!!this.state.isMouseOver) {
            classes.push('shelf-item--mouseover')
        }

        return (
            <div className={classes.join(' ')}>
                <div
                    onClick={this.removeItem.bind(this,product)}
                    className="rounded-circle text-center align-self-center"
                    style={{
                        fontSize: '20px',
                        cursor: 'pointer',
                        minWidth: '24px',
                        minHeight: '24px',
                        lineHeight: '21px',
                        border: '1px solid #000',
                        color: '#000'
                    }}
                >
                    <IoIosClose />
                </div>
                <div className="flex-grow-1 px-2 align-self-center">
                    <button
                        onClick={() => {
                            this.props.history.push(`/product/${product.slug}`)
                            this.closeFloatCart()
                        }}
                        className="btn border-0 rounded-0 shadow-none p-0 w-100 text-left d-flex"
                    >
                        <img
                            src={FETCHIMG+`/${product.image}`}
                            alt={product.title}
                            className="shelf-item__thumb align-top mr-2 align-self-center"
                            style={{
                                width: '30px',
                                objectFit: 'cover'
                            }}
                        />
                        <div className="flex-grow-1">
                            <p
                                className="mb-1 text-default font-weight-bold"
                                style={{
                                    fontSize: '0.75rem',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '2',
                                    WebkitBoxOrient: 'vertical'
                                }}
                            >
                                <Translation>
                                    {(t) => 
                                        <>
                                            {t(
                                            'main.post.title',
                                            { 
                                                title_en: product.title,
                                                title_mm: product.title_mm
                                            }
                                            )}
                                        </>
                                    }
                                </Translation>
                            </p>
                            {
                                product.selected_color &&
                                <p
                                    className="mb-0 text-dark font-weight-normal" 
                                    style={{
                                        fontSize: '0.6rem'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.color')}</>}
                                    </Translation> - <strong>{product.selected_color}</strong>
                                </p>
                            }
                            {
                                product.selected_size &&
                                <p
                                    className="mb-0 text-dark font-weight-normal"
                                    style={{
                                        fontSize: '0.6rem'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.size')}</>}
                                    </Translation> - <strong>{product.selected_size}</strong>
                                </p>
                            }
                        </div>
                    </button>
                </div>
                <div className="align-self-start">
                    <div className="d-flex mb-2">
                        <button 
                            className="change-product-button shadow-none rounded-circle border-0 btn text-light p-0" 
                            onClick={this.handleOnIncrease}
                            style={{
                                width: '25px',
                                height: '25px'
                            }}
                        >+</button>
                        <div 
                            className="flex-grow px-2 align-self-center text-dark font-weight-bold"
                            style={{
                                fontSize: '0.7rem'
                            }}
                        >
                            {product.quantity}
                        </div>
                        <button 
                            className="change-product-button shadow-none rounded-circle border-0 btn text-light p-0" 
                            onClick={this.handleOnDecrease} 
                            disabled={product.quantity === 1 ? true : false}
                            style={{
                                width: '25px',
                                height: '25px'
                            }}
                        >-</button>
                    </div>
                    <p
                        className="font-weight-bold text-dark mb-0 text-right"
                        style={{
                            fontSize: '0.7rem'
                        }}    
                    >
                        {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                    </p>
                </div>
            </div>
        )
    }                       
}

export default withRouter(CartProduct)