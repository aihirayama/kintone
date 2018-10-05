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
           tmpA.innerHTML = ' ⇗';
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
           clienttmpA.innerHTML = ' ⇗';
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

    /*
    施設作成件数→新規作成
    施設変更件数→既存修正
    施設削除→応募受付終了処理・求人削除
    */
    //施設作成
    var newFacilities = 0;
    //施設変更
    var updateFacilities = 0;
    //施設削除
    var deleteFacilities = 0;
    
    var tableRecords = record.施設情報テーブル.value;
    
    //集計した依頼ステータスの振り分け
    for (var i = 0; i < tableRecords.length; i++) {
    
    	if( tableRecords[i].value.依頼ステータス_施設.value === '新規作成') {
      		newFacilities += 1;
    	}
      
      if( tableRecords[i].value.依頼ステータス_施設.value === '既存修正') {
      		updateFacilities += 1;
    	}
      
      if( tableRecords[i].value.依頼ステータス_施設.value === '応募受付終了処理・求人削除') {
      		deleteFacilities += 1;
    	}
    
    }
    
    record.施設作成件数.value = newFacilities;
    record.施設変更件数.value = updateFacilities;
    record.削除件数.value = deleteFacilities;

       
     return event;
       
    });

      
    kintone.events.on(['app.record.edit.show', 'app.record.create.show'], function (event) {
    // 「掲載完了日」フィールドの入力を制限
    event.record.掲載完了日.disabled = true;
        
    return event;
     
     
     
   });
})();
