//検索ボタンクリック時
$('#searchBtn').click(function(){
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
    var resTodo = data.resTodo.reverse();
    var resList = data.resList.reverse();
    var seTodo = $('#searchResTodo');
    var seList = $('#searchResList');
      //Todoの検索
      if(resTodo.length == 0){
        //検索結果のTodoが存在しない場合
        $('#searchMessageTodo').text('対象のTodoは見つかりませんでした').fadeIn();
      }else{
        //検索結果のTodoが存在する場合
        $('#searchMessageTodo').text('Todoが'+resTodo.length+'件見つかりました').fadeIn();

        $.each(resTodo,function(index,d){
          var inputDate_limit = new Date(d.limitDate);
          var inputDate_created = new Date(d.createdDate);
          seTodo.append("<li class = 'searchList'><a href = /listPage/"+encodeURIComponent(d.listName)+"><h2>"+escapeText(d.text)+
          "<h2></a>"+"<p>リスト:"+escapeText(d.listName)+"</p>"+"<p class='limitDate'>"
          +"期限:"+inputDate_limit.toLocaleString()+"</p>"+
          "<p class = 'createdDate'>作成日:"+inputDate_created.toLocaleString()+"<p>"+"</li>");
        });

      }

      //Listの検索
      if(resList.length == 0){
        //検索対象のListが存在しない場合
        $('#searchMessageList').text('対象のリストは見つかりませんでした').fadeIn();
      }else{
        //検索対象のListが存在する場合
        $('#searchMessageList').text('Todoリストが'+resList.length+'件見つかりました').fadeIn();

        $.each(resList,function(index,d){
          var inputDateList = new Date(d.createdDate);
          seList.append("<li class = 'searchList'><a href = /listPage/"+encodeURIComponent(d.listName)+">"+escapeText(d.listName)+"</a>"+
          "<p class='createdDate'>作成日:"+inputDateList.toLocaleString()+"</p>"+"</li>");
        });
      }
  });

});

//HTMLタグのエスケープ処理
function escapeText(text){

  var TABLE_FOR_ESCAPE_HTML = {
  "&":"&amp;",
  "\"":"&quot;",
  "<":"&lt;",
  ">":"&gt;"
  };

  return text.replace(/[&"<>]/g,function(match){
    return TABLE_FOR_ESCAPE_HTML[match];
  });
}
