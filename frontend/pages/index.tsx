import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import BlankLayout from '@/components/Layouts/BlankLayout';

const Index = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Landing Page'));
  });

  return (
    <>
      Landing Page
    </>
  );
};

export default Index;

Index.getLayout = (page: any) => {
  return <BlankLayout>{page}</BlankLayout>;
};
