(function() {
   "use strict";
  
   // レコード詳細画面が表示された時のイベント-------------------------------------------------------------------------- 
   kintone.events.on('app.record.detail.show',function(event){
      console.log(event);
      document.getElementsByClassName('gaia-argoui-app-menu-copy')[0].style.display = 'none';

      //fax受信画面のリンク作成   
      var faxnumber = event.record.申込書FAXID.value;
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
      var clientId = event.record.顧客ID.value;
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
     
   //テスト　レコード更新時？-----------------------------------------------------------------------------------
  //原稿ありなし選択で「原稿なし」が選択されていたら求人情報テーブルを非表示にする。

   var events = [
      'app.record.detail.show',
      'app.record.create.show',
      'app.record.edit.show',
      'app.record.edit.change.原稿ありなし選択',
      'app.record.create.change.原稿ありなし選択'
   ]
   
   kintone.events.on(events, function(event) {
      var items = [
         '求人情報テーブル',
         '求人作成件数',
         '求人変更件数',
         '非掲載化・削除求人数'
      ]
      var record = event.record

      items.forEach(function(item) {
             kintone.app.record.setFieldShown(item, record.原稿ありなし選択.value.indexOf('原稿あり') >= 0);  
          });
   });
  
 
   // レコードが保存された時のイベント--------------------------------------------------------------------------
   
   kintone.events.on(['app.record.create.submit', 'app.record.edit.submit'], function (event){
       var record = event.record;
       var postingdate = record.掲載切替日.value;
       record.掲載完了日.value = postingdate;

       //顧客起因不備のステータスが解除済に変更されたとき、顧客起因待機解除日になにも入力されていなければ今日の日付を入力。
       var dt = new Date();
       var date = dt.getFullYear()+'-'+ (dt.getMonth()+1)+'-'+ dt.getDate();

       if(!record.顧客起因待機解除日.value) {
          if(record.顧客起因不備.value === '解除済') {
            record.顧客起因待機解除日.value = date;
          }
       }
       
      //社内起因不備のステータスが解除済に変更されたとき、顧客起因待機解除日になにも入力されていなければ今日の日付を入力。
       if(!record.社内起因待機解除日.value) {
          if(record.社内起因不備.value === '解除済') {
            record.社内起因待機解除日.value = date;
          }
       }

   
    //予定/履歴メモに何か入力されたとき、対応予定日or対応日になにも入力されていなければエラー。タスク担当者が入力されてなければエラー
      var hearingTtable = record.ヒアリング履歴テーブル.value 
       for (i = 0; i < hearingTtable.length; i++) {
          if(hearingTtable[i].value.履歴メモ.value) {
             if(!hearingTtable[i].value.対応予定日.value && !hearingTtable[i].value.対応日.value) {
                event.error = "[ヒアリング予定/履歴]に対応予定日or対応日を入力してください。";
             } 
             if(!hearingTtable[i].value.タスク担当者.value[0]) {
                event.error = "[ヒアリング予定/履歴]にタスク担当者を入力してください。";
             } 
          }
       }
       


     //施設のステータスを数える。    
       var facilityStatsNameList = ['施設作成件数','施設変更件数','削除件数'];
       var facilityStatsCounter = [];//それぞれのステータス数をカウント
       for(var i = 0; i < facilityStatsNameList.length; i++) {
          facilityStatsCounter.push(0);
       }

       for(var i = 0; i < record.施設情報テーブル.value.length; i++) {   
         if( record.施設情報テーブル.value[i].value.依頼ステータス_施設.value === '新規作成(掲載あり)' || record.施設情報テーブル.value[i].value.依頼ステータス_施設.value === '新規作成(掲載なし)') {
             facilityStatsCounter[0] += 1;//施設作成件数
         } else if( record.施設情報テーブル.value[i].value.依頼ステータス_施設.value === '変更') {
             facilityStatsCounter[1] += 1;//施設作成件数
         } else if( record.施設情報テーブル.value[i].value.依頼ステータス_施設.value === '施設削除') {
             facilityStatsCounter[2] += 1;//削除件数
         }
       }

       for(var i = 0; i < facilityStatsNameList.length; i++) {
         record[facilityStatsNameList[i]].value = facilityStatsCounter[i];
       }


    //業態ごとの登録数を数える
      var industryStatsNameList = ['新規作成(掲載なし)','追加掲載(施設登録なし)','新規作成(掲載あり)'];
      //↑新規作成(掲載なし)=_登録のみ 追加掲載(施設登録なし)=_掲載のみ 新規作成(掲載あり)=_登録・掲載
      var industryList = ['病院','診療所','歯科','代替','介護福祉','薬局','訪問看護','保育','その他'];//kintoneの並び順と同じ
      var industryStatsCounter =[];

      //各ステータスの業態別作成数をカウントするための配列
      for (var i = 0; i < industryStatsNameList.length; i++) {
         industryStatsCounter.push([]);
         for (var j = 0; j < industryList.length; j++) {
            industryStatsCounter[i].push(0);
         }	
       }

      //依頼情報テーブルの中から業態ごとの「新規作成(掲載なし)','追加掲載(施設登録なし)','新規作成(掲載あり)」ステータスを集計する関数
      function posting_counter (tableName,industryStatsName,facilityStyle){
          for( var i = 0; i < event.record[tableName].value.length; i++) {
            for( var j = 0; j < industryStatsNameList.length; j++){
              if(event.record[tableName].value[i].value[industryStatsName].value === industryStatsNameList[j]) {
                for( var k = 0; k < industryList.length; k++) {
                  if(event.record[tableName].value[i].value[facilityStyle].value === industryList[k]) {
                     industryStatsCounter[j][k] += 1;
                  }
                }
              }
            }
          }
       }

      //施設情報テーブルを集計
      posting_counter('施設情報テーブル','依頼ステータス_施設','施設形態_施設');

      //求人情報テーブルを集計
      posting_counter('求人情報テーブル','依頼ステータス_求人','施設形態_求人');

      //フィールドへ反映 
     var trailing_character = ['_登録のみ','_掲載のみ','_登録・掲載'];//industryStatsNameの並び順と同じ
     for (var i = 0; i < trailing_character.length; i++) {
         for (var j = 0; j < industryList.length; j++) {
            event.record[industryList[j] + trailing_character[i]].value = industryStatsCounter[i][j];
         }        
     }       

     return event;

   });

    //レコード編集画面が表示された時のイベント&レコード追加画面が表示された時のイベント------------------------------------- 
    kintone.events.on(['app.record.edit.show', 'app.record.create.show'], function (event) {
    // 「掲載完了日」「施設作成件数」「施設変更件数」「削除件数」フィールドの入力を制限
    event.record.掲載完了日.disabled = true;
    event.record.施設作成件数.disabled = true;
    event.record.施設変更件数.disabled = true;
    event.record.削除件数.disabled = true;

    //「業態_登録のみ」「業態_掲載のみ」「業態_登録・掲載」フィールドの入力を制限
    var industry = ['病院','診療所','歯科','代替','介護福祉','薬局','訪問看護','保育','その他'];
    var trailing_character = ['_登録のみ','_掲載のみ','_登録・掲載'];

    for (var i = 0; i < trailing_character.length; i++) {
      for (var j = 0; j < industry.length; j++) {
         event.record[industry[j] + trailing_character[i]].disabled = true;
       }         
    }
       


    return event;

   });
   

   
   
   })();
