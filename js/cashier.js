// Comments   
export default function() {

  // Set up global scope, arguments, and screen history
  let globals = {};
  let programArguments = arguments;
  let screenHistory = ["cashierscreen"];

  // Define routines
  let logic = {

    "start": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Call Weather API
      var parms = {};
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("weather.module.json");
        _results = pjsModule["weather"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var weatherData = _results ? _results["OutputData"] : null;

      // 3. Set Weather Data 
      
      /*
        This module assigns weather data to screen fields, fetched in previous step
      */
      
      try{
        cashierscreen["weather_temp"]=weatherData["current"]["temp_f"] + "°F";
        cashierscreen["weather_percent"]=weatherData["current"]["humidity"];
        cashierscreen["weather_text"]= weatherData["current"]["condition"]["text"];
        cashierscreen["weather_icon"]="https:"+weatherData["current"]["condition"]["icon"];
      }catch(err){
        cashierscreen["weather_temp"]=weatherData[0]["temperature"] + "°F";
        cashierscreen["weather_percent"]=weatherData[0]["humidity"];
        cashierscreen["weather_text"]= weatherData[0]["description"];
        cashierscreen["weather_icon"]="https:"+weatherData[0]["iconlink"];
      }
      let date = pjs.date();
      let newDate = pjs.char(date, "*usa");
      
      cashierscreen["current_date"]=newDate;
      cashierscreen["weather_city"] = pjs.session["city"];

      // 4. Today's Transactions
      logic["Refresh Today's Transaction"]();

      // 5. Load Today's Transactions
      // 
      // /*
      //   This step will load Today's Transactions on Grids
      //   Grids will be populated on all screens with latest data of today's transactions
      // */
      // var _success = false;
      // var _error = null;
      // 
      // var _records = null;
      // try {
      //   var query = "SELECT  TRANSACTIONSHEADER.TXHDRKEY,TRANSACTIONSHEADER.LOCALTS1 as localtimestamp,CORPORATECUSTOMERS.companynm,TRANSACTIONSHEADER.status,TRANSACTIONSHEADER.invoicenbr,TRANSACTIONSHEADER.ordertotal$,TRANSACTIONSHEADER.discountedtotal$ "+
      //               "FROM TRANSACTIONSHEADER INNER JOIN CORPORATECUSTOMERS ON TRANSACTIONSHEADER.CORPORATECUSTOMERSKEY = CORPORATECUSTOMERS.CORPCUSTKEY "+
      //               "WHERE DATE(LOCALTS1) = ? AND TRANSACTIONSHEADER.SOFTDELETE is null  AND LOCATIONSKEY = ? ORDER BY TRANSACTIONSHEADER.LOCALTS1 DESC";
      //   var _records = pjs.query(query, [clientTime, pjs.session["locationsKey"]])
      //   _success = true;
      // }
      // catch (err) {
      //   _records = [];
      //   _error = err;
      // }
      // _records = _records.map((rec)=>{
      //   return {
      //     ...rec,
      //     emailIconVisible: rec['status'] == 'Sale' ? true : false
      //   }
      // })
      // for(let rec of _records){
      //   if(rec['status'] == 'Sale'){
      //     rec['printReceiptIconVisible'] = true;
      //     break;
      //   }
      // }
      // display.transactions.replaceRecords(_records);
      // display.shift_transactions.replaceRecords(_records)
      // display.company_transactions.replaceRecords(_records);
      // display.payment_transactions.replaceRecords(_records);
      // display.transactions_grid.replaceRecords(_records);

      // 6. Company default settings
      /*
        Default settings for all fields on screen
        Also sets default settings for variables related to flow control, discounts, specific to customers
       */
      
      
      cashierscreen["customer_selected"]=false;
      cashierscreen["customer_not_selected"]=true;
      cashierscreen["purchase_text"]="Check Out";
      cashierscreen["save_Disabled"]=true;
      cashierscreen["custom_disabled"]=false;
      cashierscreen['custom_visible'] = true
      
      cashierscreen["couponVisible"]=false;
      cashierscreen["scrubVisible"]=false;
      cashierscreen["product_filter_disabled"] = true;
      cashierscreen["product_search_disabled"] = true;
      cashierscreen['category'] = ''
      cashierscreen["company_info_focus_on"] = "customer-company";
      cashierscreen["checkoutDisabled"] = true;
      cashierscreen["driverInfoKey"] = ""
      cashierscreen['taxLabel'] = `Tax (${pjs.session['locationTaxRate']}) :`
      
      //Hidden Fields to support if option not selected in autocomplete
      cashierscreen["tractor_number_value"] = "";
      cashierscreen["trailer_number_value"] = "";
      cashierscreen["tractor_number_value_visible"] = false;
      cashierscreen["trailer_number_value_visible"] = false;
      cashierscreen["popularwashDisabled"] = true
      
      //Flag TX
      cashierscreen["flag_tx_loaded_from_db"] = false;
      
      //Required items
      cashierscreen["req_items"] = ""
      cashierscreen["po_required"] = false
      cashierscreen["tripNumber_required"] = false
      cashierscreen["driverId_required"] = false
      required_fields["ponum"] = ""
      required_fields["tripnum"] = ""
      required_fields["drvid"] = ""
      cashierscreen["has_requirements"] = false
      
      //Scrub Club 
      
      cashierscreen["scrubApply"] = {}
      
      //additionalItems
      cashierscreen["additionalItems"] = []
      
      cashierscreen["selected_popular_wash"]=null;
      
      
      //payment receipts
      paymentscreen['receiptHTML'] = null
      paymentscreen['scrubClubHTML'] = null
      
      paymentscreen['splitPaymentActive'] = 'Inactive'
      paymentscreen['splitPaymentComplete'] = ''
      paymentscreen['splitPaymentType'] = ''
      paymentscreen['splitPaymentTerminalResponse'] = ''
      paymentscreen['splitPaymentTerminalReceipts'] = ''
      paymentscreen['splitReceiptHTML'] = ''
      paymentscreen['splitScrubClubHTML'] = ''
      paymentscreen['splitCaptured'] = ''
      paymentscreen['splitTotal'] = ''
      paymentscreen['splitBalance'] = ''
      paymentscreen['payment_amount'] = ''
      
      cashierscreen['customerNotesVisible'] = false
      
      coupon['coupon_amount'] = ''
      
      
      //Search feilds
      companies["csearch"] = ""
      cashierscreen['psearch'] = ''
      cashierscreen['tsearch'] = ''
      
      //CCS classes for required fields
      
      cashierscreen['comp_name_css'] = 'tom-input'
      cashierscreen['tractor_number_css'] = 'tom-input'
      cashierscreen['trailer_number_css'] = 'tom-input'
      
      cashierscreen['drvfnamecss'] = 'tom-input'
      cashierscreen['drvlnamecss'] = 'tom-input'
      cashierscreen['drveaddresscss'] = 'tom-input'
      cashierscreen['drvphonecss'] = 'tom-input'
      cashierscreen['drvtruckcss'] = 'tom-input'
      cashierscreen['drvtrailercss'] = 'tom-input'
      
      required_fields['ponumcss'] = 'tom-input'
      required_fields['drvidcss'] = 'tom-input'
      required_fields['tripnumcss'] = 'tom-input'
      
      //Set scroll for Products
      
      cashierscreen['productsActiveRecord'] = 0
      
      //Driver refused checkbox
      cashierscreen['driverRefused'] = false
      cashierscreen['driverRefusedDisabled'] = false
      
      //Track if reasons inserted for modified price
      cashierscreen['modifiedPriceSpecials'] = []

      // 7. Set Timeout
      /*
        Sets screen fields for client side scripts to implement Timeout feature (Auto Logoff)
      */
      
      Object.assign(cashierscreen, {
        "cashier_timeout": pjs.session["cashierTimeout"]
      });
      
      Object.assign(view_transaction, {
        "cashier_timeout": pjs.session["cashierTimeout"]
      });
      
      Object.assign(companies, {
        "cashier_timeout": pjs.session["cashierTimeout"]
      });
      
      Object.assign(cashierscreen_shiftsales, {
        "cashier_timeout": pjs.session["cashierTimeout"]
      });
      
      Object.assign(paymentscreen, {
        "cashier_timeout": pjs.session["cashierTimeout"]
      });
    },

    "Save Driver": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Validation
      
      /*
        Server side validation check for Driver related screen fields. 
        Validation given for each block
        will display message and return if any of required validation fails. 
      */
      
      
      //Validate that Company name is not null so we can associate driver with company - remember if walk in customer company name = 'Independent Driver'
      if(cashierscreen["comp_name"] == "" || cashierscreen["comp_name"] == undefined){
        pjs.messageBox({
          title: "",
          message: "Enter Customer Name"
        })
        cashierscreen['comp_name_css'] = 'tom-input-error'
        return
      }
      
      //Tractor number is not null if customer requires Tractor Validation - Associates truck with driver. 
      if((cashierscreen["tractor_number"] == "" ||cashierscreen["tractor_number"] == undefined) && cashierscreen["validateTruck"]){
        pjs.messageBox({
          title: "",
          message: "Tractor Number is required to be validated first for this customer"
        })
        cashierscreen['tractor_number_css'] = 'tom-input-error'
        return
      }
      
      //Trailer number is not null if customer requires trailer validation - assoicates trailer with driver
      if((cashierscreen["trailer_number"] == "" ||cashierscreen["trailer_number"] == undefined) && cashierscreen["validateTrailer"]){
        pjs.messageBox({
          title: "",
          message: "Trailer Number is required to be validated first for this customer"
        })
        cashierscreen['trailer_number_css'] = 'tom-input-error'
        return
      }
      
      // First name of driver is not null
      if(cashierscreen["drvfname"] == "" || cashierscreen["drvfname"] == undefined){
        pjs.messageBox({
          title: "",
          message: "Driver Firstname cannot be empty"
        })
        cashierscreen['drvfnamecss'] = 'tom-input-error'
        return
      }
      
      //Last name of driver is not null
      if(cashierscreen["drvlname"] == "" || cashierscreen['drvlname'] == undefined){
        pjs.messageBox({
          title: "",
          message: "Driver Lastname cannot be empty"
        })
        cashierscreen['drvlnamecss'] = 'tom-input-error'
        return
      }
      
      //Phone number is not null, if not null also verifies a valid phone number
      if(cashierscreen["drvphone"] != "" && cashierscreen['drvphone'] != undefined){
        if(cashierscreen["drvphone"].toString().replace(/\D+/g, '').length < 10){
          pjs.messageBox({
            title: "",
            message: "Driver Phone is invalid"
          })
          return
        }
      }
      
      //Validates email address
      if(cashierscreen["drveaddress"] != "" && !utility.validateEmail(cashierscreen['drveaddress']) && cashierscreen['drveaddress'] != 'rejected'){
        pjs.messageBox({
          title: "",
          message: "Driver Email is invalid"
        })
        return
      
      }

      // 3. Save/Update Driver
      /*
        Saves a driver in the database. 
      */
      
      //hidden field on screen Determines if the driver was loaded from database and needs to update rather than insert
      if(cashierscreen["driverInfoKey"] != ""){
        //update
        try{
          var query = "UPDATE DRIVERS SET firstname = ?, lastname = ?, phonenbr = ?, emailaddress = ? WHERE driverskey = ?";
          var values = [
                          cashierscreen["drvfname"], 
                          cashierscreen["drvlname"], 
                        ]
          //Defaults to zeros if phone number not entered
          if(cashierscreen["drvphone"] == "")
            values.push("0000000000")
          else {
            let replaced = cashierscreen["drvphone"].toString().replace(/\D+/g, '')
            values.push(replaced)
          }
      
          //Defaults to rejected if email address not entered
          if(cashierscreen["drveaddress"] == "")
            values.push("rejected")
          else 
            values.push(cashierscreen["drveaddress"])
      
          values.push(cashierscreen["driverInfoKey"])
          var _result = pjs.query(query, values)
      
          pjs.messageBox({
            title: "",
            message: "Driver Info has been updated successfully."
          })
          cashierscreen['drvfnamecss'] = 'tom-input'
          cashierscreen['drvlnamecss'] = 'tom-input'
        }
        catch(e){
          pjs.messageBox({
            title: "",
            message: "Error occurred while updating info."
          })
        }
      }
      else{ // Inserts a new Driver if not loaded from DB
        try{
          //Insert/Associate new
          var messageMeta = ". Corporate Customer: "+cashierscreen["company_name_value"]
          var columns = "corpcustkey, firstname, lastname, trucknbr, trailernbr"
          var options = "?,?,?,?,?"
          var values = [
                          cashierscreen["comp_name"], 
                          cashierscreen["drvfname"], 
                          cashierscreen["drvlname"], 
                          cashierscreen['tractor_number_value'],
                          cashierscreen['trailer_number_value']
                        ]
      
          columns += ",phonenbr"
          options += ",?"
          //Defaults to zeros, if phone not entered
          if(cashierscreen["drvphone"] == "")
            values.push("0000000000")
          else {
            let replaced = cashierscreen["drvphone"].toString().replace(/\D+/g, '')
            values.push(replaced)
          }
      
          columns += ",emailaddress"
          options += ",?"
          //Defaults to rejected if email address not entered
          if(cashierscreen["drveaddress"] == "")
            values.push("rejected")
          else 
            values.push(cashierscreen["drveaddress"])
      
          //if tractor number is entered, Associates
          if(cashierscreen["tractor_number"] != ""){
            columns += ", corptruckkey"
            options += ", ?"
            values.push(cashierscreen["tractor_number"])
            messageMeta += ". Truck associated : "+cashierscreen["tractor_number_value"]
          }  
      
          //if trailer number entered, Associates
          if(cashierscreen["trailer_number"] != ""){
            columns += ", corptrailerkey"
            options += ", ?"
            values.push(cashierscreen["trailer_number"])
            messageMeta += ". Trailer associated : "+cashierscreen["trailer_number_value"]
          }  
      
          var query = "SELECT driverskey FROM NEW TABLE "+
                      "(INSERT INTO DRIVERS("+columns+") "+
                      "VALUES("+options+"))"
          _result = pjs.query(query, values) 
              
          cashierscreen["driverInfoKey"] = _result[0]["driverskey"]
          
          //In case the transaction was saved and then opened and then new driver was inserted - Associates Driver to transaction - Almost no case will happen, as Save Transaction has validation for driver not empty 
          if(cashierscreen["flag_tx_loaded_from_db"]){
            var query = "UPDATE TRANSACTIONSHEADER SET DRIVERSKEY = ? WHERE TXHDRKEY = ?"
            var _result = pjs.query(query, [_result[0]["driverskey"], cashierscreen["flag_tx_loaded_from_db_id"]])
            messageMeta += ". Associated with transaction "+cashierscreen["flag_tx_loaded_from_db_id"]
          }   
          pjs.messageBox({
            title: "",
            message: "Driver has been saved successfully "+messageMeta
          })
          cashierscreen['drvfnamecss'] = 'tom-input'
          cashierscreen['drvlnamecss'] = 'tom-input'
        }
        catch (e){
          //Error occured while saving new driver
          console.log('error',e)
        }
      }
    },

    "Change Tractor": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. If Tractor not entered
      if (!cashierscreen["tractor_number_value"] || cashierscreen["tractor_number_value"] == '0') {

        // 3. clear options
        cashierscreen['tractorOptions'] = []

        // 4. Stop
        return;
      }

      // 5. No Customer?
      if (!cashierscreen["comp_name"] || cashierscreen["comp_name"] == '0') {

        // 6. Display Error
        pjs.messageBox({
          title: "",
          message: "Customer Must be entered"
        })
        return
      }

      // 7. Check if Tractor Requires Validation
      /*
        this step identifies if Tractor number requires validation - Should exist in DB and must be associated with customer. 
        Searches for Tractor in db against entered value. 
      */
      cashierscreen["tractor_number_value_visible"] = false
      var truckFoundInDB = false
      
      //Truck requires validationg
      if(cashierscreen["validateTruck"] == true){
        //Truck not selected from auto complete or left empty
        if(cashierscreen["tractor_number"] == ""){
          //Truck field was not entered 
          if(cashierscreen["tractor_number_value"] == ""){
            pjs.messageBox({
              title: ``,
              message: `Tractor is required to be validated for this customer`
            });
          }
          //Truck not selected from auto complete but was entered 
          else{
            var query = "SELECT CTRUCKSKEY FROM CORPORATETRUCKS WHERE CORPORATECUSTOMERSKEY = ? AND UCASE(TRUCKNUMBER) = ?";
            var truck = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["tractor_number_value"].toString().toUpperCase()])
      
            //Truck found in Db with Truck number
            if(Object.keys(truck).length != 0){
              cashierscreen["tractor_number"] = truck[0]["ctruckskey"]
              var truckFoundInDB = true
            }
            //Truck not found in DB
            else{
              pjs.messageBox({
                title: '',
                message: 'Tractor number '+cashierscreen["tractor_number_value"]+" is not valid for customer "+cashierscreen["company_name_value"]
              })
              return
            }
          }
        }
        else{
          //Tractor selected from auto complete
        }
      }
      else{
        //tractor is not required to validate
        var query = "SELECT CTRUCKSKEY FROM CORPORATETRUCKS WHERE CORPORATECUSTOMERSKEY = ? AND UCASE(TRUCKNUMBER) = ?";
        var truck = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["tractor_number_value"].toString().toUpperCase()])
        //Truck found in Db with Truck number
        if(Object.keys(truck).length != 0){
          cashierscreen["tractor_number"] = truck[0]["ctruckskey"]
          var truckFoundInDB = true
        }
        //Truck not found in DB
        else{
          cashierscreen["tractor_number_value_visible"] = true
          cashierscreen["tractor_number"] = ""
        }
      
      }
      
      //Shift focus
      cashierscreen["company_info_focus_on"] = "customer-trailer"

      // 8. Fetch Driver
      /*
        Try to fetch driver information from DB if associated, with tractor number
      */
      
      if(!cashierscreen["validateTrailer"] && cashierscreen["validateTruck"]){
        //Fetch Driver based on Truck Only
        try{
          var query = "SELECT DRIVERSKEY, FIRSTNAME, LASTNAME, PHONENBR, EMAILADDRESS " +
                      "FROM DRIVERS "+
                      "WHERE CORPCUSTKEY = ? AND CORPTRUCKKEY = ? ";
          var driver = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["tractor_number"]])
          if(Object.keys(driver).length != 0){
            driver = driver[0]
            cashierscreen["driverInfoKey"] = driver["driverskey"]
            cashierscreen["drvfname"] = driver["firstname"]
            cashierscreen["drvlname"] = driver["lastname"]
            cashierscreen["drvphone"] = driver["phonenbr"]
            cashierscreen["drveaddress"] = driver["emailaddress"]
          }
          else{
            //No driver associated in DB
            cashierscreen["driverInfoKey"] = ""
            cashierscreen["drvfname"] = ""
            cashierscreen["drvlname"] = ""
            cashierscreen["drvphone"] = ""
            cashierscreen["drveaddress"] = ""
          }
        }
        catch (e){
          //Error Occurred during fetch driver based on truck only    
        }
      }
      else if(truckFoundInDB){
        try{
          var query = "SELECT DRIVERSKEY, FIRSTNAME, LASTNAME, PHONENBR, EMAILADDRESS " +
                      "FROM DRIVERS "+
                      "WHERE CORPCUSTKEY = ? AND CORPTRUCKKEY = ? ";
          var driver = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["tractor_number"]])
          if(Object.keys(driver).length != 0){
            //found driver
            driver = driver[0]
            cashierscreen["driverInfoKey"] = driver["driverskey"]
            cashierscreen["drvfname"] = driver["firstname"]
            cashierscreen["drvlname"] = driver["lastname"]
            cashierscreen["drvphone"] = driver["phonenbr"]
            cashierscreen["drveaddress"] = driver["emailaddress"]
          }
          else{
            //No driver associated in DB with this truck
          }
        }
        catch (e){
          //Error Occurred during fetch driver based on truck only
        }
      }
      else{
        //nonvalidate case truck not found
        try{
          var query = "SELECT DRIVERSKEY, FIRSTNAME, LASTNAME, PHONENBR, EMAILADDRESS " +
                      "FROM DRIVERS "+
                      "WHERE CORPCUSTKEY = ? AND trucknbr = ? ";
          var driver = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["tractor_number_value"]])
          if(Object.keys(driver).length != 0){
            //Found Driver
            driver = driver[0]
            cashierscreen["driverInfoKey"] = driver["driverskey"]
            cashierscreen["drvfname"] = driver["firstname"]
            cashierscreen["drvlname"] = driver["lastname"]
            cashierscreen["drvphone"] = driver["phonenbr"]
            cashierscreen["drveaddress"] = driver["emailaddress"]
          }
          else{
            //No driver associated in DB with this truck
          }
        }
        catch (e){
          //Error Occurred during fetch driver based on truck only
        }
      
      }

      // 9. Wash History
      var parms = {};
      parms["driverskey"] = cashierscreen["driverInfoKey"];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetDriverWashHistory.module.json");
        _results = pjsModule["Get Driver Wash History"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var washHistory = _results ? _results["washHistory"] : null;
      cashierscreen['driverRefused'] = _results ? _results["driverRefused"] : null;
      cashierscreen['driverRefusedDisabled'] = _results ? _results["driverRefusedDisabled"] : null;

      // 10. Load History
      display.driver_history.replaceRecords(washHistory);

      // 11. If truck is found
      if (cashierscreen["tractor_number"] && cashierscreen["tractor_number"] != '0') {

        // 12. Remove receipt records
        display.receipt.applyFilter(gridRecord => {
          if (gridRecord["qty"] != 0) return false;
          else return true;
        });

        // 13. Remove Suggestions grid records
        display.suggestions.applyFilter(gridRecord => {
          if (gridRecord["suggested_wash_type"] != '') return false;
          else return true;
        });

        // 14. Reset Price Modification 
        cashierscreen['modifiedPriceSpecials'] = []

        // 15. Reset Receipt Totals
        cashierscreen['total'] = ''
        cashierscreen['rsubtotal'] = ''
        cashierscreen['tax'] = ''
        cashierscreen['discount'] = ''
        
        coupon['coupon_discount'] = ''
        scrub_club['scrub_club_invoice'] = ''
      }

      // 16. Frequency Tracking
      var parms = {};
      parms["tractor_number_value"] = cashierscreen['tractor_number_value'];
      parms["trailer_number_value"] = cashierscreen['trailer_number_value'];
      parms["corporatecustomerskey"] = cashierscreen['comp_name'];
      parms["clientTime"] = globals['clientTime'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("FrequencyTracking.module.json");
        _results = pjsModule["Frequency Tracking"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var ineligibleCategories = _results ? _results["ineligibleCategories"] : null;
      var lastPurchased = _results ? _results["lastPurchased"] : null;

      // 17. Remove Categories?
      if (ineligibleCategories.length > 0) {

        // 18. Remove Categories
        display.products.applyFilter(gridRecord => {
          if (ineligibleCategories.filter(category => category == gridRecord["category"]).length > 0) 
            return false;
          else 
            return true;
        });

        // 19. Display Ineligible
        let message = "Inelgibile : "
        
        pjs.messageBox({
          message : `${message} ${lastPurchased.join(',')}`
        })
      }
    },

    "AddReceipt": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Get Selected Product
      var _success = true;
      var _data = display.products.filter(entry => (entry["add"] && entry["add"] != '0'));
      if (Array.isArray(_data)) _data = _data[0];
      if (!_data) {
        _data = {};
        var _error = new Error("Record not found");
        _success = false;
      }
      var activeGridRecord = _data;

      // 3. Set work variable
      var matchingReceipt = null;
      var discountValue = 0;

      // 4. Find Product in Receipt Grid (Exists?)
      var _success = true;
      var _data = display.receipt.filter(gridRecord => {
        if (gridRecord["item_name"] == activeGridRecord["product"]) return true;
        else return false;
      });
      if (Array.isArray(_data)) _data = _data[0];
      if (!_data) {
        _data = {};
        var _error = new Error("Record not found");
        _success = false;
      }
      var matchingReceipt = _data;

      // 5. Product Exists?
      if (activeGridRecord["product"] == matchingReceipt["item_name"]) {

        // 6. Other Wash/Item
        if ((activeGridRecord["product"] == 'Other Wash') || (activeGridRecord["product"] == 'Other Item')) {

          // 7. Show Message
          pjs.messageBox({
            title: ``,
            message: `Other Wash/Item already exists cannot add another in same Transaction`
          });

          // 8. Stop
          return;
        }

        // 9. Otherwise
        else {

          // 10. w/Debris?
          if (activeGridRecord["prcmodelg"] == 'Y') {

            // 11. Add Receipt Price and Qty
            /*
              This step will increase quantity and price by factor of 1. 
              If the product already exists in receipt grid. 
            */
            display.receipt.applyMap(gridRecord => {
              if (gridRecord["item_name"] == activeGridRecord["product"]) {
                gridRecord["qty"] += 1
                gridRecord["rprice"] = gridRecord["qty"] * gridRecord["specialUnitPrice"]
                gridRecord["actualPrice"] = gridRecord["qty"] * gridRecord["specialUnitActualPrice"]
              }
              return gridRecord;
            });
          }

          // 12. Otherwise
          else {

            // 13. Add Receipt Price and Qty
            /*
              This step will increase quantity and price by factor of 1. 
              If the product already exists in receipt grid. 
            */
            display.receipt.applyMap(gridRecord => {
              if (gridRecord["item_name"] == activeGridRecord["product"]) {
                gridRecord["qty"] += 1
                gridRecord["rprice"] = gridRecord["qty"] * activeGridRecord["discountPrice"]
                gridRecord["actualPrice"] = gridRecord["qty"] * activeGridRecord["price"]
              }
              return gridRecord;
            });
          }
        }
      }

      // 14. Product Not Exist in Receipt
      else {

        // 15. Other Wash/Item
        if ((activeGridRecord["product"] == 'Other Wash') || (activeGridRecord["product"] == 'Other Item')) {

          // 16. Show Cost popup
          Object.assign(add_other, {
            "other_header": activeGridRecord["product"],
            "activeGridRecord": activeGridRecord,
            "price" : '0.00'
          });
          screenHistory.push("add_other");
          activeScreen = screens["add_other"];
          return;
        }

        // 17. Price Modify?
        if (activeGridRecord['prcmodelg'] == 'Y') {

          // 18. Shoe Modify Price Popup
          Object.assign(add_dynamic_pricing, {
            "basePrice" : activeGridRecord['price'],
            "dynamic_header": activeGridRecord["product"],
            "dynamic_price": '0.00',
            "dynamic_reason": '',
            "dynamic_description": '',
            activeGridRecord : activeGridRecord
          });
          screenHistory.push("add_dynamic_pricing");
          activeScreen = screens["add_dynamic_pricing"];
          return;
        }

        // 19. Otherwise
        else {

          // 20. Add Product To Reciept
          /*
            This step will Add the product to Receipt grid with quantity 1 and unit price (Based on discounted or not)
          */
          
          //Checks if PO is required for this specific product. 
          try{
            if(cashierscreen['po_option']=='M' || cashierscreen['po_option']=='B')
            {
              var sql="SELECT CCREQPOKEY FROM CCREQPO where CCKEY=? and PRDKEY=? ";
              var result=pjs.query(sql,[cashierscreen['company_id'],activeGridRecord["prdkey"]]);
          
              if(result.length!==0)
              {
                var requiredItems = []
                cashierscreen["po_required"] = true
                cashierscreen["has_requirements"] = true
                requiredItems.push("PO#")
                required_fields['ponum'] = cashierscreen['currentPO']
                if(cashierscreen["driverId_required"]){ 
                  requiredItems.push("Driver ID")  
                }
                if(cashierscreen["tripNumber_required"]){
                  requiredItems.push("Trip #") 
                }
                cashierscreen["req_items"] = "Required : " + requiredItems.toString()
              }
            }
            var viewdiscount=false;
            var viewactual=true;
            if(cashierscreen["discount_print"]==="Discount")
            {
              viewactual=false;
              viewdiscount=true;
            }
          
            // Adds product to Receipt Grid, With discounted price, actual price, SCrub club other preferences. 
            display.receipt.unshift({
              canEdit: true,
              displayActual:viewactual,
              displayDiscount:viewdiscount,
              "item_name": activeGridRecord["product"],
              "qty": 1,
              "taxable": activeGridRecord["taxable"],
              "rprice": Number(activeGridRecord["discountPrice"]).toFixed(2),
              "prdkey": activeGridRecord["prdkey"],
              "actualPrice":Number(activeGridRecord["price"]).toFixed(2),
              "givescrubclubforthisitem": activeGridRecord["givescrubclubforthisitem"],
              "redeemscrubclubonthisitem" : activeGridRecord["redeemscrubclubonthisitem"]
            });
          }
          catch(e){
            console.log(e)
          }
        }
      }

      // 21. Calculate Receipt Totals
      var parms = {};
      parms["receiptRecords"] = display.receipt.getRecords();
      parms["locationSurchargeDiscount"] = pjs.session['locationSurchargeDiscount'];
      parms["locationSurchargeDiscountPercentage"] = pjs.session['locationSurchargeDiscountPercentage'];
      parms["customerTaxExempt"] = cashierscreen["customerTaxExempt"];
      parms["locationTaxRate"] = pjs.session['locationTaxRate'];
      parms["discountType"] = cashierscreen["discountType"];
      parms["coupon_discount"] = coupon["coupon_discount"];
      parms["scrubApply"] = cashierscreen["scrubApply"] ? cashierscreen["scrubApply"] : null ;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetReceiptTotals.module.json");
        _results = pjsModule["Receipt Totals"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      cashierscreen['rsubtotal'] = _results ? _results["rsubtotal"] : null;
      cashierscreen['tax'] = _results ? _results["tax"] : null;
      cashierscreen['discount'] = _results ? _results["discount"] : null;
      cashierscreen['total'] = _results ? _results["total"] : null;
      cashierscreen['nontaxable'] = _results ? _results["nontaxable"] : null;
      var errorMessage = _results ? _results["errorMessage"] : null;
      var errorFlag = _results ? _results["error"] : null;
      coupon['coupon_discount'] = _results ? _results["coupon_discount"] : null;

      // 22. Error?
      if (errorFlag && errorFlag != '0') {

        // 23. Show Error
        pjs.messageBox({
          title: ``,
          message: `${errorMessage}`
        });
      }

      // 24. Update Receipt SubTotal
      // cashierscreen["rsubtotal"] = display.receipt.reduce((total, record) => {
      //   var num = Number(record["rprice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      // }, 0);

      // 25. Update Receipt Total
      // /*
      //   This step calculates Totals of Receipt Grid. 
      //   considers Taxable/Non taxable items
      //   Considers Discounts. 
      //   Considers Surcharges and location based tax rates
      // */
      // 
      // var nontaxable = 0;
      // display.receipt.forEach(function(record) {
      //   if (record.taxable == 'N' && record.loctaxable != 'Y'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      //   else if(record.taxable == 'Y' && record.loctaxable == 'N'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      // });
      // cashierscreen["nontaxable"] = nontaxable;
      // 
      // let surcharge = 0 , 
      //     discount = 0, 
      //     subtotal = cashierscreen["rsubtotal"], 
      //     tax = 0,
      //     actualTotal = 0,
      //     total = 0 
      // 
      // //Calculate total of Full prices of line items.
      // actualTotal = display.receipt.reduce((total, record) => {
      //   var num = Number(record["actualPrice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      //   }, 0);
      // 
      // 
      // //Apply Surcharges
      // if(pjs.session["locationSurchargeDiscount"] == "S"){
      //   surcharge += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"]))
      // }
      // 
      // //Determine Taxation
      // if(cashierscreen["customerTaxExempt"] == 'Y'){
      //     tax = 0
      // }
      // else if(pjs.session["locationTaxRate"])
      // {
      //   tax = Number(pjs.session["locationTaxRate"]) * (Number(cashierscreen["rsubtotal"]) - Number(cashierscreen["nontaxable"]));
      // }
      // 
      // //Apply Discounts
      // if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
      //   discount += actualTotal - Number(subtotal);
      //   subtotal = actualTotal
      // }
      // else if(cashierscreen["discountType"] == "Scrub" && Object.keys(cashierscreen["scrubApply"]).length !== 0){
      //   discount += Number(cashierscreen["scrubApply"]["value"])
      // }
      // else if(cashierscreen['discountType'] == 'Coupon'){
      //   if(coupon['coupon_discount'])
      //     discount += Number(coupon["coupon_discount"])
      // }
      // if(pjs.session["locationSurchargeDiscount"] == "D"){
      //   discount += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"])) 
      // }
      // 
      // //Calculate Totals
      // let taxedTotal = Math.abs(subtotal) + Math.abs(tax)
      // total = (Math.abs(taxedTotal) - Math.abs(discount) ) + surcharge
      // 
      // 
      // cashierscreen["rsubtotal"] = Number(subtotal).toFixed(2)
      // cashierscreen["discount"] = Number((Math.abs(discount))).toFixed(2)
      // cashierscreen["tax"] = Number(tax).toFixed(2)
      // cashierscreen["total"] = Number(Math.abs(total)).toFixed(2)

      // 26. Enable Save/Checkout
      cashierscreen["save_Disabled"]=false;
      cashierscreen["checkoutDisabled"]=false;
      

      // 27. Get Suggested Products
      /*
        This step fetches suggested products, based on kitting tables for the product just added to receipt. If the product was already, there it will refresh. 
      */
      
      const utility = require('../common-apis/utility.js')
      
      var _success = false;
      var _error = null;
      
      var _records = null;
      try {
      
        var query = "SELECT PRODUCTKITTING.KITPRODUCTID FROM PRODUCTKITTING WHERE PRODUCTKITTING.PRODUCTSKEY = ?"
        _records = pjs.query(query, [activeGridRecord["prdkey"]]);
      
        //If kit is available
        if(_records.length != 0 && _records !== undefined && _records !== [] && _records != null){
          var kitID = _records[0]["kitproductid"];
      
          var query = "SELECT PRODUCTS.PRDKEY, PRODUCTPRICE.PRICE, PRODUCTS.PRODUCT as suggested_wash_type "+
                      "FROM PRODUCTS INNER JOIN PRODUCTKITTING ON PRODUCTS.PRDKEY = PRODUCTKITTING.PRODUCTSKEY " +
                      " INNER JOIN PRODUCTPRICE ON PRODUCTPRICE.PRODUCTSKEY = PRODUCTS.PRDKEY " + 
                      "WHERE PRODUCTKITTING.KITPRODUCTID = ?";
          _records = pjs.query(query, [kitID]);
      
          var suggestions =  display.suggestions.getRecords(); 
          suggestions = _records.filter( el => {
              return !suggestions.find(element => {
                return element["suggested_wash_type"] === el["suggested_wash_type"];
              });
          });
      
          display.suggestions.addRecords(suggestions);
          suggestions = display.suggestions.getRecords();
      
      
      
          cashierscreen["product_suggession"] = suggestions;
          if(suggestions && (cashierscreen["additionalItems"] == '' && typeof cashierscreen["additionalItems"] == 'undefined'))
          {
                var recieptRecords = display.receipt.getRecords();
          suggestions = suggestions.filter(el => {
              return !recieptRecords.find(element => {
                return element["item_name"] === el["suggested_wash_type"];
              });
          });
            display.suggestions.replaceRecords(suggestions);
          }
          else if(suggestions && cashierscreen["additionalItems"])
          {
            var finalsuggestItem = utility.arrayUnique(cashierscreen["additionalItems"].concat(suggestions));
                var recieptRecords = display.receipt.getRecords();
          finalsuggestItem = finalsuggestItem.filter(el => {
              return !recieptRecords.find(element => {
                return element["item_name"] === el["suggested_wash_type"];
              });
          });
            display.suggestions.replaceRecords(finalsuggestItem) 
          }
          _success = true;
        }
      }
      catch (err) {
        _records = [];
        _error = err;
        console.error(err);
      }
      

      // 28. Active Product Scroll
      
      if(cashierscreen['category'] !== 'N/A' || cashierscreen['category'] !== ''){
        let categoryFiltered = display.products.getRecords().filter(prd => prd.category == cashierscreen['category'])
        cashierscreen['productsActiveRecord'] = categoryFiltered.findIndex( item => item['prdkey'] == activeGridRecord['prdkey']) + 1
      }
      else{
        cashierscreen['productsActiveRecord'] = display.products.getRecords().findIndex( item => item['prdkey'] == activeGridRecord['prdkey']) + 1
      }
      
    },

    "Add Quantity Count": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Get selected product in receipt grid 
      var _success = true;
      var _data = display.receipt.filter(entry => (entry["add_qty"] && entry["add_qty"] != '0'));
      if (Array.isArray(_data)) _data = _data[0];
      if (!_data) {
        _data = {};
        var _error = new Error("Record not found");
        _success = false;
      }
      var activeGridRecord = _data;

      // 3. Set Product Data variable
      var productData = null;

      // 4. Find Product from Products Grid
      var _success = true;
      var _data = display.products.filter(gridRecord => {
        if (gridRecord["product"] == activeGridRecord["item_name"]) return true;
        else return false;
      });
      if (Array.isArray(_data)) _data = _data[0];
      if (!_data) {
        _data = {};
        var _error = new Error("Record not found");
        _success = false;
      }
      var productData = _data;

      // 5. w/Debris?
      if (productData["prcmodelg"] == 'Y') {

        // 6. Increase Quantity & Price
        display.receipt.applyMap(gridRecord => {
          if (gridRecord["prdkey"] == activeGridRecord["prdkey"]) {
            Object.assign(gridRecord, {
              "qty": activeGridRecord["qty"] +1,
              "rprice": Number(activeGridRecord["specialUnitPrice"] * (activeGridRecord["qty"] +1)).toFixed(2),
              "actualPrice": Number(activeGridRecord["specialUnitActualPrice"] * (activeGridRecord["qty"] +1)).toFixed(2) 
            });
          }
          return gridRecord;
        });
      }

      // 7. Otherwise
      else {

        // 8. Increase Quantity & Price
        display.receipt.applyMap(gridRecord => {
          if (gridRecord["prdkey"] == activeGridRecord["prdkey"]) {
            Object.assign(gridRecord, {
              "qty": activeGridRecord["qty"] +1,
              "rprice": Number(productData["discountPrice"] * (activeGridRecord["qty"] +1)).toFixed(2),
              "actualPrice": Number(productData["price"] * (activeGridRecord["qty"] +1)).toFixed(2) 
            });
          }
          return gridRecord;
        });
      }

      // 9. Receipt Records
      // let receiptRecords = display.receipt.getRecords()

      // 10. Calculate Receipt Totals
      var parms = {};
      parms["receiptRecords"] = display.receipt.getRecords();
      parms["locationSurchargeDiscount"] = pjs.session['locationSurchargeDiscount'];
      parms["locationSurchargeDiscountPercentage"] = pjs.session['locationSurchargeDiscountPercentage'];
      parms["customerTaxExempt"] = cashierscreen["customerTaxExempt"];
      parms["locationTaxRate"] = pjs.session['locationTaxRate'];
      parms["discountType"] = cashierscreen["discountType"];
      parms["coupon_discount"] = coupon["coupon_discount"];
      parms["scrubApply"] = cashierscreen["scrubApply"] ? cashierscreen["scrubApply"] : null ;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetReceiptTotals.module.json");
        _results = pjsModule["Receipt Totals"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      cashierscreen['rsubtotal'] = _results ? _results["rsubtotal"] : null;
      cashierscreen['tax'] = _results ? _results["tax"] : null;
      cashierscreen['discount'] = _results ? _results["discount"] : null;
      cashierscreen['total'] = _results ? _results["total"] : null;
      cashierscreen['nontaxable'] = _results ? _results["nontaxable"] : null;
      var errorMessage = _results ? _results["errorMessage"] : null;
      var errorFlag = _results ? _results["error"] : null;
      coupon['coupon_discount'] = _results ? _results["coupon_discount"] : null;

      // 11. Error?
      if (errorFlag && errorFlag != '0') {

        // 12. Show Error
        pjs.messageBox({
          title: ``,
          message: `${errorMessage}`
        });
      }

      // 13. Update Receipt SubTotal
      // cashierscreen["rsubtotal"] = display.receipt.reduce((total, record) => {
      //   var num = Number(record["rprice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      // }, 0);

      // 14. Update Receipt Total
      // /*
      //   This module calculates totals of receipt grid. 
      //   Considers Discounts
      //   Taxes
      //   Location based surcharges, Taxes etc
      // */
      // var nontaxable = 0;
      // display.receipt.forEach(function(record) {
      //   if (record.taxable == 'N' && record.loctaxable != 'Y'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      //   else if(record.taxable == 'Y' && record.loctaxable == 'N'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      // });
      // cashierscreen["nontaxable"] = nontaxable;
      // 
      // let surcharge = 0 , 
      //     discount = 0, 
      //     subtotal = cashierscreen["rsubtotal"], 
      //     tax = 0,
      //     actualTotal = 0,
      //     total = 0 
      // 
      // //Calculate total of Full prices of line items.
      // actualTotal = display.receipt.reduce((total, record) => {
      //   var num = Number(record["actualPrice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      //   }, 0);
      // 
      // 
      // //Apply Surcharges
      // if(pjs.session["locationSurchargeDiscount"] == "S"){
      //   surcharge += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"]))
      // }
      // 
      // //Determine Taxation
      // if(cashierscreen["customerTaxExempt"] == 'Y'){
      //     tax = 0
      // }
      // else if(pjs.session["locationTaxRate"])
      // {
      //   tax = Number(pjs.session["locationTaxRate"]) * (Number(cashierscreen["rsubtotal"]) - Number(cashierscreen["nontaxable"]));
      // }
      // 
      // //Apply Discounts
      // if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
      //   discount += actualTotal - Number(subtotal);
      //    subtotal = actualTotal
      // }
      // else if(cashierscreen["discountType"] == "Scrub" && Object.keys(cashierscreen["scrubApply"]).length !== 0){
      //   discount += Number(cashierscreen["scrubApply"]["value"])
      // }
      // else if(cashierscreen['discountType'] == 'Coupon'){
      //   discount += Number(coupon["coupon_discount"])
      // }
      // if(pjs.session["locationSurchargeDiscount"] == "D"){
      //   discount += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"])) 
      // }
      // 
      // //Calculate Totals
      // let taxedTotal = Math.abs(subtotal) + Math.abs(tax)
      // total = (Math.abs(taxedTotal) - Math.abs(discount) ) + surcharge
      // 
      // 
      // cashierscreen["rsubtotal"] = Number(subtotal).toFixed(2)
      // cashierscreen["discount"] = Number((Math.abs(discount))).toFixed(2)
      // cashierscreen["tax"] = Number(tax).toFixed(2)
      // cashierscreen["total"] = Number(Math.abs(total)).toFixed(2)

      // 15. Enable Save/Checkout
      cashierscreen["save_Disabled"]=false;
      cashierscreen["checkoutDisabled"]=false;
      
      console.log(display.receipt.getRecords())
      
    },

    "Transaction Search": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Search String?
      if (cashierscreen["tsearch"] && cashierscreen["tsearch"] != '0') {

        // 3. Search Records
        /*
          This step searches for Transactions in Database. 
        */ 
        try{
        
          //Remove first char if it is $ symbol
          let searchValue = cashierscreen["tsearch"];
          while (searchValue.charAt(0) === '$') {
            searchValue = searchValue.substring(1);
          }
        
          var _success = false;
          var _error = null;
          var _records = null;
          try {
            let queryvalue = "SELECT TRANSACTIONSHEADER.LOCALTS1 as localtimestamp, "+
            "CORPORATECUSTOMERS.companynm, "+
            "TRANSACTIONSHEADER.status, "+
            "TRANSACTIONSHEADER.invoicenbr, "+
            "TRANSACTIONSHEADER.discountedtotal$, "+
            "TRANSACTIONSHEADER.ordertotal$ FROM TRANSACTIONSHEADER "+
            "INNER JOIN CORPORATECUSTOMERS "+
            "ON TRANSACTIONSHEADER.CORPORATECUSTOMERSKEY = CORPORATECUSTOMERS.CORPCUSTKEY "+
            "WHERE "+
            " ( UPPER(CORPORATECUSTOMERS.companynm) LIKE UPPER('%"+searchValue+"%') "+
            "OR UPPER(TRANSACTIONSHEADER.status) LIKE UPPER('%"+searchValue+"%') "+
            "OR TRANSACTIONSHEADER.invoicenbr LIKE '%"+searchValue+"%' "+
            "OR TRANSACTIONSHEADER.ordertotal$ LIKE '%"+searchValue+"%')  AND  DATE(LOCALTS1) = ?  AND TRANSACTIONSHEADER.LOCATIONSKEY = ? ";
        
            _records = pjs.query(queryvalue, [ globals['clientTime'], pjs.session['locationsKey']]);
            _success = true;
          }
          catch (err) {
          _records = [];
          _error = err;
          console.error(err);
          }
        
          display.transactions.replaceRecords(_records);
        }
        catch(e){
          //Search value is empty
        }
      }
    },

    "coupon button click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Validation
      /*
        To apply coupon there must be some items in the receipt grid. 
        Keep in mind that coupon button is not visible at all if it is not applicable to Selected customer. 
        Visit Company change logic for above. 
      */
      let receiptItems = display.receipt.getRecords()
      if(receiptItems.length == 0){
        pjs.messageBox({
          title:"",
          message: "No items added yet"
        })
        return
      }

      // 3. Coupon Discount variable definition
      coupon["coupon_discount"]=0;

      // 4. Show Coupon screen
      Object.assign(coupon, {
        "coupon_discount": ''
      });
      screenHistory.push("coupon");
      activeScreen = screens["coupon"];
      return;
    },

    "scrub club button click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Validation
      /*
        This step validates if a scrub club can applied. 
      */
      let receiptItems = display.receipt.getRecords()
      
      //No items added to receipt yet
      if(receiptItems.length == 0){
        pjs.messageBox({
          title:"",
          message: "No items added yet"
        })
        return
      }
      
      //check if any item is available on which scrub club can be redeemed on. Property added to each product on AddProduct routine. 
      let redeemOn = receiptItems.filter((item)=>{
        return item["redeemscrubclubonthisitem"] == 'Y'
      })
      
      if(redeemOn.length == 0){
        pjs.messageBox({
          title: "",
          message: "No Items in the list on which scrub can be redeemed"
        })
        return
      }

      // 3. Show Scrub Club screen
      screenHistory.push("scrub_club");
      activeScreen = screens["scrub_club"];
      return;
    },

    "Cancel Screen": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Clear Search Fields
      //clear search
      companies['csearch'] = ''
      companies['tsearch'] = ''
      cashierscreen['psearch'] = ''
      cashierscreen['tsearch'] = ''
      paymentscreen['tsearch'] = ''
      view_transaction['tsearch'] = ''
      cashierscreen_shiftsales['tsearch'] = ''

      // 3. Show previous screen
      let previousScreen = screenHistory[screenHistory.length - 2];
      if (previousScreen) {
        activeScreen = screens[previousScreen];
        screenHistory.pop();
      }
      return;
    },

    "Refresh Products": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Can Load Products
      if (cashierscreen["comp_name"] && cashierscreen["comp_name"] != '0') {

        // 3. Get Products
        
        var _success = false;
        var _error = null;
        var companyId = cashierscreen['comp_name']
        
        var products = null;
        try {
          var specificProducts = "SELECT PRODUCTS.PRDKEY,PRODUCTS.product, PRODUCTS.taxable ,PRODUCTCATEGORY.category, PRODUCTCATEGORY.DISCOUNTABLE, PRODUCTPRICE.price" +
                      ", PRODUCTS.GIVESCRUBCLUBFORTHISITEM, PRODUCTS.REDEEMSCRUBCLUBONTHISITEM, IMAGES.IMAGEURL, LOCCATTAX.TAXABLE AS LOCTAXABLE, LOCCATTAX.LOCTNKEY AS LOCLOCATION, PRCMODELG "+
                      "FROM CORPCUSTPRODOPT "+
                      "LEFT JOIN PRODUCTS ON PRODUCTS.PRDKEY = CORPCUSTPRODOPT.PRODUCTSKEY " +
                      "LEFT JOIN PRODUCTCATEGORY ON PRODUCTS.PRODUCTCATEGORYKEY = PRODUCTCATEGORY.PRDCATKEY " +
                      "LEFT JOIN PRODUCTPRICE ON PRODUCTS.PRDKEY = PRODUCTPRICE.PRODUCTSKEY " +
                      "LEFT JOIN IMAGES ON IMAGES.IMAGEKEY= PRODUCTS.IMAGEKEY " +
                      "LEFT JOIN WASHTYPES ON PRODUCTS.WASHTYPESKEY = WASHTYPES.WASHTYPKEY " +
                      "LEFT JOIN LOCCATTAX ON PRODUCTCATEGORY.PRDCATKEY = LOCCATTAX.PRDCATKEY AND LOCCATTAX.LOCTNKEY = ? "+
                      "WHERE (PRODUCTS.DELETE = ? OR PRODUCTS.DELETE IS NULL) " +
                      "AND CORPCUSTPRODOPT.CCKEY = ? " +
                      "ORDER BY PRODUCTS.PRODUCT "
        
          var allProducts = "SELECT PRODUCTS.PRDKEY,PRODUCTS.product, PRODUCTS.taxable ,PRODUCTCATEGORY.category, PRODUCTCATEGORY.DISCOUNTABLE, PRODUCTPRICE.price" +
                      ", PRODUCTS.GIVESCRUBCLUBFORTHISITEM, PRODUCTS.REDEEMSCRUBCLUBONTHISITEM, IMAGES.IMAGEURL, LOCCATTAX.TAXABLE AS LOCTAXABLE, LOCCATTAX.LOCTNKEY AS LOCLOCATION, PRCMODELG "+
                      "FROM PRODUCTS INNER JOIN PRODUCTCATEGORY ON PRODUCTS.PRODUCTCATEGORYKEY = PRODUCTCATEGORY.PRDCATKEY " +
                      "LEFT JOIN PRODUCTPRICE ON PRODUCTS.PRDKEY = PRODUCTPRICE.PRODUCTSKEY " +
                      "LEFT JOIN IMAGES ON IMAGES.IMAGEKEY= PRODUCTS.IMAGEKEY " +
                      "LEFT JOIN WASHTYPES ON PRODUCTS.WASHTYPESKEY = WASHTYPES.WASHTYPKEY " +
                      "LEFT JOIN LOCCATTAX ON PRODUCTCATEGORY.PRDCATKEY = LOCCATTAX.PRDCATKEY AND LOCCATTAX.LOCTNKEY = ? "+
                      "WHERE (PRODUCTS.DELETE = ? OR PRODUCTS.DELETE IS NULL) " +
                      "AND PRODUCTCATEGORY.PRDCATKEY NOT IN " +
                      "(SELECT PRODUCTCATEGORYKEY FROM CORPCUSTCATEGORY WHERE CORPORATECUSTOMERSKEY = ? AND INCLUDEEXCLUDE = ? AND DELETE = ?) ORDER BY PRODUCTS.PRODUCT"
        
        
          specificProducts = pjs.query(specificProducts, [pjs.session['locationsKey'], 'N', companyId])
          
          if(specificProducts.length == 0 || specificProducts == null){
            allProducts = pjs.query(allProducts, [pjs.session['locationsKey'],'N', companyId, 'E', 'N'])
            products = allProducts
            cashierscreen['allWashes'] = 'Y'
          }
          else{
            products = specificProducts
            cashierscreen['allWashes'] = 'N'
          }
          _success = true;
        }
        catch (err) {
          products = [];
          _error = err;
          console.log(err)
        }
        

        // 4. Site Restrictions Products
        
        try {
          var siteRestrictions = "SELECT CCSITRESTKEY, CCKEY, PRODUCTKEY, LOCATIONSKEY "+
                                 "FROM CCPRODOPTSSITEREST "+
                                 "WHERE CCKEY = ? " +
                                 "AND (DELETE <> ? OR DELETE IS NULL) "
        
          siteRestrictions = pjs.query(siteRestrictions, [companyId, 'Y'])
          if(siteRestrictions.length != 0 && siteRestrictions != null && siteRestrictions != undefined){
            //site restrictions exist. 
            let positiveList = siteRestrictions.filter(item => item['locationskey'] == pjs.session['locationsKey'])
            let negativeList = siteRestrictions.filter(item => item['locationskey'] != pjs.session['locationsKey'])
            negativeList = negativeList.filter(item => positiveList.filter(item1 => item1['productkey'] == item['productkey']).length == 0)
            products = products.filter(product => negativeList.filter(item => item['productkey'] == product['prdkey']).length == 0)
          }
          _success = true;
        }
        catch (err) {
          _error = err;
        }

        // 5. Load Products
        
        if(products.length == 0){
          pjs.messageBox({
            message: 'No products valid for this customer at this location'
          })
        }
        
        //Categories of products
        var categories = Array.from(new Set(products.map((rec) => {return rec["category"]})))
        
        //Discount and Icon configuration
        products = products.map((rec) => {
          //hide truck icon
          if(rec["imageurl"] != null && rec["imageurl"] != undefined && rec["imageurl"] != ""){
            rec["truckIconVisible"] = true
          }
          else{
            rec["truckIconVisible"] = false
          }
          if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
            var discountItem = cashierscreen["discountList"];
            if((Object.keys(discountItem).length != 0) && rec['discountable'] == 'Y'){
              //item price has discount
              let discountvalue = discountItem.filter((item) => item['category'] == rec['category'])
              if(discountvalue.length != 0){
                rec["discountPrice"] = Number(rec["price"]) * (1-Number(discountvalue[0]["percentage"]))
              }
              //is not discountable
              else{
                rec["discountPrice"] = Number(rec["price"])
              }
            }
            //is not discountable
            else{
              rec["discountPrice"] = Number(rec["price"])
            }
          }
          //is not discountable
          else{
            rec["discountPrice"] = Number(rec["price"])
          }
          return rec
        })
        
        //Order by name of product
        products.sort((a, b) =>  a['product'] < b['product'])
        
        //Load Products
        display.products.replaceRecords(products);
        
        //Categories assignment
        categories.push("N/A")
        categories.sort()
        cashierscreen['product_category_options'] = categories;
        
        //Product grid controls. 
        cashierscreen["product_filter_disabled"] = false;
        cashierscreen["product_search_disabled"] = false;
        
        //Set scroll for Products
        
        cashierscreen['productsActiveRecord'] = 0

        // 6. Frequency Tracking
        
        let truckNo = cashierscreen['tractor_number_value']
        let trailerNo = cashierscreen['trailer_number_value']
        let ineligibleCategories = []
        let lastPurchased = []
        try{
          var truckFrequency = []
          var trailerFrequency = []  
          if(truckNo != '' && truckNo != undefined && truckNo != null){
            truckFrequency = "SELECT CCFREQKEY, CCKEY, SKEYTYPE, SKEY, TIMEPERIODSKEY, PERIOD, FREQUENCY, OVERRIDE " +
                            "FROM CORPCUSTFREQUENCY "+
                            "LEFT JOIN TIMEPERIODS ON TIMEPERIODS.TIMEPERIODKEY = CORPCUSTFREQUENCY.TIMEPERIODSKEY " +
                            "WHERE CORPCUSTFREQUENCY.SKEY = ? "+
                            "AND CORPCUSTFREQUENCY.CCKEY = ? "+
                            "AND CORPCUSTFREQUENCY.SKEYTYPE = ? "+
                            "AND (CORPCUSTFREQUENCY.DELETE <> ? OR CORPCUSTFREQUENCY.DELETE IS NULL )"
        
            truckFrequency = pjs.query(truckFrequency, [truckNo, companyId, 'TRACTOR', 'Y'])
          }
        
          if(trailerNo != '' && trailerNo != undefined && trailerNo != null){
            var trailerFrequency = "SELECT CCFREQKEY, CCKEY, SKEYTYPE, SKEY, TIMEPERIODSKEY, PERIOD, FREQUENCY, OVERRIDE " +
                            "FROM CORPCUSTFREQUENCY "+
                            "LEFT JOIN TIMEPERIODS ON TIMEPERIODS.TIMEPERIODKEY = CORPCUSTFREQUENCY.TIMEPERIODSKEY " +
                            "WHERE CORPCUSTFREQUENCY.SKEY = ? "+
                            "AND CORPCUSTFREQUENCY.CCKEY = ? "+
                            "AND CORPCUSTFREQUENCY.SKEYTYPE = ? "+
                            "AND (CORPCUSTFREQUENCY.DELETE <> ? OR CORPCUSTFREQUENCY.DELETE IS NULL )"
        
            trailerFrequency = pjs.query(trailerFrequency, [trailerNo, companyId, 'TRAILER', 'Y'])
        
          }
        
          if(truckFrequency.length != 0){
            //frequency for truck exists
            let truckPurchaseHistory = `SELECT CATEGORY, TO_CHAR(MAX(LOCALTS1), 'YYYY-MM-DD HH24:MI:SS') AS LOCALTS1, TRANSACTIONSHEADER.TXHDRKEY
                                  FROM TRANSACTIONDETAILS 
                                  LEFT JOIN PRODUCTS ON PRODUCTS.PRDKEY = TRANSACTIONDETAILS.PRODUCTSKEY 
                                  LEFT JOIN PRODUCTCATEGORY ON PRODUCTCATEGORY.PRDCATKEY = PRODUCTS.PRODUCTCATEGORYKEY 
                                  LEFT JOIN TRANSACTIONSHEADER ON TRANSACTIONSHEADER.TXHDRKEY = TRANSACTIONDETAILS.TRANSACTIONSHEADERKEY 
                                  WHERE TRANSACTIONSHEADER.TRACTORNBR = ?  
                                  AND TRANSACTIONSHEADER.CORPORATECUSTOMERSKEY = ? 
                                  AND TRANSACTIONSHEADER.STATUS <> ?
                                  AND (PRODUCTCATEGORY.PRDCATKEY = ? OR PRODUCTCATEGORY.PRDCATKEY = ?) 
                                  AND (TRANSACTIONSHEADER.SOFTDELETE <> ? OR TRANSACTIONSHEADER.SOFTDELETE IS NULL) 
                                  AND (TRANSACTIONDETAILS.DELETE <> ? OR TRANSACTIONDETAILS.DELETE IS NULL) 
                                  GROUP BY CATEGORY, TRANSACTIONSHEADER.TXHDRKEY ORDER BY LOCALTS1 DESC`
            truckPurchaseHistory = pjs.query(truckPurchaseHistory, [truckNo, companyId, 'Void', 12, 3, 'Y', 'Y']) //12 = Tractors 3 = Combinations
            if(truckPurchaseHistory.length != 0){
              var timeDelta = new Date(globals['clientTime'].getTime())
              var nextEligible = new Date(truckPurchaseHistory[0]["localts1"])
              var transactionTime = new Date(truckPurchaseHistory[0]["localts1"])
              var frequency = truckFrequency[0]["frequency"]
              if(frequency == 0){
                frequency = 1
              }
              if(truckFrequency[0]["period"] == "Day"){
                timeDelta.setDate(timeDelta.getDate() - frequency)
                nextEligible.setDate(nextEligible.getDate() + frequency)
              }
              else if(truckFrequency[0]["period"] == "Week"){
                timeDelta.setDate(timeDelta.getDate() - (frequency*7))
                nextEligible.setDate(nextEligible.getDate() + (frequency*7))
              }
              else if(truckFrequency[0]["period"] == "Month"){
                timeDelta.setMonth(timeDelta.getMonth() - (frequency))
                nextEligible.setMonth(nextEligible.getMonth() + (frequency))
              }
              else if(truckFrequency[0]["period"] == "Year"){
                timeDelta.setFullYear(timeDelta.getFullYear() - (frequency))
                nextEligible.setFullYear(nextEligible.getFullYear() + (frequency))
              }
        
              if(transactionTime > timeDelta && !cashierscreen['flag_tx_loaded_from_db']){
                ineligibleCategories.push('Tractors')
                ineligibleCategories.push('Combinations')
                lastPurchased.push(`Tractors/Combinations Last Purchased: ${transactionTime.toLocaleString('en-US')} , Next Eligible : ${nextEligible.toLocaleString('en-US')}`)
              }
              else if(cashierscreen['flag_tx_loaded_from_db'] && cashierscreen['flag_tx_loaded_from_db_id'] != truckPurchaseHistory[0]['txhdrkey']){
                ineligibleCategories.push('Tractors')
                ineligibleCategories.push('Combinations')
                lastPurchased.push(`Tractors/Combinations Last Purchased: ${transactionTime.toLocaleString('en-US')} , Next Eligible : ${nextEligible.toLocaleString('en-US')}`)
              }
            }
          }
          if (trailerFrequency.length !=  0){
            // frequency for trailer exists.
                //frequency for truck exists
            let purchaseHistory = `SELECT CATEGORY, TO_CHAR(MAX(LOCALTS1), 'YYYY-MM-DD HH24:MI:SS') AS LOCALTS1, TRANSACTIONSHEADER.TXHDRKEY
                                  FROM TRANSACTIONDETAILS 
                                  LEFT JOIN PRODUCTS ON PRODUCTS.PRDKEY = TRANSACTIONDETAILS.PRODUCTSKEY 
                                  LEFT JOIN PRODUCTCATEGORY ON PRODUCTCATEGORY.PRDCATKEY = PRODUCTS.PRODUCTCATEGORYKEY 
                                  LEFT JOIN TRANSACTIONSHEADER ON TRANSACTIONSHEADER.TXHDRKEY = TRANSACTIONDETAILS.TRANSACTIONSHEADERKEY 
                                  WHERE TRANSACTIONSHEADER.TRAILERNBR = ?  
                                  AND TRANSACTIONSHEADER.CORPORATECUSTOMERSKEY = ? 
                                  AND TRANSACTIONSHEADER.STATUS <> ?
                                  AND (PRODUCTCATEGORY.PRDCATKEY = ? OR PRODUCTCATEGORY.PRDCATKEY = ?) 
                                  AND (TRANSACTIONSHEADER.SOFTDELETE <> ? OR TRANSACTIONSHEADER.SOFTDELETE IS NULL) 
                                  AND (TRANSACTIONDETAILS.DELETE <> ? OR TRANSACTIONDETAILS.DELETE IS NULL) 
                                  GROUP BY CATEGORY, TRANSACTIONSHEADER.TXHDRKEY ORDER BY LOCALTS1 DESC`
            purchaseHistory = pjs.query(purchaseHistory, [trailerNo, companyId, 'Void', 13, 3, 'Y', 'Y']) //13 = Traiers 3 = Combinations
            if(purchaseHistory.length != 0){
              var timeDelta = new Date(globals['clientTime'].getTime())
              var nextEligible = new Date(purchaseHistory[0]["localts1"])
              var transactionTime = new Date(purchaseHistory[0]["localts1"])
              var frequency = trailerFrequency[0]["frequency"]
              if(frequency == 0){
                frequency = 1
              }
              if(trailerFrequency[0]["period"] == "Day"){
                timeDelta.setDate(timeDelta.getDate() - frequency)
                nextEligible.setDate(nextEligible.getDate() + frequency)
              }
              else if(trailerFrequency[0]["period"] == "Week"){
                timeDelta.setDate(timeDelta.getDate() - (frequency*7))
                nextEligible.setDate(nextEligible.getDate() + (frequency*7))
              }
              else if(trailerFrequency[0]["period"] == "Month"){
                timeDelta.setMonth(timeDelta.getMonth() - (frequency))
                nextEligible.setMonth(nextEligible.getMonth() + (frequency))
              }
              else if(trailerFrequency[0]["period"] == "Year"){
                timeDelta.setFullYear(timeDelta.getFullYear() - (frequency))
                nextEligible.setFullYear(nextEligible.getFullYear() + (frequency))
              }
        
              if(transactionTime > timeDelta && !cashierscreen['flag_tx_loaded_from_db_id']){
                ineligibleCategories.push('Trailers')
                ineligibleCategories.push('Combinations')
                lastPurchased.push(`Trailers/Combinations Last Purchased: ${transactionTime.toLocaleString('en-US')} , Next Eligible : ${nextEligible.toLocaleString('en-US')}`)
              }
              else if(cashierscreen['flag_tx_loaded_from_db'] && cashierscreen['flag_tx_loaded_from_db_id'] != purchaseHistory[0]['txhdrkey']){
                ineligibleCategories.push('Tractors')
                ineligibleCategories.push('Combinations')
                lastPurchased.push(`Trailers/Combinations Last Purchased: ${transactionTime.toLocaleString('en-US')} , Next Eligible : ${nextEligible.toLocaleString('en-US')}`)
              }
            }
          }
        }
        catch(e){
          console.log('Error Occurred', e)
        }
        

        // 7. Remove Categories
        display.products.applyFilter(gridRecord => {
          if (ineligibleCategories.filter(category => category == gridRecord["category"]).length > 0) 
            return false;
          else 
            return true;
        });
      }

      // 8. Not Load Products
      else {

        // 9. Clear Products grid
        display.products.clear();

        // 10. Disable Save Button
        cashierscreen["save_Disabled"]=true;
      }
    },

    "Refresh Today's Transaction": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Get Transactions
      var parms = {};
      parms["locationsKey"] = pjs.session['locationsKey'];
      parms["clientTime"] = globals['clientTime'];
      parms["todays"] = true;
      parms["userType"] = pjs.session['userType'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetTransactions.module.json");
        _results = pjsModule["GetTransactions"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var transactionRecords = _results ? _results["transactionRecords"] : null;

      // 3. Display Transactions
      //Display transactions
      
      display.transactions.replaceRecords(transactionRecords);
      display.shift_transactions.replaceRecords(transactionRecords);
      display.company_transactions.replaceRecords(transactionRecords);
      display.payment_transactions.replaceRecords(transactionRecords);
      display.transactions_grid.replaceRecords(transactionRecords);

      // 4. Load Transactions
      // //load transactions
      // var _success = false;
      // var _error = null;
      // 
      // var _records = null;
      // try {
      //   var query = "SELECT TRANSACTIONSHEADER.LOCALTS1 as localtimestamp,CORPORATECUSTOMERS.companynm,TRANSACTIONSHEADER.txhdrkey,TRANSACTIONSHEADER.status,TRANSACTIONSHEADER.invoicenbr,TRANSACTIONSHEADER.ordertotal$,TRANSACTIONSHEADER.discountedtotal$ "+
      //               "FROM TRANSACTIONSHEADER INNER JOIN CORPORATECUSTOMERS ON TRANSACTIONSHEADER.CORPORATECUSTOMERSKEY = CORPORATECUSTOMERS.CORPCUSTKEY "+
      //               "WHERE DATE(LOCALTS1) = ?  AND TRANSACTIONSHEADER.SOFTDELETE is null AND LOCATIONSKEY = ? ORDER BY TRANSACTIONSHEADER.LOCALTS1 DESC";
      //   var _records = pjs.query(query, [globals['clientTime'], pjs.session["locationsKey"]])
      //   _success = true;
      // }
      // catch (err) {
      //   _records = [];
      //   _error = err;
      // }
      // 
      // _records = _records.map((rec)=>{
      //   let printReceipt = false
      //   if(pjs.session['reprintReceipt'] == -1)
      //     printReceipt = false
      //   else if(typeof pjs.session['reprintReceipt'] === 'object' && pjs.session['reprintReceipt'] !== null && Object.keys(pjs.session['reprintReceipt']).length != 0 && pjs.session['reprintReceipt']['txhdrkey'] == rec['txhdrkey'])
      //   {
      //     // printReceipt = true
      //   } 
      //   return {
      //     ...rec,
      //     emailIconVisible: rec['status'] == 'Sale' ? true : false,
      //     printReceiptIconVisible: printReceipt
      //   }
      // })
      // 
      // for(let rec of _records){
      //   if(rec['status'] == 'Sale'){
      //     rec['printReceiptIconVisible'] = true;
      //     break;
      //   }
      // }
      // 
      // display.transactions.replaceRecords(_records);
      // display.shift_transactions.replaceRecords(_records);
      // display.company_transactions.replaceRecords(_records);
      // display.payment_transactions.replaceRecords(_records);
      // display.transactions_grid.replaceRecords(_records);
    },

    "Apply Coupon Click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Coupon > Purchase 
      if (coupon["coupon_discount"] >= cashierscreen["total"]) {

        // 3. Display Error 
        //Cannot apply coupon
        pjs.messageBox({
          title: "",
          message:"Cannot apply coupon greater than invoice"
        })
        return
      }

      // 4. Coupon Negative amount
      if(Number(coupon["coupon_discount"]) < 0)
      {
      pjs.messageBox({
        title: "",
        message:"Negative Amount not allowed"
      })
      return
      }
      

      // 5. Apply Coupon/Disable Scrub
      // Assurity check that only 1 discount can be applied. 
      // More checks like this are already applied on company change routine. 
      console.log(coupon["coupon_discount"])
      if(coupon["coupon_discount"]>0){
        cashierscreen["couponVisible"] = true;
        cashierscreen["scrubVisible"] = false;
        cashierscreen["discount_label"] = "Coupon Discount"
        paymentscreen["discount_label"] = "Coupon Discount"
      }
      else if(coupon['coupon_discount'] == 0){
        cashierscreen["couponVisible"] = true;
        cashierscreen["scrubVisible"] = true;
        cashierscreen["discount_label"] = ""
        paymentscreen["discount_label"] = ""
      
      }
      

      // 6. Update Receipt Total
      /*
        Calculates totals for receipt grid after coupon is applied
        considers taxation, discounts, location based surcharges etc. 
      */
      var nontaxable = 0;
      display.receipt.forEach(function(record) {
        if (record.taxable == 'N' && record.loctaxable != 'Y'){
          nontaxable += Number(record["rprice"]);
        }
        else if(record.taxable == 'Y' && record.loctaxable == 'N'){
          nontaxable += Number(record["rprice"]);
        }
      });
      cashierscreen["nontaxable"] = nontaxable;
      
      let surcharge = 0 , 
          discount = 0, 
          subtotal = cashierscreen["rsubtotal"], 
          tax = 0,
          actualTotal = 0,
          total = 0 
      
      //Calculate total of Full prices of line items.
      actualTotal = display.receipt.reduce((total, record) => {
        var num = Number(record["actualPrice"]);
        if (isNaN(num)) num = 0;
        return total + num;
        }, 0);
      
      
      //Apply Surcharges
      if(pjs.session["locationSurchargeDiscount"] == "S"){
        surcharge += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"]))
      }
      
      //Determine Taxation
      if(cashierscreen["customerTaxExempt"] == 'Y'){
          tax = 0
      }
      else if(pjs.session["locationTaxRate"])
      {
        tax = Number(pjs.session["locationTaxRate"]) * (Number(cashierscreen["rsubtotal"]) - Number(cashierscreen["nontaxable"]));
      }
      
      //Apply Discounts
      if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
        discount += actualTotal - Number(subtotal);
         subtotal = actualTotal
      }
      else if(cashierscreen["discountType"] == "Scrub" && Object.keys(cashierscreen["scrubApply"]).length !== 0){
        discount += Number(cashierscreen["scrubApply"]["value"])
      }
      else if(cashierscreen['discountType'] == 'Coupon'){
        discount += Number(coupon["coupon_discount"])
      }
      if(pjs.session["locationSurchargeDiscount"] == "D"){
        discount += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"])) 
      }
      
      //Calculate Totals
      let taxedTotal = Math.abs(subtotal) + Math.abs(tax)
      total = (Math.abs(taxedTotal) - Math.abs(discount) ) + surcharge
      
      
      cashierscreen["rsubtotal"] = Number(subtotal).toFixed(2)
      cashierscreen["discount"] = Number((Math.abs(discount))*(-1)).toFixed(2)
      cashierscreen["tax"] = Number(tax).toFixed(2)
      cashierscreen["total"] = Number(Math.abs(total)).toFixed(2)

      // 7. Set coupon amount on Cashier Screen
      Object.assign(cashierscreen, {
        "save_Disabled": false,
        "discount": coupon["coupon_discount"]
      });

      // 8. Show previous screen
      screenHistory.push("cashierscreen");
      activeScreen = screens["cashierscreen"];
      return;
    },

    "Companies Screen Initial": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Customer Not Selected Flag
      companies["customer_not_selected"] = true;
    },

    "Refresh Companies": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Distinct Company Records
      //This step will fetch all companies which can be displayed and load into companies grid on companies screen. 
      //This considers, company is not soft deleted, and is not on hold
      var _success = false;
      var _error = null;
      var _records = null;
      try {  
      let queryvalue = "SELECT "+
      "CORPORATECUSTOMERS.CORPCUSTKEY, "+
      "CORPORATECUSTOMERS.COMPANYNM, "+
      "CORPORATECUSTOMERS.ADDRESS, "+
      "CORPORATECUSTOMERS.CITY, "+
      "CORPORATECUSTOMERS.ZIP, "+
      "(SELECT COUNT(CORPORATETRUCKS.TRUCKNUMBER) "+
      "FROM CORPORATETRUCKS "+
      "WHERE CORPORATETRUCKS.CORPORATECUSTOMERSKEY=CORPORATECUSTOMERS.CORPCUSTKEY) AS TRUCKNUMBER, "+
      "(SELECT COUNT(CORPORATETRAILERS.TRAILERNUMBER) "+
      "FROM CORPORATETRAILERS "+
      "WHERE CORPORATETRAILERS.CORPORATECUSTOMERSKEY=CORPORATECUSTOMERS.CORPCUSTKEY) AS TRAILERNUMBER, "+
      "(SELECT STATENAME "+
      "FROM STATES "+
      "WHERE CORPORATECUSTOMERS.STATEKEY = STATES.STATEKEY) AS STATENAME "+
      "FROM CORPORATECUSTOMERS "+
      "WHERE CORPORATECUSTOMERS.DELETE <> ? AND CORPORATECUSTOMERS.ISONHOLD <> ? AND CORPORATECUSTOMERS.ISACTIVE <> ? "+
      "ORDER BY CORPORATECUSTOMERS.COMPANYNM ";
      
      _records = pjs.query(queryvalue, ['Y', 'Y', 'N']);
        _success = true;
      }
      catch (err) {
        _records = [];
        _error = err;
      }
      display.companies_grid.replaceRecords(_records);

      // 3. Clear Values
      Object.assign(companies, {
        "csearch": ""
      });
    },

    "Company search": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. No Search String?
      if (companies["csearch"] == '') {

        // 3. Show message box
        pjs.messageBox({
          title: ``,
          message: `Please enter name of company`
        });
      }

      // 4. Otherwise
      else {

        // 5. Company Search
        /*
          This step will search companies from corporatecustomers table in database. 
          Note: Search has been shifted to client side script for performance improvement. 
        */
        
        var _success = false;
        var _error = null;
        var _records = null;
        try {
          let queryvalue = "WITH ROWCTE AS ( "+
                          "SELECT ROW_NUMBER() OVER(PARTITION BY CORPORATECUSTOMERS.CORPCUSTKEY) AS ROWNO, "+
                          "CORPORATECUSTOMERS.CORPCUSTKEY, "+
                          "CORPORATECUSTOMERS.COMPANYNM, "+
                          "CORPORATECUSTOMERS.ADDRESS, "+
                          "CORPORATECUSTOMERS.CITY, "+
                          "CORPORATECUSTOMERS.ZIP, "+
                          "(SELECT COUNT(CORPORATETRUCKS.TRUCKNUMBER) "+
                          "FROM CORPORATETRUCKS "+
                          "WHERE CORPORATETRUCKS.CORPORATECUSTOMERSKEY=CORPORATECUSTOMERS.CORPCUSTKEY) AS TRUCKNUMBER, "+
                          "(SELECT COUNT(CORPORATETRAILERS.TRAILERNUMBER) "+
                          "FROM CORPORATETRAILERS "+
                          "WHERE CORPORATETRAILERS.CORPORATECUSTOMERSKEY=CORPORATECUSTOMERS.CORPCUSTKEY) AS TRAILERNUMBER "+
                          "FROM CORPORATECUSTOMERS  "+
                          ") "+
                          "SELECT ROWNO, CORPCUSTKEY, COMPANYNM, ADDRESS, CITY, ZIP, TRUCKNUMBER, TRAILERNUMBER FROM ROWCTE WHERE ROWCTE.ROWNO=1 "+
                          "AND UPPER(ROWCTE.companynm) LIKE UPPER('%"+companies["csearch"]+"%') "+
                          "OR UPPER(ROWCTE.address) LIKE UPPER('%"+companies["csearch"]+"%') "+
                          "OR UPPER(ROWCTE.city) LIKE UPPER('%"+companies["csearch"]+"%') "+
                          "OR UPPER(ROWCTE.zip) LIKE UPPER('%"+companies["csearch"]+"%') "+
                          "OR UPPER(ROWCTE.trucknumber) LIKE UPPER('%"+companies["csearch"]+"%') "+
                          "OR UPPER(ROWCTE.trailernumber) LIKE UPPER('%"+companies["csearch"]+"%') ";
        
          _records = pjs.query(queryvalue);
          _success = true;
        }
        catch (err) {
          _records = [];
          _error = err;
          console.log(err)
        }
        display.companies_grid.replaceRecords(_records);
        
      }
    },

    "Add Company": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Get Selected Company
      // var _success = true;
      // var _data = display.companies_grid.filter(entry => (entry["select_customer"] && entry["select_customer"] != '0'));
      // if (Array.isArray(_data)) _data = _data[0];
      // if (!_data) {
      //   _data = {};
      //   var _error = new Error("Record not found");
      //   _success = false;
      // }
      // var activeGridRecord = _data;

      // 3. Assign Selected Company on Cashier Screen
      // This step will assign selected company from companies screen on cashier screen. 
      cashierscreen["comp_name"] = activeGridRecord["corpcustkey"]
      cashierscreen["company_id"] = activeGridRecord["corpcustkey"]
      cashierscreen['company_name_value'] = activeGridRecord["companynm"]
      companies["csearch"] = ""

      // 4. Call Company Change 
      logic["Company Change"]();

      // 5. Show Cashierscreen
      screenHistory.push("cashierscreen");
      activeScreen = screens["cashierscreen"];
      return;
    },

    "Company Change": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Set Variables
      //Step will set customer related variables for specific preferences/settings of this customer
      
      var companyId = cashierscreen["comp_name"];
      var companyName = cashierscreen["comp_name_value"];
      var companyNotes = ""
      var companyDiscountType = "";
      var companyTracking = "";
      var PORequired = false;
      var tripRequired = false;
      var driverIdRequired = false;
      
      required_fields["ponum"] = ""
      required_fields["tripnum"] = ""
      required_fields["drvid"] = ""
      

      // 3. Company not selected from auto complete
      if (cashierscreen["comp_name"] == '') {

        // 4. Company Name Entered
        if (cashierscreen["company_name_value"] != '') {

          // 5. Fetch Company Record
          var _success = false;
          var _error = null;
          
          var _record = null;
          try {
            var _from = "CORPORATECUSTOMERS LEFT JOIN DISCOUNTTYPES ON CORPORATECUSTOMERS.DISCOUNTTYPESKEY = DISCOUNTTYPES.DTYPEKEY";
            var _filter = { 
              whereClause: `UCASE(companynm) = ? AND CORPORATECUSTOMERS.isactive <> ? AND CORPORATECUSTOMERS.delete <> ? AND CORPORATECUSTOMERS.isonhold <> ?`,
              values: [cashierscreen["company_name_value"].toString().toUpperCase(), 'N', 'Y', 'Y']
            };
            var _select = `DISCOUNTTYPES.type,CORPORATECUSTOMERS.corpcustkey,CORPORATECUSTOMERS.companynm,CORPORATECUSTOMERS.message_cashier,CORPORATECUSTOMERS.tracking,DISCOUNTTYPES.dtypekey,CORPORATECUSTOMERS.po_required,CORPORATECUSTOMERS.driveridrequired,CORPORATECUSTOMERS.tripnumberrequired,CORPORATECUSTOMERS.taxexempt,CORPORATECUSTOMERS.viewdisc,CORPORATECUSTOMERS.accountnbr,CORPORATECUSTOMERS.receiptqty,CORPORATECUSTOMERS.allwashes,CORPORATECUSTOMERS.currentponumber`;
          
            _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
            _success = true;
          }
          catch (err) {
            _error = err;
            console.error(err);
          }
          
          // If no record found
          if (!_record) {
            _record = {};
            _error = new Error("Record not found.")
            _success = false;
          }
          var companyRecord = _record;

          // 6. No Record
          if (typeof _success === "undefined" || !_success || !companyRecord || Object.keys(companyRecord).length == 0) {

            // 7. Set Focus
            cashierscreen["company_info_focus_on"] = "customer-company";
            

            // 8. Show message box
            pjs.messageBox({
              title: ``,
              message: `Company with "${cashierscreen["company_name_value"]}" not found`
            });

            // 9. Stop
            return;
          }

          // 10. Otherwise
          else {

            // 11. Company Settings
            var parms = {};
            parms["corporatecustomerskey"] = companyRecord["corpcustkey"];
            
            var _success = false;
            var _error = null;   
            var _results = null;
            
            try {
              var pjsModule = pjs.require("GetCustomerSettingsAndData.module.json");
              _results = pjsModule["Customer Settings"](parms);
              _success = true;
            }
            catch (err) {
              _error = err;
              console.error(err);
            }
            
            cashierscreen['company_name_value'] = _results ? _results["company_name_value"] : null;
            cashierscreen['comp_name'] = _results ? _results["comp_name"] : null;
            cashierscreen['customer_notes'] = _results ? _results["customer_notes"] : null;
            cashierscreen['customer_selected'] = _results ? _results["customer_selected"] : null;
            cashierscreen['customer_not_selected'] = _results ? _results["customer_not_selected"] : null;
            cashierscreen['checkoutDisabled'] = _results ? _results["checkoutDisabled"] : null;
            cashierscreen['couponVisible'] = _results ? _results["couponVisible"] : null;
            cashierscreen['scrubVisible'] = _results ? _results["scrubVisible"] : null;
            cashierscreen['save_Disabled'] = _results ? _results["save_Disabled"] : null;
            cashierscreen['allWashes'] = _results ? _results["allWashes"] : null;
            cashierscreen['discount_print'] = _results ? _results["discount_print"] : null;
            cashierscreen['receiptQty'] = _results ? _results["receiptQty"] : null;
            cashierscreen['customerTaxExempt'] = _results ? _results["customerTaxExempt"] : null;
            cashierscreen['custom_visible'] = _results ? _results["custom_visible"] : null;
            cashierscreen['customerNotesVisible'] = _results ? _results["customerNotesVisible"] : null;
            paymentscreen['openchargeOption'] = _results ? _results["openchargeOption"] : null;
            paymentscreen['restOfPaymentOptions'] = _results ? _results["restOfPaymentOptions"] : null;
            cashierscreen['valdiateTruck'] = _results ? _results["validateTruck"] : null;
            cashierscreen['validateTrailer'] = _results ? _results["validateTrailer"] : null;
            cashierscreen['has_requirements'] = _results ? _results["has_requirements"] : null;
            cashierscreen['po_required'] = _results ? _results["po_required"] : null;
            cashierscreen['driverId_required'] = _results ? _results["driverId_required"] : null;
            cashierscreen['tripNumber_required'] = _results ? _results["tripNumber_required"] : null;
            cashierscreen['scrub_disable'] = _results ? _results["scrub_disable"] : null;
            cashierscreen['coupon_disable'] = _results ? _results["coupon_disable"] : null;
            cashierscreen['discountType'] = _results ? _results["discountType"] : null;
            cashierscreen['scrubApply'] = _results ? _results["scrubApply"] : null;
            cashierscreen['discount_label'] = _results ? _results["discount_label"] : null;
            paymentscreen['discount_label'] = _results ? _results["payment_discount_label"] : null;
            cashierscreen['scrub_club_invoice'] = _results ? _results["scrub_club_invoice"] : null;
            cashierscreen['discountList'] = _results ? _results["discountList"] : null;
            cashierscreen['tractor_number'] = _results ? _results["tractor_number"] : null;
            cashierscreen['trailer_number'] = _results ? _results["trailer_number"] : null;
            cashierscreen['tractor_number_value'] = _results ? _results["tractor_number_value"] : null;
            cashierscreen['trailer_number_value'] = _results ? _results["trailer_number_value"] : null;
            cashierscreen['tractor_number_value_visible'] = _results ? _results["tractor_number_value_visible"] : null;
            cashierscreen['trailer_number_value_visible'] = _results ? _results["trailer_number_value_visible"] : null;
            cashierscreen['driverInfoKey'] = _results ? _results["driverInfoKey"] : null;
            cashierscreen['drvfname'] = _results ? _results["drvfname"] : null;
            cashierscreen['drvlname'] = _results ? _results["drvlname"] : null;
            cashierscreen['drvphone'] = _results ? _results["drvphone"] : null;
            cashierscreen['drveaddress'] = _results ? _results["drveaddress"] : null;
            cashierscreen['drvtruck'] = _results ? _results["drvtruck"] : null;
            cashierscreen['drvtrailer'] = _results ? _results["drvtrailer"] : null;
            required_fields['ponum'] = _results ? _results["ponum"] : null;
            required_fields['tripnum'] = _results ? _results["tripnum"] : null;
            required_fields['drvid'] = _results ? _results["drvid"] : null;
            cashierscreen['req_items'] = _results ? _results["req_items"] : null;
            cashierscreen['tracktor_disabled'] = _results ? _results["tracktor_disabled"] : null;
            cashierscreen['comp_name_disabled'] = _results ? _results["comp_name_disabled"] : null;
            cashierscreen['trailer_disabled'] = _results ? _results["trailer_disabled"] : null;
            paymentscreen['enablePaymentDue'] = _results ? _results["enablePaymentDue"] : null;

            // 12. Set Variables
            // /*
            //   This step loads customer preferences. 
            //   includes. 
            //   Discount types, Setting for Validate Tractor/Trailer, display all washes, PO numbers, 
            // */
            // 
            // //Setup company Information
            // companyId = companyRecord["corpcustkey"];
            // companyName = companyRecord["companynm"];
            // companyNotes = companyRecord["message_cashier"];
            // companyDiscountType = companyRecord["type"];
            // companyTracking = companyRecord["tracking"];
            // cashierscreen["discount_print"] =  companyRecord["viewdisc"];
            // cashierscreen['currentPO'] = companyRecord['currentponumber']
            // required_fields['ponum'] = ''
            // cashierscreen['allWashes'] = companyRecord['allwashes']
            // cashierscreen['receiptQty'] = Number(companyRecord['receiptqty'])
            // cashierscreen['custom_disabled'] = true
            // cashierscreen['custom_visible'] = false
            // 
            // cashierscreen["discountTypeKey"] = companyRecord["dtypekey"]
            // cashierscreen["customerTaxExempt"] = companyRecord["taxexempt"]
            // cashierscreen["has_requirements"] = false
            // 
            // cashierscreen['customerNotesVisible'] = false
            // paymentscreen['customerNotesVisible'] = false
            // 
            // if(companyNotes && companyNotes != '' && companyNotes != undefined && companyNotes != null){
            //   cashierscreen['customerNotesVisible'] = true
            //   paymentscreen['customerNotesVisible'] = true
            // }
            // 
            // //determine if we can provide open charge option
            // paymentscreen['openchargeOption'] = false
            // paymentscreen['restOfPaymentOptions'] = true
            // paymentscreen['enablePaymentDue'] = false
            // 
            // if(companyRecord['accountnbr'] && companyRecord['accountbnr'] != 0){
            //   paymentscreen['openchargeOption'] = true
            //   paymentscreen['restOfPaymentOptions'] = false
            // paymentscreen['enablePaymentDue'] = true
            // }
            // 
            // if(companyTracking != undefined)
            //   companyTracking = companyTracking.toUpperCase();
            // else    
            //   companyTracking = ""
            // 
            // //Setup Validation and Tracking
            // if(companyTracking === "BOTH"){
            //   cashierscreen["validateTruck"] = true
            //   cashierscreen["validateTrailer"] = true
            // }
            // else if(companyTracking === "TRACTOR"){
            //   cashierscreen["validateTruck"] = true
            //   cashierscreen["validateTrailer"] = false
            // }
            // else if(companyTracking === "TRAILER"){
            //   cashierscreen["validateTruck"] = false
            //   cashierscreen["validateTrailer"] = true
            // }
            // else{
            //   cashierscreen["validateTruck"] = false
            //   cashierscreen["validateTrailer"] = false
            // }
            // 
            // //Setup Discount Types
            // cashierscreen["discount_label"] = companyDiscountType;
            // 
            // if(companyDiscountType === "Coupon"){
            //   //disable Scrub club
            //   cashierscreen["scrub_disable"] = false
            //   cashierscreen["coupon_disable"] = false
            //   cashierscreen["scrubVisible"] = true
            //   cashierscreen["couponVisible"] = true  
            //   cashierscreen["discountType"] = "Coupon";
            // }
            // else if(companyDiscountType === "ScrubClub"){
            //   //Disable Coupon
            //   cashierscreen["discount_label"] = 'Scrub Club';
            //   cashierscreen["scrub_disable"] = false
            //   cashierscreen["coupon_disable"] = false  
            //   cashierscreen["scrubVisible"] = true
            //   cashierscreen["couponVisible"] = true  
            //   cashierscreen["discountType"] = "Scrub";
            // }
            // else if(companyDiscountType === "Percent"){
            //   //Disable Coupon + Scrub
            //   cashierscreen["scrub_disable"] = true
            //   cashierscreen["coupon_disable"] = true
            //   cashierscreen["scrubVisible"] = false
            //   cashierscreen["couponVisible"] = false  
            // 
            //   var discountList = []
            // 
            //   var discountQuery = "SELECT PRODUCTCATEGORYKEY, PERCENTAGE FROM DISCOUNTSPERCENTAGE WHERE CORPORATECUSTOMERSKEY = ?"
            //   var applicableDiscount = pjs.query(discountQuery, [companyId]);
            //   //assume that there will be only one record for case of zero prdcatkey
            //   if(applicableDiscount.length != 0){
            //     applicableDiscount = applicableDiscount[0]
            //     if(applicableDiscount['productcategorykey'] == 0){
            //       var discountableCategories = "SELECT CATEGORY FROM PRODUCTCATEGORY WHERE DISCOUNTABLE = ? AND DELETE <> ?"
            //       discountableCategories = pjs.query(discountableCategories, ['Y', 'Y'])
            //       discountList = discountableCategories.map((cat) => {
            //         return {
            //           ...cat,
            //           percentage: applicableDiscount['percentage']
            //         }
            //       })
            //     }
            //     else{
            //       var query = "SELECT DISCOUNTSPERCENTAGE.PERCENTAGE, PRODUCTCATEGORY.CATEGORY "+
            //                   "FROM DISCOUNTSPERCENTAGE "+
            //                   "INNER JOIN CORPORATECUSTOMERS ON DISCOUNTSPERCENTAGE.CORPORATECUSTOMERSKEY = CORPORATECUSTOMERS.CORPCUSTKEY "+
            //                   "INNER JOIN PRODUCTCATEGORY ON PRODUCTCATEGORY.PRDCATKEY = DISCOUNTSPERCENTAGE.PRODUCTCATEGORYKEY "+
            //                   "WHERE DISCOUNTSPERCENTAGE.CORPORATECUSTOMERSKEY = ? AND PRODUCTCATEGORY.DISCOUNTABLE = ? AND "+
            //                   "((CURRENT_TIMESTAMP BETWEEN timestamp(DISCOUNTSPERCENTAGE.EFFFROMDATE, DISCOUNTSPERCENTAGE.EFFFROMTIME)  AND timestamp(DISCOUNTSPERCENTAGE.EFFTODATE, DISCOUNTSPERCENTAGE.EFFTOTIME)) "+
            //                   "OR (CURRENT_TIMESTAMP > timestamp(DISCOUNTSPERCENTAGE.EFFFROMDATE, DISCOUNTSPERCENTAGE.EFFFROMTIME)  AND timestamp(DISCOUNTSPERCENTAGE.EFFTODATE, DISCOUNTSPERCENTAGE.EFFTOTIME)  IS NULL)); "
            //       discountList = pjs.query(query, [companyId, 'Y'])
            //     }
            //   }
            // 
            //   cashierscreen["discountType"] = "Percent";
            //   cashierscreen["discountList"] = discountList;
            // }
            // else if(companyDiscountType == "Sliding"){
            //   //Sliding Discount
            //   cashierscreen["scrub_disable"] = true
            //   cashierscreen["coupon_disable"] = true
            //   cashierscreen["scrubVisible"] = false
            //   cashierscreen["couponVisible"] = false   
            // 
            //   try{
            //     var query = "SELECT DISCOUNTSSLIDING.DSCSLIDEKEY, DISCOUNTSSLIDING.CORPORATECUSTOMERSKEY, DISCOUNTSSLIDING.PRODUCTCATEGORYKEY, "+
            //                 "DISCOUNTSSLIDING.VOLUMETYPE, DISCOUNTSSLIDING.VOLUMETHRESHOLD, DISCOUNTSSLIDING.TIMEPERIODSKEY, TIMEPERIODS.PERIOD, " +
            //                 "DISCOUNTSSLIDING.TIMEPERIODSQUANTITY, DISCOUNTSSLIDING.DISCOUNTPERCENTAGE as percentage " +
            //                 "FROM DISCOUNTSSLIDING " +
            //                 "LEFT JOIN TIMEPERIODS ON TIMEPERIODS.TIMEPERIODKEY = DISCOUNTSSLIDING.TIMEPERIODSKEY "+
            //                 "WHERE CURRENT_TIMESTAMP BETWEEN timestamp(EFFFROMDATE, EFFFROMTIME) AND timestamp(EFFTODATE, EFFTOTIME) "+ 
            //                 "AND CORPORATECUSTOMERSKEY = ? AND DISCOUNTSSLIDING.VOLUMEDISCOUNTELIGIBLE = ?; "
            //     var values = [companyId, 'Y']
            //     var discountList = pjs.query(query, values)
            //     if(Object.keys(discountList).length != 0){
            //       //Assume that all discount apply to same singular category
            //       var offset = discountList[0]["timeperiodsquantity"]+ " " +discountList[0]["period"].toUpperCase() + "S"
            //       var categoryKey = discountList[0]["productcategorykey"]
            //       query = "SELECT COALESCE(SUM(TRANSACTIONDETAILS.COST),0) as dollaramount, COALESCE(SUM(TRANSACTIONDETAILS.QUANTITY),0) as quantity "+ 
            //               "FROM TRANSACTIONSHEADER " +
            //               "INNER JOIN TRANSACTIONDETAILS ON TRANSACTIONSHEADER.TXHDRKEY = TRANSACTIONDETAILS.TXHDRKEY "+
            //               "INNER JOIN PRODUCTS ON TRANSACTIONDETAILS.PRODUCTSKEY = PRODUCTS.PRDKEY "+
            //               "INNER JOIN PRODUCTCATEGORY ON PRODUCTCATEGORY.PRDCATKEY = PRODUCTS.PRODUCTCATEGORYKEY "+
            //               "WHERE TRANSACTIONSHEADER.CORPORATECUSTOMERSKEY = ? "+
            //               "AND TRANSACTIONSHEADER.STATUS = ? "+
            //               "AND (TRANSACTIONSHEADER.SOFTDELETE <> ? OR TRANSACTIONSHEADER.SOFTDELETE IS NULL) "+
            //               "AND (TRANSACTIONDETAILS.DELETE <> ? OR TRANSACTIONDETAILS.DELETE IS NULL) " +
            //               "AND TRANSACTIONSHEADER.LOCALTS1 >= (timestamp(CURRENT_DATE) - "+offset+");"
            //       values = [companyId, 'Sale', 'Y', 'Y']
            //       var eligibleValues = pjs.query(query, values)
            //       if(Object.keys(eligibleValues).length !== 0 && eligibleValues[0]["quantity"] != null && eligibleValues[0]["dollaramount"] != null){
            //         eligibleValues = eligibleValues[0]
            //         //assume that discount type will be same for all discounts
            // 
            //         if(discountList[0]["volumetype"] == "Quantity"){
            //           discountList = discountList.filter((rec) => {
            //             return rec["volumethreshold"] <= eligibleValues["quantity"]
            //           })
            //         }
            //         else if(discountList[0]["volumetype"] == "DollarAmount"){
            //           discountList = discountList.filter((rec) => {
            //             return rec["volumethreshold"] <= eligibleValues["dollaramount"]
            //           })
            //         }
            //         if(discountList.length != 0){
            //           discountList.sort((a,b) => Number(b["volumethreshold"]) - Number(a["volumethreshold"]))
            //           discountList = [discountList[0]]
            //           var applicableCat = "SELECT  PRDCATKEY, CATEGORY FROM PRODUCTCATEGORY WHERE DISCOUNTABLE = ? AND DELETE <> ? "
            //           applicableCat = pjs.query(applicableCat, ['Y', 'Y'])
            // 
            //           if(applicableCat.length != 0){
            //             discountList = applicableCat.map((cat) => {
            //               return {
            //                 ...cat,
            //                 percentage: discountList[0]['percentage']
            //               }
            //             })
            //           }
            //           else{
            //             //No Applicable categories
            //             discountList = []
            //           }
            //         }
            //       }
            //       else{
            //         discountList = []
            //         //threshold records not found
            //       }
            //     }
            //     else{
            //       discountList = []
            //       //no discounts found
            //     }
            //     cashierscreen["discountType"] = "Sliding";
            //     cashierscreen["discountList"] = discountList;
            //   }
            //   catch(e){
            //     //Error in Setting up sliding discounts
            //   }
            // 
            // }
            // else{
            //   //No discounts
            //   cashierscreen["scrub_disable"] = true
            //   cashierscreen["coupon_disable"] = true
            //   cashierscreen["scrubVisible"] = false
            //   cashierscreen["couponVisible"] = false   
            //   cashierscreen["discountType"] = "";
            //   cashierscreen["discountList"] = [];
            // }
            // 
            // 
            // 
            // //Should be same table different value or number applicability. 
            // 
            // // Required items
            // cashierscreen["po_option"] =companyRecord["po_required"]
            // var requiredItems = []
            // if(companyRecord["po_required"] == 'Y'){
            //   cashierscreen["po_required"] = true
            //   required_fields['ponum'] = cashierscreen['currentPO']
            // 
            //   requiredItems.push("PO#")
            //   cashierscreen["has_requirements"] = true
            // }
            // if(companyRecord['driveridrequired'] == 'Y'){
            //   cashierscreen["driverId_required"] = true
            //   requiredItems.push("Driver ID")
            //   cashierscreen["has_requirements"] = true
            // }
            // if(companyRecord['tripnumberrequired'] == 'Y'){
            //   cashierscreen["tripNumber_required"] = true
            //   requiredItems.push("Trip #")
            //   cashierscreen["has_requirements"] = true
            // }
            // cashierscreen["req_items"] = "Required : " + requiredItems.toString()
          }
        }

        // 13. Company name not entered
        else {

          // 14. Reset Screen Fields
          Object.assign(cashierscreen, {
            "customerNotesVisible": false,
            "customer_not_selected": true,
            "custom_disabled": false,
            "couponVisible": false,
            "scrubVisible": false
          });

          // 15. Clear Products Grid
          display.products.clear();

          // 16. Disable Search and Filter
          cashierscreen["product_filter_disabled"] = true;
          cashierscreen["product_search_disabled"] = true;

          // 17. Stop
          return;
        }
      }

      // 18. Company Selected from Auto Complete
      else {

        // 19. Company Settings
        var parms = {};
        parms["corporatecustomerskey"] = cashierscreen['comp_name'];
        
        var _success = false;
        var _error = null;   
        var _results = null;
        
        try {
          var pjsModule = pjs.require("GetCustomerSettingsAndData.module.json");
          _results = pjsModule["Customer Settings"](parms);
          _success = true;
        }
        catch (err) {
          _error = err;
          console.error(err);
        }
        
        cashierscreen['company_name_value'] = _results ? _results["company_name_value"] : null;
        cashierscreen['comp_name'] = _results ? _results["comp_name"] : null;
        cashierscreen['customer_notes'] = _results ? _results["customer_notes"] : null;
        cashierscreen['customer_selected'] = _results ? _results["customer_selected"] : null;
        cashierscreen['customer_not_selected'] = _results ? _results["customer_not_selected"] : null;
        cashierscreen['checkoutDisabled'] = _results ? _results["checkoutDisabled"] : null;
        cashierscreen['couponVisible'] = _results ? _results["couponVisible"] : null;
        cashierscreen['scrubVisible'] = _results ? _results["scrubVisible"] : null;
        cashierscreen['save_Disabled'] = _results ? _results["save_Disabled"] : null;
        cashierscreen['allWashes'] = _results ? _results["allWashes"] : null;
        cashierscreen['discount_print'] = _results ? _results["discount_print"] : null;
        cashierscreen['receiptQty'] = _results ? _results["receiptQty"] : null;
        cashierscreen['customerTaxExempt'] = _results ? _results["customerTaxExempt"] : null;
        cashierscreen['custom_visible'] = _results ? _results["custom_visible"] : null;
        cashierscreen['customerNotesVisible'] = _results ? _results["customerNotesVisible"] : null;
        paymentscreen['openchargeOption'] = _results ? _results["openchargeOption"] : null;
        paymentscreen['restOfPaymentOptions'] = _results ? _results["restOfPaymentOptions"] : null;
        cashierscreen['valdiateTruck'] = _results ? _results["validateTruck"] : null;
        cashierscreen['validateTrailer'] = _results ? _results["validateTrailer"] : null;
        cashierscreen['has_requirements'] = _results ? _results["has_requirements"] : null;
        cashierscreen['po_required'] = _results ? _results["po_required"] : null;
        cashierscreen['driverId_required'] = _results ? _results["driverId_required"] : null;
        cashierscreen['tripNumber_required'] = _results ? _results["tripNumber_required"] : null;
        cashierscreen['scrub_disable'] = _results ? _results["scrub_disable"] : null;
        cashierscreen['coupon_disable'] = _results ? _results["coupon_disable"] : null;
        cashierscreen['discountType'] = _results ? _results["discountType"] : null;
        cashierscreen['scrubApply'] = _results ? _results["scrubApply"] : null;
        cashierscreen['discount_label'] = _results ? _results["discount_label"] : null;
        paymentscreen['discount_label'] = _results ? _results["payment_discount_label"] : null;
        cashierscreen['scrub_club_invoice'] = _results ? _results["scrub_club_invoice"] : null;
        cashierscreen['discountList'] = _results ? _results["discountList"] : null;
        cashierscreen['tractor_number'] = _results ? _results["tractor_number"] : null;
        cashierscreen['trailer_number'] = _results ? _results["trailer_number"] : null;
        cashierscreen['tractor_number_value'] = _results ? _results["tractor_number_value"] : null;
        cashierscreen['trailer_number_value'] = _results ? _results["trailer_number_value"] : null;
        cashierscreen['tractor_number_value_visible'] = _results ? _results["tractor_number_value_visible"] : null;
        cashierscreen['trailer_number_value_visible'] = _results ? _results["trailer_number_value_visible"] : null;
        cashierscreen['driverInfoKey'] = _results ? _results["driverInfoKey"] : null;
        cashierscreen['drvfname'] = _results ? _results["drvfname"] : null;
        cashierscreen['drvlname'] = _results ? _results["drvlname"] : null;
        cashierscreen['drvphone'] = _results ? _results["drvphone"] : null;
        cashierscreen['drveaddress'] = _results ? _results["drveaddress"] : null;
        cashierscreen['drvtruck'] = _results ? _results["drvtruck"] : null;
        cashierscreen['drvtrailer'] = _results ? _results["drvtrailer"] : null;
        required_fields['ponum'] = _results ? _results["ponum"] : null;
        required_fields['tripnum'] = _results ? _results["tripnum"] : null;
        required_fields['drvid'] = _results ? _results["drvid"] : null;
        cashierscreen['req_items'] = _results ? _results["req_items"] : null;
        cashierscreen['tracktor_disabled'] = _results ? _results["tracktor_disabled"] : null;
        cashierscreen['comp_name_disabled'] = _results ? _results["comp_name_disabled"] : null;
        cashierscreen['trailer_disabled'] = _results ? _results["trailer_disabled"] : null;
        paymentscreen['enablePaymentDue'] = _results ? _results["enablePaymentDue"] : null;

        // 20. Get Company Record
        // var _success = false;
        // var _error = null;
        // 
        // var _record = null;
        // try {
        //   var _from = "CORPORATECUSTOMERS LEFT JOIN DISCOUNTTYPES ON CORPORATECUSTOMERS.DISCOUNTTYPESKEY = DISCOUNTTYPES.DTYPEKEY";
        //   var _filter = { 
        //     whereClause: `CORPORATECUSTOMERS.corpcustkey = ? AND CORPORATECUSTOMERS.isactive <> ? AND CORPORATECUSTOMERS.isonhold <> ? AND CORPORATECUSTOMERS.delete <> ?`,
        //     values: [cashierscreen["comp_name"], 'N', 'Y', 'Y']
        //   };
        //   var _select = `DISCOUNTTYPES.type,CORPORATECUSTOMERS.corpcustkey,CORPORATECUSTOMERS.companynm,CORPORATECUSTOMERS.message_cashier,DISCOUNTTYPES.dtypekey,CORPORATECUSTOMERS.tracking,CORPORATECUSTOMERS.po_required,CORPORATECUSTOMERS.driveridrequired,CORPORATECUSTOMERS.tripnumberrequired,CORPORATECUSTOMERS.taxexempt,CORPORATECUSTOMERS.viewdisc,CORPORATECUSTOMERS.accountnbr,CORPORATECUSTOMERS.receiptqty,CORPORATECUSTOMERS.allwashes,CORPORATECUSTOMERS.currentponumber`;
        // 
        //   _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
        //   _success = true;
        // }
        // catch (err) {
        //   _error = err;
        //   console.error(err);
        // }
        // 
        // // If no record found
        // if (!_record) {
        //   _record = {};
        //   _error = new Error("Record not found.")
        //   _success = false;
        // }
        // var companyRecord = _record;

        // 21. Set Variables
        // /*
        //   This step is just in else clause for company related specific preferences. 
        //   loads, discounts, all washes, validation and required items etc. 
        //   this step will execute if the company was selected from autocomplete box instead of typing in the full name manually. 
        // */
        // 
        // companyId = companyRecord["corpcustkey"];
        // companyName = companyRecord["companynm"];
        // companyNotes = companyRecord["message_cashier"];
        // companyDiscountType = companyRecord["type"];
        // companyTracking = companyRecord["tracking"];
        // cashierscreen["discount_print"] =  companyRecord["viewdisc"];
        // cashierscreen['currentPO'] = companyRecord['currentponumber']
        // required_fields['ponum'] = ''
        // 
        // cashierscreen['receiptQty'] = Number(companyRecord['receiptqty'])
        // cashierscreen['allWashes'] = companyRecord['allwashes']
        // cashierscreen['custom_disabled'] = true
        // cashierscreen['custom_visible'] = false
        // 
        // cashierscreen["discountTypeKey"] = companyRecord["dtypekey"]
        // cashierscreen["customerTaxExempt"] = companyRecord["taxexempt"]
        // cashierscreen["has_requirements"] = false
        // 
        // 
        // cashierscreen['customerNotesVisible'] = false
        // paymentscreen['customerNotesVisible'] = false
        // 
        // if(companyNotes && companyNotes != '' && companyNotes != undefined && companyNotes != null){
        //   cashierscreen['customerNotesVisible'] = true
        //   paymentscreen['customerNotesVisible'] = true
        // }
        // 
        // //determine if we can provide open charge option
        // paymentscreen['openchargeOption'] = false
        // paymentscreen['restOfPaymentOptions'] = true
        // paymentscreen['enablePaymentDue'] = false
        // 
        // if(companyRecord['accountnbr'] && companyRecord['accountbnr'] != 0){
        //   paymentscreen['openchargeOption'] = true
        //   paymentscreen['restOfPaymentOptions'] = false
        //   paymentscreen['enablePaymentDue'] = true
        // }
        // 
        // if(companyTracking != undefined)
        //   companyTracking = companyTracking.toUpperCase();
        // else    
        //   companyTracking = ""
        //   
        // //Setup Validation and Tracking
        // if(companyTracking === "BOTH"){
        //   cashierscreen["validateTruck"] = true
        //   cashierscreen["validateTrailer"] = true  
        // }
        // else if(companyTracking === "TRACTOR"){
        //   cashierscreen["validateTruck"] = true
        //   cashierscreen["validateTrailer"] = false
        // }
        // else if(companyTracking === "TRAILER"){
        //   cashierscreen["validateTruck"] = false
        //   cashierscreen["validateTrailer"] = true
        // }
        // else{
        //   cashierscreen["validateTruck"] = false
        //   cashierscreen["validateTrailer"] = false
        // }
        // 
        // //Setup Discounts
        // cashierscreen["discount_label"] = companyDiscountType;
        // if(companyDiscountType === "Coupon"){
        //   //disable Scrub club
        //   cashierscreen["scrub_disable"] = false
        //   cashierscreen["coupon_disable"] = false
        //   cashierscreen["scrubVisible"] = true
        //   cashierscreen["couponVisible"] = true  
        //   cashierscreen["discountType"] = "Coupon";
        // }
        // else if(companyDiscountType === "ScrubClub"){
        //   //Disable Coupon
        //   cashierscreen["discount_label"] = 'Scrub Club';
        //   cashierscreen["scrub_disable"] = false
        //   cashierscreen["coupon_disable"] = false  
        //   cashierscreen["scrubVisible"] = true
        //   cashierscreen["couponVisible"] = true  
        //   cashierscreen["discountType"] = "Scrub";
        // }
        // else if(companyDiscountType === "Percent"){
        //   //Disable Coupon + Scrub
        //   cashierscreen["scrub_disable"] = true
        //   cashierscreen["coupon_disable"] = true
        //   cashierscreen["scrubVisible"] = false
        //   cashierscreen["couponVisible"] = false   
        // 
        //   var discountList = []
        // 
        //   var discountQuery = "SELECT PRODUCTCATEGORYKEY, PERCENTAGE FROM DISCOUNTSPERCENTAGE WHERE CORPORATECUSTOMERSKEY = ?"
        //   var applicableDiscount = pjs.query(discountQuery, [companyId]);
        //   //assume that there will be only one record for case of zero prdcatkey
        //   if(applicableDiscount.length != 0){
        //     applicableDiscount = applicableDiscount[0]
        //     if(applicableDiscount['productcategorykey'] == 0){
        //       var discountableCategories = "SELECT CATEGORY FROM PRODUCTCATEGORY WHERE DISCOUNTABLE = ? AND DELETE <> ?"
        //       discountableCategories = pjs.query(discountableCategories, ['Y', 'Y'])
        //       discountList = discountableCategories.map((cat) => {
        //         return {
        //           ...cat,
        //           percentage: applicableDiscount['percentage']
        //         }
        //       })
        //     }
        //     else{
        //       var query = "SELECT DISCOUNTSPERCENTAGE.PERCENTAGE, PRODUCTCATEGORY.CATEGORY "+
        //                   "FROM DISCOUNTSPERCENTAGE "+
        //                   "INNER JOIN CORPORATECUSTOMERS ON DISCOUNTSPERCENTAGE.CORPORATECUSTOMERSKEY = CORPORATECUSTOMERS.CORPCUSTKEY "+
        //                   "INNER JOIN PRODUCTCATEGORY ON PRODUCTCATEGORY.PRDCATKEY = DISCOUNTSPERCENTAGE.PRODUCTCATEGORYKEY "+
        //                   "WHERE DISCOUNTSPERCENTAGE.CORPORATECUSTOMERSKEY = ? AND PRODUCTCATEGORY.DISCOUNTABLE = ? AND "+
        //                   "((CURRENT_TIMESTAMP BETWEEN timestamp(DISCOUNTSPERCENTAGE.EFFFROMDATE, DISCOUNTSPERCENTAGE.EFFFROMTIME)  AND timestamp(DISCOUNTSPERCENTAGE.EFFTODATE, DISCOUNTSPERCENTAGE.EFFTOTIME)) "+
        //                   "OR (CURRENT_TIMESTAMP > timestamp(DISCOUNTSPERCENTAGE.EFFFROMDATE, DISCOUNTSPERCENTAGE.EFFFROMTIME)  AND timestamp(DISCOUNTSPERCENTAGE.EFFTODATE, DISCOUNTSPERCENTAGE.EFFTOTIME)  IS NULL)); "
        //       discountList = pjs.query(query, [companyId, 'Y'])
        //     }
        //   }
        //   cashierscreen["discountType"] = "Percent";
        //   cashierscreen["discountList"] = discountList;
        // }
        // else if(companyDiscountType == "Sliding"){
        //   //Discount Sliding - disable Coupon + Scrub
        //   cashierscreen["scrub_disable"] = true
        //   cashierscreen["coupon_disable"] = true
        //   cashierscreen["scrubVisible"] = false
        //   cashierscreen["couponVisible"] = false   
        // 
        //   try{
        //     var query = "SELECT DISCOUNTSSLIDING.DSCSLIDEKEY, DISCOUNTSSLIDING.CORPORATECUSTOMERSKEY, DISCOUNTSSLIDING.PRODUCTCATEGORYKEY, "+
        //                 "DISCOUNTSSLIDING.VOLUMETYPE, DISCOUNTSSLIDING.VOLUMETHRESHOLD, DISCOUNTSSLIDING.TIMEPERIODSKEY, TIMEPERIODS.PERIOD, " +
        //                 "DISCOUNTSSLIDING.TIMEPERIODSQUANTITY, DISCOUNTSSLIDING.DISCOUNTPERCENTAGE as percentage " +
        //                 "FROM DISCOUNTSSLIDING " +
        //                 "LEFT JOIN TIMEPERIODS ON TIMEPERIODS.TIMEPERIODKEY = DISCOUNTSSLIDING.TIMEPERIODSKEY "+
        //                 "WHERE CURRENT_TIMESTAMP BETWEEN timestamp(EFFFROMDATE, EFFFROMTIME) AND timestamp(EFFTODATE, EFFTOTIME) "+ 
        //                 "AND CORPORATECUSTOMERSKEY = ? AND DISCOUNTSSLIDING.VOLUMEDISCOUNTELIGIBLE = ?; "
        //     var values = [companyId, 'Y']
        //     var discountList = pjs.query(query, values)
        //     if(Object.keys(discountList).length != 0){
        //       //Assume that all discount apply to same singular category
        //       var offset = discountList[0]["timeperiodsquantity"]+ " " +discountList[0]["period"].toUpperCase() + "S"
        //       var categoryKey = discountList[0]["productcategorykey"]
        //       query = "SELECT COALESCE(SUM(TRANSACTIONDETAILS.COST),0) as dollaramount, COALESCE(SUM(TRANSACTIONDETAILS.QUANTITY),0) as quantity "+ 
        //               "FROM TRANSACTIONSHEADER " +
        //               "INNER JOIN TRANSACTIONDETAILS ON TRANSACTIONSHEADER.TXHDRKEY = TRANSACTIONDETAILS.TXHDRKEY "+
        //               "INNER JOIN PRODUCTS ON TRANSACTIONDETAILS.PRODUCTSKEY = PRODUCTS.PRDKEY "+
        //               "INNER JOIN PRODUCTCATEGORY ON PRODUCTCATEGORY.PRDCATKEY = PRODUCTS.PRODUCTCATEGORYKEY "+
        //               "WHERE TRANSACTIONSHEADER.CORPORATECUSTOMERSKEY = ? "+
        //               "AND TRANSACTIONSHEADER.STATUS = ? "+
        //               "AND (TRANSACTIONSHEADER.SOFTDELETE <> ? OR TRANSACTIONSHEADER.SOFTDELETE IS NULL) "+
        //               "AND (TRANSACTIONDETAILS.DELETE <> ? OR TRANSACTIONDETAILS.DELETE IS NULL) " +
        //               "AND TRANSACTIONSHEADER.LOCALTS1 >= (timestamp(CURRENT_DATE) - "+offset+");"
        //       values = [companyId, 'Sale', 'Y', 'Y']
        //       var eligibleValues = pjs.query(query, values)
        //       if(Object.keys(eligibleValues).length !== 0 && eligibleValues[0]["quantity"] != null && eligibleValues[0]["dollaramount"] != null){
        //         eligibleValues = eligibleValues[0]
        //         //assume that discount type will be same for all discounts
        // 
        //         if(discountList[0]["volumetype"] == "Quantity"){
        //           discountList = discountList.filter((rec) => {
        //             return rec["volumethreshold"] <= eligibleValues["quantity"]
        //           })
        //         }
        //         else if(discountList[0]["volumetype"] == "DollarAmount"){
        //           discountList = discountList.filter((rec) => {
        //             return rec["volumethreshold"] <= eligibleValues["dollaramount"]
        //           })
        //         }
        // 
        //         if(discountList.length != 0){
        //           discountList.sort((a,b) => Number(b["volumethreshold"]) - Number(a["volumethreshold"]))
        //           discountList = [discountList[0]]
        // 
        //           var applicableCat = "SELECT  PRDCATKEY, CATEGORY FROM PRODUCTCATEGORY WHERE DISCOUNTABLE = ? AND DELETE <> ? "
        //           applicableCat = pjs.query(applicableCat, ['Y', 'Y'])
        //           if(applicableCat.length != 0){
        //             discountList = applicableCat.map((cat) => {
        //               return {
        //                 ...cat,
        //                 percentage: discountList[0]['percentage']
        //               }
        //             })
        //           }
        //           else{
        //             //No Applicable categories
        //             discountList = []
        //           }
        //         }
        //         //After reduction applying threshold
        //       }
        //       else{
        //         discountList = []
        //         //Threshold records not found
        //       }
        //     }
        //     else{
        //       discountList = []
        //       //No discounts found
        //     }
        //   cashierscreen["discountType"] = "Sliding";
        //   cashierscreen["discountList"] = discountList;
        // 
        //   }
        //   catch(e){
        //     //Error in Setting up sliding discounts
        //   }
        // 
        // }
        // 
        // else{
        //     //No discounts
        //     cashierscreen["scrub_disable"] = true
        //     cashierscreen["coupon_disable"] = true
        //     cashierscreen["scrubVisible"] = false
        //     cashierscreen["couponVisible"] = false   
        //     cashierscreen["discountType"] = "";
        //     cashierscreen["discountList"] = [];
        //   }
        // 
        // 
        // // Required items
        // cashierscreen["po_option"] =companyRecord["po_required"]
        // var requiredItems = []
        // if(companyRecord["po_required"] == 'Y'){
        //   cashierscreen["po_required"] = true
        //   requiredItems.push("PO#")
        //   required_fields['ponum'] = cashierscreen['currentPO']
        //   cashierscreen["has_requirements"] = true
        // }
        // else{
        //   cashierscreen["po_required"] = false
        // }
        // if(companyRecord['driveridrequired'] == 'Y'){
        //   cashierscreen["driverId_required"] = true
        //   requiredItems.push("Driver ID")
        //   cashierscreen["has_requirements"] = true
        // }
        // else{
        //   cashierscreen["driverId_required"] = false
        // }
        // if(companyRecord['tripnumberrequired'] == 'Y'){
        //   cashierscreen["tripNumber_required"] = true
        //   requiredItems.push("Trip #")
        //   cashierscreen["has_requirements"] = true
        // }
        // else{
        //   cashierscreen["tripNumber_required"] = false
        // }
        // 
        // cashierscreen["req_items"] = "Required : " + requiredItems.toString()
      }

      // 22. Get Products
      var parms = {};
      parms["corporatecustomerskey"] = cashierscreen['comp_name'];
      parms["discountType"] = cashierscreen['discountType'];
      parms["discountList"] = cashierscreen['discountList'];
      parms["locationsKey"] = pjs.session['locationsKey'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetProducts.module.json");
        _results = pjsModule["Get Products"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var error = _results ? _results["error"] : null;
      var errorMessage = _results ? _results["message"] : null;
      var products = _results ? _results["products"] : null;
      cashierscreen['product_category_options'] = _results ? _results["product_category_options"] : null;
      cashierscreen['product_filter_disabled'] = _results ? _results["product_filter_disabled"] : null;
      cashierscreen['product_search_disabled'] = _results ? _results["product_search_disabled"] : null;

      // 23. Error?
      if (error && error != '0') {

        // 24. Display Error
        pjs.messageBox({
          title: ``,
          message: `${errorMessage}`
        });
      }

      // 25. Load Products
      display.products.replaceRecords(products);

      // 26. Get Products
      // 
      // var _success = false;
      // var _error = null;
      // 
      // var products = null;
      // try {
      //   var specificProducts = "SELECT PRODUCTS.PRDKEY,PRODUCTS.product, PRODUCTS.taxable ,PRODUCTCATEGORY.category, PRODUCTCATEGORY.DISCOUNTABLE, PRODUCTPRICE.price" +
      //               ", PRODUCTS.GIVESCRUBCLUBFORTHISITEM, PRODUCTS.REDEEMSCRUBCLUBONTHISITEM, IMAGES.IMAGEURL, LOCCATTAX.TAXABLE AS LOCTAXABLE, LOCCATTAX.LOCTNKEY AS LOCLOCATION, PRODUCTS.PRCMODELG "+
      //               "FROM CORPCUSTPRODOPT "+
      //               "LEFT JOIN PRODUCTS ON PRODUCTS.PRDKEY = CORPCUSTPRODOPT.PRODUCTSKEY " +
      //               "LEFT JOIN PRODUCTCATEGORY ON PRODUCTS.PRODUCTCATEGORYKEY = PRODUCTCATEGORY.PRDCATKEY " +
      //               "LEFT JOIN PRODUCTPRICE ON PRODUCTS.PRDKEY = PRODUCTPRICE.PRODUCTSKEY " +
      //               "LEFT JOIN IMAGES ON IMAGES.IMAGEKEY= PRODUCTS.IMAGEKEY " +
      //               "LEFT JOIN WASHTYPES ON PRODUCTS.WASHTYPESKEY = WASHTYPES.WASHTYPKEY " +
      //               "LEFT JOIN LOCCATTAX ON PRODUCTCATEGORY.PRDCATKEY = LOCCATTAX.PRDCATKEY AND LOCCATTAX.LOCTNKEY = ? "+
      //               "WHERE (PRODUCTS.DELETE = ? OR PRODUCTS.DELETE IS NULL) " +
      //               "AND CORPCUSTPRODOPT.CCKEY = ? " +
      //               "ORDER BY PRODUCTS.PRODUCT "
      // 
      //   var allProducts = "SELECT PRODUCTS.PRDKEY,PRODUCTS.product, PRODUCTS.taxable ,PRODUCTCATEGORY.category, PRODUCTCATEGORY.DISCOUNTABLE, PRODUCTPRICE.price" +
      //               ", PRODUCTS.GIVESCRUBCLUBFORTHISITEM, PRODUCTS.REDEEMSCRUBCLUBONTHISITEM, IMAGES.IMAGEURL, LOCCATTAX.TAXABLE AS LOCTAXABLE, LOCCATTAX.LOCTNKEY AS LOCLOCATION, PRODUCTS.PRCMODELG "+
      //               "FROM PRODUCTS INNER JOIN PRODUCTCATEGORY ON PRODUCTS.PRODUCTCATEGORYKEY = PRODUCTCATEGORY.PRDCATKEY " +
      //               "LEFT JOIN PRODUCTPRICE ON PRODUCTS.PRDKEY = PRODUCTPRICE.PRODUCTSKEY " +
      //               "LEFT JOIN IMAGES ON IMAGES.IMAGEKEY= PRODUCTS.IMAGEKEY " +
      //               "LEFT JOIN WASHTYPES ON PRODUCTS.WASHTYPESKEY = WASHTYPES.WASHTYPKEY " +
      //               "LEFT JOIN LOCCATTAX ON PRODUCTCATEGORY.PRDCATKEY = LOCCATTAX.PRDCATKEY AND LOCCATTAX.LOCTNKEY = ? "+
      //               "WHERE (PRODUCTS.DELETE = ? OR PRODUCTS.DELETE IS NULL) " +
      //               "AND PRODUCTCATEGORY.PRDCATKEY NOT IN " +
      //               "(SELECT PRODUCTCATEGORYKEY FROM CORPCUSTCATEGORY WHERE CORPORATECUSTOMERSKEY = ? AND INCLUDEEXCLUDE = ? AND DELETE = ?) ORDER BY PRODUCTS.PRODUCT"
      // 
      // 
      //   specificProducts = pjs.query(specificProducts, [pjs.session['locationsKey'], 'N', companyId])
      //   
      //   if(specificProducts.length == 0 || specificProducts == null){
      //     allProducts = pjs.query(allProducts, [pjs.session['locationsKey'],'N', companyId, 'E', 'N'])
      //     products = allProducts
      //     cashierscreen['allWashes'] = 'Y'
      //   }
      //   else{
      //     products = specificProducts
      //     cashierscreen['allWashes'] = 'N'
      //   }
      //   _success = true;
      // }
      // catch (err) {
      //   products = [];
      //   _error = err;
      // }
      // 

      // 27. Site Restrictions Products
      // 
      // try {
      //   var siteRestrictions = "SELECT CCSITRESTKEY, CCKEY, PRODUCTKEY, LOCATIONSKEY "+
      //                          "FROM CCPRODOPTSSITEREST "+
      //                          "WHERE CCKEY = ? " +
      //                          "AND (DELETE <> ? OR DELETE IS NULL) "
      // 
      //   siteRestrictions = pjs.query(siteRestrictions, [companyId, 'Y'])
      //   if(siteRestrictions.length != 0 && siteRestrictions != null && siteRestrictions != undefined){
      //     //site restrictions exist. 
      //     let positiveList = siteRestrictions.filter(item => item['locationskey'] == pjs.session['locationsKey'])
      //     let negativeList = siteRestrictions.filter(item => item['locationskey'] != pjs.session['locationsKey'])
      //     negativeList = negativeList.filter(item => positiveList.filter(item1 => item1['productkey'] == item['productkey']).length == 0)
      //     products = products.filter(product => negativeList.filter(item => item['productkey'] == product['prdkey']).length == 0)
      //   }
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      // }

      // 28. Load Products
      // 
      // if(products.length == 0){
      //   pjs.messageBox({
      //     message: 'No products valid for this customer at this location'
      //   })
      // }
      // 
      // //Categories of products
      // var categories = Array.from(new Set(products.map((rec) => {return rec["category"]})))
      // 
      // //Discount and Icon configuration
      // products = products.map((rec) => {
      //   //hide truck icon
      //   if(rec["imageurl"] != null && rec["imageurl"] != undefined && rec["imageurl"] != ""){
      //     rec["truckIconVisible"] = true
      //   }
      //   else{
      //     rec["truckIconVisible"] = false
      //   }
      //   if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
      //     var discountItem = cashierscreen["discountList"];
      //     if((Object.keys(discountItem).length != 0) && rec['discountable'] == 'Y'){
      //       //item price has discount
      //       let discountvalue = discountItem.filter((item) => item['category'] == rec['category'])
      //       if(discountvalue.length != 0){
      //         rec["discountPrice"] = Number(rec["price"]) * (1-Number(discountvalue[0]["percentage"]))
      //       }
      //       //is not discountable
      //       else{
      //         rec["discountPrice"] = Number(rec["price"])
      //       }
      //     }
      //     //is not discountable
      //     else{
      //       rec["discountPrice"] = Number(rec["price"])
      //     }
      //   }
      //   //is not discountable
      //   else{
      //     rec["discountPrice"] = Number(rec["price"])
      //   }
      //   return rec
      // })
      // 
      // //Order by name of product
      // products.sort((a, b) =>  a['product'] < b['product'])
      // 
      // //Load Products
      // display.products.replaceRecords(products);
      // 
      // //Categories assignment
      // categories.push("N/A")
      // categories.sort()
      // cashierscreen['product_category_options'] = categories;
      // 
      // //Product grid controls. 
      // cashierscreen["product_filter_disabled"] = false;
      // cashierscreen["product_search_disabled"] = false;
      // 
      // //Set scroll for Products
      // 
      // cashierscreen['productsActiveRecord'] = 0

      // 29. Reset receipt Grid
      display.receipt.applyFilter(gridRecord => {
        if (gridRecord["qty"] != 0) return false;
        else return true;
      });

      // 30. Reset Suggestions grid 
      display.suggestions.applyFilter(gridRecord => {
        if (gridRecord["suggested_wash_type"] != '') return false;
        else return true;
      });

      // 31. Set screen field(s)
      Object.assign(cashierscreen, {
        "customer_notes": companyNotes,
        "popularwashDisabled": false,
        "comp_name": companyId,
        "customer_not_selected": false,
        "company_info_focus_on": "customer-tractor",
        "custom_disabled": true
      });

      // 32. Get Popwash buttons
      /*
        This step will get popular wash buttons. specifc to this location
      */
      var _success = false;
      var _error = null;
      
      var _records = null;
      try {
        var query = "SELECT PRODUCT,   POPWASHKEY,    LOCATIONSKEY,    PRODUCTSKEY,    SORT  FROM POPULARWASHES " +
                    " INNER JOIN PRODUCTS ON PRODUCTS.PRDKEY=POPULARWASHES.PRODUCTSKEY where LOCATIONSKEY=? ORDER BY SORT ASC "; 
        _records =  pjs.query(query,[pjs.session["locationsKey"]]);
        _success = true;
      }
      catch (err) {
        _records = [];
        _error = err;
      }
      var buttonRecords = _records;

      // 33. Set Pop Wash Buttons
      //set popular wash buttons
      if(buttonRecords!==null && buttonRecords.length>0)
      {
      
        for(let button of buttonRecords)
        {
          cashierscreen["button"+button.sort]=button.product;
          cashierscreen["choice"+button.sort+"_value"]=button.productskey;
        }
      
      }

      // 34. Reset Price Modification 
      cashierscreen['modifiedPriceSpecials'] = []
    },

    "Trailer Change": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Trailer Value not entered
      if (!cashierscreen["trailer_number_value"] || cashierscreen["trailer_number_value"] == '0') {

        // 3. clear Options
        cashierscreen["trailerOptions"] = []

        // 4. Stop
        return;
      }

      // 5. Customer?
      if (!cashierscreen["comp_name"] || cashierscreen["comp_name"] == '0') {

        // 6. Display Error
        pjs.messageBox({
          title: "",
          message: "Customer Must be entered"
        })
        return
      }

      // 7. Set work variable
      var truckId = cashierscreen["tractor_number"];
      var trailerId = cashierscreen["trailer_number"];
      var truckNumber = cashierscreen["tractor_number_value"];
      var trailerNumber = cashierscreen["trailer_number_value"];

      // 8. Check if Trailer Requires Validation
      cashierscreen["trailer_number_value_visible"] = false
      var trailerFoundInDB = false;
      
      //Trailer requires validationg
      if(cashierscreen["validateTrailer"] == true){
        //Trailer not selected from auto complete or left empty
        if(cashierscreen["trailer_number"] == ""){
          //Truck field was not entered 
          if(cashierscreen["trailer_number_value"] == ""){
            pjs.messageBox({
              title: ``,
              message: `Trailer is required to be validated for this customer`
            });
          }
          //Truck not selected from auto complete but was entered 
          else{
            var query = "SELECT CTRAILSKEY FROM CORPORATETRAILERS WHERE CORPORATECUSTOMERSKEY = ? AND UCASE(TRAILERNUMBER) = ?";
            var trailer = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["trailer_number_value"].toString().toUpperCase()])
      
            //Truck found in Db with Truck number
            if(Object.keys(trailer).length != 0){
              cashierscreen["trailer_number"] = trailer[0]["ctrailskey"]
              trailerFoundInDB = true
            }
            //Truck not found in DB
            else{
              pjs.messageBox({
                title: '',
                message: 'Trailer number '+cashierscreen["trailer_number_value"]+" is not valid for customer "+cashierscreen["company_name_value"]
              })
              return
            }
          }
        }
        else{
          //Trailer selected from auto complete
        }
      }
      else{
        //trailer is not required to validate
        //Look for trailer in DB anyway
        var query = "SELECT CTRAILSKEY FROM CORPORATETRAILERS WHERE CORPORATECUSTOMERSKEY = ? AND UCASE(TRAILERNUMBER) = ?";
        var trailer = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["trailer_number_value"].toString().toUpperCase()])
      
        //Truck found in Db with Truck number
        if(Object.keys(trailer).length != 0){
          cashierscreen["trailer_number"] = trailer[0]["ctrailskey"]
          trailerFoundInDB = true
        }
        //Truck not found in DB
        else{
          cashierscreen["trailer_number"] = "";
          cashierscreen["trailer_number_value_visible"] = true
        }
      
      }
      
      //Shift focus
      cashierscreen["company_info_focus_on"] = "customer-trailer"

      // 9. Fetch Driver
      try{
        if(!cashierscreen["validateTruck"] && cashierscreen["validateTrailer"]){
          //Fetching Driver based on trailer only
          var query = "SELECT DRIVERSKEY, FIRSTNAME, LASTNAME, PHONENBR, EMAILADDRESS " +
                      "FROM DRIVERS "+
                      "WHERE CORPCUSTKEY = ? AND CORPTRAILERKEY = ? ";
          var driver = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["trailer_number"]])
          if(Object.keys(driver).length != 0){
            //Found Driver
            driver = driver[0]
            cashierscreen["driverInfoKey"] = driver["driverskey"]
            cashierscreen["drvfname"] = driver["firstname"]
            cashierscreen["drvlname"] = driver["lastname"]
            cashierscreen["drvphone"] = driver["phonenbr"]
            cashierscreen["drveaddress"] = driver["emailaddress"]
          }
          else{
            //No driver associated in DB with Trailer
            cashierscreen["driverInfoKey"] = ""
            cashierscreen["drvfname"] = ""
            cashierscreen["drvlname"] = ""
            cashierscreen["drvphone"] = ""
            cashierscreen["drveaddress"] = ""
          }
        }
        else if (cashierscreen["validateTruck"] && cashierscreen["validateTrailer"]){
          //Fetching Driver based on truck + trailer
          var query = "SELECT DRIVERSKEY, FIRSTNAME, LASTNAME, PHONENBR, EMAILADDRESS " +
                      "FROM DRIVERS "+
                      "WHERE CORPCUSTKEY = ? AND CORPTRUCKKEY = ? AND CORPTRAILERKEY = ? ";
          var driver = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["tractor_number"], cashierscreen["trailer_number"]])
          if(Object.keys(driver).length != 0){
            //Found Driver
            driver = driver[0]
            cashierscreen["driverInfoKey"] = driver["driverskey"]
            cashierscreen["drvfname"] = driver["firstname"]
            cashierscreen["drvlname"] = driver["lastname"]
            cashierscreen["drvphone"] = driver["phonenbr"]
            cashierscreen["drveaddress"] = driver["emailaddress"]
          }
          else{
            //No driver associated in DB
            cashierscreen["driverInfoKey"] = ""
            cashierscreen["drvfname"] = ""
            cashierscreen["drvlname"] = ""
            cashierscreen["drvphone"] = ""
            cashierscreen["drveaddress"] = ""
          }
        }
        else if(trailerFoundInDB){
          //Fetching Driver based on trailer only for Non Validate case
          var query = "SELECT DRIVERSKEY, FIRSTNAME, LASTNAME, PHONENBR, EMAILADDRESS " +
                      "FROM DRIVERS "+
                      "WHERE CORPCUSTKEY = ? AND CORPTRAILERKEY = ? ";
          var driver = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["trailer_number"]])
          if(Object.keys(driver).length != 0){
            //Found Driver
            driver = driver[0]
            cashierscreen["driverInfoKey"] = driver["driverskey"]
            cashierscreen["drvfname"] = driver["firstname"]
            cashierscreen["drvlname"] = driver["lastname"]
            cashierscreen["drvphone"] = driver["phonenbr"]
            cashierscreen["drveaddress"] = driver["emailaddress"]
          }
          else{
            //No driver associated in DB with Trailer
          }
      
        }
        else{
          //nonvalidate case truck not found
          try{
            var query = "SELECT DRIVERSKEY, FIRSTNAME, LASTNAME, PHONENBR, EMAILADDRESS " +
                        "FROM DRIVERS "+
                        "WHERE CORPCUSTKEY = ? AND trailernbr = ? ";
            var driver = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["trailer_number_value"]])
            if(Object.keys(driver).length != 0){
              //Found Driver
              driver = driver[0]
              cashierscreen["driverInfoKey"] = driver["driverskey"]
              cashierscreen["drvfname"] = driver["firstname"]
              cashierscreen["drvlname"] = driver["lastname"]
              cashierscreen["drvphone"] = driver["phonenbr"]
              cashierscreen["drveaddress"] = driver["emailaddress"]
            }
            else{
              //No driver associated in DB with this truck
            }
          }
          catch (e){
            //Error Occurred during fetch driver based on non validate trailer not found
          }
        }
      }
      catch (e)
      {
        //Error occured in driver fetch on trailer change
      }
      

      // 10. Wash History
      var parms = {};
      parms["driverskey"] = cashierscreen["driverInfoKey"];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetDriverWashHistory.module.json");
        _results = pjsModule["Get Driver Wash History"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var washHistory = _results ? _results["washHistory"] : null;
      cashierscreen['driverRefused'] = _results ? _results["driverRefused"] : null;
      cashierscreen['driverRefusedDisabled'] = _results ? _results["driverRefusedDisabled"] : null;

      // 11. Load History
      display.driver_history.replaceRecords(washHistory);

      // 12. If trailer is found
      if (cashierscreen["trailer_number"] && cashierscreen["trailer_number"] != '0') {

        // 13. Remove receipt records
        display.receipt.applyFilter(gridRecord => {
          if (gridRecord["qty"] != 0) return false;
          else return true;
        });

        // 14. Remove Suggestions grid records
        display.suggestions.applyFilter(gridRecord => {
          if (gridRecord["suggested_wash_type"] != '') return false;
          else return true;
        });

        // 15. Reset Price Modification 
        cashierscreen['modifiedPriceSpecials'] = []

        // 16. Reset Receipt Totals
        cashierscreen['total'] = ''
        cashierscreen['rsubtotal'] = ''
        cashierscreen['tax'] = ''
        cashierscreen['discount'] = ''
        
        coupon['coupon_discount'] = ''
        scrub_club['scrub_club_invoice'] = ''
      }

      // 17. Frequency Tracking
      var parms = {};
      parms["tractor_number_value"] = cashierscreen['tractor_number_value'];
      parms["trailer_number_value"] = cashierscreen['trailer_number_value'];
      parms["corporatecustomerskey"] = cashierscreen['comp_name'];
      parms["clientTime"] = globals['clientTime'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("FrequencyTracking.module.json");
        _results = pjsModule["Frequency Tracking"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var ineligibleCategories = _results ? _results["ineligibleCategories"] : null;
      var lastPurchased = _results ? _results["lastPurchased"] : null;

      // 18. Remove Categories?
      if (ineligibleCategories.length > 0) {

        // 19. Remove Categories
        display.products.applyFilter(gridRecord => {
          if (ineligibleCategories.filter(category => category == gridRecord["category"]).length > 0) 
            return false;
          else 
            return true;
        });

        // 20. Display Ineligible
        let message = "Inelgibile : "
        
        pjs.messageBox({
          message : `${message} ${lastPurchased.join(',')}`
        })
      }
    },

    "Checkout Click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Validation
      /*
        This step validates data before checking out. 
        Required fields, customer name, tractor, trailer, driver, receipt items. 
      */
      
      //Prepare variables and query
      
      // if company not entered
      if(cashierscreen["comp_name"] == "")
      {
        pjs.messageBox({
          title: '',
          message: "Please enter company name field, company name cannot be empty"
        })
        cashierscreen['comp_name_css'] = 'tom-input-error'
        return
      }
      else{
        cashierscreen['comp_name_css'] = 'tom-input'
      }
      
      // if tractor number not entered, Also checks for validateTractor, if customer requires tractor to be validated must be selected from DB
       if(cashierscreen["validateTruck"] == true &&  cashierscreen["validateTrailer"] ==true)
       {
         if(cashierscreen["tractor_number"] == "" || cashierscreen["trailer_number"] == "")
         {
            pjs.messageBox({
              title: '',
              message: "Tractor and Trailer Number both are required."
            })
            pjs.messageBox({
              title: '',
              message: "Due to customer tracking settings, we are required to reset your selected products."
            })
            cashierscreen['tractor_number_css'] = 'tom-input-error'
            cashierscreen['trailer_number_css'] = 'tom-input-error'
            return
         }
         else{
            cashierscreen['tractor_number_css'] = 'tom-input'
            cashierscreen['trailer_number_css'] = 'tom-input'
         }
       }
      
      
      if(cashierscreen["tractor_number"] == "")
      {
        if(cashierscreen["validateTractor"]){
          //Truck Number is not valid for this customer
          pjs.messageBox({
            title: '',
            message: "Please enter correct Tractor number,Tractor Number cannot be empty or is not associated with this customer"
          })  
          cashierscreen['tractor_number_css'] = 'tom-input-error'
          return
        }
        else if(cashierscreen["tractor_number_value"] == ""){
          //Tractor Number not entered
          pjs.messageBox({
            title: '',
            message: "Please enter Tractor Number field, Tractor Number cannot be empty"
          })
          cashierscreen['tractor_number_css'] = 'tom-input-error'
          return
        }
        else{
          cashierscreen['tractor_number_css'] = 'tom-input'
        }
      }
      // Validate Trailer, if required. and Trailer number must not be null
      if(cashierscreen["trailer_number"] == "")
      {
        if(cashierscreen["validateTrailer"]){
          //Trailer Number is not valid for this customer
          pjs.messageBox({
            title: '',
            message: "Please enter correct number in  Trailer Number, Trailer number cannot be empty or is not associated with this customer"
          })
          cashierscreen['trailer_number_css'] = 'tom-input-error'
          return
        }
        else if(cashierscreen["trailer_number_value"] == ""){
          //Trailer Number not entered
          pjs.messageBox({
            title: '',
            message: "Please enter Trailer Number ,Trailer Number cannot be empty"
          })
          cashierscreen['trailer_number_css'] = 'tom-input-error'
          return
        }
        else{
          cashierscreen['trailer_number_css'] = 'tom-input'
        }
      }
      
      // valdiate we have driver information, and is saved in db as well before we checkout
      if((cashierscreen["driverInfoKey"] == "" || cashierscreen["driverInfoKey"] == 0 )&& !cashierscreen['driverRefused']){
        if(cashierscreen["drvfname"] !== ""){
          pjs.messageBox({
            title: '',
            message: "Please save driver first"
          })
          return
        }
        else{
          pjs.messageBox({
            title: '',
            message: "Driver cannot be empty"
          })
          cashierscreen['drvfnamecss'] = 'tom-input-error'
          cashierscreen['drvlnamecss'] = 'tom-input-error'
          return
        }
      }
      else{
          cashierscreen['drvfnamecss'] = 'tom-input'
          cashierscreen['drvlnamecss'] = 'tom-input'
      }
      if(display.receipt.getRecordCount() == 0){
        pjs.messageBox({
          title: "",
          message: "No line items in receipt grid"
        })
        return
      }
      
      //Validation for REquired Items
      
      var missing  = false
      var message = []
      if(cashierscreen["po_required"] && (required_fields["ponum"] == "" || required_fields["ponum"] == undefined)) {
        message.push("PO Number")
        missing = true
        required_fields['ponumcss'] = 'tom-input-error'
      }
      else{
        required_fields['ponumcss'] = 'tom-input'
      }
      if(cashierscreen["tripNumber_required"] && (required_fields["tripnum"] == "" || required_fields["tripnum"] == undefined)){
        message.push("Trip Number")
        missing = true
        required_fields['tripnumcss'] = 'tom-input-error'
      }
      else{
        required_fields['tripnumcss'] = 'tom-input'
      }
      if(cashierscreen["driverId_required"] && (required_fields["drvid"] == "" || required_fields["drvid"] == undefined)){
        message.push("Driver ID")
        missing = true
        required_fields['drvidcss'] = 'tom-input-error'
      }
      else{
        required_fields['tripnumcss'] = 'tom-input'
      }
      if(missing){
        
        logic["Required Items Click"]();
        pjs.messageBox({
          title: "",
          message: message.toString() + " required"
        })
        return
      }
      
      //Validation for Srub Club
      if(cashierscreen["discountType"] == "Scrub"){
        if(cashierscreen["scrubApply"] && Object.keys(cashierscreen["scrubApply"]).length != 0){
          if(cashierscreen["scrubApply"]["tractor"] != cashierscreen["tractor_number_value"]){
            pjs.messageBox({
              title: "",
              message: "Coupon applied is for a different Tractor, Please remove coupon or change to correct tractor number"
            })
            return
          }
        }
      }

      // 3. Receipt Empty?
      if (display.receipt.getRecords().length == 0) {

        // 4. Show message box
        pjs.messageBox({
          title: ``,
          message: `Please select items, Invoice is empty`
        });

        // 5. Stop
        return;
      }

      // 6. Save Transaction
      var parms = {};
      parms["clientTime"] = globals['clientTime'];
      parms["updateDetails"] = true;
      parms["status"] = "Open";
      parms["city"] = pjs.session['city'];
      parms["discount_print"] = cashierscreen['discount_print'];
      parms["company_name_value"] = cashierscreen["company_name_value"];
      parms["update"] = cashierscreen["flag_tx_loaded_from_db"];
      parms["rsubtotal"] = cashierscreen["rsubtotal"];
      parms["total"] = cashierscreen["total"];
      parms["tax"] = cashierscreen["tax"];
      parms["customer_notes"] = '';
      parms["driverInfoKey"] = cashierscreen["driverInfoKey"];
      parms["po_required"] = cashierscreen["po_required"];
      parms["ponum"] = required_fields["ponum"];
      parms["tripNumber_required"] = cashierscreen['tripNumber_required'];
      parms["tripnum"] = required_fields['tripnum'];
      parms["driverId_required"] = cashierscreen['driverId_required'];
      parms["drvid"] = required_fields['drvid'];
      parms["flag_tx_loaded_from_db_id"] = cashierscreen["flag_tx_loaded_from_db_id"];
      parms["comp_name"] = cashierscreen["comp_name"];
      parms["tractor_number"] = cashierscreen["tractor_number"];
      parms["trailer_number"] = cashierscreen["trailer_number"];
      parms["TractorTrailerRequired"] = cashierscreen['TractorTrailerRequired'];
      parms["usersKey"] = pjs.session['usersKey'];
      parms["currentShift"] = pjs.session['currentShift'];
      parms["tractor_number_value"] = cashierscreen["tractor_number_value"];
      parms["trailer_number_value"] = cashierscreen["trailer_number_value"];
      parms["locationsKey"] = pjs.session['locationsKey'];
      parms["modifiedPriceSpecials"] = cashierscreen['modifiedPriceSpecials'].length == 0 ? null : cashierscreen['modifiedPriceSpecials']  ;
      parms["receiptGridData"] = display.receipt.getRecords();
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("SaveTransaction.module.json");
        _results = pjsModule["SaveTransaction"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      cashierscreen['flag_tx_loaded_from_db'] = _results ? _results["flag_tx_loaded_from_db"] : null;
      paymentscreen['invoiceNumber'] = _results ? _results["invoiceNumber"] : null;
      paymentscreen['txhdr'] = _results ? _results["updatedTx"] : null;

      // 7. Transfer Receipt Items to Payment Screen
      display.payment_receipt.replaceRecords(display.receipt.getRecords());

      // 8. Transfer Driver History to Payment Screen
      display.payment_driver_history.replaceRecords(display.driver_history.getRecords());

      // 9. View Discount/Full Price
      /*
        This step determines based on customer settings, that whether receipt will show discounted price or full price
      */
      var viewdiscount=false;
      var viewactual=true;
      if(cashierscreen["discount_print"]==="Discount")
      {
        viewactual=false;
        viewdiscount=true;
      }
      display.payment_receipt.applyMap(gridRecord => {
         
         
          gridRecord["displayActual"] = viewactual
          gridRecord["displayDiscount"] = viewdiscount
        
        
        return gridRecord;
      });
      
      console.log('paymenttx', paymentscreen['txhdr'])

      // 10. Redeem Scrub?
      var parms = {};
      parms["discountType"] = cashierscreen['discountType'];
      parms["scrubApply"] = cashierscreen['scrubApply'] ? (Object.keys(cashierscreen['scrubApply']).length == 0 ? null : cashierscreen['scrubApply']) : null;
      parms["invoiceNumber"] = paymentscreen['invoiceNumber'];
      parms["locationsKey"] = pjs.session['locationsKey'];
      parms["clientTime"] = globals['clientTime'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("RedeemScrubClub.module.json");
        _results = pjsModule["Redeem Scrub Club"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }

      // 11. Redeem Scrub Club?
      // /*
      //   Redeems scrub club if the scrub club coupon was applied on the transaction. 
      //   This will update scrub club tracking table that the coupon has been redeemed
      // */
      // 
      // if(cashierscreen["discountType"] == "Scrub" && Object.keys(cashierscreen["scrubApply"]).length != 0){
      //   try{
      //     var query = "UPDATE SCRUBCLUBTRACKING "+
      //                 "SET SCRUBCLUBTRACKING.REDEEMEDTRANSACTIONSHEADERINVOICE = ?, SCRUBCLUBTRACKING.REDEEMEDLOCATIONKEY =? , SCRUBCLUBTRACKING.REDEEMEDTIMESTAMP = ? "+ 
      //                 "WHERE SCRUBCLUBTRACKING.SCTRACKKEY = ?"
      // 
      //     var values = [
      //       paymentscreen['invoiceNumber'],
      //       pjs.session["locationsKey"],
      //       globals['clientTime'],
      //       cashierscreen["scrubApply"]["scrubTrackKey"]
      //     ]
      //     let result = pjs.query(query, values)
      //   }
      //   catch(e){
      //     //Error updating info for redeeming a scrub club coupon
      //     console.log('SC track Redeem', e)
      //   }
      // }
      // else{
      //   //Not redeemed scrub club
      // }

      // 12. Show Payment screen
      Object.assign(paymentscreen, {
        "save_Disabled": true,
        "comp_name": cashierscreen["comp_name"],
        "comp_name_disabled": cashierscreen["comp_name_disabled"],
        "company_id": cashierscreen["company_id"],
        "company_name_value": cashierscreen["company_name_value"],
        "tractor_number": cashierscreen["tractor_number"],
        "tractor_disabled": cashierscreen["tracktor_disabled"],
        "tractor_number_value": cashierscreen["tractor_number_value"],
        "tractor_number_value_visible": cashierscreen["tractor_number_value_visible"],
        "trailer_number": cashierscreen["trailer_number"],
        "trailer_disabled": cashierscreen["trailer_disabled"],
        "trailer_number_value": cashierscreen["trailer_number_value"],
        "trailer_number_value_visible": cashierscreen["trailer_number_value_visible"],
        "button9": "Add Receipt Notes",
        "payment_amount": 0.00,
        "customer_notes": cashierscreen["customer_notes"],
        "coupon_disable": cashierscreen["coupon_disable"],
        "scrub_disable": cashierscreen["scrub_disable"],
        "drvfname": cashierscreen["drvfname"],
        "drvlname": cashierscreen["drvlname"],
        "subtotal": cashierscreen["rsubtotal"],
        "tax": cashierscreen["tax"],
        "drveaddress": cashierscreen["drveaddress"],
        "drvtruck": cashierscreen["drvtruck"],
        "drvtrailer": cashierscreen["drvtrailer"],
        "weather_icon": cashierscreen["weather_icon"],
        "driverInfoKey": cashierscreen["driverInfoKey"],
        "weather_text": cashierscreen["weather_text"],
        "drvphone": cashierscreen["drvphone"],
        "weather_city": cashierscreen["weather_city"],
        "discount": cashierscreen["discount"],
        "total": cashierscreen['total'],
        "driver_signature": '',
        "weather_temp": cashierscreen["weather_temp"],
        "current_date": cashierscreen['current_date'],
        "weather_percent": cashierscreen["weather_percent"]
      });
      screenHistory.push("paymentscreen");
      activeScreen = screens["paymentscreen"];
      return;

      // 13. TX Loaded from DB?
      if (cashierscreen["flag_tx_loaded_from_db"] && cashierscreen["flag_tx_loaded_from_db"] != '0') {

        // 14. Update TXHeader
        // 
        // /*
        //   This step will update the transaction if was already saved before. and will not insert a new transaction
        // */
        // const utility = require('../common-apis/utility.js')
        // 
        // var updatedReceipt = display.receipt.getRecords();
        // let transactionHeaderKey = cashierscreen["flag_tx_loaded_from_db_id"]
        // try{
        // var values = [
        //                 globals['clientTime'],
        //                 '',
        //                 cashierscreen["rsubtotal"],
        //                 cashierscreen["total"],
        //                 cashierscreen["tax"],
        //                 ''      
        //               ];
        // 
        //   var columns ="";
        //   if(cashierscreen['driverInfoKey'] != ''){
        //     columns += ", DRIVERSKEY = ?"     
        //     values.push(cashierscreen["driverInfoKey"])
        // 
        //   }
        //   if(cashierscreen["po_required"]){
        //     columns += ", PONUMBER = ?"
        //      
        //     values.push(required_fields["ponum"])
        //   }
        //   if(cashierscreen["tripNumber_required"]){
        //     columns += ", TRIPNUMBER = ?"
        //     
        //     values.push(required_fields["tripnum"])
        //   }
        //   if(cashierscreen["driverId_required"]){
        //     columns += ", DRIVERID = ?"
        //    
        //     values.push(required_fields["drvid"])
        //   }
        //   columns += ', STATUS = ?'
        //   values.push('Open')
        //   
        //   values.push(cashierscreen["flag_tx_loaded_from_db_id"])
        //   var query = "UPDATE TRANSACTIONSHEADER SET LOCALTS1 = ?, SIGNATURE = ?, ORDERTOTAL$=? ,  DISCOUNTEDTOTAL$=?, TAXTOTAL$=?, CASHIERMESSAGE=?" +columns+ " WHERE TXHDRKEY = ?" ;
        //   var _records = pjs.query(query, values)
        //   //Transaction Header Updated
        // 
        //   query = "SELECT TXHDRKEY, VARCHAR_FORMAT(LOCALTS1, 'MM/DD/YYYY') AS LOCALTS1, INVOICENBR, TRACTORNBR, TRAILERNBR, DISCOUNTEDTOTAL$, ORDERTOTAL$, TAXTOTAL$ "+
        //           ", PONUMBER, DRIVERID, TRIPNUMBER , USERSKEY, CASHIERMESSAGE " +
        //           "FROM TRANSACTIONSHEADER WHERE TXHDRKEY = ?"
        //   _records = pjs.query(query, cashierscreen["flag_tx_loaded_from_db_id"])
        //   var txHdr = {
        //     "corporatecustomerskey" : cashierscreen["comp_name"]
        //   }
        // 
        //   let items = display.receipt.getRecords().map((item) => {
        //     return{
        //       cost: cashierscreen['discount_print'] == 'DISCOUNT' ? Number(item["rprice"]).toFixed(2) : Number(item["actualPrice"]).toFixed(2),
        //       quantity: item["qty"],
        //       product: item["item_name"]
        //     }
        //   })
        //   
        //   paymentscreen['txhdr'] = {
        //     txhdrkey: cashierscreen["flag_tx_loaded_from_db_id"],
        //     items: items,
        //     subtotal : Number(_records[0]["ordertotal$"]).toFixed(2),
        //     discount: Number((Number(_records[0]["discountedtotal$"]) -Number(_records[0]["taxtotal$"])) - Number(_records[0]["ordertotal$"])).toFixed(2),
        //     tax: Number(_records[0]["taxtotal$"]).toFixed(2),
        //     total: Number(_records[0]["discountedtotal$"]).toFixed(2),
        //     phonenbr: utility.formatPhoneNumber(pjs.session['locationPhone']),
        //     invoicenbr: _records[0]["invoicenbr"],
        //     localts1: _records[0]["localts1"],
        //     companynm: cashierscreen["company_name_value"],
        //     tractornbr: _records[0]["tractornbr"],
        //     trailernbr: _records[0]["trailernbr"],
        //     ponumber: _records[0]["ponumber"],
        //     driverid: _records[0]["driverid"],
        //     tripnumber: _records[0]["tripnumber"],
        //     location: pjs.session['city'],
        //     cashiermessage: _records[0]["cashier_message"],
        //   }
        //   //set invoiceNumber Local Variable
        //   paymentscreen['invoiceNumber'] = _records[0]["invoicenbr"]
        // }
        // catch (err){
        // 
        // }
        // cashierscreen["flag_tx_loaded_from_db"] = false

        // 15. Update TXDetails
        // /*
        //   If the transaction was opened(already saved)
        //   The receipt items will be reinserted into transactions details table
        //   old items will be soft deleted. This is to assure that items changed in saved transaction are also updated
        // */
        // try {
        //   var query = "UPDATE TRANSACTIONDETAILS SET DELETE=?, DELETEDBY=?, DELETEDTS=?, LSTTOUCHBY=? WHERE TRANSACTIONSHEADERKEY=? ";
        // 
        //   var values = [
        //               "Y",
        //               pjs.session['usersKey'],
        //               globals['clientTime'],
        //               pjs.session['usersKey'],
        //               cashierscreen["flag_tx_loaded_from_db_id"]
        //             ];
        // 
        //   var _records = pjs.query(query, values)
        //   var txhdrkey = cashierscreen["flag_tx_loaded_from_db_id"];
        //   
        //     //insert modified prices seperately for reason codes to update
        //   if(cashierscreen['modifiedPriceSpecials'].length != 0){
        //     let modifiedPriceItems = receiptGridData.filter(item => cashierscreen['modifiedPriceSpecials'].filter(product => product['prdkey'] == item['prdkey']).length > 0)
        // 
        //     cashierscreen['modifiedPriceSpecials'].forEach((product) => {
        //       let item = modifiedPriceItems.filter(modified => modified['prdkey'] == product['prdkey'])
        //       let txdtlkey = `SELECT TXDTLKEY FROM NEW TABLE
        //                       ( INSERT INTO TRANSACTIONDETAILS(TRANSACTIONSHEADERKEY, PRODUCTSKEY, QUANTITY, COSTFULL, COST, COSTORG, DELETE) 
        //                       VALUES(?, ?, ?, ?, ?, ?, ?))`
        //       let costorg = display.products.getRecords().filter((prd) => prd['prdkey'] == item[0]['prdkey'])
        //       costorg = Number(Number(costorg[0]['price']) * Number(item[0]['qty'])).toFixed(2)
        // 
        //       let values = [
        //         txhdrkey,
        //         item[0]['prdkey'],
        //         item[0]['qty'],
        //         item[0]['actualPrice'],
        //         item[0]['rprice'],
        //         costorg,
        //         'N'
        //       ]
        //       txdtlkey = pjs.query(txdtlkey, values)
        //       product['txdtlkey'] = txdtlkey[0]['txdtlkey']
        //       product['transactionheaderkey'] = txhdrkey
        //     })
        //     let updateTXDTL = cashierscreen['modifiedPriceSpecials'].filter(product => product['txspeckey'] != null && product['txspeckey'] != undefined)
        //     if(updateTXDTL.length != 0){
        //       updateTXDTL.forEach((update) => {
        //         pjs.query('UPDATE TRANSACTIONSPECIALS SET TXDTLKEY = ? WHERE TXSPECKEY = ? ', [update.txdtlkey, update.txspeckey])
        //       })
        //     }
        // 
        //     //soft delete any removed reason codes from txspecials. 
        //     let removeSpecials = updateTXDTL.map(item => item['txspeckey'])
        //     if(removeSpecials.length != 0)
        //     {
        //       removeSpecials = removeSpecials.join(',')
        //       pjs.query('UPDATE TRANSACTIONSPECIALS SET DELETE = ? WHERE TRANSACTIONHEADERKEY = ? AND WHAT = ? AND TXSPECKEY NOT IN ('+removeSpecials+')', ['Y', txhdrkey, 'Price'])
        //     }
        // 
        //     receiptGridData = receiptGridData.filter(item => cashierscreen['modifiedPriceSpecials'].filter(product => product['prdkey'] == item['prdkey']).length == 0)
        //     
        //     cashierscreen['modifiedPriceSpecials'] = cashierscreen['modifiedPriceSpecials'].filter(product => product['txspeckey'] == null || product['txspeckey'] == undefined)
        //     
        //     let specials = cashierscreen['modifiedPriceSpecials'].map( (special) => {
        //       return{
        //         what : special.what,
        //         reasoncodeskey: special.reasoncodeskey,
        //         transactionheaderkey: special.transactionheaderkey,
        //         txdtlkey : special.txdtlkey,
        //         userskey: special.userskey, 
        //         otherdesc: special.otherdesc,
        //         'delete' : special['delete']
        //       }
        //     })
        //     pjs.query('INSERT INTO TRANSACTIONSPECIALS SET ? ', specials)
        //   }
        // 
        // 
        //   var productsDetails = display.receipt.getRecords().map((product) => {
        //   return {
        //     "transactionsheaderkey" : txhdrkey,
        //     "productskey" : product["prdkey"],
        //     "quantity":  product["qty"],
        //      "costfull": product["actualPrice"],
        //     "cost": product["rprice"],
        //     "costorg" : product['actualPrice'],
        //     "delete": 'N'
        //   }
        // })
        // query = "INSERT INTO TRANSACTIONDETAILS SET ?";
        // _records = pjs.query(query, productsDetails)
        // 
        // }
        // catch (err) {
        //   _records = [];
        //   _error = err;
        // }
      }

      // 16. else New TX
      else {

        // 17. Setup additional fields
        // /*
        //   |This step setups variables required in TXHeader table. Such as week dayt, and next invoice number. 
        // */
        // //Setup Date
        // var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        // const d = new Date();
        // var day = weekDays[d.getDay()];
        // let invoiceNumber = 0
        // //Setup Invoice Number
        // try{
        //   var query = "SELECT NUMBER FROM NEXTNBR WHERE NEXTNBR.LOCTNKEY = ?";
        //   invoiceNumber = pjs.query(query, pjs.session['locationsKey']);
        //   invoiceNumber = invoiceNumber[0]["number"];
        //   var query = "UPDATE NEXTNBR SET NEXTNBR.NUMBER = ? WHERE NEXTNBR.LOCTNKEY = ?";
        //   var nextInvoice = pjs.query(query, [invoiceNumber+1, pjs.session['locationsKey']]);
        // }
        // catch (err){
        //   
        // }

        // 18. Save Transaction
        // /*
        //   This step saves transaction into the Transactions header table. If transaction was not saved before. 
        // */
        // 
        // const utility = require('../common-apis/utility.js')
        // 
        // try{
        //   var columns = "LOCALTS1, USERSKEY, CASHIERMESSAGE, DAYOFWEEK1, LOCATIONSKEY, CORPORATECUSTOMERSKEY,  STATUS, ORDERTOTAL$, DISCOUNTEDTOTAL$, TAXTOTAL$, INVOICENBR, SIGNATURE, SHIFT"
        //   var values = [
        //               globals['clientTime'], 
        //               pjs.session["usersKey"],
        //               '',
        //               day, 
        //               pjs.session["locationsKey"],
        //               cashierscreen["comp_name"],
        //               'Open',
        //               Math.abs(Number(cashierscreen["rsubtotal"])),
        //               Math.abs(Number(cashierscreen["total"])),
        //               Math.abs(Number(cashierscreen["tax"])),
        //               invoiceNumber,
        //               '',
        //               pjs.session['currentShift'] 
        //             ];
        //   var options = "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?"
        //   if(cashierscreen["driverInfoKey"] != ""){
        //     columns += ", DRIVERSKEY"
        //     options += ", ?"
        //     values.push(Number(cashierscreen["driverInfoKey"]))
        //   }
        //   if(cashierscreen["tractor_number_value"] != ""){
        //     columns += ", TRACTORNBR"
        //     options += ", ?"
        //     values.push(cashierscreen["tractor_number_value"])
        //   }
        //   if(cashierscreen["trailer_number_value"]){
        //     columns += ", TRAILERNBR"
        //     options += ", ?"
        //     values.push(cashierscreen["trailer_number_value"])
        //   }
        //   if(cashierscreen["discountTypeKey"] != undefined){
        //     columns += ", DISCOUNTTYPESKEY"
        //     options += ", ?"
        //     values.push(Number(cashierscreen["discountTypeKey"]))
        //   }
        //   if(cashierscreen["po_required"]){
        //     columns += ", PONUMBER"
        //     options += ", ?"
        //     values.push(required_fields["ponum"])
        //   }
        //   if(cashierscreen["tripNumber_required"]){
        //     columns += ", TRIPNUMBER"
        //     options += ", ?"
        //     values.push(required_fields["tripnum"])
        //   }
        //   if(cashierscreen["driverId_required"]){
        //     columns += ", DRIVERID"
        //     options += ", ?"
        //     values.push(required_fields["drvid"])
        //   }
        // 
        // 
        //   var query = "SELECT TXHDRKEY, VARCHAR_FORMAT(LOCALTS1, 'MM/DD/YYYY') AS LOCALTS1, INVOICENBR, TRACTORNBR, TRAILERNBR, DISCOUNTEDTOTAL$, ORDERTOTAL$, TAXTOTAL$, PONUMBER, DRIVERID, TRIPNUMBER " +
        //               ", USERSKEY, CASHIERMESSAGE FROM NEW TABLE(" +
        //               "INSERT INTO TRANSACTIONSHEADER" +
        //               "("+columns+") " +
        //               "VALUES("+options+"))";
        //   var _records = pjs.query(query, values)
        //   //Transaction Header Inserted
        // 
        //   //Insert into Transaction Details
        //   var txhdrkey = _records[0]['txhdrkey'];
        // 
        //   //insert modified prices seperately for reason codes to update
        //   if(cashierscreen['modifiedPriceSpecials'].length != 0){
        //     let modifiedPriceItems = receiptGridData.filter(item => cashierscreen['modifiedPriceSpecials'].filter(product => product['prdkey'] == item['prdkey']).length > 0)
        // 
        //     cashierscreen['modifiedPriceSpecials'].forEach((product) => {
        //       let item = modifiedPriceItems.filter(modified => modified['prdkey'] == product['prdkey'])
        //       let txdtlkey = `SELECT TXDTLKEY FROM NEW TABLE
        //                       ( INSERT INTO TRANSACTIONDETAILS(TRANSACTIONSHEADERKEY, PRODUCTSKEY, QUANTITY, COSTFULL, COST, COSTORG, DELETE) 
        //                       VALUES(?, ?, ?, ?, ?, ?, ?))`
        // 
        //       let costorg = display.products.getRecords().filter((prd) => prd['prdkey'] == item[0]['prdkey'])
        //       costorg = Number(Number(costorg[0]['price']) * Number(item[0]['qty'])).toFixed(2)
        // 
        //       let values = [
        //         txhdrkey,
        //         item[0]['prdkey'],
        //         item[0]['qty'],
        //         item[0]['actualPrice'],
        //         item[0]['rprice'],
        //         costorg,
        //         'N'
        //       ]
        //       txdtlkey = pjs.query(txdtlkey, values)
        //       product['txdtlkey'] = txdtlkey[0]['txdtlkey']
        //       product['transactionheaderkey'] = txhdrkey
        //     })
        //     receiptGridData = receiptGridData.filter(item => cashierscreen['modifiedPriceSpecials'].filter(product => product['prdkey'] == item['prdkey']).length == 0)
        //     let specials = cashierscreen['modifiedPriceSpecials'].map( (special) => {
        //       return{
        //         what : special.what,
        //         reasoncodeskey: special.reasoncodeskey,
        //         transactionheaderkey: special.transactionheaderkey,
        //         txdtlkey : special.txdtlkey,
        //         userskey: special.userskey, 
        //         otherdesc: special.otherdesc,
        //         'delete' : special['delete']
        //       }
        //     })
        //     pjs.query('INSERT INTO TRANSACTIONSPECIALS SET ? ', specials)
        //   }
        // 
        //   let receiptGridData = display.receipt.getRecords()
        //   var productsDetails = receiptGridData.map((product) => {
        //     return {
        //       "transactionsheaderkey" : txhdrkey,
        //       "productskey" : product["prdkey"],
        //       "quantity":  product["qty"],
        //       "costfull": product["actualPrice"],
        //       "cost": product["rprice"],
        //       "costorg" : product['actualPrice'],
        //       "delete": 'N'
        //     }
        //   })
        // 
        //   query = "INSERT INTO TRANSACTIONDETAILS SET ?";
        //   let detailRecords = pjs.query(query, productsDetails)
        // 
        //   //Setting data for customer receipt
        //   let items = receiptGridData.map((item) => {
        //     return{
        //       cost: cashierscreen['discount_print'] == 'DISCOUNT' ? Number(item["rprice"]).toFixed(2) : Number(item["actualPrice"]).toFixed(2),
        //       quantity: item["qty"],
        //       product: item["item_name"]
        //     }
        //   })
        // 
        //   paymentscreen['txhdr'] = {
        //     txhdrkey: txhdrkey,
        //     items: items,
        //     subtotal : Number(_records[0]["ordertotal$"]).toFixed(2),
        //     discount: Number((Number(_records[0]["discountedtotal$"]) -Number(_records[0]["taxtotal$"])) - Number(_records[0]["ordertotal$"])).toFixed(2),
        //     tax: Number(_records[0]["taxtotal$"]).toFixed(2),
        //     total: Number(_records[0]["discountedtotal$"]).toFixed(2),
        //     phonenbr: utility.formatPhoneNumber(pjs.session['locationPhone']),
        //     invoicenbr: _records[0]["invoicenbr"],
        //     localts1: _records[0]["localts1"],
        //     companynm: cashierscreen["company_name_value"],
        //     tractornbr: _records[0]["tractornbr"],
        //     trailernbr: _records[0]["trailernbr"],
        //     ponumber: _records[0]["ponumber"],
        //     driverid: _records[0]["driverid"],
        //     tripnumber: _records[0]["tripnumber"],
        //     location: pjs.session['city'],
        //     cashiermessage: _records[0]["cashier_message"],
        // 
        //   }
        //   paymentscreen['invoiceNumber'] = invoiceNumber
        // 
        //   //_success = true;
        // }
        // catch(e){
        //   //Error Occurred while saving transaction
        //   console.log('e', e)
        // }
      }

      // 19. Load Payment Transaction Grid
      // /*
      //   This step updates the transaction grid on payment screen. 
      // */
      // display.payment_transactions.replaceRecords(display.transactions.getRecords());
    },

    "Add Receipt Notes": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Show Receipt Notes screen
      Object.assign(receipt_notes, {
        "prev_value": receipt_notes["receipt_notes"]
      });
      screenHistory.push("receipt_notes");
      activeScreen = screens["receipt_notes"];
      return;
    },

    "Receipt Notes Apply Click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Set work variable
      var wrk_cashierMessage = receipt_notes["receipt_notes"];

      // 3. close window
      let previousScreen = screenHistory[screenHistory.length - 2];
      if (previousScreen) {
        activeScreen = screens[previousScreen];
        screenHistory.pop();
      }
      return;
    },

    "void button click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Get Payments
      var parms = {};
      parms["transactionHeaderKey"] = view_transaction['txhdrkey'];
      parms["joinRefunds"] = true;
      parms["joinCC"] = true;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetPayments.module.json");
        _results = pjsModule["GetPayments"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var paymentsList = _results ? _results["paymentList"] : null;

      // 3. Assign Payments to Void
      /*
        This step will try to load all the payments made agains selected transaction if any, 
        Also will bring in the refund status. 
      */
      paymentsList = paymentsList.map((payment) => {
        let refundObject = {
          invoice: activeGridRecord['invoicenbr'],
          cc_approved_amount: payment['cc_approved_amount'],
          orig_acct_num: payment['cc_accountnumber'],
          cc_card_entry_mode: payment['cc_card_entry_mode']
        }
        return{
          ...payment,
          ccTerminalRefundObject: JSON.stringify(refundObject),
          refunded: payment['refundkey'] ? true: false
        }
      })

      // 4. can void?
      /*
        Based on HQA Config table, if the user can void a transaction or not. 
        considers time period duration in which a user can void a transaciton
        also checks if the transaction is already a void transaction
      */
      var timestamp = pjs.timestamp(activeGridRecord["localtimestamp"])
      let pendingRefunds = paymentsList.filter((rec) => !rec['refunded'])
      
      if((view_transaction["transaction_status"].toUpperCase() == "Void".toUpperCase()) && pendingRefunds.length == 0){
        pjs.messageBox({
          title: "Error",
          message: "Transaction is already a void transaction"
        })
        return;
      }
      
      if(timestamp < pjs.session.restrictions["Transaction Restrictions"]["Void Transaction Timeframe"]["startLimit"] || pjs.session.restrictions["Transaction Restrictions"]["Void Transaction Timeframe"]["endLimit"] < timestamp){
        pjs.messageBox({
          title: 'Error',
          message: 'Cannot Void transaction from previous shifts  '+pjs.session['VoidTransactionDuration'].toLocaleString()
        })
        return
      }
      else{
        //Cashier can void
      }

      // 5. if Voided?
      if (view_transaction["transaction_status"] == 'Void') {

        // 6. Get TxSpecials
        var parms = {};
        parms["txhdrkey"] = view_transaction['txhdrkey'];
        parms["what"] = 'Void';
        
        var _success = false;
        var _error = null;   
        var _results = null;
        
        try {
          var pjsModule = pjs.require("GetTransactionSpecials.module.json");
          _results = pjsModule["Get Tx Specials"](parms);
          _success = true;
        }
        catch (err) {
          _error = err;
          console.error(err);
        }
        
        var voidReason = _results ? _results["txSpecials"] : null;

        // 7. Load Void Screen
        /*
          This block will allow the user to open the void screen 
          even if the transction status is already 'void'
          This happens only in the case if due to some error all the refunds were not processed. 
          The pending refunds can processed again using this block
        */
        voidReason = voidReason[0]
        
        //refund grid
        display.void_transactions_refund_grid.replaceRecords(paymentsList)
        
        //dependent variables
        let thisTxtotal = view_transaction['transactionRecord']['discountedtotal$']
        
        //Default Settings
        void_transaction["refund_amount"] = thisTxtotal
        void_transaction["comp_name"] = view_transaction["company_name_value"]
        void_transaction["refund_amount_disabled"] = true
        void_transaction["status"] = view_transaction['transactionRecord']["status"]
        void_transaction["txhdrkey"] = view_transaction['transactionRecord']["txhdrkey"]
        void_transaction['creditCardRefundAmount'] = ""
        void_transaction['refundType'] = ""
        void_transaction['txpaykey'] = ""
        void_transaction['refundingActive'] = ""
        void_transaction['creditCardTerminalResponse'] = ""
        void_transaction['void_reason'] = voidReason['reasoncodeskey']
        void_transaction['otherDescription'] = voidReason['otherdesc']
        void_transaction['voidReasonDisabled'] = true
        void_transaction['invoiceNumber'] = view_transaction['transactionRecord']['invoicenbr']
        
        //Determine Refunds
        
        if(view_transaction['transactionRecord']["status"] == "Open"){
          void_transaction["refund_amount"] = "0.00$"
          void_transaction["void_open"] = true
          void_transaction["void_closed"] = false 
          
          if(paymentsList.length == 0){
            // no payments made yet -> open transaction
          }
          else {
            // its a split transaction 
            void_transaction["void_open"] = false
            void_transaction["void_closed"] = true 
            void_transaction["refund_amount"] = paymentsList.reduce((prev, curr) => { 
              return Number(Number(prev) + Number(curr['paymentamount'])).toFixed(2)
              },0)
          }
        }
        else{
          void_transaction["void_open"] = false
          void_transaction["void_closed"] = true 
          
          if(paymentsList.length == 1){
            // only one payment made yet, does the amount match to transaction? if yes its a full pay
            // if the amount is less its a split
            let payment = paymentsList[0]
            if(payment['paymentamount'] == thisTxtotal){
              void_transaction["refund_amount"] = thisTxtotal
            }
          }
          else{
            //split pay complete tx
          }
        
        }
        
        screenHistory.push("void_transaction")
        activeScreen = screens["void_transaction"]
      }

      // 8. Otherwise
      else {

        // 9. Load Void Screen
        /*
          If transaction is not already a 'void' transaction
          will load all the payments made with refund status. 
          and preferences so the user can void transaction and refund the amount. 
        */
        
        //refund grid
        display.void_transactions_refund_grid.replaceRecords(paymentsList)
        
        //dependent variables
        let thisTxtotal = view_transaction['transactionRecord']['discountedtotal$']
        
        //Default Settings
        void_transaction["refund_amount"] = thisTxtotal
        void_transaction["comp_name"] = view_transaction["company_name_value"]
        void_transaction["refund_amount_disabled"] = true
        void_transaction["status"] = view_transaction['transactionRecord']["status"]
        void_transaction["txhdrkey"] = view_transaction['transactionRecord']["txhdrkey"]
        void_transaction['creditCardRefundAmount'] = ""
        void_transaction['refundType'] = ""
        void_transaction['txpaykey'] = ""
        void_transaction['refundingActive'] = ""
        void_transaction['creditCardTerminalResponse'] = ""
        void_transaction['void_reason'] = ''
        void_transaction['voidReasonDisabled'] = false
        void_transaction['otherDescription'] = ''
        
        void_transaction['invoiceNumber'] = view_transaction['transactionRecord']['invoicenbr']
        
        //Determine Refunds
        
        if(view_transaction['transactionRecord']["status"] == "Open"){
          void_transaction["refund_amount"] = "0.00$"
          void_transaction["void_open"] = true
          void_transaction["void_closed"] = false 
          
          if(paymentsList.length == 0){
            // no payments made yet -> open transaction
          }
          else {
            // its a split transaction 
            
            void_transaction["void_open"] = false
            void_transaction["void_closed"] = true 
            void_transaction["refund_amount"] = paymentsList.reduce((prev, curr) => { 
              return Number(Number(prev) + Number(curr['paymentamount'])).toFixed(2)
              },0)
          }
        }
        else{
          void_transaction["void_open"] = false
          void_transaction["void_closed"] = true 
          
          if(paymentsList.length == 1){
            // only one payment made yet, does the amount match to transaction? if yes its a full pay
            // if the amount is less its a split
            let payment = paymentsList[0]
            if(payment['paymentamount'] == thisTxtotal){
              void_transaction["refund_amount"] = thisTxtotal
            }
          }
          else{
            //split pay complete tx
          }
        
        }
        
        screenHistory.push("void_transaction")
        activeScreen = screens["void_transaction"]
      }

      // 10. Get Payments
      // var _success = false;
      // var _error = null;
      // 
      // var _records = null;
      // try {
      //   var _from = "TRANSACTIONPAYMENTS LEFT JOIN TXPAYCC ON TRANSACTIONPAYMENTS.TXPAYKEY = TXPAYCC.TXPAYKEY LEFT JOIN REFUNDS ON TRANSACTIONPAYMENTS.TXPAYKEY = REFUNDS.TXPAYKEY";
      //   var _filter = { 
      //     whereClause: `transactionsheaderkey = ?`,
      //     values: [view_transaction["txhdrkey"]]
      //   };
      //   var _limit = ``;
      //   var _skip = ``;
      //   var _orderby = ``;
      //   var _select = `TRANSACTIONPAYMENTS.txpaykey,TRANSACTIONPAYMENTS.transactionsheaderkey,TRANSACTIONPAYMENTS.invoice,TRANSACTIONPAYMENTS.paymenttypekey,TRANSACTIONPAYMENTS.paymentmethod,TRANSACTIONPAYMENTS.paymentamount,TXPAYCC.txpaycckey,TXPAYCC.cc_accountnumber,TXPAYCC.cc_approved_amount,REFUNDS.refundkey,TXPAYCC.cc_card_entry_mode`;
      // 
      //   _records = pjs.data.get(_from, _filter, _limit, _skip, _orderby, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _records = [];
      //   _error = err;
      //   console.error(err);
      // }
      // var paymentsList = _records;

      // 11. Tx Specials
      // var _success = false;
      // var _error = null;
      // 
      // var _record = null;
      // try {
      //   var _from = "TRANSACTIONSPECIALS";
      //   var _filter = { 
      //     whereClause: `transactionheaderkey = ?`,
      //     values: [view_transaction["txhdrkey"]]
      //   };
      //   var _select = `reasoncodeskey,what,transactionheaderkey,userskey,otherdesc`;
      // 
      //   _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // // If no record found
      // if (!_record) {
      //   _record = {};
      //   _error = new Error("Record not found.")
      //   _success = false;
      // }
      // var voidReason = _record;
    },

    "Email Invoice": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Can Send Reciept?
      /*
        Based on restrictions, Config Table. 
        If the user can send out email for this transaction
      */
      
      //if transaction is "open" return
      if(view_transaction["transaction_status"] == "Open"){
        pjs.messageBox({
          title: "",
          message: "Cant send receipt for open transaction"
        })
        return
      }
      
      //if transaction "void" return, cannot send
      if(view_transaction["transaction_status"] == "Void"){
        pjs.messageBox({
          title: "",
          message: "Cant send receipt for void transaction"
        })
        return
      }
      
      //Receipt Restrictions [here] Transaction time duration restriction for user
      var currentTime = new Date()
      if(pjs.session.restrictions["Transaction Restrictions"]["Print Receipt Timeframe"]["startLimit"] > currentTime || pjs.session.restrictions["Transaction Restrictions"]["Print Receipt Timeframe"]["endLimit"] < currentTime){
        pjs.messageBox({
          title: '',
          message: 'Cannot print receipt in that time frame'
        })
        return
      }

      // 3. Fetch Transaction
      var parms = {};
      parms["txhdrkey"] = view_transaction['txhdrkey'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetTransactions.module.json");
        _results = pjsModule["Fetch Transaction For Receipt"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var transaction = _results ? _results["txhdr"] : null;

      // 4. Get Payments
      var parms = {};
      parms["transactionHeaderKey"] = view_transaction['txhdrkey'];
      parms["joinRefunds"] = false;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetPayments.module.json");
        _results = pjsModule["GetPayments"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var paymentList = _results ? _results["paymentList"] : null;

      // 5. Generate Receipt
      var parms = {};
      parms["locationTaxRate"] = transaction['taxrate'];
      parms["discount_print"] = transaction['viewdisc'];
      parms["receiptQty"] = 1;
      parms["split"] = true;
      parms["paymentMethod"] = null;
      parms["paymentList"] = paymentList;
      parms["txhdr"] = transaction;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GenerateCustomerAndWashBayReceipt.module.json");
        _results = pjsModule["Generate Customer Receipt"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var receipt = _results ? _results["receiptHTML"] : null;

      // 6. Show Email screen
      Object.assign(email_receipt, {
        "email_message": JSON.parse(receipt).html
      });
      screenHistory.push("email_receipt");
      activeScreen = screens["email_receipt"];
      return;

      // 7. Fetch Transaction
      // /*
      //   This step will fetch all details of transaction, 
      //   for generating receipt based on template 
      // */
      // const utility = require('../common-apis/utility.js')
      // 
      // try{
      //   var query = "SELECT TRANSACTIONSHEADER.TXHDRKEY, VARCHAR_FORMAT(TRANSACTIONSHEADER.LOCALTS1, 'MM/DD/YYYY') as localts1, TRANSACTIONSHEADER.INVOICENBR, TRANSACTIONSHEADER.TRACTORNBR, "+
      //               "TRANSACTIONSHEADER.TRAILERNBR, TRANSACTIONSHEADER.DISCOUNTEDTOTAL$, TRANSACTIONSHEADER.ORDERTOTAL$, TRANSACTIONSHEADER.TAXTOTAL$, "+
      //               "TRANSACTIONSHEADER.PONUMBER, TRANSACTIONSHEADER.DRIVERID, TRANSACTIONSHEADER.TRIPNUMBER, "+
      //               "TRANSACTIONSHEADER.USERSKEY, TRANSACTIONSHEADER.CASHIERMESSAGE, CORPORATECUSTOMERS.COMPANYNM, TOMLCTNS.LOCATION, TOMLCTNS.PHONENBR "+
      //               "FROM TRANSACTIONSHEADER "+
      //               "INNER JOIN TOMLCTNS ON TRANSACTIONSHEADER.LOCATIONSKEY = TOMLCTNS.LOCATIONKEY " +
      //               "INNER JOIN CORPORATECUSTOMERS ON TRANSACTIONSHEADER.CORPORATECUSTOMERSKEY = CORPORATECUSTOMERS.CORPCUSTKEY " +
      //               "WHERE TRANSACTIONSHEADER.TXHDRKEY = ?;"
      // 
      //   var txhdr = pjs.query(query, [Number(view_transaction["txhdrkey"])])
      // 
      //   query = "SELECT TRANSACTIONDETAILS.QUANTITY, TRANSACTIONDETAILS.COST, PRODUCTS.PRODUCT, PRODUCTS.TAXABLE "+
      //           "FROM TRANSACTIONDETAILS "+
      //           "INNER JOIN PRODUCTS ON TRANSACTIONDETAILS.PRODUCTSKEY = PRODUCTS.PRDKEY "+
      //           "WHERE TRANSACTIONDETAILS.TXHDRKEY = ? AND (TRANSACTIONDETAILS.DELETE <> ? OR TRANSACTIONDETAILS.DELETE IS NULL);"
      //   var items = pjs.query(query, [Number(view_transaction["txhdrkey"]), 'Y'])
      // 
      //   txhdr = txhdr[0]
      //   items.forEach((item) => {
      //     item["cost"] = Number(item["cost"]).toFixed(2)
      //   })
      //   txhdr["items"] = items
      //   txhdr["subtotal"] = Number(txhdr["ordertotal$"]).toFixed(2)
      // 
      //   // check if discount will be displayed or full price
      //   if(cashierscreen['discount_print']=='DISCOUNT')
      //   {
      //     txhdr["discount"] = Number((Number(txhdr["discountedtotal$"]) -Number(txhdr["taxtotal$"])) - Number(txhdr["ordertotal$"])).toFixed(2)
      //   }
      //   else
      //   {
      //     txhdr["discount"] ="";
      //   }
      //   
      //   txhdr["tax"] = Number(txhdr["taxtotal$"]).toFixed(2)
      //   txhdr["total"] = Number(txhdr["discountedtotal$"]).toFixed(2)
      //   txhdr["phonenbr"] = utility.formatPhoneNumber(txhdr["phonenbr"])
      //   email_receipt["txhdr"] = txhdr
      //    txhdr["taxrate"]= pjs.session["locationTaxRate"];
      // }
      // catch(e){
      //   //Error Ocurred generating Receipt
      // }
      // 
      // 

      // 8. Payments?
      // var _success = false;
      // var _error = null;
      // 
      // var _records = null;
      // try {
      //   var _from = "TRANSACTIONPAYMENTS";
      //   var _filter = { 
      //     whereClause: `transactionsheaderkey = ?`,
      //     values: [view_transaction["txhdrkey"]]
      //   };
      //   var _limit = ``;
      //   var _skip = ``;
      //   var _orderby = ``;
      //   var _select = `txpaykey,paymentmethod,paymentamount,actamtpd`;
      // 
      //   _records = pjs.data.get(_from, _filter, _limit, _skip, _orderby, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _records = [];
      //   _error = err;
      //   console.error(err);
      // }
      // var paymentsList = _records;

      // 9. Get Tx Cashier
      // var _success = false;
      // var _error = null;
      // 
      // var _record = null;
      // try {
      //   var _from = "USERS";
      //   var _filter = { 
      //     whereClause: `userskey = ?`,
      //     values: [ txhdr["userskey"]]
      //   };
      //   var _select = `firstname,lastname`;
      // 
      //   _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // // If no record found
      // if (!_record) {
      //   _record = {};
      //   _error = new Error("Record not found.")
      //   _success = false;
      // }
      // var txCashier = _record;

      // 10. Assign Cashier name
      //  /*
      //   Step will assign cashier name into tx object, so it can be displayed on receipt
      //  */
      //  txhdr["cashier"]=txCashier["firstname"]+" "+txCashier["lastname"]

      // 11. Set Payment Details
      // let list = paymentsList
      // console.log(list)
      // list = list.map(payment => {
      //   return{
      //     paymentMethod : payment['paymentmethod'],
      //     paymentAmount : Number(payment['paymentamount']).toFixed(2),
      //     actualPaid : Number(payment['actamtpd']).toFixed(2),
      //     returned : Number(Number(payment['actamtpd']) - Number(payment['paymentamount'])).toFixed(2)
      //   }
      // })
      // let payment = {
      //   type: 'split',
      //   list : list
      // }
      // 
      // txhdr['payments'] = payment

      // 12. Generate Receipt Template
      // /*
      //   This step generates receipt based on HTML Template.
      //   This generates HTML formatted customer copy of receipt
      // */
      // 
      // var fs = require('fs');
      // let ejs = require('ejs');
      // let path = require('path')
      //   
      // var templateString = fs.readFileSync(path.join(__dirname, 'templates', 'customer-receipt.ejs'), 'utf-8');
      // let html = ejs.render(templateString, {txhdr: txhdr});
    },

    "Save New Lead Cashier": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Check If fields are filled
      //Validates if any of the required fields for "new lead" are empty. 
      if((cashierscreen["nlcomp_name"] !== '' && typeof cashierscreen["nlcomp_name"] !== "undefined")
      && (cashierscreen["nlmgr_name"] !== '' && typeof cashierscreen["nlmgr_name"] !== "undefined")
      && (cashierscreen["nlcity"] !== '' && typeof cashierscreen["nlcity"] !== "undefined")
      && (cashierscreen["nlphone_number"] !== '' && typeof cashierscreen["nlphone_number"] !== "undefined")
      && (cashierscreen["nltruck_number"] !== '' && typeof cashierscreen["nltruck_number"] !== "undefined")
      && (cashierscreen["nlzip"] !== '' && typeof cashierscreen["nlzip"] !== "undefined")) {

        // 3. Save Lead
        var parms = {};
        parms["nlcomp_name"] = cashierscreen['nlcomp_name'];
        parms["nlmgr_name"] = cashierscreen['nlmgr_name'];
        parms["nlcity"] = cashierscreen['nlcity'];
        parms["nltruck_number"] = cashierscreen['nltruck_number'];
        parms["nlphone_number"] = cashierscreen['nlphone_number'];
        parms["nlzip"] = cashierscreen['nlzip'];
        parms["nlstate_name"] = cashierscreen['nlstate_name'];
        parms["locationsKey"] = pjs.session['locationsKey'];
        
        var _success = false;
        var _error = null;   
        var _results = null;
        
        try {
          var pjsModule = pjs.require("SaveLead.module.json");
          _results = pjsModule["Save Lead"](parms);
          _success = true;
        }
        catch (err) {
          _error = err;
          console.error(err);
        }
        
        cashierscreen['nlcomp_name'] = _results ? _results["nlcomp_name"] : null;
        cashierscreen['nlmgr_name'] = _results ? _results["nlmgr_name"] : null;
        cashierscreen['nlcity'] = _results ? _results["nlcity"] : null;
        cashierscreen['nltruck_number'] = _results ? _results["nltruck_number"] : null;
        cashierscreen['nlphone_number'] = _results ? _results["nlphone_number"] : null;
        cashierscreen['nlzip'] = _results ? _results["nlzip"] : null;
        cashierscreen['nlstate_name'] = _results ? _results["nlstate_name"] : null;
        var message = _results ? _results["message"] : null;

        // 4. Insert New Lead
        // var _success = false;
        // var _error = null;
        // 
        // var _result = null;
        // try {
        //   var _from = "NEWLEADS";
        //   var _data = {
        //     "locationskey": pjs.session['locationsKey'],
        //     "tractornbr": cashierscreen["nltruck_number"],
        //     "company": cashierscreen["nlcomp_name"],
        //     "city": cashierscreen["nlcity"],
        //     "statekey": cashierscreen["nlstate_name"],
        //     "zip": cashierscreen["nlzip"],
        //     "phone": cashierscreen["nlphone_number"],
        //     "managername": cashierscreen["nlmgr_name"]
        //   };
        // 
        //   _result = pjs.data.add(_from, _data);
        //   _success = true;
        // }
        // catch(err) {
        //   _error = err;
        //   console.error(err);
        // }
        // 

        // 5. Show message box
        var NewLeadMissingFields = pjs.messageBox({
          title: ``,
          message: `${message}`,
          buttons: [{"value":"OK"}]
        });

        // 6. Success?
        if (typeof _success !== "undefined" && _success) {

          // 7. Show message box
          // var NewLeadMissingFields = pjs.messageBox({
          //   title: ``,
          //   message: `New Lead Saved. `,
          //   buttons: [{"value":"OK"}]
          // });

          // 8. Clear Fields
          // cashierscreen['nlcomp_name'] = ''
          // cashierscreen['nlmgr_name'] = ''
          // cashierscreen['nlcity'] = ''
          // cashierscreen['nltruck_number'] = ''
          // cashierscreen['nlphone_number'] = ''
          // cashierscreen['nlzip'] = ''
          // cashierscreen['nlstate_name'] = ''
        }

        // 9. Otherwise
        else {

          // 10. Show message box
          // var NewLeadMissingFields = pjs.messageBox({
          //   title: ``,
          //   message: `Error occurred`,
          //   buttons: [{"value":"Cancel"}]
          // });
        }
      }

      // 11. else if missing Data
      else {

        // 12. Show message box
        var NewLeadMissingFields = pjs.messageBox({
          title: ``,
          message: `Please fill all fields`,
          buttons: [{"value":"Cancel"}]
        });
      }
    },

    "Save New Lead Company": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Check Field Empty
      if((companies["nlcomp_name"] !== '' && typeof companies["nlcomp_name"] !== "undefined")
      && (companies["nlmgr_name"] !== '' && typeof companies["nlmgr_name"] !== "undefined")
      && (companies["nlcity"] !== '' && typeof companies["nlcity"] !== "undefined")
      && (companies["nlphone_number"] !== '' && typeof companies["nlphone_number"] !== "undefined")
      && (companies["nltruck_number"] !== '' && typeof companies["nltruck_number"] !== "undefined")
      && (companies["nlzip"] !== '' && typeof companies["nlzip"] !== "undefined")) {

        // 3. Save Lead
        var parms = {};
        parms["nlcomp_name"] = companies['nlcomp_name'];
        parms["nlmgr_name"] = companies['nlmgr_name'];
        parms["nlcity"] = companies['nlcity'];
        parms["nltruck_number"] = companies['nltruck_number'];
        parms["nlphone_number"] = companies['nlphone_number'];
        parms["nlzip"] = companies['nlzip'];
        parms["nlstate_name"] = companies['nlstate_name'];
        parms["locationsKey"] = pjs.session['locationsKey'];
        
        var _success = false;
        var _error = null;   
        var _results = null;
        
        try {
          var pjsModule = pjs.require("SaveLead.module.json");
          _results = pjsModule["Save Lead"](parms);
          _success = true;
        }
        catch (err) {
          _error = err;
          console.error(err);
        }
        
        companies['nlcomp_name'] = _results ? _results["nlcomp_name"] : null;
        companies['nlmgr_name'] = _results ? _results["nlmgr_name"] : null;
        companies['nlcity'] = _results ? _results["nlcity"] : null;
        companies['nltruck_number'] = _results ? _results["nltruck_number"] : null;
        companies['nlphone_number'] = _results ? _results["nlphone_number"] : null;
        companies['nlzip'] = _results ? _results["nlzip"] : null;
        companies['nlstate_name'] = _results ? _results["nlstate_name"] : null;
        var message = _results ? _results["message"] : null;

        // 4. Show message box
        var NewLeadMissingFields = pjs.messageBox({
          title: ``,
          message: `${message}`,
          buttons: [{"value":"Cancel"}]
        });

        // 5. Insert New Lead
        // var _success = false;
        // var _error = null;
        // 
        // var _result = null;
        // try {
        //   var _from = "NEWLEADS";
        //   var _data = {
        //     "tractornbr": companies["nltruck_number"],
        //     "company": companies["nlcomp_name"],
        //     "city": companies["nlcity"],
        //     "statekey": companies["nlstate_name"],
        //     "zip": companies["nlzip"],
        //     "phone": companies["nlphone_number"],
        //     "managername": companies["nlmgr_name"]
        //   };
        // 
        //   _result = pjs.data.add(_from, _data);
        //   _success = true;
        // }
        // catch(err) {
        //   _error = err;
        //   console.error(err);
        // }
        // 
      }

      // 6. Otherwise
      else {

        // 7. Show message box
        var NewLeadMissingFields = pjs.messageBox({
          title: ``,
          message: `Please fill all fields`,
          buttons: [{"value":"Cancel"}]
        });
      }
    },

    "Save New Lead Payment Screen": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Check if New Lead fields are filled
      if((paymentscreen["nlcomp_name"] !== '' && typeof paymentscreen["nlcomp_name"] !== "undefined")
      && (paymentscreen["nlmgr_name"] !== '' && typeof paymentscreen["nlmgr_name"] !== "undefined")
      && (paymentscreen["nlcity"] !== '' && typeof paymentscreen["nlcity"] !== "undefined")
      && (paymentscreen["nlphone_number"] !== '' && typeof paymentscreen["nlphone_number"] !== "undefined")
      && (paymentscreen["nltruck_number"] !== '' && typeof paymentscreen["nltruck_number"] !== "undefined")
      && (paymentscreen["nlzip"] !== '' && typeof paymentscreen["nlzip"] !== "undefined")) {

        // 3. Save Lead
        var parms = {};
        parms["nlcomp_name"] = paymentscreen['nlcomp_name'];
        parms["nlmgr_name"] = paymentscreen['nlmgr_name'];
        parms["nlcity"] = paymentscreen['nlcity'];
        parms["nltruck_number"] = paymentscreen['nltruck_number'];
        parms["nlphone_number"] = paymentscreen['nlphone_number'];
        parms["nlzip"] = paymentscreen['nlzip'];
        parms["nlstate_name"] = paymentscreen['nlstate_name'];
        parms["locationsKey"] = pjs.session['locationsKey'];
        
        var _success = false;
        var _error = null;   
        var _results = null;
        
        try {
          var pjsModule = pjs.require("SaveLead.module.json");
          _results = pjsModule["Save Lead"](parms);
          _success = true;
        }
        catch (err) {
          _error = err;
          console.error(err);
        }
        
        paymentscreen['nlcomp_name'] = _results ? _results["nlcomp_name"] : null;
        paymentscreen['nlmgr_name'] = _results ? _results["nlmgr_name"] : null;
        paymentscreen['nlcity'] = _results ? _results["nlcity"] : null;
        paymentscreen['nltruck_number'] = _results ? _results["nltruck_number"] : null;
        paymentscreen['nlphone_number'] = _results ? _results["nlphone_number"] : null;
        paymentscreen['nlzip'] = _results ? _results["nlzip"] : null;
        paymentscreen['nlstate_name'] = _results ? _results["nlstate_name"] : null;
        var message = _results ? _results["message"] : null;

        // 4. Show message box
        pjs.messageBox({
          title: `Successful`,
          message: `${message}`,
          icon: "info",
          buttons: [{"value":"OK"}]
        });

        // 5. Insert New Lead
        // var _success = false;
        // var _error = null;
        // 
        // var _result = null;
        // try {
        //   var _from = "NEWLEADS";
        //   var _data = {
        //     "tractornbr": paymentscreen["nltruck_number"],
        //     "company": paymentscreen["nlcomp_name"],
        //     "city": paymentscreen["nlcity"],
        //     "statekey": paymentscreen["nlstate_name"],
        //     "zip": paymentscreen["nlzip"],
        //     "phone": paymentscreen["nlphone_number"],
        //     "managername": paymentscreen["nlmgr_name"]
        //   };
        // 
        //   _result = pjs.data.add(_from, _data);
        //   _success = true;
        // }
        // catch(err) {
        //   _error = err;
        //   console.error(err);
        // }
        // 

        // 6. Clear Lead Fields
        // cashierscreen["nlcity"] = ""
        // cashierscreen["nlcomp_name"] = ""
        // cashierscreen["nlmgr_name"] = ""
        // cashierscreen["nlphone_number"] = ""
        // cashierscreen["nlstate_name"] = ""
        // cashierscreen["nltruck_number"] = ""
        // cashierscreen["nlzip"] = ""
      }

      // 7. Otherwise
      else {

        // 8. Show message box
        var NewLeadMissingFields = pjs.messageBox({
          title: ``,
          message: `Please fill all fields`,
          buttons: [{"value":"Cancel"}]
        });
      }
    },

    "Save New Lead View Transaction Screen": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Check if New Leads filled in
      if((view_transaction["nlcomp_name"] !== '' && typeof view_transaction["nlcomp_name"] !== "undefined")
      && (view_transaction["nlmgr_name"] !== '' && typeof view_transaction["nlmgr_name"] !== "undefined")
      && (view_transaction["nlcity"] !== '' && typeof view_transaction["nlcity"] !== "undefined")
      && (view_transaction["nlphone_number"] !== '' && typeof view_transaction["nlphone_number"] !== "undefined")
      && (view_transaction["nltruck_number"] !== '' && typeof view_transaction["nltruck_number"] !== "undefined")
      && (view_transaction["nlzip"] !== '' && typeof view_transaction["nlzip"] !== "undefined")) {

        // 3. Save Lead
        var parms = {};
        parms["nlcomp_name"] = paymentscreen['nlcomp_name'];
        parms["nlmgr_name"] = paymentscreen['nlmgr_name'];
        parms["nlcity"] = paymentscreen['nlcity'];
        parms["nltruck_number"] = paymentscreen['nltruck_number'];
        parms["nlphone_number"] = paymentscreen['nlphone_number'];
        parms["nlzip"] = paymentscreen['nlzip'];
        parms["nlstate_name"] = paymentscreen['nlstate_name'];
        parms["locationsKey"] = pjs.session['locationsKey'];
        
        var _success = false;
        var _error = null;   
        var _results = null;
        
        try {
          var pjsModule = pjs.require("SaveLead.module.json");
          _results = pjsModule["Save Lead"](parms);
          _success = true;
        }
        catch (err) {
          _error = err;
          console.error(err);
        }
        
        paymentscreen['nlcomp_name'] = _results ? _results["nlcomp_name"] : null;
        paymentscreen['nlmgr_name'] = _results ? _results["nlmgr_name"] : null;
        paymentscreen['nlcity'] = _results ? _results["nlcity"] : null;
        paymentscreen['nltruck_number'] = _results ? _results["nltruck_number"] : null;
        paymentscreen['nlphone_number'] = _results ? _results["nlphone_number"] : null;
        paymentscreen['nlzip'] = _results ? _results["nlzip"] : null;
        paymentscreen['nlstate_name'] = _results ? _results["nlstate_name"] : null;
        var message = _results ? _results["message"] : null;

        // 4. Show message box
        var NewLeadMissingFields = pjs.messageBox({
          title: ``,
          message: `${message}`,
          buttons: [{"value":"Cancel"}]
        });

        // 5. Insert New Lead
        // var _success = false;
        // var _error = null;
        // 
        // var _result = null;
        // try {
        //   var _from = "NEWLEADS";
        //   var _data = {
        //     "tractornbr": view_transaction["nltruck_number"],
        //     "company": view_transaction["nlcomp_name"],
        //     "city": view_transaction["nlcity"],
        //     "statekey": view_transaction["nlstate_name"],
        //     "zip": view_transaction["nlzip"],
        //     "phone": view_transaction["nlphone_number"],
        //     "managername": view_transaction["nlmgr_name"]
        //   };
        // 
        //   _result = pjs.data.add(_from, _data);
        //   _success = true;
        // }
        // catch(err) {
        //   _error = err;
        //   console.error(err);
        // }
        // 
      }

      // 6. Otherwise
      else {

        // 7. Show message box
        var NewLeadMissingFields = pjs.messageBox({
          title: ``,
          message: `Please fill all fields`,
          buttons: [{"value":"Cancel"}]
        });
      }
    },

    "Save New Lead Shift Sales": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Check If New leads data filled
      if((cashierscreen_shiftsales["nlcomp_name"] !== '' && typeof cashierscreen_shiftsales["nlcomp_name"] !== "undefined")
      && (cashierscreen_shiftsales["nlmgr_name"] !== '' && typeof cashierscreen_shiftsales["nlmgr_name"] !== "undefined")
      && (cashierscreen_shiftsales["nlcity"] !== '' && typeof cashierscreen_shiftsales["nlcity"] !== "undefined")
      && (cashierscreen_shiftsales["nlphone_number"] !== '' && typeof cashierscreen_shiftsales["nlphone_number"] !== "undefined")
      && (cashierscreen_shiftsales["nltruck_number"] !== '' && typeof cashierscreen_shiftsales["nltruck_number"] !== "undefined")
      && (cashierscreen_shiftsales["nlzip"] !== '' && typeof cashierscreen_shiftsales["nlzip"] !== "undefined")) {

        // 3. Save Lead
        var parms = {};
        parms["nlcomp_name"] = cashierscreen_shiftsales['nlcomp_name'];
        parms["nlmgr_name"] = cashierscreen_shiftsales['nlmgr_name'];
        parms["nlcity"] = cashierscreen_shiftsales['nlcity'];
        parms["nltruck_number"] = cashierscreen_shiftsales['nltruck_number'];
        parms["nlphone_number"] = cashierscreen_shiftsales['nlphone_number'];
        parms["nlzip"] = cashierscreen_shiftsales['nlzip'];
        parms["nlstate_name"] = cashierscreen_shiftsales['nlstate_name'];
        parms["locationsKey"] = pjs.session['locationsKey'];
        
        var _success = false;
        var _error = null;   
        var _results = null;
        
        try {
          var pjsModule = pjs.require("SaveLead.module.json");
          _results = pjsModule["Save Lead"](parms);
          _success = true;
        }
        catch (err) {
          _error = err;
          console.error(err);
        }
        
        cashierscreen_shiftsales['nlcomp_name'] = _results ? _results["nlcomp_name"] : null;
        cashierscreen_shiftsales['nlmgr_name'] = _results ? _results["nlmgr_name"] : null;
        cashierscreen_shiftsales['nlcity'] = _results ? _results["nlcity"] : null;
        cashierscreen_shiftsales['nltruck_number'] = _results ? _results["nltruck_number"] : null;
        cashierscreen_shiftsales['nlphone_number'] = _results ? _results["nlphone_number"] : null;
        cashierscreen_shiftsales['nlzip'] = _results ? _results["nlzip"] : null;
        cashierscreen_shiftsales['nlstate_name'] = _results ? _results["nlstate_name"] : null;
        var message = _results ? _results["message"] : null;

        // 4. Show message box
        var NewLeadMissingFields = pjs.messageBox({
          title: ``,
          message: `${message}`,
          buttons: [{"value":"Cancel"}]
        });

        // 5. Insert New Lead
        // var _success = false;
        // var _error = null;
        // 
        // var _result = null;
        // try {
        //   var _from = "NEWLEADS";
        //   var _data = {
        //     "tractornbr": cashierscreen["nltruck_number"],
        //     "company": cashierscreen["nlcomp_name"],
        //     "city": cashierscreen["nlcity"],
        //     "statekey": cashierscreen["nlstate_name"],
        //     "zip": cashierscreen["nlzip"],
        //     "phone": cashierscreen["nlphone_number"],
        //     "managername": cashierscreen["nlmgr_name"]
        //   };
        // 
        //   _result = pjs.data.add(_from, _data);
        //   _success = true;
        // }
        // catch(err) {
        //   _error = err;
        //   console.error(err);
        // }
        // 
      }

      // 6. Otherwise
      else {

        // 7. Show message box
        var NewLeadMissingFields = pjs.messageBox({
          title: ``,
          message: `Please fill all fields`,
          buttons: [{"value":"Cancel"}]
        });
      }
    },

    "View Transaction outside View Transaction": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Load Transations
      logic["Refresh Today's Transaction"]();

      // 3. Payments
      var parms = {};
      parms["transactionHeaderKey"] = activeGridRecord['txhdrkey'];
      parms["joinRefunds"] = true;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetPayments.module.json");
        _results = pjsModule["GetPayments"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var paymentList = _results ? _results["paymentList"] : null;

      // 4. Fetch Transaction
      var parms = {};
      parms["txhdrkey"] = activeGridRecord['txhdrkey'];
      parms["paymentsListLength"] = paymentList.length;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetTransactions.module.json");
        _results = pjsModule["Fetch Transaction for Opening a Transaction"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var transactionHeader = _results ? _results["transactionHeader"] : null;
      var details = _results ? _results["transactionDetails"] : null;
      cashierscreen['modifiedPriceSpecials'] = _results ? _results["modifiedPriceSpecials"] : null;
      cashierscreen['flag_tx_loaded_from_db'] = _results ? _results["flag_tx_loaded_from_db"] : null;
      cashierscreen['flag_tx_loaded_from_db_id'] = _results ? _results["flag_tx_loaded_from_db_id"] : null;

      // 5. Open Transaction?
      if (activeGridRecord["status"] == 'Open') {

        // 6. Company Settings
        var parms = {};
        parms["corporatecustomerskey"] = transactionHeader['corporatecustomerskey'];
        parms["transactionHeader"] = transactionHeader;
        
        var _success = false;
        var _error = null;   
        var _results = null;
        
        try {
          var pjsModule = pjs.require("GetCustomerSettingsAndData.module.json");
          _results = pjsModule["Customer Settings"](parms);
          _success = true;
        }
        catch (err) {
          _error = err;
          console.error(err);
        }
        
        cashierscreen['company_name_value'] = _results ? _results["company_name_value"] : null;
        cashierscreen['comp_name'] = _results ? _results["comp_name"] : null;
        cashierscreen['customer_notes'] = _results ? _results["customer_notes"] : null;
        cashierscreen['customer_selected'] = _results ? _results["customer_selected"] : null;
        cashierscreen['customer_not_selected'] = _results ? _results["customer_not_selected"] : null;
        cashierscreen['checkoutDisabled'] = _results ? _results["checkoutDisabled"] : null;
        cashierscreen['couponVisible'] = _results ? _results["couponVisible"] : null;
        cashierscreen['scrubVisible'] = _results ? _results["scrubVisible"] : null;
        cashierscreen['save_Disabled'] = _results ? _results["save_Disabled"] : null;
        cashierscreen['allWashes'] = _results ? _results["allWashes"] : null;
        cashierscreen['discount_print'] = _results ? _results["discount_print"] : null;
        cashierscreen['receiptQty'] = _results ? _results["receiptQty"] : null;
        cashierscreen['customerTaxExempt'] = _results ? _results["customerTaxExempt"] : null;
        cashierscreen['custom_visible'] = _results ? _results["custom_visible"] : null;
        cashierscreen['customerNotesVisible'] = _results ? _results["customerNotesVisible"] : null;
        paymentscreen['openchargeOption'] = _results ? _results["openchargeOption"] : null;
        paymentscreen['restOfPaymentOptions'] = _results ? _results["restOfPaymentOptions"] : null;
        cashierscreen['valdiateTruck'] = _results ? _results["validateTruck"] : null;
        cashierscreen['validateTrailer'] = _results ? _results["validateTrailer"] : null;
        cashierscreen['has_requirements'] = _results ? _results["has_requirements"] : null;
        cashierscreen['po_required'] = _results ? _results["po_required"] : null;
        cashierscreen['driverId_required'] = _results ? _results["driverId_required"] : null;
        cashierscreen['tripNumber_required'] = _results ? _results["tripNumber_required"] : null;
        cashierscreen['scrub_disable'] = _results ? _results["scrub_disable"] : null;
        cashierscreen['coupon_disable'] = _results ? _results["coupon_disable"] : null;
        cashierscreen['discountType'] = _results ? _results["discountType"] : null;
        cashierscreen['scrubApply'] = _results ? _results["scrubApply"] : null;
        cashierscreen['discount_label'] = _results ? _results["discount_label"] : null;
        paymentscreen['discount_label'] = _results ? _results["payment_discount_label"] : null;
        cashierscreen['scrub_club_invoice'] = _results ? _results["scrub_club_invoice"] : null;
        cashierscreen['discountList'] = _results ? _results["discountList"] : null;
        cashierscreen['tractor_number'] = _results ? _results["tractor_number"] : null;
        cashierscreen['trailer_number'] = _results ? _results["trailer_number"] : null;
        cashierscreen['tractor_number_value'] = _results ? _results["tractor_number_value"] : null;
        cashierscreen['trailer_number_value'] = _results ? _results["trailer_number_value"] : null;
        cashierscreen['tractor_number_value_visible'] = _results ? _results["tractor_number_value_visible"] : null;
        cashierscreen['trailer_number_value_visible'] = _results ? _results["trailer_number_value_visible"] : null;
        cashierscreen['driverInfoKey'] = _results ? _results["driverInfoKey"] : null;
        cashierscreen['drvfname'] = _results ? _results["drvfname"] : null;
        cashierscreen['drvlname'] = _results ? _results["drvlname"] : null;
        cashierscreen['drvphone'] = _results ? _results["drvphone"] : null;
        cashierscreen['drveaddress'] = _results ? _results["drveaddress"] : null;
        cashierscreen['drvtruck'] = _results ? _results["drvtruck"] : null;
        cashierscreen['drvtrailer'] = _results ? _results["drvtrailer"] : null;
        required_fields['ponum'] = _results ? _results["ponum"] : null;
        required_fields['tripnum'] = _results ? _results["tripnum"] : null;
        required_fields['drvid'] = _results ? _results["drvid"] : null;
        cashierscreen['req_items'] = _results ? _results["req_items"] : null;
        cashierscreen['tracktor_disabled'] = _results ? _results["tracktor_disabled"] : null;
        cashierscreen['comp_name_disabled'] = _results ? _results["comp_name_disabled"] : null;
        cashierscreen['trailer_disabled'] = _results ? _results["trailer_disabled"] : null;
        paymentscreen['enablePaymentDue'] = _results ? _results["enablePaymentDue"] : null;

        // 7. Assign Totals + receipt
        //Calculate totals of saved Transaction
        cashierscreen['total'] = transactionHeader['discountedtotal$']
        cashierscreen['tax'] = transactionHeader['taxtotal$']
        cashierscreen['rsubtotal'] = transactionHeader['ordertotal$']
        var discountValue = Number((Math.abs(transactionHeader['ordertotal$']) + Math.abs(transactionHeader['taxtotal$'])) - Math.abs(transactionHeader['discountedtotal$'])).toFixed(2)
        cashierscreen['discount'] = discountValue
        
        display.receipt.replaceRecords(details);
        

        // 8. Get PopWashes
        var parms = {};
        parms["locationsKey"] = pjs.session['locationsKey'];
        
        var _success = false;
        var _error = null;   
        var _results = null;
        
        try {
          var pjsModule = pjs.require("GetPopularWashes.module.json");
          _results = pjsModule["GetPopularWashes"](parms);
          _success = true;
        }
        catch (err) {
          _error = err;
          console.error(err);
        }
        
        var buttonRecords = _results ? _results["popWashes"] : null;

        // 9. Set Button Variables
        
        /* 
          This step loads popular wash buttons which were fetched in last step
        */
        
        if(buttonRecords!==null && buttonRecords.length>0)
        {
        
          for(let button of buttonRecords)
          {
            cashierscreen["button"+button.sort]=button.product;
            cashierscreen["choice"+button.sort+"_value"]=button.productskey;
          }
        
        }
        cashierscreen["custom_disabled"]=true;
        

        // 10. Wash History
        var parms = {};
        parms["driverskey"] = cashierscreen["driverInfoKey"];
        
        var _success = false;
        var _error = null;   
        var _results = null;
        
        try {
          var pjsModule = pjs.require("GetDriverWashHistory.module.json");
          _results = pjsModule["Get Driver Wash History"](parms);
          _success = true;
        }
        catch (err) {
          _error = err;
          console.error(err);
        }
        
        var washHistory = _results ? _results["washHistory"] : null;
        cashierscreen['driverRefused'] = _results ? _results["driverRefused"] : null;
        cashierscreen['driverRefusedDisabled'] = _results ? _results["driverRefusedDisabled"] : null;

        // 11. Load History
        display.driver_history.replaceRecords(washHistory);

        // 12. Payments? Allow Edit
        if (!paymentList.length || paymentList.length == '0') {

          // 13. Get Products
          var parms = {};
          parms["corporatecustomerskey"] = cashierscreen['comp_name'];
          parms["discountType"] = cashierscreen['discountType'];
          parms["discountList"] = cashierscreen['discountList'];
          parms["locationsKey"] = pjs.session['locationsKey'];
          
          var _success = false;
          var _error = null;   
          var _results = null;
          
          try {
            var pjsModule = pjs.require("GetProducts.module.json");
            _results = pjsModule["Get Products"](parms);
            _success = true;
          }
          catch (err) {
            _error = err;
            console.error(err);
          }
          
          var error = _results ? _results["error"] : null;
          var errorMessage = _results ? _results["message"] : null;
          var products = _results ? _results["products"] : null;
          cashierscreen['product_category_options'] = _results ? _results["product_category_options"] : null;
          cashierscreen['product_filter_disabled'] = _results ? _results["product_filter_disabled"] : null;
          cashierscreen['product_search_disabled'] = _results ? _results["product_search_disabled"] : null;

          // 14. Error?
          if (error && error != '0') {

            // 15. Display Error
            pjs.messageBox({
              title: ``,
              message: `${errorMessage}`
            });
          }

          // 16. Load Products
          display.products.replaceRecords(products);

          // 17. Frequency Tracking
          var parms = {};
          parms["invoicenbr"] = transactionHeader['invoicenbr'];
          parms["tractor_number_value"] = cashierscreen['tractor_number_value'];
          parms["trailer_number_value"] = cashierscreen['trailer_number_value'];
          parms["corporatecustomerskey"] = transactionHeader['corporatecustomerskey'];
          parms["clientTime"] = globals['clientTime'];
          
          var _success = false;
          var _error = null;   
          var _results = null;
          
          try {
            var pjsModule = pjs.require("FrequencyTracking.module.json");
            _results = pjsModule["Frequency Tracking"](parms);
            _success = true;
          }
          catch (err) {
            _error = err;
            console.error(err);
          }
          
          var ineligibleCategories = _results ? _results["ineligibleCategories"] : null;
          var lastPurchased = _results ? _results["lastPurchased"] : null;

          // 18. Remove Categories
          display.products.applyFilter(gridRecord => {
            if (ineligibleCategories.filter(category => category == gridRecord["category"]).length > 0) 
              return false;
            else 
              return true;
          });
          
          if(lastPurchased.length != 0){
            pjs.messageBox({
              message: lastPurchased.join(',')
            })
          }
          

          // 19. Cashierscreen
          screenHistory.push("cashierscreen");
          activeScreen = screens["cashierscreen"];
          return;
        }

        // 20. Otherwise
        else {

          // 21. Load Grids Payment Scr
          /*
            This block will carry over to payment screen, Because the transaction was saved but some payments were made
            this will be case of cancelling out in mid of split transaction
            This will allow cashier to continue payments from the same point where the payments were left out in split payments
          */
          display.payment_transactions.replaceRecords(display.transactions.getRecords());
          display.payment_receipt.replaceRecords(details);
          display.driver_history.push(cashierscreen);

          // 22. Payment Screen Split
          //Setting up payment screen -  for case of split payments, if transaction was cancelled out in between
          
          let splitTotal = Number(cashierscreen['total']).toFixed(2)
          let splitCaptured = 0
          
          for(let payment of paymentList){
            splitCaptured += Number(payment['paymentamount'])
          }
          
          paymentscreen['splitPaymentActive'] = 'Active'
          paymentscreen['splitTotal'] = Number(splitTotal).toFixed(2)
          paymentscreen['splitCaptured'] = splitCaptured
          paymentscreen['splitBalance'] = Number(splitTotal - splitCaptured).toFixed(2)
          
          //setup txhdr for payment screen
          
            let items = display.receipt.getRecords().map((item) => {
              return{
                cost: Number(item["rprice"]).toFixed(2),
                quantity: item["qty"],
                product: item["item_name"]
              }
            })
          
          paymentscreen['txhdr'] = {
              txhdrkey: transactionHeader["txhdrkey"],
              items: items,
              subtotal : Number(transactionHeader["ordertotal$"]).toFixed(2),
              discount: Number((Number(transactionHeader["discountedtotal$"]) -Number(transactionHeader["taxtotal$"])) - Number(transactionHeader["ordertotal$"])).toFixed(2),
              tax: Number(transactionHeader["taxtotal$"]).toFixed(2),
              total: Number(transactionHeader["discountedtotal$"]).toFixed(2),
              phonenbr: '',
              invoicenbr: transactionHeader["invoicenbr"],
              localts1: transactionHeader["localts1"],
              companynm: cashierscreen["company_name_value"],
              tractornbr: transactionHeader["tractornbr"],
              trailernbr: transactionHeader["trailernbr"],
              ponumber: transactionHeader["ponumber"],
              driverid: transactionHeader["driverid"],
              tripnumber: transactionHeader["tripnumber"],
              location: pjs.session['city'],
              cashiermessage: transactionHeader["cashier_message"],
            }
            //set invoiceNumber Local Variable
            paymentscreen['invoiceNumber'] = transactionHeader["invoicenbr"]

          // 23. Show Payment screen
          Object.assign(paymentscreen, {
            "customer_notes": cashierscreen["customer_notes"],
            "button9": "Add Receipt Notes",
            "comp_name": cashierscreen["comp_name"],
            "comp_name_disabled": cashierscreen["comp_name_disabled"],
            "tractor_number": cashierscreen["tractor_number"],
            "tractor_disabled": cashierscreen["tracktor_disabled"],
            "trailer_number": cashierscreen["trailer_number"],
            "trailer_disabled": cashierscreen["trailer_disabled"],
            "save_Disabled": true,
            "payment_amount": cashierscreen["total"],
            "tractor_number_value": cashierscreen["tractor_number_value"],
            "tractor_number_value_visible": cashierscreen["tractor_number_value_visible"],
            "company_name_value": cashierscreen["company_name_value"],
            "company_id": cashierscreen["company_id"],
            "trailer_number_value": cashierscreen["trailer_number_value"],
            "trailer_number_value_visible": cashierscreen["trailer_number_value_visible"],
            "drvfname": cashierscreen["drvfname"],
            "drveaddress": cashierscreen["drveaddress"],
            "drvlname": cashierscreen["drvlname"],
            "drvtruck": cashierscreen["drvtruck"],
            "drvtrailer": cashierscreen["drvtrailer"],
            "coupon_disable": cashierscreen["coupon_disable"],
            "scrub_disable": cashierscreen["scrub_disable"],
            "subtotal": cashierscreen["rsubtotal"],
            "tax": cashierscreen["tax"],
            "discount": cashierscreen["discount"],
            "weather_icon": cashierscreen["weather_icon"],
            "weather_text": cashierscreen["weather_text"],
            "drvphone": cashierscreen["drvphone"],
            "weather_city": cashierscreen["weather_city"],
            "driverInfoKey": cashierscreen["driverInfoKey"],
            "driver_signature": '',
            "splitPaymentActive": 'Active',
            "current_time": cashierscreen["current_time"],
            "weather_temp": cashierscreen["weather_temp"],
            "weather_percent": cashierscreen["weather_percent"],
            "vacuumVending": cashierscreen["total"],
            "transaction_date": cashierscreen["current_date"]
          });
          screenHistory.push("paymentscreen");
          activeScreen = screens["paymentscreen"];
          return;
        }
      }

      // 24. Otherwise
      else {

        // 25. Populate Payments
        /*
          This block runs in case of transaction having 'Void' or 'Sale' Status. 
          This will load all payments made against this transaction, and Refund status, if any refund done. 
        */
        paymentList = paymentList.map((payment) => {
          return {
            ...payment,
            refunded: payment['refundkey']? true : false
          }
        })
        
        display.transaction_payments.replaceRecords(paymentList)
        
        //all refunded?
        
        let notRefunded = paymentList.filter((item) => !item.refunded)
        
        

        // 26. Company Settings
        var parms = {};
        parms["corporatecustomerskey"] = transactionHeader['corporatecustomerskey'];
        parms["transactionHeader"] = transactionHeader;
        
        var _success = false;
        var _error = null;   
        var _results = null;
        
        try {
          var pjsModule = pjs.require("GetCustomerSettingsAndData.module.json");
          _results = pjsModule["Customer Settings"](parms);
          _success = true;
        }
        catch (err) {
          _error = err;
          console.error(err);
        }
        
        view_transaction['company_name_value'] = _results ? _results["company_name_value"] : null;
        view_transaction['comp_name'] = _results ? _results["comp_name"] : null;
        view_transaction['customer_notes'] = _results ? _results["customer_notes"] : null;
        view_transaction['customer_selected'] = _results ? _results["customer_selected"] : null;
        view_transaction['customer_not_selected'] = _results ? _results["customer_not_selected"] : null;
        view_transaction['checkoutDisabled'] = _results ? _results["checkoutDisabled"] : null;
        view_transaction['couponVisible'] = _results ? _results["couponVisible"] : null;
        view_transaction['scrubVisible'] = _results ? _results["scrubVisible"] : null;
        view_transaction['save_Disabled'] = _results ? _results["save_Disabled"] : null;
        view_transaction['allWashes'] = _results ? _results["allWashes"] : null;
        view_transaction['customerNotesVisible'] = _results ? _results["customerNotesVisible"] : null;
        view_transaction['discount_label'] = _results ? _results["discountType"] : null;
        view_transaction['tractor_number'] = _results ? _results["tractor_number"] : null;
        view_transaction['trailer_number'] = _results ? _results["trailer_number"] : null;
        view_transaction['tractor_number_value'] = _results ? _results["tractor_number_value"] : null;
        view_transaction['trailer_number_value'] = _results ? _results["trailer_number_value"] : null;
        view_transaction['tractor_number_value_visible'] = _results ? _results["tractor_number_value_visible"] : null;
        view_transaction['trailer_number_value_visible'] = _results ? _results["trailer_number_value_visible"] : null;
        view_transaction['driverInfoKey'] = _results ? _results["driverInfoKey"] : null;
        view_transaction['drvfname'] = _results ? _results["drvfname"] : null;
        view_transaction['drvlname'] = _results ? _results["drvlname"] : null;
        view_transaction['drvphone'] = _results ? _results["drvphone"] : null;
        view_transaction['drveaddress'] = _results ? _results["drveaddress"] : null;
        view_transaction['drvtruck'] = _results ? _results["drvtruck"] : null;
        view_transaction['drvtrailer'] = _results ? _results["drvtrailer"] : null;
        view_transaction['tracktor_disabled'] = _results ? _results["tracktor_disabled"] : null;
        view_transaction['comp_name_disabled'] = _results ? _results["comp_name_disabled"] : null;
        view_transaction['trailer_disabled'] = _results ? _results["trailer_disabled"] : null;

        // 27. Assign Totals + receipt
        //Calculate totals of saved Transaction
        view_transaction['total'] = transactionHeader['discountedtotal$']
        view_transaction['tax'] = transactionHeader['taxtotal$']
        view_transaction['rsubtotal'] = transactionHeader['ordertotal$']
        var discountValue = Number((Math.abs(transactionHeader['ordertotal$']) + Math.abs(transactionHeader['taxtotal$'])) - Math.abs(transactionHeader['discountedtotal$'])).toFixed(2)
        view_transaction['discount'] = discountValue
        
        display.transaction_receipt.replaceRecords(details);
        
        //Transfer tX to view transaction
        view_transaction["transactionRecord"] = transactionHeader
        view_transaction["txhdrkey"] = transactionHeader["txhdrkey"]

        // 28. Populate Transaction Details
        // /*
        //   case Scenario: Transaction status = 'Sale' or 'Void'
        //   Loads transaction details[purchased products] in receipt grid on view transaction screen
        //   Also loads discount display preferences
        // */
        // var _success = false;
        // var _error = null;
        // 
        // var _records = null;
        // try {
        //   var query = "SELECT  TRANSACTIONDETAILS.COST as rprice,  TRANSACTIONDETAILS.COSTFULL as actualprice,TRANSACTIONDETAILS.QUANTITY as qty, PRODUCTS.PRODUCT as item_name, PRODUCTS.PRDKEY FROM TRANSACTIONDETAILS INNER JOIN PRODUCTS ON PRODUCTS.PRDKEY = TRANSACTIONDETAILS.PRODUCTSKEY WHERE TRANSACTIONSHEADERKEY = ?  AND TRANSACTIONDETAILS.DELETE = ? ";
        //   var _records = pjs.query(query, [transactionHeader["txhdrkey"], 'N']);
        //   view_transaction["transactionRecord"] = transactionHeader
        //   view_transaction["comp_name"] = transactionHeader["corporatecustomerskey"]
        //   view_transaction["customer_notes"] = transactionHeader["message_cashier"]
        //   view_transaction["txhdrkey"] = transactionHeader["txhdrkey"]
        //   view_transaction["companynm"] = activeGridRecord["companynm"]
        // 
        // 
        //   if(transactionHeader["ctruckskey"] != null){
        //     view_transaction["tractor_number"] = transactionHeader["ctruckskey"]
        //     view_transaction["tractor_number_value_visible"] = false
        //     view_transaction["tractor_number_value"] = transactionHeader["tractornbr"]
        //   }
        //   else if(transactionHeader["tractornbr"] != null){
        //     view_transaction["tractor_number"] = ""
        //     view_transaction["tractor_number_value"] = transactionHeader["tractornbr"]
        //     view_transaction["tractor_number_value_visible"] = true
        //     }
        //   else{
        //     view_transaction["tractor_number"] = ""
        //     view_transaction["tractor_number_value"] = ""
        //   }
        //   if(transactionHeader["ctrailskey"] != null){
        //     view_transaction["trailer_number"] = transactionHeader["ctrailskey"]
        //     view_transaction["trailer_number_value_visible"] = false
        //     view_transaction["trailer_number_value"] = transactionHeader["trailernbr"]
        //   }
        //   else if(transactionHeader["trailernbr"] != null){
        //     view_transaction["trailer_number"] = ""
        //     view_transaction["trailer_number_value"] = transactionHeader["trailernbr"]
        //     view_transaction["trailer_number_value_visible"] = true
        //     }
        //   else{
        //       view_transaction["trailer_number"] = ""
        //       view_transaction["trailer_number_value"] = ""
        //   }
        //   if(transactionHeader["driverskey"] != null){
        //     var query = "SELECT DRIVERSKEY, FIRSTNAME, LASTNAME, PHONENBR, EMAILADDRESS, TRUCKNBR, TRAILERNBR FROM DRIVERS WHERE DRIVERSKEY = ?";
        //     var driver = pjs.query(query, [transactionHeader["driverskey"]])
        //     driver = driver[0];
        //     view_transaction["driverInfoKey"] = driver["driverskey"]
        //     view_transaction["drvfname"] = driver["firstname"];
        //     view_transaction["drvlname"] = driver["lastname"];
        //     view_transaction["drvphone"] = driver["phonenbr"];
        //     view_transaction["drveaddress"] = driver["emailaddress"];
        //     view_transaction["drvtruck"] = transactionHeader["tractornbr"]
        //     view_transaction["drvtrailer"] = transactionHeader["trailernbr"]
        //   }
        //   else{
        //     view_transaction["driverInfoKey"] = ""
        //     view_transaction["drvfname"] = ""
        //     view_transaction["drvlname"] = ""
        //     view_transaction["drvphone"] = ""
        //     view_transaction["drveaddress"] = ""
        //     view_transaction["drvtruck"] = transactionHeader["tractornbr"]
        //     view_transaction["drvtrailer"] = transactionHeader["trailernbr"]
        //   }
        //   _success = true;
        // }
        // catch (err) {
        //   _records = [];
        //   _error = err;
        //   console.log(err)
        // }
        // display.transaction_receipt.replaceRecords(_records);
        // 
        // var viewdiscount=false;
        // var viewactual=true;
        // if(cashierscreen["discount_print"]==="Discount")
        // {
        //   viewactual=false;
        //   viewdiscount=true;
        // }
        // display.transaction_receipt.applyMap(gridRecord => {
        //   gridRecord["displayActual"] = viewactual
        //   gridRecord["displayDiscount"] = viewdiscount
        //   return gridRecord;
        // });

        // 29. Fetch Wash History
        // /*
        //   Case scenario: Transaction status = 'void' or 'sale'
        //   Loads wash history of associated driver on view transaction screen
        // */
        // var _success = false;
        // var _error = null;
        // 
        // var _records = null;
        // try {
        //   var _from = "TRANSACTIONSHEADER INNER JOIN TRANSACTIONDETAILS ON TRANSACTIONSHEADER.TXHDRKEY = TRANSACTIONDETAILS.TRANSACTIONSHEADERKEY INNER JOIN PRODUCTS ON TRANSACTIONDETAILS.PRODUCTSKEY = PRODUCTS.PRDKEY INNER JOIN DRIVERS ON TRANSACTIONSHEADER.DRIVERSKEY = DRIVERS.DRIVERSKEY INNER JOIN TOMLCTNS ON TOMLCTNS.LOCATIONKEY = TRANSACTIONSHEADER.LOCATIONSKEY";
        //   var _filter = { 
        //     whereClause: `TRANSACTIONSHEADER.DRIVERSKEY = ? AND TRANSACTIONSHEADER.STATUS = ? AND TRANSACTIONDETAILS.DELETE <> ?`,
        //     values: [view_transaction["driverInfoKey"], 'Sale', 'Y']
        //   };
        //   var _limit = ``;
        //   var _skip = ``;
        //   var _orderby = ``;
        //   var _select = `TRANSACTIONSHEADER.LOCALTS1 as localtimestamp,PRODUCTS.PRODUCT,TOMLCTNS.LOCATION`;
        // 
        //   _records = pjs.data.get(_from, _filter, _limit, _skip, _orderby, _select);
        //   _success = true;
        // }
        // catch (err) {
        //   _records = [];
        //   _error = err;
        // }
        // display.transaction_driver_history.replaceRecords(_records);

        // 30. Disable Customer Details
        // //This step makes sure that every thing on view transaction is read only
        // 
        // view_transaction["tractor_disabled"]=true;
        // view_transaction["trailer_disabled"]=true;
        // view_transaction["comp_name_disabled"]=true;

        // 31. Remove from Screen History?
        if(activeScreen == screens["view_transaction"]){
          screenHistory.pop()
        }

        // 32. Discount Type
        // var _success = false;
        // var _error = null;
        // 
        // var _record = null;
        // try {
        //   var _from = "CORPORATECUSTOMERS LEFT JOIN DISCOUNTTYPES ON CORPORATECUSTOMERS.DISCOUNTTYPESKEY = DISCOUNTTYPES.DTYPEKEY";
        //   var _filter = { 
        //     whereClause: `CORPORATECUSTOMERS.corpcustkey = ?`,
        //     values: [transactionHeader["corporatecustomerskey"]]
        //   };
        //   var _select = `DISCOUNTTYPES.type,CORPORATECUSTOMERS.companynm`;
        // 
        //   _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
        //   _success = true;
        // }
        // catch (err) {
        //   _error = err;
        //   console.error(err);
        // }
        // 
        // // If no record found
        // if (!_record) {
        //   _record = {};
        //   _error = new Error("Record not found.")
        //   _success = false;
        // }
        // var discountType = _record;

        // 33. Show Transaction screen
        Object.assign(view_transaction, {
          "save_Disabled": true,
          "transaction_title": "#" + transactionHeader["invoicenbr"],
          "customer_not_selected": false,
          "weather_icon": cashierscreen["weather_icon"],
          "subtotal": transactionHeader["ordertotal$"],
          "tax": transactionHeader["taxtotal$"],
          "weather_text": cashierscreen["weather_text"],
          "discount": Number((Number(transactionHeader["ordertotal$"]) + Number(transactionHeader["taxtotal$"]) ) - Number(transactionHeader["discountedtotal$"])).toFixed(2),
          "total": Number(transactionHeader['discountedtotal$']).toFixed(2),
          "transaction_time": transactionHeader['localtimestamp'],
          "transaction_date": transactionHeader['localtimestamp'],
          "receipt_notes": transactionHeader["cashiermessage"],
          "send_receipt_text": "Send Invoice",
          "disableEmailBtn": false,
          "sendReceiptVisible": transactionHeader['status'] == 'Void' ? false : true,
          "voidButtonVisible": notRefunded.length == 0 ? false : true,
          "transaction_status": transactionHeader["status"],
          "weather_city": cashierscreen['weather_city'],
          "weather_temp": cashierscreen["weather_temp"],
          "current_date": cashierscreen['current_date'],
          "weather_percent": cashierscreen["weather_percent"]
        });
        screenHistory.push("view_transaction");
        activeScreen = screens["view_transaction"];
        return;
      }
    },

    "Cashier Clear Click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Remove grid records
      display.receipt.applyFilter(gridRecord => {
        if (gridRecord["qty"] != 0) return false;
        else return true;
      });

      // 3. Remove Wash History grid records
      display.driver_history.applyFilter(gridRecord => {
        if (gridRecord["product"] != '') return false;
        else return true;
      });

      // 4. Remove Suggestions grid records
      display.suggestions.applyFilter(gridRecord => {
        if (gridRecord["suggested_wash_type"] != '') return false;
        else return true;
      });

      // 5. Clear Values
      Object.assign(cashierscreen, {
        "customer_notes": '',
        "customerNotesVisible": false,
        "button1": "",
        "choice1_value": "",
        "button2": "",
        "choice2_value": "",
        "button3": "",
        "choice3_value": "",
        "button4": "",
        "choice4_value": "",
        "button5": "",
        "choice5_value": "",
        "button6": "",
        "choice6_value": "",
        "button7": "",
        "choice7_value": "",
        "button8": "",
        "choice8_value": "",
        "comp_name": '',
        "tractor_number": '',
        "trailer_number": '',
        "customer_not_selected": true,
        "tsearch": '',
        "product_category_options": "",
        "category": "",
        "psearch": '',
        "company_info_focus_on": "customer-company",
        "tractor_number_value": "",
        "tractor_number_value_visible": false,
        "trailer_number_value": "",
        "trailer_number_value_visible": false,
        "company_id": "",
        "company_name_value": "",
        "drvfname": '',
        "drveaddress": '',
        "drvlname": '',
        "drvphone": '',
        "drvtruck": '',
        "drvtrailer": '',
        "couponVisible": true,
        "scrubVisible": true,
        "rsubtotal": '',
        "tax": '',
        "discount": '',
        "total": '',
        "nlcomp_name": '',
        "nlcity": '',
        "nlstate_name": '',
        "nlmgr_name": '',
        "nltruck_number": '',
        "nlphone_number": '',
        "nlzip": '',
        "driverInfoKey": ''
      });

      // 6. Refresh Products
      logic["Refresh Products"]();

      // 7. Refresh Today's Transaction
      logic["Refresh Today's Transaction"]();

      // 8. Clear Flags, TX Loaded from DB
      cashierscreen["flag_tx_loaded_from_db"] = false
      cashierscreen["flag_tx_loaded_from_db_id"] = ''

      // 9. Enable Cusotmer Details
      cashierscreen["tracktor_disabled"]=false;
      cashierscreen["trailer_disabled"]=false;
      cashierscreen["comp_name_disabled"]=false;

      // 10. Remove Split grid REcords
      display.split_payment_grid.applyFilter(gridRecord => {
        if (gridRecord["paymentamount"] && gridRecord["paymentamount"] != '0') return false;
        else return true;
      });

      // 11. Company default settings
      //This step resets back to default settings
      cashierscreen["customer_selected"]=false;
      cashierscreen["customer_not_selected"]=true;
      cashierscreen["purchase_text"]="Check Out";
      cashierscreen["save_Disabled"]=true;
      cashierscreen["couponVisible"]=false;
      cashierscreen["scrubVisible"]=false;
      cashierscreen["product_filter_disabled"] = true;
      cashierscreen["product_search_disabled"] = true;
      cashierscreen["company_info_focus_on"] = "customer-company";
      cashierscreen["checkoutDisabled"] = true;
      cashierscreen["driverInfoKey"] = ""
      cashierscreen['custom_disabled'] = false
      cashierscreen['custom_visible'] = true
      
      //Hidden Fields to support if option not selected in autocomplete
      cashierscreen["tractor_number_value"] = "";
      cashierscreen["trailer_number_value"] = "";
      cashierscreen["tractor_number_value_visible"] = false;
      cashierscreen["trailer_number_value_visible"] = false;
      cashierscreen['customerNotesVisible'] = false
      
      //Flag TX
      cashierscreen["flag_tx_loaded_from_db"] = false;
      
      //Required items
        cashierscreen["has_requirements"] = false
      cashierscreen["req_items"] = ""
      cashierscreen["po_required"] = false
      cashierscreen["tripNumber_required"] = false
      cashierscreen["driverId_required"] = false
      required_fields["ponum"] = ""
      required_fields["tripnum"] = ""
      required_fields["drvid"] = ""
      
      //Scrub Club
      cashierscreen["scrubApply"] = {}
      scrub_club["scrub_club_invoice"] = ""
      
      //additionalItems
      cashierscreen["additionalItems"] = []
      
      
      //payment receipts
      paymentscreen['receiptHTML'] = null
      paymentscreen['scrubClubHTML'] = null
      
      paymentscreen['splitPaymentActive'] = 'Inactive'
      paymentscreen['splitPaymentComplete'] = ''
      paymentscreen['splitPaymentType'] = ''
      paymentscreen['splitPaymentTerminalResponse'] = ''
      paymentscreen['splitPaymentTerminalReceipts'] = ''
      paymentscreen['splitReceiptHTML'] = ''
      paymentscreen['splitScrubClubHTML'] = ''
      paymentscreen['splitCaptured'] = ''
      paymentscreen['splitTotal'] = ''
      paymentscreen['splitBalance'] = ''
      paymentscreen['payment_amount'] = ''
      
      //ZON
      paymentscreen['zonCardType'] = ''
      paymentscreen['zonAuthCode'] = ''
      paymentscreen['zonLastCCDigits'] = ''
      
      zon_voice['auth_code'] =''
      zon_voice['last_cc'] =''
      zon_voice['payment_typpe'] = ''
      
      //coupon
      coupon['coupon_discount'] = ''
      
      
      //Search Fields
      companies["csearch"] = ""
      cashierscreen['psearch'] = ''
      cashierscreen['tsearch'] = ''
      
      
      //Receipt Nots
      receipt_notes["receipt_notes"] = ''
      
      //CCS classes for required fields
      
      cashierscreen['comp_name_css'] = 'tom-input'
      cashierscreen['tractor_number_css'] = 'tom-input'
      cashierscreen['trailer_number_css'] = 'tom-input'
      
      cashierscreen['drvfnamecss'] = 'tom-input'
      cashierscreen['drvlnamecss'] = 'tom-input'
      cashierscreen['drveaddresscss'] = 'tom-input'
      cashierscreen['drvphonecss'] = 'tom-input'
      cashierscreen['drvtruckcss'] = 'tom-input'
      cashierscreen['drvtrailercss'] = 'tom-input'
      
      required_fields['ponumcss'] = 'tom-input'
      required_fields['drvidcss'] = 'tom-input'
      required_fields['tripnumcss'] = 'tom-input'
      //Set scroll for Products
      
      cashierscreen['productsActiveRecord'] = 0
      
      
      //driver refused checkbox
      cashierscreen['driverRefused'] = false
      cashierscreen['driverRefusedDisabled'] = false
      
      //Track if reasons inserted for modified price. 
      cashierscreen['modifiedPriceSpecials'] = []

      // 12. Clear Search Fields
      //clear search
      companies['csearch'] = ''
      companies['tsearch'] = ''
      cashierscreen['psearch'] = ''
      cashierscreen['tsearch'] = ''
      paymentscreen['tsearch'] = ''
      view_transaction['tsearch'] = ''
      cashierscreen_shiftsales['tsearch'] = ''
      
      
      

      // 13. navigate to cashier
      if(activeScreen != screens["cashierscreen"])
      {
        screenHistory.push("cashierscreen")
        activeScreen = screens["cashierscreen"]
      }
    },

    "Category Filter in Products": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Reset Scroll
      cashierscreen['productsActiveRecord'] = 0
    },

    "Save Transaction From Cashier": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Validation
      /*
        Case Scenario: New Transaction Save.
        This step validates that all the inputs are valid
      */
      
      //Prepare variables and query
      
      //REturn if company name is not present
      if(cashierscreen["comp_name"] == "")
      {
        //company name missing
        pjs.messageBox({
          title: '',
          message: "Please enter company name field, company name cannot be empty"
        })
        return
      }
      //Require and validate tractor number
      if(cashierscreen["tractor_number"] == "")
      {
        if(cashierscreen["validateTractor"]){
          //Truck Number is not valid for this customer
          pjs.messageBox({
            title: '',
            message: "Please enter correct Truck number,Truck Number cannot be empty or is not associated with this customer"
          })
          return
        }
        else if(cashierscreen["tractor_number_value"] == ""){
          //Truck Number not entered
          pjs.messageBox({
            title: '',
            message: "Please enter Truck Number field, Truck Number cannot be empty"
          })
          return
        }
      }
      //Require and validate trailer number
      if(cashierscreen["trailer_number"] == "")
      {
        if(cashierscreen["validateTrailer"]){
          //Trailer Number is not valid for this customer
          pjs.messageBox({
            title: '',
            message: "Please enter correct number in  Trailer field, trailer number cannot be empty or is not associated with this customer"
          })
          return
        }
        else if(cashierscreen["trailer_number_value"] == ""){
          //Trailer Number not entered
          pjs.messageBox({
            title: '',
            message: "Please enter Trailer Number ,Trailer Number cannot be empty"
          })
          return
        }
      }
      //Require and validate driver
      if((cashierscreen["driverInfoKey"] == "" || cashierscreen["driverInfoKey"] == 0) && !cashierscreen['driverRefused']){
        if(cashierscreen["drvfname"] !== ""){
          pjs.messageBox({
            title: '',
            message: "Please save driver first"
          })
          return
        }
        else{
          pjs.messageBox({
            title: '',
            message: "Driver cannot be empty"
          })
          return
        }
      }
      
      if(display.receipt.getRecordCount() == 0){
        pjs.messageBox({
          title: "",
          message: "No line items in receipt grid"
        })
        return
      }
      
      //Validation for REquired Items
      
      var missing  = false
      var message = []
      if(cashierscreen["po_required"] && (required_fields["ponum"] == "" || required_fields["ponum"] == undefined)) {
        message.push("PO Number")
        missing = true
      }
      if(cashierscreen["tripNumber_required"] && (required_fields["tripnum"] == "" || required_fields["tripnum"] == undefined)){
        message.push("Trip Number")
        missing = true
      }
      if(cashierscreen["driverId_required"] && (required_fields["drvid"] == "" || required_fields["drvid"] == undefined)){
        message.push("Driver ID")
        missing = true
      }
      if(missing){
          pjs.messageBox({
          title: "",
          message: message.toString() + " required"
        })
        return
      }

      // 3. Save Transaction
      var parms = {};
      parms["clientTime"] = globals['clientTime'];
      parms["updateDetails"] = true;
      parms["status"] = "Open";
      parms["city"] = pjs.session['city'];
      parms["discount_print"] = cashierscreen['discount_print'];
      parms["company_name_value"] = cashierscreen["company_name_value"];
      parms["update"] = cashierscreen["flag_tx_loaded_from_db"];
      parms["rsubtotal"] = cashierscreen["rsubtotal"];
      parms["total"] = cashierscreen["total"];
      parms["tax"] = cashierscreen["tax"];
      parms["customer_notes"] = '';
      parms["driverInfoKey"] = cashierscreen["driverInfoKey"];
      parms["po_required"] = cashierscreen["po_required"];
      parms["ponum"] = required_fields["ponum"];
      parms["tripNumber_required"] = cashierscreen['tripNumber_required'];
      parms["tripnum"] = required_fields['tripnum'];
      parms["driverId_required"] = cashierscreen['driverId_required'];
      parms["drvid"] = required_fields['drvid'];
      parms["flag_tx_loaded_from_db_id"] = cashierscreen["flag_tx_loaded_from_db_id"];
      parms["comp_name"] = cashierscreen["comp_name"];
      parms["tractor_number"] = cashierscreen["tractor_number"];
      parms["trailer_number"] = cashierscreen["trailer_number"];
      parms["TractorTrailerRequired"] = cashierscreen['TractorTrailerRequired'];
      parms["usersKey"] = pjs.session['usersKey'];
      parms["currentShift"] = pjs.session['currentShift'];
      parms["tractor_number_value"] = cashierscreen["tractor_number_value"];
      parms["trailer_number_value"] = cashierscreen["trailer_number_value"];
      parms["locationsKey"] = pjs.session['locationsKey'];
      parms["modifiedPriceSpecials"] = cashierscreen['modifiedPriceSpecials'].length == 0 ? null : cashierscreen['modifiedPriceSpecials']  ;
      parms["receiptGridData"] = display.receipt.getRecords();
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("SaveTransaction.module.json");
        _results = pjsModule["SaveTransaction"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      cashierscreen['flag_tx_loaded_from_db'] = _results ? _results["flag_tx_loaded_from_db"] : null;
      var invoiceNumber = _results ? _results["invoiceNumber"] : null;

      // 4. Redeem Scrub?
      var parms = {};
      parms["discountType"] = cashierscreen['discountType'];
      parms["scrubApply"] = cashierscreen['scrubApply'] ? (Object.keys(cashierscreen['scrubApply']).length == 0 ? null : cashierscreen['scrubApply']) : null;
      parms["invoiceNumber"] = invoiceNumber;
      parms["locationsKey"] = pjs.session['locationsKey'];
      parms["clientTime"] = globals['clientTime'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("RedeemScrubClub.module.json");
        _results = pjsModule["Redeem Scrub Club"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }

      // 5. Clear
      logic["Cashier Clear Click"]();

      // 6. Update Receipt SubTotal
      // cashierscreen["rsubtotal"] = display.receipt.reduce((total, record) => {
      //   var num = Number(record["rprice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      // }, 0);

      // 7. Remove Scrub/Coupon
      // /*
      //   This step removes coupons if applicable before saving a transaction
      //   Coupons have to be reapplied if this transaction is opened again. 
      // */
      // var nontaxable = 0;
      // display.receipt.forEach(function(record) {
      //   if (record.taxable == 'N' && record.loctaxable != 'Y'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      //   else if(record.taxable == 'Y' && record.loctaxable == 'N'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      // });
      // cashierscreen["nontaxable"] = nontaxable;
      // 
      // let surcharge = 0 , 
      //     discount = 0, 
      //     subtotal = cashierscreen["rsubtotal"], 
      //     tax = 0,
      //     actualTotal = 0,
      //     total = 0 
      // 
      // //Calculate total of Full prices of line items.
      // actualTotal = display.receipt.reduce((total, record) => {
      //   var num = Number(record["actualPrice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      //   }, 0);
      // 
      // 
      // //Apply Surcharges
      // if(pjs.session["locationSurchargeDiscount"] == "S"){
      //   surcharge += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"]))
      // }
      // 
      // //Determine Taxation
      // if(cashierscreen["customerTaxExempt"] == 'Y'){
      //     tax = 0
      // }
      // else if(pjs.session["locationTaxRate"])
      // {
      //   tax = Number(pjs.session["locationTaxRate"]) * (Number(cashierscreen["rsubtotal"]) - Number(cashierscreen["nontaxable"]));
      // }
      // 
      // //Apply Discounts
      // if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
      //   discount += actualTotal - Number(subtotal);
      //   subtotal = actualTotal
      // }
      // else if(cashierscreen["discountType"] == "Scrub" && Object.keys(cashierscreen["scrubApply"]).length !== 0){
      //   discount += 0
      // }
      // else if(cashierscreen['discountType'] == 'Coupon'){
      //   discount += 0
      // }
      // if(pjs.session["locationSurchargeDiscount"] == "D"){
      //   discount += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"])) 
      // }
      // 
      // //Calculate Totals
      // let taxedTotal = Math.abs(subtotal) + Math.abs(tax)
      // total = (Math.abs(taxedTotal) - Math.abs(discount) ) + surcharge
      // 
      // cashierscreen["rsubtotal"] = Number(subtotal).toFixed(2)
      // cashierscreen["discount"] = Number((Math.abs(discount))).toFixed(2)
      // cashierscreen["tax"] = Number(tax).toFixed(2)
      // cashierscreen["total"] = Number(Math.abs(total)).toFixed(2)

      // 8. Get all receipt records
      // var _data = display.receipt.getRecords();
      // var receiptGridData = _data;

      // 9. Set work variable
      // var invoiceNumber = 0;

      // 10. TX loaded from DB?
      if (cashierscreen["flag_tx_loaded_from_db"] && cashierscreen["flag_tx_loaded_from_db"] != '0') {

        // 11. Validation
        // /*
        //   This block wille execute only if we the transaction already exists in DB
        //   and we are trying to resave the transaction with changes. 
        //   This step will validate the inputs like a save transactions
        // 
        // */
        // 
        // //Prepare variables and query
        // 
        // //Return if company name is not entered or removed. 
        // if(cashierscreen["comp_name"] == "")
        // {
        //   //company name missing
        //   pjs.messageBox({
        //     title: 'Missing Info',
        //     message: "Please enter company name field, company name cannot be empty"
        //   })
        //   cashierscreen['comp_name_css'] = 'tom-input-error'
        //   return
        // }
        // else{
        //   cashierscreen['comp_name_css'] = 'tom-input'
        // }
        // 
        // //Validate and require tractor number
        // if(cashierscreen["tractor_number"] == "")
        // {
        //   if(cashierscreen["validateTractor"]){
        //     //Truck Number is not valid for this customer
        //     pjs.messageBox({
        //       title: 'Invalid Info',
        //       message: "Please enter correct Truck number,Truck Number cannot be empty or is not associated with this customer"
        //     })
        //     return
        //   }
        //   else if(cashierscreen["tractor_number_value"] == ""){
        //     //Truck Number not entered
        //     pjs.messageBox({
        //       title: 'Missing Info',
        //       message: "Please enter Truck Number field, Truck Number cannot be empty"
        //     })
        //     return
        //   }
        //   cashierscreen['tractor_number_css'] = 'tom-input-error'
        // }
        // //validate and require trailer number
        // if(cashierscreen["trailer_number"] == "")
        // {
        //   if(cashierscreen["validateTrailer"]){
        //     //Trailer Number is not valid for this customer
        //     pjs.messageBox({
        //       title: 'Invalid Info',
        //       message: "Please enter correct number in  Trailer field, trailer number cannot be empty or is not associated with this customer"
        //     })
        //     return
        //   }
        //   else if(cashierscreen["trailer_number_value"] == ""){
        //     //Trailer Number not entered
        //     pjs.messageBox({
        //       title: 'Missing Info',
        //       message: "Please enter Trailer Number ,Trailer Number cannot be empty"
        //     })
        //     return
        //   }
        //   cashierscreen['trailer_number'] = 'tom-input-error'
        // }
        // 
        // //Validate Driver is saved and not null
        // if((cashierscreen["driverInfoKey"] == "" || cashierscreen["driverInfoKey"] == 0) && !cashierscreen['driverRefused']){
        //   if(cashierscreen["drvfname"] !== ""){
        //     pjs.messageBox({
        //       title: 'Save Driver',
        //       message: "Please save driver first"
        //     })
        //     return
        //   }
        //   else{
        //     pjs.messageBox({
        //       title: 'Driver Required',
        //       message: "Driver cannot be empty"
        //     })
        //     return
        //   }
        //   cashierscreen['drvfnamecss'] = 'tom-input-error'
        //   cashierscreen['drvlnamecss'] = 'tom-input-error'
        // }
        // 
        // //Validate the purchased products and not a null transaction
        // if(display.receipt.getRecordCount() == 0){
        //   pjs.messageBox({
        //     title: "Line Items",
        //     message: "No line items in receipt grid"
        //   })
        //   return
        // }
        // 
        // //Validation for REquired Items
        // 
        // var missing  = false
        // var message = []
        // if(cashierscreen["po_required"] && (required_fields["ponum"] == "" || required_fields["ponum"] == undefined)) {
        //   message.push("PO Number")
        //   missing = true
        //   required_fields['ponumcss'] = 'tom-input-error'
        // }
        // if(cashierscreen["tripNumber_required"] && (required_fields["tripnum"] == "" || required_fields["tripnum"] == undefined)){
        //   message.push("Trip Number")
        //   missing = true
        //   required_fields['tripnumcss'] = "tom-input-error"
        // }
        // if(required_fields["driverId_required"] && (required_fields["drvid"] == "" || required_fields["drvid"] == undefined)){
        //   message.push("Driver ID")
        //   missing = true
        //   required_fields['drvidcss'] = 'tom-input-error'
        // }
        // if(missing){
        //     pjs.messageBox({
        //     title: "Required",
        //     message: message.toString() + " required"
        //   })
        //   logic['Required Items Click']();
        //   return
        // }

        // 12. Update TXHeader
        // /*
        //   case scenario: Transaction exists and we are trying to resave
        //   This step updates Transactions summary in transactions header table. 
        // */
        // var updatedReceipt = display.receipt.getRecords();
        // 
        // try{
        // var values = [
        //                 globals['clientTime'],
        //                 cashierscreen["rsubtotal"],
        //                 cashierscreen["total"],
        //                 cashierscreen["tax"],
        //                 cashierscreen["customer_notes"],               
        //               ];
        // 
        //   var columns ="";
        //   if(cashierscreen['driverInfoKey'] != ''){
        //     columns += ", DRIVERSKEY = ?"     
        //     values.push(cashierscreen["driverInfoKey"])
        //   }
        //   if(cashierscreen["po_required"]){
        //     columns += ", PONUMBER = ?"
        //      
        //     values.push(required_fields["ponum"])
        //   }
        //   if(cashierscreen["tripNumber_required"]){
        //     columns += ", TRIPNUMBER = ?"
        //     
        //     values.push(required_fields["tripnum"])
        //   }
        //   if(cashierscreen["driverId_required"]){
        //     columns += ", DRIVERID = ?"
        //    
        //     values.push(required_fields["drvid"])
        //   }
        //   values.push(cashierscreen["flag_tx_loaded_from_db_id"])
        //   var query = "UPDATE TRANSACTIONSHEADER SET LOCALTS1 = ?, ORDERTOTAL$=? ,  DISCOUNTEDTOTAL$=?, TAXTOTAL$=?, CASHIERMESSAGE=?" +columns+ " WHERE TXHDRKEY = ?" ;
        //   var _records = pjs.query(query, values)
        //   var txHdr = {
        //     "corporatecustomerskey" : cashierscreen["comp_name"]
        //   }
        //   if((cashierscreen["tractor_number"] == '' || cashierscreen['trailer_number'] == '') && cashierscreen['TractorTrailerRequired'])
        //     txHdr["tractornbr"] = cashierscreen["tractor_number"];
        //   if(cashierscreen["trailer_number"] != '')
        //     txHdr["trailernbr"] = cashierscreen["trailer_number"];
        // 
        //   if(cashierscreen["tractor_number"] != '' && cashierscreen["trailer_number"] != '')
        //   {
        //     var query = "SELECT DRIVERSKEY FROM DRIVERS WHERE CORPCUSTKEY = ? AND CORPTRUCKKEY = ? AND CORPTRAILERKEY = ?"
        //     var driverkey = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["tractor_number"], cashierscreen["trailer_number"]]);
        //     if(driverkey != [] && Object.keys(driverkey).length != 0){
        //       txHdr["driverskey"] = driverkey["driverskey"];
        //     }   
        //   }
        //   
        //   invoiceNumber = pjs.query('SELECT INVOICENBR FROM TRANSACTIONSHEADER WHERE TXHDRKEY = ? ', [cashierscreen["flag_tx_loaded_from_db_id"]])[0]['invoicenbr']
        // 
        // }
        // catch (err){
        //   //error occurred
        // }
        // cashierscreen["flag_tx_loaded_from_db"] = false

        // 13. Update TXDetails
        // /*
        //   case scenario: Resave a transaction after opening and changing 'Open' Status
        //   This step will replace Products purchased in transaction details table
        // */
        // var _error = null
        // var _success = null
        // try {
        //   var query = "UPDATE TRANSACTIONDETAILS SET DELETE=?, DELETEDBY=?, DELETEDTS=?, LSTTOUCHBY=? WHERE TRANSACTIONSHEADERKEY=? ";
        // 
        //   var values = [
        //               "Y",
        //               pjs.session['usersKey'],
        //               globals['clientTime'],
        //               pjs.session['usersKey'],
        //               cashierscreen["flag_tx_loaded_from_db_id"]
        //             ];
        // 
        //   var _records = pjs.query(query, values)
        //   var txhdrkey = cashierscreen["flag_tx_loaded_from_db_id"];
        // 
        //     //insert modified prices seperately for reason codes to update
        //   if(cashierscreen['modifiedPriceSpecials'].length != 0){
        //     let modifiedPriceItems = receiptGridData.filter(item => cashierscreen['modifiedPriceSpecials'].filter(product => product['prdkey'] == item['prdkey']).length > 0)
        // 
        //     cashierscreen['modifiedPriceSpecials'].forEach((product) => {
        //       let item = modifiedPriceItems.filter(modified => modified['prdkey'] == product['prdkey'])
        //       let txdtlkey = `SELECT TXDTLKEY FROM NEW TABLE
        //                       ( INSERT INTO TRANSACTIONDETAILS(TRANSACTIONSHEADERKEY, PRODUCTSKEY, QUANTITY, COSTFULL, COST, COSTORG, DELETE) 
        //                       VALUES(?, ?, ?, ?, ?, ?, ?))`
        // 
        //       let costorg = display.products.getRecords().filter((prd) => prd['prdkey'] == item[0]['prdkey'])
        //       costorg = Number(Number(costorg[0]['price']) * Number(item[0]['qty'])).toFixed(2)
        // 
        //       let values = [
        //         txhdrkey,
        //         item[0]['prdkey'],
        //         item[0]['qty'],
        //         item[0]['actualPrice'],
        //         item[0]['rprice'],
        //         costorg,
        //         'N'
        //       ]
        //       txdtlkey = pjs.query(txdtlkey, values)
        //       product['txdtlkey'] = txdtlkey[0]['txdtlkey']
        //       product['transactionheaderkey'] = txhdrkey
        //     })
        //     let updateTXDTL = cashierscreen['modifiedPriceSpecials'].filter(product => product['txspeckey'] != null && product['txspeckey'] != undefined)
        //     if(updateTXDTL.length != 0){
        //       updateTXDTL.forEach((update) => {
        //         pjs.query('UPDATE TRANSACTIONSPECIALS SET TXDTLKEY = ? WHERE TXSPECKEY = ? ', [update.txdtlkey, update.txspeckey])
        //       })
        //     }
        // 
        //     //soft delete any removed reason codes from txspecials. 
        //     let removeSpecials = updateTXDTL.map(item => item['txspeckey'])
        //     if(removeSpecials.length != 0)
        //     {
        //       removeSpecials = removeSpecials.join(',')
        //       pjs.query('UPDATE TRANSACTIONSPECIALS SET DELETE = ? WHERE TRANSACTIONHEADERKEY = ? AND WHAT = ? AND TXSPECKEY NOT IN ('+removeSpecials+')', ['Y', txhdrkey, 'Price'])
        //     }
        // 
        //     receiptGridData = receiptGridData.filter(item => cashierscreen['modifiedPriceSpecials'].filter(product => product['prdkey'] == item['prdkey']).length == 0)
        //     
        //     cashierscreen['modifiedPriceSpecials'] = cashierscreen['modifiedPriceSpecials'].filter(product => product['txspeckey'] == null || product['txspeckey'] == undefined)
        //     
        //     let specials = cashierscreen['modifiedPriceSpecials'].map( (special) => {
        //       return{
        //         what : special.what,
        //         reasoncodeskey: special.reasoncodeskey,
        //         transactionheaderkey: special.transactionheaderkey,
        //         txdtlkey : special.txdtlkey,
        //         userskey: special.userskey, 
        //         otherdesc: special.otherdesc,
        //         'delete' : special['delete']
        //       }
        //     })
        //     pjs.query('INSERT INTO TRANSACTIONSPECIALS SET ? ', specials)
        //   }
        // 
        //   var productsDetails = receiptGridData.map((product) => {
        //   return {
        //     "transactionsheaderkey" : txhdrkey,
        //     "productskey" : product["prdkey"],
        //     "quantity":  product["qty"],
        //     "costfull": product["actualPrice"],
        //     "cost": product["rprice"],
        //     "costorg": product['actualPrice'],
        //     "delete": 'N'
        //   }
        //   })
        //   query = "INSERT INTO TRANSACTIONDETAILS SET ?";
        //   _records = pjs.query(query, productsDetails)
        //   _success = true;
        // }
        // catch (err) {
        //   _records = [];
        //   _error = err;
        //   console.log(err)
        // }
      }

      // 14. Otherwise
      else {

        // 15. Setup additional fields
        // //Setup Date
        // var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        // const d = new Date();
        // var day = weekDays[d.getDay()];
        // 
        // //Setup Invoice Number
        // try{
        //   var query = "SELECT NUMBER FROM NEXTNBR WHERE NEXTNBR.LOCTNKEY = ?";
        //   invoiceNumber = pjs.query(query, pjs.session['locationsKey']);
        //   invoiceNumber = invoiceNumber[0]["number"];
        //   var query = "UPDATE NEXTNBR SET NEXTNBR.NUMBER = ? WHERE NEXTNBR.LOCTNKEY = ?";
        //   var nextInvoice = pjs.query(query, [invoiceNumber+1, pjs.session['locationsKey']]);
        // }
        // catch (err){
        //   //error
        // }

        // 16. Save Transaction
        // /*
        //   Case Scenario: Saving a new Transaction
        //   This step inserts Transaction summary into Transaction header table and Purchased products in Transaction details table. 
        //   Every save transaction is by default a 'Open' Transaction
        // */
        // 
        // try{
        //   var columns = "LOCALTS1, USERSKEY, DAYOFWEEK1, LOCATIONSKEY, CORPORATECUSTOMERSKEY,  STATUS, ORDERTOTAL$, DISCOUNTEDTOTAL$, TAXTOTAL$, INVOICENBR, SHIFT"
        //   var values = [
        //               globals['clientTime'], 
        //               pjs.session["usersKey"],
        //               day, 
        //               pjs.session["locationsKey"],
        //               cashierscreen["comp_name"],
        //               'Open',
        //               Number(cashierscreen["rsubtotal"]).toFixed(2),
        //               Number(cashierscreen["total"]).toFixed(2),
        //               Number(cashierscreen["tax"]).toFixed(2),
        //               invoiceNumber,
        //               pjs.session['currentShift'] 
        //             ];
        //   var options = "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?"
        //   if(cashierscreen["driverInfoKey"] != ""){
        //     columns += ", DRIVERSKEY"
        //     options += ", ?"
        //     values.push(Number(cashierscreen["driverInfoKey"]))
        //   }
        //   if(cashierscreen["tractor_number_value"] != ""){
        //     columns += ", TRACTORNBR"
        //     options += ", ?"
        //     values.push(cashierscreen["tractor_number_value"])
        //   }
        //   if(cashierscreen["trailer_number_value"]){
        //     columns += ", TRAILERNBR"
        //     options += ", ?"
        //     values.push(cashierscreen["trailer_number_value"])
        //   }
        //   if(cashierscreen["discountTypeKey"] != undefined){
        //     columns += ", DISCOUNTTYPESKEY"
        //     options += ", ?"
        //     values.push(Number(cashierscreen["discountTypeKey"]))
        //   }
        //   if(cashierscreen["po_required"]){
        //     columns += ", PONUMBER"
        //     options += ", ?"
        //     values.push(required_fields["ponum"])
        //   }
        //   if(cashierscreen["tripNumber_required"]){
        //     columns += ", TRIPNUMBER"
        //     options += ", ?"
        //     values.push(required_fields["tripnum"])
        //   }
        //   if(cashierscreen["driverId_required"]){
        //     columns += ", DRIVERID"
        //     options += ", ?"
        //     values.push(required_fields["drvid"])
        //   }
        //   var query = "SELECT TXHDRKEY FROM NEW TABLE(" +
        //               "INSERT INTO TRANSACTIONSHEADER" +
        //               "("+columns+") " +
        //               "VALUES("+options+"))";
        //   var _records = pjs.query(query, values)
        //   
        //   var txhdrkey = _records[0]['txhdrkey'];
        // 
        //   //insert modified prices seperately for reason codes to update
        //   if(cashierscreen['modifiedPriceSpecials'].length != 0){
        //     let modifiedPriceItems = receiptGridData.filter(item => cashierscreen['modifiedPriceSpecials'].filter(product => product['prdkey'] == item['prdkey']).length > 0)
        // 
        //     cashierscreen['modifiedPriceSpecials'].forEach((product) => {
        //       let item = modifiedPriceItems.filter(modified => modified['prdkey'] == product['prdkey'])
        //       let txdtlkey = `SELECT TXDTLKEY FROM NEW TABLE
        //                       ( INSERT INTO TRANSACTIONDETAILS(TRANSACTIONSHEADERKEY, PRODUCTSKEY, QUANTITY, COSTFULL, COST, COSTORG, DELETE) 
        //                       VALUES(?, ?, ?, ?, ?, ?, ?))`
        //       let costorg = item[0]['specialOriginalPrice']//display.products.getRecords().filter((prd) => prd['prdkey'] == item[0]['prdkey'])
        //       costorg = Number(Number(costorg) * Number(item[0]['qty'])).toFixed(2)
        //       
        //       let values = [
        //         txhdrkey,
        //         item[0]['prdkey'],
        //         item[0]['qty'],
        //         item[0]['actualPrice'],
        //         item[0]['rprice'],
        //         costorg,
        //         'N'
        //       ]
        //       txdtlkey = pjs.query(txdtlkey, values)
        //       product['txdtlkey'] = txdtlkey[0]['txdtlkey']
        //       product['transactionheaderkey'] = txhdrkey
        //     })
        //     receiptGridData = receiptGridData.filter(item => cashierscreen['modifiedPriceSpecials'].filter(product => product['prdkey'] == item['prdkey']).length == 0)
        //     let specials = cashierscreen['modifiedPriceSpecials'].map( (special) => {
        //       return{
        //         what : special.what,
        //         reasoncodeskey: special.reasoncodeskey,
        //         transactionheaderkey: special.transactionheaderkey,
        //         txdtlkey : special.txdtlkey,
        //         userskey: special.userskey, 
        //         otherdesc: special.otherdesc,
        //         'delete' : special['delete']
        //       }
        //     })
        //     pjs.query('INSERT INTO TRANSACTIONSPECIALS SET ? ', specials)
        //   }
        // 
        //   //Insert into Transaction Details
        // 
        //   var productsDetails = receiptGridData.map((product) => {
        //     return {
        //       "transactionsheaderkey" : txhdrkey,
        //       "productskey" : product["prdkey"],
        //       "quantity":  product["qty"],
        //       "costfull": product["actualPrice"],
        //       "cost": product["rprice"],
        //       "costorg": product["actualPrice"],
        //       "delete": 'N'
        //     }
        //   })
        //   query = "INSERT INTO TRANSACTIONDETAILS SET ?";
        //   _records = pjs.query(query, productsDetails)
        //   _success = true;
        // }
        // catch(e){
        //   //Error Occurred while saving transaction
        //   console.log('e',e)
        // }
      }

      // 17. Redeem Scrub Club?
      // /*
      //   Redeems scrub club if the scrub club coupon was applied on the transaction. 
      //   This will update scrub club tracking table that the coupon has been redeemed
      // */
      // 
      // if(cashierscreen["discountType"] == "Scrub" && Object.keys(cashierscreen["scrubApply"]).length != 0){
      //   try{
      //     var query = "UPDATE SCRUBCLUBTRACKING "+
      //                 "SET SCRUBCLUBTRACKING.REDEEMEDTRANSACTIONSHEADERINVOICE = ?, SCRUBCLUBTRACKING.REDEEMEDLOCATIONKEY =? , SCRUBCLUBTRACKING.REDEEMEDTIMESTAMP = ? "+ 
      //                 "WHERE SCRUBCLUBTRACKING.SCTRACKKEY = ?"
      // 
      //     var values = [
      //       invoiceNumber,
      //       pjs.session["locationsKey"],
      //       globals['clientTime'],
      //       cashierscreen["scrubApply"]["scrubTrackKey"]
      //     ]
      //     let result = pjs.query(query, values)
      //   }
      //   catch(e){
      //     //Error updating info for redeeming a scrub club coupon
      //     console.log('SC track Redeem', e)
      //   }
      // }
      // else{
      //   //Not redeemed scrub club
      // }
    },

    "Home Refresh": function() {
      // 1. Clear All
      cashierscreen["comp_name"] = ""
      cashierscreen["tractor_number"] = ""
      cashierscreen["trailer_number"] = ""
      cashierscreen["drvfname"] = ""
      cashierscreen["drvlname"] = ""
      cashierscreen["drvphone"] = ""
      cashierscreen["drveaddress"] = ""
      cashierscreen["tax"] = ""
      cashierscreen["total"] = ""
      cashierscreen["rsubtotal"] = ""
      cashierscreen["discount"] = ""
      cashierscreen["drvtruck"] = ""
      cashierscreen["drvtrailer"] = ""
      cashierscreen["driverInfoKey"] = ""
      
      cashierscreen["comp_name_disabled"] = false;
      cashierscreen["tracktor_disabled"] = false;
      cashierscreen["trailer_disabled"] = false;

      // 2. Remove grid records & Navigate to Cashier
      //This step clears out all grids on cashier screen. REceipt, product, suggestions, driver history
      display.products.applyFilter(gridRecord => {
        if (gridRecord["product"] && gridRecord["product"] != '0') return false;
        else return true;
      });
      
      display.suggestions.applyFilter(gridRecord => {
        if (gridRecord["prdkey"] && gridRecord["prdkey"] != '0') return false;
        else return true;
      });
      
      display.receipt.applyFilter(gridRecord => {
        if (gridRecord["prdkey"] && gridRecord["prdkey"] != '0') return false;
        else return true;
      });
      
      display.driver_history.applyFilter(gridRecord => {
        if (gridRecord["product"] && gridRecord["product"] != '0') return false;
        else return true;
      });
      
      screenHistory.push("cashierscreen")
      activeScreen = screens["cashierscreen"]

      // 3. Call Start routine
      logic["start"]();
    },

    "Truck View": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Show Truck Image screen
      Object.assign(truck_view, {
        "productName": activeGridRecord["product"],
        "productId": activeGridRecord["prdkey"],
        "imgSource": activeGridRecord["imageurl"]
      });
      screenHistory.push("truck_view");
      activeScreen = screens["truck_view"];
      return;
    },

    "Add Suggested to Receipt": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Fetch Product Data from Grid
      var _success = true;
      var _data = display.products.filter(gridRecord => {
        if (gridRecord["prdkey"] == activeGridRecord["prdkey"]) return true;
        else return false;
      });
      var productData = _data;

      // 3. Add Product To Reciept
      /*
        This step will add suggested item to Receipt grid. 
      */
      if(productData.length>0)
        productData = productData[0]
      
        var viewdiscount=false;
      var viewactual=true;
      if(cashierscreen["discount_print"]==="Discount")
      {
        viewactual=false;
        viewdiscount=true;
      }
      
      display.receipt.unshift({
        displayActual:viewactual,
        displayDiscount:viewdiscount,
        "item_name": productData["product"],
        "qty": 1,
        "taxable": productData["taxable"],
        "rprice": Number(productData["discountPrice"]).toFixed(2),
        "prdkey": productData["prdkey"],
        "actualPrice":Number(productData["price"]).toFixed(2)
      });
      

      // 4. Remove Suggested Item from suggested Grid
      display.suggestions.applyFilter(gridRecord => {
        if (gridRecord["prdkey"] == activeGridRecord["prdkey"]) return false;
        else return true;
      });

      // 5. Calculate Receipt Totals
      var parms = {};
      parms["receiptRecords"] = display.receipt.getRecords();
      parms["locationSurchargeDiscount"] = pjs.session['locationSurchargeDiscount'];
      parms["locationSurchargeDiscountPercentage"] = pjs.session['locationSurchargeDiscountPercentage'];
      parms["customerTaxExempt"] = cashierscreen["customerTaxExempt"];
      parms["locationTaxRate"] = pjs.session['locationTaxRate'];
      parms["discountType"] = cashierscreen["discountType"];
      parms["coupon_discount"] = coupon["coupon_discount"];
      parms["scrubApply"] = cashierscreen["scrubApply"] ? cashierscreen["scrubApply"] : null ;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetReceiptTotals.module.json");
        _results = pjsModule["Receipt Totals"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      cashierscreen['rsubtotal'] = _results ? _results["rsubtotal"] : null;
      cashierscreen['tax'] = _results ? _results["tax"] : null;
      cashierscreen['discount'] = _results ? _results["discount"] : null;
      cashierscreen['total'] = _results ? _results["total"] : null;
      cashierscreen['nontaxable'] = _results ? _results["nontaxable"] : null;
      var errorMessage = _results ? _results["errorMessage"] : null;
      var errorFlag = _results ? _results["error"] : null;
      coupon['coupon_discount'] = _results ? _results["coupon_discount"] : null;

      // 6. Error?
      if (errorFlag && errorFlag != '0') {

        // 7. Show Error
        pjs.messageBox({
          title: ``,
          message: `${errorMessage}`
        });
      }

      // 8. Update Receipt SubTotal
      // cashierscreen["rsubtotal"] = display.receipt.reduce((total, record) => {
      //   var num = Number(record["rprice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      // }, 0);

      // 9. Update Receipt Total
      // /*
      //   This step updates and calculates new totals after adding the item to receipt. 
      //   This considers, Taxes, discounts, locaiton based surcharges
      // */
      // var nontaxable = 0;
      // display.receipt.forEach(function(record) {
      //   if (record.taxable == 'N' && record.loctaxable != 'Y'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      //   else if(record.taxable == 'Y' && record.loctaxable == 'N'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      // });
      // cashierscreen["nontaxable"] = nontaxable;
      // 
      // let surcharge = 0 , 
      //     discount = 0, 
      //     subtotal = cashierscreen["rsubtotal"], 
      //     tax = 0,
      //     actualTotal = 0,
      //     total = 0 
      // 
      // //Calculate total of Full prices of line items.
      // actualTotal = display.receipt.reduce((total, record) => {
      //   var num = Number(record["actualPrice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      //   }, 0);
      // 
      // 
      // //Apply Surcharges
      // if(pjs.session["locationSurchargeDiscount"] == "S"){
      //   surcharge += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"]))
      // }
      // 
      // //Determine Taxation
      // if(cashierscreen["customerTaxExempt"] == 'Y'){
      //     tax = 0
      //   // cashierscreen["tax"] = 0
      // }
      // else if(pjs.session["locationTaxRate"])
      // {
      //   tax = Number(pjs.session["locationTaxRate"]) * (Number(cashierscreen["rsubtotal"]) - Number(cashierscreen["nontaxable"]));
      // }
      // 
      // //Apply Discounts
      // if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
      //   discount += actualTotal - Number(subtotal);
      //    subtotal = actualTotal
      // }
      // if(pjs.session["locationSurchargeDiscount"] == "D"){
      //   discount += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"])) 
      // }
      // 
      // //Calculate Totals
      // let taxedTotal = Math.abs(subtotal) + Math.abs(tax)
      // total = (Math.abs(taxedTotal) - Math.abs(discount) ) + surcharge
      // 
      // 
      // cashierscreen["rsubtotal"] = Number(subtotal).toFixed(2)
      // cashierscreen["discount"] = Number((Math.abs(discount))).toFixed(2)
      // cashierscreen["tax"] = Number(tax).toFixed(2)
      // cashierscreen["total"] = Number(Math.abs(total)).toFixed(2)

      // 10. Enable Buttons
      //This step enables checkout button
      cashierscreen["save_Disabled"]=false;
      cashierscreen["checkoutDisabled"]=false;
      
    },

    "View Companies": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Filter?
      var filter = false
      var startFilter = ''
      var endFilter = ''
      if(cashierscreen['companiesFilter'] != '' && cashierscreen['companiesFilter'] != undefined){
        filter = true
        var filters = cashierscreen['companiesFilter'].toString().split('-')
        startFilter = filters[0]
        endFilter = filters[1]
      }
      else if(companies['companiesFilter'] != '' && companies['companiesFilter'] != undefined){
        filter = true
        var filters = companies['companiesFilter'].toString().split('-')
        startFilter = filters[0]
        endFilter = filters[1]
      }
      else{
        filters = false
      }
      
      console.log(filter, startFilter, endFilter)

      // 3. Get Companies
      var parms = {};
      parms["filter"] = filter;
      parms["filterStart"] = startFilter;
      parms["filterEnd"] = endFilter;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetCompanies.module.json");
        _results = pjsModule["Companies"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var companyRecords = _results ? _results["companies"] : null;

      // 4. Load grid from a list
      display.companies_grid.replaceRecords(companyRecords);

      // 5. Reset Filter
      cashierscreen['companiesFilter'] = ''
      companies['companiesFilter'] = ''
      

      // 6. Not On Company Screen?
      if (activeScreen != 'companies') {

        // 7. Show Company screen
        Object.assign(companies, {
          "cashier_timeout": cashierscreen["cashier_timeout"],
          "save_Disabled": true,
          "customer_not_selected": cashierscreen["customer_not_selected"],
          "customer_notes": cashierscreen["customer_notes"],
          "trailer_number": cashierscreen["tractor_number"],
          "tractor_number": cashierscreen["trailer_number"],
          "comp_name": cashierscreen["comp_name"],
          "weather_icon": cashierscreen["weather_icon"],
          "weather_text": cashierscreen["weather_text"],
          "drvfname": cashierscreen["drvfname"],
          "drveaddress": cashierscreen["drveaddress"],
          "drvtruck": cashierscreen["drvtruck"],
          "drvtrailer": cashierscreen["drvtrailer"],
          "drvlname": cashierscreen["drvlname"],
          "weather_city": cashierscreen["weather_city"],
          "current_date": cashierscreen['current_date'],
          "weather_temp": cashierscreen["weather_temp"],
          "weather_percent": cashierscreen["weather_percent"]
        });
        screenHistory.push("companies");
        activeScreen = screens["companies"];
        return;
      }
    },

    "Transaction Grid Void Button": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Get Payments
      var parms = {};
      parms["transactionHeaderKey"] = activeGridRecord['txhdrkey'];
      parms["joinRefunds"] = true;
      parms["joinCC"] = true;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetPayments.module.json");
        _results = pjsModule["GetPayments"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var paymentsList = _results ? _results["paymentList"] : null;

      // 3. Assign Payments to Void
      /*
        This step will try to load all the payments made agains selected transaction if any, 
        Also will bring in the refund status. 
      */
      paymentsList = paymentsList.map((payment) => {
        let refundObject = {
          invoice: activeGridRecord['invoicenbr'],
          cc_approved_amount: payment['cc_approved_amount'],
          orig_acct_num: payment['cc_accountnumber'],
          cc_card_entry_mode: payment['cc_card_entry_mode']
        }
        return{
          ...payment,
          ccTerminalRefundObject: JSON.stringify(refundObject),
          refunded: payment['refundkey'] ? true: false
        }
      })

      // 4. can void?
      /*
        Based on HQA Config table, if the user can void a transaction or not. 
        considers time period duration in which a user can void a transaciton
        also checks if the transaction is already a void transaction
      */
      var timestamp = pjs.timestamp(activeGridRecord["localtimestamp"])
      let pendingRefunds = paymentsList.filter((rec) => !rec['refunded'])
      
      if((activeGridRecord["status"].toUpperCase() == "Void".toUpperCase()) && pendingRefunds.length == 0){
        pjs.messageBox({
          title: "Error",
          message: "Transaction is already a void transaction"
        })
        return;
      }
      
      if(timestamp < pjs.session.restrictions["Transaction Restrictions"]["Void Transaction Timeframe"]["startLimit"] || pjs.session.restrictions["Transaction Restrictions"]["Void Transaction Timeframe"]["endLimit"] < timestamp){
        pjs.messageBox({
          title: 'Error',
          message: 'Cannot Void transaction from previous shifts  '+pjs.session['VoidTransactionDuration'].toLocaleString()
        })
        return
      }
      else{
        //Cashier can void
      }

      // 5. if Voided?
      if (activeGridRecord["status"] == 'Void') {

        // 6. Get TxSpecials
        var parms = {};
        parms["txhdrkey"] = activGridRecord['txhdrkey'];
        parms["what"] = 'Void';
        
        var _success = false;
        var _error = null;   
        var _results = null;
        
        try {
          var pjsModule = pjs.require("GetTransactionSpecials.module.json");
          _results = pjsModule["Get Tx Specials"](parms);
          _success = true;
        }
        catch (err) {
          _error = err;
          console.error(err);
        }
        
        var voidReason = _results ? _results["txSpecials"] : null;

        // 7. Load Void Screen
        /*
          This block will allow the user to open the void screen 
          even if the transction status is already 'void'
          This happens only in the case if due to some error all the refunds were not processed. 
          The pending refunds can processed again using this block
        */
        voidReason = voidReason[0]
        
        //refund grid
        display.void_transactions_refund_grid.replaceRecords(paymentsList)
        
        //dependent variables
        let thisTxtotal = activeGridRecord['discountedtotal$']
        
        //Default Settings
        void_transaction["refund_amount"] = thisTxtotal
        void_transaction["comp_name"] = activeGridRecord["companynm"]
        void_transaction["refund_amount_disabled"] = true
        void_transaction["status"] = activeGridRecord["status"]
        void_transaction["txhdrkey"] = activeGridRecord["txhdrkey"]
        void_transaction['creditCardRefundAmount'] = ""
        void_transaction['refundType'] = ""
        void_transaction['txpaykey'] = ""
        void_transaction['refundingActive'] = ""
        void_transaction['creditCardTerminalResponse'] = ""
        void_transaction['void_reason'] = voidReason['reasoncodeskey']
        void_transaction['otherDescription'] = voidReason['otherdesc']
        void_transaction['voidReasonDisabled'] = true
        void_transaction['invoiceNumber'] = activeGridRecord['invoicenbr']
        
        //Determine Refunds
        
        if(activeGridRecord["status"] == "Open"){
          void_transaction["refund_amount"] = "0.00$"
          void_transaction["void_open"] = true
          void_transaction["void_closed"] = false 
          
          if(paymentsList.length == 0){
            // no payments made yet -> open transaction
          }
          else {
            // its a split transaction 
            void_transaction["void_open"] = false
            void_transaction["void_closed"] = true 
            void_transaction["refund_amount"] = paymentsList.reduce((prev, curr) => { 
              return Number(Number(prev) + Number(curr['paymentamount'])).toFixed(2)
              },0)
          }
        }
        else{
          void_transaction["void_open"] = false
          void_transaction["void_closed"] = true 
          
          if(paymentsList.length == 1){
            // only one payment made yet, does the amount match to transaction? if yes its a full pay
            // if the amount is less its a split
            let payment = paymentsList[0]
            if(payment['paymentamount'] == thisTxtotal){
              void_transaction["refund_amount"] = thisTxtotal
            }
          }
          else{
            //split pay complete tx
          }
        
        }
        
        screenHistory.push("void_transaction")
        activeScreen = screens["void_transaction"]
      }

      // 8. Otherwise
      else {

        // 9. Load Void Screen
        /*
          If transaction is not already a 'void' transaction
          will load all the payments made with refund status. 
          and preferences so the user can void transaction and refund the amount. 
        */
        
        //refund grid
        display.void_transactions_refund_grid.replaceRecords(paymentsList)
        
        //dependent variables
        let thisTxtotal = activeGridRecord['discountedtotal$']
        
        //Default Settings
        void_transaction["refund_amount"] = thisTxtotal
        void_transaction["comp_name"] = activeGridRecord["companynm"]
        void_transaction["refund_amount_disabled"] = true
        void_transaction["status"] = activeGridRecord["status"]
        void_transaction["txhdrkey"] = activeGridRecord["txhdrkey"]
        void_transaction['creditCardRefundAmount'] = ""
        void_transaction['refundType'] = ""
        void_transaction['txpaykey'] = ""
        void_transaction['refundingActive'] = ""
        void_transaction['creditCardTerminalResponse'] = ""
        void_transaction['void_reason'] = ''
        void_transaction['voidReasonDisabled'] = false
        void_transaction['otherDescription'] = ''
        
        void_transaction['invoiceNumber'] = activeGridRecord['invoicenbr']
        
        //Determine Refunds
        
        if(activeGridRecord["status"] == "Open"){
          void_transaction["refund_amount"] = "0.00$"
          void_transaction["void_open"] = true
          void_transaction["void_closed"] = false 
          
          if(paymentsList.length == 0){
            // no payments made yet -> open transaction
          }
          else {
            // its a split transaction 
            
            void_transaction["void_open"] = false
            void_transaction["void_closed"] = true 
            void_transaction["refund_amount"] = paymentsList.reduce((prev, curr) => { 
              return Number(Number(prev) + Number(curr['paymentamount'])).toFixed(2)
              },0)
          }
        }
        else{
          void_transaction["void_open"] = false
          void_transaction["void_closed"] = true 
          
          if(paymentsList.length == 1){
            // only one payment made yet, does the amount match to transaction? if yes its a full pay
            // if the amount is less its a split
            let payment = paymentsList[0]
            if(payment['paymentamount'] == thisTxtotal){
              void_transaction["refund_amount"] = thisTxtotal
            }
          }
          else{
            //split pay complete tx
          }
        
        }
        
        screenHistory.push("void_transaction")
        activeScreen = screens["void_transaction"]
      }

      // 10. Tx Specials
      // var _success = false;
      // var _error = null;
      // 
      // var _record = null;
      // try {
      //   var _from = "TRANSACTIONSPECIALS";
      //   var _filter = { 
      //     whereClause: `transactionheaderkey = ? AND what = ?`,
      //     values: [activeGridRecord["txhdrkey"], 'Void']
      //   };
      //   var _select = `reasoncodeskey,what,transactionheaderkey,userskey,otherdesc`;
      // 
      //   _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // // If no record found
      // if (!_record) {
      //   _record = {};
      //   _error = new Error("Record not found.")
      //   _success = false;
      // }
      // var voidReason = _record;

      // 11. Get Payments
      // var _success = false;
      // var _error = null;
      // 
      // var _records = null;
      // try {
      //   var _from = "TRANSACTIONPAYMENTS LEFT JOIN TXPAYCC ON TRANSACTIONPAYMENTS.TXPAYKEY = TXPAYCC.TXPAYKEY LEFT JOIN REFUNDS ON TRANSACTIONPAYMENTS.TXPAYKEY = REFUNDS.TXPAYKEY";
      //   var _filter = { 
      //     whereClause: `transactionsheaderkey = ?`,
      //     values: [activeGridRecord["txhdrkey"]]
      //   };
      //   var _limit = ``;
      //   var _skip = ``;
      //   var _orderby = ``;
      //   var _select = `TRANSACTIONPAYMENTS.txpaykey,TRANSACTIONPAYMENTS.transactionsheaderkey,TRANSACTIONPAYMENTS.invoice,TRANSACTIONPAYMENTS.paymenttypekey,TRANSACTIONPAYMENTS.paymentmethod,TRANSACTIONPAYMENTS.paymentamount,TXPAYCC.txpaycckey,TXPAYCC.cc_accountnumber,TXPAYCC.cc_approved_amount,REFUNDS.refundkey,TXPAYCC.cc_card_entry_mode`;
      // 
      //   _records = pjs.data.get(_from, _filter, _limit, _skip, _orderby, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _records = [];
      //   _error = err;
      //   console.error(err);
      // }
      // var paymentsList = _records;
    },

    "Close": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Active Product Scroll
      console.log(activeGridRecord)
      
      cashierscreen['productsActiveRecord'] = display.products.getRecords().findIndex( item => item['prdkey'] == truck_view['productId']) + 1

      // 3. Show previous screen
      let previousScreen = screenHistory[screenHistory.length - 2];
      if (previousScreen) {
        activeScreen = screens[previousScreen];
        screenHistory.pop();
      }
      return;
    },

    "Add Custom": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. customReceipt work variable
      var _success = true;
      var _data = display.receipt.filter(gridRecord => {
        if (gridRecord["item_name"] == custom["custom"]) return true;
        else return false;
      });
      var customReceipt = _data;

      // 3. If Custom in Receipt
      if ((custom["custom"] == customReceipt["item_name"]) && (custom["custom_amount"] == customReceipt["rprice"])) {

        // 4. Increase Custom Qty
        display.receipt.applyMap(gridRecord => {
          if (gridRecord["item_name"] == custom["custom"]) {
            gridRecord["qty"] += 1;
            if(gridRecord["rprice"]<0) Math.abs(gridRecord["rprice"] = gridRecord["qty"] * activeGridRecord["discountPrice"])*(-1);
            else gridRecord["rprice"] = gridRecord["qty"] * activeGridRecord["discountPrice"];
        
            gridRecord["actualPrice"] = gridRecord["rprice"]
          }
          return gridRecord;
        });
      }

      // 5. Otherwise
      else {

        // 6. If Paid-Out
        if (custom["custom"] == "Paid-Out") {

          // 7. Add Paid-Out (Negative)
          display.receipt.unshift({
            "item_name": custom["custom"],
            "qty": 1,
            "rprice": 0 - custom["custom_amount"],
            "prdkey": 764,
            "actualPrice": 0 - custom["custom_amount"],
            "taxable":'N'
          });
        }

        // 8. If Vending
        if (custom["custom"] == "Vending") {

          // 9. Add Vending (Taxable)
          display.receipt.unshift({
            "item_name": custom["custom"],
            "qty": 1,
            "rprice": custom["custom_amount"],
            "prdkey": 765,
            "actualPrice": custom["custom_amount"],
            "taxable":'Y'
          });
        }

        // 10. If Vacuum
        if (custom["custom"] == "Vacuum") {

          // 11. Add Vacuum (Non-taxable)
          display.receipt.unshift({
            "item_name": custom["custom"],
            "qty": 1,
            "rprice": custom["custom_amount"],
            "prdkey": 763,
            "actualPrice": custom["custom_amount"],
            "taxable":'N'
          });
        }
      }

      // 12. Calculate Subtotal
      cashierscreen["rsubtotal"] = display.receipt.reduce((total, record) => {
        var num = Number(record["rprice"]);
        if (isNaN(num)) num = 0;
        return total + num;
      }, 0);

      // 13. Calculate Total
      var nontaxable = 0;
      display.receipt.forEach(function(record) {
        if (record.taxable == 'N'){
          nontaxable += Number(record["rprice"]);
        }
      });
      cashierscreen["nontaxable"] = nontaxable;
      
      if(cashierscreen["discount"]==undefined){
        cashierscreen["discount"]=0;
      }
      
      if(cashierscreen["tax"]==undefined){
        cashierscreen["tax"]=0;
      }
      if(pjs.session["locationTaxRate"])
      {
        cashierscreen["tax"] = Number(pjs.session["locationTaxRate"]) * (Number(cashierscreen["rsubtotal"]) - Number(cashierscreen["nontaxable"]));
      }
      
      if(cashierscreen["discountType"] == "Percent"){
        var actualTotal = display.receipt.reduce((total, record) => {
        var num = Number(record["actualPrice"]);
        if (isNaN(num)) num = 0;
        return total + num;
      }, 0);
        cashierscreen["discount"] = actualTotal - Number(cashierscreen["rsubtotal"]);
      }
      
      let taxedTotal = Number(cashierscreen["rsubtotal"])+ Number(cashierscreen["tax"])
      let overallTotal = Number(taxedTotal) - Number(cashierscreen["discount"])
      cashierscreen["total"]=overallTotal;

      // 14. Enable Buttons
      cashierscreen["save_Disabled"]=false;
      cashierscreen["checkoutDisabled"]=false;

      // 15. Get Suggested Products
      var _success = false;
      var _error = null;
      
      var _records = null;
      try {
        var query = "SELECT PRODUCTKITTING.KITPRODUCTID FROM PRODUCTKITTING WHERE PRODUCTKITTING.PRODUCTSKEY = ?"
        _records = pjs.query(query, [activeGridRecord["prdkey"]]);
        //If kit is available
        if(_records.length != 0 && _records !== undefined && _records !== [] && _records != null){
          var kitID = _records[0]["kitproductid"];
          var query = "SELECT PRODUCTS.PRDKEY, PRODUCTPRICE.PRICE, PRODUCTS.PRODUCT, PRODUCTS.TAXABLE as suggested_wash_type "+
                      "FROM PRODUCTS INNER JOIN PRODUCTKITTING ON PRODUCTS.PRDKEY = PRODUCTKITTING.PRODUCTSKEY " +
                      " INNER JOIN PRODUCTPRICE ON PRODUCTPRICE.PRODUCTSKEY = PRODUCTS.PRDKEY " + 
                      "WHERE PRODUCTKITTING.KITPRODUCTID = ?";
          _records = pjs.query(query, [kitID]);
          var suggestions =  display.suggestions.getRecords(); 
          suggestions = _records.filter( el => {
              return !suggestions.find(element => {
                return element["suggested_wash_type"] === el["suggested_wash_type"];
              });
          });
      
          display.suggestions.addRecords(suggestions);
          suggestions = display.suggestions.getRecords();
      
          var recieptRecords = display.receipt.getRecords();
          suggestions = suggestions.filter(el => {
              return !recieptRecords.find(element => {
                return element["item_name"] === el["suggested_wash_type"];
              });
          });
      
          display.suggestions.replaceRecords(suggestions);
          _success = true;
        }
      }
      catch (err) {
        _records = [];
        _error = err;
      }

      // 16. Show previous screen
      let previousScreen = screenHistory[screenHistory.length - 2];
      if (previousScreen) {
        activeScreen = screens[previousScreen];
        screenHistory.pop();
      }
      return;
    },

    "Subtract Quantity": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Get selected receipt grid record
      var _success = true;
      var _data = display.receipt.filter(entry => (entry["remove_qty"] && entry["remove_qty"] != '0'));
      if (Array.isArray(_data)) _data = _data[0];
      if (!_data) {
        _data = {};
        var _error = new Error("Record not found");
        _success = false;
      }
      var activeGridRecord = _data;

      // 3. Quantity is 1
      if (activeGridRecord["qty"] == 1) {

        // 4. Remove grid records
        display.receipt.applyFilter(gridRecord => {
          if (gridRecord["item_name"] == activeGridRecord["item_name"]) return false;
          else return true;
        });

        // 5. Delete Reasons For Modified Price
        var _success = true;
        var _data = display.products.filter(gridRecord => {
          if (gridRecord["product"] == activeGridRecord["item_name"]) return true;
          else return false;
        });
        if (Array.isArray(_data)) _data = _data[0];
        if (!_data) {
          _data = {};
          var _error = new Error("Record not found");
          _success = false;
        }
        var removingProduct = _data;
        
        let prd = cashierscreen['modifiedPriceSpecials'].filter(item => item['prdkey'] == removingProduct['prdkey'])
        
        if(prd.length != 0)
        {
          // var q = "UPDATE TRANSACTIONSPECIALS SET DELETE = ? WHERE TXSPECKEY = ?"
          // q = pjs.query(q, ['Y', prd['txspeckey']])
          cashierscreen['modifiedPriceSpecials'] = cashierscreen['modifiedPriceSpecials'].filter(item => item['prdkey'] != removingProduct['prdkey'])
        }

        // 6. Po_Required XREF
        /*
          Recheck on what fields are required, PO Number, Driver id, trip number
          after the item is removed from receipt grid. 
          PO Number is also product specific-Business logic. 
        */
        var _data = display.receipt.getRecords();
           
        var prdkeys=_data.map(function (data) { return Number(data.prdkey) });
        
        if(prdkeys.length == 0){
            var requiredItems = []
            cashierscreen["po_required"] = false
            cashierscreen["has_requirements"] = false
            required_fields['ponum'] = ''
        
            if(cashierscreen['po_option'] == 'Y'){
              cashierscreen["po_required"] = true
              cashierscreen["has_requirements"] = true
              requiredItems.push("PO #")      
            }
            if(cashierscreen["driverId_required"]){
              cashierscreen["has_requirements"] = true
              requiredItems.push("Driver ID")      
            }
            if(cashierscreen["tripNumber_required"]){
              cashierscreen["has_requirements"] = true
              requiredItems.push("Trip #")
              
            }
            cashierscreen["req_items"] = "Required : " + requiredItems.toString()
        
        }
        else if(cashierscreen['po_option']=='M' || cashierscreen['po_option']=='B')
        {
          prdkeys=prdkeys.join(',');
          var sql="SELECT CCREQPOKEY FROM CCREQPO where CCKEY=? and   PRDKEY IN ( "+prdkeys+") AND PRDKEY NOT IN(?) ";
          var result=pjs.query(sql,[cashierscreen['company_id'],activeGridRecord["prdkey"]]);
        
          if(result.length===0)
          {
            var requiredItems = []
            cashierscreen["po_required"] = false
            cashierscreen["has_requirements"] = false
            required_fields['ponum'] = ''
        
            if(cashierscreen["driverId_required"]){
              cashierscreen["has_requirements"] = true
              requiredItems.push("Driver ID")
              
            }
            if(cashierscreen["tripNumber_required"]){
              cashierscreen["has_requirements"] = true
              requiredItems.push("Trip #")
              
            }
            cashierscreen["req_items"] = "Required : " + requiredItems.toString()
          }
        }

        // 7. remove scrub if !eligible 
        //Validated if there is a scrub club applied there must be item in receipt grid on which we can redeem 
        
        let items = display.receipt.getRecords()
        items = items.filter((item) => item['redeemscrubclubonthisitem'] == 'Y')
        if(items.length == 0){
          //remove scrub club
          cashierscreen["scrubApply"] = {}
          scrub_club['scrub_club_invoice'] = ''
        }
      }

      // 8. Otherwise
      else {

        // 9. Find record from Products Grid
        var _success = true;
        var _data = display.products.filter(gridRecord => {
          if (gridRecord["product"] == activeGridRecord["item_name"]) return true;
          else return false;
        });
        if (Array.isArray(_data)) _data = _data[0];
        if (!_data) {
          _data = {};
          var _error = new Error("Record not found");
          _success = false;
        }
        var productData = _data;

        // 10. w/Debris?
        if (productData["prcmodelg"] == 'Y') {

          // 11. Adjust Price & Quantity
          display.receipt.applyMap(gridRecord => {
            if (gridRecord["prdkey"] == activeGridRecord["prdkey"]) {
              Object.assign(gridRecord, {
                "qty": activeGridRecord["qty"] -1,
                "rprice": Number(activeGridRecord["specialUnitPrice"] * (activeGridRecord["qty"] -1)).toFixed(2),
                "actualPrice": Number(activeGridRecord["specialUnitActualPrice"] * (activeGridRecord["qty"] -1)).toFixed(2)
              });
            }
            return gridRecord;
          });
        }

        // 12. Otherwise
        else {

          // 13. Adjust Price & Quantity
          display.receipt.applyMap(gridRecord => {
            if (gridRecord["prdkey"] == activeGridRecord["prdkey"]) {
              Object.assign(gridRecord, {
                "qty": activeGridRecord["qty"] -1,
                "rprice": Number(productData["discountPrice"] * (activeGridRecord["qty"] -1)).toFixed(2),
                "actualPrice": Number(productData["price"] * (activeGridRecord["qty"] -1)).toFixed(2)
              });
            }
            return gridRecord;
          });
        }
      }

      // 14. Calculate Receipt Totals
      var parms = {};
      parms["receiptRecords"] = display.receipt.getRecords();
      parms["locationSurchargeDiscount"] = pjs.session['locationSurchargeDiscount'];
      parms["locationSurchargeDiscountPercentage"] = pjs.session['locationSurchargeDiscountPercentage'];
      parms["customerTaxExempt"] = cashierscreen["customerTaxExempt"];
      parms["locationTaxRate"] = pjs.session['locationTaxRate'];
      parms["discountType"] = cashierscreen["discountType"];
      parms["coupon_discount"] = coupon["coupon_discount"];
      parms["scrubApply"] = cashierscreen["scrubApply"] ? cashierscreen["scrubApply"] : null ;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetReceiptTotals.module.json");
        _results = pjsModule["Receipt Totals"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      cashierscreen['rsubtotal'] = _results ? _results["rsubtotal"] : null;
      cashierscreen['tax'] = _results ? _results["tax"] : null;
      cashierscreen['discount'] = _results ? _results["discount"] : null;
      cashierscreen['total'] = _results ? _results["total"] : null;
      cashierscreen['nontaxable'] = _results ? _results["nontaxable"] : null;
      var errorMessage = _results ? _results["errorMessage"] : null;
      var errorFlag = _results ? _results["error"] : null;
      coupon['coupon_discount'] = _results ? _results["coupon_discount"] : null;

      // 15. Error?
      if (errorFlag && errorFlag != '0') {

        // 16. Show Error
        pjs.messageBox({
          title: ``,
          message: `${errorMessage}`
        });
      }

      // 17. Calculate Receipt Subtotal
      // cashierscreen["rsubtotal"] = display.receipt.reduce((total, record) => {
      //   var num = Number(record["rprice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      // }, 0);

      // 18. Update Receipt Total
      // /*
      //   This step calculates totals for receipt grid. 
      //   considers taxes, discounts, location based surcharges 
      // */
      // var nontaxable = 0;
      // display.receipt.forEach(function(record) {
      //   if (record.taxable == 'N' && record.loctaxable != 'Y'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      //   else if(record.taxable == 'Y' && record.loctaxable == 'N'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      // });
      // cashierscreen["nontaxable"] = nontaxable;
      // 
      // let surcharge = 0 , 
      //     discount = 0, 
      //     subtotal = cashierscreen["rsubtotal"], 
      //     tax = 0,
      //     actualTotal = 0,
      //     total = 0 
      // 
      // //Calculate total of Full prices of line items.
      // actualTotal = display.receipt.reduce((total, record) => {
      //   var num = Number(record["actualPrice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      //   }, 0);
      // 
      // 
      // //Apply Surcharges
      // if(pjs.session["locationSurchargeDiscount"] == "S"){
      //   surcharge += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"]))
      // }
      // 
      // //Determine Taxation
      // if(cashierscreen["customerTaxExempt"] == 'Y'){
      //     tax = 0
      // }
      // else if(pjs.session["locationTaxRate"])
      // {
      //   tax = Number(pjs.session["locationTaxRate"]) * (Number(cashierscreen["rsubtotal"]) - Number(cashierscreen["nontaxable"]));
      // }
      // 
      // //Apply Discounts
      // if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
      //   discount += actualTotal - Number(subtotal);
      //    subtotal = actualTotal
      // }
      // else if(cashierscreen["discountType"] == "Scrub" && Object.keys(cashierscreen["scrubApply"]).length !== 0){
      //   actualTotal == 0 ? discount = 0 : discount += Number(cashierscreen["scrubApply"]["value"])
      // }
      // else if(cashierscreen['discountType'] == 'Coupon'){
      //   if((actualTotal == 0 || actualTotal < Number(coupon['coupon_discount'])) && coupon['coupon_discount'] != undefined && coupon['coupon_discount'] != '' && coupon['coupon_discount'] != null){
      //     discount = 0 
      //     pjs.messageBox({
      //       title: '',
      //       message: `Removing Coupon, cannot apply $${coupon['coupon_discount']} on Subtotal: $${actualTotal}`
      //     })
      //     coupon['coupon_discount'] = 0 
      //   }
      //   else{
      //     discount += Number(coupon["coupon_discount"])
      //   } 
      // }
      // if(pjs.session["locationSurchargeDiscount"] == "D"){
      //   discount += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"])) 
      // }
      // 
      // //Calculate Totals
      // let taxedTotal = Math.abs(subtotal) + Math.abs(tax)
      // total = (Math.abs(taxedTotal) - Math.abs(discount) ) + surcharge
      // 
      // 
      // cashierscreen["rsubtotal"] = Number(subtotal).toFixed(2)
      // cashierscreen["discount"] = Number((Math.abs(discount))).toFixed(2)
      // cashierscreen["tax"] = Number(tax).toFixed(2)
      // cashierscreen["total"] = Number(Math.abs(total)).toFixed(2)

      // 19. Enable Buttons
      //enables save and checkout buttons
      cashierscreen["save_Disabled"]=false;
      cashierscreen["checkoutDisabled"]=false;
      

      // 20. If no Product after removing
      if (cashierscreen["total"] == 0) {

        // 21. Disable Buttons
        cashierscreen["save_Disabled"]=true;
      }

      // 22. !allWashes & Saved TX
      if ((cashierscreen["flag_tx_loaded_from_db"] && cashierscreen["flag_tx_loaded_from_db"] != '0') && (cashierscreen['allWashes'] == 'N')) {

        // 23. Update TXHeader
        /*
          case scenario: Transaction exists and we are trying to resave
          This step updates Transactions summary in transactions header table. 
        */
        var updatedReceipt = display.receipt.getRecords();
        
        try{
        var values = [
                        globals['clientTime'],
                        cashierscreen["rsubtotal"],
                        cashierscreen["total"],
                        cashierscreen["tax"],
                        cashierscreen["customer_notes"],               
                      ];
        
          var columns ="";
          if(cashierscreen["po_required"]){
            columns += ", PONUMBER = ?"
             
            values.push(required_fields["ponum"])
          }
          if(cashierscreen["tripNumber_required"]){
            columns += ", TRIPNUMBER = ?"
            
            values.push(required_fields["tripnum"])
          }
          if(cashierscreen["driverId_required"]){
            columns += ", DRIVERID = ?"
           
            values.push(required_fields["drvid"])
          }
          values.push(cashierscreen["flag_tx_loaded_from_db_id"])
          var query = "UPDATE TRANSACTIONSHEADER SET LOCALTS1 = ?, ORDERTOTAL$=? ,  DISCOUNTEDTOTAL$=?, TAXTOTAL$=?, CASHIERMESSAGE=?" +columns+ " WHERE TXHDRKEY = ?" ;
          var _records = pjs.query(query, values)
          var txHdr = {
            "corporatecustomerskey" : cashierscreen["comp_name"]
          }
          if((cashierscreen["tractor_number"] == '' || cashierscreen['trailer_number'] == '') && cashierscreen['TractorTrailerRequired'])
            txHdr["tractornbr"] = cashierscreen["tractor_number"];
          if(cashierscreen["trailer_number"] != '')
            txHdr["trailernbr"] = cashierscreen["trailer_number"];
        
          if(cashierscreen["tractor_number"] != '' && cashierscreen["trailer_number"] != '')
          {
            var query = "SELECT DRIVERSKEY FROM DRIVERS WHERE CORPCUSTKEY = ? AND CORPTRUCKKEY = ? AND CORPTRAILERKEY = ?"
            var driverkey = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["tractor_number"], cashierscreen["trailer_number"]]);
            if(driverkey != [] && Object.keys(driverkey).length != 0){
              txHdr["driverskey"] = driverkey["driverskey"];
            }   
          }
         
        }
        catch (err){
          //error occurred
        }
        cashierscreen["flag_tx_loaded_from_db"] = false

        // 24. Update TXDetails
        /*
          case scenario: Resave a transaction after opening and changing 'Open' Status
          This step will replace Products purchased in transaction details table
        */
        var _error = null
        var _success = null
        try {
          var query = "UPDATE TRANSACTIONDETAILS SET DELETE=?, DELETEDBY=?, DELETEDTS=?, LSTTOUCHBY=? WHERE TRANSACTIONSHEADERKEY=? ";
        
          var values = [
                      "Y",
                      pjs.session['usersKey'],
                      globals['clientTime'],
                      pjs.session['usersKey'],
                      cashierscreen["flag_tx_loaded_from_db_id"]
                    ];
        
          var _records = pjs.query(query, values)
          var txhdrkey = cashierscreen["flag_tx_loaded_from_db_id"];
          var productsDetails = display.receipt.getRecords().map((product) => {
          return {
            "transactionsheaderkey" : txhdrkey,
            "productskey" : product["prdkey"],
            "quantity":  product["qty"],
            "costfull": product["actualPrice"],
            "cost": product["rprice"],
            "delete": 'N'
          }
          })
          query = "INSERT INTO TRANSACTIONDETAILS SET ?";
          _records = pjs.query(query, productsDetails)
          _success = true;
        }
        catch (err) {
          _records = [];
          _error = err;
          console.log(err)
        }

        // 25. Refresh Products
        logic["Refresh Products"]();

        // 26. Refresh Transactions
        logic["Refresh Today's Transaction"]();
      }
    },

    "Required Items Click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Show Required Fields screen
      Object.assign(required_fields, {
        "po_required": cashierscreen["po_required"],
        "driveridrequired": cashierscreen["driverId_required"],
        "tripnumberrequired": cashierscreen["tripNumber_required"],
        "prev_po": required_fields["ponum"],
        "prev_driver": required_fields["drvid"],
        "prev_trip": required_fields["tripnum"]
      });
      screenHistory.push("required_fields");
      activeScreen = screens["required_fields"];
      return;
    },

    "save button click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Validation
      //Validation for void transaction screen. 
      /*
        Case scenario: Transaction is 'Open' and No Payments were made. 
        No refunds will be done only the transaction will be marked as void. 
      
      */
      
      //reason to void. 
      if(void_transaction["void_reason"] == ""){
        pjs.messageBox({
          title: "Missing Info",
          message: "Please input the reason"
        })
      }
      //if it is other must have description
      if(void_transaction["void_reason"] == 5 && void_transaction["otherDescription"] == ""){
        pjs.messageBox({
          title: "Missing Info",
          message: "Please type other reason"
        })
      }

      // 3. Void TX
      var parms = {};
      parms["void_reason"] = void_transaction['void_reason'];
      parms["txhdrkey"] = void_transaction['void_reason'];
      parms["usersKey"] = pjs.session['usersKey'];
      parms["otherDescription"] = void_transaction['void_reason'];
      parms["invoiceNumber"] = void_transaction['void_reason'];
      parms["clientTime"] = globals['clientTime'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("VoidTransaction.module.json");
        _results = pjsModule["Void Transaction"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }

      // 4. Void Transaction
      // /*
      //   Case scenario: voiding an 'Open' transaction with no payments
      //   this step Voids the transaction
      // */
      // var _success = false
      // try{
      //   var query = "INSERT INTO TRANSACTIONSPECIALS "+
      //               "(WHAT, REASONCODESKEY, TRANSACTIONHEADERKEY, USERSKEY, OTHERDESC) " +
      //               "VALUES(?, ?, ?, ?, ?);"
      //   var values = [
      //                 "Void", 
      //                 void_transaction["void_reason"], 
      //                 void_transaction["txhdrkey"], 
      //                 (pjs.session["usersKey"] ), 
      //                 void_transaction["otherDescription"]
      //                 ]
      //   var _record = pjs.query(query, values)
      // 
      //   _success = _record != null
      //   query = "UPDATE TRANSACTIONSHEADER SET status = ?, LOCALTS1 = ? WHERE TXHDRKEY = ?";
      //   values = ["Void", globals['clientTime'], void_transaction["txhdrkey"]]
      //   _record = pjs.query(query, values)
      //   _success =  _record != null
      // 
      //   //reflect changes to scrub club coupons
      //   if(void_transaction['status'] == 'Sale'){
      //     query = "UPDATE SCRUBCLUBTRACKING SET SCRUBCLUBTRACKING.DELETE = ? WHERE SCRUBCLUBTRACKING.ISSUEDTRANSACTIONSHEADERINVOICE = ?";
      //     _record = pjs.query(query, ['Y', void_transaction['invoiceNumber']])
      //   }
      //   else if(void_transaction['status'] == 'Open'){
      //     query = "UPDATE SCRUBCLUBTRACKING SET SCRUBCLUBTRACKING.REDEEMEDTRANSACTIONSHEADERINVOICE = ? , SCRUBCLUBTRACKING.REDEEMEDLOCATIONKEY = ?, SCRUBCLUBTRACKING.REDEEMEDTIMESTAMP = ?  WHERE SCRUBCLUBTRACKING.REDEEMEDTRANSACTIONSHEADERINVOICE = ?";
      //     _record = pjs.query(query, [null, null, null, void_transaction['invoiceNumber']])    
      //   }
      // 
      //   pjs.messageBox({
      //     title: "Transaction Void",
      //     message: "Transction has been voided"
      //   })
      // 
      // }
      // catch (e){
      //   //error occurred while voiding transaction
      //   _success = false
      // }

      // 5. Refresh Today's Transactions
      logic["Refresh Today's Transaction"]();

      // 6. Show previous screen
      let previousScreen = screenHistory[screenHistory.length - 2];
      if (previousScreen) {
        activeScreen = screens[previousScreen];
        screenHistory.pop();
      }
      return;
    },

    "View Shift Sales": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Set Location Prefix
      var prefix = null;
      switch(pjs.session['locationsKey'])
      {
        case 1: prefix = 'EFF'; break;
        case 2: prefix = 'HEB'; break;
        case 3: prefix = 'INDY'; break;
        case 4: prefix = 'JOP'; break;
        case 5: prefix = 'KEN'; break;
        case 6: prefix = 'LAR'; break;
        case 7: prefix = 'NLR'; break;
        case 8: prefix = 'OGRV'; break;
        case 9: prefix = 'OK'; break;
        case 10: prefix = 'SHOL'; break;
        case 11: prefix = 'TEMP'; break;
        case 12: prefix = 'TEST'; break;
        case 13: prefix = 'WAL'; break;
        case 14: prefix = 'WYT'; break;
      }
      let startDate=pjs.session["ts_begin"].toLocaleDateString('en-GB').split('/').reverse().join('-');

      // 3. Get Shift Sales Data
      var parms = {};
      parms["ts_begin"] = pjs.session['ts_begin'];
      parms["locationsKey"] = pjs.session['locationsKey'];
      parms["currentShift"] = pjs.session['currentShift'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("ZoutModule.module.json");
        _results = pjsModule["Get Shift Sales Data"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var totalShiftMins = _results ? _results["totalShiftMins"] : null;
      var salesData = _results ? _results["salesData"] : null;
      var categoryData = _results ? _results["categoryData"] : null;
      var productData = _results ? _results["productData"] : null;
      var paymentData = _results ? _results["paymentData"] : null;
      var scaleData = _results ? _results["scaleData"] : null;
      var generalItemsData = _results ? _results["generalItemsData"] : null;
      var customItemsData = _results ? _results["customItemsData"] : null;
      var chartData = _results ? _results["chartData"] : null;
      var netSale = _results ? _results["netsale"] : null;
      var tax = _results ? _results["tax"] : null;
      var discount = _results ? _results["discount"] : null;
      var total = _results ? _results["total"] : null;
      var startInvoice = _results ? _results["startInvoice"] : null;
      var endInvoice = _results ? _results["endInvoice"] : null;
      var message = _results ? _results["message"] : null;
      var _shift_data_success = _results ? _results["_shift_data_success"] : null;

      // 4. Message?
      if (message && message != '0') {

        // 5. Message
        pjs.messageBox({
          title: ``,
          message: `${message}`
        });
      }

      // 6. Shift Data
      // 
      // /*
      //   This step will generate all the required data for shift sales. 
      //   Will bring in sales summaries, product summaries, category summaries 
      //   This step will also structure data so it can be assigned to ui elements on shift sales screen
      // */
      // 
      // var netSale=0;
      // var tax=0;
      // var discount=0;
      // var total=0;
      // var startInvoice = ""
      // var endInvoice = ""
      // var invnbr = ""
      // 
      // var shiftStart = pjs.session['ts_begin']
      // var shiftEnd = pjs.timestamp()
      // //adjust client side time offset
      // shiftEnd.setMinutes(shiftEnd.getMinutes() + pjs.session['clientServerTimeDifferenceMinutes'])
      // var location = pjs.session["locationsKey"]
      // 
      // // Result Variables
      // var _error = null, _shift_data_success = false;
      // 
      // let productData = [],
      //     categoryData = [],
      //     salesData = [],
      //     chartData = [],
      //     paymentData = [],
      //     scaleData = [],
      //     generalItemsData = [],
      //     customItemsData = []
      // 
      // try {
      //   var querySaleTotals = "SELECT SUM(ORDERTOTAL$) AS Netsale, SUM(TAXTOTAL$) AS TAX, SUM((( ORDERTOTAL$+TAXTOTAL$) - DISCOUNTEDTOTAL$)) AS Discounts, SUM(DISCOUNTEDTOTAL$) AS Total, LISTAGG(INVOICENBR,',') AS INVNBR "+
      //               " FROM TRANSACTIONSHEADER "+
      //               "WHERE LOCATIONSKEY=? AND TRANSACTIONSHEADER.STATUS='Sale' AND LOCALTS1 BETWEEN ? AND  ?";
      //   querySaleTotals = [querySaleTotals, location, shiftStart, shiftEnd]
      // 
      //   var catSummary = "SELECT CATEGORY as wash_type, COALESCE(SUM(QUANTITY),0) AS QTY, COALESCE(SUM(COST),0) AS PRICE "+
      //               "FROM TRANSACTIONDETAILS "+
      //               "INNER JOIN TRANSACTIONSHEADER ON TRANSACTIONSHEADER.TXHDRKEY=TRANSACTIONDETAILS.TRANSACTIONSHEADERKEY "+
      //               "INNER JOIN PRODUCTS ON PRODUCTS.PRDKEY=TRANSACTIONDETAILS.PRODUCTSKEY "+
      //               "INNER JOIN PRODUCTCATEGORY ON PRODUCTCATEGORY.PRDCATKEY = PRODUCTS.PRODUCTCATEGORYKEY "+
      //               "WHERE LOCATIONSKEY=?  AND TRANSACTIONSHEADER.STATUS='Sale' AND TRANSACTIONDETAILS.DELETE='N' AND LOCALTS1 BETWEEN ? AND ? "+ 
      //               "GROUP BY CATEGORY; "
      //   catSummary = [catSummary, location, shiftStart, shiftEnd]      
      // 
      //   var productSummary =  " SELECT SUM(QUANTITY) AS quantity,PRODUCT, SUM(COST) AS cost FROM TRANSACTIONSHEADER "+
      //               " INNER JOIN TRANSACTIONDETAILS ON TRANSACTIONDETAILS.TRANSACTIONSHEADERKEY= TRANSACTIONSHEADER.TXHDRKEY "+
      //               " INNER JOIN PRODUCTS ON PRODUCTS.PRDKEY=TRANSACTIONDETAILS.PRODUCTSKEY "+
      //               " WHERE LOCATIONSKEY = ?  AND TRANSACTIONSHEADER.STATUS='Sale'  AND TRANSACTIONDETAILS.DELETE='N' AND LOCALTS1 BETWEEN ? AND ? " +
      //               " GROUP BY PRODUCT ";
      //   productSummary = [productSummary, location, shiftStart, shiftEnd]
      // 
      //   var chartQuery = "SELECT SUM(DISCOUNTEDTOTAL$) AS value, DAYOFWEEK1 as label " +
      //                     "FROM TRANSACTIONSHEADER " +
      //                     "WHERE LOCATIONSKEY=? AND STATUS=? AND LOCALTS1 >= current date - 7 days GROUP BY DAYOFWEEK1 "
      //   chartQuery = [chartQuery, location, 'Sale']
      // 
      //     var paymentSummary = "SELECT PAYMENTTYPES.PAYMENTTYPE as payment_type, SUM(PAYMENTAMOUNT) as price, COUNT(PAYMENTTYPE) as qty " +
      //                       "FROM TRANSACTIONPAYMENTS "+
      //                       "INNER JOIN TRANSACTIONSHEADER ON TRANSACTIONSHEADER.TXHDRKEY= TRANSACTIONPAYMENTS.TRANSACTIONSHEADERKEY "+
      //                       "INNER JOIN PAYMENTTYPES ON TRANSACTIONPAYMENTS.PAYMENTTYPEKEY = PAYMENTTYPES.PAYTYPEKEY "+
      //                       " LEFT JOIN REFUNDS  ON REFUNDS.TXPAYKEY=TRANSACTIONPAYMENTS.TXPAYKEY "+
      //                       "WHERE LOCATIONSKEY = ? AND TRANSACTIONSHEADER.STATUS='Sale' AND REFUNDS.INVOICE IS NULL AND LOCALTS1 BETWEEN ? AND ? "+
      //                       "GROUP BY PAYMENTTYPE;"
      //   paymentSummary = [paymentSummary, location, shiftStart, shiftEnd]
      // 
      //   //Scale Washes Query
      //   var scaleSummary = "SELECT PRODUCT as scale_type, COALESCE(SUM(QUANTITY),0) AS QTY, COALESCE(SUM(COST),0) AS PRICE "+
      //             "FROM TRANSACTIONDETAILS "+
      //             "INNER JOIN TRANSACTIONSHEADER ON TRANSACTIONSHEADER.TXHDRKEY=TRANSACTIONDETAILS.TRANSACTIONSHEADERKEY "+
      //             "INNER JOIN PRODUCTS ON PRODUCTS.PRDKEY=TRANSACTIONDETAILS.PRODUCTSKEY "+
      //             "INNER JOIN PRODUCTCATEGORY ON PRODUCTCATEGORY.PRDCATKEY = PRODUCTS.PRODUCTCATEGORYKEY "+
      //             "WHERE LOCATIONSKEY=?  AND TRANSACTIONSHEADER.STATUS='Sale' AND TRANSACTIONDETAILS.DELETE='N' AND LOCALTS1 BETWEEN ? AND ? "+ 
      //             " AND (PRODUCTCATEGORY.CATEGORY = ? OR PRODUCTCATEGORY.CATEGORY = ?) "+
      //             "GROUP BY PRODUCT; "
      //   scaleSummary = [scaleSummary, location, shiftStart, shiftEnd, 'First Weigh', 'Reweigh']  
      // 
      //   var generalItemsSummary = "SELECT PRODUCT as item_type, COALESCE(SUM(QUANTITY),0) AS QTY, COALESCE(SUM(COST),0) AS PRICE "+
      //             "FROM TRANSACTIONDETAILS "+
      //             "INNER JOIN TRANSACTIONSHEADER ON TRANSACTIONSHEADER.TXHDRKEY=TRANSACTIONDETAILS.TRANSACTIONSHEADERKEY "+
      //             "INNER JOIN PRODUCTS ON PRODUCTS.PRDKEY=TRANSACTIONDETAILS.PRODUCTSKEY "+
      //             "INNER JOIN PRODUCTCATEGORY ON PRODUCTCATEGORY.PRDCATKEY = PRODUCTS.PRODUCTCATEGORYKEY "+
      //             "WHERE LOCATIONSKEY=?  AND TRANSACTIONSHEADER.STATUS='Sale' AND TRANSACTIONDETAILS.DELETE='N' AND LOCALTS1 BETWEEN ? AND ? "+ 
      //             " AND PRODUCTCATEGORY.CATEGORY = ? "+
      //             "GROUP BY PRODUCT; "
      //   generalItemsSummary = [generalItemsSummary, location, shiftStart, shiftEnd, 'General Items']  
      // 
      //   var customItemsSummary =  "select otherpay.prefix as item_type, COALESCE(count(otherpay.prefix),0) as quantity, COALESCE(sum(otherpay.amount),0) as price "+
      //                             "from otherpay "+
      //                             "where otherpay.locationskey = ? "+
      //                             "and otherpay.created between ? and ? "+
      //                             "group by prefix;"
      //   customItemsSummary = [ customItemsSummary, location, shiftStart, shiftEnd]
      //   var _records =pjs.parallelQueries(
      //     [
      //       querySaleTotals, 
      //       catSummary, 
      //       productSummary, 
      //       chartQuery, 
      //       paymentSummary, 
      //       scaleSummary, 
      //       generalItemsSummary,
      //       customItemsSummary
      //     ]
      //   )
      // 
      //   salesData = _records[0]
      //   categoryData = _records[1]
      //   productData = _records[2]
      //   chartData = _records[3]
      //   paymentData = _records[4]
      //   scaleData = _records[5]
      //   generalItemsData = _records[6]
      //   customItemsData = _records[7]
      // 
      //   if (salesData.length>0) {
      //   let result = Object.values(salesData[0]);
      //   if(result.every((i)=>i == null)){
      //      pjs.messageBox({
      //        title: '',
      //        message: 'No transactions to Zout'
      //      })
      //   }
      //   else {
      //     netSale=salesData[0].netsale;
      //     tax=salesData[0].tax;;
      //     discount=salesData[0].discounts;
      //     total=salesData[0].total;
      //     invnbr = salesData[0].invnbr;
      //    if(invnbr !== null){
      //       let invoiceNumbers =invnbr.split(',');
      //       startInvoice = invoiceNumbers[0]
      //       endInvoice = invoiceNumbers[invoiceNumbers.length - 1]
      //     }
      //     else{
      //       //invnbr null value
      //     }
      //   }
      // 
      //   
      //   }
      //   _shift_data_success = true;
      // }
      // catch (err) {
      //   //error
      //   console.log("e", err)
      // }

      // 7. Total Shift Minutes
      // var _success = false;
      // var _error = null;
      // 
      // var _record = null;
      // try {
      //   var _from = "DPM";
      //   var _filter = { 
      //     whereClause: `shift = ? AND loctnkey = ? AND to_char(dpm_date,'YYYY-MM-DD') = ?`,
      //     values: [pjs.session["currentShift"], pjs.session["locationsKey"], startDate]
      //   };
      //   var _select = `totshftmin`;
      // 
      //   _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // // If no record found
      // if (!_record) {
      //   _record = {};
      //   _error = new Error("Record not found.")
      //   _success = false;
      // }
      // var totalShiftMins = _record;

      // 8. Populate Values
      /*
        This step populates shift sales screen with structured data and then loads shift sales screen
      */
      if(_shift_data_success == true){
        //calculate vending
        let vacuumVending = 0, paidOut = 0
        for( let i = 0; i<customItemsData.length; i++){
          if(customItemsData[i]['item_type'] == 'Vacuum' || customItemsData[i]['item_type'] == 'Vending'){
            vacuumVending = Number(customItemsData[i]['price']) + Number(vacuumVending)
          }
          else if(customItemsData[i]['item_type'] == 'Pay-Out'){
            paidOut += Number(customItemsData[i]['price'])
          }
        }
       
      let dph=0;
      
      if( Object.keys(totalShiftMins).length!==0)
      {
        let hours=Number(totalShiftMins['totshftmin'])/60
           
          dph=Number(total)/hours
      }
      
        Object.assign(cashierscreen_shiftsales, {
        "tsearch": cashierscreen["tsearch"],
        "cashier_timeout": cashierscreen["cashier_timeout"],
        "subtotal": netSale,
        "tax": tax,
        "discount": discount,
        "total": total,
        "dollars_per_hour": dph,
        "shift_end_time": pjs.session["shift"]["endTime"],
        "shift_start_time": pjs.session["shift"]["startTime"],
        "starting_invoice": startInvoice,
        "current_date": cashierscreen["current_date"],
        "ending_invoice": endInvoice,
        "drvfname": cashierscreen["drvfname"],
        "drveaddress": cashierscreen["drveaddress"],
        "drvtruck": cashierscreen["drvtruck"],
        "drvtrailer": cashierscreen["drvtrailer"],
        "drvlname": cashierscreen["drvlname"],
        "weather_icon": cashierscreen["weather_icon"],
        "weather_text": cashierscreen["weather_text"],
        "drvphone": cashierscreen["drvphone"],
        "nlcomp_name": cashierscreen["nlcomp_name"],
        "nlcity": cashierscreen["nlcity"],
        "nlstate_name": cashierscreen["nlstate_name"],
        "nlzip": cashierscreen["nlzip"],
        "nlmgr_name": cashierscreen["nlmgr_name"],
        "nltruck_number": cashierscreen["nltruck_number"],
        "nlphone_number": cashierscreen["nlphone_number"],
        "weather_city": cashierscreen["weather_city"],
        "weather_temp": cashierscreen["weather_temp"],
        "weather_percent": cashierscreen["weather_percent"],
        'vacuumVending': Number(vacuumVending).toFixed(2),
        'paidouts': Number(paidOut).toFixed(2)
      });
      
      //Assign Receipt on shift sales
      display.shift_receipts.replaceRecords(productData)
      display.shift_payments.replaceRecords(paymentData)
      display.shift_wash_sales.replaceRecords(categoryData)
      display.shift_scale_sales.replaceRecords(scaleData)
      display.shift_general_sales.replaceRecords(generalItemsData)
      display.shift_custom_items.replaceRecords(customItemsData)
      //Populate Chart
      function GetDates(startDate, daysToAdd) {
          var aryDates = [];
          for(var i = 0; i <= daysToAdd; i++) {
              var currentDate = new Date();
              currentDate.setDate(startDate.getDate() + i);
              var day= {value:0,label:DayAsString(currentDate.getDay())}
              aryDates.push(day);
          }
          return aryDates;
      }
      function DayAsString(dayIndex) {
          var weekdays = new Array(7);
          weekdays[0] = "Sunday";
          weekdays[1] = "Monday";
          weekdays[2] = "Tuesday";
          weekdays[3] = "Wednesday";
          weekdays[4] = "Thursday";
          weekdays[5] = "Friday";
          weekdays[6] = "Saturday";
          
          return weekdays[dayIndex];
      }
      var today = new Date();
      today.setDate(today.getDate() - 6);
      var daysOfWeek = GetDates(today, 6);
      
      var data = [];
      if(chartData !=='undefined' && chartData.length>0){
        var results = chartData
        data = daysOfWeek.map((day) => {
          let exists = chartData.filter((item) => item.label == day.label)
          if(exists.length !== 0){
            return {
              label: day.label,
              value: exists[0].value
            }
          }
          else
            return day
        })
      }
      else{
        data = daysOfWeek
      }
      
      cashierscreen_shiftsales["chart_shift"]=JSON.stringify( {"data": data});
      //navigate screen
      screenHistory.push("cashierscreen_shiftsales");
      activeScreen = screens["cashierscreen_shiftsales"];
      }
    },

    "Z-Out Menu": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Show ZOUT Menu screen
      screenHistory.push("zout_menu");
      activeScreen = screens["zout_menu"];
      return;
    },

    "Z-Out Submit Totals": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Get Zout Totals
      var parms = {};
      parms["ts_begin"] = pjs.session['ts_begin'];
      parms["clientTime"] = globals['clientTime'];
      parms["locationsKey"] = pjs.session['locationsKey'];
      parms["submitTotals"] = true;
      parms["locationShiftKey"] = pjs.session['locationShiftKey'];
      parms["usersKey"] = pjs.session['usersKey'];
      parms["deposit"] = zout_totals['deposit'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("ZoutModule.module.json");
        _results = pjsModule["Zout Totals"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var check_totals = _results ? _results["check_totals"] : null;
      var actualCashPaid = _results ? _results["actualCashPaid"] : null;
      var expectedTotal = _results ? _results["expectedTotal"] : null;
       zout_totals['deposits'] = _results ? _results["deposits"] : null;
      var actualCheckPaid = _results ? _results["actualCheckPaid"] : null;

      // 3. Get Totals for Cash
      // var _success = false;
      // var _error = null;
      // 
      // var _data = null;
      // try {
      //   var _from = "TRANSACTIONSHEADER INNER JOIN TRANSACTIONPAYMENTS ON TRANSACTIONSHEADER.TXHDRKEY = TRANSACTIONPAYMENTS.TRANSACTIONSHEADERKEY LEFT JOIN REFUNDS ON TRANSACTIONPAYMENTS.TXPAYKEY = REFUNDS.TXPAYKEY";
      //   var _filter = { 
      //     whereClause: `localts1 BETWEEN ? AND ? AND locationskey = ? AND (TRANSACTIONPAYMENTS.paymenttypekey = ? )  AND REFUNDS.refundkey IS NULL`,
      //     values: [pjs.session['ts_begin'], globals['clientTime'], pjs.session['locationsKey'], 2]
      //   };
      //   var _groupby = ``;
      //   var _orderby = ``;
      //   var _aggFunctions = 
      //     {
      //       "TRANSACTIONPAYMENTS.paymentamount": {
      //         "aggFunction": "sum",
      //         "aggName": "paymentamount"
      //       },
      //       "TRANSACTIONPAYMENTS.actamtpd": {
      //         "aggFunction": "sum",
      //         "aggName": "actamtpd"
      //       }
      //     };
      //   _data = pjs.data.getAggregateData(_from, _aggFunctions, _filter, _groupby, _orderby );
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // var cash_totals = _data;

      // 4. Get totals for Check
      // var _success = false;
      // var _error = null;
      // 
      // var _data = null;
      // try {
      //   var _from = "TRANSACTIONSHEADER INNER JOIN TRANSACTIONPAYMENTS ON TRANSACTIONSHEADER.TXHDRKEY = TRANSACTIONPAYMENTS.TRANSACTIONSHEADERKEY LEFT JOIN REFUNDS ON TRANSACTIONPAYMENTS.TXPAYKEY = REFUNDS.TXPAYKEY";
      //   var _filter = { 
      //     whereClause: `localts1 BETWEEN ? AND ? AND locationskey = ? AND (TRANSACTIONPAYMENTS.paymenttypekey = ? OR TRANSACTIONPAYMENTS.paymenttypekey = ? )  AND REFUNDS.refundkey IS NULL`,
      //     values: [pjs.session['ts_begin'], globals['clientTime'], pjs.session['locationsKey'], 3, 6]
      //   };
      //   var _groupby = ``;
      //   var _orderby = ``;
      //   var _aggFunctions = 
      //     {
      //       "TRANSACTIONPAYMENTS.paymentamount": {
      //         "aggFunction": "sum",
      //         "aggName": "paymentamount"
      //       },
      //       "TRANSACTIONPAYMENTS.actamtpd": {
      //         "aggFunction": "sum",
      //         "aggName": "actamtpd"
      //       }
      //     };
      //   _data = pjs.data.getAggregateData(_from, _aggFunctions, _filter, _groupby, _orderby );
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // var check_totals = _data;

      // 5. PaidOut Total
      // var _success = false;
      // var _error = null;
      // 
      // var _data = null;
      // try {
      //   var _from = "OTHERPAY";
      //   var _filter = { 
      //     whereClause: `created BETWEEN ? and ? AND locationskey = ?  AND prefix = ?`,
      //     values: [pjs.session['ts_begin'], globals['clientTime'], pjs.session['locationsKey'], 'Pay-Out']
      //   };
      //   var _groupby = ``;
      //   var _orderby = ``;
      //   var _aggFunctions = 
      //     {
      //       "amount": {
      //         "aggFunction": "sum",
      //         "aggName": "amount"
      //       }
      //     };
      //   _data = pjs.data.getAggregateData(_from, _aggFunctions, _filter, _groupby, _orderby );
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // var paidOutTotal = _data;

      // 6. VacumVending Total
      // var _success = false;
      // var _error = null;
      // 
      // var _data = null;
      // try {
      //   var _from = "OTHERPAY";
      //   var _filter = { 
      //     whereClause: `created BETWEEN ? and ? AND locationskey = ? AND (glcodekey = ? or glcodekey = ?)`,
      //     values: [pjs.session['ts_begin'], globals['clientTime'], pjs.session['locationsKey'], 61, 62]
      //   };
      //   var _groupby = ``;
      //   var _orderby = ``;
      //   var _aggFunctions = 
      //     {
      //       "amount": {
      //         "aggFunction": "sum",
      //         "aggName": "amount"
      //       }
      //     };
      //   _data = pjs.data.getAggregateData(_from, _aggFunctions, _filter, _groupby, _orderby );
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // var vacumVendingTotal = _data;

      // 7. Calculate Shift Deposits
      // 
      // /*
      //   This step will calculate cash deposits for the shift being zout
      // */
      // 
      // if(cash_totals['paymentamount'] == null)  cash_totals['paymentamount'] = 0
      // if(cash_totals['actamtpd'] == null)  cash_totals['actamtpd'] = 0
      // if(check_totals['paymentamount'] == null)  check_totals['paymentamount'] = 0
      // if(check_totals['actamtpd'] == null)  check_totals['actamtpd'] = 0
      // 
      // 
      // let cashTotal = Number(cash_totals['paymentamount'])
      // let checkTotal = Number(check_totals['paymentamount'])
      // let actualCashPaid = Number(cash_totals['actamtpd'])
      // let actualCheckPaid = Number(check_totals['actamtpd'])
      // let returnedCash = (actualCashPaid - cashTotal) + (actualCheckPaid - checkTotal)
      // 
      // 
      // if(vacumVendingTotal['amount'] == null){
      //   vacumVendingTotal['amount'] = 0
      // }
      // if(paidOutTotal['amount'] == null){
      //   paidOutTotal['amount'] = 0
      // }
      // //add vacuumcending
      // actualCashPaid += Number(vacumVendingTotal['amount'])
      // 
      // //subtract paidouts
      // actualCashPaid -= Number(paidOutTotal['amount'])
      // 
      // //subtract returned cash
      // actualCashPaid -= Number(returnedCash)
      // 
      // //fix to 2 decimal places
      // actualCashPaid = Number(actualCashPaid).toFixed(2)
      // //expected_total['paymentamount'] = Number(total).toFixed(2)
      // 
      // let expectedTotal = Number(actualCashPaid) + Number(actualCheckPaid)
      // expectedTotal = Number(expectedTotal).toFixed(2)
      // 
      // let shiftDeposit={
      //   lctnshftky:pjs.session["locationShiftKey"],
      //   userskey:pjs.session["usersKey"],
      //   amount:zout_totals["deposit"],
      //   expectamt: expectedTotal //actualCashPaid
      // };
      // 
      // zout_totals['deposits'] = shiftDeposit
      // 

      // 8. If Totals Match
      if (zout_totals["deposit"] == expectedTotal) {

        // 9. Z-Out Good
        Object.assign(zout_good, {
          "endShiftDisabled": false,
          "expected": actualCashPaid,
          "actual": zout_totals["deposit"],
          "expectedChecks": actualCheckPaid
        });
        screenHistory.push("zout_good");
        activeScreen = screens["zout_good"];
        return;
      }

      // 10. Otherwise
      else {

        // 11. Z-Out Bad
        Object.assign(zout_bad, {
          "expected": actualCashPaid,
          "actual": zout_totals["deposit"],
          "expectedChecks": actualCheckPaid,
          "missing": Number(actualCashPaid- zout_totals["deposit"]).toFixed(2),
          "endShiftDisabled": false
        });
        screenHistory.push("zout_bad");
        activeScreen = screens["zout_bad"];
        return;
      }
    },

    "Z-Out Totals Screen": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Get Zout Totals
      var parms = {};
      parms["ts_begin"] = pjs.session['ts_begin'];
      parms["clientTime"] = globals['clientTime'];
      parms["locationsKey"] = pjs.session['locationsKey'];
      parms["submitTotals"] = false;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("ZoutModule.module.json");
        _results = pjsModule["Zout Totals"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var check_totals = _results ? _results["check_totals"] : null;
      var actualCashPaid = _results ? _results["actualCashPaid"] : null;

      // 3. Show Z-Out Totals Popup
      Object.assign(zout_totals, {
        "expectedCash": actualCashPaid,
        "expectedChecks": check_totals["actamtpd"],
        "expectedTotal": Number(Number(actualCashPaid) + Number(check_totals['actamtpd'])).toFixed(2)
      });
      screenHistory.push("zout_totals");
      activeScreen = screens["zout_totals"];
      return;

      // 4. Get Totals for Cash
      // var _success = false;
      // var _error = null;
      // 
      // var _data = null;
      // try {
      //   var _from = "TRANSACTIONSHEADER INNER JOIN TRANSACTIONPAYMENTS ON TRANSACTIONSHEADER.TXHDRKEY = TRANSACTIONPAYMENTS.TRANSACTIONSHEADERKEY LEFT JOIN REFUNDS ON TRANSACTIONPAYMENTS.TXPAYKEY = REFUNDS.TXPAYKEY";
      //   var _filter = { 
      //     whereClause: `localts1 BETWEEN ? AND ? AND locationskey = ? AND (TRANSACTIONPAYMENTS.paymenttypekey = ? )  AND REFUNDS.refundkey IS NULL`,
      //     values: [pjs.session['ts_begin'], globals['clientTime'], pjs.session['locationsKey'], 2]
      //   };
      //   var _groupby = ``;
      //   var _orderby = ``;
      //   var _aggFunctions = 
      //     {
      //       "TRANSACTIONPAYMENTS.paymentamount": {
      //         "aggFunction": "sum",
      //         "aggName": "paymentamount"
      //       },
      //       "TRANSACTIONPAYMENTS.actamtpd": {
      //         "aggFunction": "sum",
      //         "aggName": "actamtpd"
      //       }
      //     };
      //   _data = pjs.data.getAggregateData(_from, _aggFunctions, _filter, _groupby, _orderby );
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // var cash_totals = _data;

      // 5. Get totals for Check
      // var _success = false;
      // var _error = null;
      // 
      // var _data = null;
      // try {
      //   var _from = "TRANSACTIONSHEADER INNER JOIN TRANSACTIONPAYMENTS ON TRANSACTIONSHEADER.TXHDRKEY = TRANSACTIONPAYMENTS.TRANSACTIONSHEADERKEY LEFT JOIN REFUNDS ON TRANSACTIONPAYMENTS.TXPAYKEY = REFUNDS.TXPAYKEY";
      //   var _filter = { 
      //     whereClause: `localts1 BETWEEN ? AND ? AND locationskey = ? AND (TRANSACTIONPAYMENTS.paymenttypekey = ? OR TRANSACTIONPAYMENTS.paymenttypekey = ? )  AND REFUNDS.refundkey IS NULL`,
      //     values: [pjs.session['ts_begin'], globals['clientTime'], pjs.session['locationsKey'], 3, 6]
      //   };
      //   var _groupby = ``;
      //   var _orderby = ``;
      //   var _aggFunctions = 
      //     {
      //       "TRANSACTIONPAYMENTS.paymentamount": {
      //         "aggFunction": "sum",
      //         "aggName": "paymentamount"
      //       },
      //       "TRANSACTIONPAYMENTS.actamtpd": {
      //         "aggFunction": "sum",
      //         "aggName": "actamtpd"
      //       }
      //     };
      //   _data = pjs.data.getAggregateData(_from, _aggFunctions, _filter, _groupby, _orderby );
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // var check_totals = _data;

      // 6. PaidOut Total
      // var _success = false;
      // var _error = null;
      // 
      // var _data = null;
      // try {
      //   var _from = "OTHERPAY";
      //   var _filter = { 
      //     whereClause: `created BETWEEN ? and ? AND locationskey = ?  AND prefix = ?`,
      //     values: [pjs.session['ts_begin'], globals['clientTime'], pjs.session['locationsKey'], 'Pay-Out']
      //   };
      //   var _groupby = ``;
      //   var _orderby = ``;
      //   var _aggFunctions = 
      //     {
      //       "amount": {
      //         "aggFunction": "sum",
      //         "aggName": "amount"
      //       }
      //     };
      //   _data = pjs.data.getAggregateData(_from, _aggFunctions, _filter, _groupby, _orderby );
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // var paidOutTotal = _data;

      // 7. VacumVending Total
      // var _success = false;
      // var _error = null;
      // 
      // var _data = null;
      // try {
      //   var _from = "OTHERPAY";
      //   var _filter = { 
      //     whereClause: `created BETWEEN ? and ? AND locationskey = ? AND (glcodekey = ? or glcodekey = ?)`,
      //     values: [pjs.session['ts_begin'], globals['clientTime'], pjs.session['locationsKey'], 61, 62]
      //   };
      //   var _groupby = ``;
      //   var _orderby = ``;
      //   var _aggFunctions = 
      //     {
      //       "amount": {
      //         "aggFunction": "sum",
      //         "aggName": "amount"
      //       }
      //     };
      //   _data = pjs.data.getAggregateData(_from, _aggFunctions, _filter, _groupby, _orderby );
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // var vacumVendingTotal = _data;

      // 8. Calculate Shift Deposits
      // 
      // /*
      //   This step will calculate cash deposits for the shift being zout
      // */
      // 
      // if(cash_totals['paymentamount'] == null)  cash_totals['paymentamount'] = 0
      // if(cash_totals['actamtpd'] == null)  cash_totals['actamtpd'] = 0
      // if(check_totals['paymentamount'] == null)  check_totals['paymentamount'] = 0
      // if(check_totals['actamtpd'] == null)  check_totals['actamtpd'] = 0
      // 
      // 
      // let cashTotal = Number(cash_totals['paymentamount'])
      // let checkTotal = Number(check_totals['paymentamount'])
      // let actualCashPaid = Number(cash_totals['actamtpd'])
      // let actualCheckPaid = Number(check_totals['actamtpd'])
      // let returnedCash = (actualCashPaid - cashTotal) + (actualCheckPaid - checkTotal) 
      // 
      // 
      // if(vacumVendingTotal['amount'] == null){
      //   vacumVendingTotal['amount'] = 0
      // }
      // if(paidOutTotal['amount'] == null){
      //   paidOutTotal['amount'] = 0
      // }
      // //add vacuumcending
      // actualCashPaid += Number(vacumVendingTotal['amount'])
      // 
      // //subtract paidouts
      // actualCashPaid -= Number(paidOutTotal['amount'])
      // 
      // //subtract returned cash
      // actualCashPaid -= Number(returnedCash)
      // 
      // //fix to 2 decimal places
      // actualCashPaid = Number(actualCashPaid).toFixed(2)
      // //expected_total['paymentamount'] = Number(total).toFixed(2)
      // 
      // 
    },

    "End Shift": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Disable End Shift
      zout_good['endShiftDisabled'] = true;
      zout_bad['endShiftDisabled'] = true;

      // 3. Set Startdate
      let startDate=pjs.session["ts_begin"].toLocaleDateString('en-GB').split('/').reverse().join('-');
      

      // 4. shiftDeposits
      var shiftDeposit = zout_totals['deposits'];

      // 5. Insert Shift Deposit
      var _success = false;
      var _error = null;
      
      var _result = null;
      try {
        var _from = "SHIFTDEPOSITS";
        var _data = shiftDeposit;
      
        _result = pjs.data.add(_from, _data);
        _success = true;
      }
      catch(err) {
        _error = err;
        console.error(err);
      }
      

      // 6. Void Open Transactions
      var _success = false;
      var _error = null;
      
      var _result = null;
      try {
        var _from = "TRANSACTIONSHEADER";
        var _filter = { 
          whereClause: `localts1 BETWEEN ? AND ? AND locationskey = ? AND userskey = ? AND status = ?`,
          values: [pjs.session['ts_begin'], globals['clientTime'], pjs.session['locationsKey'], pjs.session['usersKey'], 'Open']
        };
        var _data = {
          "status": 'Void'
        };
      
        _result = pjs.data.update(_from, _filter, _data);
        _success = true;
      }
      catch(err) {
        _error = err;
        console.error(err);
      }
      
      var voidedTransactions = { success: _success };
      if (_result && _result["affectedRows"] !== undefined)
        voidedTransactions["affectedRows"] = _result["affectedRows"];
      
      if (_error && _error["sqlMessage"] !== undefined)
        voidedTransactions["message"] = _error["message"];
      
      if (_error && _error["sqlcode"] !== undefined)
        voidedTransactions["sqlcode"] = _error["sqlcode"];
      

      // 7. Get Void Transactions Summary
      var _success = false;
      var _error = null;
      
      var _data = null;
      try {
        var _from = "TRANSACTIONSHEADER";
        var _filter = { 
          whereClause: `localts1 BETWEEN ? AND ?  AND userskey = ? AND locationskey = ? AND status = ?`,
          values: [pjs.session['ts_begin'], globals['clientTime'], pjs.session['usersKey'], pjs.session['locationsKey'], 'Void']
        };
        var _groupby = ``;
        var _orderby = ``;
        var _aggFunctions = 
          {
            "txhdrkey": {
              "aggFunction": "count",
              "aggName": "txhdrkey"
            },
            "ordertotal$": {
              "aggFunction": "sum",
              "aggName": "ordertotal$"
            }
          };
        _data = pjs.data.getAggregateData(_from, _aggFunctions, _filter, _groupby, _orderby );
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var voidedTransactions = _data;

      // 8. PaidOuts
      var _success = false;
      var _error = null;
      
      var _data = null;
      try {
        var _from = "OTHERPAY";
        var _filter = { 
          whereClause: `created BETWEEN ? and ? AND prefix = ? AND locationskey = ?`,
          values: [pjs.session['ts_begin'], globals['clientTime'], 'Pay-Out', pjs.session['locationsKey']]
        };
        var _groupby = ``;
        var _orderby = ``;
        var _aggFunctions = 
          {
            "otherkey": {
              "aggFunction": "count",
              "aggName": "otherkey"
            },
            "amount": {
              "aggFunction": "sum",
              "aggName": "amount"
            }
          };
        _data = pjs.data.getAggregateData(_from, _aggFunctions, _filter, _groupby, _orderby );
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var paidOutTotals = _data;

      // 9. Vacum Totals
      var _success = false;
      var _error = null;
      
      var _data = null;
      try {
        var _from = "OTHERPAY";
        var _filter = { 
          whereClause: `created BETWEEN ? and ?  AND locationskey = ? AND glcodekey = ?`,
          values: [pjs.session['ts_begin'], globals['clientTime'], pjs.session['locationsKey'], 61]
        };
        var _groupby = ``;
        var _orderby = ``;
        var _aggFunctions = 
          {
            "otherkey": {
              "aggFunction": "count",
              "aggName": "otherkey"
            },
            "amount": {
              "aggFunction": "sum",
              "aggName": "amount"
            }
          };
        _data = pjs.data.getAggregateData(_from, _aggFunctions, _filter, _groupby, _orderby );
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var vacuumTotals = _data;

      // 10. VendingTotals
      var _success = false;
      var _error = null;
      
      var _data = null;
      try {
        var _from = "OTHERPAY";
        var _filter = { 
          whereClause: `created BETWEEN ? and ?  AND locationskey = ? AND glcodekey = ?`,
          values: [pjs.session['ts_begin'], globals['clientTime'], pjs.session['locationsKey'], 62]
        };
        var _groupby = ``;
        var _orderby = ``;
        var _aggFunctions = 
          {
            "otherkey": {
              "aggFunction": "count",
              "aggName": "otherkey"
            },
            "amount": {
              "aggFunction": "sum",
              "aggName": "amount"
            }
          };
        _data = pjs.data.getAggregateData(_from, _aggFunctions, _filter, _groupby, _orderby );
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var vendingTotals = _data;

      // 11. Get ScrubClub Total
      var _success = false;
      var _error = null;
      
      var _data = null;
      try {
        var _from = "SCRUBCLUBTRACKING INNER JOIN TRANSACTIONSHEADER ON SCRUBCLUBTRACKING.REDEEMEDTRANSACTIONSHEADERINVOICE = TRANSACTIONSHEADER.INVOICENBR";
        var _filter = { 
          whereClause: `locationskey = ? AND localts1 BETWEEN ? and ? AND ordertotal$ <> discountedtotal$`,
          values: [pjs.session['locationsKey'], pjs.session['ts_begin'], globals['clientTime']]
        };
        var _groupby = ``;
        var _orderby = ``;
        var _aggFunctions = 
          {
            "TRANSACTIONSHEADER.txhdrkey": {
              "aggFunction": "count",
              "aggName": "txhdrkey"
            },
            "SCRUBCLUBTRACKING.dollaramt": {
              "aggFunction": "sum",
              "aggName": "dollaramt"
            }
          };
        _data = pjs.data.getAggregateData(_from, _aggFunctions, _filter, _groupby, _orderby );
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var totalScrubClub = _data;

      // 12. Total Shift Minutes
      var _success = false;
      var _error = null;
      
      var _record = null;
      try {
        var _from = "DPM";
        var _filter = { 
          whereClause: `shift = ? AND loctnkey = ? AND to_char(dpm_date,'YYYY-MM-DD') = ?`,
          values: [pjs.session["currentShift"], pjs.session["locationsKey"], startDate]
        };
        var _select = `totshftmin`;
      
        _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      // If no record found
      if (!_record) {
        _record = {};
        _error = new Error("Record not found.")
        _success = false;
      }
      var totalShiftMins = _record;

      // 13. Setup Shift Totals
      /*
        This step structures shift totals data, to prepare for db insert into shifttotals table
      */
      
      //Payment Related Summary
      
        let paymentObject = {
          amexcardsales : 0,          // American Express Card Sales
          amexcardsales_cnt : 0,          // American Express Card Sales Count
          bankcardsales : 0,              // Bank Card Sales ?
          backcardsales_cnt : 0,          // Bank Card Sales Count ?
          cashsales : 0,                  //Cash Sales 
          cashsales_cnt : 0,              //Cash Sales Count
          checksales : 0,                 //Check Sales
          checksales_cnt : 0,             //Check Sales Count
          debitcardsales : 0,             //Debit Card Sales
          debitcardsales_cnt : 0,         //Debit Card Sales Count
          disccardsales : 0,              //Discovery Card Sales
          disccardsales_cnt : 0,          //Discovery Card Sales Count
          ecachecksales : 0,              //ECA Check Sales
          ecachecksales_cnt : 0,          //ECA Check Sales Count
          mcardsales : 0,                 //MasterCard Sales
          mcardsales_cnt : 0,             //MasterCard Sales Count
          openchargesales : 0,            //Open Charge Sales
          openchargesales_cnt : 0,        //Open Charge Sales Count
          visacardsales : 0,              //Visa Card Sales
          visacardsales_cnt : 0,          //Visa Card Sales Count
      
        } 
        //Lets fetch info for payments. 
      
        let paymentSummary = display.shift_payments.getRecords()
        for(let payment of paymentSummary){
          if(payment['payment_type'] == 'American Express'){
            paymentObject.amexcardsales += payment['price']
            paymentObject.amexcardsales_cnt += payment['qty']
          }
          else if(payment['payment_type'] == 'Cash Sale'){
            paymentObject.cashsales += payment['price']
            paymentObject.cashsales_cnt += payment['qty']
          }
          else if(payment['payment_type'] == 'Check'){
            paymentObject.checksales += payment['price']
            paymentObject.checksales_cnt += payment['qty']
          }
          else if(payment['payment_type'] == 'Debit Card'){
            paymentObject.debitcardsales += payment['price']
            paymentObject.debitcardsales_cnt += payment['qty']
          }
          else if(payment['payment_type'] == 'Discover'){
            paymentObject.disccardsales += payment['price']
            paymentObject.disccardsales_cnt += payment['qty']
          }
          else if(payment['payment_type'] == 'ECA Check'){
            paymentObject.ecachecksales += payment['price']
            paymentObject.ecachecksales_cnt += payment['qty']
          }
          else if(payment['payment_type'] == 'Mastercard'){
            paymentObject.mcardsales += payment['price']
            paymentObject.mcardsales_cnt += payment['qty']      
          }
          else if(payment['payment_type'] == 'Open Chrg'){
            paymentObject.openchargesales += payment['price']
            paymentObject.openchargesales_cnt += payment['qty']
          }
          else if(payment['payment_type'] == 'Visa'){
            paymentObject.visacardsales += payment['price']
            paymentObject.visacardsales_cnt += payment['qty']
          }
        }
      let dollar_per_min=0;
      let dollar_per_hour=0;
      if(Object.keys(totalShiftMins).length!==0)
      {
        let hours=totalShiftMins['totshftmin']/60
        dollar_per_min=cashierscreen_shiftsales['total']/totalShiftMins['totshftmin'];
        dollar_per_hour=cashierscreen_shiftsales['total']/hours
      }
      
      //Totals related summary
      let  totalsObject = {
        tax : cashierscreen_shiftsales['tax'],                          //Tax
        netsales : cashierscreen_shiftsales['subtotal'],                //Net Sales
        totalsales : cashierscreen_shiftsales['total'],                 //Total Sales
        coupons : 0,                    //Coupons
        coupons_cnt : 0,                //Coupons Count
          sc:0,                           //Total Scrub club value
          sc_cnt:0,                        //No fo scrub club discount,
          dlrpermin:dollar_per_min,    //Dollar per minute
          dlrperhr:dollar_per_hour      //Dollar per hour
      }
      
      //Product Category Related
        let productCategoryObject = {
          brightener : 0,                 // Brightener
          brightener_cnt : 0,             //Brightener Count
          citri : 0,                      //Citri
          citri_cnt : 0,                  //Citri Count
          combinations : 0,               //Combinations
          combinations_cnt : 0,           //Combinations Count
          engine : 0,                     //Engine
          engine_cnt : 0,                 //Engine Count
          genitems : 0,                   //General Items
          genitems_cnt : 0,               //General  Items Count
          hotwax : 0,                     //Hot Wax
          hotwax_cnt : 0,                 //Hot Wax Count
          tractoronly : 0,                //Tractor Only
          tractoronly_cnt : 0,            //Tractor Only Count
          traileronly : 0,                //Trailer Only
          traileronly_cnt : 0,            //Trailer Only Count
          washes:0,
          washes_cnt:0,
          misc:0,
          misc_cnt:0,
          other:0,
          other_cnt:0
        }
      let categorySummary = display.shift_wash_sales.getRecords()
      
      for(let category of categorySummary){
      
        if(category['wash_type'] == 'Brightener'){
          productCategoryObject.brightener += category['price']
          productCategoryObject.brightener_cnt += category['qty']
        }
        else if(category['wash_type'] == 'Citri Brite'){
          productCategoryObject.citri += category['price']
          productCategoryObject.citri_cnt += category['qty']    
        }
        else if(category['wash_type'] == 'Combinations'){
          productCategoryObject.combinations += category['price']
          productCategoryObject.combinations_cnt += category['qty']    
        }
        else if(category['wash_type'] == 'Engine Wash'){
          productCategoryObject.engine += category['price']
          productCategoryObject.engine_cnt += category['qty']
        }
        else if(category['wash_type'] == 'General Items'){
          productCategoryObject.genitems += category['price']
          productCategoryObject.genitems_cnt += category['qty']
          
        }
        else if(category['wash_type'] == 'Hot Wax'){
          productCategoryObject.hotwax += category['price']
          productCategoryObject.hotwax_cnt += category['qty']
        }
        else if(category['wash_type'] == 'Tractors'){
          productCategoryObject.tractoronly += category['price']
          productCategoryObject.tractoronly_cnt += category['qty']
        }
        else if(category['wash_type'] == 'Trailers'){
          productCategoryObject.traileronly += category['price']
          productCategoryObject.traileronly_cnt += category['qty']
        }
        else if(category['wash_type'] == 'Miscellaneous Washes'){
            productCategoryObject.washes  += category['price'];
            productCategoryObject.washes_cnt  += category['qty'];
        }
        else if(category['wash_type'] == 'Miscellaneous'){
            productCategoryObject.misc  += category['price'];
            productCategoryObject.misc_cnt  += category['qty'];
        }
        else if(category['wash_type'] == 'Other Wash'){
            productCategoryObject.other  += category['price'];
            productCategoryObject.other_cnt  += category['qty'];
        }
      }
      
      //Shift Related
      let  shiftObject = {
       
        docstatus : 0,                                    //Document Status
        shiftsalesdate : globals['clientTime'],                      //Shift Sales Date
        startinvnumber : cashierscreen_shiftsales['starting_invoice'] == '' ? 0 : cashierscreen_shiftsales['starting_invoice'],    //Start Invoice Number
        
        endinvnumber : cashierscreen_shiftsales['ending_invoice'] == '' ? 0 : cashierscreen_shiftsales['ending_invoice'],      //End Invoice Number
        endtime : globals['clientTime'],                             //End Timestamp
        zcashierid : pjs.session['usersKey'],             //Cashier ID
        usrkeyfin: pjs.session['usersKey'], 
        voids : voidedTransactions['ordertotal$'] == null ? 0: voidedTransactions['ordertotal$'],                       //Voids
        voids_cnt : voidedTransactions['txhdrkey']                                                            //Voids Count
      }
      
      if(typeof totalScrubClub!=='undefined')
      {
       totalsObject.sc=totalScrubClub['dollaramt']
       totalsObject.sc_cnt=totalScrubClub['txhdrkey']
      }
      //Scale Related
        let scaleObject = {
          fw : 0,               //FW
          fw_cnt : 0,           //FW Count
          rw : 0,               //RW
          rw_cnt : 0            //RW Count
        }
      let scaleSummary = display.shift_scale_sales.getRecords()
      
      for(let scale of scaleSummary){
        if(scale['scale_type'] == 'First Weigh'){
          scale.fw += scale['price']
          scaleObject.fw_cnt += scale['qty']
        }
        else if(scale['scale_type'] == 'Reweigh'){
          scaleObject.rw += scale['price']
          scaleObject.rw_cnt += scale['qty']
        }
      }
      
      
      let shiftTotalsObject = {
        paidouts : paidOutTotals['amount'] == null? 0: paidOutTotals['amount'],                   //Paidouts
        paidouts_cnt : paidOutTotals['otherkey'],                                               //Paidouts Count
        vacuum : vacuumTotals['amount'] == null ? 0 : vacuumTotals['amount'],                     //Vacuum
        vacuum_cnt : vacuumTotals['otherkey'],                                                   //Vacuum Count
        vending : vendingTotals['amount'] == null? 0 : vendingTotals['amount'],                    //Vending
        vending_cnt : vendingTotals['otherkey'],                                                  //    Vending Count
        ...paymentObject,
        ...productCategoryObject,
        ...shiftObject,
        ...totalsObject,
        ...scaleObject
      }

      // 14. Update Shift Totals
      /*
        Updates and closes shift totals recrods, which was created on login of cashier as open register. 
      */
      var _success = false;
      var _error = null;
      
      var _result = null;
      try {
        var _from = "SHIFTTOTALS";
        var _filter = { 
          whereClause: `shiftlocation = ?   AND starttime >= ?  AND zcashierid IS NULL`,
          values: [pjs.session['locationsKey'], pjs.session['ts_begin']]
        };
        var _data = shiftTotalsObject;
        _result = pjs.data.update(_from, _filter, _data);
        _success = true;
      }
      catch(err) {
        _error = err;
      }
      
      var updateResponse = { success: _success };
      if (_result && _result["affectedRows"] !== undefined)
        updateResponse["affectedRows"] = _result["affectedRows"];
      
      if (_error && _error["sqlMessage"] !== undefined)
        updateResponse["message"] = _error["message"];
      
      if (_error && _error["sqlcode"] !== undefined)
        updateResponse["sqlcode"] = _error["sqlcode"];
      

      // 15. get Shift Total
      var _success = false;
      var _error = null;
      
      var _record = null;
      try {
        var _from = "SHIFTTOTALS INNER JOIN TOMLCTNS ON SHIFTTOTALS.SHIFTLOCATION = TOMLCTNS.LOCATIONKEY INNER JOIN USERS ON SHIFTTOTALS.ZCASHIERID = USERS.USERSKEY";
        var _filter = { 
          whereClause: `shiftlocation = ?   AND starttime >= ?   AND zcashierid = ?`,
          values: [pjs.session['locationsKey'], pjs.session['ts_begin'], pjs.session['usersKey']]
        };
        var _select = `shiftnumber,USERS.firstname,SUBSTR(USERS.lastname,1,1) as lastname,TOMLCTNS.location,SHIFTTOTALS.shifttotky`;
      
        _record = pjs.data.get(pjs.getDB("default"), _from, _filter, 1, 0, null, _select);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      // If no record found
      if (!_record) {
        _record = {};
        _error = new Error("Record not found.")
        _success = false;
      }
      var updatedShiftTotal = _record;

      // 16. Delete Current Cashier Table Entry
      var _success = false;
      var _error = null;
      
      var _result = null;
      try {
        var _from = "CRNTCSHR";
        var _filter = { 
          whereClause: `loctnkey = ? AND userskey = ?`,
          values: [pjs.session['locationsKey'], pjs.session['usersKey']]
        };
      
        _result = pjs.data.delete(_from, _filter);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      

      // 17. Set up Zout Receipt
      /*
        This step structures data to include on printed ZOUT receipt
      */
      function formatTime(timestamp){
        let hours = timestamp.getHours()
        let mins = timestamp.getMinutes()
      
        let dayTime = "";
        if (hours/12 < 1)
          dayTime = "AM";
        else
          dayTime = "PM";
      
        hours = hours % 12;
        if(hours == 0) hours = 12;
        if(mins < 10) mins = "0"+mins;
        return hours+":"+mins+" "+dayTime;
      }
      
      let washes = display.shift_wash_sales.getRecords()
      let washTotals = {
          qty: 0, price: 0.00
        }
      if(washes.length != 0){
        washTotals = washes.reduce((total, curr) => {
          return {
            qty: Number(Number(curr['qty']) + Number(total['qty'])),
            price: Number(Number(curr['price']) + Number(total['price'])).toFixed(2)
          }
        })
      }
      let scaleItems = display.shift_scale_sales.getRecords()
      let scaleTotals = {
          qty: 0, price: 0.00
        }
      if(scaleItems.length != 0){
        scaleTotals = scaleItems.reduce((total, curr) => {
          return {
            qty: Number(Number(curr['qty']) + Number(total['qty'])),
            price: Number(Number(curr['price']) + Number(total['price'])).toFixed(2)
          }
        })
      }
      let generalItems =display.shift_general_sales.getRecords()
      let generalTotals = {
          qty: 0, price: 0.00
        }
      if(generalItems.length != 0){
        generalTotals = generalItems.reduce((total, curr) => {
          return {
            qty: Number(Number(curr['qty']) + Number(total['qty'])),
            price: Number(Number(curr['price']) + Number(total['price'])).toFixed(2)
          }
        })
      }
      let payments = display.shift_payments.getRecords()
      let paymentTotals = {
          qty: 0, price: 0.00
        }
      if(payments.length != 0){
        paymentTotals = payments.reduce((total, curr) => {
          return {
            qty: Number(Number(curr['qty']) + Number(total['qty'])),
            price: Number(Number(curr['price']) + Number(total['price'])).toFixed(2)
          }
        })
      }
      let customItems = display.shift_custom_items.getRecords()
      let customTotals = {
          qty: 0, price: 0.00
        }
      if(customItems.length != 0){
        let payouts = customItems.filter(item => item['item_type'] == 'Pay-Out')
        let vacuumVending = customItems.filter(item => item['item_type'] != 'Pay-Out')
      
        if(payouts.length != 0){
          payouts = payouts.reduce((total, curr) => {
            return {
              quantity: Number(Number(curr['quantity']) + Number(total['quantity'])),
              price: Number(Number(curr['price']) + Number(total['price'])).toFixed(2)
            }
          })
        }
        else{
          payouts = {
            quantity : 0,
            price : 0
          }
        }
      
        if(vacuumVending.length != 0 ){
          vacuumVending = vacuumVending.reduce((total, curr) => {
            return {
              quantity: Number(Number(curr['quantity']) + Number(total['quantity'])),
              price: Number(Number(curr['price']) + Number(total['price'])).toFixed(2)
            }
          })
        }
        else{
          vacuumVending = {
            quantity : 0,
            price: 0
          }
        }
      
        customTotals = {
          quantity: Number(vacuumVending['quantity']) + Number(payouts['quantity']),
          price: Number(Number(vacuumVending['price']) - Number(payouts['price'])).toFixed(2)
        }
      }
      
      let otherItems = []
      
      washes = display.shift_wash_sales.getRecords().map((rec) => {
        return{
          ...rec,
          price : Number(rec['price']).toFixed(2)
        }
      })
      
      scaleItems = display.shift_scale_sales.getRecords().map((rec) => {
        return{
          ...rec,
          price : Number(rec['price']).toFixed(2)
        }
      })
      
      generalItems = display.shift_general_sales.getRecords().map((rec) => {
        return{
          ...rec,
          price : Number(rec['price']).toFixed(2)
        }
      })
      
      payments = display.shift_payments.getRecords().map((rec) => {
        return{
          ...rec,
          price : Number(rec['price']).toFixed(2)
        }
      })
      
      customItems = display.shift_custom_items.getRecords().map((rec) => {
        return{
          ...rec,
          price : Number(rec['price']).toFixed(2)
        }
      })
      
      
      let zout = {
        status : '',
        date : (globals['clientTime'].getMonth()+1) + '/' +globals['clientTime'].getDate()+ '/' + globals['clientTime'].getFullYear(),
        location : updatedShiftTotal['location'],
        zcashierid : updatedShiftTotal['firstname'] + " " +updatedShiftTotal['lastname'],
        startingInvoice: cashierscreen_shiftsales['starting_invoice'],
        endingInvoice: cashierscreen_shiftsales['ending_invoice'],
        startTime : formatTime(pjs.session['ts_begin']),
        endTime: formatTime(globals['clientTime']),
        shift: updatedShiftTotal['shiftnumber'],
        washes: washes,
        wash_total: Number(washTotals['price']).toFixed(2),
        wash_quantity: washTotals['qty'],
        scaleItems: scaleItems,
        scale_total: Number(scaleTotals['price']).toFixed(2),
        scale_quantity: scaleTotals['qty'],
        generalItems:generalItems,
        general_total: Number(generalTotals['price']).toFixed(2),
        general_quantity: generalTotals['qty'],
        payments: payments,
        payment_total: Number(paymentTotals['price']).toFixed(2),
        payment_quantity: paymentTotals['qty'],
        customItems: customItems,
        custom_total: Number(customTotals['price']).toFixed(2),
        custom_quantity: customTotals['quantity'],
        otherItems:otherItems,
        void_total: voidedTransactions['ordertotal$'] == null ? Number(0).toFixed(2): Number(voidedTransactions['ordertotal$']).toFixed(2),
        void_quantity: voidedTransactions['txhdrkey'],
        net_sales: cashierscreen_shiftsales['subtotal'],
        tax: Number(cashierscreen_shiftsales['tax']).toFixed(2),
        discount: Number(cashierscreen_shiftsales['discount']).toFixed(2),
        total: Number(cashierscreen_shiftsales['total']).toFixed(2)
      }
      
      

      // 18. Gen Z out Receipt
      /*
        This step generates ZOUT receipt using data structured in last step and Zout receipt hTML template
       */
      const ejs = require('ejs')
      const fs = require('fs')
      const path = require('path')
      
      var templateString = fs.readFileSync(path.join(__dirname, 'templates', 'z-out.ejs'), 'utf-8');
      let html = ejs.render(templateString, {zout:zout});
      
      zout_good['zoutReceipt'] = html
      zout_bad['zoutReceipt'] = html
        

      // 19. Clear Session Data
      //Step will clear session data
      pjs.session = [];
    },

    "Transactions Grid Email receipt": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Can Send Reciept?
      /*
        This step verifies that the user can send email of receipt, of selected transaction
        This considers, HQAconfig table restrictions on time limit 
        as well as checks that the transaction is a valid sale transaction
      */
      
      if(activeGridRecord["status"] == "Open"){
        pjs.messageBox({
          title: "",
          message: "Cant send receipt for open transaction"
        })
        return
      }
      if(activeGridRecord["status"] == "Void"){
        pjs.messageBox({
          title: "",
          message: "Cant send receipt for void transaction"
        })
        return
      }
      
      //Receipt Restrictions [here]
      var currentTime = new Date(globals['clientTime'].getTime())
      if(pjs.session.restrictions["Transaction Restrictions"]["Print Receipt Timeframe"]["startLimit"] > currentTime || pjs.session.restrictions["Transaction Restrictions"]["Print Receipt Timeframe"]["endLimit"] < currentTime){
        pjs.messageBox({
          title: '',
          message: 'Cannot print receipt in that time frame'
        })
        return
      }

      // 3. Fetch Transaction
      var parms = {};
      parms["txhdrkey"] = activeGridRecord['txhdrkey'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetTransactions.module.json");
        _results = pjsModule["Fetch Transaction For Receipt"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var transaction = _results ? _results["txhdr"] : null;

      // 4. Get Payments
      var parms = {};
      parms["transactionHeaderKey"] = activeGridRecord['txhdrkey'];
      parms["joinRefunds"] = false;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetPayments.module.json");
        _results = pjsModule["GetPayments"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var paymentList = _results ? _results["paymentList"] : null;

      // 5. Generate Receipt
      var parms = {};
      parms["locationTaxRate"] = transaction['taxrate'];
      parms["discount_print"] = transaction['viewdisc'];
      parms["receiptQty"] = 1;
      parms["split"] = true;
      parms["paymentMethod"] = null;
      parms["paymentList"] = paymentList;
      parms["txhdr"] = transaction;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GenerateCustomerAndWashBayReceipt.module.json");
        _results = pjsModule["Generate Customer Receipt"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var receipt = _results ? _results["receiptHTML"] : null;

      // 6. Show Send Email screen
      Object.assign(email_receipt, {
        "email_message": JSON.parse(receipt).html
      });
      screenHistory.push("email_receipt");
      activeScreen = screens["email_receipt"];
      return;

      // 7. Fetch Transaction
      // const utility = require('../common-apis/utility.js')
      // 
      // try{
      //   var query = "SELECT TRANSACTIONSHEADER.TXHDRKEY, VARCHAR_FORMAT(TRANSACTIONSHEADER.LOCALTS1, 'MM/DD/YYYY') as localts1, TRANSACTIONSHEADER.INVOICENBR, TRANSACTIONSHEADER.TRACTORNBR, "+
      //               "TRANSACTIONSHEADER.TRAILERNBR, TRANSACTIONSHEADER.DISCOUNTEDTOTAL$, TRANSACTIONSHEADER.ORDERTOTAL$, TRANSACTIONSHEADER.TAXTOTAL$, "+
      //               "TRANSACTIONSHEADER.PONUMBER, TRANSACTIONSHEADER.DRIVERID, TRANSACTIONSHEADER.TRIPNUMBER, "+
      //               "TRANSACTIONSHEADER.USERSKEY, TRANSACTIONSHEADER.CASHIERMESSAGE, CORPORATECUSTOMERS.COMPANYNM, TOMLCTNS.LOCATION, TOMLCTNS.PHONENBR "+
      //               "FROM TRANSACTIONSHEADER "+
      //               "INNER JOIN TOMLCTNS ON TRANSACTIONSHEADER.LOCATIONSKEY = TOMLCTNS.LOCATIONKEY " +
      //               "INNER JOIN CORPORATECUSTOMERS ON TRANSACTIONSHEADER.CORPORATECUSTOMERSKEY = CORPORATECUSTOMERS.CORPCUSTKEY " +
      //               "WHERE TRANSACTIONSHEADER.TXHDRKEY = ?;"
      // 
      //   var txhdr = pjs.query(query, [Number(activeGridRecord["txhdrkey"])])
      // 
      //   query = "SELECT TRANSACTIONDETAILS.QUANTITY, TRANSACTIONDETAILS.COST, TRANSACTIONDETAILS.COSTFULL, PRODUCTS.PRODUCT, PRODUCTS.TAXABLE "+
      //           "FROM TRANSACTIONDETAILS "+
      //           "INNER JOIN PRODUCTS ON TRANSACTIONDETAILS.PRODUCTSKEY = PRODUCTS.PRDKEY "+
      //           "WHERE TRANSACTIONDETAILS.TXHDRKEY = ? AND (TRANSACTIONDETAILS.DELETE <> ? OR TRANSACTIONDETAILS.DELETE IS NULL);"
      //   var items = pjs.query(query, [Number(activeGridRecord["txhdrkey"]), 'Y'])
      // 
      //   txhdr = txhdr[0]
      //   items.forEach((item) => {
      //     if(cashierscreen['discount_print']=='DISCOUNT')
      //     {
      //       item["cost"] = Number(item["cost"]).toFixed(2)
      //     }
      //     else
      //     {
      //        item["cost"] = Number(item["costfull"]).toFixed(2)
      //     }
      //     
      //   })
      //   txhdr["items"] = items
      //   txhdr["subtotal"] = Number(txhdr["ordertotal$"]).toFixed(2)
      //   if(cashierscreen['discount_print']=='DISCOUNT')
      //   {
      //     txhdr["discount"] = Number((Number(txhdr["discountedtotal$"]) -Number(txhdr["taxtotal$"])) - Number(txhdr["ordertotal$"])).toFixed(2)
      //   }
      //   else
      //   {
      //     txhdr["discount"] ="";
      //   }
      //   
      //   txhdr["tax"] = Number(txhdr["taxtotal$"]).toFixed(2)
      //   txhdr["total"] = Number(txhdr["discountedtotal$"]).toFixed(2)
      //   txhdr["phonenbr"] = utility.formatPhoneNumber(txhdr["phonenbr"])
      //   email_receipt["txhdr"] = txhdr
      //    txhdr["taxrate"]= (Number(Number(pjs.session["locationTaxRate"])*100).toFixed(2))+"%";
      // }
      // catch(e){
      //   //error
      // }
      // 
      // 

      // 8. Payments?
      // var _success = false;
      // var _error = null;
      // 
      // var _records = null;
      // try {
      //   var _from = "TRANSACTIONPAYMENTS";
      //   var _filter = { 
      //     whereClause: `transactionsheaderkey = ?`,
      //     values: [activeGridRecord["txhdrkey"]]
      //   };
      //   var _limit = ``;
      //   var _skip = ``;
      //   var _orderby = ``;
      //   var _select = `txpaykey,paymentmethod,paymentamount,actamtpd`;
      // 
      //   _records = pjs.data.get(_from, _filter, _limit, _skip, _orderby, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _records = [];
      //   _error = err;
      //   console.error(err);
      // }
      // var paymentsList = _records;

      // 9. Get Tx Cashier
      // var _success = false;
      // var _error = null;
      // 
      // var _record = null;
      // try {
      //   var _from = "USERS";
      //   var _filter = { 
      //     whereClause: `userskey = ?`,
      //     values: [ txhdr["userskey"]]
      //   };
      //   var _select = `firstname,SUBSTR(lastname,1,1) as lastname`;
      // 
      //   _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // // If no record found
      // if (!_record) {
      //   _record = {};
      //   _error = new Error("Record not found.")
      //   _success = false;
      // }
      // var txCashier = _record;

      // 10. Assign Cashier Name on Receipt
      //  //This step includes name of cashier on receipt. cashier which created the TX
      //  txhdr["cashier"]=txCashier["firstname"]+" "+txCashier["lastname"]

      // 11. Set Payment Details
      // let list = paymentsList
      // console.log(list)
      // list = list.map(payment => {
      //   return{
      //     paymentMethod : payment['paymentmethod'],
      //     paymentAmount : Number(payment['paymentamount']).toFixed(2),
      //     actualPaid : Number(payment['actamtpd']).toFixed(2),
      //     returned : Number(Number(payment['actamtpd']) - Number(payment['paymentamount'])).toFixed(2)
      //   }
      // })
      // let payment = {
      //   type: 'split',
      //   list : list
      // }
      // 
      // txhdr['payments'] = payment

      // 12. Generate Receipt Template
      // //This step generates the HTML template of Transaction receipt
      // var fs = require('fs');
      // let ejs = require('ejs');
      // let path = require('path')
      //   
      // var templateString = fs.readFileSync(path.join(__dirname, 'templates', 'customer-receipt.ejs'), 'utf-8');
      // let html = ejs.render(templateString, {txhdr: txhdr});
      // 
      // 
    },

    "send email button click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Validation
      //check if the email address has not been entered
      if(email_receipt["email_address"] == "" || email_receipt["email_address"] == null || email_receipt["email_address"] ==undefined){
        pjs.messageBox({
          title: "Email",
          message: "Please Enter Email Address"
        })
        return
      }

      // 3. Insert Reason
      //This step inserts the reason of why the email had to be sent
      try{
        var query = "INSERT INTO TRANSACTIONSPECIALS "+
                    "(WHAT, REASONCODESKEY, TRANSACTIONHEADERKEY, USERSKEY, OTHERDESC) " +
                    "VALUES(?, ?, ?, ?, ?);"
        var values = [
                      "Reprint", 
                      email_receipt["reprint_reason"], 
                      email_receipt["txhdr"]["txhdrkey"], 
                      (pjs.session["usersKey"] ), 
                      email_receipt["custom_reason"]
                      ]
      
        var _record = pjs.query(query, values)
      }
      catch(e){
        //Error occured during inserting reason for reprint in tX Specials
      }

      // 4. Send email
      /* 
        This step sends out email of generated PDF. 
        PDF is generated on client side, and is transferred to server as base64
      */
      let path = require("path")
      
      var invoice = email_receipt["txhdr"]["invoicenbr"]
      var subject = "TruckomatInvoice" + invoice+".pdf"
      var _data = {
        "from" : process.env.FROM_EMAIL_ADDRESS,
        "to": email_receipt["email_address"],
        "subject": "Truckomat Invoice",
        "html": email_receipt["email_message"],
        "attachments": [{
          "filename": subject,
          "contentType": 'application/pdf', 
          "content": Buffer.from(email_receipt["pdfBase64"], 'base64') 
        },
      ]
      };
      
      var _info = pjs.sendEmail(_data);
      
      pjs.messageBox({
        title: '',
        message: "Email has been sent"
      })
      
      view_transaction["disableEmailBtn"] = true

      // 5. Show previous screen
      let previousScreen = screenHistory[screenHistory.length - 2];
      if (previousScreen) {
        activeScreen = screens[previousScreen];
        screenHistory.pop();
      }
      return;
    },

    "apply button click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Validate Required fields
      /*
        This step validates that all the customer specific required fields, such as PO number, driver id, trip number
        are entered before closing the REquired fields popup
      */
      var missing  = false
      var message = []
      
      if(required_fields["po_required"] && required_fields["ponum"] == ""){
        message.push("PO Number")
        missing = true
      }
      else if( required_fields["ponum"] != "" && required_fields["ponum"] != undefined){
        message.push("PO # "+required_fields["ponum"])
      }
      if(required_fields["tripnumberrequired"] && required_fields["tripnum"] == ""){
        message.push("Trip Number")
        missing = true
      }
      else if(required_fields["tripnum"] !== "" && required_fields["tripnum"] != undefined){
        message.push("Trip # "+required_fields["tripnum"])
      }
      if(required_fields["driveridrequired"] && required_fields["drvid"] == ""){
        message.push("Driver ID")
        missing = true
      }
      else if(required_fields["drvid"] != "" && required_fields["drvid"] != undefined){
        message.push("DriverID "+required_fields["drvid"])
      }
      if(missing){
          pjs.messageBox({
          title: "Required",
          message: message.toString() + " required"
        })
        return
      }
      else{
        cashierscreen["req_items"] = message.toString()
        screenHistory.pop()
        activeScreen = screens["cashierscreen"]
        cashierscreen["save_Disabled"]=false;
      }
    },

    "complete transaction button click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Save Transaction
      var parms = {};
      parms["clientTime"] = globals['clientTime'];
      parms["updateDetails"] = false;
      parms["status"] = "Sale";
      parms["city"] = pjs.session['city'];
      parms["discount_print"] = cashierscreen['discount_print'];
      parms["company_name_value"] = cashierscreen["company_name_value"];
      parms["update"] = true;
      parms["rsubtotal"] = cashierscreen["rsubtotal"];
      parms["total"] = cashierscreen["total"];
      parms["tax"] = cashierscreen["tax"];
      parms["customer_notes"] = receipt_notes["receipt_notes"] ? receipt_notes["receipt_notes"] : '';
      parms["driverInfoKey"] = cashierscreen["driverInfoKey"];
      parms["po_required"] = cashierscreen["po_required"];
      parms["ponum"] = required_fields["ponum"];
      parms["tripNumber_required"] = cashierscreen['tripNumber_required'];
      parms["tripnum"] = required_fields['tripnum'];
      parms["driverId_required"] = cashierscreen['driverId_required'];
      parms["drvid"] = required_fields['drvid'];
      parms["flag_tx_loaded_from_db_id"] = paymentscreen["txhdr"]['txhdrkey'];
      parms["comp_name"] = cashierscreen["comp_name"];
      parms["tractor_number"] = cashierscreen["tractor_number"];
      parms["trailer_number"] = cashierscreen["trailer_number"];
      parms["TractorTrailerRequired"] = cashierscreen['TractorTrailerRequired'];
      parms["usersKey"] = pjs.session['usersKey'];
      parms["currentShift"] = pjs.session['currentShift'];
      parms["tractor_number_value"] = cashierscreen["tractor_number_value"];
      parms["trailer_number_value"] = cashierscreen["trailer_number_value"];
      parms["locationsKey"] = pjs.session['locationsKey'];
      parms["modifiedPriceSpecials"] = cashierscreen['modifiedPriceSpecials'].length == 0 ? null : cashierscreen['modifiedPriceSpecials']  ;
      parms["receiptGridData"] = display.receipt.getRecords();
      parms["signature"] = paymentscreen['driver_signature'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("SaveTransaction.module.json");
        _results = pjsModule["SaveTransaction"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      cashierscreen['flag_tx_loaded_from_db'] = _results ? _results["flag_tx_loaded_from_db"] : null;
      paymentscreen['invoiceNumber'] = _results ? _results["invoiceNumber"] : null;
      paymentscreen['txhdr'] = _results ? _results["updatedTx"] : null;

      // 3. Insert Payment
      var parms = {};
      parms["payment_method"] = paymentscreen['payment_method'];
      parms["zonAuthCode"] = paymentscreen['zonAuthcode'];
      parms["zonLastCCDigits"] = paymentscreen['zonLastCCDigits'];
      parms["total"] = paymentscreen['total'];
      parms["payment_amount"] = paymentscreen['payment_amount'];
      parms["transactionHeaderKey"] = paymentscreen['txhdr']['txhdrkey'];
      parms["invoiceNumber"] = paymentscreen['invoiceNumber'];
      parms["clientTime"] = globals['clientTime'];
      parms["creditTerminalResponse"] = paymentscreen['creditTerminalResponse'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("InsertPayment.module.json");
        _results = pjsModule["Insert Payment"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var paymentList = _results ? _results["paymentList"] : null;
      var paymentMethod = _results ? _results["paymentMethod"] : null;

      // 4. Customer Receipt
      var parms = {};
      parms["locationTaxRate"] = pjs.session['locationTaxRate'];
      parms["discount_print"] = cashierscreen['discount_print'];
      parms["receiptQty"] = cashierscreen['receiptQty'];
      parms["split"] = false;
      parms["paymentMethod"] = paymentMethod;
      parms["paymentList"] = paymentList;
      parms["txhdr"] = paymentscreen['txhdr'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GenerateCustomerAndWashBayReceipt.module.json");
        _results = pjsModule["Generate Customer Receipt"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
       paymentscreen['receiptHTML'] = _results ? _results["receiptHTML"] : null;
       paymentscreen['washBayHTML'] = _results ? _results["washBayHTML"] : null;
      paymentscreen['txhdr'] = _results ? _results["txhdr"] : null;

      // 5. Scrub Club ? Issue 
      var parms = {};
      parms["discountType"] = cashierscreen['discountType'];
      parms["discount"] = paymentscreen['discount'];
      parms["companyId"] = cashierscreen['comp_name'];
      parms["clientTime"] = globals['clientTime'];
      parms["invoiceNumber"] = paymentscreen['txhdr']['invoicenbr'];
      parms["tractor_number_value"] = cashierscreen['tractor_number_value'];
      parms["company_name_value"] = cashierscreen['company_name_value'];
      parms["city"] = pjs.session['city'];
      parms["cashier"] = paymentscreen['txhdr']['cashier'];
      parms["locationsKey"] = pjs.session['locationsKey'];
      parms["scrubApply"] = cashierscreen['scrubApply'] ? (Object.keys(cashierscreen['scrubApply']).length == 0 ? null : cashierscreen['scrubApply']) : null;
      parms["receipt"] = display.receipt.getRecords();
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("IssueScrub.module.json");
        _results = pjsModule["IssueScrub"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      paymentscreen['scrubClubHTML'] = _results ? _results["scrubClubHTML"] : null;

      // 6. Redeem Scrub?
      var parms = {};
      parms["discountType"] = cashierscreen['discountType'];
      parms["scrubApply"] = cashierscreen['scrubApply'] ? (Object.keys(cashierscreen['scrubApply']).length == 0 ? null : cashierscreen['scrubApply']) : null;
      parms["invoiceNumber"] = paymentscreen['txhdr']['invoicenbr'];
      parms["locationsKey"] = pjs.session['locationsKey'];
      parms["clientTime"] = globals['clientTime'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("RedeemScrubClub.module.json");
        _results = pjsModule["Redeem Scrub Club"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }

      // 7. Set Customer Receipt Var
      // //This step just sets up variables for receipt printing, and utility function format phone number of printed receipt
      // let txhdr = paymentscreen['txhdr']
      // var invoiceNumber = paymentscreen['invoiceNumber'];
      // let txPayKey = 0
      // let transactionHeaderKey = txhdr['txhdrkey']
      // 

      // 8. Update TXHeader
      // /*
      //   This step will update the saved transction to Sale status. 
      //   And add additional fields like driver signature to transaction. 
      // 
      //   This step completes the sale process of transaction
      //  */
      // var updatedReceipt = display.receipt.getRecords();
      // transactionHeaderKey = paymentscreen["txhdr"]['txhdrkey']
      // try{
      // var values = [
      //                 globals['clientTime'],
      //                 globals['clientTime'].toISOString().substr(0,10),
      //                 globals['clientTime'].toLocaleTimeString('it-IT'),
      //                 paymentscreen['driver_signature'],
      //                 cashierscreen["rsubtotal"],
      //                 cashierscreen["total"],
      //                 cashierscreen["tax"],
      //                 receipt_notes["receipt_notes"] ? receipt_notes["receipt_notes"] : '' 
      //               ];
      // 
      //   var columns ="";
      //   if(cashierscreen["po_required"]){
      //     columns += ", PONUMBER = ?"
      //      
      //     values.push(required_fields["ponum"])
      //   }
      //   if(cashierscreen["tripNumber_required"]){
      //     columns += ", TRIPNUMBER = ?"
      //     
      //     values.push(required_fields["tripnum"])
      //   }
      //   if(cashierscreen["driverId_required"]){
      //     columns += ", DRIVERID = ?"
      //    
      //     values.push(required_fields["drvid"])
      //   }
      //   columns += ', STATUS = ?'
      //   values.push('Sale')
      //   
      //   values.push(transactionHeaderKey)
      //   var query = "UPDATE TRANSACTIONSHEADER SET LOCALTS1 = ?, PO_DATE = ?, PO_TIME = ?, SIGNATURE = ?, ORDERTOTAL$=? ,  DISCOUNTEDTOTAL$=?, TAXTOTAL$=?, CASHIERMESSAGE=?" +columns+ " WHERE TXHDRKEY = ?" ;
      //   var _records = pjs.query(query, values)
      //   query = "SELECT TXHDRKEY, DATE(LOCALTS1) AS LOCALTS1, INVOICENBR, TRACTORNBR, TRAILERNBR, DISCOUNTEDTOTAL$, ORDERTOTAL$, TAXTOTAL$ "+
      //           ", PONUMBER, DRIVERID, TRIPNUMBER , USERSKEY, CASHIERMESSAGE " +
      //           "FROM TRANSACTIONSHEADER WHERE TXHDRKEY = ?"
      //   _records = pjs.query(query, transactionHeaderKey)
      //   var txHdr = {
      //     "corporatecustomerskey" : cashierscreen["comp_name"]
      //   }
      // 
      //   let items = display.receipt.getRecords().map((item) => {
      //     return{
      //       cost: Number(item["rprice"]).toFixed(2),
      //       quantity: item["qty"],
      //       product: item["item_name"]
      //     }
      //   })
      // 
      //   txhdr['cashiermessage'] = _records[0]['cashiermessage'] ? _records[0]['cashiermessage'] : '' 
      //   txhdr['userskey'] = _records[0]['userskey']
      // 
      // }
      // catch (err){
      //   //error
      // }

      // 9. Setup Payment Var
      // // This step prepares data for payment variables to be inserted into Payments table
      // // This only addresses Complete payment, Split payments have seperate logic
      // 
      // //setup credit card payment vars if applicable
      // let paymentMethod = paymentscreen['payment_method']
      // let creditTerminalResponse = {}
      // 
      // if(paymentMethod == 'Credit Card'){
      //   creditTerminalResponse = JSON.parse(paymentscreen['creditTerminalResponse'])
      //   switch(creditTerminalResponse['PAYMENT_MEDIA']){
      //     case 'AMEX':
      //       paymentMethod = "American Express"
      //       break;
      //     case 'MASTERCD':
      //     case 'MASTERCARD':
      //     case 'MC':
      //       paymentMethod = "Mastercard"
      //       break;
      //     case 'VISA':
      //       paymentMethod = "Visa"
      //       break;
      //     case 'GIFT':
      //       paymentMethod = 'Gift Card'
      //       break;
      //     case 'DEBIT':
      //       paymentMethod = 'Debit Card'
      //       break;
      //     case 'DISCOVER':
      //     case 'DISC':
      //       paymentMethod = "Discover"
      //       break;
      //   }
      // }
      // else if(paymentMethod == 'zon'){
      //   paymentMethod = paymentscreen['zonCardType']
      //   creditTerminalResponse['AUTH_CODE'] = paymentscreen['zonAuthCode']
      //   creditTerminalResponse['ACCT_NUM'] = paymentscreen['zonLastCCDigits']
      //   creditTerminalResponse['CARD_ENTRY_MODE'] = 'ZON/Voice'
      //   creditTerminalResponse['APPROVED_AMOUNT'] = paymentscreen['total']
      // }
      // 
      // try{
      //   let query = "SELECT PAYTYPEKEY, PAYMENTTYPE, SORT, ISCREDCARD FROM PAYMENTTYPES"
      //   let types = pjs.query(query)
      //   paymentMethod = types.filter((rec) => rec["paymenttype"] == paymentMethod)
      //   paymentMethod = paymentMethod[0]
      // }
      // catch(e){
      //   //Error occurred in Fetching Payment Types
      // }
      // 

      // 10. Insert Payment
      // //This step inserts payment details in payments tables
      // 
      // var _success = false;
      // var _error = null;
      // 
      // var _result = null;
      // try {
      // 
      //   var columns = "transactionsheaderkey, invoice, paymenttypekey, paymentmethod, paymentamount, actamtpd"
      //   var options = "?, ?, ?, ?, ?, ?"
      //   var values = [
      //     transactionHeaderKey, 
      //     invoiceNumber, 
      //     paymentMethod['paytypekey'],
      //     paymentMethod['paymenttype'],
      //     paymentscreen['total'],
      //     paymentscreen['payment_amount']
      //   ]
      //   var query = "SELECT TXPAYKEY FROM NEW TABLE( "+
      //               "INSERT INTO TRANSACTIONPAYMENTS"+
      //               "("+columns+") VALUES("+options+"))"
      //               
      //   _result = pjs.query(query, values);
      //   txPayKey = _result[0]['txpaykey']
      //   _success = true;
      // }
      // catch(err) {
      //   _error = err;
      // }
      // 
      // var paymentInsertStatus = { success: _success };
      // if (_result && _result["affectedRows"] !== undefined)
      //   paymentInsertStatus["affectedRows"] = _result["affectedRows"];
      // 
      // if (_result && _result["insertId"])
      //   paymentInsertStatus["insertId"] = _result["insertId"];
      // 
      // if (_error && (_error["sqlMessage"] !== undefined || _error["message"] !== undefined))
      //   paymentInsertStatus["message"] = _error["sqlMessage"] || _error["message"];
      // 
      // if (_error && _error["sqlcode"] !== undefined)
      //   paymentInsertStatus["sqlcode"] = _error["sqlcode"];
      // 

      // 11. Credit Card?
      if ((paymentscreen["payment_method"] == 'Credit Card') || (paymentscreen["payment_method"] == 'zon')) {

        // 12. CCPay Insert
        // //If payment is by card. Insert card related details to CCPay table
        // 
        // 
        // var _success = false;
        // var _error = null;
        // 
        // var _result = null;
        // 
        // try {
        //   var _from = "TXPAYCC";
        //   var _data = {
        //     "txpaykey": txPayKey,
        //     "txhdrkey": transactionHeaderKey,
        //     "cc_accountnumber": creditTerminalResponse['ACCT_NUM'] ? creditTerminalResponse['ACCT_NUM'] : '',
        //     "cc_ctroutd": creditTerminalResponse['CTROUTD'] ? creditTerminalResponse['CTROUTD'] : '',
        //     "cc_intrn_seq_num": creditTerminalResponse['INTRN_SEQ_NUM'] ? creditTerminalResponse['INTRN_SEQ_NUM'] : '',
        //     "cc_payment_media": creditTerminalResponse['PAYMENT_MEDIA'] ? creditTerminalResponse['PAYMENT_MEDIA'] : '',
        //     "cc_result": creditTerminalResponse['RESULT'] ? creditTerminalResponse['RESULT'] : '',
        //     "cc_result_code": creditTerminalResponse['RESULT_CODE'] ? creditTerminalResponse['RESULT_CODE'] : '',
        //     "cc_termination_status": creditTerminalResponse['TERMINATION_STATUS'] ? creditTerminalResponse['TERMINATION_STATUS'] : '',
        //     "cc_trans_seq_num": creditTerminalResponse['TRANS_SEQ_NUM'] ? creditTerminalResponse['TRANS_SEQ_NUM'] : '',
        //     "cc_troutd": creditTerminalResponse['TROUTD'] ? creditTerminalResponse['TROUTD'] : '',
        //     "cc_response_text": creditTerminalResponse['RESPONSE_TEXT'] ? creditTerminalResponse['RESPONSE_TEXT'] : '',
        //     "cc_auth_code": creditTerminalResponse['AUTH_CODE'] ? creditTerminalResponse['AUTH_CODE'] : '',
        //     "cc_card_entry_mode": creditTerminalResponse['CARD_ENTRY_MODE'] ? creditTerminalResponse['CARD_ENTRY_MODE'] : '',
        //     "cc_approved_amount": creditTerminalResponse['APPROVED_AMOUNT'] ? creditTerminalResponse['APPROVED_AMOUNT'] : '',
        //     "cc_client_id":  '',
        //     "cc_tip_amount": '',
        //     "emv_cardentrymode": creditTerminalResponse['CARD_ENTRY_MODE'] ? creditTerminalResponse['CARD_ENTRY_MODE'] : '',
        //     "emv_aid": creditTerminalResponse['EMV_TAG_4F'] ? creditTerminalResponse['EMV_TAG_4F'] : '',
        //     "emv_applabel": creditTerminalResponse['EMV_TAG_50'] ? creditTerminalResponse['EMV_TAG_50'] : '',
        //     "emv_tvr": creditTerminalResponse['EMV_TAG_95'] ? creditTerminalResponse['EMV_TAG_95'] : '',
        //     "emv_tsi": creditTerminalResponse['EMV_TAG_9B'] ? creditTerminalResponse['EMV_TAG_9B'] : '',
        //     "emv_iad": creditTerminalResponse['EMV_TAG_9F10'] ? creditTerminalResponse['EMV_TAG_9F10'] : '',
        //     "emv_arc": creditTerminalResponse['EMV_TAG_8A'] ? creditTerminalResponse['EMV_TAG_8A'] : '',
        //     "emv_cvm": creditTerminalResponse['EMV_TAG_9F34'] ? creditTerminalResponse['EMV_TAG_9F34'] : '',
        //     "emv_reference_number": '',
        //     "signedby": creditTerminalResponse['SIGNATUREDATA'] ? creditTerminalResponse['SIGNATUREDATA'] : '',
        //     "txpaycc_ts": globals['clientTime'],
        //     "txpayccdlt": 'N'
        //   };
        // 
        //   _result = pjs.data.add(_from, _data);
        //   _success = true;
        // }
        // catch(err) {
        //   _error = err;
        // }
        // 
      }

      // 13. Setup Receipt Variables
      // //Load packages related to generating receipt
      // 
      // var fs = require('fs');
      // let ejs = require('ejs');
      // let path = require('path')
      // 
      // let attachments = []

      // 14. Get Tx Cashier
      // var _success = false;
      // var _error = null;
      // 
      // var _record = null;
      // try {
      //   var _from = "USERS";
      //   var _filter = { 
      //     whereClause: `userskey = ?`,
      //     values: [txhdr['userskey']]
      //   };
      //   var _select = `firstname,SUBSTR(lastname,1,1) as lastname`;
      // 
      //   _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // // If no record found
      // if (!_record) {
      //   _record = {};
      //   _error = new Error("Record not found.")
      //   _success = false;
      // }
      // var txCashier = _record;

      // 15. Assign Name of Cashier
      //  //This step assigns name of cahier on REceipt
      //  
      //  txhdr["cashier"]=txCashier["firstname"]+" "+txCashier["lastname"]
      //  let taxRate = Number(Number(pjs.session["locationTaxRate"]) * 100 ).toFixed(2);
      //  txhdr["taxrate"]= (Number(taxRate).toFixed(2)) + " %"

      // 16. Set Payment Details
      // let payment = {
      //   type: 'complete',
      //   list: [
      //     {
      //       paymentMethod : paymentMethod['paymenttype'],
      //       paymentAmount : Number(paymentscreen['total']).toFixed(2), 
      //       actualPaid : Number(paymentscreen['payment_amount']).toFixed(2),
      //       returned : Number(Number(paymentscreen['payment_amount']) - Number(paymentscreen['total'])).toFixed(2)
      //     }
      //   ]
      // }
      // 
      // txhdr['payments'] = payment

      // 17. Customer Receipt
      // /*
      //   This step generates customer copy of receipt in hTML Format
      //   This also sets client side fields, so this receipt can be sent to printer for printing
      // */
      // 
      // if(cashierscreen['discount_print'] != 'DISCOUNT')
      //   txhdr['discount'] = ''
      // 
      // var templateString = fs.readFileSync(path.join(__dirname, 'templates', 'customer-receipt.ejs'), 'utf-8');
      // let html = ejs.render(templateString, {txhdr: txhdr});
      // 
      // templateString = fs.readFileSync(path.join(__dirname, 'templates', 'wash-bay-receipt.ejs'), 'utf-8');
      // let washBayHTML = ejs.render(templateString, {txhdr: txhdr})
      // 
      //   // var _data = {
      //   //   "from" : "judy.reynolds35@ethereal.email",
      //   //   "to": "test@truckmat.com",
      //   //   "subject": "Truckomat Invoice",
      //   //   "html": html,
      //   // };
      //   // var _info = pjs.sendEmail(_data);
      //   
      //   let quantity = 1
      //   if(paymentMethod['iscredcard'] == 'Y'){
      //     quantity = pjs.session['restrictions']['Receipt Print Quantity']['Credit']['quantity']
      //   }
      //   else if(pjs.session['restrictions']['Receipt Print Quantity'][paymentMethod['paymenttype']]){
      //     quantity = pjs.session['restrictions']['Receipt Print Quantity'][paymentMethod['paymenttype']]['quantity']
      //   }
      // 
      //   if(cashierscreen['receiptQty'] && cashierscreen['receiptQty'] != 0){
      //     quantity = cashierscreen['receiptQty']
      //   }
      //   paymentscreen['receiptHTML'] = JSON.stringify({html:html, quantity:quantity})
      //   paymentscreen['washBayHTML'] = washBayHTML
      //   pjs.session['reprintReceipt'] = txhdr
      //   pjs.session['reprintReceipt']['quantity'] = quantity
      // 

      // 18. Scrub Club? Issue
      // /*
      //   This step determins if Scrub Club needs to be issued. 
      //   This will consider, discount type setting for customer, 
      //   Will also see if scrub clucb coupon can be issued, based on product settings 'Issuescrubclubforthisitem'
      //   Will determine Scrub club value based on settings. 
      //   Will structure data for HTML to be generated and fill in client side fields so that the coupon can be printed. 
      // */
      // const utility = require('../common-apis/utility.js')
      // 
      // //Check if scrub coupon applies
      // let scrubClubItems = display.receipt.getRecords().filter((item)=>item["givescrubclubforthisitem"] == 'Y')
      // 
      // //add logic if scrub is applied
      // console.log(paymentscreen['discount'])
      // //If discount type is scrub and receipt includes item which is scrub applicable
      // if(
      //     cashierscreen["discountType"] == "Scrub" && 
      //     Object.keys(scrubClubItems).length !== 0 && 
      //     Object.keys(cashierscreen["scrubApply"]).length == 0 && 
      //     paymentscreen['discount'] == 0
      //   ){
      //   var JsBarcode = require('jsbarcode');
      //   const { DOMImplementation, XMLSerializer } = require('xmldom');
      //   const xmlSerializer = new XMLSerializer();
      //   const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
      //   const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      // 
      //   var _success = false;
      //   var _error = null;
      //   var companyId = paymentscreen["comp_name"];
      //   var _records = null;
      // 
      //   try {
      //     var query = "SELECT HQA_MISCCONFIG.GROUP,HQA_MISCCONFIG.SEQUENCE, HQA_MISCCONFIG.SETTING, HQA_MISCCONFIG.QUANTITY,HQA_MISCCONFIG.MEASTYPKEY,HQA_MISCCONFIG.TIMEPERIODSKEY,TIMEPERIODS.PERIOD,MEASUREMENTTYPES.TYPE " +
      //                 "FROM HQA_MISCCONFIG INNER JOIN TIMEPERIODS ON TIMEPERIODS.TIMEPERIODKEY = HQA_MISCCONFIG.TIMEPERIODSKEY " +
      //                 "INNER JOIN MEASUREMENTTYPES ON MEASUREMENTTYPES.MEASTYPKEY = HQA_MISCCONFIG.MEASTYPKEY " +
      //                 "WHERE GROUP = ?";
      //     var _records = pjs.query(query, ['Scrub Club'])
      // 
      // 
      //   var c_query = "SELECT CORPORATECUSTOMERS.COMPANYNM,CORPORATECUSTOMERS.ADDRESS,CORPORATECUSTOMERS.CITY,CORPORATECUSTOMERS.ZIP,CORPORATECUSTOMERS.PHONE,STATES.STATENAME " +
      //                   "FROM CORPORATECUSTOMERS " +
      //                   "LEFT JOIN STATES ON STATES.STATEKEY = CORPORATECUSTOMERS.STATEKEY " +
      //                   "WHERE CORPCUSTKEY = ?";
      //     var customerData = pjs.query(c_query, [companyId])
      //     _success = true;
      //   }
      //   catch (err) {
      //     _records = [];
      //     _error = err;
      //   }
      //   
      //   //Setting Values
      //   let waitPeriod = '',
      //       expirationPeriod = '',
      //       dollarValue = ''
      //   _records = _records.map((rec) => {
      //     if(rec['setting'] == 'Wait Period (Before Redeemable)'){
      //       waitPeriod = rec;
      //     }
      //     if(rec['setting'] == 'Expiration Period'){
      //       expirationPeriod = rec;
      //     }
      //     if(rec['setting'] == 'Dollar Value'){
      //       dollarValue = rec;
      //     }
      //   })
      // 
      //   //Get From Date
      //   var fromDate = new Date()
      //   if(waitPeriod["period"] == "Day"){
      //     fromDate.setDate(fromDate.getDate() + waitPeriod["quantity"])
      //   }
      //   else if(waitPeriod["period"] == "Week"){
      //     fromDate.setDate(fromDate.getDate() + (waitPeriod["quantity"]*7))
      //   }
      //   else if(waitPeriod["period"] == "Month"){
      //     fromDate.setMonth(fromDate.getMonth() + waitPeriod["quantity"])
      //   }
      //   else if(waitPeriod["period"] == "Year"){
      //       fromDate.setFullYear(fromDate.getFullYear() + waitPeriod["quantity"])
      //   }
      //   
      //   //Get To Date
      //   var toDate = new Date(fromDate.getTime())
      //   if(expirationPeriod["period"] == "Day"){
      //     toDate.setDate(toDate.getDate() + expirationPeriod["quantity"])
      //   }
      //   else if(expirationPeriod["period"] == "Week"){
      //     toDate.setDate(toDate.getDate() + (expirationPeriod["quantity"]*7))
      //   }
      //   else if(expirationPeriod["period"] == "Month"){
      //     toDate.setMonth(toDate.getMonth() + expirationPeriod["quantity"])
      //   }
      //   else if(expirationPeriod["period"] == "Year"){
      //       toDate.setFullYear(toDate.getFullYear() + expirationPeriod["quantity"])
      //   }
      //   
      //   //issued date
      //   let date = paymentscreen["current_date"];
      // 
      //   //Generate barcode
      //   JsBarcode(svgNode, invoiceNumber, {
      //       xmlDocument: document,
      //   });
      //   const svgText = xmlSerializer.serializeToString(svgNode);
      // 
      //   var scrubCoupon = {
      //     dollarValue: dollarValue["quantity"],
      //     validFrom: fromDate.toLocaleDateString('en-US'),
      //     validTo: toDate.toLocaleDateString('en-US'),
      //     invoiceNbr: invoiceNumber,
      //     barcode: svgText,
      //     issuedDate: date,
      //     truckNumber: paymentscreen["tractor_number_value"],
      //     companyName: paymentscreen["company_name_value"],
      //     address:customerData[0]["address"] ? customerData[0]["address"] : '',
      //     city:customerData[0]["city"] ? customerData[0]["city"]: '',
      //     state:customerData[0]["statename"] ? customerData[0]["statename"] : '',
      //     zip:customerData[0]["zip"] ? customerData[0]["zip"] : '',
      //     phone: customerData[0]["phone"] ? utility.formatPhoneNumber(customerData[0]["phone"]) : '',
      //     driverSignature:'',
      //     location:pjs.session["city"],
      //     cashier: txhdr['cashier']
      //   }
      // 
      //   //Insert into Scrub club tracking
      //   try{
      //     let q = "INSERT INTO SCRUBCLUBTRACKING("+
      //             "SCRUBCLUBTRACKING.ISSUEDTRANSACTIONSHEADERINVOICE, SCRUBCLUBTRACKING.ISSUEDLOCATIONKEY, SCRUBCLUBTRACKING.ISSUEDTIMESTAMP "+
      //             ", SCRUBCLUBTRACKING.ISSUEDTRK, SCRUBCLUBTRACKING.VALIDFROM, SCRUBCLUBTRACKING.VALIDTO, SCRUBCLUBTRACKING.DOLLARAMT) "+
      //             "VALUES ( ?, ?, ?, ?, ?, ?, ?)"
      //     let scrubValues =[
      //       invoiceNumber, 
      //       pjs.session["locationsKey"], 
      //       pjs.timestamp(), 
      //       paymentscreen["tractor_number_value"],
      //       scrubCoupon["validFrom"],
      //       scrubCoupon["validTo"],
      //       scrubCoupon["dollarValue"]
      // 
      //       ]
      //     pjs.query(q, scrubValues)
      //   }
      //   catch(e){
      //     //Error Occurred during insertionin scrub club tracking
      //   }
      // 
      // 
      //   //render Template
      //   var scrubTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'scrubclub-receipt.ejs'), 'utf-8');
      //   let scrubHtml = ejs.render(scrubTemplate, {scrubCoupon:scrubCoupon});
      //  
      //     // var _data = {
      //     //   "from" : "judy.reynolds35@ethereal.email",
      //     //   "to": "test@truckmat.com",
      //     //   "subject": "Truckomat Scrub Club",
      //     //   "html": scrubHtml,
      //     // };
      //     // var _info = pjs.sendEmail(_data);
      // 
      //     paymentscreen['scrubClubHTML'] = scrubHtml
      // }
      // else{
      //   //Scrub Club cannot be issued, no scrub club item in receipt
      // }

      // 19. Redeem Scrub Club
      // /*
      //   Redeems scrub club if the scrub club coupon was applied on the transaction. 
      //   This will update scrub club tracking table that the coupon has been redeemed
      // */
      // 
      // if(cashierscreen["discountType"] == "Scrub" && Object.keys(cashierscreen["scrubApply"]).length != 0){
      //   try{
      //     var query = "UPDATE SCRUBCLUBTRACKING "+
      //                 "SET SCRUBCLUBTRACKING.REDEEMEDTRANSACTIONSHEADERINVOICE = ?, SCRUBCLUBTRACKING.REDEEMEDLOCATIONKEY =? , SCRUBCLUBTRACKING.REDEEMEDTIMESTAMP = ? "+ 
      //                 "WHERE SCRUBCLUBTRACKING.SCTRACKKEY = ?"
      // 
      //     var values = [
      //       invoiceNumber,
      //       pjs.session["locationsKey"],
      //       pjs.timestamp(),
      //       cashierscreen["scrubApply"]["scrubTrackKey"]
      //     ]
      //     let result = pjs.query(query, values)
      //   }
      //   catch(e){
      //     //Error updating info for redeeming a scrub club coupon
      //   }
      // }
      // else{
      //   //Not redeemed scrub club
      // }
    },

    "Scrub Club Apply": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Apply Scrub Club
      /*
        This step checks validity of scrub club coupon and whether it can be applied to current transaction or not
        considers discount type of selected customer. 
        appropriate products are selected for redeemeing. 
        and dates validity of scrub club. 
        also checks if scrubclub coupon exists (was issued)
      */
      
      if(scrub_club["scrub_club_invoice"] == "" || scrub_club["scrub_club_invoice"] == undefined){
        //remove redeemed property if Held by this transaction
        if(cashierscreen['scrubApply']['redeemedInvoice'] != undefined){
          var query = "UPDATE SCRUBCLUBTRACKING SET SCRUBCLUBTRACKING.REDEEMEDTRANSACTIONSHEADERINVOICE = ? , SCRUBCLUBTRACKING.REDEEMEDLOCATIONKEY = ?, SCRUBCLUBTRACKING.REDEEMEDTIMESTAMP = ?  WHERE SCRUBCLUBTRACKING.REDEEMEDTRANSACTIONSHEADERINVOICE = ?";
          var _record = pjs.query(query, [null, null, null, cashierscreen['scrubApply']['redeemedInvoice']])    
        }
      
        cashierscreen["scrubApply"] = {}
        cashierscreen["couponVisible"] = true;
        cashierscreen["scrubVisible"] = true;
        cashierscreen["discount_label"] = ""
        paymentscreen["discount_label"] = ""
      
      }
      else{
        try{  
          var query = "SELECT SCRUBCLUBTRACKING.ISSUEDTRANSACTIONSHEADERINVOICE, SCRUBCLUBTRACKING.SCTRACKKEY, SCRUBCLUBTRACKING.ISSUEDLOCATIONKEY " +
                      ", SCRUBCLUBTRACKING.ISSUEDTIMESTAMP, SCRUBCLUBTRACKING.ISSUEDTRK, SCRUBCLUBTRACKING.VALIDFROM, SCRUBCLUBTRACKING.VALIDTO " +
                      ", SCRUBCLUBTRACKING.DOLLARAMT " +
                      "FROM SCRUBCLUBTRACKING "+
                      "WHERE SCRUBCLUBTRACKING.ISSUEDTRANSACTIONSHEADERINVOICE = ? "+
                      "AND SCRUBCLUBTRACKING.REDEEMEDTRANSACTIONSHEADERINVOICE IS NULL "+
                      "AND (SCRUBCLUBTRACKING.DELETE <> ? OR SCRUBCLUBTRACKING.DELETE IS NULL)" 
          var values = [
              scrub_club["scrub_club_invoice"],
              'Y'
          ]
          var scrubClub = pjs.query(query, values)
          if(Object.keys(scrubClub).length != 0){
            scrubClub = scrubClub[0]
            //Add logic if the scrub club falls with in applicable from applicable to date. 
            //change current DateTime to local date
            var currentTime = new Date()
            currentTime.setFullYear(globals['clientTime'].getFullYear(), globals['clientTime'].getMonth(), globals['clientTime'].getDate())
            currentTime.setHours(globals['clientTime'].getHours(), globals['clientTime'].getMinutes(), globals['clientTime'].getSeconds())
      
            var validFrom = new Date()
            let targetDate = scrubClub['validfrom'].toString().split('-')
            targetDate = targetDate.map((item) => Number(item))
            validFrom.setFullYear(targetDate[0],targetDate[1] - 1, targetDate[2])
            validFrom.setHours(0,0,0)
      
            var validTo = new Date(scrubClub["validto"])
            targetDate = scrubClub['validto'].toString().split('-')
            targetDate = targetDate.map((item) => Number(item))
      
            validTo.setFullYear(targetDate[0],targetDate[1] - 1, targetDate[2])
            validTo.setHours(23,59,59)
            
            if(cashierscreen["tractor_number_value"] == scrubClub["issuedtrk"]){
              if(currentTime > validFrom && currentTime < validTo){
                
                //if a scrub coupon was applied previously - make sure that the previous scrub coupon is released. 
                if(cashierscreen['scrubApply']['redeemedInvoice'] != undefined){
                  var query = "UPDATE SCRUBCLUBTRACKING SET SCRUBCLUBTRACKING.REDEEMEDTRANSACTIONSHEADERINVOICE = ? , SCRUBCLUBTRACKING.REDEEMEDLOCATIONKEY = ?, SCRUBCLUBTRACKING.REDEEMEDTIMESTAMP = ?  WHERE SCRUBCLUBTRACKING.REDEEMEDTRANSACTIONSHEADERINVOICE = ?";
                  var _record = pjs.query(query, [null, null, null, cashierscreen['scrubApply']['redeemedInvoice']])    
                }
      
                cashierscreen["scrubApply"] = {
                  tractor: scrubClub["issuedtrk"],
                  issuedInvoice: scrubClub["issuedtransactionsheaderinvoice"],
                  issuedDate : scrubClub["issuedtimestamp"],
                  issuedLocationKey: scrubClub["issuedlocationkey"],
                  scrubTrackKey: scrubClub["sctrackkey"],
                  validFrom: scrubClub["validfrom"],
                  validTo: scrubClub["validto"],
                  value: scrubClub["dollaramt"]
                }
      
                cashierscreen["couponVisible"] = false;
                cashierscreen["scrubVisible"] = true;
                cashierscreen["discount_label"] = "Scrub"
                paymentscreen["discount_label"] = "Scrub"
              }
              else{
                pjs.messageBox({
                  title: "",
                  message: "Only valid between "+validFrom.toLocaleString() + " and "+validTo.toLocaleString()
                })
                cashierscreen["scrubApply"] = {}
                scrub_club["scrub_club_invoice"] = ""
      
                cashierscreen["couponVisible"] = true;
                cashierscreen["scrubVisible"] = true;
                cashierscreen["discount_label"] = ""
                paymentscreen["discount_label"] = ""
      
                return          
              }
            }
            else{
              pjs.messageBox({
                title: "",
                message: "Cannot apply scrub club on different tractor"
              })
              cashierscreen["scrubApply"] = {}
              scrub_club["scrub_club_invoice"] = ""
      
              cashierscreen["couponVisible"] = true;
              cashierscreen["scrubVisible"] = true;
              cashierscreen["discount_label"] = ""
              paymentscreen["discount_label"] = ""
      
              return
            }
          }
          else{
            pjs.messageBox({
              title: "",
              message: "Scrub Club does not exist or has been redeemed before"
            })
            cashierscreen["scrubApply"] = {}
            scrub_club["scrub_club_invoice"] = ""
      
            cashierscreen["couponVisible"] = true;
            cashierscreen["scrubVisible"] = true;
            cashierscreen["discount_label"] = ""
            paymentscreen["discount_label"] = ""
      
            return      
          }
        }
        catch(e){
          //Error occurred in applying scrub club
         }
      }

      // 3. Update Receipt Total
      /*
        This step updates totals of receipt grid after applying scrub club coupon. 
        based on relevant amount
      */
      var nontaxable = 0;
      display.receipt.forEach(function(record) {
        if (record.taxable == 'N'){
          nontaxable += Number(record["rprice"]);
        }
      });
      cashierscreen["nontaxable"] = nontaxable;
      
      let surcharge = 0 , 
          discount = 0, 
          subtotal = cashierscreen["rsubtotal"], 
          tax = 0,
          actualTotal = 0,
          total = 0 
      
      //Calculate total of Full prices of line items.
      actualTotal = display.receipt.reduce((total, record) => {
        var num = Number(record["actualPrice"]);
        if (isNaN(num)) num = 0;
        return total + num;
        }, 0);
      
      
      //Apply Surcharges
      if(pjs.session["locationSurchargeDiscount"] == "S"){
        surcharge += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"]))
      }
      
      //Determine Taxation
      if(cashierscreen["customerTaxExempt"] == 'Y'){
          tax = 0
        // cashierscreen["tax"] = 0
      }
      else if(pjs.session["locationTaxRate"])
      {
        tax = Number(pjs.session["locationTaxRate"]) * (Number(cashierscreen["rsubtotal"]) - Number(cashierscreen["nontaxable"]));
      }
      
      //Apply Discounts
      if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
        discount += actualTotal - Number(subtotal);
      }
      else if(cashierscreen["discountType"] == "Scrub" && Object.keys(cashierscreen["scrubApply"]).length !== 0){
        discount += Number(cashierscreen["scrubApply"]["value"])
      }
      if(pjs.session["locationSurchargeDiscount"] == "D"){
        discount += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"])) 
      }
      
      //Calculate Totals
      let taxedTotal = Math.abs(subtotal) + Math.abs(tax)
      total = (Math.abs(taxedTotal) - Math.abs(discount) ) + surcharge
      
      paymentscreen["rsubtotal"] = cashierscreen["rsubtotal"] = subtotal
      paymentscreen["discount"] = cashierscreen["discount"] = (Math.abs(discount))*(-1)
      paymentscreen["tax"] = cashierscreen["tax"] = tax
      paymentscreen["payment_amount"] = paymentscreen["total"] = cashierscreen["total"] = Math.abs(total)

      // 4. TX loaded from DB?
      if (cashierscreen['flag_tx_loaded_from_db'] && cashierscreen['flag_tx_loaded_from_db'] != '0') {

        // 5. Update TXHeader
        /*
          case scenario: Transaction exists and we are trying to resave
          This step updates Transactions summary in transactions header table. 
        */
        var updatedReceipt = display.receipt.getRecords();
        
        try{
        var values = [
                        globals['clientTime'],
                        cashierscreen["rsubtotal"],
                        cashierscreen["total"],
                        cashierscreen["tax"],
                        cashierscreen["customer_notes"],               
                      ];
        
          var columns ="";
          if(cashierscreen["po_required"]){
            columns += ", PONUMBER = ?"
             
            values.push(required_fields["ponum"])
          }
          if(cashierscreen["tripNumber_required"]){
            columns += ", TRIPNUMBER = ?"
            
            values.push(required_fields["tripnum"])
          }
          if(cashierscreen["driverId_required"]){
            columns += ", DRIVERID = ?"
           
            values.push(required_fields["drvid"])
          }
          values.push(cashierscreen["flag_tx_loaded_from_db_id"])
          
          var query = "UPDATE TRANSACTIONSHEADER SET LOCALTS1 = ?, ORDERTOTAL$=? ,  DISCOUNTEDTOTAL$=?, TAXTOTAL$=?, CASHIERMESSAGE=?" +columns+ " WHERE TXHDRKEY = ?" ;
          var _records = pjs.query(query, values)
          var txHdr = {
            "corporatecustomerskey" : cashierscreen["comp_name"]
          }
          if((cashierscreen["tractor_number"] == '' || cashierscreen['trailer_number'] == '') && cashierscreen['TractorTrailerRequired'])
            txHdr["tractornbr"] = cashierscreen["tractor_number"];
          if(cashierscreen["trailer_number"] != '')
            txHdr["trailernbr"] = cashierscreen["trailer_number"];
        
          if(cashierscreen["tractor_number"] != '' && cashierscreen["trailer_number"] != '')
          {
            var query = "SELECT DRIVERSKEY FROM DRIVERS WHERE CORPCUSTKEY = ? AND CORPTRUCKKEY = ? AND CORPTRAILERKEY = ?"
            var driverkey = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["tractor_number"], cashierscreen["trailer_number"]]);
            if(driverkey != [] && Object.keys(driverkey).length != 0){
              txHdr["driverskey"] = driverkey["driverskey"];
            }   
          }
         
        }
        catch (err){
          //error occurred
        }
        

        // 6. Refresh Today's Transactions
        logic["Refresh Today's Transaction"]();
      }

      // 7. Show previous screen
      let previousScreen = screenHistory[screenHistory.length - 2];
      if (previousScreen) {
        activeScreen = screens[previousScreen];
        screenHistory.pop();
      }
      return;
    },

    "Save Driver ShiftSales": function() {
      // 1. Validation
      
      /*
      
        ------------DEPRECATED UNTIL REQUIRED
        DIVER CANNOT BE SAVED ON CASHIER SCREEN. COMPANY NAME IS REQUIRED TO BE ASSOCIATED WHICH IS NOT PRESENT HERE
      */
      if(cashierscreen_shiftsales["drvfname"] == "" || cashierscreen_shiftsales["drvfname"] == undefined){
        pjs.messageBox({
          title: "Driver Info",
          message: "Driver Firstname cannot be empty"
        })
        return
      }
      if(cashierscreen_shiftsales["drvlname"] == "" || cashierscreen_shiftsales['drvlname'] == undefined){
        pjs.messageBox({
          title: "Driver Info",
          message: "Driver Lastname cannot be empty"
        })
        return
      }
      if(cashierscreen_shiftsales["drvphone"] == ""){
      
      }
      if(cashierscreen_shiftsales["drveaddress"] == ""){
      
      }

      // 2. Save/Update
      if(cashierscreen_shiftsales["driverInfoKey"] != "" && typeof cashierscreen_shiftsales["driverInfoKey"] != 'undefined'){
        
        //update
        try{
          var query = "UPDATE DRIVERS SET firstname = ?, lastname = ?, phonenbr = ?, emailaddress = ? WHERE driverskey = ?";
          var values = [
                          cashierscreen_shiftsales["drvfname"], 
                          cashierscreen_shiftsales["drvlname"], 
                        ]
      
          if(cashierscreen_shiftsales["drvphone"] == "")
            values.push("0000000000")
          else 
            values.push(cashierscreen_shiftsales["drvphone"])
      
          if(cashierscreen_shiftsales["drveaddress"] == "")
            values.push("rejected")
          else 
            values.push(cashierscreen_shiftsales["drveaddress"])
      
          values.push(cashierscreen_shiftsales["driverInfoKey"])
          var _result = pjs.query(query, values)
          pjs.messageBox({
            title: "Driver Updated",
            message: "Driver Info has been updated successfully."
          })
        }
        catch(e){
          pjs.messageBox({
            title: "Error",
            message: "Error occurred while updating info."
          })
        }
      }
      else{ 
        try{
          //Insert/Associate new
          var columns = " firstname, lastname, phonenbr, emailaddress"
          var options = "?,?,?,?"
          var values = [
                          cashierscreen_shiftsales["drvfname"], 
                          cashierscreen_shiftsales["drvlname"], 
                        ]
      
          if(cashierscreen_shiftsales["drvphone"] == "")
            values.push("0000000000")
          else 
            values.push(cashierscreen_shiftsales["drvphone"])
          if(cashierscreen["drveaddress"] == "")
            values.push("rejected")
          else 
            values.push(cashierscreen_shiftsales["drveaddress"])
      
          var query = "SELECT driverskey FROM NEW TABLE "+
                      "(INSERT INTO DRIVERS("+columns+") "+
                      "VALUES("+options+"))"
          _result = pjs.query(query, values) 
          //Driver inserted        
          cashierscreen_shiftsales["driverInfoKey"] = _result[0]["driverskey"]
      
          pjs.messageBox({
            title: "Driver Saved",
            message: "Driver has been saved successfully"
          })
        }
        catch (e){
          //Error occured while saving new driver
        }
      }
    },

    "Save Driver from Company": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Validation
      /*
        ----DEPRECATED UNTIL REQUIRED
        HIGHLY UNLIKELY AS SOON AS YOU WILL SELECT COMPANY YOU WILL BE ROUTED TO CASHIERSCREEN
        MOST LIKELY WILL NEVER BE ABLE TO SAVE DRIVER ON COMPANIES SCREEN
      */
      if(companies["comp_name"] == "" || companies["comp_name"] == undefined){
        pjs.messageBox({
          title: "Driver Info",
          message: "Enter Customer Name"
        })
        return
      }
      
      if(companies["tractor_number"] == "" || companies["tractor_number"] == undefined){
        pjs.messageBox({
          title: "Driver Info",
          message: "Tractor Number is required to be validated first for this customer"
        })
        return
      }
      
      if(companies["trailer_number"] == "" ||companies["trailer_number"] == undefined){
        pjs.messageBox({
          title: "Driver Info",
          message: "Trailer Number is required to be validated first for this customer"
        })
        return
      }
      
      if(companies["drvfname"] == "" || companies["drvfname"] == undefined){
        pjs.messageBox({
          title: "Driver Info",
          message: "Driver Firstname cannot be empty"
        })
        return
      }
      if(companies["drvlname"] == "" || companies['drvlname'] == undefined){
        pjs.messageBox({
          title: "Driver Info",
          message: "Driver Lastname cannot be empty"
        })
        return
      }
      if(companies["drvphone"] == ""){
      
      }
      if(companies["drveaddress"] == ""){
      
      }

      // 3. Save/Update
      if(companies["driverInfoKey"] != "" && typeof companies["driverInfoKey"] != "undefined"){
        //update
        try{
          var query = "UPDATE DRIVERS SET firstname = ?, lastname = ?, phonenbr = ?, emailaddress = ? WHERE driverskey = ?";
          var values = [
                          companies["drvfname"], 
                          companies["drvlname"], 
                        ]
      
          if(companies["drvphone"] == "")
            values.push("0000000000")
          else 
            values.push(companies["drvphone"])
      
          if(companies["drveaddress"] == "")
            values.push("rejected")
          else 
            values.push(companies["drveaddress"])
      
          values.push(companies["driverInfoKey"])
          var _result = pjs.query(query, values)
          pjs.messageBox({
            title: "Driver Updated",
            message: "Driver Info has been updated successfully."
          })
        }
        catch(e){
          pjs.messageBox({
            title: "Error",
            message: "Error occurred while updating info."
          })
        }
      }
      else{ 
        try{
          //Insert/Associate new
          var columns = "corpcustkey, firstname, lastname, phonenbr, emailaddress"
          var options = "?,?,?,?,?"
          var values = [
                          companies["comp_name"], 
                          companies["drvfname"], 
                          companies["drvlname"], 
                        ]
      
          if(companies["drvphone"] == "")
            values.push("0000000000")
          else 
            values.push(companies["drvphone"])
          if(companies["drveaddress"] == "")
            values.push("rejected")
          else 
            values.push(companies["drveaddress"])
          if(companies["tractor_number"] != ""){
            columns += ", corptruckkey"
            options += ", ?"
            values.push(companies["tractor_number"])
          }  
          if(companies["trailer_number"] != ""){
            columns += ", corptrailerkey"
            options += ", ?"
            values.push(companies["trailer_number"])
          }  
      
          var query = "SELECT driverskey FROM NEW TABLE "+
                      "(INSERT INTO DRIVERS("+columns+") "+
                      "VALUES("+options+"))"
          _result = pjs.query(query, values) 
          companies["driverInfoKey"] = _result[0]["driverskey"]
          
          pjs.messageBox({
            title: "Driver Saved",
            message: "Driver has been saved successfully"
          })
        }
        catch (e){
          //Error occured while saving new driver
        }
      }
    },

    "clear tx button click": function() {
      // Call Clear routine
      logic["Cashier Clear Click"]();
    },

    "print failed clear tx button click": function() {
      // 1. Display error
      pjs.messageBox({
        title: ``,
        message: `Print Failed : ${paymentscreen["printerErrorMessage"]}`,
        icon: "info"
      });

      // 2. Call CLEAR routine
      logic["clear tx button click"]();
    },

    "credit to card button click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Validation
      
      /*
        This step will validate that all fields are present before performing void transaction operation. 
      */
      if(void_transaction["void_reason"] == "" || void_transaction['void_reason'] == undefined){
        return
      }
      if(void_transaction["void_reason"] == 5 && void_transaction["otherDescription"] == ""){
        return
      }

      // 3. is not 'void'
      if (void_transaction['voidReasonDisabled'] == false) {

        // 4. Void TX
        var parms = {};
        parms["void_reason"] = void_transaction['void_reason'];
        parms["txhdrkey"] = void_transaction['void_reason'];
        parms["usersKey"] = pjs.session['usersKey'];
        parms["otherDescription"] = void_transaction['void_reason'];
        parms["invoiceNumber"] = void_transaction['void_reason'];
        parms["clientTime"] = globals['clientTime'];
        
        var _success = false;
        var _error = null;   
        var _results = null;
        
        try {
          var pjsModule = pjs.require("VoidTransaction.module.json");
          _results = pjsModule["Void Transaction"](parms);
          _success = true;
        }
        catch (err) {
          _error = err;
          console.error(err);
        }

        // 5. Void TX
        // /*
        //   This step will execute if the transaction does not already have void status. 
        //   Transaction can have a void status and still refund operation can be performed. 
        // */
        // var _success = false
        // try{
        //   var query = "INSERT INTO TRANSACTIONSPECIALS "+
        //               "(WHAT, REASONCODESKEY, TRANSACTIONHEADERKEY, USERSKEY, OTHERDESC) " +
        //               "VALUES(?, ?, ?, ?, ?);"
        //   var values = [
        //                 "Void", 
        //                 void_transaction["void_reason"], 
        //                 void_transaction["txhdrkey"], 
        //                 (pjs.session["usersKey"] ), 
        //                 void_transaction["otherDescription"]
        //                 ]
        // 
        //   var _record = pjs.query(query, values)
        // 
        //   _success = _record != null
        //   query = "UPDATE TRANSACTIONSHEADER SET status = ? , localts1 = ? WHERE TXHDRKEY = ?";
        //   values = ["Void", globals['clientTime'], void_transaction["txhdrkey"]]
        //   _record = pjs.query(query, values)
        //   _success =  _record != null
        //   
        //   //reflect changes to scrub club coupons
        //   if(void_transaction['status'] == 'Sale'){
        //     query = "UPDATE SCRUBCLUBTRACKING SET SCRUBCLUBTRACKING.DELETE = ? WHERE SCRUBCLUBTRACKING.ISSUEDTRANSACTIONSHEADERINVOICE = ?";
        //     _record = pjs.query(query, ['Y', void_transaction['invoiceNumber']])
        //   }
        //   else if(void_transaction['status'] == 'Open'){
        //     query = "UPDATE SCRUBCLUBTRACKING SET SCRUBCLUBTRACKING.REDEEMEDTRANSACTIONSHEADERINVOICE = ? , SCRUBCLUBTRACKING.REDEEMEDLOCATIONKEY = ?, SCRUBCLUBTRACKING.REDEEMEDTIMESTAMP = ?  WHERE SCRUBCLUBTRACKING.REDEEMEDTRANSACTIONSHEADERINVOICE = ?";
        //     _record = pjs.query(query, [null, null, null, void_transaction['invoiceNumber']])    
        //   }
        // }
        // catch (e){
        //   //error occurred while voiding transaction
        //   console.log('Error Voiding', e)
        //   _success = false
        // }
      }

      // 6. Refresh Today's Transactions
      logic["Refresh Today's Transaction"]();

      // 7. Generate Refund Receipt
      var parms = {};
      parms["txhdrkey"] = void_transaction['txhdrkey'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GenerateCustomerAndWashBayReceipt.module.json");
        _results = pjsModule["Refund Receipt"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      void_transaction['refundingActive'] = _results ? _results["refundingActive"] : null;
      void_transcation['void_closed'] = _results ? _results["void_closed"] : null;
      void_transaction['refundReceipt'] = _results ? _results["refundReceipt"] : null;

      // 8. Fetch Transaction
      // /*
      //   This step will fetch all details related to transaction and structure it for printing void receipt
      // */
      // const utility = require('../common-apis/utility.js')
      // 
      // try{
      //   var query = "SELECT VARCHAR_FORMAT(TRANSACTIONSHEADER.LOCALTS1, 'MM/DD/YYYY') as localts1, TRANSACTIONSHEADER.INVOICENBR as invoiceNumber, TRANSACTIONSHEADER.DISCOUNTEDTOTAL$, " +
      //               "DRIVERS.FIRSTNAME, DRIVERS.LASTNAME, CORPORATECUSTOMERS.COMPANYNM, CORPORATECUSTOMERS.ACCOUNTNBR, TOMLCTNS.LOCATION, TOMLCTNS.PHONENBR " +
      //               "FROM TRANSACTIONSHEADER " +
      //               "LEFT JOIN DRIVERS ON DRIVERS.DRIVERSKEY = TRANSACTIONSHEADER.DRIVERSKEY "+
      //               "INNER JOIN TOMLCTNS ON TRANSACTIONSHEADER.LOCATIONSKEY = TOMLCTNS.LOCATIONKEY " +
      //               "INNER JOIN CORPORATECUSTOMERS ON TRANSACTIONSHEADER.CORPORATECUSTOMERSKEY = CORPORATECUSTOMERS.CORPCUSTKEY " +
      //               "WHERE TRANSACTIONSHEADER.TXHDRKEY = ?;"
      // 
      //   var txhdr = pjs.query(query, [void_transaction['txhdrkey']])
      // 
      //   txhdr = txhdr[0]
      //   txhdr["subtotal"] = Number(txhdr["ordertotal$"]).toFixed(2)
      //   txhdr["discount"] = Number((Number(txhdr["discountedtotal$"]) -Number(txhdr["taxtotal$"])) - Number(txhdr["ordertotal$"])).toFixed(2)
      //   txhdr["tax"] = Number(txhdr["taxtotal$"]).toFixed(2)
      //   txhdr["total"] = Number(txhdr["discountedtotal$"]).toFixed(2)
      //   txhdr["phonenbr"] = utility.formatPhoneNumber(txhdr["phonenbr"])
      //   txhdr['driver'] = txhdr['firstname'] +' '+ txhdr['lastname']
      //   txhdr['invoiceNumber'] = txhdr['invoicenumber']
      // }
      // catch(e){
      //   //Error Ocurred generating Receipt
      // }
      // 
      // 

      // 9. Get Tx Cashier
      // var _success = false;
      // var _error = null;
      // 
      // var _record = null;
      // try {
      //   var _from = "USERS";
      //   var _filter = { 
      //     whereClause: `userskey = ?`,
      //     values: [ pjs.session["usersKey"]]
      //   };
      //   var _select = `firstname,lastname`;
      // 
      //   _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // // If no record found
      // if (!_record) {
      //   _record = {};
      //   _error = new Error("Record not found.")
      //   _success = false;
      // }
      // var txCashier = _record;

      // 10. Assign Cashier Name to Receipt
      //  txhdr["cashier"]=txCashier["firstname"]+" "+txCashier["lastname"]

      // 11. Enable Refunds & Refund Receipt
      // /*
      //   this step triggers the refund process. 
      //   This step also generates a refund receipt from html template. Which will be later printed after refunds are complete
      // */
      // void_transaction['refundingActive'] = 'Active'
      // void_transaction['void_closed'] = false
      // 
      // var fs = require('fs');
      // let ejs = require('ejs');
      // let path = require('path')
      //   
      // var templateString = fs.readFileSync(path.join(__dirname, 'templates', 'refund.ejs'), 'utf-8');
      // let html = ejs.render(templateString, {receipt: txhdr});
      // 
      // void_transaction['refundReceipt'] = html
    },

    "update credit card refund": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Credit Card Terminal Response
      //This step will parse credit card terminal response after a successful refund to credit card has been done. 
      let refund = JSON.parse(void_transaction['creditCardTerminalResponse'])
      var data = {
        "txhdrkey": void_transaction['txhdrkey'],             //integer
        "txpaykey": void_transaction['txpaykey'],
        "acct_num": refund['ACCT_NUM'] ? refund['ACCT_NUM'] : '',
        "appv_amt": refund['APPROVED_AMOUNT'] ? refund['APPROVED_AMOUNT'] : '', //decimal
        "authnwid": refund['AUTHNWID'] ? refund['AUTHNWID'] : '',   //integer
        "authnwnm": refund['AUTHNWNAME'] ? refund['AUTHNWNAME'] : '',
        "auth_code": refund['AUTH_CODE'] ? refund['AUTH_CODE'] : '',
        "bnk_usrdta": refund['BANK_USERDATA'] ? refund['BANK_USERDATA'] : '',
        "b_trace_id": refund['BATCH_TRACE_ID'] ? refund['BATCH_TRACE_ID'] : '',
        "card_abbrv": refund['CARD_ABBRV'] ? refund['CARD_ABBRV'] : '',
        "c_entry_md": refund['CARD_ENTRY_MODE'] ? refund['CARD_ENTRY_MODE'] : '',
        "c_exp_mnth": refund['CARD_EXP_MONTH'] ? refund['CARD_EXP_MONTH'] : '',
        "c_exp_yr": refund['CARD_EXP_YEAR'] ? refund['CARD_EXP_YEAR'] : '',
        "cardholder": refund['CARDHOLDER'] ? refund['CARDHOLDER'] : '',
        "ctroutd": refund['CTROUTD'] ? refund['CTROUTD'] : '', //integer
        "invoice": refund['INVOICE'] ? refund['INVOICE'] : '', //integer
        "i_seq_num": refund['INTRN_SEQ_NUM'] ? refund['INTRN_SEQ_NUM'] : '', //integer
        "merchid": refund['MERCHID'] ? refund['MERCHID'] : '',    //integer
        "pay_media": refund['PAYMENT_MEDIA'] ? refund['PAYMENT_MEDIA'] : '',
        "pay_type": refund['PAYMENT_TYPE'] ? refund['PAYMENT_TYPE'] : '',
        "reference": refund['REFERENCE'] ? refund['REFERENCE'] : '',
        "resp_code": refund['RESPONSE_CODE'] ? refund['RESPONSE_CODE'] : '',
        "resp_text": refund['RESPONSE_TEXT'] ? refund['RESPONSE_TEXT'] : '',
        "result": refund['RESULT'] ? refund['RESULT'] : '',
        "result_cd": refund['RESULT_CODE'] ? refund['RESULT_CODE'] : '', //integer
        "termid": refund['TERMID'] ? refund['TERMID'] : '',
        "term_stat": refund['TERMINATION_STATUS'] ? refund['TERMINATION_STATUS'] : '',
        "trace_cd": refund['TRACE_CODE'] ? refund['TRACE_CODE'] : '', //integer
        "train_md": refund['TRAINING_MODE'] ? refund['TRAINING_MODE'] : '',
        "trans_amt": refund['TRANS_AMOUNT'] ? refund['TRANS_AMOUNT'] : '',  //decimal
        "trans_tm": refund['TRANS_TIME'] ? refund['TRANS_TIME'] : '',
        "troutd": refund['TROUTD'] ? refund['TROUTD'] : '',       //integer
        "vsp_code": refund['VSP_CODE'] ? refund['VSP_CODE'] : '',   //integer
        "vsp_resdsc": refund['VSP_RESULTDESC'] ? refund['VSP_RESULTDESC'] : '',
        "vsp_trxid": refund['VSP_TRXID'] ? refund['VSP_TRXID'] : '',
        "counter": refund['COUNTER'] ? refund['COUNTER'] : '', //integer
        "refunddlt": 'N',
        "lsttouchby": pjs.session['usersKey']
      };

      // 3. Insert Refund
      var _success = false;
      var _error = null;
      
      var _result = null;
      try {
        var _from = "REFUNDS";
        var _data = data;
      
        _result = pjs.data.add(_from, _data);
        _success = true;
      }
      catch(err) {
        _error = err;
        console.error(err);
      }
      
      var refundInsertStatus = { success: _success };
      if (_result && _result["affectedRows"] !== undefined)
        refundInsertStatus["affectedRows"] = _result["affectedRows"];
      
      if (_result && _result["insertId"])
        refundInsertStatus["insertId"] = _result["insertId"];
      
      if (_error && (_error["sqlMessage"] !== undefined || _error["message"] !== undefined))
        refundInsertStatus["message"] = _error["sqlMessage"] || _error["message"];
      
      if (_error && _error["sqlcode"] !== undefined)
        refundInsertStatus["sqlcode"] = _error["sqlcode"];
      

      // 4. Success?
      if (typeof _success !== "undefined" && _success) {

        // 5. Show message box
        pjs.messageBox({
          title: ``,
          message: `Transaction Void and Refund Successful`
        });

        // 6. Show previous screen
        let previousScreen = screenHistory[screenHistory.length - 2];
        if (previousScreen) {
          activeScreen = screens[previousScreen];
          screenHistory.pop();
        }
        return;
      }

      // 7. Otherwise
      else {

        // 8. Show Error
        pjs.messageBox({
          title: ``,
          message: `Error inserting Refund into the database: ${refundInsertStatus["message"]}`
        });
      }
    },

    "Show Previous Screen": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Show previous screen
      let previousScreen = screenHistory[screenHistory.length - 2];
      if (previousScreen) {
        activeScreen = screens[previousScreen];
        screenHistory.pop();
      }
      return;
    },

    "add custom item to grid": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Validation
      /*
        Validate that the custom item is having all fields such as pricing and description, gl code etc
      */
      let missing = false
      let message = 'Please Enter: '
      if(!edit_paidout["item_type"]){
        missing = true
        message += 'Item Type, '
      }
      if(!edit_paidout["item_type"]){
        missing = true
        message += 'Item Type, '  
      }
      if(!edit_paidout["gl_code"]){
        missing = true
        message += 'GL Code, '
      }
      if(!edit_paidout["price"]){
        missing = true
        message += 'price, '  
      }
      
      if(missing){
        pjs.messageBox({
          title:'',
          message: message
        })
        return;
      }
      

      // 3. Get record Item type
      var _success = false;
      var _error = null;
      
      var _record = null;
      try {
        var _from = "GLCODEXREF";
        var _filter = { 
          whereClause: `glxrefkey = ?`,
          values: [edit_paidout['item_type']]
        };
        var _select = `glcodedesc`;
      
        _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      // If no record found
      if (!_record) {
        _record = {};
        _error = new Error("Record not found.")
        _success = false;
      }
      var itemType = _record;

      // 4. Get GL Code
      var _success = false;
      var _error = null;
      
      var _record = null;
      try {
        var _from = "GLCODEXREF";
        var _filter = { 
          whereClause: `glxrefkey= ?`,
          values: [edit_paidout["gl_code"]]
        };
        var _select = `glcodedesc,glxrefkey`;
      
        _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      // If no record found
      if (!_record) {
        _record = {};
        _error = new Error("Record not found.")
        _success = false;
      }
      var subGl = _record;

      // 5. Setup Grid Record
      
      //This step adds custom item to custom item grid _ but to send it to database user must click save button before closing screen
      let newCustom = {
        canEdit: 'Y',
        canRemove: 'Y',
        loadedFromDB : 'N',
        editVisible: true,
        removeVisible: true, 
        item_type: edit_paidout["item_type"],
        item_name: itemType['glcodedesc'], 
        gl_code: edit_paidout["gl_code"],
        gl_code_name: subGl['glcodedesc'],
        gl_code_key: subGl['glxrefkey'],
        extended_description: edit_paidout['extended_description'],
        price:Number(edit_paidout['price']).toFixed(2)
      }
      
      newCustom.price = newCustom.item_name == 'Pay-Out' ? ((-1) * newCustom.price) : newCustom.price

      // 6. Add grid record
      display.paidout_grid.unshift(newCustom);

      // 7. Calculate grid total
      //This step calculates the grid total. 
      //considers negative amounts in register. 
      edit_paidout["total"] = display.paidout_grid.reduce((total, record) => {
        var num = Number(record["price"]);
        if (isNaN(num)) num = 0;
        total = Number(total)
        return Number(total + num).toFixed(2);
      }, 0);

      // 8. Reset Fields
      edit_paidout["price"] = ''
      edit_paidout["item_type"] = ''
      edit_paidout["gl_code"] = ''
      edit_paidout["extended_description"] = ''
      edit_paidout['saveButtonVisible'] = true
    },

    "remove item from custom grid": function() {
      // 1. Remove grid records
      display.paidout_grid.applyFilter(gridRecord => {
        if ((gridRecord["item_type"] == activeGridRecord["item_type"]) && (gridRecord["gl_code"] == activeGridRecord["gl_code"]) && (gridRecord["extended_description"] == activeGridRecord["extended_description"]) && (gridRecord["price"] == activeGridRecord["price"])) return false;
        else return true;
      });

      // 2. Calculate grid total
      edit_paidout["total"] = display.paidout_grid.reduce((total, record) => {
        var num = Number(record["price"]);
        if(record['item_name'] == 'Pay-Out')
          num = num * -1
        if (isNaN(num)) num = 0;
        return total + num;
      }, 0);
    },

    "save custom items": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Generate Custom Item Receipt
      
      /*
        This step generates receipt template for printing out custom items receipt. 
        This is just string based formatting, based on fixed width of 40 Characters. 
        
      */
      let records = display.paidout_grid.getRecords()
      
      //receipt utility function
      function getPrintLine(lineObj){
        let printLine = []
        if(lineObj.align == 'center'){
          var lines = lineObj.str1.match(new RegExp('.{1,'+lineObj.lineWidth+'}','g'))
          for(let i = 0; i<lines.length; i++){
            var padLeft = (lineObj.lineWidth - lines[i].length)/2
            lines[i] = lines[i].padStart(lines[i].length+padLeft, ' ')
            lines[i] = lines[i].padEnd(lineObj.lineWidth, ' ')
            printLine.push(lines[i])
          }
      
        }
        else if(lineObj.align == 'left'){
          var lines = lineObj.str1.match(new RegExp('.{1,'+lineObj.lineWidth+'}','g'))
          for(let j = 0; j<lines.length; j++){
            lines[j] = lines[j].padEnd(lineObj.lineWidth, ' ')
            printLine.push(lines[j])
          }
        }
        else if(lineObj.align == 'right'){
          var lines = lineObj.str1.match(new RegExp('.{1,'+lineObj.lineWidth+'}','g'))
          for(let k = 0; k< lines.length; k++){
            lines[k] = lines[k].padStart(lineObj.lineWidth, ' ')
            printLine.push(lines[k])
          }
        }
        else if(lineObj.align == 'leftright'){
            let leftHalf = lineObj.lineWidth * 0.6
            leftHalf = parseInt(leftHalf)
            let rightHalf = lineObj.lineWidth - leftHalf
            var lines = lineObj.str1.match(new RegExp('.{1,'+leftHalf+'}','g'))
            var lines2 = lineObj.str2.match(new RegExp('.{1,'+rightHalf+'}','g'))
            for(let l = 0; l < lines.length; l++){    
                lines[l] = lines[l].padEnd(leftHalf, ' ')
                if(!lines2[l]) lines2.push(' ')
                lines2[l] = lines2[l].padStart(rightHalf, ' ')
                printLine.push(lines[l] + lines2[l])
            }
        }
        return printLine
      }
        
      
      //filter records loaded from db
      records = records.filter((rec) => {
        return rec['loadedFromDB'] != 'Y'
      })
      
      let newCustoms = records.map((rec) => {
        return {
          locationskey: pjs.session['locationsKey'],
          userskey: pjs.session['usersKey'],
          extdesc:rec['extended_description'],
          amount:Math.abs(rec['price']),
          glcodekey:rec['gl_code_key'],
          created: globals['clientTime'],
          prefix: rec['item_name'],
          category: rec['item_name']
        }
      })
      
      let date = (globals['clientTime'].getMonth()+1) + "/" +globals['clientTime'].getDate() + '/' + globals['clientTime'].getFullYear()
      //Generate Receipts
      let printReceipts = records.map((rec) => {
        let lineWidth = 46
        return [
          ...getPrintLine({str1:rec['item_name'].toUpperCase() + ' SLIP', str2: '',  lineWidth:lineWidth, align:'center'}),
          ...getPrintLine({str1:'Cashier', str2: pjs.session['usersKey'].toString(),  lineWidth:lineWidth, align:'leftright'}),
          ...getPrintLine({str1:'Date/Time', str2: date.toString(),  lineWidth:lineWidth, align:'leftright'}),
          ...getPrintLine({str1:'Item Category', str2: rec['item_name'].toString(),  lineWidth:lineWidth, align:'leftright'}),
          ...getPrintLine({str1:'Item Description', str2: rec['gl_code_name'].toString(),  lineWidth:lineWidth, align:'leftright'}),
          ...getPrintLine({str1:'Item Price', str2: '$' + Number(rec['price']).toFixed(2),  lineWidth:lineWidth, align:'leftright'}),
        ]
      })
      
      edit_paidout["customReceipts"] = JSON.stringify(printReceipts)
      
      

      // 3. Insert into Other Pay 
      var _success = false;
      var _error = null;
      var _result = null;
      
      try {
        var _data = newCustoms;
        var _driver = pjs.getDB().connection.driver;
        var _setClause = "SET ?";             // default for "IBMi" and "mysql"
        if (_driver === "mssql" || _driver === "oracledb")
          _setClause = "VALUES()";
      
        _result = pjs.query("INSERT INTO OTHERPAY " + _setClause, _data, null, null, 20);
        if (_driver !== "IBMi" || _result.sqlcode >= 0) 
          _success = true;
        else { // if throwIBMiDbException === false, then exception is NOT thrown. Capture any error here.
          _error = {};
          _error["sqlcode"] = _result["sqlcode"];
          if (_result["sqlMessage"] !== undefined || _result["message"] !== undefined)
            _error["message"] = _result["sqlMessage"] || _result["message"];
        }
      }
      catch(err) {
        _error = err;
        console.error(err);
      }
      

      // 4. Disable button
      edit_paidout['saveButtonVisible'] = false
    },

    "Custom button": function() {
      // 1. If not disabled
      if (cashierscreen["custom_disabled"] == false) {

        // 2. Client Time
        logic["Apply Client Time"]();

        // 3. Get Custom Item
        var _success = false;
        var _error = null;
        
        var _records = null;
        try {
          var _from = "OTHERPAY INNER JOIN GLCODEXREF ON OTHERPAY.GLCODEKEY = GLCODEXREF.GLXREFKEY";
          var _filter = { 
            whereClause: `created BETWEEN ? and ? AND locationskey = ?`,
            values: [pjs.session['ts_begin'], globals['clientTime'], pjs.session['locationsKey']]
          };
          var _limit = ``;
          var _skip = ``;
          var _orderby = ``;
          var _select = `otherkey,category,extdesc,amount,glcodekey,GLCODEXREF.glcodedesc`;
        
          _records = pjs.data.get(_from, _filter, _limit, _skip, _orderby, _select);
          _success = true;
        }
        catch (err) {
          _records = [];
          _error = err;
          console.error(err);
        }
        var otherPayRecords = _records;

        // 4. Assign Records to grid
        //This step loads custom item records for current session. 
        
        otherPayRecords = otherPayRecords.map((rec) => {
          let obj = {
            canEdit: 'Y',
            canRemove: 'Y',
            editVisible: true,
            removeVisibile: true,
            loadedFromDB: 'Y',
            item_type:rec['otherkey'],
            item_name: rec['category'],
            gl_code: rec['glcodekey'],
            gl_code_name: rec['glcodedesc'],
            extended_description: rec['extdesc'] ,
            price: rec['category'] =='Pay-Out' ? (-1) * Number(rec['amount']) : rec['amount'],
          }
          if(pjs.session['userType'] == 'Cashier' )
          {
            obj.canEdit = 'N'
            obj.canRemove = 'N'
            obj.editVisible = false
            obj.removeVisibile = false
          }
          return obj
        }) 
        display.paidout_grid.replaceRecords(otherPayRecords)

        // 5. Calculate grid total
        edit_paidout["total"] = display.paidout_grid.reduce((total, record) => {
          var num = Number(record["price"]);
          if (isNaN(num)) num = 0;
          total = Number(total)
          return Number(total + num).toFixed(2);
        }, 0);

        // 6. Show Custom screen
        Object.assign(edit_paidout, {
          "saveButtonVisible": false
        });
        screenHistory.push("edit_paidout");
        activeScreen = screens["edit_paidout"];
        return;
      }
    },

    "insert payment button click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. validation
      //This Block take cares of inserting individual payments if the payment mode is split payments
      
      if(paymentscreen['splitPaymentAmount'] == '')
      {
        pjs.messageBox({
          title: 'Amount Empty',
          message: 'Please enter amount for next split'
        })
        return
      }

      // 3. Insert Payment
      var parms = {};
      parms["payment_method"] = paymentscreen['splitPaymentType'];
      parms["zonAuthCode"] = zon_voice['auth_code'];
      parms["zonLastCCDigits"] = zon_voice['last_cc'];
      parms["total"] = paymentscreen['splitPaymentAmount'];
      parms["payment_amount"] = paymentscreen['splitPaymentTendered'];
      parms["transactionHeaderKey"] = paymentscreen['txhdr']['txhdrkey'];
      parms["invoiceNumber"] = paymentscreen['invoiceNumber'];
      parms["clientTime"] = globals['clientTime'];
      parms["creditTerminalResponse"] = paymentscreen['splitPaymentTerminalResponse'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("InsertPayment.module.json");
        _results = pjsModule["Insert Payment"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var paymentList = _results ? _results["paymentList"] : null;
      var paymentMethod = _results ? _results["paymentMethod"] : null;

      // 4. calculate totals
      let total = paymentscreen['splitTotal'],
          captured = paymentscreen['splitCaptured'],
          balance = 0
      if(!paymentscreen['splitCaptured']){
          captured = 0
      }
      captured = Number(paymentscreen['splitPaymentAmount']) + Number(captured)
      balance = Number(Number(total) - Number(captured)).toFixed(2)
      
      paymentscreen['splitCaptured'] = Number(captured).toFixed(2) 
      paymentscreen['splitBalance'] = Number(balance).toFixed(2)
      
      if(balance <= 0){
        paymentscreen['splitPaymentComplete'] = true
        paymentscreen['splitBalance'] = 0
      }

      // 5. GetPayments
      // var parms = {};
      // parms["transactionHeaderKey"] = paymentscreen['txhdr']['txhdrkey'];
      // parms["joinRefunds"] = false;
      // 
      // var _success = false;
      // var _error = null;   
      // var _results = null;
      // 
      // try {
      //   var pjsModule = pjs.require("GetPayments.module.json");
      //   _results = pjsModule["GetPayments"](parms);
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // var payments = _results ? _results["paymentList"] : null;

      // 6. split payment grid
      display.split_payment_grid.replaceRecords(paymentList);

      // 7. Reset Zon screen
      Object.assign(zon_voice, {
        "auth_code": '',
        "last_cc": '',
        "payment_type": ''
      });

      // 8. if on zon
      if (activeScreen == screens['zon_voice']) {

        // 9. Show different screen
        screenHistory.push("paymentscreen");
        activeScreen = screens["paymentscreen"];
        return;
      }

      // 10. Set Customer REceipt Var
      // let txhdr = paymentscreen['txhdr']
      // var invoiceNumber = paymentscreen['invoiceNumber'];
      // let txPayKey = 0
      // let transactionHeaderKey = txhdr['txhdrkey']
      // 

      // 11. Setup Payment Var
      // //setup credit card payment vars if applicable
      // let paymentMethod = paymentscreen['splitPaymentType']
      // let creditTerminalResponse = {}
      // 
      // if(paymentMethod == 'Credit Card'){
      //   creditTerminalResponse = JSON.parse(paymentscreen['splitPaymentTerminalResponse'])
      //   switch(creditTerminalResponse['PAYMENT_MEDIA']){
      //     case 'AMEX':
      //       paymentMethod = "American Express"
      //       break;
      //     case 'MASTERCD':
      //     case 'MASTERCARD':
      //     case 'MC':
      //       paymentMethod = "Mastercard"
      //       break;
      //     case 'VISA':
      //       paymentMethod = "Visa"
      //       break;
      //     case 'GIFT':
      //       paymentMethod = 'Gift Card'
      //       break;
      //     case 'DEBIT':
      //       paymentMethod = 'Debit Card'
      //       break;
      //     case 'DISCOVER':
      //     case 'DISC':
      //       paymentMethod = "Discover"
      //       break;
      //   }
      // }
      // else if(paymentMethod == 'zon'){
      //   paymentMethod = zon_voice['payment_type']
      //   creditTerminalResponse['AUTH_CODE'] = zon_voice['auth_code']
      //   creditTerminalResponse['ACCT_NUM'] = zon_voice['last_cc']
      //   creditTerminalResponse['CARD_ENTRY_MODE'] = 'ZON/Voice'
      // }
      // 
      // 
      // try{
      //   let query = "SELECT PAYTYPEKEY, PAYMENTTYPE, SORT, ISCREDCARD FROM PAYMENTTYPES"
      //   let types = pjs.query(query)
      //   paymentMethod = types.filter((rec) => rec["paymenttype"] == paymentMethod)
      //   paymentMethod = paymentMethod[0]
      // }
      // catch(e){
      //   //Error occurred in Fetching Payment Types
      // }
      // 

      // 12. Insert Payment
      // //Inserting Payment
      // 
      // var _success = false;
      // var _error = null;
      // 
      // var _result = null;
      // try {
      //   var columns = "transactionsheaderkey, invoice, paymenttypekey, paymentmethod, paymentamount, actamtpd"
      //   var options = "?, ?, ?, ?, ?, ?"
      //   var values = [
      //     transactionHeaderKey, 
      //     invoiceNumber, 
      //     paymentMethod['paytypekey'],
      //     paymentMethod['paymenttype'],
      //     paymentscreen['splitPaymentAmount'],
      //     paymentscreen['splitPaymentTendered']
      //   ]
      //   var query = "SELECT TXPAYKEY FROM NEW TABLE( "+
      //               "INSERT INTO TRANSACTIONPAYMENTS"+
      //               "("+columns+") VALUES("+options+"))"
      //             
      //   _result = pjs.query(query, values);
      //   txPayKey = _result[0]['txpaykey']
      //   _success = true;
      // }
      // catch(err) {
      //   _error = err;
      // }
      // 
      // var paymentInsertStatus = { success: _success };
      // if (_result && _result["affectedRows"] !== undefined)
      //   paymentInsertStatus["affectedRows"] = _result["affectedRows"];
      // 
      // if (_result && _result["insertId"])
      //   paymentInsertStatus["insertId"] = _result["insertId"];
      // 
      // if (_error && (_error["sqlMessage"] !== undefined || _error["message"] !== undefined))
      //   paymentInsertStatus["message"] = _error["sqlMessage"] || _error["message"];
      // 
      // if (_error && _error["sqlcode"] !== undefined)
      //   paymentInsertStatus["sqlcode"] = _error["sqlcode"];
      // 

      // 13. Credit Card?
      if ((paymentscreen["splitPaymentType"] == 'Credit Card') || (paymentscreen["splitPaymentType"] == 'zon')) {

        // 14. CCPay Insert
        // var _success = false;
        // var _error = null;
        // 
        // var _result = null;
        // 
        // try {
        //   var _from = "TXPAYCC";
        //   var _data = {
        //     "txpaykey": txPayKey,
        //     "txhdrkey": transactionHeaderKey,
        //     "cc_accountnumber": creditTerminalResponse['ACCT_NUM'] ? creditTerminalResponse['ACCT_NUM'] : '',
        //     "cc_ctroutd": creditTerminalResponse['CTROUTD'] ? creditTerminalResponse['CTROUTD'] : '',
        //     "cc_intrn_seq_num": creditTerminalResponse['INTRN_SEQ_NUM'] ? creditTerminalResponse['INTRN_SEQ_NUM'] : '',
        //     "cc_payment_media": creditTerminalResponse['PAYMENT_MEDIA'] ? creditTerminalResponse['PAYMENT_MEDIA'] : '',
        //     "cc_result": creditTerminalResponse['RESULT'] ? creditTerminalResponse['RESULT'] : '',
        //     "cc_result_code": creditTerminalResponse['RESULT_CODE'] ? creditTerminalResponse['RESULT_CODE'] : '',
        //     "cc_termination_status": creditTerminalResponse['TERMINATION_STATUS'] ? creditTerminalResponse['TERMINATION_STATUS'] : '',
        //     "cc_trans_seq_num": creditTerminalResponse['TRANS_SEQ_NUM'] ? creditTerminalResponse['TRANS_SEQ_NUM'] : '',
        //     "cc_troutd": creditTerminalResponse['TROUTD'] ? creditTerminalResponse['TROUTD'] : '',
        //     "cc_response_text": creditTerminalResponse['RESPONSE_TEXT'] ? creditTerminalResponse['RESPONSE_TEXT'] : '',
        //     "cc_auth_code": creditTerminalResponse['AUTH_CODE'] ? creditTerminalResponse['AUTH_CODE'] : '',
        //     "cc_card_entry_mode": creditTerminalResponse['CARD_ENTRY_MODE'] ? creditTerminalResponse['CARD_ENTRY_MODE'] : '',
        //     "cc_approved_amount": creditTerminalResponse['APPROVED_AMOUNT'] ? creditTerminalResponse['APPROVED_AMOUNT'] : '',
        //     "cc_client_id":  '',
        //     "cc_tip_amount": '',
        //     "emv_cardentrymode": creditTerminalResponse['CARD_ENTRY_MODE'] ? creditTerminalResponse['CARD_ENTRY_MODE'] : '',
        //     "emv_aid": creditTerminalResponse['EMV_TAG_4F'] ? creditTerminalResponse['EMV_TAG_4F'] : '',
        //     "emv_applabel": creditTerminalResponse['EMV_TAG_50'] ? creditTerminalResponse['EMV_TAG_50'] : '',
        //     "emv_tvr": creditTerminalResponse['EMV_TAG_95'] ? creditTerminalResponse['EMV_TAG_95'] : '',
        //     "emv_tsi": creditTerminalResponse['EMV_TAG_9B'] ? creditTerminalResponse['EMV_TAG_9B'] : '',
        //     "emv_iad": creditTerminalResponse['EMV_TAG_9F10'] ? creditTerminalResponse['EMV_TAG_9F10'] : '',
        //     "emv_arc": creditTerminalResponse['EMV_TAG_8A'] ? creditTerminalResponse['EMV_TAG_8A'] : '',
        //     "emv_cvm": creditTerminalResponse['EMV_TAG_9F34'] ? creditTerminalResponse['EMV_TAG_9F34'] : '',
        //     "emv_reference_number": '',
        //     "signedby": creditTerminalResponse['SIGNATUREDATA'] ? creditTerminalResponse['SIGNATUREDATA'] : '',
        //     "txpaycc_ts": globals['clientTime'],
        //     "txpayccdlt": 'N'
        //   };
        // 
        //   _result = pjs.data.add(_from, _data);
        // 
        //   let receipts = []
        //   if(paymentscreen['splitPaymentTerminalReceipts'])
        //     receipts = JSON.parse(paymentscreen['splitPaymentTerminalReceipts'])
        //   receipts = [creditTerminalResponse.RECEIPT_DATA.RECEIPT, ...receipts]
        //   paymentscreen['splitPaymentTerminalReceipts'] = JSON.stringify(receipts)
        //   
        //   _success = true;
        // }
        // catch(err) {
        //   _error = err;
        // }
        // 
      }

      // 15. Get Payments
      // var _success = false;
      // var _error = null;
      // 
      // var _records = null;
      // try {
      //   var _from = "TRANSACTIONPAYMENTS";
      //   var _filter = { 
      //     whereClause: `transactionsheaderkey = ?`,
      //     values: [transactionHeaderKey]
      //   };
      //   var _limit = ``;
      //   var _skip = ``;
      //   var _orderby = ``;
      //   var _select = `paymentmethod,paymentamount,actamtpd`;
      // 
      //   _records = pjs.data.get(_from, _filter, _limit, _skip, _orderby, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _records = [];
      //   _error = err;
      //   console.error(err);
      // }
      // var payments = _records;
    },

    "complete split tx": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Save Transaction
      var parms = {};
      parms["clientTime"] = globals['clientTime'];
      parms["updateDetails"] = false;
      parms["status"] = "Sale";
      parms["city"] = pjs.session['city'];
      parms["discount_print"] = cashierscreen['discount_print'];
      parms["company_name_value"] = cashierscreen["company_name_value"];
      parms["update"] = true;
      parms["rsubtotal"] = cashierscreen["rsubtotal"];
      parms["total"] = cashierscreen["total"];
      parms["tax"] = cashierscreen["tax"];
      parms["customer_notes"] = receipt_notes["receipt_notes"] ? receipt_notes["receipt_notes"] : '';
      parms["driverInfoKey"] = cashierscreen["driverInfoKey"];
      parms["po_required"] = cashierscreen["po_required"];
      parms["ponum"] = required_fields["ponum"];
      parms["tripNumber_required"] = cashierscreen['tripNumber_required'];
      parms["tripnum"] = required_fields['tripnum'];
      parms["driverId_required"] = cashierscreen['driverId_required'];
      parms["drvid"] = required_fields['drvid'];
      parms["flag_tx_loaded_from_db_id"] = paymentscreen["txhdr"]['txhdrkey'];
      parms["comp_name"] = cashierscreen["comp_name"];
      parms["tractor_number"] = cashierscreen["tractor_number"];
      parms["trailer_number"] = cashierscreen["trailer_number"];
      parms["TractorTrailerRequired"] = cashierscreen['TractorTrailerRequired'];
      parms["usersKey"] = pjs.session['usersKey'];
      parms["currentShift"] = pjs.session['currentShift'];
      parms["tractor_number_value"] = cashierscreen["tractor_number_value"];
      parms["trailer_number_value"] = cashierscreen["trailer_number_value"];
      parms["locationsKey"] = pjs.session['locationsKey'];
      parms["modifiedPriceSpecials"] = cashierscreen['modifiedPriceSpecials'].length == 0 ? null : cashierscreen['modifiedPriceSpecials']  ;
      parms["receiptGridData"] = display.receipt.getRecords();
      parms["signature"] = paymentscreen['driver_signature'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("SaveTransaction.module.json");
        _results = pjsModule["SaveTransaction"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      cashierscreen['flag_tx_loaded_from_db'] = _results ? _results["flag_tx_loaded_from_db"] : null;
      paymentscreen['invoiceNumber'] = _results ? _results["invoiceNumber"] : null;
      paymentscreen['txhdr'] = _results ? _results["updatedTx"] : null;

      // 3. Get Payments
      var parms = {};
      parms["transactionHeaderKey"] = paymentscreen['txhdr']['txhdrkey'];
      parms["joinRefunds"] = false;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetPayments.module.json");
        _results = pjsModule["GetPayments"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var paymentList = _results ? _results["paymentList"] : null;

      // 4. Customer Receipt
      var parms = {};
      parms["locationTaxRate"] = pjs.session['locationTaxRate'];
      parms["discount_print"] = cashierscreen['discount_print'];
      parms["receiptQty"] = cashierscreen['receiptQty'];
      parms["split"] = true;
      parms["paymentMethod"] = null;
      parms["paymentList"] = paymentList;
      parms["txhdr"] = paymentscreen['txhdr'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GenerateCustomerAndWashBayReceipt.module.json");
        _results = pjsModule["Generate Customer Receipt"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
       paymentscreen['splitReceiptHTML'] = _results ? _results["receiptHTML"] : null;
       paymentscreen['splitWashBayHTML'] = _results ? _results["washBayHTML"] : null;
      paymentscreen['txhdr'] = _results ? _results["txhdr"] : null;

      // 5. Scrub Club ? Issue 
      var parms = {};
      parms["discountType"] = cashierscreen['discountType'];
      parms["discount"] = paymentscreen['discount'];
      parms["companyId"] = cashierscreen['comp_name'];
      parms["clientTime"] = globals['clientTime'];
      parms["invoiceNumber"] = paymentscreen['txhdr']['invoicenbr'];
      parms["tractor_number_value"] = cashierscreen['tractor_number_value'];
      parms["company_name_value"] = cashierscreen['company_name_value'];
      parms["city"] = pjs.session['city'];
      parms["cashier"] = paymentscreen['txhdr']['cashier'];
      parms["locationsKey"] = pjs.session['locationsKey'];
      parms["scrubApply"] = cashierscreen['scrubApply'] ? (Object.keys(cashierscreen['scrubApply']).length == 0 ? null : cashierscreen['scrubApply']) : null;
      parms["receipt"] = display.receipt.getRecords();
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("IssueScrub.module.json");
        _results = pjsModule["IssueScrub"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      paymentscreen['scrubClubHTML'] = _results ? _results["scrubClubHTML"] : null;

      // 6. Redeem Scrub?
      var parms = {};
      parms["discountType"] = cashierscreen['discountType'];
      parms["scrubApply"] = cashierscreen['scrubApply'] ? (Object.keys(cashierscreen['scrubApply']).length == 0 ? null : cashierscreen['scrubApply']) : null;
      parms["invoiceNumber"] = paymentscreen['txhdr']['invoicenbr'];
      parms["locationsKey"] = pjs.session['locationsKey'];
      parms["clientTime"] = globals['clientTime'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("RedeemScrubClub.module.json");
        _results = pjsModule["Redeem Scrub Club"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }

      // 7. Set Customer Receipt Var
      // let txhdr = paymentscreen['txhdr']
      // var invoiceNumber = paymentscreen['invoiceNumber'];
      // let txPayKey = 0
      // let transactionHeaderKey = txhdr['txhdrkey']
      // 
      // 

      // 8. Update TXHeader
      // var updatedReceipt = display.receipt.getRecords();
      // transactionHeaderKey = paymentscreen["txhdr"]['txhdrkey']
      // try{
      // 
      // var values = [
      //                 globals['clientTime'],
      //                 globals['clientTime'].toISOString().substr(0,10),
      //                 globals['clientTime'].toLocaleTimeString('it-IT'),
      //                 paymentscreen['driver_signature'],
      //                 cashierscreen["rsubtotal"],
      //                 cashierscreen["total"],
      //                 cashierscreen["tax"],
      //                 receipt_notes["receipt_notes"] ? receipt_notes["receipt_notes"] : ''
      //               ];
      // 
      //   var columns ="";
      //   if(cashierscreen["po_required"]){
      //     columns += ", PONUMBER = ?"
      //      
      //     values.push(required_fields["ponum"])
      //   }
      //   if(cashierscreen["tripNumber_required"]){
      //     columns += ", TRIPNUMBER = ?"
      //     
      //     values.push(required_fields["tripnum"])
      //   }
      //   if(cashierscreen["driverId_required"]){
      //     columns += ", DRIVERID = ?"
      //    
      //     values.push(required_fields["drvid"])
      //   }
      //   columns += ', STATUS = ?'
      //   values.push('Sale')
      //   
      //   values.push(transactionHeaderKey)
      //   var query = "UPDATE TRANSACTIONSHEADER SET LOCALTS1 = ?, PO_DATE = ?, PO_TIME = ?, SIGNATURE = ?, ORDERTOTAL$=? ,  DISCOUNTEDTOTAL$=?, TAXTOTAL$=?, CASHIERMESSAGE=?" +columns+ " WHERE TXHDRKEY = ?" ;
      //   var _records = pjs.query(query, values)
      //   query = "SELECT TXHDRKEY, DATE(LOCALTS1) AS LOCALTS1, INVOICENBR, TRACTORNBR, TRAILERNBR, DISCOUNTEDTOTAL$, ORDERTOTAL$, TAXTOTAL$ "+
      //           ", PONUMBER, DRIVERID, TRIPNUMBER , USERSKEY, CASHIERMESSAGE " +
      //           "FROM TRANSACTIONSHEADER WHERE TXHDRKEY = ?"
      //   _records = pjs.query(query, transactionHeaderKey)
      //   var txHdr = {
      //     "corporatecustomerskey" : cashierscreen["comp_name"]
      //   }
      // 
      //   let items = display.receipt.getRecords().map((item) => {
      //     return{
      //       cost: Number(item["rprice"]).toFixed(2),
      //       quantity: item["qty"],
      //       product: item["item_name"]
      //     }
      //   })
      //   txhdr['cashiermessage'] = _records[0]['cashiermessage']
      //   txhdr['userskey'] = _records[0]['userskey']
      // }
      // catch (err){
      //   //error
      // }

      // 9. Setup Receipt Variables
      // var fs = require('fs');
      // let ejs = require('ejs');
      // let path = require('path')
      // let attachments = []

      // 10. Get Tx Cashier
      // var _success = false;
      // var _error = null;
      // 
      // var _record = null;
      // try {
      //   var _from = "USERS";
      //   var _filter = { 
      //     whereClause: `userskey = ?`,
      //     values: [ txhdr["userskey"]]
      //   };
      //   var _select = `firstname,SUBSTR(lastname,1,1) as lastname`;
      // 
      //   _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // // If no record found
      // if (!_record) {
      //   _record = {};
      //   _error = new Error("Record not found.")
      //   _success = false;
      // }
      // var txCashier = _record;

      // 11. Set cashier name and tax rate
      //  txhdr["cashier"]=txCashier["firstname"]+" "+txCashier["lastname"]
      // let taxRate = Number(Number(pjs.session["locationTaxRate"]) * 100 ).toFixed(2);
      //  txhdr["taxrate"]= (Number(taxRate).toFixed(2)) + " %"

      // 12. Set Payment Details
      // let list = display.split_payment_grid.getRecords()
      // 
      // list = list.map(payment => {
      //   return{
      //     paymentMethod : payment['paymentmethod'],
      //     paymentAmount : Number(payment['paymentamount']).toFixed(2),
      //     actualPaid : Number(payment['actamtpd']).toFixed(2),
      //     returned : Number(Number(payment['actamtpd']) - Number(payment['paymentamount'])).toFixed(2)
      //   }
      // })
      // let payment = {
      //   type: 'split',
      //   list : list
      // }
      // 
      // txhdr['payments'] = payment

      // 13. Customer Receipt
      // if(cashierscreen['discount_print'] != 'DISCOUNT')
      //   txhdr['discount'] = ''
      // 
      // 
      // var templateString = fs.readFileSync(path.join(__dirname, 'templates', 'customer-receipt.ejs'), 'utf-8');
      // let html = ejs.render(templateString, {txhdr: txhdr});
      // 
      // templateString = fs.readFileSync(path.join(__dirname, 'templates', 'wash-bay-receipt.ejs'), 'utf-8');
      // let washBayHTML = ejs.render(templateString, {txhdr: txhdr});
      // 
      // //   var _data = {
      // //     "from" : "judy.reynolds35@ethereal.email",
      // //     "to": "test@truckmat.com",
      // //     "subject": "Truckomat Invoice",
      // //     "html": html,
      // //   };
      // //   var _info = pjs.sendEmail(_data);
      // 
      //   let quantity = 1
      //   
      //   paymentscreen['splitReceiptHTML'] = JSON.stringify({html:html, quantity:quantity})
      //   paymentscreen['splitWashBayHTML'] = washBayHTML

      // 14. Scrub Club? Issue
      // const utility = require('../common-apis/utility.js')
      // 
      // //Check if scrub coupon applies
      // let scrubClubItems = display.receipt.getRecords().filter((item)=>item["givescrubclubforthisitem"] == 'Y')
      // 
      // //If discount type is scrub and receipt includes item which is scrub applicable
      // if(cashierscreen["discountType"] == "Scrub" && Object.keys(scrubClubItems).length !== 0 && Object.keys(cashierscreen["scrubApply"]).length == 0){
      //   var JsBarcode = require('jsbarcode');
      //   const { DOMImplementation, XMLSerializer } = require('xmldom');
      //   const xmlSerializer = new XMLSerializer();
      //   const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
      //   const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      // 
      //   var _success = false;
      //   var _error = null;
      //   var companyId = paymentscreen["comp_name"];
      //   var _records = null;
      // 
      //   try {
      //     var query = "SELECT HQA_MISCCONFIG.GROUP,HQA_MISCCONFIG.SEQUENCE, HQA_MISCCONFIG.SETTING, HQA_MISCCONFIG.QUANTITY,HQA_MISCCONFIG.MEASTYPKEY,HQA_MISCCONFIG.TIMEPERIODSKEY,TIMEPERIODS.PERIOD,MEASUREMENTTYPES.TYPE " +
      //                 "FROM HQA_MISCCONFIG INNER JOIN TIMEPERIODS ON TIMEPERIODS.TIMEPERIODKEY = HQA_MISCCONFIG.TIMEPERIODSKEY " +
      //                 "INNER JOIN MEASUREMENTTYPES ON MEASUREMENTTYPES.MEASTYPKEY = HQA_MISCCONFIG.MEASTYPKEY " +
      //                 "WHERE GROUP = ?";
      //     var _records = pjs.query(query, ['Scrub Club'])
      // 
      // 
      //   var c_query = "SELECT CORPORATECUSTOMERS.COMPANYNM,CORPORATECUSTOMERS.ADDRESS,CORPORATECUSTOMERS.CITY,CORPORATECUSTOMERS.ZIP,CORPORATECUSTOMERS.PHONE,STATES.STATENAME " +
      //                   "FROM CORPORATECUSTOMERS " +
      //                   "LEFT JOIN STATES ON STATES.STATEKEY = CORPORATECUSTOMERS.STATEKEY " +
      //                   "WHERE CORPCUSTKEY = ?";
      //     var customerData = pjs.query(c_query, [companyId])
      //     _success = true;
      //   }
      //   catch (err) {
      //     _records = [];
      //     _error = err;
      //   }
      // 
      //   //Setting Values
      //   let waitPeriod = '',
      //       expirationPeriod = '',
      //       dollarValue = ''
      //   _records = _records.map((rec) => {
      //     if(rec['setting'] == 'Wait Period (Before Redeemable)'){
      //       waitPeriod = rec;
      //     }
      //     if(rec['setting'] == 'Expiration Period'){
      //       expirationPeriod = rec;
      //     }
      //     if(rec['setting'] == 'Dollar Value'){
      //       dollarValue = rec;
      //     }
      //   })
      // 
      //   //Get From Date
      //   var fromDate = new Date()
      //   if(waitPeriod["period"] == "Day"){
      //     fromDate.setDate(fromDate.getDate() + waitPeriod["quantity"])
      //   }
      //   else if(waitPeriod["period"] == "Week"){
      //     fromDate.setDate(fromDate.getDate() + (waitPeriod["quantity"]*7))
      //   }
      //   else if(waitPeriod["period"] == "Month"){
      //     fromDate.setMonth(fromDate.getMonth() + waitPeriod["quantity"])
      //   }
      //   else if(waitPeriod["period"] == "Year"){
      //       fromDate.setFullYear(fromDate.getFullYear() + waitPeriod["quantity"])
      //   }
      // 
      //   //Get To Date
      //   var toDate = new Date(fromDate.getTime())
      //   if(expirationPeriod["period"] == "Day"){
      //     toDate.setDate(toDate.getDate() + expirationPeriod["quantity"])
      //   }
      //   else if(expirationPeriod["period"] == "Week"){
      //     toDate.setDate(toDate.getDate() + (expirationPeriod["quantity"]*7))
      //   }
      //   else if(expirationPeriod["period"] == "Month"){
      //     toDate.setMonth(toDate.getMonth() + expirationPeriod["quantity"])
      //   }
      //   else if(expirationPeriod["period"] == "Year"){
      //       toDate.setFullYear(toDate.getFullYear() + expirationPeriod["quantity"])
      //   }
      //   
      //   //issued date
      //   let date = paymentscreen["current_date"];
      // 
      //   //Generate barcode
      //   JsBarcode(svgNode, invoiceNumber, {
      //       xmlDocument: document,
      //   });
      //   const svgText = xmlSerializer.serializeToString(svgNode);
      // 
      //   var scrubCoupon = {
      //     dollarValue: dollarValue["quantity"],
      //     validFrom: fromDate.toLocaleDateString('en-US'),
      //     validTo: toDate.toLocaleDateString('en-US'),
      //     invoiceNbr: invoiceNumber,
      //     barcode: svgText,
      //     issuedDate: date,
      //     truckNumber: paymentscreen["tractor_number_value"],
      //     companyName: paymentscreen["company_name_value"],
      //     address:customerData[0]["address"] ? customerData[0]["address"] : '',
      //     city:customerData[0]["city"] ? customerData[0]["city"]: '',
      //     state:customerData[0]["statename"] ? customerData[0]["statename"] : '',
      //     zip:customerData[0]["zip"] ? customerData[0]["zip"] : '',
      //     phone: customerData[0]["phone"] ? utility.formatPhoneNumber(customerData[0]["phone"]) : '',
      //     driverSignature:'',
      //     location:pjs.session["city"],
      //     cashier: txhdr['cashier']
      //   }
      // 
      //   //Insert into Scrub club tracking
      //   try{
      //     let q = "INSERT INTO SCRUBCLUBTRACKING("+
      //             "SCRUBCLUBTRACKING.ISSUEDTRANSACTIONSHEADERINVOICE, SCRUBCLUBTRACKING.ISSUEDLOCATIONKEY, SCRUBCLUBTRACKING.ISSUEDTIMESTAMP "+
      //             ", SCRUBCLUBTRACKING.ISSUEDTRK, SCRUBCLUBTRACKING.VALIDFROM, SCRUBCLUBTRACKING.VALIDTO, SCRUBCLUBTRACKING.DOLLARAMT) "+
      //             "VALUES ( ?, ?, ?, ?, ?, ?, ?)"
      //     let scrubValues =[
      //       invoiceNumber, 
      //       pjs.session["locationsKey"], 
      //       pjs.timestamp(), 
      //       paymentscreen["tractor_number_value"],
      //       scrubCoupon["validFrom"],
      //       scrubCoupon["validTo"],
      //       scrubCoupon["dollarValue"]
      // 
      //       ]
      //     pjs.query(q, scrubValues)
      //   }
      //   catch(e){
      //     //Error Occurred during insertion in scrub club tracking
      //   }
      // 
      // 
      //   //render Template
      //   var scrubTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'scrubclub-receipt.ejs'), 'utf-8');
      //   let scrubHtml = ejs.render(scrubTemplate, {scrubCoupon:scrubCoupon});
      //     // var _data = {
      //     //   "from" : "judy.reynolds35@ethereal.email",
      //     //   "to": "test@truckmat.com",
      //     //   "subject": "Truckomat Scrub Club",
      //     //   "html": scrubHtml,
      //     // };
      //     // var _info = pjs.sendEmail(_data);
      //     paymentscreen['scrubClubHTML'] = scrubHtml
      // }
      // else{
      //   //Scrub Club cannot be issued, no scrub club item in receipt
      // }
    },

    "insert refund button click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Set values for refunds
      let refund = {}
      
      if(void_transaction['refundType'] == 'Cash Sale' || void_transaction['refundType'] == 'ECA Check' || void_transaction['refundType'] == 'Check' || void_transaction['refundType'] == 'Open Chrg' || void_transaction['refundType'] == 'Gift Card'   ){
        let currentPayment = display.void_transactions_refund_grid.getRecords().filter((rec) => rec['txpaykey'] == void_transaction['txpaykey'])
        currentPayment = currentPayment[0]
        refund['APPROVED_AMOUNT'] = currentPayment['paymentamount'] 
      }
      else{
        refund = JSON.parse(void_transaction['creditCardTerminalResponse'])
      }
      var data = {
        "txhdrkey": void_transaction['txhdrkey'],             //integer
        "txpaykey": void_transaction['txpaykey'],
        "acct_num": refund['ACCT_NUM'] ? refund['ACCT_NUM'] : '0',
        "appv_amt": refund['APPROVED_AMOUNT'] ? refund['APPROVED_AMOUNT'] : '0', //decimal
        "authnwid": refund['AUTHNWID'] ? refund['AUTHNWID'] : '0',   //integer
        "authnwnm": refund['AUTHNWNAME'] ? refund['AUTHNWNAME'] : '0',
        "auth_code": refund['AUTH_CODE'] ? refund['AUTH_CODE'] : '0',
        "bnk_usrdta": refund['BANK_USERDATA'] ? refund['BANK_USERDATA'] : '0',
        "b_trace_id": refund['BATCH_TRACE_ID'] ? refund['BATCH_TRACE_ID'] : '0',
        "card_abbrv": refund['CARD_ABBRV'] ? refund['CARD_ABBRV'] : '0',
        "c_entry_md": refund['CARD_ENTRY_MODE'] ? refund['CARD_ENTRY_MODE'] : '0',
        "c_exp_mnth": refund['CARD_EXP_MONTH'] ? refund['CARD_EXP_MONTH'] : '0',
        "c_exp_yr": refund['CARD_EXP_YEAR'] ? refund['CARD_EXP_YEAR'] : '0',
        "cardholder": refund['CARDHOLDER'] ? refund['CARDHOLDER'] : '0',
        "ctroutd": refund['CTROUTD'] ? refund['CTROUTD'] : '0', //integer
        "invoice": refund['INVOICE'] ? refund['INVOICE'] : '0', //integer
        "i_seq_num": refund['INTRN_SEQ_NUM'] ? refund['INTRN_SEQ_NUM'] : '0', //integer
        "merchid": refund['MERCHID'] ? refund['MERCHID'] : '0',    //integer
        "pay_media": refund['PAYMENT_MEDIA'] ? refund['PAYMENT_MEDIA'] : '0',
        "pay_type": refund['PAYMENT_TYPE'] ? refund['PAYMENT_TYPE'] : '0',
        "reference": refund['REFERENCE'] ? refund['REFERENCE'] : '0',
        "resp_code": refund['RESPONSE_CODE'] ? refund['RESPONSE_CODE'] : '0',
        "resp_text": refund['RESPONSE_TEXT'] ? refund['RESPONSE_TEXT'] : '0',
        "result": refund['RESULT'] ? refund['RESULT'] : '0',
        "result_cd": refund['RESULT_CODE'] ? refund['RESULT_CODE'] : '0', //integer
        "termid": refund['TERMID'] ? refund['TERMID'] : '0',
        "term_stat": refund['TERMINATION_STATUS'] ? refund['TERMINATION_STATUS'] : '0',
        "trace_cd": refund['TRACE_CODE'] ? refund['TRACE_CODE'] : '0', //integer
        "train_md": refund['TRAINING_MODE'] ? refund['TRAINING_MODE'] : '0',
        "trans_amt": refund['TRANS_AMOUNT'] ? refund['TRANS_AMOUNT'] : '0',  //decimal
        "trans_tm": refund['TRANS_TIME'] ? refund['TRANS_TIME'] : '0',
        "troutd": refund['TROUTD'] ? refund['TROUTD'] : '0',       //integer
        "vsp_code": refund['VSP_CODE'] ? refund['VSP_CODE'] : '0',   //integer
        "vsp_resdsc": refund['VSP_RESULTDESC'] ? refund['VSP_RESULTDESC'] : '0',
        "vsp_trxid": refund['VSP_TRXID'] ? refund['VSP_TRXID'] : '0',
        "counter": refund['COUNTER'] ? refund['COUNTER'] : '0', //integer
        "refunddlt": 'N',
        "lsttouchby": pjs.session['usersKey']
      };

      // 3. Insert Refund
      var _success = false;
      var _error = null;
      
      var _result = null;
      try {
        var _from = "REFUNDS";
        var _data = data;
      
        _result = pjs.data.add(_from, _data);
        _success = true;
      }
      catch(err) {
        _error = err;
        console.error(err);
      }
      
      var refundInsertStatus = { success: _success };
      if (_result && _result["affectedRows"] !== undefined)
        refundInsertStatus["affectedRows"] = _result["affectedRows"];
      
      if (_result && _result["insertId"])
        refundInsertStatus["insertId"] = _result["insertId"];
      
      if (_error && (_error["sqlMessage"] !== undefined || _error["message"] !== undefined))
        refundInsertStatus["message"] = _error["sqlMessage"] || _error["message"];
      
      if (_error && _error["sqlcode"] !== undefined)
        refundInsertStatus["sqlcode"] = _error["sqlcode"];
      

      // 4. Get Payments
      var _success = false;
      var _error = null;
      
      var _records = null;
      try {
        var _from = "TRANSACTIONPAYMENTS LEFT JOIN TXPAYCC ON TRANSACTIONPAYMENTS.TXPAYKEY = TXPAYCC.TXPAYKEY LEFT JOIN REFUNDS ON TRANSACTIONPAYMENTS.TXPAYKEY = REFUNDS.TXPAYKEY";
        var _filter = { 
          whereClause: `transactionsheaderkey = ?`,
          values: [void_transaction["txhdrkey"]]
        };
        var _limit = ``;
        var _skip = ``;
        var _orderby = ``;
        var _select = `TRANSACTIONPAYMENTS.txpaykey,TRANSACTIONPAYMENTS.transactionsheaderkey,TRANSACTIONPAYMENTS.invoice,TRANSACTIONPAYMENTS.paymenttypekey,TRANSACTIONPAYMENTS.paymentmethod,TRANSACTIONPAYMENTS.paymentamount,TXPAYCC.txpaycckey,TXPAYCC.cc_accountnumber,TXPAYCC.cc_approved_amount,REFUNDS.refundkey`;
      
        _records = pjs.data.get(_from, _filter, _limit, _skip, _orderby, _select);
        _success = true;
      }
      catch (err) {
        _records = [];
        _error = err;
        console.error(err);
      }
      var paymentsList = _records;

      // 5. update grid
      //refund grid
      paymentsList = paymentsList.map((payment) => {
        let refundObject = {
          invoice: void_transaction['invoicenbr'],
          cc_approved_amount: payment['cc_approved_amount'],
          orig_acct_num: payment['cc_accountnumber']
        }
        return{
          ...payment,
          ccTerminalRefundObject: JSON.stringify(refundObject),
          refunded: payment['refundkey'] ? true: false
        }
      })
      display.void_transactions_refund_grid.replaceRecords(paymentsList)
    },

    "handover button click": function() {
      // 1. Update
      var _success = false;
      var _error = null;
      
      var _result = null;
      try {
        var _from = "CRNTCSHR";
        var _filter = { 
          whereClause: `loctnkey = ?`,
          values: [pjs.session['locationsKey']]
        };
        var _data = {
          "userskey": 0
        };
      
        _result = pjs.data.update(_from, _filter, _data);
        _success = true;
      }
      catch(err) {
        _error = err;
        console.error(err);
      }
      

      // 2. Clear Session Data
      pjs.session = [];
      cashierscreen['handover_status'] = true
    },

    "close void transaction screen": function() {
      // 1. Clear Values
      Object.assign(void_transaction, {
        "refund_amount": '',
        "void_reason": void_transaction['void_reason'],
        "creditCardRefundAmount": '',
        "invoiceNumber": '',
        "creditCardTerminalResponse": '',
        "txhdrkey": '',
        "refundingActive": 'Inactive',
        "refundType": '',
        "txpaykey": '',
        "refundReciepts": '',
        "infoBoxText": ''
      });

      // 2. Clear
      logic["Cashier Clear Click"]();
    },

    "add product from truck view": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Set work variable
      var matchingReceipt = null;
      var discountValue = 0;

      // 3. Find product
      var _success = true;
      var _data = display.products.filter(gridRecord => {
        if (gridRecord["prdkey"] == truck_view["productId"]) return true;
        else return false;
      });
      var activeGridRecord = _data;

      // 4. Find grid record(s)
      var _success = true;
      var _data = display.receipt.filter(gridRecord => {
        if (gridRecord["item_name"] == truck_view["productName"]) return true;
        else return false;
      });
      var matchingReceipt = _data;

      // 5. Exist in Receipt
      if (matchingReceipt.length > 0) {

        // 6. Add Receipt Price and Qty
        activeGridRecord = activeGridRecord[0]
        
        display.receipt.applyMap(gridRecord => {
          if (gridRecord["item_name"] == activeGridRecord["product"]) {
            gridRecord["qty"] += 1
            gridRecord["rprice"] = gridRecord["qty"] * activeGridRecord["discountPrice"]
            gridRecord["actualPrice"] = gridRecord["qty"] * activeGridRecord["price"]
          }
          return gridRecord;
        });
      }

      // 7. Otherwise
      else {

        // 8. Add Product To Reciept
        activeGridRecord = activeGridRecord[0]
        
        if(cashierscreen['po_option']=='M' || cashierscreen['po_option']=='B')
        {
          var sql="SELECT CCREQPOKEY FROM CCREQPO where CCKEY=? and PRDKEY=? ";
          var result=pjs.query(sql,[cashierscreen['company_id'],activeGridRecord["prdkey"]]);
        
          if(result.length!==0)
          {
            var requiredItems = []
            cashierscreen["po_required"] = true
            cashierscreen["has_requirements"] = true
            requiredItems.push("PO#")
            required_fields['ponum'] = cashierscreen['currentPO']
            if(cashierscreen["driverId_required"]){ 
              requiredItems.push("Driver ID")  
            }
            if(cashierscreen["tripNumber_required"]){
              requiredItems.push("Trip #") 
            }
            cashierscreen["req_items"] = "Required : " + requiredItems.toString()
          }
        }
        var viewdiscount=false;
        var viewactual=true;
        if(cashierscreen["discount_print"]==="Discount")
        {
          viewactual=false;
          viewdiscount=true;
        }
        
        display.receipt.unshift({
          canEdit: true,
          displayActual:viewactual,
          displayDiscount:viewdiscount,
          "item_name": activeGridRecord["product"],
          "qty": 1,
          "taxable": activeGridRecord["taxable"],
          "rprice": Number(activeGridRecord["discountPrice"]).toFixed(2),
          "prdkey": activeGridRecord["prdkey"],
          "actualPrice":Number(activeGridRecord["price"]).toFixed(2),
          "givescrubclubforthisitem": activeGridRecord["givescrubclubforthisitem"],
          "redeemscrubclubonthisitem" : activeGridRecord["redeemscrubclubonthisitem"]
        });
      }

      // 9. Update Receipt SubTotal
      cashierscreen["rsubtotal"] = display.receipt.reduce((total, record) => {
        var num = Number(record["rprice"]);
        if (isNaN(num)) num = 0;
        return total + num;
      }, 0);

      // 10. Update Receipt Total
      var nontaxable = 0;
      display.receipt.forEach(function(record) {
        if (record.taxable == 'N' && record.loctaxable != 'Y'){
          nontaxable += Number(record["rprice"]);
        }
        else if(record.taxable == 'Y' && record.loctaxable == 'N'){
          nontaxable += Number(record["rprice"]);
        }
      });
      cashierscreen["nontaxable"] = nontaxable;
      
      let surcharge = 0 , 
          discount = 0, 
          subtotal = cashierscreen["rsubtotal"], 
          tax = 0,
          actualTotal = 0,
          total = 0 
      
      //Calculate total of Full prices of line items.
      actualTotal = display.receipt.reduce((total, record) => {
        var num = Number(record["actualPrice"]);
        if (isNaN(num)) num = 0;
        return total + num;
        }, 0);
      
      
      //Apply Surcharges
      if(pjs.session["locationSurchargeDiscount"] == "S"){
        surcharge += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"]))
      }
      
      //Determine Taxation
      if(cashierscreen["customerTaxExempt"] == 'Y'){
          tax = 0
      }
      else if(pjs.session["locationTaxRate"])
      {
        tax = Number(pjs.session["locationTaxRate"]) * (Number(cashierscreen["rsubtotal"]) - Number(cashierscreen["nontaxable"]));
      }
      
      //Apply Discounts
      if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
        discount += actualTotal - Number(subtotal);
        subtotal = actualTotal
      }
      else if(cashierscreen["discountType"] == "Scrub" && Object.keys(cashierscreen["scrubApply"]).length !== 0){
        discount += Number(cashierscreen["scrubApply"]["value"])
      }
      else if(cashierscreen['discountType'] == 'Coupon'){
        if(coupon['coupon_discount'])
          discount += Number(coupon["coupon_discount"])
      }
      if(pjs.session["locationSurchargeDiscount"] == "D"){
        discount += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"])) 
      }
      
      //Calculate Totals
      let taxedTotal = Math.abs(subtotal) + Math.abs(tax)
      total = (Math.abs(taxedTotal) - Math.abs(discount) ) + surcharge
      
      
      cashierscreen["rsubtotal"] = Number(subtotal).toFixed(2)
      cashierscreen["discount"] = Number((Math.abs(discount))).toFixed(2)
      cashierscreen["tax"] = Number(tax).toFixed(2)
      cashierscreen["total"] = Number(Math.abs(total)).toFixed(2)

      // 11. Enable Buttons
      cashierscreen["save_Disabled"]=false;
      cashierscreen["checkoutDisabled"]=false;
      

      // 12. Active Product Scroll
      cashierscreen['productsActiveRecord'] = display.products.getRecords().findIndex( item => item['prdkey'] == truck_view['productId']) + 1

      // 13. Show previous screen
      let previousScreen = screenHistory[screenHistory.length - 2];
      if (previousScreen) {
        activeScreen = screens[previousScreen];
        screenHistory.pop();
      }
      return;
    },

    "credit sale zon/voice button click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Is Zon pay > remaining amt due
      if (paymentscreen["splitPaymentAmount"] > paymentscreen["splitBalance"]) {
      }

      // 3. Otherwise
      else {

        // 4. Show Zon screen
        screenHistory.push("zon_voice");
        activeScreen = screens["zon_voice"];
        return;
      }
    },

    "initiate void button click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Get Payments
      var parms = {};
      parms["transactionHeaderKey"] = paymentscreen['txhdr']['txhdrkey'];
      parms["joinRefunds"] = true;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetPayments.module.json");
        _results = pjsModule["GetPayments"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var paymentList = _results ? _results["paymentList"] : null;

      // 3. Get Payments
      // var _success = false;
      // var _error = null;
      // 
      // var _records = null;
      // try {
      //   var _from = "TRANSACTIONPAYMENTS LEFT JOIN TXPAYCC ON TRANSACTIONPAYMENTS.TXPAYKEY = TXPAYCC.TXPAYKEY LEFT JOIN REFUNDS ON TRANSACTIONPAYMENTS.TXPAYKEY = REFUNDS.TXPAYKEY";
      //   var _filter = { 
      //     whereClause: `transactionsheaderkey = ?`,
      //     values: [paymentscreen['txhdr']['txhdrkey']]
      //   };
      //   var _limit = ``;
      //   var _skip = ``;
      //   var _orderby = ``;
      //   var _select = `TRANSACTIONPAYMENTS.txpaykey,TRANSACTIONPAYMENTS.transactionsheaderkey,TRANSACTIONPAYMENTS.invoice,TRANSACTIONPAYMENTS.paymenttypekey,TRANSACTIONPAYMENTS.paymentmethod,TRANSACTIONPAYMENTS.paymentamount,TXPAYCC.txpaycckey,TXPAYCC.cc_accountnumber,TXPAYCC.cc_approved_amount,REFUNDS.refundkey`;
      // 
      //   _records = pjs.data.get(_from, _filter, _limit, _skip, _orderby, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _records = [];
      //   _error = err;
      //   console.error(err);
      // }
      // var paymentsList = _records;

      // 4. Load Void Screen
      //refund grid
      paymentsList = paymentsList.map((payment) => {
        let refundObject = {
          invoice: paymentscreen['txhdr']['invoicenbr'],
          cc_approved_amount: payment['cc_approved_amount'],
          orig_acct_num: payment['cc_accountnumber']
        }
        return{
          ...payment,
          ccTerminalRefundObject: JSON.stringify(refundObject),
          refunded: payment['refundkey'] ? true: false
        }
      })
      display.void_transactions_refund_grid.replaceRecords(paymentsList)
      
      //dependent variables
      let thisTxtotal = paymentscreen['txhdr']['total']
      
      //Default Settings
      void_transaction["refund_amount"] = thisTxtotal
      void_transaction["comp_name"] = paymentscreen['txhdr']['companynm']
      void_transaction["refund_amount_disabled"] = true
      void_transaction["status"] =  'Open'
      void_transaction["txhdrkey"] =  paymentscreen['txhdr']['txhdrkey']
      void_transaction['creditCardRefundAmount'] = ""
      void_transaction['refundType'] = ""
      void_transaction['txpaykey'] = ""
      void_transaction['refundingActive'] = ""
      void_transaction['creditCardTerminalResponse'] = ""
      void_transaction['void_reason'] = ''
      void_transaction['otherDescription'] = ''
      
      void_transaction['invoiceNumber'] =  paymentscreen['txhdr']['txhdrkey']
      
      //Determine Refunds
      
        void_transaction["refund_amount"] = "0.00$"
        void_transaction["void_open"] = true
        void_transaction["void_closed"] = false 
        
        if(paymentsList.length == 0){
          // no payments made yet -> open transaction
        }
        else {
          // its a split transaction 
          void_transaction["void_open"] = false
          void_transaction["void_closed"] = true 
          void_transaction["refund_amount"] = paymentsList.reduce((prev, curr) => { 
            return Number(Number(prev) + Number(curr['paymentamount'])).toFixed(2)
            },0)
        }
      
      
      screenHistory.push("void_transaction")
      activeScreen = screens["void_transaction"]
    },

    "Companies -> Customer on Change": function() {
      // 1. Set company info from companies screen
      //clear search
      companies['csearch'] = ''
      
      cashierscreen['comp_name'] = companies['comp_name']
      cashierscreen['company_id'] = companies['company_id']
      cashierscreen['company_name_value'] = companies['company_name_value']
      
      screenHistory.push('cashierscreen')
      activeScreen = screens['cashierscreen']

      // 2. Call Company Change routine
      logic["Company Change"]();
    },

    "log out button click 2": function() {
    },

    "re print receipt click": function() {
      // 1. Fetch Transaction
      var parms = {};
      parms["txhdrkey"] = activeGridRecord['txhdrkey'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetTransactions.module.json");
        _results = pjsModule["Fetch Transaction For Receipt"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var transaction = _results ? _results["txhdr"] : null;

      // 2. Get Payments
      var parms = {};
      parms["transactionHeaderKey"] = activeGridRecord['txhdrkey'];
      parms["joinRefunds"] = false;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetPayments.module.json");
        _results = pjsModule["GetPayments"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      transaction['payments'] = _results ? _results["paymentList"] : null;

      // 3. Assign to Reprint Receipt
       reprint_receipt['txhdr'] = transaction

      // 4. Show different screen
      Object.assign(reprint_receipt, {
        "comp_name": activeGridRecord["companynm"],
        "receiptHTML": ''
      });
      screenHistory.push("reprint_receipt");
      activeScreen = screens["reprint_receipt"];
      return;

      // 5. Fetch Transaction
      // const utility = require('../common-apis/utility.js')
      // 
      // 
      // try{
      //   var query = "SELECT TRANSACTIONSHEADER.TXHDRKEY, VARCHAR_FORMAT(TRANSACTIONSHEADER.LOCALTS1, 'MM/DD/YYYY') as localts1, TRANSACTIONSHEADER.INVOICENBR, TRANSACTIONSHEADER.TRACTORNBR, "+
      //               "TRANSACTIONSHEADER.TRAILERNBR, TRANSACTIONSHEADER.DISCOUNTEDTOTAL$, TRANSACTIONSHEADER.ORDERTOTAL$, TRANSACTIONSHEADER.TAXTOTAL$, "+
      //               "TRANSACTIONSHEADER.PONUMBER, TRANSACTIONSHEADER.DRIVERID, TRANSACTIONSHEADER.TRIPNUMBER, "+
      //               "TRANSACTIONSHEADER.USERSKEY, TRANSACTIONSHEADER.CASHIERMESSAGE, CORPORATECUSTOMERS.COMPANYNM, TOMLCTNS.LOCATION, TOMLCTNS.PHONENBR "+
      //               "FROM TRANSACTIONSHEADER "+
      //               "INNER JOIN TOMLCTNS ON TRANSACTIONSHEADER.LOCATIONSKEY = TOMLCTNS.LOCATIONKEY " +
      //               "INNER JOIN CORPORATECUSTOMERS ON TRANSACTIONSHEADER.CORPORATECUSTOMERSKEY = CORPORATECUSTOMERS.CORPCUSTKEY " +
      //               "WHERE TRANSACTIONSHEADER.TXHDRKEY = ?;"
      // 
      //   var txhdr = pjs.query(query, [Number(activeGridRecord["txhdrkey"])])
      // 
      //   query = "SELECT TRANSACTIONDETAILS.QUANTITY, TRANSACTIONDETAILS.COST, TRANSACTIONDETAILS.COSTFULL, PRODUCTS.PRODUCT, PRODUCTS.TAXABLE "+
      //           "FROM TRANSACTIONDETAILS "+
      //           "INNER JOIN PRODUCTS ON TRANSACTIONDETAILS.PRODUCTSKEY = PRODUCTS.PRDKEY "+
      //           "WHERE TRANSACTIONDETAILS.TXHDRKEY = ? AND (TRANSACTIONDETAILS.DELETE <> ? OR TRANSACTIONDETAILS.DELETE IS NULL);"
      //   var items = pjs.query(query, [Number(activeGridRecord["txhdrkey"]), 'Y'])
      // 
      //   txhdr = txhdr[0]
      //   items.forEach((item) => {
      //     if(cashierscreen['discount_print']=='DISCOUNT')
      //     {
      //       item["cost"] = Number(item["cost"]).toFixed(2)
      //     }
      //     else
      //     {
      //        item["cost"] = Number(item["costfull"]).toFixed(2)
      //     }
      //     
      //   })
      //   txhdr["items"] = items
      //   txhdr["subtotal"] = Number(txhdr["ordertotal$"]).toFixed(2)
      //   if(cashierscreen['discount_print']=='DISCOUNT')
      //   {
      //     txhdr["discount"] = Number((Number(txhdr["discountedtotal$"]) -Number(txhdr["taxtotal$"])) - Number(txhdr["ordertotal$"])).toFixed(2)
      //   }
      //   else
      //   {
      //     txhdr["discount"] ="";
      //   }
      //   
      //   txhdr["tax"] = Number(txhdr["taxtotal$"]).toFixed(2)
      //   txhdr["total"] = Number(txhdr["discountedtotal$"]).toFixed(2)
      //   txhdr["phonenbr"] = utility.formatPhoneNumber(txhdr["phonenbr"])
      //   email_receipt["txhdr"] = txhdr
      //    txhdr["taxrate"]= (Number(Number(pjs.session["locationTaxRate"])*100).toFixed(2))+"%";
      // }
      // catch(e){
      //   //error
      // }
      // 
      // 

      // 6. Get Tx Cashier
      // var _success = false;
      // var _error = null;
      // 
      // var _record = null;
      // try {
      //   var _from = "USERS";
      //   var _filter = { 
      //     whereClause: `userskey = ?`,
      //     values: [ txhdr["userskey"]]
      //   };
      //   var _select = `firstname,SUBSTR(lastname,1,1) as lastname`;
      // 
      //   _record = pjs.data.get(_from, _filter, 1, 0, null, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _error = err;
      //   console.error(err);
      // }
      // 
      // // If no record found
      // if (!_record) {
      //   _record = {};
      //   _error = new Error("Record not found.")
      //   _success = false;
      // }
      // var txCashier = _record;

      // 7. Payments?
      // var _success = false;
      // var _error = null;
      // 
      // var _records = null;
      // try {
      //   var _from = "TRANSACTIONPAYMENTS";
      //   var _filter = { 
      //     whereClause: `transactionsheaderkey = ?`,
      //     values: [activeGridRecord["txhdrkey"]]
      //   };
      //   var _limit = ``;
      //   var _skip = ``;
      //   var _orderby = ``;
      //   var _select = `txpaykey,paymentmethod,paymentamount,actamtpd`;
      // 
      //   _records = pjs.data.get(_from, _filter, _limit, _skip, _orderby, _select);
      //   _success = true;
      // }
      // catch (err) {
      //   _records = [];
      //   _error = err;
      //   console.error(err);
      // }
      // var paymentsList = _records;

      // 8. Set Payment Details
      // let list = paymentsList
      // console.log(list)
      // list = list.map(payment => {
      //   return{
      //     paymentMethod : payment['paymentmethod'],
      //     paymentAmount : Number(payment['paymentamount']).toFixed(2),
      //     actualPaid : Number(payment['actamtpd']).toFixed(2),
      //     returned : Number(Number(payment['actamtpd']) - Number(payment['paymentamount'])).toFixed(2)
      //   }
      // })
      // let payment = {
      //   type: 'split',
      //   list : list
      // }
      // 
      // txhdr['payments'] = payment

      // 9. Assign Cashier Name on Receipt
      //  //This step includes name of cashier on receipt. cashier which created the TX
      //  txhdr["cashier"]=txCashier["firstname"]+" "+txCashier["lastname"]
      // 
      //  reprint_receipt['txhdr'] = txhdr
    },

    "re-print receipt button click": function() {
      // 1. Insert
      var _success = false;
      var _error = null;
      
      var _result = null;
      try {
        var _from = "TRANSACTIONSPECIALS";
        var _data = {
          "what": 'Reprint',
          "reasoncodeskey": reprint_receipt["reprint_reason"],
          "transactionheaderkey": reprint_receipt['txhdr']['txhdrkey'],
          "userskey": pjs.session['usersKey'],
          "otherdesc": reprint_receipt["otherDescription"],
          "delete": 'N'
        };
      
        _result = pjs.data.add(_from, _data);
        _success = true;
      }
      catch(err) {
        _error = err;
        console.error(err);
      }
      

      // 2. Generate Receipt
      var parms = {};
      parms["locationTaxRate"] = reprint_receipt['txhdr']['taxrate'];
      parms["discount_print"] = reprint_receipt['txhdr']['viewdisc'];
      parms["receiptQty"] = 1;
      parms["split"] = true;
      parms["paymentMethod"] = null;
      parms["paymentList"] = reprint_receipt['txhdr']['payments'];
      parms["txhdr"] = reprint_receipt['txhdr'];
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GenerateCustomerAndWashBayReceipt.module.json");
        _results = pjsModule["Generate Customer Receipt"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      reprint_receipt['receiptHTML'] = _results ? _results["receiptHTML"] : null;

      // 3. Customer Receipt
      // var fs = require('fs');
      // let ejs = require('ejs');
      // let path = require('path')
      // var templateString = fs.readFileSync(path.join(__dirname, 'templates', 'customer-receipt.ejs'), 'utf-8');
      // let html = ejs.render(templateString, {txhdr: reprint_receipt['txhdr']});
      // 
      // 
      // // var _data = {
      // //   "from" : "judy.reynolds35@ethereal.email",
      // //   "to": "test@truckmat.com",
      // //   "subject": "Truckomat Invoice",
      // //   "html": html,
      // // };
      // // var _info = pjs.sendEmail(_data);
      // 
      // reprint_receipt['receiptHTML'] = JSON.stringify({html:html, quantity:1})
      // 
      // 
    },

    "close button click": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Clear Search Fields
      //clear search
      companies['csearch'] = ''
      companies['tsearch'] = ''
      cashierscreen['psearch'] = ''
      cashierscreen['tsearch'] = ''
      paymentscreen['tsearch'] = ''
      view_transaction['tsearch'] = ''
      cashierscreen_shiftsales['tsearch'] = ''
      
      
      

      // 3. Clear reprint receipt html
      reprint_receipt['receiptHTML'] = ''

      // 4. Show previous screen
      let previousScreen = screenHistory[screenHistory.length - 2];
      if (previousScreen) {
        activeScreen = screens[previousScreen];
        screenHistory.pop();
      }
      return;
    },

    "receipt notes cancel": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. set receipt notes
      Object.assign(receipt_notes, {
        "receipt_notes": receipt_notes["prev_value"]
      });

      // 3. Show previous screen
      let previousScreen = screenHistory[screenHistory.length - 2];
      if (previousScreen) {
        activeScreen = screens[previousScreen];
        screenHistory.pop();
      }
      return;
    },

    "cancel required field": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. set requried fields
      Object.assign(required_fields, {
        "ponum": required_fields["prev_po"],
        "drvid": required_fields["prev_driver"],
        "tripnum": required_fields["prev_trip"]
      });

      // 3. Show previous screen
      let previousScreen = screenHistory[screenHistory.length - 2];
      if (previousScreen) {
        activeScreen = screens[previousScreen];
        screenHistory.pop();
      }
      return;
    },

    "remove product from receipt": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. Remove grid records
      display.receipt.applyFilter(gridRecord => {
        if (gridRecord["item_name"] == activeGridRecord["item_name"]) return false;
        else return true;
      });

      // 3. Po_Required XREF
      /*
        Recheck on what fields are required, PO Number, Driver id, trip number
        after the item is removed from receipt grid. 
        PO Number is also product specific-Business logic. 
      */
      var _data = display.receipt.getRecords();
         
      var prdkeys=_data.map(function (data) { return Number(data.prdkey) });
      
      if(prdkeys.length == 0){
          var requiredItems = []
          cashierscreen["po_required"] = false
          cashierscreen["has_requirements"] = false
          required_fields['ponum'] = ''
      
          if(cashierscreen['po_option'] == 'Y'){
            cashierscreen["po_required"] = true
            cashierscreen["has_requirements"] = true
            requiredItems.push("PO #")      
          }
          if(cashierscreen["driverId_required"]){
            cashierscreen["has_requirements"] = true
            requiredItems.push("Driver ID")      
          }
          if(cashierscreen["tripNumber_required"]){
            cashierscreen["has_requirements"] = true
            requiredItems.push("Trip #")
            
          }
          cashierscreen["req_items"] = "Required : " + requiredItems.toString()
      
      }
      else if(cashierscreen['po_option']=='M' || cashierscreen['po_option']=='B')
      {
        prdkeys=prdkeys.join(',');
        var sql="SELECT CCREQPOKEY FROM CCREQPO where CCKEY=? and   PRDKEY IN ( "+prdkeys+") AND PRDKEY NOT IN(?) ";
        var result=pjs.query(sql,[cashierscreen['company_id'],activeGridRecord["prdkey"]]);
      
        if(result.length===0)
        {
          var requiredItems = []
          cashierscreen["po_required"] = false
          cashierscreen["has_requirements"] = false
          required_fields['ponum'] = ''
      
          if(cashierscreen["driverId_required"]){
            cashierscreen["has_requirements"] = true
            requiredItems.push("Driver ID")
            
          }
          if(cashierscreen["tripNumber_required"]){
            cashierscreen["has_requirements"] = true
            requiredItems.push("Trip #")
            
          }
          cashierscreen["req_items"] = "Required : " + requiredItems.toString()
        }
      }

      // 4. Delete Reasons For Modified Price
      var _success = true;
      var _data = display.products.filter(gridRecord => {
        if (gridRecord["product"] == activeGridRecord["item_name"]) return true;
        else return false;
      });
      if (Array.isArray(_data)) _data = _data[0];
      if (!_data) {
        _data = {};
        var _error = new Error("Record not found");
        _success = false;
      }
      var removingProduct = _data;
      
      let prd = cashierscreen['modifiedPriceSpecials'].filter(item => item['prdkey'] == removingProduct['prdkey'])
      
      if(prd.length != 0)
      {
        // var q = "UPDATE TRANSACTIONSPECIALS SET DELETE = ? WHERE TXSPECKEY = ?"
        // q = pjs.query(q, ['Y', prd['txspeckey']])
        cashierscreen['modifiedPriceSpecials'] = cashierscreen['modifiedPriceSpecials'].filter(item => item['prdkey'] != removingProduct['prdkey'])
      }

      // 5. remove scrub if !eligible 
      //Validated if there is a scrub club applied there must be item in receipt grid on which we can redeem 
      
      let items = display.receipt.getRecords()
      items = items.filter((item) => item['redeemscrubclubonthisitem'] == 'Y')
      if(items.length == 0){
        //remove scrub club
        cashierscreen["scrubApply"] = {}
        scrub_club['scrub_club_invoice'] = ''
      }

      // 6. Calculate Receipt Totals
      var parms = {};
      parms["receiptRecords"] = display.receipt.getRecords();
      parms["locationSurchargeDiscount"] = pjs.session['locationSurchargeDiscount'];
      parms["locationSurchargeDiscountPercentage"] = pjs.session['locationSurchargeDiscountPercentage'];
      parms["customerTaxExempt"] = cashierscreen["customerTaxExempt"];
      parms["locationTaxRate"] = pjs.session['locationTaxRate'];
      parms["discountType"] = cashierscreen["discountType"];
      parms["coupon_discount"] = coupon["coupon_discount"];
      parms["scrubApply"] = cashierscreen["scrubApply"] ? cashierscreen["scrubApply"] : null ;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetReceiptTotals.module.json");
        _results = pjsModule["Receipt Totals"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      cashierscreen['rsubtotal'] = _results ? _results["rsubtotal"] : null;
      cashierscreen['tax'] = _results ? _results["tax"] : null;
      cashierscreen['discount'] = _results ? _results["discount"] : null;
      cashierscreen['total'] = _results ? _results["total"] : null;
      cashierscreen['nontaxable'] = _results ? _results["nontaxable"] : null;
      var errorMessage = _results ? _results["errorMessage"] : null;
      var errorFlag = _results ? _results["error"] : null;
      coupon['coupon_discount'] = _results ? _results["coupon_discount"] : null;

      // 7. Error?
      if (errorFlag && errorFlag != '0') {

        // 8. Show Error
        pjs.messageBox({
          title: ``,
          message: `${errorMessage}`
        });
      }

      // 9. Calculate Receipt Subtotal
      // cashierscreen["rsubtotal"] = display.receipt.reduce((total, record) => {
      //   var num = Number(record["rprice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      // }, 0);

      // 10. Update Receipt Total
      // /*
      //   This step calculates totals for receipt grid. 
      //   considers taxes, discounts, location based surcharges 
      // */
      // var nontaxable = 0;
      // display.receipt.forEach(function(record) {
      //   if (record.taxable == 'N' && record.loctaxable != 'Y'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      //   else if(record.taxable == 'Y' && record.loctaxable == 'N'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      // });
      // cashierscreen["nontaxable"] = nontaxable;
      // 
      // let surcharge = 0 , 
      //     discount = 0, 
      //     subtotal = cashierscreen["rsubtotal"], 
      //     tax = 0,
      //     actualTotal = 0,
      //     total = 0 
      // 
      // //Calculate total of Full prices of line items.
      // actualTotal = display.receipt.reduce((total, record) => {
      //   var num = Number(record["actualPrice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      //   }, 0);
      // 
      // 
      // //Apply Surcharges
      // if(pjs.session["locationSurchargeDiscount"] == "S"){
      //   surcharge += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"]))
      // }
      // 
      // //Determine Taxation
      // if(cashierscreen["customerTaxExempt"] == 'Y'){
      //     tax = 0
      // }
      // else if(pjs.session["locationTaxRate"])
      // {
      //   tax = Number(pjs.session["locationTaxRate"]) * (Number(cashierscreen["rsubtotal"]) - Number(cashierscreen["nontaxable"]));
      // }
      // 
      // //Apply Discounts
      // if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
      //   discount += actualTotal - Number(subtotal);
      //    subtotal = actualTotal
      // }
      // else if(cashierscreen["discountType"] == "Scrub" && Object.keys(cashierscreen["scrubApply"]).length !== 0){
      //   actualTotal == 0 ? discount = 0 : discount += Number(cashierscreen["scrubApply"]["value"])
      // }
      // else if(cashierscreen['discountType'] == 'Coupon'){
      //   if((actualTotal == 0 || actualTotal < Number(coupon['coupon_discount'])) && coupon['coupon_discount'] != undefined && coupon['coupon_discount'] != '' && coupon['coupon_discount'] != null){
      //     discount = 0 
      //     pjs.messageBox({
      //       title: '',
      //       message: `Removing Coupon, cannot apply $${coupon['coupon_discount']} on Subtotal: $${actualTotal}`
      //     })
      //     coupon['coupon_discount'] = 0 
      //   }
      //   else{
      //     discount += Number(coupon["coupon_discount"])
      //   } 
      // }
      // if(pjs.session["locationSurchargeDiscount"] == "D"){
      //   discount += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"])) 
      // }
      // 
      // //Calculate Totals
      // let taxedTotal = Math.abs(subtotal) + Math.abs(tax)
      // total = (Math.abs(taxedTotal) - Math.abs(discount) ) + surcharge
      // 
      // 
      // cashierscreen["rsubtotal"] = Number(subtotal).toFixed(2)
      // cashierscreen["discount"] = Number((Math.abs(discount))).toFixed(2)
      // cashierscreen["tax"] = Number(tax).toFixed(2)
      // cashierscreen["total"] = Number(Math.abs(total)).toFixed(2)

      // 11. Enable Buttons
      //enables save and checkout buttons
      cashierscreen["save_Disabled"]=false;
      cashierscreen["checkoutDisabled"]=false;
      

      // 12. No Product?
      if (cashierscreen["total"] == 0) {

        // 13. Disable Buttons
        cashierscreen["save_Disabled"]=true;
      }

      // 14. !allWashes and Tx Loaded from DB
      if ((cashierscreen["flag_tx_loaded_from_db"] && cashierscreen["flag_tx_loaded_from_db"] != '0') && (cashierscreen['allWashes'] == 'N')) {

        // 15. Update TXHeader
        /*
          case scenario: Transaction exists and we are trying to resave
          This step updates Transactions summary in transactions header table. 
        */
        var updatedReceipt = display.receipt.getRecords();
        
        try{
        var values = [
                        globals['clientTime'],
                        cashierscreen["rsubtotal"],
                        cashierscreen["total"],
                        cashierscreen["tax"],
                        cashierscreen["customer_notes"],               
                      ];
        
          var columns ="";
          if(cashierscreen["po_required"]){
            columns += ", PONUMBER = ?"
             
            values.push(required_fields["ponum"])
          }
          if(cashierscreen["tripNumber_required"]){
            columns += ", TRIPNUMBER = ?"
            
            values.push(required_fields["tripnum"])
          }
          if(cashierscreen["driverId_required"]){
            columns += ", DRIVERID = ?"
           
            values.push(required_fields["drvid"])
          }
          values.push(cashierscreen["flag_tx_loaded_from_db_id"])
          var query = "UPDATE TRANSACTIONSHEADER SET LOCALTS1 = ? , ORDERTOTAL$=? ,  DISCOUNTEDTOTAL$=?, TAXTOTAL$=?, CASHIERMESSAGE=?" +columns+ " WHERE TXHDRKEY = ?" ;
          var _records = pjs.query(query, values)
          var txHdr = {
            "corporatecustomerskey" : cashierscreen["comp_name"]
          }
          if((cashierscreen["tractor_number"] == '' || cashierscreen['trailer_number'] == '') && cashierscreen['TractorTrailerRequired'])
            txHdr["tractornbr"] = cashierscreen["tractor_number"];
          if(cashierscreen["trailer_number"] != '')
            txHdr["trailernbr"] = cashierscreen["trailer_number"];
        
          if(cashierscreen["tractor_number"] != '' && cashierscreen["trailer_number"] != '')
          {
            var query = "SELECT DRIVERSKEY FROM DRIVERS WHERE CORPCUSTKEY = ? AND CORPTRUCKKEY = ? AND CORPTRAILERKEY = ?"
            var driverkey = pjs.query(query, [cashierscreen["comp_name"], cashierscreen["tractor_number"], cashierscreen["trailer_number"]]);
            if(driverkey != [] && Object.keys(driverkey).length != 0){
              txHdr["driverskey"] = driverkey["driverskey"];
            }   
          }
         
        }
        catch (err){
          //error occurred
        }
        cashierscreen["flag_tx_loaded_from_db"] = false

        // 16. Update TXDetails
        /*
          case scenario: Resave a transaction after opening and changing 'Open' Status
          This step will replace Products purchased in transaction details table
        */
        var _error = null
        var _success = null
        try {
          var query = "UPDATE TRANSACTIONDETAILS SET DELETE=?, DELETEDBY=?, DELETEDTS=?, LSTTOUCHBY=? WHERE TRANSACTIONSHEADERKEY=? ";
        
          var values = [
                      "Y",
                      pjs.session['usersKey'],
                      globals['clientTime'],
                      pjs.session['usersKey'],
                      cashierscreen["flag_tx_loaded_from_db_id"]
                    ];
        
          var _records = pjs.query(query, values)
          var txhdrkey = cashierscreen["flag_tx_loaded_from_db_id"];
          var productsDetails = display.receipt.getRecords().map((product) => {
          return {
            "transactionsheaderkey" : txhdrkey,
            "productskey" : product["prdkey"],
            "quantity":  product["qty"],
            "costfull": product["actualPrice"],
            "cost": product["rprice"],
            "delete": 'N'
          }
          })
          query = "INSERT INTO TRANSACTIONDETAILS SET ?";
          _records = pjs.query(query, productsDetails)
          _success = true;
        }
        catch (err) {
          _records = [];
          _error = err;
          console.log(err)
        }

        // 17. Refresh Products
        logic["Refresh Products"]();

        // 18. Refresh Transactions
        logic["Refresh Today's Transaction"]();
      }
    },

    "add other wash": function() {
      // 1. Work variable Active Grid Record
      var activeGridRecord = add_other['activeGridRecord'];

      // 2. Add Product To Reciept
      /*
        This step will Add the product to Receipt grid with quantity 1 and unit price (Based on discounted or not)
      */
      
      //Checks if PO is required for this specific product. 
      if(cashierscreen['po_option']=='M' || cashierscreen['po_option']=='B')
      {
        var sql="SELECT CCREQPOKEY FROM CCREQPO where CCKEY=? and PRDKEY=? ";
        var result=pjs.query(sql,[cashierscreen['company_id'],activeGridRecord["prdkey"]]);
      
        if(result.length!==0)
        {
          var requiredItems = []
          cashierscreen["po_required"] = true
          cashierscreen["has_requirements"] = true
          requiredItems.push("PO#")
          required_fields['ponum'] = cashierscreen['currentPO']
          if(cashierscreen["driverId_required"]){ 
            requiredItems.push("Driver ID")  
          }
          if(cashierscreen["tripNumber_required"]){
            requiredItems.push("Trip #") 
          }
          cashierscreen["req_items"] = "Required : " + requiredItems.toString()
        }
      }
      var viewdiscount=false;
      var viewactual=true;
      if(cashierscreen["discount_print"]==="Discount")
      {
        viewactual=false;
        viewdiscount=true;
      }
      
      // Adds product to Receipt Grid, With discounted price, actual price, SCrub club other preferences. 
      display.receipt.unshift({
        canEdit: false,
        displayActual:viewactual,
        displayDiscount:viewdiscount,
        "item_name": activeGridRecord["product"],
        "qty": 1,
        "taxable": activeGridRecord["taxable"],
        "rprice": Number(add_other["price"]).toFixed(2),
        "prdkey": activeGridRecord["prdkey"],
        "actualPrice":Number(add_other["price"]).toFixed(2),
        "givescrubclubforthisitem": activeGridRecord["givescrubclubforthisitem"],
        "redeemscrubclubonthisitem" : activeGridRecord["redeemscrubclubonthisitem"]
      });

      // 3. Calculate Receipt Totals
      var parms = {};
      parms["receiptRecords"] = display.receipt.getRecords();
      parms["locationSurchargeDiscount"] = pjs.session['locationSurchargeDiscount'];
      parms["locationSurchargeDiscountPercentage"] = pjs.session['locationSurchargeDiscountPercentage'];
      parms["customerTaxExempt"] = cashierscreen["customerTaxExempt"];
      parms["locationTaxRate"] = pjs.session['locationTaxRate'];
      parms["discountType"] = cashierscreen["discountType"];
      parms["coupon_discount"] = coupon["coupon_discount"];
      parms["scrubApply"] = cashierscreen["scrubApply"] ? cashierscreen["scrubApply"] : null ;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetReceiptTotals.module.json");
        _results = pjsModule["Receipt Totals"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      cashierscreen['rsubtotal'] = _results ? _results["rsubtotal"] : null;
      cashierscreen['tax'] = _results ? _results["tax"] : null;
      cashierscreen['discount'] = _results ? _results["discount"] : null;
      cashierscreen['total'] = _results ? _results["total"] : null;
      cashierscreen['nontaxable'] = _results ? _results["nontaxable"] : null;
      var errorMessage = _results ? _results["errorMessage"] : null;
      var errorFlag = _results ? _results["error"] : null;
      coupon['coupon_discount'] = _results ? _results["coupon_discount"] : null;

      // 4. Error?
      if (errorFlag && errorFlag != '0') {

        // 5. Show Error
        pjs.messageBox({
          title: ``,
          message: `${errorMessage}`
        });
      }

      // 6. Update Receipt SubTotal
      // cashierscreen["rsubtotal"] = display.receipt.reduce((total, record) => {
      //   var num = Number(record["rprice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      // }, 0);

      // 7. Update Receipt Total
      // /*
      //   This step calculates Totals of Receipt Grid. 
      //   considers Taxable/Non taxable items
      //   Considers Discounts. 
      //   Considers Surcharges and location based tax rates
      // */
      // 
      // var nontaxable = 0;
      // display.receipt.forEach(function(record) {
      //   if (record.taxable == 'N' && record.loctaxable != 'Y'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      //   else if(record.taxable == 'Y' && record.loctaxable == 'N'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      // });
      // cashierscreen["nontaxable"] = nontaxable;
      // 
      // let surcharge = 0 , 
      //     discount = 0, 
      //     subtotal = cashierscreen["rsubtotal"], 
      //     tax = 0,
      //     actualTotal = 0,
      //     total = 0 
      // 
      // //Calculate total of Full prices of line items.
      // actualTotal = display.receipt.reduce((total, record) => {
      //   var num = Number(record["actualPrice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      //   }, 0);
      // 
      // 
      // //Apply Surcharges
      // if(pjs.session["locationSurchargeDiscount"] == "S"){
      //   surcharge += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"]))
      // }
      // 
      // //Determine Taxation
      // if(cashierscreen["customerTaxExempt"] == 'Y'){
      //     tax = 0
      // }
      // else if(pjs.session["locationTaxRate"])
      // {
      //   tax = Number(pjs.session["locationTaxRate"]) * (Number(cashierscreen["rsubtotal"]) - Number(cashierscreen["nontaxable"]));
      // }
      // 
      // //Apply Discounts
      // if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
      //   discount += actualTotal - Number(subtotal);
      //   subtotal = actualTotal
      // }
      // else if(cashierscreen["discountType"] == "Scrub" && Object.keys(cashierscreen["scrubApply"]).length !== 0){
      //   discount += Number(cashierscreen["scrubApply"]["value"])
      // }
      // else if(cashierscreen['discountType'] == 'Coupon'){
      //   if(coupon['coupon_discount'])
      //     discount += Number(coupon["coupon_discount"])
      // }
      // if(pjs.session["locationSurchargeDiscount"] == "D"){
      //   discount += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"])) 
      // }
      // 
      // //Calculate Totals
      // let taxedTotal = Math.abs(subtotal) + Math.abs(tax)
      // total = (Math.abs(taxedTotal) - Math.abs(discount) ) + surcharge
      // 
      // 
      // cashierscreen["rsubtotal"] = Number(subtotal).toFixed(2)
      // cashierscreen["discount"] = Number((Math.abs(discount))).toFixed(2)
      // cashierscreen["tax"] = Number(tax).toFixed(2)
      // cashierscreen["total"] = Number(Math.abs(total)).toFixed(2)

      // 8. Enable Save/Checkout
      cashierscreen["save_Disabled"]=false;
      cashierscreen["checkoutDisabled"]=false;
      

      // 9. Show cashier screen
      screenHistory.push("cashierscreen");
      activeScreen = screens["cashierscreen"];
      return;
    },

    "re enter totals button click": function() {
      // Call Z out totals Routine
      logic["Z-Out Totals Screen"]();
    },

    "Modify Price": function() {
      // 1. Work variable Active Grid Record
      var activeGridRecord = add_dynamic_pricing['activeGridRecord'];

      // 2. Maintain Variable for Reasons
      var _success = false;
      var _error = null;
      
      var _result = null;
      try {
        // var columns = "WHAT , REASONCODESKEY, USERSKEY, OTHERDESC, DELETE"
        // var values = [
        //   'Price',
        //   add_dynamic_pricing['dynamic_reason'],
        //   pjs.session['usersKey'],
        //   add_dynamic_pricing['dynamic_description'],
        //   'N'
        // ]
        // var insert = "SELECT TXSPECKEY FROM NEW TABLE "+
        //             "(INSERT INTO TRANSACTIONSPECIALS("+columns+") "+
        //             "VALUES(?, ?, ?, ?, ?))"  
        // _result = pjs.query(insert, values)
        
        let special = {
          prdkey: activeGridRecord['prdkey'],
          product: activeGridRecord['product'],
          what : 'Price',
          reasoncodeskey : add_dynamic_pricing['dynamic_reason'],
          userskey : pjs.session['usersKey'],
          otherdesc: add_dynamic_pricing['dynamic_description'],
          
          delete : 'N'
        }
      
        cashierscreen['modifiedPriceSpecials'].push(special)
        
        _success = true;
      }
      catch(err) {
        _error = err;
        console.error(err);
      }
      

      // 3. Add Product To Reciept
      /*
        This step will Add the product to Receipt grid with quantity 1 and unit price (Based on discounted or not)
      */
      
      //Checks if PO is required for this specific product. 
      if(cashierscreen['po_option']=='M' || cashierscreen['po_option']=='B')
      {
        var sql="SELECT CCREQPOKEY FROM CCREQPO where CCKEY=? and PRDKEY=? ";
        var result=pjs.query(sql,[cashierscreen['company_id'],activeGridRecord["prdkey"]]);
      
        if(result.length!==0)
        {
          var requiredItems = []
          cashierscreen["po_required"] = true
          cashierscreen["has_requirements"] = true
          requiredItems.push("PO#")
          required_fields['ponum'] = cashierscreen['currentPO']
          if(cashierscreen["driverId_required"]){ 
            requiredItems.push("Driver ID")  
          }
          if(cashierscreen["tripNumber_required"]){
            requiredItems.push("Trip #") 
          }
          cashierscreen["req_items"] = "Required : " + requiredItems.toString()
        }
      }
      var viewdiscount=false;
      var viewactual=true;
      if(cashierscreen["discount_print"]==="Discount")
      {
        viewactual=false;
        viewdiscount=true;
      }
      
      //Apply discount. 
      if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
          var discountItem = cashierscreen["discountList"];
          if((Object.keys(discountItem).length != 0) && activeGridRecord['discountable'] == 'Y'){
            //item price has discount
            let discountvalue = discountItem.filter((item) => item['category'] == activeGridRecord['category'])
            if(discountvalue.length != 0){
              activeGridRecord["discountPrice"] = (Number(activeGridRecord["price"]) + Number(add_dynamic_pricing["dynamic_price"])) * (1-Number(discountvalue[0]["percentage"]))
            }
            //is not discountable
            else{
              activeGridRecord["discountPrice"] = (Number(activeGridRecord["price"]) + Number(add_dynamic_pricing["dynamic_price"]))
            }
          }
          //is not discountable
          else{
            activeGridRecord["discountPrice"] = (Number(activeGridRecord["price"]) + Number(add_dynamic_pricing["dynamic_price"]))
          }
        }
        //is not discountable
        else{
          activeGridRecord["discountPrice"] = (Number(activeGridRecord["price"]) + Number(add_dynamic_pricing["dynamic_price"]))
        }
      
      
      // Adds product to Receipt Grid, With discounted price, actual price, SCrub club other preferences. 
      display.receipt.unshift({
        canEdit: true,
        displayActual:viewactual,
        displayDiscount:viewdiscount,
        "item_name": activeGridRecord["product"],
        "qty": 1,
        "taxable": activeGridRecord["taxable"],
        "rprice": Number(activeGridRecord['discountPrice']).toFixed(2),
        "specialUnitPrice": Number(activeGridRecord['discountPrice']).toFixed(2),
        "specialUnitActualPrice":Number((Number(activeGridRecord["price"]) + Number(add_dynamic_pricing["dynamic_price"]))).toFixed(2),
        "specialOriginalPrice": Number(activeGridRecord["price"]),
        "prdkey": activeGridRecord["prdkey"],
        "actualPrice":Number((Number(activeGridRecord["price"]) + Number(add_dynamic_pricing["dynamic_price"]))).toFixed(2),
        "givescrubclubforthisitem": activeGridRecord["givescrubclubforthisitem"],
        "redeemscrubclubonthisitem" : activeGridRecord["redeemscrubclubonthisitem"]
      });

      // 4. Calculate Receipt Totals
      var parms = {};
      parms["receiptRecords"] = display.receipt.getRecords();
      parms["locationSurchargeDiscount"] = pjs.session['locationSurchargeDiscount'];
      parms["locationSurchargeDiscountPercentage"] = pjs.session['locationSurchargeDiscountPercentage'];
      parms["customerTaxExempt"] = cashierscreen["customerTaxExempt"];
      parms["locationTaxRate"] = pjs.session['locationTaxRate'];
      parms["discountType"] = cashierscreen["discountType"];
      parms["coupon_discount"] = coupon["coupon_discount"];
      parms["scrubApply"] = cashierscreen["scrubApply"] ? cashierscreen["scrubApply"] : null ;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetReceiptTotals.module.json");
        _results = pjsModule["Receipt Totals"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      cashierscreen['rsubtotal'] = _results ? _results["rsubtotal"] : null;
      cashierscreen['tax'] = _results ? _results["tax"] : null;
      cashierscreen['discount'] = _results ? _results["discount"] : null;
      cashierscreen['total'] = _results ? _results["total"] : null;
      cashierscreen['nontaxable'] = _results ? _results["nontaxable"] : null;
      var errorMessage = _results ? _results["errorMessage"] : null;
      var errorFlag = _results ? _results["error"] : null;
      coupon['coupon_discount'] = _results ? _results["coupon_discount"] : null;

      // 5. Error?
      if (errorFlag && errorFlag != '0') {

        // 6. Show Error
        pjs.messageBox({
          title: ``,
          message: `${errorMessage}`
        });
      }

      // 7. Update Receipt SubTotal
      // cashierscreen["rsubtotal"] = display.receipt.reduce((total, record) => {
      //   var num = Number(record["rprice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      // }, 0);

      // 8. Update Receipt Total
      // /*
      //   This step calculates Totals of Receipt Grid. 
      //   considers Taxable/Non taxable items
      //   Considers Discounts. 
      //   Considers Surcharges and location based tax rates
      // */
      // 
      // var nontaxable = 0;
      // display.receipt.forEach(function(record) {
      //   if (record.taxable == 'N' && record.loctaxable != 'Y'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      //   else if(record.taxable == 'Y' && record.loctaxable == 'N'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      // });
      // cashierscreen["nontaxable"] = nontaxable;
      // 
      // let surcharge = 0 , 
      //     discount = 0, 
      //     subtotal = cashierscreen["rsubtotal"], 
      //     tax = 0,
      //     actualTotal = 0,
      //     total = 0 
      // 
      // //Calculate total of Full prices of line items.
      // actualTotal = display.receipt.reduce((total, record) => {
      //   var num = Number(record["actualPrice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      //   }, 0);
      // 
      // 
      // //Apply Surcharges
      // if(pjs.session["locationSurchargeDiscount"] == "S"){
      //   surcharge += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"]))
      // }
      // 
      // //Determine Taxation
      // if(cashierscreen["customerTaxExempt"] == 'Y'){
      //     tax = 0
      // }
      // else if(pjs.session["locationTaxRate"])
      // {
      //   tax = Number(pjs.session["locationTaxRate"]) * (Number(cashierscreen["rsubtotal"]) - Number(cashierscreen["nontaxable"]));
      // }
      // 
      // //Apply Discounts
      // if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
      //   discount += actualTotal - Number(subtotal);
      //   subtotal = actualTotal
      // }
      // else if(cashierscreen["discountType"] == "Scrub" && Object.keys(cashierscreen["scrubApply"]).length !== 0){
      //   discount += Number(cashierscreen["scrubApply"]["value"])
      // }
      // else if(cashierscreen['discountType'] == 'Coupon'){
      //   if(coupon['coupon_discount'])
      //     discount += Number(coupon["coupon_discount"])
      // }
      // if(pjs.session["locationSurchargeDiscount"] == "D"){
      //   discount += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"])) 
      // }
      // 
      // //Calculate Totals
      // let taxedTotal = Math.abs(subtotal) + Math.abs(tax)
      // total = (Math.abs(taxedTotal) - Math.abs(discount) ) + surcharge
      // 
      // 
      // cashierscreen["rsubtotal"] = Number(subtotal).toFixed(2)
      // cashierscreen["discount"] = Number((Math.abs(discount))).toFixed(2)
      // cashierscreen["tax"] = Number(tax).toFixed(2)
      // cashierscreen["total"] = Number(Math.abs(total)).toFixed(2)

      // 9. Enable Save/Checkout
      cashierscreen["save_Disabled"]=false;
      cashierscreen["checkoutDisabled"]=false;
      

      // 10. Show cashier screen
      screenHistory.push("cashierscreen");
      activeScreen = screens["cashierscreen"];
      return;
    },

    "Payment Screen Company Change": function() {
    },

    "View Transaction Company Change": function() {
    },

    "Apply Client Time": function() {
      // 1. Get Client Time
      var parms = {};
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("ClientTime.module.json");
        _results = pjsModule["ClientTime"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      var clientTime = _results ? _results["clientTime"] : null;
      var datetime = _results ? _results["timestring"] : null;

      // 2. Display Client Time
      //Display
      
      
      cashierscreen['localtimestamp_value'] = datetime;
      companies['localtimestamp_value'] = datetime;
      cashierscreen_shiftsales['localtimestamp_value'] = datetime;
      view_transaction['localtimestamp_value'] = datetime;
      paymentscreen['localtimestamp_value'] = datetime;
      

      // 3. Make Time Accessible to All Routines
      globals["clientTime"] = clientTime;
    },

    "close custom screen": function() {
      // 1. Client Time
      logic["Apply Client Time"]();

      // 2. clear Values
      Object.assign(edit_paidout, {
        "item_type": '',
        "gl_code": '',
        "extended_description": '',
        "price": '',
        "total": '',
        "customReceipts": ''
      });
      

      // 3. Remove grid records
      display.paidout_grid.applyFilter(gridRecord => {
        if (gridRecord["item_name"] && gridRecord["item_name"] != '0') return false;
        else return true;
      });

      // 4. Show previous screen
      let previousScreen = screenHistory[screenHistory.length - 2];
      if (previousScreen) {
        activeScreen = screens[previousScreen];
        screenHistory.pop();
      }
      return;
    },

    "add popular wash": function() {
      // 1. Custom Node.js
      console.log('cashierscreen', cashierscreen['popWashClicked'])

      // 2. Client Time
      logic["Apply Client Time"]();

      // 3. Fetch Product Data from Grid
      var _success = true;
      var _data = display.products.filter(gridRecord => {
        if (gridRecord["prdkey"] == cashierscreen["popWashClicked"]) return true;
        else return false;
      });
      if (Array.isArray(_data)) _data = _data[0];
      if (!_data) {
        _data = {};
        var _error = new Error("Record not found");
        _success = false;
      }
      var activeGridRecord = _data;

      // 4. Product valid for customer?
      if(Object.keys(activeGridRecord).length === 0){
        pjs.messageBox({
          title : '',
          message: 'Product not valid for selected customer'
        })
        return
      }

      // 5. Set work variable
      var matchingReceipt = null;
      var discountValue = 0;

      // 6. Find grid record(s)
      var _success = true;
      var _data = display.receipt.filter(gridRecord => {
        if (gridRecord["item_name"] == activeGridRecord["product"]) return true;
        else return false;
      });
      if (Array.isArray(_data)) _data = _data[0];
      if (!_data) {
        _data = {};
        var _error = new Error("Record not found");
        _success = false;
      }
      var matchingReceipt = _data;

      // 7. Product Exists?
      if (activeGridRecord["product"] == matchingReceipt["item_name"]) {

        // 8. Other Item?
        if ((activeGridRecord["product"] == "Other Item") || (activeGridRecord["product"] == "Other Wash")) {

          // 9. Show Message
          pjs.messageBox({
            title: ``,
            message: `Other Wash/Item already exists cannot add another in same Transaction`
          });

          // 10. Stop
          return;
        }

        // 11. Otherwise
        else {

          // 12. Price Modify?
          if (activeGridRecord["prcmodelg"] == 'Y') {

            // 13. Add Receipt Price and Qty
            /*
              This step will increase quantity and price by factor of 1. 
              If the product already exists in receipt grid. 
            */
            display.receipt.applyMap(gridRecord => {
              if (gridRecord["item_name"] == activeGridRecord["product"]) {
                gridRecord["qty"] += 1
                gridRecord["rprice"] = gridRecord["qty"] * gridRecord["specialUnitPrice"]
                gridRecord["actualPrice"] = gridRecord["qty"] * gridRecord["specialUnitActualPrice"]
              }
              return gridRecord;
            });
          }

          // 14. Otherwise
          else {

            // 15. Add Receipt Price and Qty
             
            display.receipt.applyMap(gridRecord => {
              if (gridRecord["item_name"] == activeGridRecord["product"]) {
                gridRecord["qty"] += 1
                gridRecord["rprice"] = Number(gridRecord["qty"] * activeGridRecord["discountPrice"]).toFixed(2)
                gridRecord["actualPrice"] = Number(gridRecord["qty"] * activeGridRecord["price"]).toFixed(2)
              }
              return gridRecord;
            });
          }
        }
      }

      // 16. Otherwise
      else {

        // 17. if does not exist
        if(Object.keys(activeGridRecord).length === 0){
          pjs.messageBox({
            title: '',
            message: 'Product Not valid for selected customer'
          })
          return
        }

        // 18. Other Item?
        if ((activeGridRecord["product"] == 'Other Item') || (activeGridRecord["product"] == 'Other Wash')) {

          // 19. Show Cost popup
          Object.assign(add_other, {
            "other_header": activeGridRecord["product"],
            "activeGridRecord": activeGridRecord,
            "price" : '0.00'
          });
          screenHistory.push("add_other");
          activeScreen = screens["add_other"];
          return;
        }

        // 20. Price Modify?
        if (activeGridRecord["prcmodelg"] == 'Y') {

          // 21. Show Modify Price Popup
          Object.assign(add_dynamic_pricing, {
            "basePrice" : activeGridRecord['price'],
            "dynamic_header": activeGridRecord["product"],
            "dynamic_price": '0.00',
            "dynamic_reason": '',
            "dynamic_description": '',
            activeGridRecord : activeGridRecord
          });
          screenHistory.push("add_dynamic_pricing");
          activeScreen = screens["add_dynamic_pricing"];
          return;
        }

        // 22. Otherwise
        else {

          // 23. Add Product To Reciept
          var viewdiscount=false;
          var viewactual=true;
          if(cashierscreen["discount_print"]==="Discount")
          {
            viewactual=false;
            viewdiscount=true;
          }
          
          display.receipt.unshift({
            canEdit:true, 
            displayActual:viewactual,
            displayDiscount:viewdiscount,
            "item_name": activeGridRecord["product"],
            "qty": 1,
            "taxable": activeGridRecord["taxable"],
            "rprice": Number(activeGridRecord["discountPrice"]).toFixed(2),
            "prdkey": activeGridRecord["prdkey"],
            "actualPrice":Number(activeGridRecord["price"]).toFixed(2),
            "givescrubclubforthisitem": activeGridRecord["givescrubclubforthisitem"],
            "redeemscrubclubonthisitem" : activeGridRecord["redeemscrubclubonthisitem"]
          });
          
        }
      }

      // 24. Calculate Receipt Totals
      var parms = {};
      parms["receiptRecords"] = display.receipt.getRecords();
      parms["locationSurchargeDiscount"] = pjs.session['locationSurchargeDiscount'];
      parms["locationSurchargeDiscountPercentage"] = pjs.session['locationSurchargeDiscountPercentage'];
      parms["customerTaxExempt"] = cashierscreen["customerTaxExempt"];
      parms["locationTaxRate"] = pjs.session['locationTaxRate'];
      parms["discountType"] = cashierscreen["discountType"];
      parms["coupon_discount"] = coupon["coupon_discount"];
      parms["scrubApply"] = cashierscreen["scrubApply"] ? cashierscreen["scrubApply"] : null ;
      
      var _success = false;
      var _error = null;   
      var _results = null;
      
      try {
        var pjsModule = pjs.require("GetReceiptTotals.module.json");
        _results = pjsModule["Receipt Totals"](parms);
        _success = true;
      }
      catch (err) {
        _error = err;
        console.error(err);
      }
      
      cashierscreen['rsubtotal'] = _results ? _results["rsubtotal"] : null;
      cashierscreen['tax'] = _results ? _results["tax"] : null;
      cashierscreen['discount'] = _results ? _results["discount"] : null;
      cashierscreen['total'] = _results ? _results["total"] : null;
      cashierscreen['nontaxable'] = _results ? _results["nontaxable"] : null;
      var errorMessage = _results ? _results["errorMessage"] : null;
      var errorFlag = _results ? _results["error"] : null;
      coupon['coupon_discount'] = _results ? _results["coupon_discount"] : null;

      // 25. Error?
      if (errorFlag && errorFlag != '0') {

        // 26. Show Error
        pjs.messageBox({
          title: ``,
          message: `${errorMessage}`
        });
      }

      // 27. Update Receipt SubTotal
      // cashierscreen["rsubtotal"] = display.receipt.reduce((total, record) => {
      //   var num = Number(record["rprice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      // }, 0);

      // 28. Update Receipt Total
      // var nontaxable = 0;
      // display.receipt.forEach(function(record) {
      //   if (record.taxable == 'N' && record.loctaxable != 'Y'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      //   else if(record.taxable == 'Y' && record.loctaxable == 'N'){
      //     nontaxable += Number(record["rprice"]);
      //   }
      // });
      // cashierscreen["nontaxable"] = nontaxable;
      // 
      // let surcharge = 0 , 
      //     discount = 0, 
      //     subtotal = cashierscreen["rsubtotal"], 
      //     tax = 0,
      //     actualTotal = 0,
      //     total = 0 
      // 
      // //Calculate total of Full prices of line items.
      // actualTotal = display.receipt.reduce((total, record) => {
      //   var num = Number(record["actualPrice"]);
      //   if (isNaN(num)) num = 0;
      //   return total + num;
      //   }, 0);
      // 
      // 
      // //Apply Surcharges
      // if(pjs.session["locationSurchargeDiscount"] == "S"){
      //   surcharge += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"]))
      // }
      // 
      // //Determine Taxation
      // if(cashierscreen["customerTaxExempt"] == 'Y'){
      //     tax = 0
      // }
      // else if(pjs.session["locationTaxRate"])
      // {
      //   tax = Number(pjs.session["locationTaxRate"]) * (Number(cashierscreen["rsubtotal"]) - Number(cashierscreen["nontaxable"]));
      // }
      // 
      // //Apply Discounts
      // if(cashierscreen["discountType"] == "Percent" || cashierscreen["discountType"] == "Sliding"){
      //   discount += actualTotal - Number(subtotal);
      //    subtotal = actualTotal
      // }
      // if(pjs.session["locationSurchargeDiscount"] == "D"){
      //   discount += actualTotal * (1-Number(pjs.session["locationSurchargeDiscountPercentage"])) 
      // }
      // 
      // //Calculate Totals
      // let taxedTotal = Math.abs(subtotal) + Math.abs(tax)
      // total = (Math.abs(taxedTotal) - Math.abs(discount) ) + surcharge
      // 
      // 
      // cashierscreen["rsubtotal"] = Number(subtotal).toFixed(2)
      // cashierscreen["discount"] = Number((Math.abs(discount))*(-1)).toFixed(2)
      // cashierscreen["tax"] = Number(tax).toFixed(2)
      // cashierscreen["total"] = Number(Math.abs(total)).toFixed(2)

      // 29. Get Suggested Products
      
      const utility = require('../common-apis/utility.js')
      
      var _success = false;
      var _error = null;
      
      var _records = null;
      try {
      
        var query = "SELECT PRODUCTKITTING.KITPRODUCTID FROM PRODUCTKITTING WHERE PRODUCTKITTING.PRODUCTSKEY = ?"
        _records = pjs.query(query, [activeGridRecord["prdkey"]]);
        //If kit is available
        if(_records.length != 0 && _records !== undefined && _records !== [] && _records != null){
          var kitID = _records[0]["kitproductid"];
          var query = "SELECT PRODUCTS.PRDKEY, PRODUCTPRICE.PRICE, PRODUCTS.PRODUCT as suggested_wash_type "+
                      "FROM PRODUCTS INNER JOIN PRODUCTKITTING ON PRODUCTS.PRDKEY = PRODUCTKITTING.PRODUCTSKEY " +
                      " INNER JOIN PRODUCTPRICE ON PRODUCTPRICE.PRODUCTSKEY = PRODUCTS.PRDKEY " + 
                      "WHERE PRODUCTKITTING.KITPRODUCTID = ?";
          _records = pjs.query(query, [kitID]);
          var suggestions =  display.suggestions.getRecords(); 
          suggestions = _records.filter( el => {
              return !suggestions.find(element => {
                return element["suggested_wash_type"] === el["suggested_wash_type"];
              });
          });
      
          display.suggestions.addRecords(suggestions);
          suggestions = display.suggestions.getRecords();
      
      
      
          cashierscreen["product_suggession"] = suggestions;
          if(suggestions && (cashierscreen["additionalItems"] == '' && typeof cashierscreen["additionalItems"] == 'undefined'))
          {
                var recieptRecords = display.receipt.getRecords();
          suggestions = suggestions.filter(el => {
              return !recieptRecords.find(element => {
                return element["item_name"] === el["suggested_wash_type"];
              });
          });
            display.suggestions.replaceRecords(suggestions);
          }
          else if(suggestions && cashierscreen["additionalItems"])
          {
            var finalsuggestItem = utility.arrayUnique(cashierscreen["additionalItems"].concat(suggestions));
                var recieptRecords = display.receipt.getRecords();
          finalsuggestItem = finalsuggestItem.filter(el => {
              return !recieptRecords.find(element => {
                return element["item_name"] === el["suggested_wash_type"];
              });
          });
            display.suggestions.replaceRecords(finalsuggestItem) 
          }
          _success = true;
        }
      }
      catch (err) {
        _records = [];
        _error = err;
      }
      

      // 30. Enable Buttons
      cashierscreen["save_Disabled"]=false;
      cashierscreen["checkoutDisabled"]=false;
      
    }

  }

  // Screen data objects
  let cashierscreen = {};
  let cashierscreen_shiftsales = {};
  let companies = {};
  let paymentscreen = {};
  let view_transaction = {};
  let coupon = {};
  let custom = {};
  let message_confirmation = {};
  let message_timed = {};
  let receipt_notes = {};
  let scrub_club = {};
  let truck_view = {};
  let void_transaction = {};
  let zout_menu = {};
  let zout_totals = {};
  let zout_good = {};
  let zout_bad = {};
  let manual_credit = {};
  let email_receipt = {};
  let required_fields = {};
  let reprint_receipt = {};
  let edit_paidout = {};
  let edit_vending_vacuum = {};
  let zon_voice = {};
  let add_other = {};
  let add_dynamic_pricing = {};

  // Screen processing
  let screens = {
    
    cashierscreen: {
      show: function() {
        while (activeScreen === this) {
          display.cashierscreen.execute(cashierscreen);
          activeGridRecord = display.getActiveGridRecord(cashierscreen);
          let routineName = cashierscreen._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    cashierscreen_shiftsales: {
      show: function() {
        while (activeScreen === this) {
          display.cashierscreen_shiftsales.execute(cashierscreen_shiftsales);
          activeGridRecord = display.getActiveGridRecord(cashierscreen_shiftsales);
          let routineName = cashierscreen_shiftsales._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    companies: {
      show: function() {
        while (activeScreen === this) {
          // initial routine
          logic["Companies Screen Initial"]();
          if (activeScreen !== this) break;
      
          display.companies.execute(companies);
          activeGridRecord = display.getActiveGridRecord(companies);
          let routineName = companies._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    paymentscreen: {
      show: function() {
        while (activeScreen === this) {
          display.paymentscreen.execute(paymentscreen);
          activeGridRecord = display.getActiveGridRecord(paymentscreen);
          let routineName = paymentscreen._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    view_transaction: {
      show: function() {
        while (activeScreen === this) {
          display.view_transaction.execute(view_transaction);
          activeGridRecord = display.getActiveGridRecord(view_transaction);
          let routineName = view_transaction._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    coupon: {
      show: function() {
        while (activeScreen === this) {
          display.coupon.execute(coupon);
          activeGridRecord = display.getActiveGridRecord(coupon);
          let routineName = coupon._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    custom: {
      show: function() {
        while (activeScreen === this) {
          display.custom.execute(custom);
          activeGridRecord = display.getActiveGridRecord(custom);
          let routineName = custom._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    message_confirmation: {
      show: function() {
        while (activeScreen === this) {
          display.message_confirmation.execute(message_confirmation);
          activeGridRecord = display.getActiveGridRecord(message_confirmation);
          let routineName = message_confirmation._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    message_timed: {
      show: function() {
        while (activeScreen === this) {
          display.message_timed.execute(message_timed);
          activeGridRecord = display.getActiveGridRecord(message_timed);
          let routineName = message_timed._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    receipt_notes: {
      show: function() {
        while (activeScreen === this) {
          display.receipt_notes.execute(receipt_notes);
          activeGridRecord = display.getActiveGridRecord(receipt_notes);
          let routineName = receipt_notes._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    scrub_club: {
      show: function() {
        while (activeScreen === this) {
          display.scrub_club.execute(scrub_club);
          activeGridRecord = display.getActiveGridRecord(scrub_club);
          let routineName = scrub_club._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    truck_view: {
      show: function() {
        while (activeScreen === this) {
          display.truck_view.execute(truck_view);
          activeGridRecord = display.getActiveGridRecord(truck_view);
          let routineName = truck_view._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    void_transaction: {
      show: function() {
        while (activeScreen === this) {
          display.void_transaction.execute(void_transaction);
          activeGridRecord = display.getActiveGridRecord(void_transaction);
          let routineName = void_transaction._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    zout_menu: {
      show: function() {
        while (activeScreen === this) {
          display.zout_menu.execute(zout_menu);
          activeGridRecord = display.getActiveGridRecord(zout_menu);
          let routineName = zout_menu._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    zout_totals: {
      show: function() {
        while (activeScreen === this) {
          display.zout_totals.execute(zout_totals);
          activeGridRecord = display.getActiveGridRecord(zout_totals);
          let routineName = zout_totals._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    zout_good: {
      show: function() {
        while (activeScreen === this) {
          display.zout_good.execute(zout_good);
          activeGridRecord = display.getActiveGridRecord(zout_good);
          let routineName = zout_good._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    zout_bad: {
      show: function() {
        while (activeScreen === this) {
          display.zout_bad.execute(zout_bad);
          activeGridRecord = display.getActiveGridRecord(zout_bad);
          let routineName = zout_bad._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    manual_credit: {
      show: function() {
        while (activeScreen === this) {
          display.manual_credit.execute(manual_credit);
          activeGridRecord = display.getActiveGridRecord(manual_credit);
          let routineName = manual_credit._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    email_receipt: {
      show: function() {
        while (activeScreen === this) {
          display.email_receipt.execute(email_receipt);
          activeGridRecord = display.getActiveGridRecord(email_receipt);
          let routineName = email_receipt._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    required_fields: {
      show: function() {
        while (activeScreen === this) {
          display.required_fields.execute(required_fields);
          activeGridRecord = display.getActiveGridRecord(required_fields);
          let routineName = required_fields._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    reprint_receipt: {
      show: function() {
        while (activeScreen === this) {
          display.reprint_receipt.execute(reprint_receipt);
          activeGridRecord = display.getActiveGridRecord(reprint_receipt);
          let routineName = reprint_receipt._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    edit_paidout: {
      show: function() {
        while (activeScreen === this) {
          display.edit_paidout.execute(edit_paidout);
          activeGridRecord = display.getActiveGridRecord(edit_paidout);
          let routineName = edit_paidout._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    edit_vending_vacuum: {
      show: function() {
        while (activeScreen === this) {
          display.edit_vending_vacuum.execute(edit_vending_vacuum);
          activeGridRecord = display.getActiveGridRecord(edit_vending_vacuum);
          let routineName = edit_vending_vacuum._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    zon_voice: {
      show: function() {
        while (activeScreen === this) {
          display.zon_voice.execute(zon_voice);
          activeGridRecord = display.getActiveGridRecord(zon_voice);
          let routineName = zon_voice._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    add_other: {
      show: function() {
        while (activeScreen === this) {
          display.add_other.execute(add_other);
          activeGridRecord = display.getActiveGridRecord(add_other);
          let routineName = add_other._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    },
    
    add_dynamic_pricing: {
      show: function() {
        while (activeScreen === this) {
          display.add_dynamic_pricing.execute(add_dynamic_pricing);
          activeGridRecord = display.getActiveGridRecord(add_dynamic_pricing);
          let routineName = add_dynamic_pricing._routine;
          if (routineName && typeof logic[routineName] === "function") logic[routineName]();
        }
      }
    }

  }

  // Run application
  let display = pjs.defineDisplay({ file: "cashier.json", mode: "case-sensitive" });
  let activeScreen = screens["cashierscreen"];  // Default screen
  let activeGridRecord = {};
  logic["start"]();
  while (activeScreen) {
    activeScreen.show()
  }
  display.close();

}
