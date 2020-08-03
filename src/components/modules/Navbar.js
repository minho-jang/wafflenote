import React from 'react';
import { Link } from 'react-router-dom';
import CaptureButton from '../../CaptureButton';

const Navbar = () => (
  <div className="ui top fixed menu">
    <Link to="/notes/1" className="item">
      와플노트
    </Link>
    <div className="right menu">
      <CaptureButton className="item" />
      <Link to="/signin" className="item">
        로그인
      </Link>
      <Link to="/" className="item">
        <i className="icon large align justify" />
      </Link>
    </div>
  </div>
);

export default Navbar;
