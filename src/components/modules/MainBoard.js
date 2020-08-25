import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import TitleText from '../ui/TitleText';
import ContentBoard from '../ui/ContentBoard';
import { getSlide, editSlide } from '../../actions/slides';
import { getAudioFromStorage } from '../../apis/storage';
import Player from './Player';

const Body = styled.div`
  margin: 0 auto;
`
const Image = styled.img`
  width: 700px;
  height: auto;
  box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.16);
`;

const MainBoard = (props) => {
  if (!props.slide) {
    return (
      <div>
        Loading
      </div>
    )
  }
  useEffect(() => {
    props.getSlide(props.id);
  }, []);

  const [audio, setAudio] = useState(null);
  const [curSlide, setCurSlide] = useState({});

  useEffect(() => {
    getAudioFromStorage('note', props.id).then((result) => {
      setAudio(window.URL.createObjectURL(result));
    })
    setCurSlide(props.slide);
  }, [props.slide])

  const scriptOnBlur = (editedScript) => {
    const editedCurSlide = {
      ...curSlide,
      script: editedScript,
    }
    props.editSlide(editedCurSlide.id,editedCurSlide)
    props.getSlide(props.id);
  }
  const noteOnBlur = (editedNote) => {
    const editedCurSlide = {
      ...curSlide,
      note: editedNote,
    }
    props.editSlide(editedCurSlide.id,editedCurSlide)
    props.getSlide(props.id);
  }
  return (
    <Body>
      <TitleText>
        {curSlide.title}
        {curSlide.endTimeInfo !== null ?
          " " + curSlide.startTimeInfo + " ~ " + curSlide.endTimeInfo : 
          " " +  curSlide.startTimeInfo + " ~"}
      </TitleText>
      <Image src={curSlide.slide} />
      {audio ? 
      <Player url={audio} /> : "loading mp3"}
      <TitleText>
        스크립트
      </TitleText>
      <ContentBoard input={curSlide.script} title="스크립트" onBlur={scriptOnBlur} />
      <TitleText>
        노트
      </TitleText>
      <ContentBoard input={curSlide.note} title="노트" onBlur={noteOnBlur} />
      <TitleText>
        태그
      </TitleText>
    </Body>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    slide: state.slides[ownProps.id],
  };
};

export default connect(mapStateToProps, { getSlide, editSlide })(MainBoard);