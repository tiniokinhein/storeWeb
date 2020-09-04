import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { BRANDS } from '../../api'
import { db } from '../../firebase'
import { Translation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'


const FETCHIMG = process.env.REACT_APP_FETCH_BRAND

class GridBrand extends Component 
{
    _isMounted = false

    state = {
        items: []
    }

    getItems = () => {
        this._isMounted = true

        db 
        .ref(BRANDS)
        .on('value', snapshot => {
            const lists = []
            snapshot.forEach(snap => {
                lists.push(snap.val())
            })
            const data = lists.reverse()

            if(this._isMounted) {
                this.setState({
                    items: data.slice(0,6)
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

        const lists = items.length ? (
            <div 
                className="d-flex"
            >
                {
                    items.map(p => (
                        <div
                            key={p.slug}
                            style={{
                                border: '15px solid transparent'
                            }}
                        >
                            <Link
                                to={`/brand/${p.slug}`}
                                className="text-decoration-none text-transparent d-block link-scale-hover overflow-hidden"
                                style={{
                                    width: '170px'
                                }}
                            >
                                <img
                                    src={FETCHIMG+`/${p.image}`}
                                    alt={p.name}
                                    width="100%"
                                />
                            </Link>
                        </div>
                    ))
                }
            </div>
        ) : (
            <div 
                className="d-flex"
            >
                <div
                    style={{
                        border: '15px solid transparent'
                    }}
                >
                    <Skeleton width={170} height={170} />
                </div>
                <div
                    style={{
                        border: '15px solid transparent'
                    }}
                >
                    <Skeleton width={170} height={170} />
                </div>
                <div
                    style={{
                        border: '15px solid transparent'
                    }}
                >
                    <Skeleton width={170} height={170} />
                </div>
                <div
                    style={{
                        border: '15px solid transparent'
                    }}
                >
                    <Skeleton width={170} height={170} />
                </div>
                <div
                    style={{
                        border: '15px solid transparent'
                    }}
                >
                    <Skeleton width={170} height={170} />
                </div>
                <div
                    style={{
                        border: '15px solid transparent'
                    }}
                >
                    <Skeleton width={170} height={170} />
                </div>
            </div>
        )

        return (
            <div
                className="py-5 mt-4"
            >
                <div 
                    className="custom-container mx-auto"
                >
                    <div
                        className="w-100"
                        style={{
                            overflowX: 'auto'
                        }}
                    >
                        <h4
                            className="mb-3 font-weight-normal text-default px-3"
                            style={{
                                fontSize: '1.1rem',
                                lineHeight: '1.5em'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.brands.explore')}</>}
                            </Translation>
                        </h4>
                        {lists}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(GridBrand)