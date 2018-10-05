(function() {
   "use strict";
   // レコード詳細画面が表示された時のイベント
   kintone.events.on('app.record.detail.show',function(event){
          
   console.log('テスト3');
   console.log(event);
      
   document.getElementsByClassName('gaia-argoui-app-menu-copy')[0].style.display = 'none';
      
   });

    // レコードが保存された時のイベント
    kintone.events.on(['app.record.create.submit', 'app.record.edit.submit'], function (event){

    var record = event.record;
    var postingdate = record.掲載切替日.value;
    record.掲載完了日.value = postingdate;
    
   var faxno = event.record.申込書FAXID.value;
   var tmpA = document.createElement('a');
   tmpA.href = 'https://operators.job-medley.com/received_faxes/?utf8=&idxcnt=' +  faxno;
   tmpA.innerHTML = 'faxno';
   tmpA.target = '_blank';
   
   faxno = tmpA;

   //kintone.app.record.getFieldElement('申込書FAXID').appendChild(tmpA);

    
       
     return event;
       
    });

      
    kintone.events.on(['app.record.edit.show', 'app.record.create.show'], function (event) {
    // 「掲載完了日」フィールドの入力を制限
        event.record.掲載完了日.disabled = true;

    return event;
     
     
     
   });
})();
