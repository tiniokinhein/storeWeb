import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { Translation } from 'react-i18next'
import { db } from '../firebase'
import { CATEGORIES , PRODUCTS } from '../api'
import Layout from '../components/layout/Layout'
import TopLayout from '../components/layout/TopLayout'
import { currency } from '../utils'
import Skeleton from 'react-loading-skeleton'
import Swiper from 'react-id-swiper'
import 'swiper/swiper.scss'
// import { RiArrowDropRightLine } from 'react-icons/ri'
import { BsPlus } from "react-icons/bs"
import { addView } from '../store/view/actions'
import { addProduct } from '../store/cart/actions'
import { fetchProducts } from '../store/products/actions'
import Views from '../components/views/Views'


const FETCHSUBIMG = process.env.REACT_APP_FETCH_SUBCATEGORY
// const FETCHCATIMG = process.env.REACT_APP_FETCH_CATEGORY
const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

class Categories extends Component 
{
    static propTypes = {
        addView: PropTypes.func.isRequired,
        fetchProducts: PropTypes.func.isRequired,
        products: PropTypes.array.isRequired,
        addProduct: PropTypes.func.isRequired,
        cartProducts: PropTypes.array.isRequired,
    }

    state = {
        p: null,
        posts: []
    }

    getItem = () => {
        const slug = this.props.match.params.slug

        db
        .ref(CATEGORIES+`/${slug}`)
        .on('value' , snapshot => {
            const data = snapshot.val()
            this.setState({
                p: data
            })
        })
    }

    getProduct = () => {
        const slug = this.props.match.params.slug

        db
        .ref(PRODUCTS)   
        .orderByChild('category/slug')
        .equalTo(`${slug}`)
        .on('value' , snapshot => {
            const allLists = []
            snapshot.forEach(snap => {
                allLists.push(snap.val())
            })
            const data = allLists.reverse()
            this.setState({
                posts: data
            })
        })
    }

    componentDidMount() {
        this.getItem()
        this.getProduct()
        window.scrollTo(0,0)
    }

    componentDidUpdate(prevProps) {
        if(prevProps.match.params.slug !== this.props.match.params.slug) {
            this.getItem()
            this.getProduct()
            window.scrollTo(0,0)
        }
    }

