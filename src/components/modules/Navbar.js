import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <div className="ui top fixed menu">
    <Link to="/" className="item">
      와플노트
    </Link>
    <div className="right menu">
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
