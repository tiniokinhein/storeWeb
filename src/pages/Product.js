import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter , Link } from 'react-router-dom'
import { Translation } from 'react-i18next'
import { db } from '../firebase'
import { PRODUCTS } from '../api'
import Skeleton from 'react-loading-skeleton'
import { currency } from '../utils'
import { addProduct } from '../store/cart/actions'
import Layout from '../components/layout/Layout'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { FaTruck } from 'react-icons/fa'
import { RiArrowDropRightLine } from 'react-icons/ri'
import TopLayout from '../components/layout/TopLayout'
import { updateTotalCart } from '../store/total/actions'
import {
    loadCart,
    removeProduct,
    changeProductQuantity
} from '../store/cart/actions'
import ReactImageMagnify from 'react-image-magnify'
import ImageGallery from 'react-image-gallery'
import "react-image-gallery/styles/css/image-gallery.css"
import { TiStarburst } from 'react-icons/ti'
import Views from '../components/views/Views'
import Swiper from 'react-id-swiper'
import 'swiper/swiper.scss'
import { addView } from '../store/view/actions'
import { BsPlus } from "react-icons/bs"
import Guide from '../components/products/Guide'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES
// const FETCHMOREIMG = process.env.REACT_APP_FETCH_MOREIMAGES

class Product extends Component 
{
    static propTypes = {
        addView: PropTypes.func.isRequired,
        addProduct: PropTypes.func.isRequired,
        // loadCart: PropTypes.func.isRequired,
        // removeProduct: PropTypes.func,
        // changeProductQuantity: PropTypes.func,
        // updateTotalCart: PropTypes.func.isRequired,
        // cartProducts: PropTypes.array.isRequired,
        // newProduct: PropTypes.object,
        // productToRemove: PropTypes.object,
        // productToChange: PropTypes.object
    }

    state = {
        p: null,
        selected_size: '',
        selected_color: '',
        products: []
    }

    getP = () => {
        const slug = this.props.match.params.slug

        db
        .ref(PRODUCTS+`/${slug}`)
        .on('value' , snapshot => {
            const data = snapshot.val()
            this.setState({
                p: {
                    ...data,
                    quantity: 1,
                    // selected_color: this.state.selected_color
                }
                // one: data.more_images[0],
                // two: data.more_images[1],
                // three: data.more_images[2],
                // four: data.more_images[3]
            })
        })
    }

    getProducts = () => {
        db
        .ref(PRODUCTS)
        .orderByChild('dateFormatted')
        .on('value' , snapshot => {
            let lists = []
            snapshot.forEach(snap => {
                lists.push(snap.val())
            })
            const data = lists.reverse()

            this.setState({
                products: data
            })
        })
    }

    handleOnChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    cartOnClick = () => {
        this.btnDisabled.setAttribute("disabled", "disabled")
        this.btnPayDisabled.setAttribute("disabled", "disabled")
    }

    cartOnClickMobile = () => {
        this.btnDisabledMobile.setAttribute("disabled" , "disabled")
        this.btnPayDisabledMobile.setAttribute("disabled" , "disabled")
    }

    componentDidMount() {
        this.getP()
        this.getProducts()
        window.scrollTo(0,0)
    }

    componentDidUpdate(prevProps) {
        if(prevProps.match.params.slug !== this.props.match.params.slug) {
            this.getP()
            this.getProducts()
            window.scrollTo(0,0)

            this.setState({
                selected_size: '',
                selected_color: '',
            })

        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.match.params.slug !== this.props.match.params.slug) {
            this.getP()
            this.getProducts()

            this.setState({
                selected_size: '',
                selected_color: '',
            })
        }
    }

