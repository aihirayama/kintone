(function() {
   "use strict";
   // レコード詳細画面が表示された時のイベント
   kintone.events.on('app.record.detail.show',function(event){
          
   console.log('テスト3');
   console.log(event);
      
   document.getElementsByClassName('gaia-argoui-app-menu-copy')[0].style.display = 'none';
   
   //fax受信画面のリンク作成   
   var faxNo = event.record.申込書FAXID.value;
   if (faxNo === "") {
       return;
       } else {
           var tmpA = document.createElement('a');
           tmpA.href = 'https://operators.job-medley.com/received_faxes/?utf8=&idxcnt=' +  faxNo;
           tmpA.innerHTML = ' 🐰';
           tmpA.style.fontSize = '3px';
           tmpA.target = '_blank';
           kintone.app.record.getFieldElement('申込書FAXID').appendChild(tmpA);
       }
    
    //顧客IDのリンク作成
   var clientId = event.record.顧客ID.value;
   if (clientId === "") {
       return;
       } else {
           var clienttmpA = document.createElement('a');
           clienttmpA.href = 'https://operators.job-medley.com/facilities?customerId=' +  clientId;
           clienttmpA.innerHTML = ' 🐰';
           clienttmpA.style.fontSize = '3px';
           clienttmpA.target = '_blank';
           kintone.app.record.getFieldElement('顧客ID').appendChild(clienttmpA);
       }
      
   });

    // レコードが保存された時のイベント
    kintone.events.on(['app.record.create.submit', 'app.record.edit.submit'], function (event){

    var record = event.record;
    var postingdate = record.掲載切替日.value;
    record.掲載完了日.value = postingdate;
       
       
    //施設追加のステータスを数える。    
    var newFacilities = 0;//施設作成
    var updateFacilities = 0;//変更
    var deleteFacilities = 0;//施設削除
    var faciltableRecords = record.施設情報テーブル.value;

    for (var i = 0; i < faciltableRecords.length; i++) {   
    	if( faciltableRecords[i].value.依頼ステータス_施設.value === '新規作成(掲載あり)' || faciltableRecords[i].value.依頼ステータス_施設.value === '新規作成(掲載なし)') {
      	newFacilities += 1;
    	}     
      if( faciltableRecords[i].value.依頼ステータス_施設.value === '変更') {
      	updateFacilities += 1;
    	}
      if( faciltableRecords[i].value.依頼ステータス_施設.value === '施設削除') {
      	deleteFacilities += 1;
    	}
    }
   
    record.施設作成件数.value = newFacilities;
    record.施設変更件数.value = updateFacilities;
    record.削除件数.value = deleteFacilities;
       
       
     //----------------テスト------------------------------
     //Industry[0病院,1診療所,2歯科,3代替,4介護福祉,5薬局,6訪問看護,7保育,8その他]

      //カウント用
      var industry = ['病院','診療所','歯科','代替','介護福祉','薬局','訪問看護','保育','その他'];
      var industryCounter = [0,0,0,0,0,0,0,0,0];


      //リセット
      //IndustryCounter = [0,0,0,0,0,0,0,0,0];

      //テーブルレコードをループさせる→ステータスif→業態チェックのifをループ→格納のループ

      //登録のみ
      for( var i = 0; i < faciltableRecords.length; i++) { //レコード全権確認
          if(faciltableRecords[i].value.依頼ステータス_施設.value === '新規作成(掲載なし)') {
              for( var j = 0; j < industry.length; j++) {
                  if(faciltableRecords[j].value.施設形態.value === industry[j]) {
                      industryCounter[j] += 1;
                  }
              }
          } 
      }
      console.log(industryCounter);
       
      //フィールドに表示
      for (var i = 0; i < faciltableRecords.length; i++) {
         //var field = industry[i] + '_登録のみ';
         //record.field.value = industryCounter[i];
         record.病院_登録のみ.value = industryCounter[i];
      }
//-------------------------テスト--------------------------------
       
    return event;
       
    });

      
    kintone.events.on(['app.record.edit.show', 'app.record.create.show'], function (event) {
    // 「掲載完了日」フィールドの入力を制限
    event.record.掲載完了日.disabled = true;
        
    return event;
     
     
     
   });
})();
