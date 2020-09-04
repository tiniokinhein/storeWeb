import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter , NavLink } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import TopLayout from '../components/layout/TopLayout'
import { PRODUCTS , CATEGORIES } from '../api'
import { db } from '../firebase'
import Products from '../components/search/Products'
import { fetchProducts } from '../store/products/actions'
import { addProduct } from '../store/cart/actions'
import { addView } from '../store/view/actions'
import Skeleton from 'react-loading-skeleton'
import { Translation } from 'react-i18next'
import FUNNY from '../assets/images/funny.gif'
import Checkbox from '../components/checkbox/Checkbox'
import { available_sizes , available_brands , available_colors } from '../components/search/SearchFilter'
import { FaPlus , FaMinus } from 'react-icons/fa'


class Search extends Component 
{
    static propTypes = {
        addView: PropTypes.func.isRequired,
        fetchProducts: PropTypes.func.isRequired,
        products: PropTypes.array.isRequired,
        addProduct: PropTypes.func.isRequired,
        cartProducts: PropTypes.array.isRequired
    }

    state = {
        products: [],
        productName: '',
        isLoading: true,
        cats: [],
        visible: '5',
        vis: '5'
    }

    getItems = () => {     
        if(this.props.location.state) { 
            let productName = this.props.location.state.productName
            
            db 
            .ref(PRODUCTS)
            .on('value' , snapshot => {
                const allLists = []
                snapshot.forEach(snap => {
                    allLists.push(snap.val())
                })
                const data = allLists

                const results = data.filter(p => 
                                                p.title.toLowerCase().includes(productName.toLowerCase()) ||
                                                p.title_mm.toLowerCase().includes(productName.toLowerCase()) ||
                                                p.brand.toLowerCase().includes(productName.toLowerCase()) ||
                                                p.price.toLowerCase().includes(productName.toLowerCase()) ||
                                                p.category.title.toLowerCase().includes(productName.toLowerCase()) ||
                                                p.category.title_mm.toLowerCase().includes(productName.toLowerCase()) ||
                                                p.subcategory.title.toLowerCase().includes(productName.toLowerCase()) ||
                                                p.subcategory.title_mm.toLowerCase().includes(productName.toLowerCase())
                                            )

                this.setState({
                    products: results,
                    productName: productName,
                    isLoading: false
                })
            })
        }
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
        const sorted = this.state.products.sort(sortProperty)
        this.setState({
            products: sorted
        })
    }

    componentDidMount() {
        this.getItems()
        this.getCat()
        window.scrollTo(0,0)
    }

    componentDidUpdate(prevProps) {
        let prevSearch = prevProps.location.state.productName
        let newSearch = this.props.location.state.productName
        if (prevSearch !== newSearch) {
            this.getItems()
            this.getCat()
        }
    }

    UNSAFE_componentWillMount() {
        this.selectedCheckboxes = new Set()
    }

    toggleSizeCheckbox = label => {
        if (this.selectedCheckboxes.has(label)) {
          this.selectedCheckboxes.delete(label)
          window.location.reload(false)
        } else {
          this.selectedCheckboxes.add(label)
        }
        const selectedSizes = [...this.selectedCheckboxes]
    
        let shallowCopy = [...this.state.products].filter(p => 
            selectedSizes.find(f => 
                p.size.find(s => s === f)
            )
        )

        this.setState({
            products: [...shallowCopy]
        })
    }

    toggleBrandCheckbox = label => {
        if (this.selectedCheckboxes.has(label)) {
          this.selectedCheckboxes.delete(label)
          window.location.reload(false)
        } else {
          this.selectedCheckboxes.add(label)
        }

        const selectedBrands = [...this.selectedCheckboxes]
    
        let shallowCopy = [...this.state.products].filter(p => 
            selectedBrands.find(f => 
                p.brand === f
            )
        )

        this.setState({
            products: [...shallowCopy]
        })
    }

    toggleColorCheckbox = label => {
        if (this.selectedCheckboxes.has(label)) {
          this.selectedCheckboxes.delete(label)
          window.location.reload(false)
        } else {
          this.selectedCheckboxes.add(label);
        }
        
        const selectedColors = [...this.selectedCheckboxes]
    
        let shallowCopy = [...this.state.products].filter(p => 
            selectedColors.find(f => 
                p.color.find(s => s === f)
            )           
        )

        this.setState({
            products: [...shallowCopy]
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

    render() {

        const { products , isLoading , cats } = this.state

        let searchResults = isLoading ? (
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
        ) : (
            <>
                {
                    products.length ? (
                        <Products 
                            products={this.state.products} 
                            addProduct={this.props.addProduct} 
                            addView={this.props.addView} 
                        />
                    ) : (
                        <div 
                            className="d-table w-100"
                            style={{
                                height: '500px'
                            }}
                        >
                            <div className="d-table-cell align-middle text-center">
                                <p
                                    className="text-muted font-weight-light mb-3"
                                    style={{
                                        fontSize: '1rem'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.no.result')}</>}
                                    </Translation>
                                </p>
                                <img
                                    src={FUNNY}
                                    alt=""
                                    className="img-fluid"
                                    width="50"
                                />
                            </div>
                        </div>
                    )
                }
            </>
        )

        const topTitle = 
            <div 
                className="mb-5"
                style={{
                    background: 'radial-gradient(circle, #0f4c82 , #003457)'
                }}
            >
                <div 
                    className="container py-4"
                >
                    <h4
                        className="text-light font-weight-normal mb-0"
                        style={{
                            fontSize: '1.3rem',
                            lineHeight: '1.5',
                            color: '#000'
                        }}
                    >
                        <strong>" {this.state.productName} "</strong> , <small style={{fontSize:'0.8rem'}}><Translation>{(t) => <>{t('main.result.for')}</>}</Translation> ( {products.length} )</small>
                    </h4>
                </div>
            </div> 

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


        const post_size = products.find(p => p.size)
        const post_brand = products.find(p => p.brand)
        const post_color = products.find(p => p.color)

        return (
            <Layout>
                <TopLayout />
                <div className="bg-light pb-5">
                    {topTitle}
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-3 col-lg-2 d-none d-md-block">
                                <div 
                                    className="mb-3 pb-3 border-bottom"
                                >
                                    <h4
                                        className="font-weight-normal text-dark mb-3 border-bottom pb-3"
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
                                {
                                    post_brand && (
                                        <div 
                                            className="mb-3 pb-3 border-bottom"
                                        >
                                            <h4
                                                className="font-weight-normal text-dark mb-3"
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
                                                className="font-weight-normal text-dark mb-3"
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
                                                className="font-weight-normal text-dark mb-3"
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
                            <div className="col-12 col-md-9 col-lg-10">
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
                                                products.length <= 1 ? (
                                                    <>
                                                        <Translation>
                                                            {(t) => <>{t('main.product')}</>}
                                                        </Translation> <strong className="font-weight-bold text-dark">({products.length})</strong> <Translation>{(t) => <>{t('main.item')}</>}</Translation>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Translation>
                                                            {(t) => <>{t('main.product')}</>}
                                                        </Translation> <strong className="font-weight-bold text-dark">({products.length})</strong> <Translation>{(t) => <>{t('main.items')}</>}</Translation>
                                                    </>
                                                )
                                            }
                                        </h4>
                                    </div>
                                    <div className="px-0 d-flex justify-content-end align-items-center">
                                        <div className="d-flex bg-white border awe-select-css">
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
                                    </div>
                                </div>
                                {searchResults}
                            </div>
                        </div>
                    </div>
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
)(withRouter(Search))