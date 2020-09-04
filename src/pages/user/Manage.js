import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import TopLayout from '../../components/layout/TopLayout'
import { auth } from '../../firebase'
import { Translation } from 'react-i18next'
import Name from '../../components/user/Name'
import Profile from '../../components/user/Profile'
import LeftSideBar from '../../components/user/LeftSideBar'
import Address from '../../components/user/Address'

class Manage extends Component 
{
    state = {
        user: auth.currentUser
    }

    componentDidMount() {
        window.scrollTo(0,0)
    }

    render() {

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
                                        {(t) => <>{t('main.manage.account')}</>}
                                    </Translation>
                                </h4>
                                <div className="">
                                    <div className="row mx-n1">
                                        <div className="col-12 col-md-6 col-lg-4 mb-3 px-1">
                                            <Profile />
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4 mb-3 px-1">
                                            <Address />
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4 px-1"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default withRouter(Manage)