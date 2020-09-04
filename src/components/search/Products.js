import React from 'react'
import { withRouter , Link } from 'react-router-dom'
import { Translation } from 'react-i18next'
import { BsPlus } from "react-icons/bs"
import { currency } from '../../utils'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

const Products = props => {
    return(
        <div className="row mx-n1">
            {
                props.products.map(p => {
                    
                    p.quantity = 1

                    return(
                        <div key={p.slug} className="col-6 col-md-4 col-lg-3 my-1 px-1">
                            <div
                                className="bg-white"
                                onClick={() => props.addView(p)}
                            >
                                <Link
                                    to={`/product/${p.slug}`}
                                    className="text-decoration-none text-transparent link-default-hover link-scale-hover d-block"
                                >
                                    <img 
                                        src={FETCHIMG+`/${p.image}`} 
                                        alt={p.title} 
                                        className="w-100"
                                    />  
                                </Link>
                                <Link
                                    to={`/product/${p.slug}`}
                                    className="text-decoration-none text-transparent link-default-hover link-scale-hover d-block"
                                >
                                    <div 
                                        className="px-3 py-3 font-weight-normal"
                                    >
                                        <h6
                                            className="mb-1 font-weight-light text-secondary"
                                            style={{
                                                fontSize: '0.65rem',
                                                height: '13px',
                                                lineHeight: '1.5em'
                                            }}
                                        >
                                            {p.brand}
                                        </h6>
                                        <h4 
                                            className="mb-3 text-dark font-weight-light"
                                            style={{
                                                fontSize: '0.9rem',
                                                lineHeight: '1.5em',
                                                height: '40px',
                                                display: '-webkit-box',
                                                overflow: 'hidden',
                                                WebkitLineClamp: '2',
                                                WebkitBoxOrient: 'vertical'
                                            }}
                                        >                                                   
                                            <Translation>
                                                {(t) => 
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
                                        </h4>
                                        <h6
                                            className="m-0 font-weight-bold text-dark"
                                            style={{
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                                        </h6>
                                    </div>
                                </Link>

                                <div 
                                    className="add-cart-div-hover-button"
                                >   
                                    {
                                        p.color && p.size ? (
                                            <button
                                                className="btn p-0 border-0 text-center d-flex rounded-0 shadow-none font-weight-light w-100 overflow-hidden"
                                                style={{
                                                    background: 'none'
                                                }}    
                                                onClick={() => props.history.push(`/product/${p.slug}`)}                                              
                                            >
                                                <div
                                                    className="flex-grow-1"
                                                    style={{
                                                        fontSize: '0.8rem',
                                                        color: '#fe9902',                                                                                                    
                                                        height: '50px',
                                                        lineHeight: '50px'
                                                    }}
                                                >
                                                    <Translation>
                                                        {(t) => <>{t('main.list.addToCart')}</>}
                                                    </Translation>
                                                </div>
                                                <div
                                                    className="text-white ml-auto bg-custom"
                                                    style={{
                                                        width: '40px',
                                                        height: '50px',
                                                        lineHeight: '50px',
                                                        fontSize: '1.5rem',
                                                        background: '#000',
                                                        cursor: 'pointer'
                                                    }}                                                        
                                                >
                                                    <BsPlus />
                                                </div>
                                            </button>
                                        ) : (
                                            <button
                                                className="btn p-0 border-0 text-center d-flex rounded-0 shadow-none font-weight-light w-100 overflow-hidden"
                                                style={{
                                                    background: 'none'
                                                }}
                                                onClick={() => props.addProduct(p)}
                                            >
                                                <div
                                                    className="flex-grow-1"
                                                    style={{
                                                        fontSize: '0.8rem',
                                                        color: '#fe9902',                                                                                                    
                                                        height: '50px',
                                                        lineHeight: '50px'
                                                    }}
                                                >
                                                    <Translation>
                                                        {(t) => <>{t('main.list.addToCart')}</>}
                                                    </Translation>
                                                </div>
                                                <div
                                                    className="text-white ml-auto bg-custom"
                                                    style={{
                                                        width: '40px',
                                                        height: '50px',
                                                        lineHeight: '50px',
                                                        fontSize: '1.5rem',
                                                        background: '#000'
                                                    }}
                                                >
                                                    <BsPlus />
                                                </div>
                                            </button>
                                        )
                                    }                                
                                    
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default withRouter(Products)