import React, { Component } from 'react'
import { withRouter , Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchProducts } from '../../store/products/actions'
import { PRODUCTS } from '../../api'
import { db } from '../../firebase'
import { currency } from '../../utils'
import { addProduct } from '../../store/cart/actions'
import Skeleton from 'react-loading-skeleton'
import Swiper from 'react-id-swiper'
import 'swiper/swiper.scss'
import { Translation } from 'react-i18next'
import { RiArrowDropRightLine } from 'react-icons/ri'
import { BsPlus } from "react-icons/bs"
import { addView } from '../../store/view/actions'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

class NewProducts extends Component 
{
    static propTypes = {
        addView: PropTypes.func.isRequired,
        fetchProducts: PropTypes.func.isRequired,
        products: PropTypes.array.isRequired,
        addProduct: PropTypes.func.isRequired,
        cartProducts: PropTypes.array.isRequired,
    }

    state = {
        isLoading: false,
        items: []
    }

    handleFetchItems = () => {
        db 
        .ref(PRODUCTS)
        .orderByChild('dateFormatted')
        .on('value' , snapshot => {
            let data = []
            snapshot.forEach(snap => {
                data.push(snap.val())
            })
            const allItems = data.reverse()

            this.setState({
                items: allItems,
                isLoading: true                
            })
        })
    }

    componentDidMount() {
        this.handleFetchItems()  
    }

    render() {

        const { items } = this.state

        const params = {
            spaceBetween: 8,
            loop: false,
            lazy: true,
            // scrollbar: {
            //     el: '.swiper-scrollbar',
            //     hide: true
            // },
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

        const lists = items.length ? (
            <>
                <div
                    className="d-flex mb-3"
                >
                    <h4
                        className="mb-0 font-weight-normal text-default pr-4"
                        style={{
                            fontSize: '1.1rem',
                            lineHeight: '1.5em'
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.newproducts')}</>}
                        </Translation>
                    </h4>
                    <div
                        className="text-default ml-auto align-self-end link-default-hover font-weight-normal text-right"
                        style={{
                            lineHeight: '2',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            minWidth: '130px'
                        }}
                        onClick={() => this.props.history.push('/new-products')}
                    >
                        <Translation>
                            {(t) => <>{t('main.list.seeAll')}</>}
                        </Translation> <RiArrowDropRightLine />
                    </div>
                </div>

                <Swiper {...params}>
                    {
                        items.slice(0,20).map((p,index) => {

                            p.quantity = 1

                            return(
                                <div 
                                    className="bg-white h-100"
                                    key={index}
                                    onClick={() => this.props.addView(p)}
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
                                                className="mb-3 text-default font-weight-light"
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
                                                    onClick={() => this.props.history.push(`/product/${p.slug}`)}                                              
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
                                                    onClick={() => this.props.addProduct(p)}
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
            </>
        ) : (
            <>
                <div 
                    className="d-flex mb-3"
                >
                    <div
                        className="mt-0 mb-0"
                    >
                        <Skeleton width={150} height={28} />
                    </div>
                    <div
                        className="ml-auto"
                    >
                        <Skeleton width={108} height={28} />
                    </div>
                </div>
                <div className="row mx-n1">
                    <div 
                        className="col-6 col-md-4 col-lg-2 px-1"
                    >
                        <Skeleton height={361.89} />
                    </div>
                    <div 
                        className="col-6 col-md-4 col-lg-2 px-1"
                    >
                        <Skeleton height={361.89} />
                    </div>
                    <div 
                        className="d-none d-md-block d-lg-block col-md-4 col-lg-2 px-1"
                    >
                        <Skeleton height={361.89} />
                    </div>
                    <div 
                        className="d-none d-lg-block col-lg-2 px-1"
                    >
                        <Skeleton height={361.89} />
                    </div>
                    <div 
                        className="d-none d-lg-block col-lg-2 px-1"
                    >
                        <Skeleton height={361.89} />
                    </div>
                    <div 
                        className="d-none d-lg-block col-lg-2 px-1"
                    >
                        <Skeleton height={361.89} />
                    </div>
                </div>
            </>
        )

        return (
            <div className="pb-5 pt-2">
                <div className="container">
                    {lists}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    products: state.products.products,
    cartProducts: state.cart.products,
    cartTotal: state.total.data
})

export default connect(
    mapStateToProps , 
    {
        fetchProducts,
        addProduct,
        addView
    }
)(withRouter(NewProducts))