({
	refreshCartDetails: function(component, actionName){
    	console.log('Entered to helper');
    
    	var action = component.get(actionName);
        action.setCallback(this, function(response) {
            
            console.log('entered to method helper');
            var state = response.getState();
            
            if (component.isValid() && state === "SUCCESS") {
    			console.log('success helper');
                component.set("v.actualCartValue", response.getReturnValue());
            
            }else {
    			console.log('failure helper');
                console.log("Failed with state: " + state);
            }
            
        });
        $A.enqueueAction(action);
    
	},
})