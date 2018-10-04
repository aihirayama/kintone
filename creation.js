(function() {
   "use strict";
   kintone.events.on('app.record.detail.show',function(event){
          
   console.log('テスト3');
   console.log(event);
   
   var record = event.record
      
   var postingdate = record['掲載切替日'].value;
   
   record['掲載完了日'].value = postingdate;
   

   
      
    kintone.events.on(['app.record.edit.show', 'app.record.create.show'], function (event) {
    // 「掲載完了日」フィールドの入力を制限
        event.record['掲載完了日'].disabled = true;

    return event;
     
     
     
   });
})();


