import axios from 'axios';
// const baseURL = 'http://localhost:3001/api/v1';

export const fetchFromApi = async () => {
  return axios
    .get('http://localhost:3001/api/v1/tours')
    .then((res) => res.data);
};

export const fetchTourDetail = async (tourSlug: string) => {
  return axios
    .get(`http://localhost:3001/api/v1/tours/${tourSlug}`)
    .then((res) => res.data);
};

// test for fetch axios private with interceptors
export const axiosPrivate = axios.create({
  baseURL: `http://localhost:3001/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const login = async (email: string, password: string) => {
  const data = { email, password };
  const config = { withCredentials: true };
  const res = await axios.post(
    'http://localhost:3001/api/v1/users/login',
    data,
    config
  );
  return res.data;
};

export const refreshToken = async () => {
  const res = await axios.get(
    'http://localhost:3001/api/v1/users/refreshToken',
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const signOut = async () => {
  const res = await axios.get('http://localhost:3001/api/v1/users/signout', {
    withCredentials: true,
  });
  return res.data;
};

export const updateMe = async (name: string, email: string) => {
  const data = { name, email };
  const res = await axiosPrivate.patch('/users/updateMe', data, {
    withCredentials: true,
  });
  return res.data;
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
) => {
  const data = { currentPassword, newPassword, confirmNewPassword };
  const res = await axiosPrivate.patch('/users/updateMyPassword', data, {
    withCredentials: true,
  });
  return res.data;
};

export const checkoutSession = async (tourSlug: string) => {
  const res = await axiosPrivate.get(
    `http://localhost:3001/api/v1/bookings/checkout/${tourSlug}`
  );
  return res.data;
};
