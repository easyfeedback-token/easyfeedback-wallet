import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Tab extends Component {
    static propTypes = {
        activeTab: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        src: PropTypes.string.isRequired,

    };

    onClick = () => {
        const { label, onClick } = this.props;
        onClick(label);
    }

    render() {
        const {
            onClick,
            props: {
                activeTab,
                label,
                src,
            },
        } = this;

        let className = 'tab-list-item';

        if (activeTab === label) {
            className += ' tab-list-active';
        }

        return (
            <button className={className} onClick={onClick}>
                <img src={src} className="tab-icon" alt=""/>
                <p>{label}</p>
            </button>

        );
    }
}

export default Tab;