//フォームを送信ボタンを押すと,Todoを追加して再表示
$('#form').submit(function(){
  postTodo();
  return false;
});

//checkboxクリック時
$('.checkBox').change(function(){
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
  var name = $('#todoText').val();
  var limitDate = new Date($('#limit').val());
  var listName = $('.listName').text();

  //エラーチェック
  //文字数
  if(name.length == 0){
    alert('Todo名が入力されていません');
    return false;
  }else if(name.length >= 31){
    alert('Todoの名称は30字以内にしてください');
    return false;
  }

  if(limitDate.toString() === 'Invalid Date'){
    alert('期限が入力されていません');
    return false;
  }

  //同名のTodoが存在するか
  var flag = true;
  $.get('/todo',function(todos){
    console.log(todos);
    $.each(todos, function(index,todo){
      if(name == todo.text){
        alert('同じ名称のTodoが既に存在しています');
        flag = false;return false;
      }
    });
    //Todoを作成する
    if(flag){
      var todo = {
        name:name,
        limitDate:limitDate,
        listName:listName,
        isCheck:false
      };

      // /todoにPOSTアクセスする
      $.post('/todo',todo,function(res){
        if(res){
          location.reload();
        }
        console.log(res);
      });
    }
  });

  //入力項目をからにする
  $('#text').val('');
  $('#limit').val('');

}
