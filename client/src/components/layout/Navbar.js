import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';


const Navbar = ({ auth: { isAuthenticated, loading }, logout}) => {

  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>
          Bootcampers
        </Link>
      </li>
      <li>
        <Link to='/posts'>
          Posts
        </Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className="fas fa-user" /> {' '}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href="/login">
        <i className="fas fa-sign-out-alt"></i>{' '}
        <span className="hide-sm">Logout</span></a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>
          Bootcampers
        </Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
     </ul>
  );

    return (
      <nav className="teal">
        <div className="nav-wrapper">
          <Link to='/' className="brand-logo">BootcampConnect</Link>
          <Link to="/" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></Link>
          <ul className="right hide-on-med-and-down">
          { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>) }
          </ul>
          <ul className="sidenav" id="mobile-demo">
          { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>) }
          </ul>
        </div> 
      </nav>    
      )
    };

  Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
