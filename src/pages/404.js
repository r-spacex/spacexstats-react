import { useEffect } from 'react';
import { navigate } from 'gatsby';

const NotFoundPage = () => {
  useEffect(() => {
    navigate('/');
  }, []);

  return null;
};

export default NotFoundPage;
