import { useSelector } from 'react-redux';
const ADMIN_EMAILS = ['adminflowerstore@gmail.com' ,'adminonlyview@gmail.com']
const EDIT_EMAILS = ['adminflowerstore@gmail.com']

const useAuth = () => {
  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token && user)

  const isAdminArea = isLoggedIn && ADMIN_EMAILS.includes(user?.email);
  const canEdit = isLoggedIn && EDIT_EMAILS.includes(user?.email);

  return { user, token, isLoggedIn, isAdminArea, canEdit };
};

export default useAuth;