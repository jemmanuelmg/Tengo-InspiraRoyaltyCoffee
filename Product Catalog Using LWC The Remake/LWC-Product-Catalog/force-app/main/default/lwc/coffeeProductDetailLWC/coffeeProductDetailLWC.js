import { LightningElement, api, track, wire } from 'lwc';
import addProductToCart from '@salesforce/apex/productCatalogControllerLWC.addProductToCart';

export default class CoffeeProductDetailLWC extends LightningElement {
    @api detailProduct;

    closeModal(event){
        console.log('Entered into method closeModal() of coffeeProductDetail.js');
        const closeModalEvent =  new   CustomEvent('closemodal', {
            detail : false
        });
        this.dispatchEvent(closeModalEvent);
    }

    addProduct(event) {
        console.log('Entered to method addProduct() from coffeeProductDetail.js');
        addProductToCart({ id : this.detailProduct.Id })
        .then(result => {
            if(result === true){
                alert('The product was correctly added to your interest list');
            }else{
                alert('You already have this product in your interests list');
            }
        })
        .catch(error => {
            console.log('Error from method addProduct() on coffeeProductLWC.js file');
            console.log(error);
        });
        this.closeModal();
    }

}