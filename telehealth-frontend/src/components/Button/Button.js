// reusable component
import React from 'react';
import '../Button/Button.css';
import { Link } from 'react-router-dom';

const STYLES = ['btn-primary','btn-outline'];       
const SIZES = ['brn-medium','btn-large'];

export const Button=({
    children,
    type,
    onClick,
    buttonStyle,
    buttonSize
}) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle: STYLES[0];
    
    const chcekButtonSize = STYLES.includes(buttonSize) ? buttonSize : SIZES[0];

    return(
        <Link to="/signIn" className="btn-mobile">
            <button
            className={`btn ${checkButtonStyle} ${chcekButtonSize}`}
            onClick = {onClick}
            type = {type}
            >
                {children}
            </button>

        </Link>
    )
}


