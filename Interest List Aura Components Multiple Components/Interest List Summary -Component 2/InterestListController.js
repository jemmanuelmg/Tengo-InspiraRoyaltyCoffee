({
    
    
	openModalWindow : function(component, event) {
      var cmpEvent = component.getEvent("cmpOpenModalBox");
      cmpEvent.setParams( {openModalBoxAtt : true} );  
      cmpEvent.fire();  
    },
    
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
                
                //update the list of current values, ni this case none 
                component.set("v.addedToCart", response.getReturnValue());
                
                //show the message 'no items to display'
                component.set("v.noItemsToDisplay", true);
                
                //Update the count of products and the total price to 0
                component.set("v.countOfProducts", 0);
                component.set("v.actualCartValue", 0.0);
                
                //Show a success alert
                component.set("v.openModalBox", false);
                component.set("v.showAlertSuc", true);
        		component.set("v.alertMessage", 'Product request registered succesfully. Review the state of your requests from the Product Requests page');
                
            }else {
                console.log('entered into failure');
                console.log("Failed with state: " + state);
                component.set("v.openModalBox", false);
            }
            
        });
        $A.enqueueAction(action);  
      
    },
})