import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
// eslint-disable-next-line
import { connect } from 'react-redux';

const Experience = ({ experience }) => {
  //map through each experience array
  const experiences = experience.map(exp => (
    <tr key={exp._id}>
      {/*grabs the company from the above experience ID*/}
      <td>{exp.company}</td>
      {/*hide on mobile*/}
        <td className='hide-sm'>{exp.title}</td>
        <td>
        {/*takes in the date and formats it*/}
          <Moment format='YYYY/MM/DD'>{exp.from}</Moment> -{' '}
          {exp.to === null ? (
            ' Now'
          ) : (
            <Moment format='YYYY/MM/DD'>{exp.to}</Moment>
          )}
        </td>
        <td>
          <button className='btn btn-danger'>Delete</button>
        </td>
      </tr>
  ));
  return (
    <Fragment>
      <h2 className="my-2">Experience Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            {/*will be responsive. Hides on mobile screens*/}
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
          {/*loops through data and formats it*/}
          <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  )
}

Experience.propTypes = {
  experience: PropTypes.array.isRequired
}

export default Experience
