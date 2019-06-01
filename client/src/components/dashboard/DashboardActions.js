import React from 'react';
import { Link } from 'react-router-dom';

const DashboardActions = () => {
    return (
      <div className="dash-buttons">
        <Link to="/edit-profile" className="waves-effect waves-light btn"
          ><i className="material-icons text-primary">person_pin</i> Edit Profile</Link>
        <Link to="/add-experience" className="waves-effect waves-light btn"
          ><i className="material-icons text-primary">work</i> Add Experience</Link>
        <Link to="/add-education" className="waves-effect waves-light btn"
          ><i className="material-icons text-primary">school</i> Add Education</Link>
      </div>
    )
}

export default DashboardActions;
