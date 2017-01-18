
//検索ボタンクリック時
$('#searchBtn').click(function(){
//console.log($('#searchText').val());
  //すでにある要素を削除
  var $li = $('li');
  $li.remove();

  //エラー処理
  if($('#searchText').val().length == 0){
    $('#searchMessage').text('検索ワードが入力されていません').fadeIn();
    return false;
  }else if($('#searchText').val().length > 30){
    $('#searchMessage').text('検索ワードは30字以内にしてください').fadeIn();
    return false;
  }

    $.get('/Search/' + $('#searchText').val(),function(data){
      var node = $('#searchRes');
      if(data.length == 0){
        //検索結果のTodo及びリストが存在しない場合
        $('#searchMessage').text('対象のTodoは見つかりません').fadeIn();
      }else{
        //検索結果のTodo及びリストが存在する場合
        $('#searchMessage').text('Todoが'+data.length+'件見つかりました').fadeIn();
        data.forEach(function(d){
          node.append("<li class = 'searchList'><a href = /listPage/"+d.listName+">"+d.text+"</a>"+
                      "<p>リスト:"+d.listName+"</p>"+"<p>期限:"+d.limitDate+"</p>"+
                      "<p>作成日:"+d.createdDate+"<p>"+"</li>");
        });
        $li.fadeIn();
      }
    });

});
