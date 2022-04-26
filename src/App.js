/*global chrome*/

import React, { useEffect, useState } from 'react';
import './bootstrap.min.css'
import './App.css';

import BookmakrForm from './components/bookmark-form/bookmark-form.component';
import Login from './components/login/login.component';

// const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlZXBha0BnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZjkxNTlhOTZhNGExZTMwMmM3NWMyNTkiLCJpYXQiOjE2MDM3NzI2NzIsImV4cCI6MTYwMzc3NjI3Mn0.avmkKBBB8RPOaBoy4ArGlls_TTDgCP0Y6h-ttYuL5D0'

const App = (props) => {
  const [state, setState] = useState({
    tabs: [],
    categories: [],
    userId: null,
    token: null,
    remainingMilliseconds: 0,
    expiryDate: null,
  })
  const { tabs, categories, userId, token, expiryDate } = state;


  useEffect(() => {
    chrome.storage.local.get(['user'], (res) => {
      const user = JSON.parse(res.user)
      // console.log(user)
      setState(prevState => ({
        ...prevState,
        userId: user.userId,
        token: user.token,
        expiryDate: user.expiryDate,
        // remainingMilliseconds:  new Date(user.expiryDate).getTime() - new Date().getTime(),
      }))
    })
  }, [])

  useEffect(() => {
    const setAutoLogout = (milliseconds) => {
      setTimeout(() => {
        logoutHandler();
      }, milliseconds);
    }

    const logoutHandler = () => {
      chrome.storage.local.set({
        'user': JSON.stringify({
          token: null,
          userId: null,
          remainingMilliseconds: 0
        })
      }, function (resData) {
        // console.log(resData)
      });
      setState(prevState => ({ ...prevState, userId: null, token: null, remainingMilliseconds: 0 }))
    }
    const checkAuthenticationStatus = () => {

      if (!token || !expiryDate) {
        return;
      }
      if (new Date(expiryDate) <= new Date()) {
        logoutHandler();
        return;
      }
      // const userId = localStorage.getItem('userId');
      const remainingMilliseconds =
        new Date(expiryDate).getTime() - new Date().getTime();
      // setState(prevState => ({
      //   ...prevState,
      //   userId: userId,
      //   token: "Bearer " + token,
      //   remainingMilliseconds: remainingMilliseconds
      // }))
      setAutoLogout(remainingMilliseconds);
    }
    checkAuthenticationStatus();
    Promise.all([
      fetch('https://bmark-easy.herokuapp.com/category', {
        headers: {
          Authorization: token
        }
      }),
      fetch('https://bmark-easy.herokuapp.com/tab', {
        headers: {
          Authorization: token
        }
      })
    ])
      .then(res => {
        if (res[0].status !== 200 && res[1].status !== 200) {
          throw new Error('Authorization failed!')
        }
        return Promise.all(res.map(r => r.json()))
      })
      .then(resData => {
        // console.log(resData)
        const categories = resData[0].categories.map(category => ({
          _id: category._id,
          title: category.title,
          tab: category.tab
        }))
        const tabs = resData[1].tabs.map(tab => ({
          _id: tab._id,
          title: tab.title,
        }))
        setState(prevState => ({
          ...prevState,
          categories: categories,
          tabs: tabs
        }))
      })
      .catch(err => {
        console.log(err)
      })
  }, [token, expiryDate])
  // console.log(state)

  return (
    <div className="App">
      {
        state.userId ? (
          <BookmakrForm
            tabs={state.tabs}
            categories={state.categories}
            token={token}
          />
        ) : (
            <Login />
          )
      }
    </div>
  );
}

export default App;
