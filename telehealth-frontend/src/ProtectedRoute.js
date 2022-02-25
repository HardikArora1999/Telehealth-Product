import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import constants from './constants';
import AdminPortal from './components/AdminPortal/AdminPortal';

function ProtectedRoute({ component: Component, doctor, superuser, ...rest }) {
  const [isAuth, setIsAuth] = useState('');
  const [isDoctor, setIsDoctor] = useState('');
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [apiCalled, setApiCalled] = useState('');

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get(`${constants.API_URL}/user`)
      .then((res) => {
        const data = res.data;
        setIsAuth(true);
        setIsDoctor(data.is_doctor);
        setIsSuperuser(data.is_superuser);
        setApiCalled(true);
      })
      .catch((e) => {
        console.log(e);
        setIsAuth(false);
        setApiCalled(true);
      });
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (apiCalled) {
          if (isAuth && isDoctor === doctor && isSuperuser === superuser) {
            return <Component />;
          } else if (isAuth && isSuperuser === superuser) {
            return (
              <AdminPortal/>
            );
          } else {
            if(isSuperuser) {
              return (
                <Redirect
                  to={{ pathname: '/admin-portal', destination: props.location }}
                />
              );
            }
            return (
              <Redirect
                to={{ pathname: '/login', destination: props.location }}
              />
            );
          }
        }
      }}
    />
  );
}

export default ProtectedRoute;
