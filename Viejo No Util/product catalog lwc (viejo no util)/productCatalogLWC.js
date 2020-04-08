import { LightningElement, api, track, wire } from 'lwc';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getInitProductList from '@salesforce/apex/productCatalogControllerLWC.getInitProductList';
import getFilteredProductList from '@salesforce/apex/productCatalogControllerLWC.getFilteredProductList';
import executeSOSLProductQuery from '@salesforce/apex/productCatalogControllerLWC.executeSOSLProductQuery';
import PRODUCT3_OBJECT from '@salesforce/schema/Product3__c';

export default class ProductCatalogLWC extends LightningElement {

    //dependent picklists variables
    @track controllingValues = [];
    @track dependentValues = [];
    @track selectedCountry;
    @track selectedState;
    @track isEmpty = false;
    @track error;
    controlValues;
    totalDependentValues = [];
    //Internal variables
    @track productList=[];
    @track productPicked=[];
    @track noItemsToDisplay;
    @track noItemsToDisplay;
    @track isLoading;
    @track showAlertSuc;
    @track showAlertWar;
    @track alertMessage;
    @track error;
    @track openModal;
    @track detailProduct;
    //Product filter variables
    @track type;
    @track variety;
    @track quality;
    @track quantity;
    @track unitOfMeasure;
    @track state;
    @track province;
    @track charsList;


    

    //Method to retrieve all the Products3 from salesforce at init
    @wire(getInitProductList, {})
    wiredGetProducts3({ error, data }) {
        if (error) {
            this.error = error;
            console.log(error);
        } else if (data) {
            this.productList = data;
            console.log('Products succesfully added at init');
        }
    }


    //Method to retrieve products who match the filters passed
    @wire(getFilteredProductList, {
        myType : '$type', 
        variety : '$variety', 
        quality : '$quality',
        quantity : '$quantity',
        unitOfMeasure : '$unitOfMeasure',
        state : '$state',
        province : '$province',
        charsList : '$charsList'
    })
    wiredFilteredProductList({ error, data }){
        console.log('Entered into wiredFilteredProductList() method');
        if (error) {
            this.error = error;
            console.log(error);
        } else if (data) {
            this.productList = data;
            console.log('Products successfuly fitered');
        }
    }

    //Get all the values from inputs and assign them
    //to be sent to the @wired filter method
    filterProducts(event){
        console.log('Entered into filterProducts() method');
        let type = this.template.querySelector(".cmp-in-type");
        this.type = (this.empty(type.value) ? 'all' : type.value);
        console.log('Done type with value ---> ' + this.type);

        let variety = this.template.querySelector(".cmp-in-variety");
        this.variety = (this.empty(variety.value) ? 'all' : variety.value);
        console.log('Done variety with value ---> ' + this.variety);

        let quality = this.template.querySelector(".cmp-in-quality");
        this.quality = (this.empty(quality.value)  ? 0 : quality.value);
        console.log('Done quality with value ---> ' + this.quality);

        let quantity = this.template.querySelector(".cmp-in-quantity");
        this.quantity = (this.empty(quantity.value) ? 0 : quantity.value);
        console.log('Done quantity with value ---> ' + this.quantity);

        let unitOfMeasure = this.template.querySelector(".cmp-in-unitOfMeasure");
        this.unitOfMeasure = (this.empty(unitOfMeasure.value) ? 'Kg' : unitOfMeasure.value);
        console.log('Done unitOfMeasure with value ---> ' + this.unitOfMeasure);

        let state = this.template.querySelector(".cmp-in-state");
        this.state = (this.empty(state.value) ? '' : state.value);
        console.log('Done state with value ---> ' + this.state);

        let province = this.template.querySelector(".cmp-in-province");
        this.province = (this.empty(province.value)  ? '' : province.value);
        console.log('Done province with value ---> ' + this.province);

        let rawValues = this.template.querySelector(".cmp-in-charsList");
        let charsList = "";
            for (let i in rawValues.value) {  
            charsList += rawValues.value[i] + ';';
        }
        this.charsList = charsList;
        console.log('Done charsList with value ---> ' + this.charsList);
        
    }

    searchKeyWords(event){
        console.log('Entered to method searchKeyWords() from productCatalogLWC.js');

        let keywordsParam = this.template.querySelector(".cmp-in-keywords");

        executeSOSLProductQuery({ keywords : keywordsParam.value })
        .then(result => {
            
            console.log('Products correctly filtered by keywords');  
            this.productList = result;
            
        })
        .catch(error => {
            console.log('Error from method searchKeyWords() on productCatalogLWC.js file');
            console.log(error);
        });
    }

    handleOpenModal(event){
        event.preventDefault();
        console.log('Entered to method handleOpenModal() from productCatalogLWC.js');
        
        this.openModal = event.detail.openParam;
        this.detailProduct = event.detail.productParam;


        console.log('The event received');
        console.log('-------');
        console.log(event.detail.openParam);

    }

    handleCloseModal(event){
        event.preventDefault();
        console.log('Entered to method handleCloseModal() from productCatalogLWC.js');
        this.openModal = event.detail;
    }


