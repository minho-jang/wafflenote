import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import playIcon from '../../static/play.svg';
import pauseIcon from '../../static/pause.svg';
import Spinner from '../presenter/Spinner';
import { getAudio } from '../../apis/utils';
import { Icon } from 'semantic-ui-react';


const LoadingIcon = styled(Icon)`
  padding-left: 14px;
  margin-top: 5px;
  vertical-align: middle;
`

const Container = styled.div`
  margin-bottom: 13px;
  width: 40px;
  height: 24px;
  border-radius: 18px;
  background-color: #fdeed0;
`

const Button = styled.img`
  margin-left: 14px;
  margin-top: 5px;
  vertical-align: middle;
  cursor: pointer;
`

const Player = ({ id }) => {
  const [audio, setAudio] = useState(new Audio());
  const [playing, setPlaying] = useState(false);
  const [loadingAudio, toggleLoading] = useState(false);

  const toggle = () => setPlaying(!playing);
  useEffect(() => {
    toggleLoading(true)
    getAudio(id).then((res) => {
      audio.src=URL.createObjectURL(res)
      toggleLoading(false);
    })
    setPlaying(false);
  }, [id]);
  
  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  if (loadingAudio) return (
    <Container>
      <LoadingIcon name="spinner" />
    </Container>)

  return (
    <Container>
      <Button onClick={toggle} src={playing ? pauseIcon : playIcon}></Button>
    </Container>
  );
};

export default Player;