    render() {

        const { p , posts } = this.state

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
                delay: 5000,
                disableOnInteraction: false,
            }
        }

        const titleList = posts.length ? (
            <div 
                style={{
                    background: 'radial-gradient(circle, #0f4c82 , #003457)'
                }}
            >
                <div className="container">
                    <div className="row">
                        {
                            posts.sort((a,b) => {
                                if (a.dateFormatted > b.dateFormatted) return a.dateFormatted > b.dateFormatted ? -1 : 1
                                return 0
                            }).slice(0,1).map(p => (
                                <div 
                                    className="col-12 col-md-11 col-lg-10 mx-auto" 
                                    key={p.slug}
                                    style={{
                                        paddingTop: '8rem',
                                        paddingBottom: '8rem',
                                        background: "transparent url("+ FETCHIMG + '/' + p.image +") no-repeat center / 400px"
                                    }}
                                >
                                    <div className="row">
                                        <div className="col-12 col-md-6 my-3 my-md-0">
                                            <h4
                                                className="text-light m-0 font-weight-normal"
                                                style={{
                                                    fontSize: '2.2rem',
                                                    lineHeight: '1.5',
                                                    textShadow: '0 0 3px rgba(0, 0, 0, 0.82)'
                                                }}
                                            >
                                                <Translation>
                                                    {
                                                        (t) => 
                                                        <>
                                                            {t(
                                                                'main.post.title',
                                                                {
                                                                    title_en: p.title,
                                                                    title_mm: p.title_mm
                                                                }
                                                            )}
                                                        </>
                                                    }
                                                </Translation>
                                            </h4>
                                            <div 
                                                className="text-white font-weight-normal d-block"
                                                style={{
                                                    fontSize: '12px'
                                                }}
                                            >
                                                {p.brand}
                                            </div>
                                            <p
                                                className="font-weight-bold mb-0 mt-4"
                                                style={{
                                                    fontSize: '1.4rem',
                                                    lineHeight: '1.5',
                                                    color: '#fe9902'
                                                }}
                                            >
                                                {p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                                            </p>
                                        </div>
                                        <div 
                                            className="col-12 col-md-6 my-3 my-md-0 text-left text-md-right text-light align-self-end"
                                        >
                                            <Link
                                                to={`/product/${p.slug}`}
                                                className="d-inline-block px-5 py-2 shadow text-white bg-custom text-decoration-none link-block-hover font-weight-bold btn-cart-hover"
                                                style={{
                                                    lineHeight: '1.5',
                                                    fontSize: '1rem',
                                                    background: '#000',
                                                    transition: '0.3s ease-in-out',
                                                    borderRadius: '3px'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.shop.now')}</>}
                                                </Translation>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        ) : (
            <div>
                <Skeleton height={383.27} />
            </div>
        )

        const headTitle = p ? (
            <div                  
                key={p.slug}
                className="position-absolute"
                style={{
                    left: '0',
                    top: '1rem',
                    right: '0'
                }}
            >
                <div className="container">
                    <h4
                        className="mb-0 font-weight-normal text-white-50"
                        style={{
                            fontSize: '1rem', 
                            lineHeight: '1.5em'
                        }}
                    >
                        <Translation>
                            {
                                (t) => 
                                <>
                                    {t(
                                        'main.post.title',
                                        {
                                            title_en: p.title,
                                            title_mm: p.title_mm
                                        }
                                    )}
                                </>
                            }
                        </Translation>
                    </h4>
                </div>
            </div>
        ) : null

        const productLists = posts.length <= 1 ? (
            <div className="py-5">
                <div 
                    className="d-flex mb-3"
                >
                    <div
                        className="mt-0 mb-0"
                    >
                        <Skeleton width={150} height={28} />
                    </div>
                    {/* <div
                        className="ml-auto"
                    >
                        <Skeleton width={108} height={28} />
                    </div> */}
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
            </div>
        ) : (
            <div className="py-5">
                <div
                    className="d-flex mb-3"
                >
                    <h4
                        className="mb-0 font-weight-normal text-default pr-4"
                        style={{
                            fontSize: '1.3rem',
                            lineHeight: '1.5em'
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.newproducts')}</>}
                        </Translation>
                    </h4>
                    {/* <div
                        className="text-primary ml-auto align-self-end link-default-hover font-weight-normal text-right"
                        style={{
                            lineHeight: '2',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            minWidth: '130px'
                        }}
                        onClick={() => this.props.history.push(`/category/${p.subcategory.slug}`)}
                    >
                        <Translation>
                            {(t) => <>{t('main.list.seeAll')}</>}
                        </Translation> <RiArrowDropRightLine />
                    </div> */}
                </div>

                <Swiper {...params}>
                    {
                        posts.sort((a,b) => {
                            if (a.dateFormatted > b.dateFormatted) return a.dateFormatted > b.dateFormatted ? -1 : 1
                            return 0
                        }).slice(1,20).map((p,index) => {

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
            </div>
        ) 

        const lists = p ? (            
            <div className="row mx-n2" key={p.slug}>
                {
                    p.subcategory.map((l,i) => (
                        <div
                            key={i}
                            className="col-6 col-sm-4 col-md-3 my-3 px-2 sub-cat-wrapper"
                        >
                            <Link
                                to={`/category/${l.slug}`}
                                className="text-decoration-none text-transparent link-scale-hover"
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={FETCHSUBIMG+`/${l.image}`}
                                        alt={l.title}
                                        className="img-fluid p-3"
                                        // style={{
                                        //     background: 'radial-gradient(circle, #0f4c82 , #003457 , #002f55)'
                                        // }}
                                    />
                                </div>
                                <h6
                                    className="mb-0 mt-2 text-left px-3 font-weight-normal text-dark link-default-hover"
                                    style={{
                                        fontSize: '0.9rem',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    <Translation>
                                        {
                                            (t) => 
                                            <>
                                                {t(
                                                    'main.post.title',
                                                    {
                                                        title_en: l.title,
                                                        title_mm: l.title_mm
                                                    }
                                                )}
                                            </>
                                        }
                                    </Translation>
                                </h6>
                            </Link>
                        </div>
                    ))
                }
            </div>
        ) : (
            <div className="row mx-n2">
                <div className="col-6 col-sm-4 col-md-3 my-3 px-2">
                    <Skeleton height={309.59} />
                </div>
                <div className="col-6 col-sm-4 col-md-3 my-3 px-2">
                    <Skeleton height={309.59} />
                </div>
                <div className="col-6 col-sm-4 col-md-3 my-3 px-2">
                    <Skeleton height={309.59} />
                </div>
                <div className="col-6 col-sm-4 col-md-3 my-3 px-2">
                    <Skeleton height={309.59} />
                </div>
                <div className="col-6 col-sm-4 col-md-3 my-3 px-2">
                    <Skeleton height={309.59} />
                </div>
                <div className="col-6 col-sm-4 col-md-3 my-3 px-2">
                    <Skeleton height={309.59} />
                </div>
                <div className="col-6 col-sm-4 col-md-3 my-3 px-2">
                    <Skeleton height={309.59} />
                </div>
                <div className="col-6 col-sm-4 col-md-3 my-3 px-2">
                    <Skeleton height={309.59} />
                </div>
            </div>
        )

        return (
            <Layout>
                <TopLayout />
                <div className="bg-light-custom">
                    <div className="position-relative">
                        {titleList}
                        {headTitle}
                    </div>
                    <div className="container">
                        {productLists}
                        {lists}                        
                    </div>

                    <Views />

                </div>                
            </Layout>
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
)(withRouter(Categories))