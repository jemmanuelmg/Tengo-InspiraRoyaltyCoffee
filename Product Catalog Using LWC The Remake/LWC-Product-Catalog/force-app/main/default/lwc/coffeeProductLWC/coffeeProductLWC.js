import { LightningElement, api, track, wire } from 'lwc';
import addProductToCart from '@salesforce/apex/productCatalogControllerLWC.addProductToCart';
import PRODUCT_IMAGE from '@salesforce/resourceUrl/TestProductImage';
/*External CSS, JS*/
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FontAwesome from '@salesforce/resourceUrl/FontAwesome';

export default class CoffeeProductLWC extends LightningElement {
    theProductImage = PRODUCT_IMAGE;

    @api productId;
    @api name;
    @api type;
    @api variety;
    @api quality;
    @api quantity;
    @api unitOfMeasure;
    @api price;
    @api product;
    @track alreadyAdded; 

    //Exeute actions as soon as the method renders in the screen
    renderedCallback() {

        Promise.all([
            loadStyle(this, FontAwesome + '/fontawesome-free-5.11.2-web/css/all.css')
        ])
        .then(() => {
            console.log('External resources loaded correctly (productCatalogLWC.js)');
        })
        .catch(error => {
            console.log('Error loading static resoruces (productCatalogLWC.js)');
            console.log(error.body.message);
        });
    }
    
    addProduct(event) {
        /* alert('Already added 1 ---> ' + this.alreadyAdded); */
        
        console.log('Entered to method addProduct() from coffeeProductLWC.js');
        console.log(this.productId);
        addProductToCart({ productId : this.productId })
        .then(result => {

            if(result == true){
                this.alreadyAdded = true;
            }

           console.log('Product added to interest list'); 
           const openAlertSuc =  new   CustomEvent('openalertsuc', {
                detail : {
                    openParam:true,
                    alertMsg:'Product correctly added to Interests List'
                }
            });
            this.dispatchEvent(openAlertSuc);

        })
        .catch(error => {
            console.log('Error from method addProduct() on coffeeProductLWC.js file');
            console.log(error);
        });
    }

    openModalBox(event){
        console.log('Entered to method openModalBox() from coffeeProductLWC.js');
        const openModalEvent =  new   CustomEvent('openmodal', {
            detail : {
                openParam:true,
                productParam:this.product
            }
        });
        this.dispatchEvent(openModalEvent);
    }

}