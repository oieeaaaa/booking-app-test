import { Link } from 'react-router-dom' 

const Header = () => {
  return (
    <header className="container header">
      <Link className="header__brand" to="/">
        Bookings
      </Link>
    </header>
  );
}

export default Header;
