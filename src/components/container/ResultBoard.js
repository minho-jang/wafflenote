import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import TitleText from '../presenter/TitleText';
import { getSlide, editSlide } from '../../actions/slides';
import ContentBoard from '../presenter/ContentBoard';
import { getResult } from '../../apis/utils'
import Graph from './Graph';

const Body = styled.div`
  margin: 0 auto;
`

const ResultBoard = (props) => {
  const [summary, setSummary] = useState('');
  
  useEffect(() => {
    getResult().then((res) => {
      setSummary(res.summary);
    })
  })

  return (
    <Body>
      <TitleText style= {{ marginBottom: "15px"}}>
        결과
      </TitleText>

      <TitleText>
        강의노트
      </TitleText>
      <ContentBoard input={summary ? summary : "요약된 스크립트가 없습니다" } title="스크립트" />
      
      <TitleText>
        분석
      </TitleText>
      <Graph />
    </Body>
  );
}

export default ResultBoard;
