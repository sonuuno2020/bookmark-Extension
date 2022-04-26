/*global chrome*/
import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';

// import { login } from '../../redux/user/user.action';
// import { selectAuthLoading } from '../../redux/user/user.selector';

import useFormInput from '../../hooks/use-form-input.hooks';

import FormInput from '../form-input/form-input.component';
import FormButton from '../form-button/form-button.component';

import Logo from '../assets/logo/logo_transparent.png';

import './login.styles.css';

const Login = (props) => {

  const [isLoading, setLoading] = useState(false);
  const [user, updateUser] = useFormInput({
    email: '',
    password: ''
  })


  const SubmitLoginForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    fetch('https://bmark-easy.herokuapp.com/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        let errorMessage;
        if (res.status === 422) {
          errorMessage = 'Validation failed. Password must be minimum 5 character';
        }
        else if (res.status === 500) {
          errorMessage = 'Internal server error.';
        } else if (res.status === 401) {
          errorMessage = 'Wrong email address and password!';
        }
        if (errorMessage) throw new Error(errorMessage)
        return res.json();
      })
      .then(resData => {
        setLoading(false);

        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        window.location.reload();
        chrome.storage.local.set({
          'user': JSON.stringify({
            userId: resData.userId,
            token: "Bearer " + resData.token,
            expiryDate: expiryDate.toISOString()
          })
        }, function (resData) {
          console.log(resData)
        });
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        // window.jQuery("#errorPopup").modal("show");
      })
  }

  const { email, password } = user;
  return (
    <div id="login" className="login show">
      <div className="login-dialog login-login">
        <div className="login-content">
          <div className="login-header">
            <div className="avatar">
              <img src={Logo} alt="Avatar" />
            </div>
            <h4 className="login-title">Bookmark Easy</h4>
          </div>
          <div className="login-body">
            <form onSubmit={SubmitLoginForm}>
              <FormInput
                name='email'
                value={email}
                placeholder='Email'
                type='email'
                required
                maxLength="100"
                title='3 and more Alphabetic letter'
                handleChange={updateUser}
              />
              <FormInput
                name='password'
                value={password}
                placeholder='Password'
                type='password'
                required
                maxLength="100"
                title='3 and more Alphabetic letter'
                handleChange={updateUser}
              />
              <FormButton
                type='submit'
                label='Login'
                isLoading={isLoading}
              />

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// const mapStateToProps = createStructuredSelector({
//   authLoading: selectAuthLoading
// })

// const mapDispatchToProps = dispatch => ({
//   login: (email, password) => dispatch(login(email, password))
// })

export default Login;