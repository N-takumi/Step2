// ページが表示されたときToDoリストを表示する
$(function(){
  getList();
});

// フォームを送信ボタンを押すと、リストを追加して再表示する。
$('#form').submit(function(){
  postList();
  return false;
});


// list一覧を取得して表示する
function getList(){
  // すでに表示されている一覧を非表示にして削除する
  var $list = $('.list');
  $list.slideUp(function(){
    $list.children().remove();

    // /listにGETアクセスする
    $.get('list', function(lists){

      // 取得したlistを追加していく
      $.each(lists, function(index, list){
        var title = list.listName;
        $list.append('<p>'+title+'</p>');
      });

      // 一覧を表示する
      $list.slideDown();
    });
  });


}

// フォームに入力されたリストを追加する
function postList(){
  // フォームに入力された値を取得
  var title = $('#listText').val();

  //文字数チェック
  if(title.length == 0){
    alert('Todoリスト名が入力されていません');
    return false;
  }else if(title.length > 30){
    alert('Todoリストの名称は30文字以内にしてください');
    return false;
  }

  //同名のリストが存在するかチェック
  var flag = true;
  $.get('list', function(lists){
    $.each(lists, function(index, list){
      if(title == list.listName){
        alert('同じ名前のTodoリストがすでに存在します');
        flag = false;return false;
      }
    });
    //リストを作る
    //listにPOSTアクセス
    if(flag){
      $.post('/list',{title:title},function(res){
        if(res){
          location.reload();
        }
          console.log(res);
      });
    }

  });

  //入力項目を空にする
  $('#listText').val('');

  //再表示
//  getList();

}

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
