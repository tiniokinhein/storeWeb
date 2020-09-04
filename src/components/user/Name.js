import React, { Component } from 'react'
import { auth } from '../../firebase'
import PROFILE from '../../assets/images/profile.jpg'

class Name extends Component 
{
    state = {
        user: auth.currentUser
    }

    render() {

        const { user } = this.state

        return (
            <div
                className="py-4"
                style={{
                    background: 'radial-gradient(circle, #0f4c82 , #003457)'
                }}
            >
                <div className="container text-center">
                    {
                        user.photoURL === null ? 
                            <img
                                src={PROFILE}
                                alt={user.displayName}
                                className="mb-2 rounded-circle shadow"
                                style={{
                                    width: '50px',
                                    height: '50px'
                                }}
                            />
                            :
                            <img
                                src={user.photoURL}
                                alt={user.displayName}
                                className="mb-2 rounded-circle shadow"
                                style={{
                                    width: '50px',
                                    height: '50px'
                                }}
                            />
                    }
                    
                    <h4
                        className="font-weight-normal mb-0 text-light"
                        style={{
                            lineHeight: '1.5', 
                            fontSize: '1rem'
                        }}
                    >
                        {user.displayName}
                    </h4>
                </div>
            </div>
        )
    }
}

export default Name