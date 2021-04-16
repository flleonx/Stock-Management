import React, {useState, useEffect, useReducer, useRef} from 'react';
import Axios, {AxiosResponse} from 'axios';
import SuccessfulModalDressMaking from '../components/dressmaking/SuccessfulModalDressMaking';
// REDUCER
import {reducer} from '../components/dressmaking/ReducerDressMaking';
// import './style/DressMaking.css';
// import '../components/dressmaking/style/buttonStyle.css';
import {baseURL} from '../components/app/baseURL';
import Modal from '../components/Modal';
import completeImage from '../assets/complete.svg';
import errorImage from '../assets/error.svg';
import {updateSourceFile} from 'typescript'


const WareHouseProducts = () => {
    return (
        <div>
            Tu si JODES VALE
        </div>
    )
}

export default WareHouseProducts;