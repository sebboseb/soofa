//@ts-nocheck

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/actions/index';

export class Reduxmainpage extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }
    render() {
        const { currentUser } = this.props;
        console.log(currentUser);

        return (
            <>
                <div className="w-screen flex flex-col items-center">
                    <div className="w-3/4 relative">
                        <div className=" bg-gradient-to-t via-transparent from-gray-900 h-full w-full absolute"></div>
                        <div className=" bg-gradient-to- via-transparent from-gray-900 h-full w-full absolute"></div>
                        <div className=" bg-gradient-to-l via-transparent from-gray-900 h-full w-full absolute"></div>
                        <div className=" bg-gradient-to-r via-transparent from-gray-900 h-full w-full absolute"></div>
                        <img src={`https://image.tmdb.org/t/p/original/rcA17r3hfHtRrk3Xs3hXrgGeSGT.jpg`}></img>
                    </div>
                    <h1>{currentUser && currentUser.username}</h1>
                    <h1 className="text-white font-semibold text-3xl p-16">Discover, log and discuss new series!</h1>
                    <div className="h-full flex">
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Reduxmainpage);