import React, { Component } from "react";
import PropTypes from "prop-types";
import { Consumer } from "../../context";
import axios from 'axios';
import {Link} from 'react-router-dom';

class Contact extends Component {
  state = {
    showContactInfo: false
  };

  onIconClick = () => {
    this.setState({ showContactInfo: !this.state.showContactInfo });
  };

  onDeleteClick = async (id, dispatch) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
    } catch(e) {
      console.error(e)
    }
    dispatch({ type: "DELETE_CONTACT", payload: id })
  };

  render() {
    const { contact } = this.props;
    const { showContactInfo } = this.state;
    const iconClass = showContactInfo ? "up" : "down";
    return (
      <Consumer>
        {value => {
          const { dispatch } = value;
          return (
            <div className="card card-body mb-3">
              <h4>
                {contact.name}
                &nbsp;
                <small>
                  <i
                    onClick={this.onIconClick}
                    className={"fa fa-chevron-" + iconClass}
                    style={{ cursor: "pointer" }}
                  />
                </small>
                  <i onClick={this.onDeleteClick.bind(this, contact.id, dispatch)}
                  className="fa fa-times text-danger float-right"
                  style={{ cursor: "pointer"}}></i>
                  <Link to={`contact/edit/${contact.id}`}>
                <i
                  className="fa fa-pencil float-right"
                  style={{ cursor: "pointer", marginRight: "1rem" }}
                />
                </Link>
              </h4>
              {showContactInfo ? (
                <ul className="list-group">
                  <li className="list-group-item">Email: {contact.email}</li>
                  <li className="list-group-item">Phone: {contact.phone}</li>
                </ul>
              ) : (
                ""
              )}
            </div>
          );
        }}
      </Consumer>
    );
  }
}

Contact.propTypes = {
  contact: PropTypes.object.isRequired
};

export default Contact;
