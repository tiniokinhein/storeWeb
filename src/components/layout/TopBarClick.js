import React, { Component } from 'react'

export default class TopBarClick extends Component 
{
    render() {

        const styleCss = {
            left: '0',
            top: '0',
            right: '0',
            height: '66px',
            zIndex: '2',
            visibility: 'hidden',
            opacity: '0',
            transition: '0.3s ease-in-out'
        }

        return (
            <div className="position-fixed" style={styleCss} id="top-bar-click">
                <div
                    style={{
                        height: '66px',
                        background: '#003457'
                    }}
                    className="topLayout position-relative"
                />
            </div>
        )
    }
}
