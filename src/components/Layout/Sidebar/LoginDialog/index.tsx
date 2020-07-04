import React from 'react'
import { Dialog, InputGroup, Button, IDialogProps } from '@blueprintjs/core'
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import authApis from 'apis/auth'
import useAsyncFn from 'hooks/useAsyncFn'
import { noop } from 'helpers/fn'
import { LogDispatchContext, ACTIONS } from 'reducers/log'
import styles from './style.module.css'

const { useState, useContext } = React

firebase.initializeApp({
    apiKey: "AIzaSyA_PUX4Tc0vulH5ky0qSzpd0Rr2_eJC7XU",
    authDomain: "fir-b1ee7.firebaseapp.com",
    databaseURL: "https://fir-b1ee7.firebaseio.com",
    projectId: "fir-b1ee7",
    storageBucket: "fir-b1ee7.appspot.com",
    messagingSenderId: "568308361285",
    appId: "1:568308361285:web:ec757595c4febbca0a5b2c",
    measurementId: "G-6QFB2CFCYJ"
})

const LoginDialog: React.FC<IDialogProps> = ({ isOpen, onClose = noop }) => {
  const dispatch = useContext(LogDispatchContext)
  const [isSignedIn, setSignedIn] = useState(false)
  const [phone, setPhone] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loginState, loginFn] = useAsyncFn(authApis.login)
  const { loading, error } = loginState

  const handleLogin = async () => {
    const result = await loginFn({ phone, password })
    if (result) {
      dispatch({
        type: ACTIONS.LOGIN,
        payload: {
          user: {
            ...result,
            userId: result.profile.userId
          }
        }
      })
      onClose()
    }
  }

  return (
    <Dialog
      style={{ width: '400px' }}
      title='Login'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={styles.content}>
        <InputGroup
          placeholder='请输入手机号'
          leftIcon='mobile-phone'
          value={phone}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPhone(event.target.value)
          }}
        />
        <InputGroup
          placeholder='请输入密码'
          leftIcon='lock'
          type='password'
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value)
          }}
        />

      <div>
        {isSignedIn ? (
          <span>
            <div>Signed In!</div>
            <button onClick={() => firebase.auth().signOut()}>Sign out!</button>
            <h1>Welcome {firebase.auth().currentUser.displayName}</h1>
            <img
              alt="profile picture"
              src={firebase.auth().currentUser.photoURL}
            />
          </span>
        ) : (
          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}
          />
        )}
      </div>

        {error && <div className='error'>{error.message}</div>}

        <div className={styles.loginBtn}>
          <Button onClick={handleLogin} loading={loading}>登录</Button>
        </div>
      </div>
    </Dialog>
  )
}

export default LoginDialog
