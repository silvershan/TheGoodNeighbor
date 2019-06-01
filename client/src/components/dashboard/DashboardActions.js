import React from 'react';
import { Link } from 'react-router-dom';

const DashboardActions = () => {
    return (
      <div className="dash-buttons">
        <Link to="/edit-profile" className="waves-effect waves-light btn"
          >Edit Profile</Link>
        <Link to="/add-experience" className="waves-effect waves-light btn"
          > Add Experience</Link>
        <Link to="/add-education" className="waves-effect waves-light btn"
          > Add Education</Link>
      </div>
    )
}

export default DashboardActions;
