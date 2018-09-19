import React, { Component } from 'react';
import Contact from './Contact';
import { Consumer } from '../../context';

const Contacts = () => (
    <Consumer>
      {(value) => {
        const { contacts } = value;
        return (
          <React.Fragment>
            <h1 className="display-6 mb-2">
              <span className="text-danger">Contact</span>
               &nbsp;list
            </h1>
            {contacts.map(contact => <Contact key={contact.id} contact={contact} />)}
          </React.Fragment>
        );
      }}
    </Consumer>
  );

export default Contacts;
