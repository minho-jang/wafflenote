import styled, { css } from 'styled-components';

const NormalText = styled.div`
  margin: 0 auto;
  width: 805px;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #b3b3b3;
  cursor: pointer;
  ${(props) =>
    props.isClicked &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      word-wrap:break-word; 
      line-height: 1.2em;
      height: 6em;
    `}
`;

export default NormalText;
