// ページが表示されたときToDoリストを表示する
$(function(){
  getList();
});

// フォームを送信ボタンを押すと、リストを追加して再表示する。
$('#form').submit(function(){
  postList();
  location.reload();
  return false;
});
  
// ToDo一覧を取得して表示する
function getList(){
  // すでに表示されている一覧を非表示にして削除する
  var $list = $('.list');
  $list.slideUp(function(){
    $list.children().remove();
    // /todoにGETアクセスする
    $.get('list', function(lists){
      // 取得したToDoを追加していく
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

  if(checkData(title)){
    //入力項目を空にする
    $('#listText').val('');
    //listにPOSTアクセス
    $.post('/list',{title:title},function(res){
      if(res){
        location.reload();
      }
        console.log(res);
    });
  }
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

//入力されたデータのエラーチェック
function checkData(text){

  //文字数チェック
  if(text.length == 0){
    alert('Todoリスト名が入力されていません');
    return false;
  }else if(text.length > 30){
    alert('Todoリストの名称は30文字以内にしてください');
    return false;
  }


  //同名のリストが存在するかどうか
  var flag = true;

  $.get('list', function(lists){
    // 取得したToDoを追加していく
    $.each(lists, function(index, list){
      if(text == list.listName){
        alert('同じ名前のTodoリストが存在します');
        flag = false;return false;
      }
    });
    //リストを作る
  });

  console.log(flag);

  return flag;


  //すべて通れば
  return true;
}
