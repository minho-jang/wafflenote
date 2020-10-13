import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import TitleText from '../presenter/TitleText';
import ContentBoard from '../presenter/ContentBoard';
import { getSlide, editSlide } from '../../actions/slides';
import Player from './Player';
import TitleBoard from '../presenter/TitleBoard';
import { getImage, getAudio } from '../../apis/utils';
import wireframe from '../../static/wireframe.png'
import Tags from '../presenter/Tags';

const Body = styled.div`
  margin: 0 auto;
`;
const Image = styled.img`
  width: 805px;
  height: 500px;
  box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.16);
`;

const MainBoard = (props) => {
  if (!props.slide) {
    return <div>Loading</div>;
  }

  const [image, setImage] = useState("");

  useEffect(() => {
    (async function(){
      const image = await getImage(props.slide._id);
      setImage(image);
    })();
  }, [props]);

  const curSlide = props.slide;
  const onTitleSubmit = (editedTitle) => {
    const editedCurSlide = {
      ...curSlide,
      title: editedTitle,
    };
    props.editSlide(editedCurSlide._id, editedCurSlide);
  }
  const scriptOnBlur = (editedScript) => {
    const editedCurSlide = {
      ...curSlide,
      script: editedScript,
    };
    props.editSlide(editedCurSlide._id, editedCurSlide);
  };
  const noteOnBlur = (editedNote) => {
    const editedCurSlide = {
      ...curSlide,
      memo: editedNote,
    };
    props.editSlide(editedCurSlide._id, editedCurSlide);
  };

  return (
    <Body>
      <TitleBoard slide={curSlide} onTitleSubmit={onTitleSubmit} />
      <Image src={image ? image : wireframe } />
      <Player id={curSlide._id} />
      <TitleText>스크립트</TitleText>
      <ContentBoard input={curSlide.script} title="스크립트" onBlur={scriptOnBlur} />
      <TitleText>노트</TitleText>
      <ContentBoard input={curSlide.memo} title="노트" onBlur={noteOnBlur} />
      <TitleText>태그</TitleText>
      <Tags tags={curSlide.tags} />
    </Body>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    slide: state.slides[ownProps.id],
  };
};

export default connect(mapStateToProps, { getSlide, editSlide })(MainBoard);
