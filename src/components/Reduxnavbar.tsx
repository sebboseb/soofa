//@ts-nocheck

import React, { Component, useState, useEffect } from 'react';
import { ImageList, ImageListItem } from '@mui/material';
import { getPopularRequest } from './utils/api';
import { Link } from 'react-router-dom';
import MainPageNavbar from './MainPageNavbar';
import { useAuth } from './contexts/AuthContext';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/actions/index';

export class MainPageNavbar extends Component {
    render() {
        const {currentUser} = this.props;
        console.log(currentUser);
        return (
            <div>
                {currentUser}
            </div>
        )
    }
}

export default MainPageNavbar