({
	submitRequest : function(component, event, helper) {
    	console.log('entered into method submit request');
        
        //set the action to apex controller
        var action = component.get("c.registerProductRequest");
        
        //set all the params of interest
        action.setParams({
            pricing : JSON.parse(component.find('checkboxPricing').get('v.value')),
            hunting : JSON.parse(component.find('checkboxHunting').get('v.value')),
            label : JSON.parse(component.find('checkboxLabel').get('v.value')),
            exportv : JSON.parse(component.find('checkboxExport').get('v.value')),
            description : (component.find('txtDescription').get('v.value') == undefined ? 'No further details added' : component.find('txtDescription').get('v.value')),
        });
        
        action.setCallback(this, function(response) {
            
            console.log('Entered into callback');
            
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                console.log('entered into success');
                
                //Hide the Modal Box component using the event OpenModalBox with att. false
                var cmpEventOpenModal = component.getEvent("cmpOpenModalBox");
                cmpEventOpenModal.setParams( {openModalBoxAtt : false} );
                cmpEventOpenModal.fire();
				
                //Show the Alert Success with a message using the event 
                var cmpEventShowAlertSuc = component.getEvent("cmpOpenAlertSuc");
                cmpEventShowAlertSuc.setParams( {openAlertSucAtt : true, msgAlertSucAtt : "Product request was sent successfuly. We'll be in touch in a moment"} );
                cmpEventShowAlertSuc.fire();
                
                //Reset the indicators of whether are there items to display, total items and current total price
                var cmpEventResetIndicators = component.getEvent("cmpResetIndicators");
                cmpEventResetIndicators.setParams( {noItemsToDisplayAtt : true, actualCartValueAtt : 0.0, countOfProductsAtt : 0} );
                cmpEventResetIndicators.fire();
    
                
            }else {
                console.log('entered into failure');
                console.log("Failed with state: " + state);
                component.set("v.openModalBox", false);
            }
            
        });
        $A.enqueueAction(action);  
      
    },
    
    closeModalWindow : function(component, event, helper) {
        //Hide the Modal Box component using the event OpenModalBox with att. false
        var cmpEventOpenModal = component.getEvent("cmpOpenModalBox");
        cmpEventOpenModal.setParams( {openModalBoxAtt : false} );
        cmpEventOpenModal.fire();
				
    },
})