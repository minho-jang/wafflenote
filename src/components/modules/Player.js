import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import playIcon from '../../static/play.svg';
import pauseIcon from '../../static/pause.svg';
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

const Player = ({ url }) => {
  const [audio, setAudio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);
  useEffect(() => {
    audio.src = url;
    setAudio(audio);
  }, [url]);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return (
    <Container>
      <Button onClick={toggle} src={playing ? pauseIcon : playIcon}></Button>
    </Container>
  );
};

export default Player;
