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
     
　 //施設IDのリンク作成
   var facilitiesId = event.record.施設ID.value;
   if (facilitiesId === "") {
       return;
       } else {
           var facilitiestmpA = document.createElement('a');
           facilitiestmpA.href = 'https://operators.job-medley.com/facilities?customerId=' +  clientId;
           facilitiestmpA.innerHTML = ' ⇗';
           facilitiestmpA.target = '_blank';
           kintone.app.record.getFieldElement('施設ID').appendChild(facilitiestmpA);
       }

　 //求人IDのリンク作成
   var joId = event.record.求人ID.value;
   if (joId === "") {
       return;
       } else {
           var jotmpA = document.createElement('a');
           jotmpA.href = 'https://operators.job-medley.com/job_offer/' +  clientId + '/confirmation/';
           jotmpA.innerHTML = ' ⇗';
           jotmpA.target = '_blank';
           kintone.app.record.getFieldElement('求人ID').appendChild(joId);
       }
      
   });

    // レコードが保存された時のイベント
    kintone.events.on(['app.record.create.submit', 'app.record.edit.submit'], function (event){

    var record = event.record;
    var postingdate = record.掲載切替日.value;
    record.掲載完了日.value = postingdate;
       
     return event;
       
    });

      
    kintone.events.on(['app.record.edit.show', 'app.record.create.show'], function (event) {
    // 「掲載完了日」フィールドの入力を制限
    event.record.掲載完了日.disabled = true;
        
    return event;
     
     
     
   });
})();
