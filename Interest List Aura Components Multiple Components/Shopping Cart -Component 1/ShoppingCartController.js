({
	doInit : function(component, event, helper) {
        console.log('entered into method init');
        
        //get the background url for putting in div
        var url = $A.get('$Resource.FondoJumbotron2');
        component.set('v.backgroundImageURL', url);
        
        var action = component.get("c.getAddedToCartItems");
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                console.log('entered into success');
                component.set("v.addedToCart", response.getReturnValue());
                
                if(response.getReturnValue().length <= 0){
                    component.set("v.noItemsToDisplay", true);
                }else{
                    component.set("v.noItemsToDisplay", false);
                }
                
                console.log(response.getReturnValue());
                component.set("v.countOfProducts", response.getReturnValue().length);
                
                helper.refreshCartDetails(component, 'c.getTotalPriceCart');
            
            }else {
                console.log('entered into failure');
                console.log("Failed with state: " + state);
            }
            
        });
        $A.enqueueAction(action);
    },
    
    removeProduct : function(component, event, helper) {
     	//Store the selected id of product
        var id = event.target.id;
        
        //create the apex action to call
        var action = component.get("c.removeProductFromCart");
        
        //set the product Id to the action call
        action.setParams({
            productId : id,
        });
        
        action.setCallback(this, function(response) {
             
           	console.log('Entered to method');
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                
                console.log('entered SUCCESS');
                
                component.set("v.addedToCart", response.getReturnValue());
                component.set("v.showAlertSuc", true);
                component.set("v.alertMessage", "Product removed successfully");
                
                console.log('changed values on addedTocart');
                
                component.set("v.countOfProducts", response.getReturnValue().length)
                helper.refreshCartDetails(component, 'c.getTotalPriceCart');
                
                //Now that everything has gone well, show the actual amount of products and total price to the user.
                //That is made throught a helper function, a function called from another function
                 
                
                
            }else {
                console.log("Failed with state: " + state);
                console.log('entered FAILURE');
            }
                

        });
        $A.enqueueAction(action);
        console.log('execution finished');    
        component.set("v.showAlertSuc", true);
        component.set("v.alertMessage", 'Product removed from interests list successfully');
    },
    
    closeAlertSuc : function(component, event, helper) {
      // for close Model,set the "isOpen" attribute to "false"
      component.set("v.showAlertSuc", false);
    },
    
    closeAlertWar : function(component, event, helper) {
      // for close Model,set the "isOpen" attribute to "false"
      component.set("v.showAlertWar", false);
    },
    
    handleOpenModalBox : function(component, event) {
      var eventParam1 = event.getParam("openModalBoxAtt"); //this can be a true or false
      component.set("v.openModalBox", eventParam1);
    },
    
    handleOpenAlertSuc : function(component, event) {
      var eventParam1 = event.getParam("openAlertSucAtt"); //this can be a true or false
      var eventParam2 = event.getParam("msgAlertSucAtt"); //this is the message of the alert
      component.set("v.alertMessage", eventParam2);  
      component.set("v.showAlertSuc", eventParam1);
    },
    
    handleResetIndicators : function(component, event) {
      var eventParam1 = event.getParam("noItemsToDisplayAtt"); //this can be a true or false
      var eventParam2 = event.getParam("actualCartValueAtt"); //this is the message of the alert
      var eventParam3 = event.getParam("msgAlertSucAtt"); //this is the message of the alert
      console.log('param1 ---> ' + eventParam1);
      console.log('param2 ---> ' + eventParam2); 
      console.log('param3 ---> ' + eventParam3);  
      component.set("v.noItemsToDisplay", eventParam1);
      component.set("v.actualCartValue", eventParam2);
      component.set("v.countOfProducts", eventParam3); 
    },
    
    
    updateProductQuantity : function(component, event, helper) {
        
    },
    
    
})