import React, { Component } from 'react'
import Sticky from 'react-sticky-el'
import MenuBar from './MenuBar'
import Footer from './Footer'
import LatestPreview from '../search/LatestPreview'

export default class Layout extends Component 
{
    render() {
        return (
            <React.Fragment>
                <div
                    className="sticky-menu position-absolute"
                    style={{
                        zIndex: '2',
                        top: '0',
                        left: '0',
                        right: '0'
                    }}
                >
                    <Sticky 
                        style={{
                            transform: 'none',
                            WebkitTransform: 'none'
                        }}
                    >
                        <MenuBar />
                    </Sticky>
                </div>

                <LatestPreview />

                {this.props.children}

                <Footer />
            </React.Fragment>
        )
    }
}