    render() {

        const { p , products , selected_color , selected_size } = this.state

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

        const topLink = p ? (
            <div 
                className="py-4"
                style={{
                    background: 'radial-gradient(circle, #0f4c82 , #003457)'
                }}
            >
                <div className="container">
                    <div
                        className="d-flex"
                        key={p.id}
                    >
                        <Link
                            className="font-weight-light cat-link-hover text-white-50 text-truncate text-decoration-none align-self-center"
                            to={`/c/${p.category.slug}`}
                            style={{
                                fontSize: '0.8rem',
                                lineHeight: '1.5',
                                cursor: 'pointer',
                                transition: '0.3s ease-in-out'
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
                                                    title_en: p.category.title,
                                                    title_mm: p.category.title_mm
                                                }
                                            )
                                        }
                                    </>
                                }
                            </Translation>
                        </Link>
                        <span 
                            className="text-white-50 align-self-center"
                            style={{
                                fontSize: '1.7rem',
                                lineHeight: '0'
                            }}
                        >
                            <RiArrowDropRightLine />
                        </span>
                        <Link
                            className="font-weight-light cat-link-hover text-white-50 text-truncate text-decoration-none align-self-center"
                            to={`/category/${p.subcategory.slug}`}
                            style={{
                                fontSize: '0.8rem',
                                lineHeight: '1.5',
                                cursor: 'pointer',
                                transition: '0.3s ease-in-out'
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
                                                    title_en: p.subcategory.title,
                                                    title_mm: p.subcategory.title_mm
                                                }
                                            )
                                        }
                                    </>
                                }
                            </Translation>
                        </Link>
                        <span 
                            className="text-white-50 align-self-center"
                            style={{
                                fontSize: '1.7rem',
                                lineHeight: '0'
                            }}
                        >
                            <RiArrowDropRightLine />
                        </span>
                        <span
                            style={{
                                color: '#fff',
                                fontSize: '0.8rem',
                                lineHeight: '1.5'
                            }}
                            className="align-self-center font-weight-bold text-truncate"
                        >
                            <Translation>
                                {(t) => 
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
                        </span>
                    </div>
                </div>
            </div>
        ) : (
            <div
                className="py-4"
                style={{
                    background: 'radial-gradient(circle, #0f4c82 , #003457)'
                }}
            >
                <div className="container">
                    <Skeleton width={'50%'} height={27} />
                </div>
            </div>
        )

        const mobileAddToCart = p ? (
            <div 
                className="border-top d-flex d-sm-none py-3 px-2 shadow-sm position-fixed justify-content-between bg-white"
                style={{
                    left: '0',
                    right: '0',
                    bottom: '0',
                    zIndex: '999'
                }}
                key={p.slug}
            >
                <p
                    className="font-weight-light mb-0 align-self-center"
                    style={{
                        fontSize: '0.7rem',
                        lineHeight: '1.5'
                    }}
                >
                    <strong style={{fontSize:'0.7rem'}} className="font-weight-bold">{p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}</strong>
                </p>
                {
                    p.color || p.size ? (
                        <>
                            {
                                !selected_color || !selected_size ? (
                                    <>
                                        <button 
                                            className="btn shadow-sm py-1 text-light flex-grow-1 ml-2 ml-sm-5 mr-2 font-weight-normal" 
                                            style={{
                                                background: '#000',
                                                lineHeight: '1.6',
                                                fontSize: '0.8rem',
                                                borderRadius: '2px'
                                            }}
                                            disabled
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.list.addToCart')}</>}
                                            </Translation>
                                        </button>
                                        <button 
                                            className="btn shadow-sm py-1 text-light flex-grow-1 font-weight-normal" 
                                            style={{
                                                background: '#000',
                                                lineHeight: '1.6',
                                                fontSize: '0.8rem',
                                                borderRadius: '2px'
                                            }}
                                            disabled
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.shop.now')}</>}
                                            </Translation>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            className="btn-cart-hover btn shadow-sm py-1 bg-default text-light flex-grow-1 ml-2 ml-sm-5 mr-2 font-weight-normal" 
                                            style={{
                                                background: '#000',
                                                lineHeight: '1.6',
                                                fontSize: '0.8rem',
                                                borderRadius: '2px'
                                            }}
                                            onClick={() => {
                                                this.props.addProduct({...p,selected_color,selected_size}) 
                                                this.cartOnClickMobile()
                                            }}
                                            ref={btnDisabledMobile => {this.btnDisabledMobile = btnDisabledMobile}}
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.list.addToCart')}</>}
                                            </Translation>
                                        </button>
                                        <button 
                                            className="btn-cart-hover flex-grow-1 btn shadow-sm py-1 bg-custom text-light font-weight-normal" 
                                            style={{
                                                background: '#000',
                                                lineHeight: '1.6',
                                                fontSize: '0.8rem',
                                                borderRadius: '2px'
                                            }}
                                            onClick={() => {
                                                this.props.addProduct({...p,selected_color,selected_size}) 
                                                this.cartOnClickMobile()
                                                this.props.history.push('/checkout')
                                            }}
                                            ref={btnPayDisabledMobile => {this.btnPayDisabledMobile = btnPayDisabledMobile}}
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.shop.now')}</>}
                                            </Translation>
                                        </button>
                                    </>
                                )
                            }
                        </>
                    ) : (
                        <>
                            <button 
                                className="btn-cart-hover btn shadow-sm py-1 text-light flex-grow-1 ml-2 ml-sm-5 mr-2 font-weight-normal bg-default" 
                                style={{
                                    background: '#000',
                                    lineHeight: '1.6',
                                    fontSize: '0.8rem',
                                    borderRadius: '2px'
                                }}
                                onClick={() => {
                                    this.props.addProduct(p) 
                                    this.cartOnClickMobile()
                                }} //// ADD State to Redux Props (new)
                                ref={btnDisabledMobile => {this.btnDisabledMobile = btnDisabledMobile}}
                            >
                                <Translation>
                                    {(t) => <>{t('main.list.addToCart')}</>}
                                </Translation>
                            </button>
                            <button 
                                className="btn-cart-hover flex-grow-1 btn shadow-sm py-1 bg-custom text-light font-weight-normal" 
                                style={{
                                    background: '#000',
                                    lineHeight: '1.6',
                                    fontSize: '0.8rem',
                                    borderRadius: '2px'
                                }}
                                onClick={() => {
                                    this.props.addProduct({...p,selected_color,selected_size}) 
                                    this.cartOnClickMobile()
                                    this.props.history.push('/checkout')
                                }}
                                ref={btnPayDisabledMobile => {this.btnPayDisabledMobile = btnPayDisabledMobile}}
                            >
                                <Translation>
                                    {(t) => <>{t('main.shop.now')}</>}
                                </Translation>
                            </button>
                        </>
                    )
                }
            </div>
        ) : null

        const zoomImgs = () => {
            return(
                <ReactImageMagnify {...{
                        smallImage: {
                            alt: '',
                            isFluidWidth: true,
                            src: FETCHIMG+`/${p ? p.image : null}`,
                        },
                        largeImage: {
                            src: FETCHIMG+`/${p ? p.image : null}`,
                            width: 1200,
                            height: 1200
                        },
                        enlargedImageContainerDimensions: {
                            width: '100%',
                            height: '100%'
                        },
                        enlargedImageStyle: {
                            background: '#fff'
                        },
                        style: {
                            zIndex: '1',                                     
                        },
                        enlargedImagePortalId: "zoomPortal"
                    }} 
                />
            )
        }

        const mediumZoomImg = () => {
            return(
                <Zoom>
                    <picture>
                        <source media="(max-width: 800px)" srcSet={FETCHIMG+`/${p ? p.image : null}`} />
                        <img
                            alt=""
                            src={FETCHIMG+`/${p ? p.image : null}`}
                            width="100%"
                        />
                    </picture>
                </Zoom>
            )
        }


        const zoomProperties = {
            thumbnailPosition: "left",
            useBrowserFullscreen: false,
            showPlayButton: false,
            renderItem: zoomImgs,
            items: [
                {
                    original: FETCHIMG+`/${p ? p.image : null}`,
                    thumbnail: FETCHIMG+`/${p ? p.image : null}`
                },
                // {
                //     original: FETCHMOREIMG+`/${this.state.one}`,
                //     thumbnail: FETCHMOREIMG+`/${this.state.one}`
                // },
                // {
                //     original: FETCHMOREIMG+`/${this.state.two}`,
                //     thumbnail: FETCHMOREIMG+`/${this.state.two}`
                // },
                // {
                //     original: FETCHMOREIMG+`/${this.state.three}`,
                //     thumbnail: FETCHMOREIMG+`/${this.state.three}`
                // },
                // {
                //     original: FETCHMOREIMG+`/${this.state.four}`,
                //     thumbnail: FETCHMOREIMG+`/${this.state.four}`
                // }
            ]
        }

        const mediumProperties = {
            thumbnailPosition: "left",
            useBrowserFullscreen: false,
            showPlayButton: false,
            renderItem: mediumZoomImg,
            items: [
                {
                    original: FETCHIMG+`/${p ? p.image : null}`,
                    thumbnail: FETCHIMG+`/${p ? p.image : null}`
                }
            ]
        }

        const pDetail = p ? (
            <div className="" key={p.slug}>
                {
                    p.brand &&
                    <Link
                        to={`/brand/${p.brand_slug}`}
                        className="text-decoration-none text-transparent"
                    >
                        <small
                            style={{
                                fontSize: '0.9rem',
                                color: '#fe9902'
                            }}
                            className="font-weight-normal"
                        >
                            {p.brand}
                        </small>
                    </Link>
                }
                
                <h6 
                    className="font-weight-normal mb-3 mt-1 text-default"
                    style={{
                        fontSize: '1.3rem',
                        lineHeight: '1.5'
                    }}
                >
                    <Translation>
                        {(t) => 
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
                </h6>

                {
                    p.description &&
                    <div className="py-3">
                        <p 
                            className="mb-0 text-secondary"
                            style={{
                                lineHeight: '2',
                                fontSize: '14px'
                            }}
                        >
                            {p.description}
                        </p>
                    </div>
                }

                <div className="my-4">
                    <small 
                        className="font-weight-bold"
                        style={{
                            fontSize: '1rem'
                        }}
                    >{p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}</small>
                </div>

                <div className="border-top border-bottom py-1">
                    <div className="d-flex">
                        <span
                            className="mr-2 align-self-center text-default"
                            style={{
                                color: '#fe9902',
                                fontSize: '1.5rem'
                            }}
                        >
                            <FaTruck />
                        </span>
                        <span
                            className="mr-3 align-self-center text-dark font-weight-bold"
                            style={{
                                fontSize: '0.8rem'
                            }}
                        >
                            <TiStarburst /> 
                            <Translation>
                                {(t) => <>{t('main.deliveryNormalE')}</>}
                            </Translation>
                        </span>
                        <span
                            className="mr-3 align-self-center text-primary font-weight-light"
                            style={{
                                fontSize: '0.8rem'
                            }}
                        >
                            <TiStarburst /> 
                            <Translation>
                                {(t) => <>{t('main.deliveryDay1E')}</>}
                            </Translation>
                        </span>
                        {/* <span
                            className="mr-2 align-self-center text-danger font-weight-light"
                            style={{
                                fontSize: '0.8rem'
                            }}
                        >
                            <TiStarburst /> 
                            <Translation>
                                {(t) => <>{t('main.deliveryUrgentE')}</>}
                            </Translation>
                        </span> */}
                    </div>
                </div>
                
                {
                    p.color &&
                    <div className="my-4">
                        <div className="mb-2">
                            <h4
                                className="mb-1 text-muted font-weight-light"
                                style={{
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5'
                                }}
                            >
                                <Translation>
                                    {(t) => <>{t('main.color')}</>}
                                </Translation>
                            </h4>
                            {
                                this.state.selected_color === '' ? (
                                    <p
                                        className="text-custom font-weight-bold mb-0"
                                        style={{
                                            fontSize: '0.65rem',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.choose')}</>}
                                        </Translation>
                                    </p>
                                ) : (
                                    <p
                                        className="font-weight-bold mb-0"
                                        style={{
                                            fontSize: '0.65rem',
                                            color: '#fe9902',
                                            lineHeight: '1.5'
                                        }}
                                    >{this.state.selected_color}</p>
                                )
                            }
                        </div>

                        <div className="custom-checkbox">
                            {
                                p.color.map((n,index) => (
                                    <span 
                                        key={index}
                                        style={{
                                            width: '55px',
                                            height: '30px'
                                        }}
                                        className="d-inline-block list-unstyled p-0"
                                    >
                                        <input
                                            name="selected_color"
                                            id={n}
                                            type="radio"
                                            value={n}
                                            onChange={this.handleOnChange.bind(this)}
                                            checked={this.state.selected_color === n}
                                        />
                                        <label
                                            htmlFor={n}
                                            className=""
                                            style={{
                                                fontSize: '0.62rem',
                                                borderRadius: '2px'
                                            }}
                                        >
                                            {n}
                                        </label>
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                }

                {
                    p.size &&
                    <div className="py-4 border-top border-bottom">
                        <div className="mb-2">
                            <h4
                                className="mb-1 text-muted font-weight-light"
                                style={{
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5'
                                }}
                            >
                                <Translation>
                                    {(t) => <>{t('main.size')}</>}
                                </Translation>
                            </h4>
                            {
                                this.state.selected_size === '' ? (
                                    <p
                                        className="text-custom font-weight-bold mb-0"
                                        style={{
                                            fontSize: '0.65rem',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.choose')}</>}
                                        </Translation>
                                    </p>
                                ) : (
                                    <p
                                        className="font-weight-bold mb-0"
                                        style={{
                                            fontSize: '0.65rem',
                                            color: '#fe9902',
                                            lineHeight: '1.5'
                                        }}
                                    >{this.state.selected_size}</p>
                                )
                            }
                        </div>

                        <div className="custom-checkbox">
                            {
                                p.size.map((n,index) => (
                                    <span 
                                        key={index}
                                        style={{
                                            width: '35px',
                                            height: '35px'
                                        }}
                                        className="d-inline-block list-unstyled p-0"
                                    >
                                        <input
                                            name="selected_size"
                                            id={n}
                                            type="radio"
                                            value={n}
                                            onChange={this.handleOnChange.bind(this)}
                                            checked={this.state.selected_size === n}
                                        />
                                        <label
                                            htmlFor={n}
                                        >
                                            {n}
                                        </label>
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                }                        
                
                <div className="d-none d-sm-block py-4">
                    {
                        p.color || p.size ? (
                            <>
                                {
                                    !selected_color || !selected_size ? (
                                        <>
                                            <button 
                                                className="btn shadow-sm px-4 py-2 text-light font-weight-normal mr-2" 
                                                style={{
                                                    background: '#000',
                                                    lineHeight: '1.6',
                                                    fontSize: '1rem',
                                                    borderRadius: '2px'
                                                }}
                                                disabled
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.list.addToCart')}</>}
                                                </Translation>
                                            </button>
                                            <button 
                                                className="btn shadow-sm px-4 py-2 text-light font-weight-normal" 
                                                style={{
                                                    background: '#000',
                                                    lineHeight: '1.6',
                                                    fontSize: '1rem',
                                                    borderRadius: '2px'
                                                }}
                                                disabled
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.shop.now')}</>}
                                                </Translation>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                className="btn-cart-hover btn bg-default shadow-sm px-4 py-2 mr-2 text-light font-weight-normal" 
                                                style={{
                                                    background: '#000',
                                                    lineHeight: '1.6',
                                                    fontSize: '1rem',
                                                    borderRadius: '2px'
                                                }}
                                                onClick={() => {
                                                    this.props.addProduct({...p,selected_color,selected_size}) 
                                                    this.cartOnClick()
                                                }} //// ADD State to Redux Props (new)
                                                ref={btnDisabled => {this.btnDisabled = btnDisabled}}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.list.addToCart')}</>}
                                                </Translation>
                                            </button>
                                            <button 
                                                className="btn-cart-hover btn bg-custom shadow-sm px-4 py-2 text-light font-weight-normal" 
                                                style={{
                                                    background: '#000',
                                                    lineHeight: '1.6',
                                                    fontSize: '1rem',
                                                    borderRadius: '2px'
                                                }}
                                                onClick={() => {
                                                    this.props.addProduct({...p,selected_color,selected_size}) 
                                                    this.cartOnClick()
                                                    this.props.history.push('/checkout')
                                                }} //// ADD State to Redux Props (new)
                                                ref={btnPayDisabled => {this.btnPayDisabled = btnPayDisabled}}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.shop.now')}</>}
                                                </Translation>
                                            </button>
                                        </>
                                    )
                                }  
                            </>
                        ) : (
                            <>
                                <button 
                                    className="btn-cart-hover btn bg-default shadow-sm px-4 py-2 mr-2 text-light font-weight-normal" 
                                    style={{
                                        background: '#000',
                                        lineHeight: '1.6',
                                        fontSize: '1rem',
                                        borderRadius: '2px'
                                    }}
                                    onClick={() => {
                                        this.props.addProduct(p) 
                                        this.cartOnClick()
                                    }} //// ADD State to Redux Props (new)
                                    ref={btnDisabled => {this.btnDisabled = btnDisabled}}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.list.addToCart')}</>}
                                    </Translation>
                                </button>
                                <button 
                                    className="btn-cart-hover btn bg-custom shadow-sm px-4 py-2 text-light font-weight-normal" 
                                    style={{
                                        background: '#000',
                                        lineHeight: '1.6',
                                        fontSize: '1rem',
                                        borderRadius: '2px'
                                    }}
                                    onClick={() => {
                                        this.props.addProduct(p) 
                                        this.cartOnClick()
                                        this.props.history.push('/checkout')
                                    }} //// ADD State to Redux Props (new)
                                    ref={btnPayDisabled => {this.btnPayDisabled = btnPayDisabled}}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.shop.now')}</>}
                                    </Translation>
                                </button>
                            </>
                        )
                    }                                      
                </div>
            </div>
        ) : (
            <>
                <Skeleton height={18} width={100} />
                <div className="mb-3 mt-1">
                    <Skeleton height={30} width={'45%'} />
                </div>
                <div className="my-4">
                    <Skeleton height={20} width={80} />
                </div>
                <div className="border-top border-bottom py-1">
                    <Skeleton height={48} />
                </div>
                <div className="my-4">
                    <div className="mb-2">
                        <Skeleton height={30} width={100} />
                    </div>
                    <div className="d-flex">
                        {
                            Array(4).fill().map((item,index) => (
                                <div style={{margin:'8px 8px 0 0'}} key={index}>
                                    <Skeleton width={55} height={30} />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="py-4 border-top border-bottom">
                    <div className="mb-2">
                        <Skeleton height={30} width={100} />
                    </div>
                    <div className="d-flex">
                        {
                            Array(4).fill().map((item,index) => (
                                <div style={{margin:'8px 8px 0 0'}} key={index}>
                                    <Skeleton width={35} height={35} circle={true} />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="d-none d-sm-block py-4">
                    <Skeleton width={217} height={44} />
                </div>
            </>
        )       
        
        const relatedProducts = products.length ? (
            <div className="pt-5 mt-4">
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
                            {(t) => <>{t('main.related')}</>}
                        </Translation>&nbsp;
                        <Translation>
                            {
                                (t) =>
                                <>
                                    {
                                        t(
                                            'main.post.title',
                                            {
                                                title_en: p ? p.subcategory.title : null,
                                                title_mm: p ? p.subcategory.title_mm : null
                                            }
                                        )
                                    }
                                </>
                            }
                        </Translation>
                    </h4>
                    <div
                        className="text-primary ml-auto align-self-end link-default-hover font-weight-normal text-right text-default"
                        style={{
                            lineHeight: '2',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            minWidth: '130px'
                        }}
                        onClick={() => this.props.history.push(`/category/${p ? p.subcategory.slug : null}`)}
                    >
                        <Translation>
                            {(t) => <>{t('main.list.seeAll')}</>}
                        </Translation> <RiArrowDropRightLine />
                    </div>
                </div>
                <Swiper {...params}>
                    {
                        products
                        .filter(f => 
                            (p ? p.subcategory.slug : null) === f.subcategory.slug
                        )
                        .map((p,index) => {

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
            </div>
        ) : (
            <div className="pt-5 mt-4">
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
            </div>
        )

        const helpColor = p ? p.color : null
        const helpSize = p ? p.size : null
                
        return (
            <Layout>
                <TopLayout />
                {topLink}

                <div className="pb-5 pt-4 bg-light-custom">
                    <div className="container">
                        <div 
                            id="pDetail"
                            className="pb-5" 
                        >
                            <div
                                className="row" 
                            >
                                <div className="text-center col-12 col-md-6">
                                    <div className="post-detail-img-over d-none d-md-block">
                                        <ImageGallery {...zoomProperties} />
                                    </div>
                                    <div className="post-detail-img-over d-block d-md-none">
                                        <ImageGallery {...mediumProperties} />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 mt-4 mt-md-0 position-relative">
                                    <div 
                                        id="zoomPortal" 
                                        className="position-absolute"
                                        style={{
                                            left: '0',
                                            top: '0',
                                            right: '0',
                                            zIndex: '1'
                                        }}
                                    />
                                    {pDetail}
                                </div>                                

                            </div>

                            {mobileAddToCart}

                            {relatedProducts}

                        </div>
                        
                        
                        

                        {/* <Related />
                        <Categories /> */}

                        
                    </div>

                    <Views />

                </div>

                {
                    helpColor &&
                    helpSize &&
                    <Guide />
                }

            </Layout>
        )
    }
}

const mapStateToProps = state => ({
    cartProducts: state.cart.products,
    // newProduct: state.cart.productToAdd,
    // productToRemove: state.cart.productToRemove,
    // productToChange: state.cart.productToChange,
    // cartTotal: state.total.data
})

export default connect(
    mapStateToProps,
    {
        addProduct,
        updateTotalCart,
        loadCart,
        removeProduct, 
        changeProductQuantity,
        addView
    }
)(withRouter(Product))