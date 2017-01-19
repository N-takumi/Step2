
//検索ボタンクリック時
$('#searchBtn').click(function(){
//console.log($('#searchText').val());
  //すでにある要素を削除
  var $li = $('li');
  $li.remove();

  //エラー処理
  if($('#searchText').val().length == 0){
    $('#searchMessage').text('検索ワードが入力されていません').fadeIn().fadeOut(5000);
    return false;
  }else if($('#searchText').val().length > 30){
    $('#searchMessage').text('検索ワードは30字以内にしてください').fadeIn().fadeOut(5000);
    return false;
  }

  //検索ワードでsearchにGETアクセス
  $.get('/Search/' + $('#searchText').val(),function(data){
    //var a = data.resTodo.limitDate.toLocaleString();
    console.log(data);
    console.log(data.resList.length);
    console.log(data.resTodo.length);
    //console.log(a);
    var seTodo = $('#searchResTodo');
    var seList = $('#searchResList');
      //Todoの検索
      if(data.resTodo.length == 0){
        //検索結果のTodoが存在しない場合
        $('#searchMessageTodo').text('対象のTodoは見つかりませんでした').fadeIn();
      }else{
        //検索結果のTodoが存在する場合
        $('#searchMessageTodo').text('Todoが'+data.resTodo.length+'件見つかりました').fadeIn();
        data.resTodo.forEach(function(d){
          seTodo.append("<li class = 'searchList'><a href = /listPage/"+d.listName+">"+d.text+"</a>"+
                      "<p>リスト:"+d.listName+"</p>"+"<p>期限:"+d.limitDate.toLocaleString()+"</p>"+
                      "<p>作成日:"+d.createdDate.toLocaleString()+"<p>"+"</li>");
        });
      }

      //Listの検索
      if(data.resList.length == 0){
        //検索対象のListが存在しない場合
        $('#searchMessageList').text('対象のリストは見つかりませんでした').fadeIn();
      }else{
        //検索対象のListが存在する場合
        $('#searchMessageList').text('Todoリストが'+data.resList.length+'件見つかりました').fadeIn();
        data.resList.forEach(function(d){
          seList.append("<li><a href = /listPage/"+d.listName+">"+d.listName+"</a>"+
          "<p>作成日:"+d.createdDate.toLocaleString()+"</p>"+"</li>");
        })
      }



  });

});
