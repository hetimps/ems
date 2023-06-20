import React from 'react'
import { Navigate } from 'react-router'


export default function PrivatePage({ children }) {

    const user = JSON.parse(localStorage?.getItem("token"))
    console.log("kkku",user)

    if (user === null) {

        return <Navigate to="/login" />
    }
    return (
        <div>
            {children}
        </div>

    )
}


