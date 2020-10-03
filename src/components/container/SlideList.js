import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { getSlides } from '../../actions/slides';

const Wrapper = styled.div`
  height: 100vh;
  width: 346px;
  position: relative;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
`;
const SlideCard = styled.div`
  width: 336px;
  height: 132px;
  border-radius: 20px;
  box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #ffbc3e;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`
const SlideImage = styled.img`
  width: 89.5px;
  height: 89.5px;
  margin: 20.5px;
`
const SlideContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20.5px 0;
  margin-right: 30.5px;
  color: #b3b3b3;
`
const SlideTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.45;
  letter-spacing: normal;
  color: #9b9b9b;
`
const SlideScript = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap:break-word; 
  line-height: 1.2em;
  height: 2.4em; 
`

const ResultButton = styled.div`
  width: 336px;
  height: 44px;
  border-radius: 20px;
  background-color: #fdeed0;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.45;
  letter-spacing: normal;
  text-align: center;
  color: #fbb93a;
  font-size: 20px;
  padding-top: 10px;
  a {
    color: #fbb93a;
  }
  cursor: pointer;
`

const SlideList = (props) => {
  useEffect(() => {
    props.getSlides();
  }, []);
  const renderedList = (arr) => arr.map((item, index) => {
    return (
      <Link to={`${index+1}`}>
        <SlideCard>
          <SlideImage src={item.slide} />
          <SlideContent>
            <SlideTitle>{item.title}</SlideTitle>
            <div>
              <span>{item.endTimeInfo !== null ?
                item.startTimeInfo + " ~ " + item.endTimeInfo + " ": 
                item.startTimeInfo + " ~ "}</span>
              <span>#keyword</span>
            </div>
            <SlideScript>
              {item.script}
            </SlideScript>
          </SlideContent>
        </SlideCard>
      </Link>
    );
  })

  return (
    <Wrapper>
      <div>
        {props.slides ? renderedList(props.slides) : ""}
      </div>
      <ResultButton>
        <Link to="result">
          결과
        </Link>
      </ResultButton>
    </Wrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    slides: Object.values(state.slides),
  }
}

export default connect(mapStateToProps, { getSlides })(SlideList);
