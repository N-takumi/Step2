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
    $.get('/dataGet', function(data){
      //getしたdata配列をそれぞれ逆順で格納
      var listData = data.lists.reverse();
      var todoData = data.todos.reverse();

    //リストの表示処理
      //空のオブジェクト作成
      var result = {};

      //todoValues配列(todoの数,チェックされたtodoの数,最も近い締め切り)
      var todoValues = [];

      //現在日時取得
      var nowTime = new Date();

      $.each(listData, function(index,list){
        //keyがlistの連想配列を作成
        result[list] = [];

        $.each(todoData, function(index,todo){
          //listNameを照合してTodoとリストを対応させる
          if(todo.listName == list.listName){
            result[list].push(todo);
          }
        });

        //現在チェックされているtodo数
        var checkCount = 0;

        //リストに含まれるtodoの数
        var todoCount = result[list].length;

        //Date(日時情報)入れる配列
        var dateValues = [];

        $.each(result[list], function(index,checked){
          if(checked.isCheck){
            checkCount++;
          }

          //date型でchangedDateに代入
          if(!checked.isCheck){//チェック済みを除く
            var changedDate = new Date(checked.limitDate);

            //date型を数値に変換、現在日時と期限との差を出す
            var subtraction = Math.abs(changedDate.getTime() - nowTime.getTime());

            //nullとNaNの排除
            if (subtraction != null && !isNaN(subtraction)) {
            //現在日時と期日の差の配列
            dateValues.push(subtraction);
            }
          }
        });

        //現在時刻と期日とのさの中から最も小さい値のindexを取り出す
        var min = Math.abs(dateValues.indexOf(Math.min.apply(null, dateValues)));

        //取得したindex番号の数値を元にdateに変換する
        var minDate = new Date(dateValues[min] + nowTime.getTime());

        //3種の値をハッシュにして配列に格納する
        todoValues.push({
          todoCount:todoCount,
          checkCount:checkCount,
          date:minDate
        });
      });

      if(listData.length == 0) {
        $list.append('<div id = "listEnp"><h3>登録されているリストがありません</h3>'+
                      '<p>上のエントリフォームにリスト名を入力してTodoリストを作成してね↑↑↑</p></div>');
      }else{
        for(var i = 0;i < listData.length;i++){
          console.log(todoValues[i]['date']);
          $list.append('<div id = "list">'
                      +'<h2><a href =/listPage/'+encodeURIComponent(listData[i].listName)+'>'
                      +escapeText(listData[i].listName)+'</a></h2>'
                      +'<p class = "finished">'+todoValues[i]['todoCount']+'個中'
                      +todoValues[i]['checkCount']+'個がチェック済み'+'</p>'
                      +'<p class = limitDate>期限:~'+todoValues[i]['date'].toLocaleString()+'</p>'+'</div>');
        }
      }



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
          getList();
        }
          console.log(res);
      });
    }

  });

  //入力項目を空にする
  $('#listText').val('');

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
