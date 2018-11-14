(function() {
  "use strict";
  //hitodehitodehitode
  
　//レコード詳細画面が表示された時のイベント-------------------------------------------------------------------------- 
  kintone.events.on('app.record.detail.show', function(event) {
    var record = event.record
    console.log(event);
    
    //担当者名を更新する関数
    function addMemberMine(x,xx) {
      
      //今日の日付を取得
      var dt = new Date();
      var date = dt.getFullYear()+'-'+ (dt.getMonth()+1)+'-'+ dt.getDate();
      
      //ログインユーザの情報を取得
      var loginuser = kintone.getLoginUser();
      var  member = record[x].value;

      var objParam = {};
      objParam.app = kintone.app.getId();       // アプリ番号
      objParam.id = kintone.app.record.getId(); // レコード番号
      objParam.record = {};
      
      //仮原稿送付日の更新
      objParam.record[xx] = {'value': date};
      
      //担当者を更新
      objParam.record[x] = {};
      objParam.record[x].value = [];
      // すでに担当者になっているメンバーを追加する
      for (var i = 0; i < member.length; i++) {
       objParam.record[x].value[i] = {'code': member[i].code};
      }
      //ログインユーザを追加する
      objParam.record[x].value[member.length] = {'code': loginuser.code};     
      // レコードを更新する  
      kintone.api('/k/v1/record', 'PUT', objParam, function(resp) {     
        location.reload(true);// 成功時は画面をリロード
      });
    }
   
    // '仮原稿送付担当者_進捗管理'を更新するボタンを設置　
    var Button = document.createElement('button');
    Button.innerHTML = '担当者に自分を追加';
    Button.style.marginTop = '30px';
    kintone.app.record.getSpaceElement('spacefield_soufu').appendChild(Button);
    Button.onclick = function() {
        addMemberMine('仮原稿送付担当者_進捗管理','仮原稿送付日_進捗管理');
   }
    
    // '仮原稿送付担当者_進捗管理'を更新するボタンを設置　
    var Button2 = document.createElement('button');
    Button2.innerHTML = '担当者に自分を追加';
    Button2.style.marginTop = '30px';
    kintone.app.record.getSpaceElement('spacefield_keisai').appendChild(Button2);
    Button2.onclick = function() {
        addMemberMine('掲載切替担当者','掲載切替日');
    }
    

    //詳細画面「レコードを再利用する」を非表示
    document.getElementsByClassName('gaia-argoui-app-menu-copy')[0].style.display = 'none';

    //fax受信画面のリンク作成   
    var faxnumber = record.申込書FAXID.value;
    if (!faxnumber) {
      return;
    } else {
      var tmpA = document.createElement('a');
      tmpA.href = 'https://operators.job-medley.com/received_faxes/?utf8=&idxcnt=' +  faxnumber;
      tmpA.innerHTML = ' 🐰';
      //tmpA.style.fontSize = '3px';
      tmpA.target = '_blank';
      kintone.app.record.getFieldElement('申込書FAXID').appendChild(tmpA);
    }

    //顧客管理画面のリンク作成
    var clientId = record.顧客ID.value;
    if (!clientId) {
      return;
    } else {
      var clienttmpA = document.createElement('a');
      clienttmpA.href = 'https://operators.job-medley.com/facilities?customerId=' +  clientId;
      clienttmpA.innerHTML = ' 🐰';
      //clienttmpA.style.fontSize = '3px';
      clienttmpA.target = '_blank';
      kintone.app.record.getFieldElement('顧客ID').appendChild(clienttmpA);
    }
  });

  //レコード編集画面でのリアルタイム更新-----------------------------------------------------------------------------------
  var manuscriptPresenceEvents = [
    'app.record.detail.show',
    'app.record.create.show',
    'app.record.edit.show',
    'app.record.edit.change.原稿ありなし選択',
    'app.record.create.change.原稿ありなし選択',
    'app.record.edit.change.施設登録ありなし選択',
    'app.record.create.change.施設登ありなし選択',
    'app.record.edit.change.他依頼内容ありなし選択',
    'app.record.create.change.他依頼内容ありなし選択',
    'app.record.edit.change.顧客起因不備',
    'app.record.create.change.顧客起因不備',
    'app.record.edit.change.社内起因不備',
    'app.record.create.change.社内起因不備'
  ]

  kintone.events.on(manuscriptPresenceEvents, function(event) {
    var record = event.record

    //テーブルのありなし選択で「なし」が選択されていたらテーブルを非表示にする。
    var items = [
      '施設情報テーブル',
      '施設作成件数',
      '施設変更件数',
      '削除件数',
      '掲載のみ_合計',
      '登録・掲載_合計'
    ];

    var items2 = [
      '求人情報テーブル',
      '求人作成件数',
      '求人変更件数',
      '非掲載化・削除求人数',
      '登録のみ_合計',
      '登録・掲載_合計'
    ];
    
    var industryList = ['病院','診療所','歯科','代替','介護福祉','薬局','訪問看護','保育','その他'];
    industryList.forEach(function(item) {
      items.push(item + '_登録のみ',
                 item + '_登録・掲載');
      items2.push(item + '_掲載のみ',
                  item + '_登録・掲載');
    });
    
    //施設情報テーブル
    items.forEach(function(item) {
      kintone.app.record.setFieldShown(item, record.施設登録ありなし選択.value.indexOf('施設登録あり') >= 0); 
    });    
    
    //原稿情報テーブル
    items2.forEach(function(item) {
      kintone.app.record.setFieldShown(item, record.原稿ありなし選択.value.indexOf('原稿あり') >= 0);  
    });    
 
    //その他依頼内容
    kintone.app.record.setFieldShown('その他依頼内容', record.他依頼内容ありなし選択.value.indexOf('他依頼内容あり') >= 0); 

    //顧客起因不備のステータスが解除済に変更されたとき、顧客起因待機解除日になにも入力されていなければ今日の日付を入力。
    var dt = new Date();
    var date = dt.getFullYear()+'-'+ (dt.getMonth()+1)+'-'+ dt.getDate();

    var deficiencyStatus = {
      '顧客起因待機解除日' : '顧客起因不備',
      '社内起因待機解除日' : '社内起因不備'
    };

    Object.keys(deficiencyStatus).forEach(function(item) {
      if(!record[item].value && record[deficiencyStatus[item]].value === '解除済') {
        record[item].value = date;
      }
    });
    return event;

  });

  // レコードが保存された時のイベント-------------------------------------------------------------------------- 
  kintone.events.on(['app.record.create.submit', 'app.record.edit.submit'], function (event){
    var record = event.record;

    //予定/履歴メモに何か入力されたとき、予定日時　or　完了日時になにも入力されていなければエラー。タスク担当者が入力されてなければエラー
    /*  var hearingTtable = record.ヒアリング履歴テーブル.value ;
      var errormessage = "";
       for (i = 0; i < hearingTtable.length; i++) {
          if(hearingTtable[i].value.履歴メモ.value) {
             if(!hearingTtable[i].value.予定日時.value && !hearingTtable[i].value.完了日時.value) {
                errormessage += "[ヒアリング予定/履歴] Next予定日時　or　完了日時";
             } 
             if(!hearingTtable[i].value.タスク担当者.value[0]) {
                errormessage += "[ヒアリング予定/履歴] タスク担当者";        
             } 
          }
       }

      if(errormessage) { 
         event.error = '以下の項目を入力してください。<br />' + errormessage;
      }*/

    //依頼内容の「施設作成件数」、「施設変更件数」、「施設削除件数」を数える。 

    var facilityStatsNameList = ['施設作成件数','施設変更件数','削除件数'];
    var facilityStatsCounter = new Array(facilityStatsNameList.length).fill(0);//facilityStatsNameList分の0の配列
    var facilityTable = record.施設情報テーブル.value;

    if(record.施設登録ありなし選択.value.indexOf('施設登録あり') >= 0) {
      for(var i = 0; i < facilityTable.length; i++) {   
        var facilityTable2 = facilityTable[i].value.依頼ステータス_施設.value;
        facilityStatsCounter[0] += facilityTable2.indexOf('新規作成(掲載あり)') + 1; 
        facilityStatsCounter[0] += facilityTable2.indexOf('新規作成(掲載なし)') + 1;
        facilityStatsCounter[1] += facilityTable2.indexOf('変更') + 1;
        facilityStatsCounter[2] += facilityTable2.indexOf('施設削除') + 1;
      }
    }

    for(var i = 0; i < facilityStatsNameList.length; i++) {
      record[facilityStatsNameList[i]].value = facilityStatsCounter[i];
    }

    //求人原稿の「求人作成件数」、「求人変更件数」、「非掲載化・削除求人数」を数える。
    var jobofferStatsNameList = ['求人作成件数','求人変更件数','非掲載化・削除求人数'];
    var jobofferStatsCounter = new Array(jobofferStatsNameList.length).fill(0);//facilityStatsNameList分の0の配列
    var jobofferTable = record.求人情報テーブル.value;

    if(record.原稿ありなし選択.value.indexOf('原稿あり') >= 0) {
      for(var i = 0; i < jobofferTable.length; i++) {   
        var jobofferTable2 = jobofferTable[i].value.依頼ステータス_求人.value;
        jobofferStatsCounter[0] += jobofferTable2.indexOf('新規作成(施設登録あり)') + 1 ;
        jobofferStatsCounter[0] += jobofferTable2.indexOf('追加掲載(施設登録なし)') + 1;
        jobofferStatsCounter[1] += jobofferTable2.indexOf('既存修正') + 1;
        jobofferStatsCounter[2] += jobofferTable2.indexOf('応募受付終了処理・求人削除') + 1;
      }
    }
    
    //フィールドへ反映させる。
    for(var i = 0; i < jobofferStatsNameList.length; i++) {
      record[jobofferStatsNameList[i]].value = jobofferStatsCounter[i];
    }


    //「登録のみ_合計」、「掲載のみ_合計」、「登録・掲載_合計」、を集計するために、各業態の依頼数を数える。
    var industryStatsNameList = ['新規作成(掲載なし)','追加掲載(施設登録なし)','新規作成(掲載あり)'];
    //↑[新規作成(掲載なし)→_登録のみ] [追加掲載(施設登録なし)→_掲載のみ] [新規作成(掲載あり)→_登録・掲載]
    var industryList = ['病院','診療所','歯科','代替','介護福祉','薬局','訪問看護','保育','その他'];//kintoneの並び順と同じ

    //集計するための箱
    var industryStatsCounter =[];
    for (var i = 0; i < industryStatsNameList.length; i++) {
      industryStatsCounter.push([]);
      for (var j = 0; j < industryList.length; j++) {
        industryStatsCounter[i].push(0);
      }	
    } 

    //集計する関数
    function posting_counter (tableName,orderStatus,facilityStyle) {
      var t_record = record[tableName].value      
      for( var i = 0; i < t_record.length; i++) {
        var a = industryStatsNameList.indexOf(t_record[i].value[orderStatus].value)
        var b = industryList.indexOf(t_record[i].value[facilityStyle].value);
        if(a >= 0) {
          industryStatsCounter[a][b] += 1
        }     
      }
    }
  
    posting_counter('施設情報テーブル','依頼ステータス_施設','施設形態_施設'); //施設情報テーブルを集計
    posting_counter('求人情報テーブル','依頼ステータス_求人','施設形態_求人'); //求人情報テーブルを集計

    //フィールドへ反映 
    var trailing_character = ['_登録のみ','_掲載のみ','_登録・掲載'];//industryStatsNameの並び順と同じ
    for (var i = 0; i < trailing_character.length; i++) {
      for (var j = 0; j < industryList.length; j++) {
        record[industryList[j] + trailing_character[i]].value = industryStatsCounter[i][j];
      }        
    }

    return event;

  });

  //レコード編集画面が表示された時のイベント&レコード追加画面が表示された時のイベント------------------------------------- 
  kintone.events.on(['app.record.edit.show', 'app.record.create.show'], function (event) {
    var record = event.record;
    // フィールドの入力を制限
    var fieldName = ['施設作成件数','施設変更件数','削除件数','求人作成件数','求人変更件数','非掲載化・削除求人数'];
    for (var i = 0; i < fieldName.length; i++ ) {
      record[fieldName[i]].disabled = true;
    }

    //「業態_登録のみ」「業態_掲載のみ」「業態_登録・掲載」フィールドの入力を制限
    var industry = ['病院','診療所','歯科','代替','介護福祉','薬局','訪問看護','保育','その他'];
    var trailing_character = ['_登録のみ','_掲載のみ','_登録・掲載'];

    for (var i = 0; i < trailing_character.length; i++) {
      for (var j = 0; j < industry.length; j++) {
        record[industry[j] + trailing_character[i]].disabled = true;
      }         
    }

    return event;

  });

})();


     
