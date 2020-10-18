import React from 'react';
import styled from 'styled-components';

import { ReactComponent as PDFSvg } from '../../static/PDFButtonImage.svg';

const PDFbtn = styled(PDFSvg)`
  cursor: pointer;
  float: right;
`
const PDFButton = ({onClick}) => {
  return <PDFbtn onClick={onClick} />
}

export default PDFButton;