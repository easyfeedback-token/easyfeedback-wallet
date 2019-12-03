import React from "react";
import '../css/styles.css';
import '../css/terms-styles.css';
import Logo from '../img/Easy-Feedback-Token-EFT-Logo-Blanco.png';

class NavBarAlt extends React.Component {
    render() {
        return (
            <div className="navb-alt">
                
            <img
                src={Logo}
                className="logo-img center-block"
                alt="easyfeedbacktoken"
            />
            </div>

        );
    }
}

export default NavBarAlt;