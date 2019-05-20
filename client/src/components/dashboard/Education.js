import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
// eslint-disable-next-line
import { connect } from 'react-redux';
// eslint-disable-next-line
import { deleteEducation } from '../../actions/profile';

const Education = ({ education, deleteEducation }) => {
  //map through each education array
  const educations = education.map(edu => (
    <tr key={edu._id}>
      {/*grabs the school from the above education ID*/}
      <td>{edu.school}</td>
      {/*hide on mobile*/}
        <td className='hide-sm'>{edu.degree}</td>
        <td>
        {/*takes in the date and formats it*/}
          <Moment format='YYYY/MM/DD'>{edu.from}</Moment> -{' '}
          {edu.to === null ? (
            ' Now'
          ) : (
            <Moment format='YYYY/MM/DD'>{edu.to}</Moment>
          )}
        </td>
        <td>
          <button onClick={() => deleteEducation(edu._id)} className='btn btn-danger'>Delete</button>
        </td>
      </tr>
  ));
  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Bootcamp/School</th>
            {/*will be responsive. Hides on mobile screens*/}
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
          {/*loops through data and formats it*/}
          <tbody>{educations}</tbody>
      </table>
    </Fragment>
  )
}

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired
};

export default connect( null, { deleteEducation })(Education);
