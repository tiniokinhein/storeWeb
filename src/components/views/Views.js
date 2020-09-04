import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter , Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { addProduct } from '../../store/cart/actions'
import { removeView } from '../../store/view/actions'
import { Translation } from 'react-i18next'
import { currency } from '../../utils'
import { BsPlus } from "react-icons/bs"


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

class Views extends Component 
{
    static propTypes = {
        addProduct: PropTypes.func.isRequired,
        removeView: PropTypes.func.isRequired
    }

    render() {

        const { views } = this.props 

        const lists = views.length <= 0 ? null : (
            <div className="py-5">
                <div className="container">
                    <div className="">
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
                                    {(t) => <>{t('main.recently.views')}</>}
                                </Translation>
                            </h4>
                            <div
                                className="ml-auto align-self-end link-default-hover font-weight-normal text-default text-right"
                                style={{
                                    lineHeight: '2',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    minWidth: '130px'
                                }}
                                onClick={() => this.props.removeView()}
                            >
                                <Translation>
                                    {(t) => <>{t('main.clear.all')}</>}
                                </Translation>
                            </div>
                        </div>
                    </div>
                    <div className="row mx-n1">
                        {
                            views.reduce((ac,current) => {
                                const x = ac.find(a => a.id === current.id)
                                if(!x) {
                                    return ac.concat([current])
                                } else {
                                    return ac
                                }
                            }, []).map((p,index) => {

                                p.quantity = 1

                                return(
                                    <div
                                        key={index}
                                        className="col-6 col-sm-4 col-md-3 col-lg-2 px-1 my-1"
                                    >
                                        <div 
                                            className="bg-white h-100"
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
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )

        return (
            <>
                {lists}
            </>
        )
    }
}

const mapStateToProps = state => ({
    views: state.view
})

export default connect(mapStateToProps,{addProduct,removeView})(withRouter(Views))