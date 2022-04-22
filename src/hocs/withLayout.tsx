import Layout from '../components/layout';

const withLayout = (Component: () => JSX.Element) => { 
  return (
    <Layout>
      <Component />
    </Layout>
  );
}

export default withLayout;
