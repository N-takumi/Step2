//フォームを送信ボタンを押すと,Todoを追加して再表示
$('#form').submit(function(){
  postTodo();
  return false;
});

//checkboxクリック時
$('.checkbox').change(function(){
  console.log($(this).prop('checked'));
  $.ajax({
    url:'/todo',
    type:'POST',
    contentType:'application/json',
    data: JSON.stringify({flag:$(this).prop('checked'), _id:$(this).val()})
  });
});

//フォームに入力された内容を追加する
function postTodo() {
  //フォームに入力された値を取得
  var name = $('#text').val();
  var limitDate = new Date($('#limit').val());
  var listName = $('.listName').text();

  //入力項目をからにする
  $('#text').val('');
  $('#limit').val('');

  var todo = {
    name:name,
    limitDate:limitDate,
    listName:listName,
    isCheck:false
  };

  // /todoにPOSTアクセスする
  $.post('/todo',todo,function(res){
    if(res){
      //location.reload();
    }else{
      console.log(res);
    }
  });

}
