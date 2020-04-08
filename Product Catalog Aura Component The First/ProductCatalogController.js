({
    
	doInit : function(component, event, helper) {
        
        component.set("v.isLoading", true);
        //get the background url for putting in div
        var url = $A.get('$Resource.FondoJumbotron');
        component.set('v.backgroundImageURL', url);
        
        //Query all the products that are currently available at initializing
        //create the apex action to call
        var action = component.get("c.getInitProductList");
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.productList", response.getReturnValue());
                component.set("v.isLoading", false);
            
            }else {
                console.log("Failed with state: " + state);
                component.set("v.isLoading", false);
            }
            
        });
        $A.enqueueAction(action);
	
        
        //Populate the dependent picklists at initializing
        var controllingFieldAPI = component.get("v.controllingFieldAPI");
        var dependingFieldAPI = component.get("v.dependingFieldAPI");
        var objDetails = component.get("v.objDetail");
        helper.fetchPicklistValues(component,objDetails,controllingFieldAPI, dependingFieldAPI);
    },
    
    filterProducts : function(component, event, helper) { 
        
        console.log('Entered into method');
        component.set("v.isLoading", true);
        
        //create the apex action to call
        var action = component.get("c.getFilteredProductList");
        
        //before setting params, review the qualities sliders to see if there's a value
        var checkboxQuality = component.find('checkboxQuality').get('v.value');
        var qualityFromV = 0;
        var qualityToV = 0;
        
        if(checkboxQuality == false){ //if not checked means take in account this filter
            console.log("entered");
            qualityFromV = component.find('qualityFrom').get('v.value');
            qualityToV = component.find('qualityTo').get('v.value');
            
            if( parseInt(qualityToV, 10) < parseInt(qualityFromV,10) ){
                alert("The value 'quality to' must be greater than 'quality from'. Please check and try again");
            }
            
            qualityFromV=0;
            qualityToV=0;
            
        }
        
        //set all the params for this action
        action.setParams({
            myType : component.find('type').get('v.value'),
            variety : component.find('variety').get('v.value'),
            qualityFrom : (qualityFromV == undefined ? 0 : qualityFromV),
            qualityTo : (qualityToV == undefined ? 0 : qualityToV),
            quantity : ( component.find('quantity').get('v.value') == '' ? 0 : component.find('quantity').get('v.value') ),
            state : component.find('state').get('v.value'),
            province : component.find('province').get('v.value')
        });
       	
        action.setCallback(this, function(response) {
             
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                
                component.set("v.productList", response.getReturnValue());
                
                if(response.getReturnValue().length == 0){
                    component.set("v.noItemsToDisplay", true);
                }
                component.set("v.isLoading", false);
                
                console.log('valor seteado');
                console.log('valores registrados en consola');
                console.log(response.getReturnValue());
                
            
            }else {
                console.log("Failed with state: " + state);
                component.set("v.isLoading", false);
            }
                

        });
        $A.enqueueAction(action);
        
	
    },
    
    
    searchKeyWords : function(component, event, helper) { 
        
        component.set("v.isLoading", true);
        console.log('Entered into method');
        
        //create the apex action to call
        var action = component.get("c.executeSOSLProductQuery");
       	var keywordsV = component.find('searchBar').get('v.value');
        
        //set all the params for this action
        action.setParams({
            keywords : keywordsV
        });
        
        console.log(keywordsV);
        
        if(keywordsV && keywordsV !== ""){
            
            console.log("entered if");
       	
        action.setCallback(this, function(response) {
             
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                
                component.set("v.productList", response.getReturnValue());
                
                if(response.getReturnValue().length == 0){
                    component.set("v.noItemsToDisplay", true);
                }
                component.set("v.isLoading", false);
                
                console.log('valor seteado');
                console.log('valores registrados en consola');
                console.log(response.getReturnValue());
                
            
            }else {
                console.log("Failed with state: " + state);
                component.set("v.isLoading", false);
            }
                

        });
        $A.enqueueAction(action);
            
        }else{
            alert("Please enter some valid values before proceed.");
            
            console.log("entered else");
        }
        
	
    },
    
    
    addProduct : function(component, event, helper) {
        
        //show mini loading icon in button to feedback user that something is happening
        component.set("v.showMiniLoading", true);
        
        //Store the selected id of product
        var id = event.target.id;
        
        //create the apex action to call
        var action = component.get("c.addProductToCart");
        
        //set the product Id to the action call
        action.setParams({
            productId : id,
        });
        
        action.setCallback(this, function(response) {
             
           	console.log('Entered to method');
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                
                console.log('entered SUCCESS');
                
                if(response.getReturnValue().length > 0){
                	component.set("v.addedToCart", response.getReturnValue());
                    
                    component.set("v.showAlertSuc", true);
        			component.set("v.alertMessage", 'Product added to interests list successfully');
                    component.set("v.showMiniLoading", false);
                }else{
                    component.set("v.showAlertWar", true);  
                    component.set("v.alertMessage", 'This product already exists in interests list. You can select another product');
                    component.set("v.showMiniLoading", false);
                }
                
                console.log('changed values on addedTocart');
                
                //Now that everything has gone well, show the actual amount of products and total price to the user.
                //That is made throught a helper function, a function called from another function
                helper.refreshCartDetails(component, 'c.getTotalPriceCart');  
                
                
            }else {
                console.log("Failed with state: " + state);
                console.log('entered FAILURE');
            }
                

        });
        $A.enqueueAction(action);
        console.log('execution finished');
        component.set("v.openModalBox", false);
        component.set("v.showMiniLoading", false);
        
        
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
                console.log('changed values on addedTocart');
                
                //Now that everything has gone well, show the actual amount of products and total price to the user.
                //That is made throught a helper function, a function called from another function
                helper.refreshCartDetails(component, 'c.getTotalPriceCart');  
                
                
            }else {
                console.log("Failed with state: " + state);
                console.log('entered FAILURE');
            }
                

        });
        $A.enqueueAction(action);
        console.log('execution finished');    
        component.set("v.showAlertSuc", true);
        component.set("v.alertMessage", 'Product removed from cart successfully &nbsp; <i class="fas fa-shopping-cart white"></i>');
    },
    
    pickUpProduct : function(component, event, helper) {
        
        console.log('Entered into method pick up product');
        //open modal window
        component.set("v.openModalBox", true);
        
        //Store the selected id of product
        var id = event.target.id;
        
        //create the apex action to call
        var action = component.get("c.querySingleProduct");
        
        //set the product Id to the action call
        action.setParams({
            productId : id,
        });
        
        action.setCallback(this, function(response) {
             
           	console.log('Entered into callback');
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                
                console.log('entered SUCCESS');
                component.set("v.productPicked", response.getReturnValue());
                console.log('picked the product correctly');
                console.log('curr returned value is ---->' + response.getReturnValue());
                
                
            }else {
                console.log("Failed with state: " + state);
                console.log('entered FAILURE');
            }
                

        });
        $A.enqueueAction(action);
        console.log('execution finished');
        
        
        
    },
    
    openModalWindow : function(component, event, helper) {
      // for Display Model,set the "isOpen" attribute to "true"
      component.set("v.openModalBox", true);
    },
    
    closeModalWindow : function(component, event, helper) {
      // for close Model,set the "isOpen" attribute to "false"
      component.set("v.openModalBox", false);
    },
        
    closeAlertSuc : function(component, event, helper) {
      // for close Model,set the "isOpen" attribute to "false"
      component.set("v.showAlertSuc", false);
    },
    
    closeAlertWar : function(component, event, helper) {
      // for close Model,set the "isOpen" attribute to "false"
      component.set("v.showAlertWar", false);
    },

    
    changeQualityControls : function(component, event, helper) {
        
        var slider1 = component.find('qualityFrom');
        var slider2 = component.find('qualityTo');
        var checkboxQuality = component.find('checkboxQuality').get('v.value');
        
        if(checkboxQuality){
            slider1.set('v.disabled',true);
        	slider2.set('v.disabled',true);
        }else{
            slider1.set('v.disabled',false);
        	slider2.set('v.disabled',false);
        }
        
        
    },
    
    initSlickSlider: function(component, event, helper) {
		$(".vertical-center").slick({
            dots: true,
            centerMode: true,
        });
    },
    
    
    onControllerFieldChange: function(component, event, helper) {     
        var controllerValueKey = event.getSource().get("v.value"); // get selected controller field value
        var depnedentFieldMap = component.get("v.depnedentFieldMap");
        
        if (controllerValueKey != '--- None ---') {
            var ListOfDependentFields = depnedentFieldMap[controllerValueKey];
            
            if(ListOfDependentFields.length > 0){
                component.set("v.bDisabledDependentFld" , false);  
                helper.fetchDepValues(component, ListOfDependentFields);    
            }else{
                component.set("v.bDisabledDependentFld" , true); 
                component.set("v.listDependingValues", ['--- None ---']);
            }  
            
        } else {
            component.set("v.listDependingValues", ['--- None ---']);
            component.set("v.bDisabledDependentFld" , true);
        }
        
        /*Now that the values are set correctly, send a request and filter by this state        
        var a = component.get('c.filterProducts');
        $A.enqueueAction(a);*/
        
    },
})