import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { Dropdown } from 'semantic-ui-react';
import menuIcon from '../../static/Menu.png';
import { getNotes } from '../../actions/notes';
import Spinner from '../presenter/Spinner';
import { useHistory } from 'react-router-dom';

const UserDropdown = ({ notes, getNotes, auth }) => {
  useEffect(() => {
    getNotes();
  }, []);
  const history = useHistory();
  const onClickLink = (path) => {
    history.push(`/notes/${path}/result`)
    window.location.reload();
    
  }
  const renderNoteList = (notes) => notes.map((note, index) => {
    return (
      <>
        <Dropdown.Item text={note.title} onClick={() => { onClickLink(note._id) } } />
      </>
    )
  })
  return (
    <Dropdown icon={<img src={menuIcon}></img>}>
      <Dropdown.Menu direction="left" style={{ width: "200px"}}>
        <Dropdown.Item text={`${auth.userId}`} />
        <Dropdown.Divider />
        { notes ? (renderNoteList(notes)) :
          <Spinner />
        }
      
      </Dropdown.Menu>
    </Dropdown>
  );
};

const mapStateToProps = (state) => {
  return {
    notes: Object.values(state.notes),
    auth: state.auth,
  };
};

export default connect(mapStateToProps, { getNotes })(UserDropdown);
