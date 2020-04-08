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
    
    openModalWindow : function(component, event, helper) {
      // for Display Model,set the "isOpen" attribute to "true"
      component.set("v.openModalBox", true);
    },
    
    closeModalWindow : function(component, event, helper) {
      // for close Model,set the "isOpen" attribute to "false"
      component.set("v.openModalBox", false);
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
    
    updateProductQuantity : function(component, event, helper) {
        
    },
    
    
})