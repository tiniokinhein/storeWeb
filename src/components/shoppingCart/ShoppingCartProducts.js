import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { currency } from '../../utils'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Translation } from 'react-i18next'
import { Link } from 'react-router-dom'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

export default class ShoppingCartProducts extends Component 
{
    static propTypes = {
        product: PropTypes.object.isRequired,
        removeProduct: PropTypes.func.isRequired,
        changeProductQuantity: PropTypes.func.isRequired
    }

    state = {
        product: this.props.product,
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

    render() {
        const { product } = this.state

        return (
            <div
                className="my-3 py-3 border-top"
            >
                <div className="d-flex">
                    <div className="pr-0">
                        <Link
                            to={`/product/${product.slug}`}
                            className="text-decoration-none text-transparent"
                        >
                            <img
                                src={FETCHIMG+`/${product.image}`}
                                alt={product.title}
                                className="mr-3"
                                style={{
                                    width: '100px'
                                }}

                            />
                        </Link>
                    </div>
                    <div
                        className="align-self-center flex-grow-1"
                    >
                        <Link
                            to={`/product/${product.slug}`}
                            className="text-decoration-none text-transparent link-default-hover"
                        >
                            <h6 
                                className="mb-1 pb-0 text-default font-weight-normal"
                                style={{
                                    fontSize: '15px',
                                    lineHeight: '1.5',
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitLineClamp: '2',
                                    WebkitBoxOrient: 'vertical'
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
                                                        title_en: product.title,
                                                        title_mm: product.title_mm
                                                    }
                                                )
                                            }
                                        </>
                                    }
                                </Translation>
                            </h6>
                        </Link>
                        {
                            product.selected_color &&
                            product.selected_size &&
                                <p 
                                    className="mb-0"
                                    style={{
                                        whiteSpace: 'nowrap',
                                        fontSize: '10px',
                                        color: '#000'
                                    }}
                                >
                                    <small className="text-muted">
                                        <Translation>
                                            {(t) => <>{t('main.color')}</>}
                                        </Translation>
                                    </small>
                                    <small className="text-dark"> - {product.selected_color}</small> ၊&nbsp;
                                    <small className="text-muted">
                                        <Translation>
                                            {(t) => <>{t('main.size')}</>}
                                        </Translation>
                                    </small>
                                    <small className="text-dark"> - {product.selected_size}</small>
                                </p>
                        }
                        <div
                            className="pt-2"
                        >
                            <h5 
                                className="m-0 font-weight-bold"
                                style={{
                                    fontSize: '14px'
                                }}
                            >{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}</h5> 
                        </div>
                    </div>
                    
                    <div
                        className="align-self-center"
                    >
                        <div className="d-flex cart-wrapper">
                            <button 
                                className="change-product-button border-0 text-light rounded-circle shadow-none p-0 m-0" 
                                onClick={this.handleOnIncrease}
                                style={{
                                    width: '30px',
                                    height: '30px'
                                }}
                            >+</button>
                            <p 
                                className="px-2 text-center my-0"
                                style={{
                                    lineHeight: '30px'
                                }}
                            >
                                <small className="font-weight-bold">{product.quantity}</small>
                            </p>
                            <button 
                                className="change-product-button border-0 text-light rounded-circle shadow-none p-0 m-0" 
                                onClick={this.handleOnDecrease} 
                                disabled={product.quantity === 1 ? true : false}
                                style={{
                                    width: '30px',
                                    height: '30px'
                                }}
                            >-</button>
                        </div>
                        <div
                            className="text-right mt-2 text-default link-default-hover"
                            onClick={this.removeItem.bind(this,product)}
                            style={{
                                cursor: 'pointer',
                                fontSize: '1.5rem',
                                color: '#000'
                            }}
                        >
                            <RiDeleteBin6Line />
                        </div>
                    </div>
                </div>
            </div>
        )
    }                       
}
