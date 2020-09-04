import React, { Component } from 'react'
import { withRouter , Link } from 'react-router-dom'
import { CATEGORIES } from '../../api'
import { db } from '../../firebase'
import { Translation } from 'react-i18next'


const FETCHIMG = process.env.REACT_APP_FETCH_CATEGORY

class ToggleMenu extends Component 
{
    _isMounted = false

    state = {
        items: []
    }

    getItems = () => {
        this._isMounted = true

        db 
        .ref(CATEGORIES)
        .orderByChild('dateFormatted')
        .on('value', snapshot => {
            const lists = []
            snapshot.forEach(snap => {
                lists.push(snap.val())
            })
            const data = lists.reverse()

            if(this._isMounted) {
                this.setState({
                    items: data
                })
            }
        })
    }

    componentDidMount() {
        this.getItems()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {

        const { items } = this.state

        const lists = 
            <>
                {
                    items.map(p => (
                        <div 
                            className="col-6 col-md-4 col-lg-2 mb-4"
                            key={p.slug}
                        >
                            <Link
                                to={`/c/${p.slug}`}
                                className="text-decoration-none d-block link-default-hover"
                                style={{
                                    borderBottom: '2px solid #ffff',
                                    background: "url(" + FETCHIMG + '/' + p.image + ") no-repeat",
                                    backgroundSize: '70px',
                                    backgroundPosition: 'right 95%',
                                    height: '100px'
                                }}
                            >
                                <h4
                                    className="mb-2 font-weight-normal"
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
                                {/* <img
                                    src={FETCHIMG+`/${p.image}`}
                                    alt={p.title}
                                    className="d-flex ml-auto"
                                    style={{
                                        width: '70px'
                                    }}
                                /> */}
                            </Link>

                            <ul className="list-unstyled p-0 my-2">
                                {
                                    p.subcategory &&
                                    p.subcategory.map(l => (
                                        <li key={l.slug}>
                                            <Link
                                                className="text-decoration-none font-weight-normal text-light link-default-hover"
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '0.8rem',
                                                    transition: '0.3s ease-in-out'
                                                }}
                                                to={`/category/${l.slug}`}
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
                                        </li>                                        
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                }
            </>

        return (
            <div className="px-5 mx-2 d-none d-md-block">
                <div className="row">
                    {lists}
                </div>                
            </div>
        )
    }
}

export default withRouter(ToggleMenu)