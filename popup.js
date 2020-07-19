// alert('와플노트 결과물에 대해서 본인만 사용하고, 타인에게 공유를 하지 않고 상업적으로 이용하지 않습니다. 이와 관련된 어떤 법적 이슈도 (주)와플노트에서는 책임 지지 않습니다.');

chrome.tabs.executeScript({
  code: `document.querySelector("body").innerText;`
}, function(result){
  var bodyText = result[0];
  var bodyNum = bodyText.split(' ').length;
  var myNum = bodyText.match(new RegExp('\\b(the|is|was|od)\\b', 'gi')).length;
  // alert(myNum + '/' + bodyNum + '(' + (myNum / bodyNum * 100) + '%)');
  var result = myNum + '/' + bodyNum + '(' + (myNum / bodyNum * 100) + '%)'
  document.querySelector('#result').innerHTML = result;

});
