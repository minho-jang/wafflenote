import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import TitleText from '../presenter/TitleText';
import { getSlides, editSlide } from '../../actions/slides';
import { editNote, getNoteResult } from '../../actions/notes';
import ContentBoard from '../presenter/ContentBoard';
import { getResult } from '../../apis/utils';
import Graph from './Graph';
import PDFMaker from './PDFMaker';
import TitleBoard from '../presenter/TitleBoard';
import Spinner from '../presenter/Spinner';
import PDFButton from '../presenter/PDFButton';

const Body = styled.div`
  margin: 0 auto;
`;


const ResultBoard = (props) => {

  const [isRequested, toggleRequest] = useState(false);
  useEffect(() => {
    props.getNoteResult(props.noteId);
  }, []);
  const onNoteTitleSubmit = (editedTitle) => {
    props.editNote(props.noteId, editedTitle);
  };

  if (!props.note) {
    return <Spinner />;
  }
  const onClick = () => {
    toggleRequest(true)
    PDFMaker(props.slides,props.note.summary, props.note.title)
      .then((res) => {
        toggleRequest(false);
      })
  };

  return (
    <Body>
      {isRequested 
        ? <Spinner message={"PDF를 추출 중입니다."}/>
        : <PDFButton onClick={onClick} />}
      
      <TitleBoard slide={props.note} onTitleSubmit={onNoteTitleSubmit} />
      <TitleText>강의 요약노트</TitleText>
      <ContentBoard input={props.note.summary ? props.note.summary : '요약된 스크립트가 없습니다'} title="스크립트" />

      <TitleText>분석</TitleText>
      <Graph data={props.note.note_keywords ? props.note.note_keywords : []} />
    </Body>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    slides: Object.values(state.slides),
    note: state.notes[ownProps.noteId],
  };
};

export default connect(mapStateToProps, { getSlides, editNote, getNoteResult })(ResultBoard);
