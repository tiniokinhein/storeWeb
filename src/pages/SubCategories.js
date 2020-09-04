import React, { Component , useState } from 'react'
import { withRouter , Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchProducts } from '../store/products/actions'
import { addProduct } from '../store/cart/actions'
import { Translation } from 'react-i18next'
import { db } from '../firebase'
import { SUBCATEGORIES , PRODUCTS , CATEGORIES } from '../api'
import Layout from '../components/layout/Layout'
import TopLayout from '../components/layout/TopLayout'
import { BsPlus } from "react-icons/bs"
import { currency } from '../utils'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { MdViewComfy , MdViewHeadline } from 'react-icons/md'
import Checkbox from '../components/checkbox/Checkbox'
import { available_sizes , available_brands , available_colors } from '../components/search/SearchFilter'
import Skeleton from 'react-loading-skeleton'
import { addView } from '../store/view/actions'
import Modal from 'react-modal'
import { MdArrowBack } from 'react-icons/md'
import { FaPlus , FaMinus } from 'react-icons/fa'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES
const FETCHSUBIMG = process.env.REACT_APP_FETCH_SUBCATEGORY

Modal.setAppElement('#root')


function Navbar(props) {
    return (
        <nav className="navbar p-0 w-100">
            <ul className="navbar-nav w-100">
                {props.children}
            </ul>
        </nav>
    )
}

function NavItem(props) {
    const [open, setOpen] = useState(false)

    return (
        <li className="nav-item position-relative">
            <button  
                className="icon-button d-block py-2 text-dark px-0 bg-transparent shadow-none border-0 rounded-0"
                style={{
                    lineHeight: '1.5'
                }}
                onClick={() => setOpen(!open)}
            >
                {props.text}
            </button>

            {
                open && 
                props.children
            }
        </li>
    )
}

class SubCategories extends Component 
{
    static propTypes = {
        addView: PropTypes.func.isRequired,
        fetchProducts: PropTypes.func.isRequired,
        products: PropTypes.array.isRequired,
        addProduct: PropTypes.func.isRequired,
        cartProducts: PropTypes.array.isRequired
    }

    state = {
        posts: [],
        n: null,
        cats: [],
        subs: [],
        sizes: [],
        brands: [],
        colors: [],
        size: '',
        isLoading: false,
        visible: '5',
        vis: '5',
        isOpen: false
    }

    openModal = () => {
        this.setState({
            isOpen: true
        })
    }

    closeModal = () => {
        this.setState({
            isOpen: false
        })
    }

    getItem = () => {
        const slug = this.props.match.params.slug

        db
        .ref(PRODUCTS)
        .orderByChild('subcategory/slug')
        .equalTo(`${slug}`)
        .on('value' , snapshot => {
            const data = []
            snapshot.forEach(snap => {
                data.push(snap.val())
            })

            this.setState({
                posts: data,
                isLoading: true
            })
        })
    }

    getTitle = () => {
        const slug = this.props.match.params.slug

        db
        .ref(SUBCATEGORIES+`/${slug}`)
        .on('value' , snapshot => {
            const data = snapshot.val()
            this.setState({
                n: data
            })
        })
    }

    getSub = () => {
        db
        .ref(SUBCATEGORIES)
        .on('value' , snapshot => {
            const data = []
            snapshot.forEach(snap => {
                data.push(snap.val())
            })
            this.setState({
                subs: data
            })
        })
    }

    getCat = () => {
        db
        .ref(CATEGORIES)
        .on('value' , snapshot => {
            const data = []
            snapshot.forEach(snap => {
                data.push(snap.val())
            })
            this.setState({
                cats: data
            })
        })
    }

    sortPrice = type => {

        const compare = {
            lower: (a, b) => {
              if (a.price < b.price) return -1
              if (a.price > b.price) return 1
              return 0
            },
            higher: (a, b) => {
              if (a.price > b.price) return -1
              if (a.price < b.price) return 1
              return 0
            },
            normal: (a, b) => {
              if (a.dateFormatted > b.dateFormatted) return a.dateFormatted > b.dateFormatted ? -1 : 1
              if (a.dateFormatted < b.dateFormatted) return a.dateFormatted < b.dateFormatted ? 1 : -1
              return 0
            }
        }
        const sortProperty = compare[type]
        const sorted = this.state.posts.sort(sortProperty)
        this.setState({
            posts: sorted
        })
    }

