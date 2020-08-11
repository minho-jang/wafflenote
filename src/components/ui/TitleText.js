import React from 'react';
import styled from 'styled-components';

const Text = styled.div`
  margin-bottom: 10px;
  margin-left: 2px;
  font-size: 23px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`

const TitleText = (props) => {
  return (
    <Text>
      {props.children}
    </Text>
  );
}

export default TitleText;