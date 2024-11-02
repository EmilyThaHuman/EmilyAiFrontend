import * as Yup from 'yup';

export const authConfigs = [
  {
    label: 'Username',
    name: 'username',
    required: true,
    fullWidth: true,
    margin: 'dense',
    validation: Yup.string()
      .min(6, 'Minimum 6 characters')
      .required('Required'),
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    required: true,
    fullWidth: true,
    margin: 'dense',
    validation: Yup.string().required('Required'),
  },
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    required: false,
    fullWidth: true,
    margin: 'dense',
    conditional: 'isSignup', // Only show this field if isSignup is true
    validation: Yup.string().email('Invalid email').required('Required'),
  },
];