    componentDidMount() {
        this.getItem()
        this.getTitle()
        this.getSub()
        this.getCat()
        window.scrollTo(0,0)
    }

    componentDidUpdate(prevProps) {
        if(prevProps.match.params.slug !== this.props.match.params.slug) {
            this.getItem()
            this.getTitle()
            this.getSub()
            this.getCat()
            window.scrollTo(0,0)
        }
    }

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     // if(prevProps.match.params.slug !== this.props.match.params.slug) {
    //     //     this.getItem()
    //     //     this.getTitle()
    //     //     this.getSub()
    //     //     this.getSize()
    //     //     this.getBrand()
    //     //     this.getColor()
    //     //     window.scrollTo(0,0)
    //     // }
    //     // const selectedSizes = [...this.selectedCheckboxes]
    //     // const selectedBrands = [...this.selectedCheckboxes]
    //     // const selectedColors = [...this.selectedCheckboxes]

    //     const { selectedSizes: nextSelectedSizes } = nextProps
    //     const selectedSizes = [...this.selectedCheckboxes]

    //     if (nextSelectedSizes.length !== selectedSizes.length) {
    //         this.state.posts(nextSelectedSizes, undefined)
    //     }
    // }

    UNSAFE_componentWillMount() {
        this.selectedCheckboxes = new Set()
    }

    toggleSizeCheckbox = label => {
        if (this.selectedCheckboxes.has(label)) {
          this.selectedCheckboxes.delete(label)
          window.location.reload(false)
        } else {
          this.selectedCheckboxes.add(label)
          this.closeModal()
        }
        const selectedSizes = [...this.selectedCheckboxes]
    
        let shallowCopy = [...this.state.posts]

        if(!!selectedSizes && selectedSizes.length > 0) {
            shallowCopy = shallowCopy.filter(p => 
                selectedSizes.find(f => 
                    p.size && p.size.find(s => s === f)
                )
            )
        }

        this.setState({
            posts: [...shallowCopy]
        })
    }

    toggleBrandCheckbox = label => {
        if (this.selectedCheckboxes.has(label)) {
          this.selectedCheckboxes.delete(label)
          window.location.reload(false)
        } else {
          this.selectedCheckboxes.add(label)
          this.closeModal()
        }

        const selectedBrands = [...this.selectedCheckboxes]
    
        let shallowCopy = [...this.state.posts]
        
        if(!!selectedBrands && selectedBrands.length > 0) {
            shallowCopy = shallowCopy.filter(p => 
                selectedBrands.find(f => 
                    p.brand && p.brand === f
                )
            )
        }

        this.setState({
            posts: [...shallowCopy]
        })
    }

    toggleColorCheckbox = label => {
        if (this.selectedCheckboxes.has(label)) {
          this.selectedCheckboxes.delete(label)
          window.location.reload(false)
        } else {
          this.selectedCheckboxes.add(label)
          this.closeModal()
        }
        
        const selectedColors = [...this.selectedCheckboxes]
    
        let shallowCopy = [...this.state.posts]

        if(!!selectedColors && selectedColors.length > 0) {
            shallowCopy = shallowCopy.filter(p => 
                selectedColors.find(f => 
                    p.color && p.color.find(s => s === f)
                )      
            )
        }

        this.setState({
            posts: [...shallowCopy]
        })
        
    }

    createSizeCheckbox = label => {
        return (
          <Checkbox
            label={label}
            handleCheckboxChange={this.toggleSizeCheckbox}
            key={label}
          />
        )
    }

    createBrandCheckbox = label => {
        return (
          <Checkbox
            label={label}
            handleCheckboxChange={this.toggleBrandCheckbox}
            key={label}
          />
        )
    }

    createColorCheckbox = label => {
        return (
          <Checkbox
            label={label}
            handleCheckboxChange={this.toggleColorCheckbox}
            key={label}
          />
        )
    }

    createMobileSizeCheckbox = label => {
        return (
          <Checkbox
            label={label}
            handleCheckboxChange={this.toggleSizeCheckbox}
            key={label}
          />
        )
    }

    createMobileBrandCheckbox = label => {
        return (
          <Checkbox
            label={label}
            handleCheckboxChange={this.toggleBrandCheckbox}
            key={label}
          />
        )
    }

    createMobileColorCheckbox = label => {
        return (
          <Checkbox
            label={label}
            handleCheckboxChange={this.toggleColorCheckbox}
            key={label}
          />
        )
    }

