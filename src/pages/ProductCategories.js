import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import TopLayout from '../components/layout/TopLayout'
import { Translation } from 'react-i18next'
import { CATEGORIES } from '../api'
import { db } from '../firebase'
import { RiArrowDropRightLine } from 'react-icons/ri'
import Skeleton from 'react-loading-skeleton'


const FETCHSUBIMG = process.env.REACT_APP_FETCH_SUBCATEGORY

class ProductCategories extends Component {
    state = {
        items: []
    }

    getItems = () => {
        db
            .ref(CATEGORIES)
            .on('value', snapshot => {
                let lists = []
                snapshot.forEach(snap => {
                    lists.push(snap.val())
                })

                const data = lists

                this.setState({
                    items: data
                })
            })
    }

    componentDidMount() {
        this.getItems()
        window.scrollTo(0, 0)
    }

    render() {

        const { items } = this.state

        const lists = items.length ? (
            <>
                {
                    items.map(p => (
                        <div
                            className="py-5 bg-light"
                            key={p.slug}
                        >
                            <div className="container">
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
                                            {
                                                (t) =>
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
                                    <div
                                        className="text-default ml-auto align-self-end link-default-hover font-weight-normal text-right"
                                        style={{
                                            lineHeight: '2',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            minWidth: '130px'
                                        }}
                                        onClick={() => this.props.history.push(`/c/${p.slug}`)}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.list.seeAll')}</>}
                                        </Translation> <RiArrowDropRightLine />
                                    </div>
                                </div>

                                <div
                                    className="row"
                                >
                                    {
                                        p.subcategory.map(s => (
                                            <div
                                                key={s.slug}
                                                className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3"
                                            >
                                                <Link
                                                    to={`/category/${s.slug}`}
                                                    className="text-decoration-none text-transparent d-block cat-link-hover link-default-hover"
                                                >
                                                    <img
                                                        src={FETCHSUBIMG + `/${s.image}`}
                                                        alt={s.name}
                                                        className="bg-light rounded-sm p-3 w-100"
                                                    />
                                                    <h4
                                                        className="mb-0 mt-3 font-weight-light text-default text-center"
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            lineHeight: '1.5em'
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
                                                                                    title_en: s.title,
                                                                                    title_mm: s.title_mm
                                                                                }
                                                                            )
                                                                        }
                                                                    </>
                                                            }
                                                        </Translation>
                                                    </h4>
                                                </Link>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </>
        ) : (
                <>
                    <div
                        className="py-5 bg-light"
                    >
                        <div className="container">
                            <div
                                className="d-flex mb-3"
                            >
                                <div
                                    className="mb-0 pr-4"
                                    style={{
                                        lineHeight: '1.5em'
                                    }}
                                >
                                    <Skeleton width={186} height={26} />
                                </div>
                                <div
                                    className="ml-auto align-self-end text-right"
                                    style={{
                                        minWidth: '130px'
                                    }}
                                >
                                    <Skeleton height={25} />
                                </div>
                            </div>
                            <div className="row">
                                {
                                    Array(6).fill().map((item, index) => (
                                        <div
                                            className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3"
                                            key={index}
                                        >
                                            <Skeleton height={205} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div
                        className="py-5 bg-light"
                    >
                        <div className="container">
                            <div
                                className="d-flex mb-3"
                            >
                                <div
                                    className="mb-0 pr-4"
                                    style={{
                                        lineHeight: '1.5em'
                                    }}
                                >
                                    <Skeleton width={186} height={26} />
                                </div>
                                <div
                                    className="ml-auto align-self-end text-right"
                                    style={{
                                        minWidth: '130px'
                                    }}
                                >
                                    <Skeleton height={25} />
                                </div>
                            </div>
                            <div className="row">
                                {
                                    Array(6).fill().map((item, index) => (
                                        <div
                                            className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3"
                                            key={index}
                                        >
                                            <Skeleton height={205} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div
                        className="py-5 bg-light"
                    >
                        <div className="container">
                            <div
                                className="d-flex mb-3"
                            >
                                <div
                                    className="mb-0 pr-4"
                                    style={{
                                        lineHeight: '1.5em'
                                    }}
                                >
                                    <Skeleton width={186} height={26} />
                                </div>
                                <div
                                    className="ml-auto align-self-end text-right"
                                    style={{
                                        minWidth: '130px'
                                    }}
                                >
                                    <Skeleton height={25} />
                                </div>
                            </div>
                            <div className="row">
                                {
                                    Array(6).fill().map((item, index) => (
                                        <div
                                            className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3"
                                            key={index}
                                        >
                                            <Skeleton height={205} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div
                        className="py-5 bg-light"
                    >
                        <div className="container">
                            <div
                                className="d-flex mb-3"
                            >
                                <div
                                    className="mb-0 pr-4"
                                    style={{
                                        lineHeight: '1.5em'
                                    }}
                                >
                                    <Skeleton width={186} height={26} />
                                </div>
                                <div
                                    className="ml-auto align-self-end text-right"
                                    style={{
                                        minWidth: '130px'
                                    }}
                                >
                                    <Skeleton height={25} />
                                </div>
                            </div>
                            <div className="row">
                                {
                                    Array(6).fill().map((item, index) => (
                                        <div
                                            className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3"
                                            key={index}
                                        >
                                            <Skeleton height={205} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div
                        className="py-5 bg-light"
                    >
                        <div className="container">
                            <div
                                className="d-flex mb-3"
                            >
                                <div
                                    className="mb-0 pr-4"
                                    style={{
                                        lineHeight: '1.5em'
                                    }}
                                >
                                    <Skeleton width={186} height={26} />
                                </div>
                                <div
                                    className="ml-auto align-self-end text-right"
                                    style={{
                                        minWidth: '130px'
                                    }}
                                >
                                    <Skeleton height={25} />
                                </div>
                            </div>
                            <div className="row">
                                {
                                    Array(6).fill().map((item, index) => (
                                        <div
                                            className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3"
                                            key={index}
                                        >
                                            <Skeleton height={205} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div
                        className="py-5 bg-light"
                    >
                        <div className="container">
                            <div
                                className="d-flex mb-3"
                            >
                                <div
                                    className="mb-0 pr-4"
                                    style={{
                                        lineHeight: '1.5em'
                                    }}
                                >
                                    <Skeleton width={186} height={26} />
                                </div>
                                <div
                                    className="ml-auto align-self-end text-right"
                                    style={{
                                        minWidth: '130px'
                                    }}
                                >
                                    <Skeleton height={25} />
                                </div>
                            </div>
                            <div className="row">
                                {
                                    Array(6).fill().map((item, index) => (
                                        <div
                                            className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3"
                                            key={index}
                                        >
                                            <Skeleton height={205} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </>
            )

        return (
            <Layout>
                <TopLayout />
                <div
                    className="py-4"
                    style={{
                        background: 'radial-gradient(circle, #0f4c82 , #003457)'
                    }}
                >
                    <div className="container">
                        <h4
                            className="font-weight-normal mb-0 text-light"
                            style={{
                                lineHeight: '1.5',
                                fontSize: '1.2rem'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.menu.itemCategories')}</>}
                            </Translation>
                        </h4>
                    </div>
                </div>

                {lists}

            </Layout>
        )
    }
}

export default withRouter(ProductCategories)