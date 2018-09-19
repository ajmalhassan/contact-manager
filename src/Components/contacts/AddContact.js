import React, { Component } from "react";
import { Consumer } from "../../context";
import TextInputGroup from "../layout/textInputGroup";
import axios from 'axios';

class AddContact extends Component {
  resetForm = () => ({
    name: "",
    email: "",
    phone: "",
    errors: {}
  });

  state = this.resetForm();

  onFieldChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    const { name, email, phone } = this.state;

    if (!name.length) {
      this.setState({ errors: { name: "Name is required" } });
      return;
    }
    if (!email.length) {
      this.setState({ errors: { email: "Email is required" } });
      return;
    }
    if (!phone.length) {
      this.setState({ errors: { phone: "Phone is required" } });
      return;
    }

    let newContact = {
      name,
      email,
      phone
    };

    const res = await axios.post(`https://jsonplaceholder.typicode.com/users`, newContact)
    dispatch({
      type: "ADD_CONTACT",
      payload: res.data
    });

    this.setState(this.resetForm());
    this.props.history.push("/");
  };

  render() {
    const { name, email, phone, errors } = this.state;
    return (
      <Consumer>
        {value => {
          const { dispatch } = value;
          return (
            <div className="card mb-3">
              <div className="card-header">Add contact</div>
              <div className="card-body">
                <form onSubmit={this.onSubmit.bind(this, dispatch)}>
                  <TextInputGroup
                    label="Name"
                    name="name"
                    placeholder="eg: John Doe"
                    value={name}
                    error={errors.name}
                    onChange={this.onFieldChange}
                  />
                  <TextInputGroup
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="eg: John@Doe.com"
                    value={email}
                    error={errors.email}
                    onChange={this.onFieldChange}
                  />
                  <TextInputGroup
                    label="Phone"
                    name="phone"
                    placeholder="eg: 555-555-555"
                    value={phone}
                    error={errors.phone}
                    onChange={this.onFieldChange}
                  />
                  <input
                    type="submit"
                    value="Add contact"
                    className="btn btn-block btn-primary"
                  />
                </form>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default AddContact;
