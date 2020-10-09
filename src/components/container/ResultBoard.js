import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import TitleText from '../presenter/TitleText';
import { getSlides, editSlide } from '../../actions/slides';
import ContentBoard from '../presenter/ContentBoard';
import { getResult } from '../../apis/utils';
import Graph from './Graph';
import PDFMaker from './PDFMaker';

const Body = styled.div`
  margin: 0 auto;
`;

const ResultBoard = (props) => {
  const [result, setResult] = useState({});

  useEffect(() => {
    getResult().then((res) => {
      console.log(res);
      setResult({ keywords : res.keywords, summary: res.summary });
    });
  }, []);
  const onClick = () => {
    PDFMaker(props.slides);
  };

  return (
    <Body>
      <TitleText style={{ marginBottom: '15px' }}>결과</TitleText>
      {/* <button onClick={onClick}>PDF</button> */}
      <TitleText>강의노트</TitleText>
      <ContentBoard input={result.summary ? result.summary : '요약된 스크립트가 없습니다'} title="스크립트" />

      <TitleText>분석</TitleText>
      <Graph data={result.keywords ? result.keywords : []} />
    </Body>
  );
};

const mapStateToProps = (state) => {
  return {
    slides: Object.values(state.slides),
  };
};

export default connect(mapStateToProps, { getSlides })(ResultBoard);
