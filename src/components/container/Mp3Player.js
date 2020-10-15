import React, {useState, useEffect} from 'react'
import AudioPlayer from 'react-h5-audio-player';
import styled from 'styled-components';
import {Icon} from 'semantic-ui-react';
import 'react-h5-audio-player/src/styles.scss';
import Spinner from '../presenter/Spinner';
import {getAudio} from '../../apis/utils';

const LoadingIcon = styled(Icon)`
  display: inline-block;
  position:relative;
  top: calc(50% - 10px);

`

const Container = styled.div`
  height: 88px;
  width: auto;
  vertical-align: middle;
  text-align:center;
  box-shadow: 0 0 3px 0 rgba(0,0,0,.2);
`

const Mp3Player = ({id}) => {
  const [audio, setAudio] = useState("");
  const [playing, setPlaying] = useState(false);
  const [loadingAudio, toggleLoading] = useState(true);

  useEffect(() => {
    toggleLoading(true)
    getAudio(id).then((res) => {
      setAudio(URL.createObjectURL(res))
      toggleLoading(false);
    })
    
  }, [id]);
  
  if(loadingAudio) {
    return <Container><LoadingIcon loading name="spinner" size="large" /></Container>
  }
  return (
  <AudioPlayer
    src={audio}
  />
)};

export default Mp3Player;