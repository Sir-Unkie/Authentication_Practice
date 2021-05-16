import { useState, useRef, useContext } from 'react';
import { AuthContext } from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const inputEmailRef = useRef();
  const inputPasswordRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin(prevState => !prevState);
  };

  const formSubmitHandler = e => {
    e.preventDefault();
    const enteredEmail = inputEmailRef.current.value;
    console.log('enteredEmail: ', enteredEmail);
    const enteredPassword = inputPasswordRef.current.value;
    console.log('enteredPassword: ', enteredPassword);
    setIsLoading(true);
    let url = '';
    if (isLogin) {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCJPqs-BTR46nnCrv5Faa09q5Sz8aofVvk';
    } else {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCJPqs-BTR46nnCrv5Faa09q5Sz8aofVvk';
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          res
            .json()
            .then(data => {
              console.log(data);
              // here i should handle the error
              const errorMessage = data.error.message;
              // alert(errorMessage);
              throw new Error(errorMessage);
            })
            .catch(err => {
              alert(err.message);
            });
        }
      })
      .then(data => {
        console.log(data);
        authCtx.login(data.idToken);
      })
      .catch(error => {
        alert(error.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={formSubmitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input ref={inputEmailRef} type='email' id='email' required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            ref={inputPasswordRef}
            type='password'
            id='password'
            required
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? 'Login' : 'Create Account'}</button>
          )}
          {isLoading && <p>Is Loading...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
