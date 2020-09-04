import React, { Component } from 'react'
import ToggleMenu from './ToggleMenu'
import { Translation } from 'react-i18next'
import MM from '../../assets/images/mm.png'
import EN from '../../assets/images/en.png'

export default class MenuButton extends Component 
{
    state = {
        active: false
    }

    showSideBar = () => {
        document.getElementById('sidebar-wrap').style.left = '0%'
        document.getElementById('toggle-menu').style.bottom = '0'
        document.getElementById('toggle-menu').style.top = '66px'

        this.setState({
            active: !this.state.active
        })
    }

    hideSideBar = () => {
        document.getElementById('toggle-menu').style.bottom = '1000%'
        document.getElementById('toggle-menu').style.top = '-1000%'

        this.setState({
            active: false
        })
    }

    changeLanguage = code => e => {
        localStorage.setItem('language', code);
        window.location.reload();
    }

    render() {

        const activeClass = ["d-none d-md-flex flex-column align-self-center mr-3 mr-sm-4 menuWrapper"]
        if(this.state.active) {
            activeClass.push('active-menu')
        }

        const language =
            <div className="px-5 mx-2">
                <div className="d-flex">
                    <h4
                        className="mb-0 font-weight-normal mr-3 align-self-center text-uppercase"
                        style={{
                            fontSize: '0.9rem',
                            lineHeight: '2',
                            color: '#fff'
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.languages')}</>}
                        </Translation>
                    </h4>
                    <div className="d-flex" style={{lineHeight:'2'}}>
                        <button
                            className="btn px-1 py-0 font-weight-bold rounded-0 border-0 text-light shadow-none mr-2"
                            onClick={this.changeLanguage('en')}
                            // style={{
                            //     fontSize: '0.6rem',
                            //     transition: '0.3s ease-in-out',
                            //     // background: '#fe9902'
                            // }}
                        >
                            <img
                                src={EN}
                                alt="EN"
                                style={{
                                    width: '32px'
                                }}
                            />
                        </button>
                        <button
                            className="btn px-1 py-0 font-weight-bold rounded-0 border-0 text-light shadow-none"
                            onClick={this.changeLanguage('mm')}
                            // style={{
                            //     fontSize: '0.6rem',
                            //     transition: '0.3s ease-in-out',
                            //     // background: '#fe9902'
                            // }}
                        >
                            <img
                                src={MM}
                                alt="MM"
                                style={{
                                    width: '32px'
                                }}
                            />
                        </button>
                    </div>
                </div>
            </div>

        return (
            <>
                <div className={activeClass.join(' ')}>
                    {
                        !this.state.active ?
                        (
                            <button
                                className="btn shadow-none border-0 rounded-0 px-0"
                                onClick={this.showSideBar}
                                style={{
                                    width: '30px',
                                    height: '30px'
                                }}
                            >
                                <span
                                    className="d-block"
                                    style={{
                                        width: '25px',
                                        height: '2px',
                                        background: '#f8f9fa',
                                    }}
                                />
                                <span
                                    className="d-block"
                                    style={{
                                        width: '30px',
                                        height: '2px',
                                        background: '#f8f9fa',
                                        margin: '6px 0'
                                    }}
                                />
                                <span
                                    className="d-block"
                                    style={{
                                        width: '25px',
                                        height: '2px',
                                        background: '#f8f9fa',
                                    }}
                                />
                            </button> 
                        ) : (
                            <button
                                className="btn shadow-none border-0 rounded-0 px-0"
                                onClick={this.hideSideBar}
                                style={{
                                    width: '30px',
                                    height: '30px'
                                }}
                            >
                                <span
                                    className="d-block"
                                    style={{
                                        width: '25px',
                                        height: '2px',
                                        background: '#f8f9fa',
                                    }}
                                />
                                <span
                                    className="d-block"
                                    style={{
                                        width: '30px',
                                        height: '2px',
                                        background: '#f8f9fa',
                                        margin: '6px 0'
                                    }}
                                />
                                <span
                                    className="d-block"
                                    style={{
                                        width: '25px',
                                        height: '2px',
                                        background: '#f8f9fa',
                                    }}
                                />
                            </button>
                        )
                    }
                    
                </div>

                <div 
                    id="toggle-menu"
                    className="position-fixed d-none d-md-block"
                    style={{
                        top: '-1000%',
                        left: '0',
                        right: '0',
                        bottom: '1000%',
                        zIndex: '1'
                    }}
                    onClick={this.hideSideBar}
                >
                    <div 
                        className=""
                        style={{
                            background: '#002f55'
                        }}
                    >
                        <div className="container position-relative">
                            <div className="pt-4">
                                <ToggleMenu />
                            </div>
                        </div>
                    </div>
                    <div 
                        className=""
                        style={{
                            background: '#003457'
                        }}
                    >
                        <div className="container position-relative">
                            <div className="py-3">
                                {language}
                            </div>
                        </div>
                    </div>
                    
                    {
                        this.state.active ? (
                            <div
                                style={{
                                    cursor: 'pointer',
                                    minHeight: '600px',
                                    height: '100%',
                                    background: 'rgba(0, 0, 0, 0.9)'
                                }}
                                onClick={this.hideSideBar}
                            />
                        ) : null
                    }
                    
                </div>

                <div className="d-flex d-md-none flex-column align-self-center mr-3 mr-sm-4 menuWrapper">
                    <button
                        className="btn shadow-none border-0 rounded-0 px-0"
                        onClick={this.showSideBar}
                        style={{
                            width: '30px'
                        }}
                    >
                        <span
                            className="d-block"
                            style={{
                                width: '25px',
                                height: '2px',
                                background: '#f8f9fa',
                            }}
                        />
                        <span
                            className="d-block"
                            style={{
                                width: '30px',
                                height: '2px',
                                background: '#f8f9fa',
                                margin: '6px 0'
                            }}
                        />
                        <span
                            className="d-block"
                            style={{
                                width: '25px',
                                height: '2px',
                                background: '#f8f9fa',
                            }}
                        />
                    </button>
                </div>
            </>
        )
    }
}
