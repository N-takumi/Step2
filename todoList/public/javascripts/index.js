// ページが表示されたときToDoリストを表示する
$(function(){
  getList();
});

// フォームを送信ボタンを押すと、ToDoを追加して再表示する。
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
    $.get('List', function(lists){
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

  //入力項目を空にする
  $('#listText').val('');
  //listにPOSTアクセス
  $.post('/list',{title:title},function(res){
    console.log(res);
  });

  //再表示
//  getList();

}