    get qualityOptions(){
        return [
            { label: 'All', value: 'all' },
            { label: '80', value: '80' },
            { label: '81', value: '81' },
            { label: '82', value: '82' },
            { label: '83', value: '83' },
            { label: '84', value: '84' },
            { label: '85', value: '85' },
            { label: '86', value: '86' },
            { label: '87', value: '87' },
            { label: '88', value: '88' },
            { label: '89', value: '89' },
            { label: '90', value: '90' },
            { label: '91', value: '91' },
            { label: '92', value: '92' },
            { label: '93', value: '93' },
            { label: '94', value: '94' },
            { label: '95', value: '95' },
            { label: '96', value: '96' },
            { label: '97', value: '97' },
            { label: '98', value: '98' },
            { label: '99', value: '99' },
            { label: '100', value: '100' }

        ];
    }

    get varietyOptions(){
        return [
            { label: 'All', value: 'all' },
            { label: 'Castillo', value: 'Castillo' },
            { label: 'Caturro', value: 'Caturro' },
            { label: 'Pajarito', value: 'Pajarito' },
            { label: 'Geisha', value: 'Geisha' },
            { label: 'Bourbon', value: 'Bourbon' }
        ];
    }

    get typeOptions(){
        return [
            { label: 'All', value: 'all' },
            { label: 'Green Coffee', value: 'Green Coffee' },
            { label: 'Roasted Coffee', value: 'Roasted Coffee' }
        ];
    }

    get unitsOptions(){
        return [
            { label: 'Kg', value: 'Kg' },
            { label: 'Gr', value: 'Gr' }
        ];
    }

    get characteristics(){
        return [
            { value: 'Bitter', label: 'Bitter' },
            { value: 'Sweet', label: 'Sweet' },
            { value: 'Silky Body', label: 'Silky Body' },
            { value: 'Citric Acidity', label: 'Citric Acidity' },
            { value: 'Floral Aroma', label: 'Floral Aroma' },
            { value: 'Caramel Aroma', label: 'Caramel Aroma' },
            { value: 'Almonds Aroma', label: 'Almonds Aroma' },
            { value: 'Balanced Flavor', label: 'Balanced Flavor' },
            { value: 'Chocolate Flavor', label: 'Chocolate Flavor' },
            { value: 'Honey Aroma', label: 'Honey Aroma' },
            { value: 'Caramel Flavor', label: 'Caramel Flavor' },
        ];
    }


    // Picklist values based on record type
    // Get metadata info of Product3__c object to get picklist values 
    @wire(getObjectInfo, { objectApiName: PRODUCT3_OBJECT })
    objectInfo;

    @wire(getPicklistValuesByRecordType, { objectApiName: PRODUCT3_OBJECT, recordTypeId: '$objectInfo.data.defaultRecordTypeId'})
    countryPicklistValues({error, data}) {
        if(data) {
            this.error = null;

            let countyOptions = [{label:'--None--', value:'--None--'}];

            // Account Country Control Field Picklist values
            data.picklistFieldValues.State__c.values.forEach(key => {
                countyOptions.push({
                    label : key.label,
                    value: key.value
                })
            });

            this.controllingValues = countyOptions;

            let stateOptions = [{label:'--None--', value:'--None--'}];

             // Account State Control Field Picklist values
            this.controlValues = data.picklistFieldValues.Province__c.controllerValues;
            // Account State dependent Field Picklist values
            this.totalDependentValues = data.picklistFieldValues.Province__c.values;

            this.totalDependentValues.forEach(key => {
                stateOptions.push({
                    label : key.label,
                    value: key.value
                })
            });

            this.dependentValues = stateOptions;
        }
        else if(error) {
            this.error = JSON.stringify(error);
        }
    }

    handleCountryChange(event) {
        // Selected Country Value
        this.selectedCountry = event.target.value;
        this.isEmpty = false;
        let dependValues = [];

        if(this.selectedCountry) {
            // if Selected country is none returns nothing
            if(this.selectedCountry === '--None--') {
                this.isEmpty = true;
                dependValues = [{label:'--None--', value:'--None--'}];
                this.selectedCountry = null;
                this.selectedState = null;
                return;
            }

            // filter the total dependent values based on selected country value 
            this.totalDependentValues.forEach(conValues => {
                if(conValues.validFor[0] === this.controlValues[this.selectedCountry]) {
                    dependValues.push({
                        label: conValues.label,
                        value: conValues.value
                    })
                }
            })

            this.dependentValues = dependValues;
        }
    }

    handleStateChange(event) {
        this.selectedState = event.target.value;
    }

    empty(data){
        let count = 0; 
        let i;   
        if(typeof(data) == 'number' || typeof(data) == 'boolean')
        { 
            return false; 
        }
        if(typeof(data) == 'undefined' || data === null)
        {
            return true; 
        }
        if(typeof(data.length) != 'undefined')
        {
            return data.length === 0;
        }
        
        for(i in data)
        {
            if(data.hasOwnProperty(i))
            {
            count ++;
            }
        }
        return count === 0;
    }

}