import React, { useRef, useState } from 'react';
import { NavItem } from './NavItem';
import useAuth from '../../hooks/useAuth';
import { ContextType } from '../../context/Provider/AuthProvider';
import { updateMe, updatePassword } from '../../services/fetch';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {
  AccountFormType,
  PasswordFormType,
  defaultAccountForm,
  defaultPasswordForm,
} from './AccountForm';
import UploadIcon from '@mui/icons-material/Upload';

export const AccountDetail: React.FC = () => {
  const { auth, dispatchAuth } = useAuth() as ContextType;
  const user = auth.user;
  // handle input form
  const [accountForm, setAccountForm] =
    useState<AccountFormType>(defaultAccountForm);
  const [passwordForm, setPasswordForm] =
    useState<PasswordFormType>(defaultPasswordForm);
  // handle drag events
  const [dragActive, setDragActive] = useState(false);

  // TODO: fix type properly!
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  // triggers when file is dropped
  const handleDrop = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log(e.dataTransfer.files[0]);
      // at least one file has been dropped so do something
      // handleFiles(e.dataTransfer.files);
    }
  };
  // Trigger when user choose button click
  const inputRef = useRef(null);
  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files[0]);
    }
  };
  // Trigger when button is clicked
  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  // Handle popup notification
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  // Handle input
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountForm((prevAccountForm) => ({
      ...prevAccountForm,
      [name]: value,
    }));
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prevPasswordForm) => ({
      ...prevPasswordForm,
      [name]: value,
    }));
  };
  // Handle popup notification
  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });
  const handleAlertClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const action = (
    <React.Fragment>
      <Button color='secondary' size='large' onClick={handleAlertClose}>
        UNDO
      </Button>
      <IconButton
        size='large'
        aria-label='close'
        color='inherit'
        onClick={handleAlertClose}
      >
        <CloseIcon fontSize='large' />
      </IconButton>
    </React.Fragment>
  );

  // Handle Submit Form
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateMe(accountForm.name, accountForm.email);
      dispatchAuth({
        type: 'updateUserInfo',
        payload: { name: accountForm.name, email: accountForm.email },
      });
      if (res.status === 'success') {
        setOpen(true);
        setError(false);
      }
      setAccountForm(defaultAccountForm);
    } catch (err) {
      console.log(err);
      setOpen(true);
      setError(true);
      setAccountForm(defaultAccountForm);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmNewPassword
      );
      console.log(res);
      dispatchAuth({ type: 'updateUserPassword', payload: res.accessToken });
      if (res.status === 'success') {
        setOpen(true);
        setError(false);
      }
      setPasswordForm(defaultPasswordForm);
    } catch (err) {
      console.log(err);
      setOpen(true);
      setError(true);
      setPasswordForm(defaultPasswordForm);
    }
  };

  return (
    <main className='main'>
      <div className='user-view'>
        <nav className='user-view__menu'>
          <ul className='side-nav'>
            <NavItem link='#' text='Settings' icon='settings' active={true} />
            <NavItem link='#' text='My bookings' icon='briefcase' />
            <NavItem link='#' text='My reviews' icon='star' />
            <NavItem link='#' text='Billing' icon='credit-card' />
          </ul>
          {user?.role === 'admin' && (
            <div className='admin-nav'>
              <h5 className='admin-nav__heading'>Admin</h5>
              <ul className='side-nav'>
                <NavItem link='#' text='Manage tours' icon='map' />
                <NavItem link='#' text='Manage users' icon='users' />
                <NavItem link='#' text='Manage reviews' icon='star' />
                <NavItem link='#' text='Manage bookings' icon='briefcase' />
              </ul>
            </div>
          )}
        </nav>
        <div className='user-view__content'>
          <div className='user-view__form-container'>
            <h2 className='heading-secondary ma-bt-md'>
              Your account settings
            </h2>
            <form
              className='form form-user-data'
              onDragEnter={handleDrag}
              onSubmit={handleAccountSubmit}
            >
              <div className='form__group'>
                <label className='form__label' htmlFor='name'>
                  Name
                </label>
                <input
                  id='name'
                  className='form__input'
                  type='text'
                  placeholder={user?.name}
                  name='name'
                  value={accountForm.name}
                  onChange={handleAccountChange}
                  required
                />
              </div>
              <div className='form__group ma-bt-md'>
                <label className='form__label' htmlFor='email'>
                  Email address
                </label>
                <input
                  id='email'
                  className='form__input'
                  placeholder={user?.email}
                  type='email'
                  name='email'
                  value={accountForm.email}
                  onChange={handleAccountChange}
                  required
                />
              </div>
              <div
                style={{ display: 'flex', gap: '10px', width: '100%' }}
                className='form__group form__photo-upload'
              >
                <img
                  className='form__user-photo'
                  src={`/img/users/${user?.photo}`}
                  alt='User photo'
                />
                <input
                  type='file'
                  id='input-file-upload'
                  accept='image/jpeg, image/jpg, image/png'
                  onChange={handleClick}
                  ref={inputRef}
                />
                <label
                  id='label-file-upload'
                  htmlFor='input-file-upload'
                  className={dragActive ? 'drag-active' : ''}
                  style={{
                    flexGrow: 1,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                      position: 'relative',
                      flexGrow: 1,
                      height: '150px',
                    }}
                  >
                    <UploadIcon
                      style={{
                        position: 'absolute',
                        zIndex: 0,
                        fontSize: '50px',
                      }}
                    />
                    <p
                      style={{
                        zIndex: 1,
                        marginTop: '90px',
                        textAlign: 'center',
                      }}
                    >
                      Drag and drop your file here or
                      <br />
                      <button
                        className='form__upload'
                        onClick={handleButtonClick}
                        type='button'
                      ></button>
                      <label htmlFor='form__upload'>Choose a photo</label>
                    </p>
                  </div>
                  {/* <input style={{ zIndex: 1 }} className='form__upload'></input>
                  <label htmlFor='form__upload'>Choose a photo</label> */}
                </label>
                {dragActive && (
                  <div
                    id='drag-file-element'
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  />
                )}
                {/* <a className='btn-text' href=''>
                  Choose new photo
                </a> */}
                {/* <input
                  className='form__upload'
                  type='file'
                  accept='image/*'
                  id='photo'
                />
                <label htmlFor='photo'>Choose new photo</label> */}
              </div>
              <div className='form__group right'>
                <button className='btn btn--small btn--green' type='submit'>
                  Save settings
                </button>
              </div>
              <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={open}
                autoHideDuration={5000}
                onClose={handleAlertClose}
                action={action}
              >
                <Alert
                  style={{ fontSize: '20px' }}
                  onClose={handleAlertClose}
                  severity={error ? 'error' : 'success'}
                  sx={{ width: '100%' }}
                >
                  {error ? 'Data update failed' : 'Data updated successfully'}
                </Alert>
              </Snackbar>
            </form>
          </div>
          <div className='line'>&nbsp;</div>
          <div className='user-view__form-container'>
            <h2 className='heading-secondary ma-bt-md'>Password change</h2>
            <form
              className='form form-user-settings'
              onSubmit={handlePasswordSubmit}
            >
              <div className='form__group'>
                <label className='form__label' htmlFor='password-current'>
                  Current password
                </label>
                <input
                  id='password-current'
                  className='form__input'
                  type='password'
                  name='currentPassword'
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder='••••••••'
                  required
                  minLength={8}
                />
              </div>
              <div className='form__group'>
                <label className='form__label' htmlFor='password'>
                  New password
                </label>
                <input
                  id='password'
                  className='form__input'
                  type='password'
                  name='newPassword'
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder='••••••••'
                  required
                  minLength={8}
                />
              </div>
              <div className='form__group ma-bt-lg'>
                <label className='form__label' htmlFor='password-confirm'>
                  Confirm password
                </label>
                <input
                  id='password-confirm'
                  className='form__input'
                  type='password'
                  name='confirmNewPassword'
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordChange}
                  placeholder='••••••••'
                  required
                  minLength={8}
                />
              </div>
              <div className='form__group right'>
                <button className='btn btn--small btn--green' type='submit'>
                  Save password
                </button>
              </div>
              <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={open}
                autoHideDuration={5000}
                onClose={handleAlertClose}
                action={action}
              >
                <Alert
                  style={{ fontSize: '20px' }}
                  onClose={handleAlertClose}
                  severity={error ? 'error' : 'success'}
                  sx={{ width: '100%' }}
                >
                  {error ? 'Data update failed' : 'Data updated successfully'}
                </Alert>
              </Snackbar>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};
