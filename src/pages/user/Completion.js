import React, { Component } from 'react'
import Layout from '../../components/layout/Layout'
import TopLayout from '../../components/layout/TopLayout'
import Name from '../../components/user/Name'
import LeftSideBar from '../../components/user/LeftSideBar'
import { Translation } from 'react-i18next'
import { ORDERURL } from '../../api'
import { auth, db } from '../../firebase'
import Moment from 'react-moment'
import 'moment-timezone'


class Completion extends Component {
    _isMounted = false

    state = {
        orders: [],
        user: auth.currentUser
    }

    getOrders = () => {

        const { user } = this.state

        this._isMounted = true

        db
        .ref(ORDERURL)
        .orderByChild('checkout/contact/dateFormatted')
        .on('value', snapshot => {
            let lists = []
            snapshot.forEach(snap => {
                lists.push(snap.val())
            })

            const data = lists.reverse()

            if (this._isMounted) {
                this.setState({
                    orders: data.filter(f => {
                        return f.checkout.user.id === user.providerData[0].uid && f.status === 'Completed'
                    })
                })
            }
        })
    }

    componentDidMount() {
        this.getOrders()
        window.scrollTo(0, 0)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {

        const { orders } = this.state

        const tableTHCss = {
            borderBottom: '1px solid #f3f3f3',
            fontWeight: 'normal',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            whiteSpace: 'nowrap'
        }

        const tableTDCss = {
            borderBottom: '1px solid #f3f3f3',
            fontWeight: 'normal',
            fontSize: '0.75rem',
            lineHeight: '1.6',
            color: '#000',
            whiteSpace: 'nowrap'
        }

        const tableCompleteCss = {
            borderBottom: '1px solid #f3f3f3',
            fontWeight: 'normal',
            fontSize: '0.75rem',
            lineHeight: '1.6',
            color: '#28a745',
            whiteSpace: 'nowrap'
        }

        const orderList =
            <div className="table-responsive">
                <table
                    className="table table-borderless m-0"
                >
                    <thead>
                        <tr className="table-light text-default">
                            <th className="py-3" style={tableTHCss}>
                                <Translation>
                                    {(t) => <>{t('main.orderNo')}</>}
                                </Translation>
                            </th>
                            <th className="py-3" style={tableTHCss}>
                                <Translation>
                                    {(t) => <>{t('main.orderDate')}</>}
                                </Translation>
                            </th>
                            <th className="py-3" style={tableTHCss}>
                                <Translation>
                                    {(t) => <>{t('main.addressName')}</>}
                                </Translation>
                            </th>
                            <th className="py-3" style={tableTHCss}>
                                <Translation>
                                    {(t) => <>{t('main.addressPhone')}</>}
                                </Translation>
                            </th>
                            <th className="py-3" style={tableTHCss}>
                                <Translation>
                                    {(t) => <>{t('main.status')}</>}
                                </Translation>
                            </th>
                            <th className="py-3" style={tableTHCss}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map(p => (
                                <tr key={p.id}>
                                    <td style={tableTDCss} className="text-default font-weight-bold">
                                        {p.uuid}
                                    </td>
                                    <td style={tableTDCss}>
                                        <Moment
                                            fromNow
                                        >
                                            {p.checkout.contact.dateRaw}
                                        </Moment>
                                    </td>
                                    <td style={tableTDCss}>
                                        {p.checkout.contact.name}
                                    </td>
                                    <td style={tableTDCss}>
                                        {
                                            p.checkout.contact.phone && p.checkout.contact.phone
                                        }
                                    </td>
                                    <td style={tableCompleteCss}>
                                        {p.status}
                                    </td>

                                    <td style={tableTDCss} className="text-right position-relative">
                                        <button
                                            className="btn text-custom bg-transparent p-0 rounded-0 border-0 shadow-none link-default-hover"
                                            style={{
                                                fontSize: '0.85rem'
                                            }}
                                            onClick={() => this.props.history.push(`/completed-order/${p.uuid}`)}
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.view')}</>}
                                            </Translation>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

        const noOrderList =
            <>
                <div className="table-responsive">
                    <table
                        className="table table-borderless m-0"
                    >
                        <thead>
                            <tr className="table-light text-default">
                                <th className="py-3" style={tableTHCss}>
                                    <Translation>
                                        {(t) => <>{t('main.orderNo')}</>}
                                    </Translation>
                                </th>
                                <th className="py-3" style={tableTHCss}>
                                    <Translation>
                                        {(t) => <>{t('main.orderDate')}</>}
                                    </Translation>
                                </th>
                                <th className="py-3" style={tableTHCss}>
                                    <Translation>
                                        {(t) => <>{t('main.addressName')}</>}
                                    </Translation>
                                </th>
                                <th className="py-3" style={tableTHCss}>
                                    <Translation>
                                        {(t) => <>{t('main.addressPhone')}</>}
                                    </Translation>
                                </th>
                                <th className="py-3" style={tableTHCss}>
                                    <Translation>
                                        {(t) => <>{t('main.status')}</>}
                                    </Translation>
                                </th>
                                <th className="py-3" style={tableTHCss}></th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div className="d-table w-100 h-100">
                    <div
                        className="d-table-cell align-middle text-center"
                        style={{
                            height: '250px'
                        }}
                    >
                        <p
                            className="mb-3 font-weight-normal text-default"
                            style={{
                                fontSize: '0.9rem',
                                lineHeight: '1.5'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.no.order')}</>}
                            </Translation>
                        </p>
                        {/* <Link
                            to="/new-products"
                            className="d-inline-block py-2 px-4 text-white text-decoration-none shadow-sm btn-cart-hover"
                            style={{
                                fontSize: '0.8rem',
                                lineHeight: '1.5',
                                background: '#7f187f',
                                borderRadius: '2px'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.continueShopping')}</>}
                            </Translation>
                        </Link> */}

                    </div>
                </div>
            </>

        return (
            <Layout>
                <TopLayout />
                <Name />

                <div className="py-5 bg-light-custom">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-sm-5 col-lg-3 mb-4 mb-sm-0">
                                <LeftSideBar />
                            </div>
                            <div className="col-12 col-sm-7 col-lg-9">
                                <h4
                                    className="font-weight-normal mb-3 text-custom"
                                    style={{
                                        fontSize: '1.1rem',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.order.completions')}</>}
                                    </Translation>
                                </h4>
                                <div className="bg-white p-4 rounded-sm shadow-sm">
                                    {orders.length >= 1 ? orderList : noOrderList}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Completion