    loadMore() {
        this.setState((prev) => {
            return {
                visible: prev.visible + 50
            }
        })
    }

    loadLess() {
        this.setState({
            visible: 5
        })
    }

    loadMoreN() {
        this.setState((prev) => {
            return {
                vis: prev.vis + 50
            }
        })
    }

    loadLessN() {
        this.setState({
            vis: 5
        })
    }

    createSizeCheckboxes = () => available_sizes.slice(0,this.state.visible).map(this.createSizeCheckbox)
    createBrandCheckboxes = () => available_brands.map(this.createBrandCheckbox)
    createColorCheckboxes = () => available_colors.slice(0,this.state.vis).map(this.createColorCheckbox)

    createMobileSizeCheckboxes = () => available_sizes.map(this.createMobileSizeCheckbox)
    createMobileBrandCheckboxes = () => available_brands.map(this.createMobileBrandCheckbox)
    createMobileColorCheckboxes = () => available_colors.map(this.createMobileColorCheckbox)

    render() {

        const { posts , n , cats } = this.state

        const catLists = cats.length ? (
            <ul className="list-unstyled p-0 m-0">
                {
                    cats.map(p => (
                        <li key={p.slug} className="mb-1">
                        
                            <div className="btn-group flex-column side-cats-menu-wrapper w-100">
                                <button 
                                    type="button" 
                                    className="btn btn-transparent dropdown-toggle text-secondary font-weight-light shadow-none p-0 border-0 rounded-0 text-left position-relative" 
                                    data-toggle="dropdown" 
                                    data-display="static" 
                                    aria-haspopup="true" 
                                    aria-expanded="false"
                                    // onClick={() => this.props.history.push(`/${p.slug}`)}
                                    style={{
                                        fontSize: '0.8rem',
                                        lineHeight: '1.5',
                                        transition: '0.3s ease-in-out'
                                    }}
                                >
                                    <span className="tog-plus pr-3 float-left"><FaPlus /></span>
                                    <span className="tog-minus pr-3 float-left"><FaMinus /></span>

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
                                </button>
                                <div 
                                    className="dropdown-menu dropdown-menu-right dropdown-menu-lg-left flex-column mx-0 mt-0 mb-2 px-4 py-0 border-0 rounded-0 position-relative bg-transparent"
                                >
                                    {
                                        p.subcategory.map(s => (
                                            <NavLink
                                                key={s.slug}
                                                to={`/category/${s.slug}`}
                                                className="text-decoration-none text-secondary font-weight-light mt-2 link-default-hover"
                                                activeClassName="font-weight-bold text-dark"
                                                style={{
                                                    fontSize: '0.8rem',
                                                    lineHeight: '1.5',
                                                    transition: '0.3s ease-in-out'
                                                }}
                                                onClick={this.closeModal}
                                            >
                                                <Translation>
                                                    {
                                                        (t) => 
                                                        <>
                                                            {t(
                                                                'main.post.title',
                                                                {
                                                                    title_en: s.title,
                                                                    title_mm: s.title_mm
                                                                }
                                                            )}
                                                        </>
                                                    }
                                                </Translation>
                                            </NavLink>
                                        ))
                                    }
                                </div>
                            
                            </div>
                        </li>
                    ))
                }
            </ul>
        ) : (
            <>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
            </>
        )

        // const subLists = subs.length ? (
        //     <ul className="list-unstyled p-0 m-0">
        //         {
        //             subs.map(p => (
        //                 <li key={p.slug} className="mb-1">
        //                     <NavLink
        //                         to={`/category/${p.slug}`}
        //                         className="text-decoration-none text-secondary font-weight-light"
        //                         activeClassName="font-weight-bold text-dark"
        //                         style={{
        //                             fontSize: '0.8rem',
        //                             lineHeight: '1.5',
        //                             transition: '0.3s ease-in-out'
        //                         }}
        //                     >
        //                         <Translation>
        //                             {
        //                                 (t) => 
        //                                 <>
        //                                     {t(
        //                                         'main.post.title',
        //                                         {
        //                                             title_en: p.title,
        //                                             title_mm: p.title_mm
        //                                         }
        //                                     )}
        //                                 </>
        //                             }
        //                         </Translation>
        //                     </NavLink>
        //                 </li>
        //             ))
        //         }
        //     </ul>
        // ) : (
        //     <div>
        //         <Skeleton height={16} count={6} />
        //     </div>
        // )

        const topTitle = n ? (
            <div 
                className="mb-5"
                style={{
                    background: 'radial-gradient(circle, #0f4c82 , #003457)'
                }}
            >
                <div 
                    className="container py-5"
                    style={{
                        background: "transparent url("+ FETCHSUBIMG + '/' + n.image +") no-repeat right center / 100px"
                    }}
                >
                    <h4
                        className="text-light font-weight-normal mb-0"
                        style={{
                            fontSize: '1.3rem',
                            lineHeight: '1.5',
                            color: '#000'
                        }}
                    >
                        <Translation key={n.slug}>
                            {
                                (t) =>
                                <>
                                    {t(
                                        'main.post.title',
                                        {
                                            title_en: n.title,
                                            title_mm: n.title_mm
                                        }
                                    )}
                                </>
                            }
                        </Translation>
                    </h4>
                </div>
            </div>            
        ) : (
            <div 
                className="mb-5"
                style={{
                    background: 'radial-gradient(circle, #0f4c82 , #003457)',
                    height: '126.55px'
                }}
            >
                <div 
                    className="container py-5"
                >
                    <Skeleton height={30} width={100} />
                </div>
            </div>
        )

        const sizeList = 
            <div>
                {this.createSizeCheckboxes()}
                {
                    this.state.visible < available_sizes.length &&
                    <div
                        className="mt-2"
                    >
                        <button
                            onClick={this.loadMore.bind(this)}
                            className="text-dark font-weight-bold btn rounded-0 border-0 shadow-none text-capitalize p-0"
                            style={{
                                fontSize: '0.7rem',
                                lineHeight: '1.5'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.seeAll')}</>}
                            </Translation>
                        </button>
                    </div>
                }
                {
                    this.state.visible > available_sizes.length &&
                    <div
                        className="mt-2"
                    >
                        <button
                            onClick={this.loadLess.bind(this)}
                            className="text-dark font-weight-bold btn rounded-0 border-0 shadow-none text-capitalize p-0"
                            style={{
                                fontSize: '0.7rem',
                                lineHeight: '1.5'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.seeLess')}</>}
                            </Translation>
                        </button>
                    </div>
                }
            </div>

        const brandList = 
            <div>                
                {this.createBrandCheckboxes()}
                {/* {
                    this.state.visible < available_brands.length &&
                    <div
                        className="mt-2"
                    >
                        <button
                            onClick={this.loadMore.bind(this)}
                            className="text-dark font-weight-bold btn rounded-0 border-0 shadow-none text-capitalize p-0"
                            style={{
                                fontSize: '0.7rem',
                                lineHeight: '1.5'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.seeAll')}</>}
                            </Translation>
                        </button>
                    </div>
                }
                {
                    this.state.visible > available_brands.length &&
                    <div
                        className="mt-2"
                    >
                        <button
                            onClick={this.loadLess.bind(this)}
                            className="text-dark font-weight-bold btn rounded-0 border-0 shadow-none text-capitalize p-0"
                            style={{
                                fontSize: '0.7rem',
                                lineHeight: '1.5'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.seeLess')}</>}
                            </Translation>
                        </button>
                    </div>
                } */}
            </div>

        const colorList = 
            <div>
                {this.createColorCheckboxes()}
                {
                    this.state.vis < available_colors.length &&
                    <div
                        className="mt-2"
                    >
                        <button
                            onClick={this.loadMoreN.bind(this)}
                            className="text-dark font-weight-bold btn rounded-0 border-0 shadow-none text-capitalize p-0"
                            style={{
                                fontSize: '0.7rem',
                                lineHeight: '1.5'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.seeAll')}</>}
                            </Translation>
                        </button>
                    </div>
                }
                {
                    this.state.vis > available_colors.length &&
                    <div
                        className="mt-2"
                    >
                        <button
                            onClick={this.loadLessN.bind(this)}
                            className="text-dark font-weight-bold btn rounded-0 border-0 shadow-none text-capitalize p-0"
                            style={{
                                fontSize: '0.7rem',
                                lineHeight: '1.5'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.seeLess')}</>}
                            </Translation>
                        </button>
                    </div>
                }
            </div>

        const sizeMobileList = 
        <div>
            {this.createMobileSizeCheckboxes()}
        </div>

        const brandMobileList = 
        <div>                
            {this.createMobileBrandCheckboxes()}
        </div>

        const colorMobileList = 
        <div>
            {this.createMobileColorCheckboxes()}                
        </div>

        const gridLists = posts.length ? (
            <>
                <div className="row mx-n1">
                    {
                        posts.map(p => {
                            
                            p.quantity = 1

                            return(
                                <div key={p.slug} className="col-6 col-md-4 col-lg-3 my-1 px-1">
                                    <div
                                        className="bg-white"
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
            </>
        ) : (
            <div className="row mx-n1">
                <div className="col-6 col-md-4 col-lg-3 my-1 px-1">
                    <Skeleton height={408} />
                </div>
                <div className="col-6 col-md-4 col-lg-3 my-1 px-1">
                    <Skeleton height={408} />
                </div>
                <div className="col-6 col-md-4 col-lg-3 my-1 px-1">
                    <Skeleton height={408} />
                </div>
                <div className="col-6 col-md-4 col-lg-3 my-1 px-1">
                    <Skeleton height={408} />
                </div>
                <div className="col-6 col-md-4 col-lg-3 my-1 px-1">
                    <Skeleton height={408} />
                </div>
                <div className="col-6 col-md-4 col-lg-3 my-1 px-1">
                    <Skeleton height={408} />
                </div>
                <div className="col-6 col-md-4 col-lg-3 my-1 px-1">
                    <Skeleton height={408} />
                </div>
                <div className="col-6 col-md-4 col-lg-3 my-1 px-1">
                    <Skeleton height={408} />
                </div>
            </div>
        )
        

        const rowLists = posts.length ? (
            <>
                <div className="row mx-n1">
                    {
                        posts.map(p => {
                            
                            p.quantity = 1

                            return(
                                <div key={p.slug} className="col-12 col-sm-6 my-1 px-1">
                                    <div
                                        className="bg-white d-flex"
                                        onClick={() => this.props.addView(p)}
                                    >
                                        <div
                                            className="border-right border-light col-5 px-0"
                                        >
                                            <Link
                                                to={`/product/${p.slug}`}
                                                className="text-decoration-none text-transparent link-default-hover link-scale-hover d-block"
                                            >
                                                <img 
                                                    src={FETCHIMG+`/${p.image}`} 
                                                    alt={p.title} 
                                                    className="w-100"
                                                    style={{
                                                        height: '171px',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </Link>
                                        </div>
                                        <div 
                                            className="col-7 px-0"
                                        >
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
                                </div>
                            )
                        })
                    }
                </div>
            </>
        ) : (
            <div className="row mx-n1">
                <div className="col-12 col-sm-6 my-1 px-1">
                    <Skeleton height={172} />
                </div>
                <div className="col-12 col-sm-6 my-1 px-1">
                    <Skeleton height={172} />
                </div>
                <div className="col-12 col-sm-6 my-1 px-1">
                    <Skeleton height={172} />
                </div>
                <div className="col-12 col-sm-6 my-1 px-1">
                    <Skeleton height={172} />
                </div>
                <div className="col-12 col-sm-6 my-1 px-1">
                    <Skeleton height={172} />
                </div>
                <div className="col-12 col-sm-6 my-1 px-1">
                    <Skeleton height={172} />
                </div>
                <div className="col-12 col-sm-6 my-1 px-1">
                    <Skeleton height={172} />
                </div>
                <div className="col-12 col-sm-6 my-1 px-1">
                    <Skeleton height={172} />
                </div>
            </div>
        )

        const post_size = posts.find(p => p.size)
        const post_brand = posts.find(p => p.brand)
        const post_color = posts.find(p => p.color)

        const customStyles = {
            content : {
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                padding: '0',
                margin: '0',
                border: '0',
                borderRadius: '0',
                zIndex: '999999999',
                background: '#fff'
            }
        }

        return (
            <Layout>
                <TopLayout />
                <div className="bg-light-custom pb-5">
                    {topTitle}
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-3 col-lg-2 d-none d-md-block">
                                <div 
                                    className="mb-3 pb-3 border-bottom"
                                >
                                    <h4
                                        className="font-weight-normal text-default mb-3 border-bottom pb-3"
                                        style={{
                                            fontSize: '1rem',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.menu.categories')}</>}
                                        </Translation>
                                    </h4>
                                    {catLists}                                    
                                </div>

                                {/* <div 
                                    className="mb-3 pb-3 border-bottom"
                                >
                                    <h4
                                        className="font-weight-bold text-dark mb-3 border-bottom pb-3"
                                        style={{
                                            fontSize: '1rem',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.menu.categories')}</>}
                                        </Translation>
                                    </h4>
                                    {subLists}                                    
                                </div> */}
                                
                                {
                                    post_brand && (
                                        <div 
                                            className="mb-3 pb-3 border-bottom"
                                        >
                                            <h4
                                                className="font-weight-normal text-default mb-3"
                                                style={{
                                                    fontSize: '1rem',
                                                    lineHeight: '1.5'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.brand')}</>}
                                                </Translation>
                                            </h4>
                                            {brandList}
                                        </div>
                                    )
                                }

                                {
                                    post_color && (
                                        <div 
                                            className="mb-3 pb-3 border-bottom"
                                        >
                                            <h4
                                                className="font-weight-normal text-default mb-3"
                                                style={{
                                                    fontSize: '1rem',
                                                    lineHeight: '1.5'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.color')}</>}
                                                </Translation>
                                            </h4>
                                            {colorList}
                                        </div>
                                    )
                                }

                                {
                                    post_size && (
                                        <div 
                                            className="mb-3 pb-3 border-bottom"
                                        >
                                            <h4
                                                className="font-weight-normal text-default mb-3"
                                                style={{
                                                    fontSize: '1rem',
                                                    lineHeight: '1.5'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.size')}</>}
                                                </Translation>
                                            </h4>
                                            {sizeList}
                                        </div> 
                                    )
                                }                       
                                                           
                            </div>

                            <div 
                                className="col-12 d-block d-md-none mb-4 position-relative mt-n3"
                            >
                                <button
                                    className="btn text-light shadow-none px-3 py-2 border-0 rounded-0 w-100"
                                    style={{
                                        fontSize: '0.8rem',
                                        lineHeight: '1.5',
                                        background: '#0474c0'
                                    }}
                                    onClick={this.openModal}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.filter.by')}</>}
                                    </Translation>
                                </button>
                            </div>

                            <div className="col-12 col-md-9 col-lg-10">
                                <Tabs>
                                    <TabList className="mb-0 border-0 list-unstyled p-0">
                                        <div 
                                            className="d-flex justify-content-between mb-3"
                                        >
                                            <div className="pr-2">
                                                <h4
                                                    className="font-weight-light text-secondary mb-0 pt-1"
                                                    style={{
                                                        fontSize: '0.8rem',
                                                        lineHeight: '1.5',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {
                                                        posts.length <= 1 ? (
                                                            <>
                                                                <Translation>
                                                                    {(t) => <>{t('main.product')}</>}
                                                                </Translation> <strong className="font-weight-bold text-dark">({posts.length})</strong> <Translation>{(t) => <>{t('main.item')}</>}</Translation>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Translation>
                                                                    {(t) => <>{t('main.product')}</>}
                                                                </Translation> <strong className="font-weight-bold text-dark">({posts.length})</strong> <Translation>{(t) => <>{t('main.items')}</>}</Translation>
                                                            </>
                                                        )
                                                    }
                                                </h4>
                                            </div>
                                            
                                            <div className="px-0 d-flex justify-content-end align-items-center">
                                                <div className="mr-4 d-flex bg-white border awe-select-css">
                                                    <span
                                                        className="off-xs-flex d-flex align-self-center py-2 pl-3 text-dark font-weight-bold bg-white"
                                                        style={{
                                                            fontSize: '0.75rem',
                                                            width: '80px',
                                                            lineHeight: '1.5'
                                                        }}
                                                    >
                                                        <Translation>
                                                            {(t) => <>{t('main.sort.by')}</>}
                                                        </Translation>
                                                    </span>
                                                    <select
                                                        onChange={(e) => this.sortPrice(e.target.value)}
                                                        className="py-2 pl-3 pr-4 shadow-none rounded-0 text-dark bg-white border-0"
                                                        style={{
                                                            lineHeight: '1.7',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >                                                        
                                                        <Translation>
                                                            {(t) => <option value="normal">{t('main.newest')}</option>}
                                                        </Translation>
                                                        <Translation>
                                                            {(t) => <option value="higher">{t('main.highest')}</option>}
                                                        </Translation>
                                                        <Translation>
                                                            {(t) => <option value="lower">{t('main.lowest')}</option>}
                                                        </Translation>                                                   
                                                    </select>
                                                    <div className="select-icon">
                                                        <svg focusable="false" viewBox="0 0 104 128" width="14" height="36" className="icon">
                                                            <path 
                                                                d="m2e1 95a9 9 0 0 1 -9 9 9 9 0 0 1 -9 -9 9 9 0 0 1 9 -9 9 9 0 0 1 9 9zm0-3e1a9 9 0 0 1 -9 9 9 9 0 0 1 -9 -9 9 9 0 0 1 9 -9 9 9 0 0 1 9 9zm0-3e1a9 9 0 0 1 -9 9 9 9 0 0 1 -9 -9 9 9 0 0 1 9 -9 9 9 0 0 1 9 9zm14 55h68v1e1h-68zm0-3e1h68v1e1h-68zm0-3e1h68v1e1h-68z"
                                                            ></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <Tab
                                                    className="p-0 border-0 bg-transparent"
                                                >
                                                    <button
                                                        className="btn btn-transparent p-0 border-0 rounded-0 shadow-none mr-1"
                                                        style={{
                                                            height: '24px',
                                                            fontSize: '24px',
                                                            lineHeight: '0',
                                                            width: '26px',
                                                            color: '#a5a5a5'
                                                        }}
                                                    >
                                                        <MdViewComfy />
                                                    </button>
                                                </Tab>
                                                <Tab
                                                    className="p-0 border-0 bg-transparent"
                                                >
                                                    <button
                                                        className="btn btn-transparent p-0 border-0 rounded-0 shadow-none"
                                                        style={{
                                                            height: '24px',
                                                            fontSize: '24px',
                                                            lineHeight: '0',
                                                            width: '26px',
                                                            color: '#a5a5a5'
                                                        }}
                                                    >
                                                        <MdViewHeadline />
                                                    </button>
                                                </Tab>
                                            </div>
                                        </div>
                                    </TabList>
                                    <TabPanel>
                                        {/* {
                                            posts.length <= 0 ?
                                            <p
                                                className="mb-0 font-weight-light text-dark text-center py-5"
                                                style={{
                                                    lineHeight: '1.5',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.noProducts')}</>}
                                                </Translation>
                                            </p> 
                                            : <>{gridLists}</>
                                        }        */}
                                        {gridLists}                                
                                    </TabPanel>
                                    <TabPanel>
                                        {/* {
                                            posts.length <= 0 ?
                                            <p
                                                className="mb-0 font-weight-light text-dark text-center py-5"
                                                style={{
                                                    lineHeight: '1.5',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.noProducts')}</>}
                                                </Translation>
                                            </p> 
                                            : <>{rowLists}</>
                                        }        */}
                                        {rowLists}                                 
                                    </TabPanel>
                                </Tabs>
                            </div>
                        </div>                        
                    </div>
                </div>

                <Modal
                    isOpen={this.state.isOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Filter by"
                    overlayClassName="filterBy"
                >
                    <div className="d-flex border-bottom p-3">
                        <div>
                            <button
                                className="btn btn-transparent shadow-none rounded-0 border-0 py-0 pl-0"
                                onClick={this.closeModal}
                            >
                                <MdArrowBack />
                            </button>
                        </div>
                        <div className="flex-grow-1 text-center">
                            <Translation>
                                {(t) => <>{t('main.filter.by')}</>}
                            </Translation>
                        </div>
                    </div>
                    <div className="d-flex px-3 my-2">
                        <Navbar>
                            <Translation>
                                {
                                    (t) =>
                                    <>
                                        <NavItem text={t('main.menu.categories')} >
                                            {catLists}
                                        </NavItem>
                                        {
                                            post_brand && (
                                                <NavItem text={t('main.brand')} >
                                                    {brandMobileList}                                                    
                                                </NavItem>
                                            )
                                        }
                                        {
                                            post_color && (
                                                <NavItem text={t('main.color')} >
                                                    {colorMobileList}
                                                </NavItem>
                                            )
                                        }

                                        {
                                            post_size && (
                                                <NavItem text={t('main.size')} >
                                                    {sizeMobileList}
                                                </NavItem>
                                            )
                                        }
                                    </>
                                }
                            </Translation>
                        </Navbar>
                    </div>
                </Modal>
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
)(withRouter(SubCategories))