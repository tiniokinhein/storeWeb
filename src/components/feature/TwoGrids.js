import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
// import FIRSTIMG from '../../assets/images/fitness-fav.jpg'
// import SECONDIMG from '../../assets/images/work-from-home.jpg'
// import { Translation } from 'react-i18next'
import MK_PROMO_GIRL from '../../assets/images/mk_promo_g.png'
import MK_PROMO_BOY from '../../assets/images/mk_promo_b.png'
import ANDROID from '../../assets/images/playstore.png'

class TwoGrids extends Component 
{
    render() {

        const headTitle = {
            fontSize: '1.5rem',
            lineHeight: '1.2'
        }

        const paragh = {
            fontSize: '0.8rem',
            lineHeight: '1.8'
        }

        return (
            <div className="pt-4 pb-5">
                <div className="container">
                    {/* <div className="col-12 col-md-10 col-lg-8 px-0 mx-auto">
                        <div className="row mx-n2">
                            <div className="col-12 col-md-6 my-4 my-md-0 px-2">
                                <div className="text-center">
                                    <Link
                                        to="/"
                                        className="text-decoration-none text-transparent link-default-hover"
                                    >
                                        <img
                                            src={FIRSTIMG}
                                            alt=""
                                            className="img-fluid"
                                        />
                                        <div className="px-4">
                                            <h4
                                                className="mt-3 mb-2 font-weight-normal text-default"
                                                style={{
                                                    fontSize: '1.5rem',
                                                    lineHeight: '1.5'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.fitness')}</>}
                                                </Translation>
                                            </h4>
                                            <p
                                                className="mb-4 font-weight-normal text-secondary"
                                                style={{
                                                    fontSize: '0.85rem',
                                                    lineHeight: '1.5'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.fitness.p')}</>}
                                                </Translation>
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 my-3 my-md-0 px-2">
                                <div className="text-center">
                                    <Link
                                        to="/"
                                        className="text-decoration-none text-transparent link-default-hover"
                                    >
                                        <img
                                            src={SECONDIMG}
                                            alt=""
                                            className="img-fluid"
                                        />
                                        <div className="px-4">
                                            <h4
                                                className="mt-3 mb-2 font-weight-normal text-default"
                                                style={{
                                                    fontSize: '1.5rem',
                                                    lineHeight: '1.5'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.work.from.home')}</>}
                                                </Translation>
                                            </h4>
                                            <p
                                                className="mb-4 font-weight-normal text-secondary"
                                                style={{
                                                    fontSize: '0.85rem',
                                                    lineHeight: '1.5'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.fitness.p')}</>}
                                                </Translation>
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <div className="row">

                        <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                            <div className="d-flex align-items-center bg-white shadow-sm rounded-lg p-4">
                                <div className="w-50 text-right pr-5">
                                    <img
                                        src={MK_PROMO_GIRL}
                                        alt=""
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="w-50">
                                <h4
                                    className="text-custom font-weight-normal mb-3"
                                    style={headTitle}
                                >
                                    သင်သိပါသလား ?
                                </h4>
                                <p
                                    className="text-default mb-0 font-weight-normal"
                                    style={paragh}
                                >
                                    <strong>myKyat</strong> ငွေပေးချေစနစ် နှင့် ကုန်ပစ္စည်းဝယ်ယူတိုင်း
                                </p>
                                <p
                                    className="text-default mb-0 font-weight-normal"
                                    style={paragh}
                                >
                                    <strong className="text-custom">(၃)</strong> ရာခိုင်နှုန်း စျေးလျော့ချနေပီဆိုတာ ...
                                </p>
                                <p
                                    className="text-default mb-0 font-weight-normal mt-4"
                                    style={paragh}
                                >
                                    <strong>myKyat</strong> App ကို  <a 
                                                                        href="https://play.google.com/store/apps/details?id=com.FTP.myKyat_sun_2015&hl=en" 
                                                                        className="text-custom"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"                                                
                                                                    >ဒီမှာ</a> ဒေါင်းယူလိုက်မယ်
                                </p>
                                <div
                                    className="mt-3"
                                >
                                    <a
                                        href="https://play.google.com/store/apps/details?id=com.FTP.myKyat_sun_2015&hl=en"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-decoration-none"
                                    >
                                        <img
                                            src={ANDROID}
                                            alt="Android App"
                                            width="135"                                            
                                            className="rounded-lg"
                                            style={{
                                                background: '#000',
                                                border: '1px solid #fff'
                                            }}
                                        />
                                    </a>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6 h-100">
                            <div className="d-flex align-items-center bg-white shadow-sm rounded-lg p-4 h-100">
                                <div className="w-50 text-right">
                                    <h4
                                        className="text-custom font-weight-normal mb-3"
                                        style={headTitle}
                                    >
                                        မမေ့နဲ့ဦးနော် 
                                    </h4>
                                    <p
                                        className="text-default mb-0 font-weight-normal"
                                        style={paragh}
                                    >
                                        <strong>myKyat</strong> App ကို သုံးပြီး အကောင့်မှတ်ပုံတင်ထားဖို့
                                    </p>
                                </div>
                                <div className="w-50 text-left pl-5">
                                    <img
                                        src={MK_PROMO_BOY}
                                        alt=""
                                        className="img-fluid"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(TwoGrids)