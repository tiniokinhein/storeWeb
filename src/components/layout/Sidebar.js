import React, { Component } from 'react'
import { withRouter , Link } from 'react-router-dom'
import { Translation } from 'react-i18next'
import { RiCloseLine } from 'react-icons/ri'
import { CATEGORIES } from '../../api'
import { db } from '../../firebase'

class Sidebar extends Component 
{
    state = {
        items: []
    }

    getItems = () => {
        db 
        .ref(CATEGORIES)
        .orderByChild('dateFormatted')
        .on('value', snapshot => {
            const lists = []
            snapshot.forEach(snap => {
                lists.push(snap.val())
            })
            const data = lists.reverse()

            this.setState({
                items: data
            })
        })
    }

    componentDidMount() {
        this.getItems()
    }

    changeLanguage = code => e => {
        localStorage.setItem('language', code);
        window.location.reload();
    }

    closeSideBar = () => {
        document.getElementById('sidebar-wrap').style.left = '-100%'
    }

    render() {

        const { items } = this.state

        const lists = 
            <>
                {
                    items.map(p => (
                        <div 
                            className="mb-2 pt-3 clearfix"
                            key={p.slug}
                            style={{
                                borderTop: '1px solid #f8f9fa'
                            }}
                        >      
                            <div 
                                className="dropdown"
                            >
                                <Link
                                    to={`/c/${p.slug}`}
                                    className="text-decoration-none d-inline-block link-default-hover"
                                    style={{
                                        color: '#fff'
                                    }}
                                    onClick={this.closeSideBar}
                                >
                                    <h4
                                        className="mb-0 font-weight-normal"
                                        style={{
                                            fontSize: '1rem',
                                            lineHeight: '1.5',
                                            color: '#fff',
                                            display: '-webkit-box',
                                            overflow: 'hidden',
                                            WebkitLineClamp: '2',
                                            WebkitBoxOrient: 'vertical'
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
                                </Link>
                                <button 
                                    className="btn d-inline-block text-light float-left dropdown-toggle p-0 mr-2 border border-light rounded-0 bg-transparent shadow-none plus-minus-btn" 
                                    id="dropdownMenuButton" 
                                    data-toggle="dropdown" 
                                    aria-haspopup="true" 
                                    aria-expanded="false"
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        lineHeight: '0'
                                    }}
                                />
                                
                                <div 
                                    className="dropdown-menu position-relative clearfix dropdown-menu-sidebar flex-column bg-transparent border-0 m-0 p-0 shadow-none" 
                                    aria-labelledby="dropdownMenuButton"
                                    style={{
                                        clear: 'both'
                                    }}
                                >
                                    {
                                        p.subcategory &&
                                        p.subcategory.map(l => (
                                            <Link
                                                className="dropdown-item py-2 text-decoration-none font-weight-normal text-light bg-transparent shadow-none link-default-hover"
                                                style={{
                                                    lineHeight: '1.5',
                                                    fontSize: '0.8rem',
                                                    paddingLeft: '33px',
                                                    transition: '0.3s ease-in-out'
                                                }}
                                                to={`/category/${l.slug}`}
                                                key={l.slug}
                                                onClick={this.closeSideBar}
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
                                            </Link>                                      
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </>
        
        const language =
            <div 
                className="mb-2 pt-3 clearfix"
                style={{
                    borderTop: '1px solid #f8f9fa'
                }}
            >      
                <div 
                    className="dropdown"
                >
                    <h4
                        className="mb-0 text-light font-weight-normal d-inline-block"
                        style={{
                            fontSize: '1rem',
                            lineHeight: '1.5'
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.languages')}</>}
                        </Translation>
                    </h4>
                    
                    <button 
                        className="btn d-inline-block text-light float-left dropdown-toggle p-0 mr-2 border border-light rounded-0 bg-transparent shadow-none plus-minus-btn" 
                        id="dropdownMenuButtonLanguage" 
                        data-toggle="dropdown" 
                        aria-haspopup="true" 
                        aria-expanded="false"
                        style={{
                            width: '24px',
                            height: '24px',
                            lineHeight: '0'
                        }}
                    />
                    
                    <div 
                        className="dropdown-menu position-relative clearfix dropdown-menu-sidebar flex-column bg-transparent border-0 m-0 p-0 shadow-none" 
                        aria-labelledby="dropdownMenuButtonLanguage"
                        style={{
                            clear: 'both'
                        }}
                    >
                        <button
                            className="dropdown-item py-2 text-decoration-none font-weight-normal text-light bg-transparent shadow-none link-default-hover"
                            onClick={this.changeLanguage('en')}
                            style={{
                                lineHeight: '1.5',
                                fontSize: '0.8rem',
                                paddingLeft: '33px',
                                transition: '0.3s ease-in-out'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.language.en')}</>}
                            </Translation>
                        </button>
                        <button
                            className="dropdown-item py-2 text-decoration-none font-weight-normal text-light bg-transparent shadow-none link-default-hover"
                            onClick={this.changeLanguage('mm')}
                            style={{
                                lineHeight: '1.5',
                                fontSize: '0.8rem',
                                paddingLeft: '33px',
                                transition: '0.3s ease-in-out'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.language.mm')}</>}
                            </Translation>
                        </button>
                    </div>
                </div>
            </div>

        const trackMenu =
            <div 
                className="mb-3 mt-3 pt-3 clearfix"
                style={{
                    borderTop: '1px solid #f8f9fa'
                }}
            >      
                <Link
                    to="/track"
                    className="text-decoration-none text-light link-default-hover font-weight-light"
                    style={{
                        lineHeight: '1.5',
                        fontSize: '1rem'
                    }}
                    onClick={this.closeSideBar}
                >
                    <Translation>
                        {(t) => <>{t('main.menu.order')}</>}
                    </Translation>
                </Link>
            </div>

        return (
            <div 
                id="sidebar-wrap"
                className="position-fixed d-block d-md-none"
                style={{
                    left: '-100%',
                    top: '0',
                    bottom: '0',
                    background: 'none',
                    width: '100%',
                    zIndex: '9999999999',
                    transition: '0.15s ease-in-out'
                }}                
            >
                <div
                    className="px-4 pb-4 h-100 position-relative shadow overflow-sidebar-y bg-default"
                    style={{
                        // background: '#7f187f',
                        width: '460px',
                        maxWidth: '100%',
                        overflowY: 'scroll'
                    }}
                >
                    <button
                        className="btn shadow-none border-0 rounded-0 position-absolute p-0 text-light"
                        style={{
                            right: '0',
                            top: '0',
                            zIndex: '9999999999',
                            fontSize: '35px',
                            width: '66px',
                            height: '66px',
                            lineHeight: '30px',
                            // background: '#02497a',
                            background: 'transparent'
                        }}
                        onClick={this.closeSideBar}
                    >
                        <RiCloseLine />
                    </button>

                    <Link
                        to="/"
                        className="text-decoration-none logo-title d-block"
                        style={{
                            fontSize: '25px',
                            height: '65px',
                            lineHeight: '65px'
                        }}
                        onClick={this.closeSideBar}
                    >
                        <span
                            style={{
                                color: '#fe9902',
                                fontFamily: "'Roboto', sans-serif",
                                fontWeight: '900',
                                letterSpacing: '-1.5px',
                                lineHeight: '2',
                                display: 'inline-block'
                            }}
                        >BAGAN</span>&nbsp;
                        <span
                            style={{
                                color: '#fff',
                                lineHeight: '2',
                                display: 'inline-block',
                                fontFamily: "'Roboto', sans-serif",
                                fontWeight: '900',
                                letterSpacing: '-1.5px',
                            }}
                        >STORE</span>
                    </Link>

                    {lists}

                    {language}

                    {trackMenu}

                </div>
            </div>
        )
    }
}

export default withRouter(Sidebar)