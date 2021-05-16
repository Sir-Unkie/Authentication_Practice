import { useRef, useContext } from 'react';
import { AuthContext } from '../../store/auth-context';
import classes from './ProfileForm.module.css';
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const newPasswordInputRef = useRef();
  const submitHandler = e => {
    e.preventDefault();
    const enteredPassword = newPasswordInputRef.current.value;
    //validation can be added here, but its not the case
    fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCJPqs-BTR46nnCrv5Faa09q5Sz8aofVvk',
      {
        method: 'POST',
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredPassword,
          returnSecureToken: false,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then(res => {
      //assume that always success
      history.replace('/');
    });
  };

  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input ref={newPasswordInputRef} type='password' id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
