import React from 'react'
import { withRouter , Link } from 'react-router-dom'
import Swiper from 'react-id-swiper'
import 'swiper/css/swiper.css'
import { Translation } from 'react-i18next'
import { BsPlus } from "react-icons/bs"
import { currency } from '../../utils'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

const params = {
    spaceBetween: 8,
    loop: false,
    lazy: true,
    breakpoints: {
        0: {
            slidesPerView: 2
        },
        561: {
            slidesPerView: 3
        },
        768: {
            slidesPerView: 4
        },
        992: {
            slidesPerView: 5
        },
        1200: {
            slidesPerView: 6
        }
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    }
}

const RelatedProducts = props => (
    <Swiper {...params}>
        {
            props.products.slice(0,20).map((p,index) => {

                p.quantity = 1

                return(
                    <div 
                        className="bg-white h-100"
                        key={index}
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
                                        height: '42px',
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
                )
            })
        }
    </Swiper>
)

export default withRouter(RelatedProducts)