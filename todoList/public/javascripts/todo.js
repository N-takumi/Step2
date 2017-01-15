//フォームを送信ボタンを押すと,Todoを追加して再表示
$('#form').submit(function(){
  postTodo();
  return false;
});

//フォームに入力された内容を追加する
function postTodo() {
  //フォームに入力された値を取得
  var name = $('#text').val();
  var limitDate = new Date($('#limit').val());
  var listName = $('h3').text();

  //入力項目をからにする
  $('#text').val('');
  $('#limit').val('');

  // /todoにPOSTアクセスする
  $.post('/todo',{name: name,limit: limitDate,listName:listName},function(res){
    console.log(res);
    location.reload();
  });

}
