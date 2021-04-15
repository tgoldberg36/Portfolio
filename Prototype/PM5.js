/*
 * Class: CSC 343
 *
 * Project: PM7
 * 
 * Authors:
 * 1.Reza Munoz-Asayesh
 * 2. James Brechtel
 * 3. Taylor Goldberg
 * 
 * FileName: PM5.js
 * 
 */

var pm5 = {
    signal: {
        // Page Signals.
        toWelcomePage: 'GO_TO_WELCOME_PAGE',
        toMainMenuPage: 'GO_TO_MENU_PAGE',
        toCheckoutPage: 'GO_TO_CHECKOUT_PAGE',
        toOrderNumberPage: 'GO_TO_ORDERNUMBER_PAGE',
        orderFinished: 'ORDER_FINISHED',

        // Tab Signals in Main Menu.
        entree: 'entree',
        custom: 'custom',
        sides: 'sides',
        desserts: 'desserts',
        drinks: 'drinks',

        // Add Item Signal
        addItem: 'ADD_ITEM',
        addCustomItem: 'ADD_CUSTOM_ITEM',
        removeItem: 'REMOVE_ITEM',

        // add / remove custom item to custom cart signal
        addItemCustomCart: 'ADD_ITEM_CUSTOM_CART',
        removeCustomItem: 'REMOVE_CUSTOM_ITEM',

    },
    // Saved Names of Pages 'views'.
    views: {
        welcomePage: 'WELCOME_PAGE',
        mainMenuPage: 'MAIN_MENU_PAGE',
        checkoutPage: 'CHECKOUT_PAGE',
        orderNumberPage: 'ORDER_NUMBER_PAGE',
    },

    // Saved names of Custom subTabs
    customSubTabs: {
        broth: 'broth',
        noodle: 'noodles',
        protein: 'protein',
        vegetables: 'vegetables',
    }

};


/////////////////////////////////////////////////////////////////////////////////////////////////////
// signaller function.
var makeSignaller = function() {
    var _subscribers = [];
    return {
        add: function(handlerFunction) { _subscribers.push(handlerFunction); },
        notify: function(args) {
            for (var i = 0; i < _subscribers.length; i++) {
                _subscribers[i](args);
            }
        }
    };
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// model.
var makeModel = function() {
    var _shoppingCartItems = []; // list of order objects
    var _totalCost = 0;
    var _customCart = []; // custom cart

    var _currentView = pm5.views.WelcomePage; // shows what view 'page' is currently being displayed.
    var _mainMenuFlag = false; // main menu is currently being shown if = true.
    var _currMainMenuTab = pm5.signal.entree; // what the current tab in the main menu is being shown.
    var _currentCustomTab = pm5.customSubTabs.broth; // sets default custom tab to broth
    var _observers = makeSignaller();

    // list of custom menu items
    var _BrothItems = ['Guilin Broth', 'Chicken Broth', 'Beef Broth', 'Tonkotsu Broth', 'Miso Broth', 'Soy Broth'];
    var _NoodleItems = ['Glass Noodles', 'Wheat Noodles', 'Udon Noodles', 'Rice Noodles', 'Soba Noodles', 'Egg Noodles'];
    var _ProteinItems = ['Beef', 'Pork', 'Chicken', 'Shrimp', 'Talapia', 'Tofu'];
    var _vegetableItems = ['Bean Sprouts', 'Basil', 'Mushroom', 'Baby Bok Choy', 'Cabbage', 'Carrots'];

    // current Qauntity of custom menu items
    var _BrothQauntity = 0;
    var _NoodlesQauntity = 0;
    var _ProteinQauntity = 0;
    var _VegetablesQauntity = 0;

    // local function to check if food item already exists in shopping cart.
    var _containsFoodItem = function(itemName) {
        var i;
        for (i = 0; i < _shoppingCartItems.length; i++) {
            if (_shoppingCartItems[i]['item'] === itemName) {
                return true;
            }
        }
        return false;
    }

    // local function to calculate total cost of items in shopping cart
    var _calculateTotalCost = function() {
        _totalCost = 0; // reset price to 0 to be calculated.

        var i;
        for (i = 0; i < _shoppingCartItems.length; i++) {
            _totalCost += _shoppingCartItems[i]['cost'];
        }
    }

    // local function to see if food item in custom shopping cart
    var _customContainsFoodItem = function(itemName) {
        var i;
        for (i = 0; i < _customCart.length; i++) {
            if (_customCart[i]['item'] === itemName) {
                return true;
            }
        }
        return false;
    }


    return {
        // Get functions
        getCurrPage: function() { return _currentView; },
        getCurrTab: function() { return _currMainMenuTab; },
        getCurrCustomTab: function() { return _currCustomTab; },
        getMenuFlag: function() { return _mainMenuFlag; },
        getShoppingCart: function() { return _shoppingCartItems },
        getTotalCost: function() { return _totalCost },
        getCustomCart: function() { return _customCart },

        // SetFunctions
        // setCurrPage sets the current view that is shown as well as 
        // sets which tab will be shown in the main menu.
        setCurrPage: function(signal) {
            if (signal === pm5.signal.toWelcomePage) {
                _currentView = pm5.views.welcomePage;
                _mainMenuFlag = false;
            } else if (signal === pm5.signal.toMainMenuPage) {
                _currentView = pm5.views.mainMenuPage;
                _mainMenuFlag = true;
            } else if (signal === pm5.signal.toCheckoutPage) {
                _currentView = pm5.views.checkoutPage;
                _mainMenuFlag = false;
            } else if (signal === pm5.signal.toOrderNumberPage) {
                _currentView = pm5.views.orderNumberPage;
                _mainMenuFlag = false;
            } else if (signal === pm5.signal.orderFinished) {
                _currentView = pm5.views.welcomePage;
                _mainMenuFlag = false;
                _currMainMenuTab = pm5.signal.entree;
                //CODE THAT ERASES DATA AND STARTS NEW ORDER HERE.
                _shoppingCartItems = [] // list of order objects
                _totalCost = 0;
                _customCart = []; // reset custom cart
                _BrothQauntity = 0;
                _NoodlesQauntity = 0;
                _ProteinQauntity = 0;
                _VegetablesQauntity = 0;
            } else {
                if (_mainMenuFlag === true && signal === pm5.signal.entree) {
                    _currMainMenuTab = pm5.signal.entree;
                } else if (_mainMenuFlag === true && signal === pm5.signal.custom) {
                    _currMainMenuTab = pm5.signal.custom;
                } else if (_mainMenuFlag === true && signal === pm5.signal.sides) {
                    _currMainMenuTab = pm5.signal.sides;
                } else if (_mainMenuFlag === true && signal === pm5.signal.desserts) {
                    _currMainMenuTab = pm5.signal.desserts;
                } else if (_mainMenuFlag === true && signal === pm5.signal.drinks) {
                    _currMainMenuTab = pm5.signal.drinks;
                } else {
                    console.log('signal not recognized in model', signal);
                }
            }
            _observers.notify();
        },

        // Adds a food item object to the shopping cart list.
        addRegularItemToShoppingCart: function(itemName, itemPrice) {
            _mainMenuFlag = true;
            console.log(_shoppingCartItems);
            // if shopping cart list contains item then update quantity of item else
            // add new object of item too shopping cart.
            if (_containsFoodItem(itemName) === true) {
                var i;
                for (i = 0; i < _shoppingCartItems.length; i++) {
                    if (_shoppingCartItems[i]['item'] === itemName) {
                        // dividing by quantity of item so that the original price of the item can always be added on 
                        // rather than having a bunch of if/else statements to determine the price of the item that is being added.
                        _shoppingCartItems[i]['cost'] += (_shoppingCartItems[i]['cost'] / _shoppingCartItems[i]['quantity']);
                        _shoppingCartItems[i]['quantity'] += 1;
                    }
                }
            } else {
                _shoppingCartItems.unshift({
                    'item': itemName,
                    'cost': itemPrice,
                    'quantity': 1,
                    'type': 'regular',
                })
            }

            _calculateTotalCost();
            console.log(_totalCost);

            _observers.notify();
        },

        removeItemFromShoppingCart: function(item) {
            _mainMenuFlag = true;
            var idx = _shoppingCartItems.indexOf(item);

            // if more than one item, then reduce quantity by 1
            // else remove item from cart.
            if (item['quantity'] > 1) {
                item['cost'] -= (item['cost'] / item['quantity']);
                item['quantity'] = item['quantity'] - 1;

            } else {
                _shoppingCartItems.splice(idx, 1);
            }

            _calculateTotalCost();

            _observers.notify();
        },

        removeCustomItemCart: function(item) {
            _mainMenuFlag = true;
            var idx = _customCart.indexOf(item);

            // if more than one item, then reduce quantity by 1
            // else remove item from cart.
            if (item['quantity'] > 1) {
                item['quantity'] = item['quantity'] - 1;

            } else {
                _customCart.splice(idx, 1);
            }

            console.log(item);
            console.log(_BrothQauntity);
            console.log(_NoodlesQauntity);
            console.log(_ProteinQauntity);
            console.log(_VegetablesQauntity);

            if ((_BrothItems.includes(item['item']))) {
                _BrothQauntity -= 1;
            } else if ((_NoodleItems.includes(item['item']))) {
                _NoodlesQauntity -= 1;
            } else if ((_ProteinItems.includes(item['item']))) {
                _ProteinQauntity -= 1;
            } else if ((_vegetableItems.includes(item['item']))) {
                _VegetablesQauntity -= 1;
            }


            console.log(_BrothQauntity);
            console.log(_NoodlesQauntity);
            console.log(_ProteinQauntity);
            console.log(_VegetablesQauntity);



            _observers.notify();
        },

        setCustomTab: function(tab) {
            _mainMenuFlag = true;
            _currentCustomTab = tab;
            _observers.notify();
        },

        addCustomItemToShoppingCart: function(object) {
            var name = 'Custom Order';

            _mainMenuFlag = true;
            // if shopping cart list contains item then update quantity of item else
            // add new object of item too shopping cart.

            _shoppingCartItems.unshift({
                'item': name,
                'cost': 13,
                'quantity': 1,
                'type': 'custom',
                'order': _customCart,
            });

            _calculateTotalCost();

            _customCart = []; // reset custom cart
            _BrothQauntity = 0;
            _NoodlesQauntity = 0;
            _ProteinQauntity = 0;
            _VegetablesQauntity = 0;

            console.log(_shoppingCartItems);

            _observers.notify();
        },

        addCustomItemToCustomCart: function(itemName) {
            _mainMenuFlag = true;
            console.log(_customContainsFoodItem(itemName) === true);

            if (_customContainsFoodItem(itemName) === true) {
                var i;
                for (i = 0; i < _customCart.length; i++) {
                    if (_customCart[i]['item'] === itemName) {
                        if ((_BrothItems.includes(_customCart[i]['item'])) && _BrothQauntity < 1) {
                            _customCart[i]['quantity'] += 1;
                            _BrothQauntity += 1;
                        } else if ((_NoodleItems.includes(_customCart[i]['item'])) && _NoodlesQauntity < 1) {
                            _customCart[i]['quantity'] += 1;
                            _NoodlesQauntity += 1;
                        } else if ((_ProteinItems.includes(_customCart[i]['item'])) && _ProteinQauntity < 2) {
                            _customCart[i]['quantity'] += 1;
                            _ProteinQauntity += 1;
                        } else if ((_vegetableItems.includes(_customCart[i]['item'])) && _VegetablesQauntity < 4) {
                            _customCart[i]['quantity'] += 1;
                            _VegetablesQauntity += 1;
                        }
                    }
                }
            } else {
                if ((_BrothItems.includes(itemName)) && _BrothQauntity < 1) {
                    _customCart.unshift({
                        'item': itemName,
                        'quantity': 1,
                        // TODO check specific items for caps
                    })
                    _BrothQauntity += 1;
                } else if ((_NoodleItems.includes(itemName)) && _NoodlesQauntity < 1) {
                    _customCart.unshift({
                        'item': itemName,
                        'quantity': 1,
                        // TODO check specific items for caps
                    })
                    _NoodlesQauntity += 1;
                } else if ((_ProteinItems.includes(itemName)) && _ProteinQauntity < 2) {
                    _customCart.unshift({
                        'item': itemName,
                        'quantity': 1,
                        // TODO check specific items for caps
                    })
                    _ProteinQauntity += 1;
                } else if ((_vegetableItems.includes(itemName)) && _VegetablesQauntity < 4) {
                    _customCart.unshift({
                        'item': itemName,
                        'quantity': 1,
                        // TODO check specific items for caps
                    })
                    _VegetablesQauntity += 1;
                }

            }
            _observers.notify();
        },

        register: function(fxn) { _observers.add(fxn); }
    };

}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// controller.
var makeController = function(model) {
    return {
        dispatch: function(event) {
            switch (event.type) {
                // cases for which view 'page' to display.
                case pm5.signal.toWelcomePage:
                    model.setCurrPage(event.type);
                    break;
                case pm5.signal.toMainMenuPage:
                    model.setCurrPage(event.type);
                    break;
                case pm5.signal.toCheckoutPage:
                    model.setCurrPage(event.type);
                    break;
                case pm5.signal.toOrderNumberPage:
                    model.setCurrPage(event.type);
                    break;
                case pm5.signal.orderFinished:
                    model.setCurrPage(event.type);
                    break;

                    // cases for main menu tab selection
                case pm5.signal.entree:
                    model.setCurrPage(event.type);
                    break;
                case pm5.signal.custom:
                    model.setCurrPage(event.type);
                    break;
                case pm5.signal.sides:
                    model.setCurrPage(event.type);
                    break;
                case pm5.signal.desserts:
                    model.setCurrPage(event.type);
                    break;
                case pm5.signal.drinks:
                    model.setCurrPage(event.type);
                    break;

                    // signal to add item
                case pm5.signal.addItem:
                    model.addRegularItemToShoppingCart(event.name, event.price);
                    break;

                    // signal to remove item
                case pm5.signal.removeItem:
                    model.removeItemFromShoppingCart(event.value);
                    break;

                    // signal to change the custom tab
                case pm5.signal.setCustomTab:
                    model.setCustomTab(event.value);
                    break;

                    // add custom order to checkout
                case pm5.signal.addCustomItem:
                    model.addCustomItemToShoppingCart(event.type);
                    break;

                case pm5.signal.addItemCustomCart:
                    model.addCustomItemToCustomCart(event.name);
                    break;

                case pm5.signal.removeCustomItem:
                    model.removeCustomItemCart(event.value);
                    break;

                default:
                    console.log('Unknown Event Type: ', event);
            }
        }
    };
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Add sides add/info buttons and add their functionality
var makeDrinksButtons = function(model, btnId) {
    var _btn = document.getElementById(btnId);
    var _observers = makeSignaller();

    _btn.addEventListener('click', function() {
        if (btnId === 'cannedSoda') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Canned Soda', // create button ID's that are the name of the item we are adding
                price: 2.00
            });
        } else if (btnId === 'cannedBeer') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Canned Beer', // create button ID's that are the name of the item we are adding
                price: 3.00
            });
        } else if (btnId === 'domesticDraft') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Domestic Draft', // create button ID's that are the name of the item we are adding
                price: 4.00
            });
        } else if (btnId === 'marbleSoda') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Marble Soda', // create button ID's that are the name of the item we are adding
                price: 4.00
            });
        } else if (btnId === 'mexicanSoda') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Mexican Soda', // create button ID's that are the name of the item we are adding
                price: 3.00
            });
        } else if (btnId === 'icedTea') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Iced Tea', // create button ID's that are the name of the item we are adding
                price: 2.00
            });
        } else if (btnId === 'koolAidBursts') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'KoolAid Bursts', // create button ID's that are the name of the item we are adding
                price: 2.00
            });
        } else if (btnId === 'littleHugs') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Little Hugs', // create button ID's that are the name of the item we are adding
                price: 2.00
            });
        } else if (btnId === 'water') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Water', // create button ID's that are the name of the item we are adding
                price: 1.00
            });
        }
    });

    return {
        register: function(fxn) { _observers.add(fxn); }
    };
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Add sides add/info buttons and add their functionality
var makeDessertsButtons = function(model, btnId) {
    var _btn = document.getElementById(btnId);
    var _observers = makeSignaller();

    _btn.addEventListener('click', function() {
        if (btnId === 'cremebrulee') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Creme Brulee', // create button ID's that are the name of the item we are adding
                price: 5.00
            });
        } else if (btnId === 'eggTarts') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Egg Tarts', // create button ID's that are the name of the item we are adding
                price: 5.00
            });
        } else if (btnId === 'friedIceCream') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Fried Ice Cream', // create button ID's that are the name of the item we are adding
                price: 4.00
            });
        } else if (btnId === 'fruitGyoza') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Fruit Gyoza', // create button ID's that are the name of the item we are adding
                price: 4.00
            });
        } else if (btnId === 'sesameBalls') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Sesame Balls', // create button ID's that are the name of the item we are adding
                price: 3.00
            });
        } else if (btnId === 'stickyMangoRice') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Sticky Mango Rice', // create button ID's that are the name of the item we are adding
                price: 7.00
            });
        }
    });

    return {
        register: function(fxn) { _observers.add(fxn); }
    };
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Add sides add/info buttons and add their functionality
var makeSidesButtons = function(model, btnId) {
    var _btn = document.getElementById(btnId);
    var _observers = makeSignaller();

    _btn.addEventListener('click', function() {
        if (btnId === 'steamedDumplings') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Steamed Dumplings[6]', // create button ID's that are the name of the item we are adding
                price: 5.00
            });
        } else if (btnId === 'panFriedDumplings') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Pan Fried Dumplings[8]', // create button ID's that are the name of the item we are adding
                price: 7.00
            });
        } else if (btnId === 'veggieEggRolls') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Veggie Egg Rolls[2]', // create button ID's that are the name of the item we are adding
                price: 3.00
            });
        } else if (btnId === 'chaoshouDumplings') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Chasohou Dumplings[8]', // create button ID's that are the name of the item we are adding
                price: 7.00
            });
        } else if (btnId === 'bokChoy') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Bok Choy', // create button ID's that are the name of the item we are adding
                price: 3.00
            });
        } else if (btnId === 'crabPuffs') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Crab Puff[6]', // create button ID's that are the name of the item we are adding
                price: 5.00
            });
        } else if (btnId === 'saltPepperFriedWings') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Salt&Pepper Fried Wings[6]', // create button ID's that are the name of the item we are adding
                price: 7.00
            });
        } else if (btnId === 'kimchee') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Kimchee', // create button ID's that are the name of the item we are adding
                price: 3.00
            });
        } else if (btnId === 'garlicCucumber') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Garlic Cucumber', // create button ID's that are the name of the item we are adding
                price: 3.00
            });
        }
    });

    return {
        register: function(fxn) { _observers.add(fxn); }
    };
}


/////////////////////////////////////////////////////////////////////////////////////////--------------------------------- TODO
// Add Custom menu buttons and their functionality
var makeCustomTabButton = function(model, btnId) {
    var _btn = document.getElementById(btnId);
    var _observers = makeSignaller();

    _btn.addEventListener('click', function() {
        _observers.notify({
            type: pm5.signal.changeCustomTab,
            name: btnId
        });
    });
    return {
        register: function(fxn) { _observers.add(fxn); }
    };
}

// controls the individual items within the custom menu
var makeCustomOrderButton = function(model, btnId) {
    var _btn = document.getElementById(btnId);
    var _observers = makeSignaller();

    _btn.addEventListener('click', function() {
        _observers.notify({
            type: pm5.signal.addCustomItem,
        });
    });
    return {
        register: function(fxn) { _observers.add(fxn); }
    };
}

// custom order checkout button


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Add entree add/info buttons and add their functionality
var makeEntreeButtons = function(model, btnId) {
    var _btn = document.getElementById(btnId);
    var _observers = makeSignaller();

    _btn.addEventListener('click', function() {
        if (btnId === 'taiwanBeef') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Taiwan Beef',
                price: 10.00
            });
        } else if (btnId == 'misoRamen') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Miso Ramen',
                price: 9.00
            });
        } else if (btnId == 'guilinSpicy') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Guilin Spicy',
                price: 10.00
            });
        } else if (btnId == 'hakataRamen') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Hakata Ramen',
                price: 9.00
            });
        } else if (btnId == 'porkHotpot') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Pork Hotpot',
                price: 10.00
            });
        } else if (btnId == 'chowMein') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Chow Mein',
                price: 10.00
            });
        } else if (btnId == 'udonRamen') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Udon Ramen',
                price: 9.00
            });
        } else if (btnId == 'seafoodHotpot') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Seafood Hotpot',
                price: 14.00
            });
        } else if (btnId == 'beefHotpot') {
            _observers.notify({
                type: pm5.signal.addItem,
                name: 'Beef Hotpot',
                price: 12.00
            });
        }
    });

    return {
        register: function(fxn) { _observers.add(fxn); }
    };
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Add menu tabs and add their functionality
var makeMenuButtons = function(model, btnId) {
    var _btn = document.getElementById(btnId);
    var _observers = makeSignaller();

    _btn.addEventListener('click', function() {
        if (btnId === 'entreeButton') {
            _observers.notify({
                type: pm5.signal.entree
            });
        } else if (btnId === 'customButton') {
            _observers.notify({
                type: pm5.signal.custom
            });
        } else if (btnId === 'sidesButton') {
            _observers.notify({
                type: pm5.signal.sides
            });
        } else if (btnId === 'dessertsButton') {
            _observers.notify({
                type: pm5.signal.desserts
            });
        } else if (btnId === 'drinksButton') {
            _observers.notify({
                type: pm5.signal.drinks
            });
        }
    });

    return {
        register: function(fxn) { _observers.add(fxn); }
    };
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Make modal buttons

var makeModalButtons = function(div, btnId, span) {
    var _modal = document.getElementById(div);
    var _btn = document.getElementById(btnId);
    var _span = document.getElementById(span);

    _btn.addEventListener('click', function() {
        _modal.style.display = 'block';
    });

    _span.addEventListener('click', function() {
        _modal.style.display = 'none';
    });
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Add page buttons and add their functionality
var makePageButtons = function(model, btnId) {
    var _btn = document.getElementById(btnId);
    var _observers = makeSignaller();

    _btn.addEventListener('click', function() {
        if (btnId === 'backToWelcomePage1' ||
            btnId === 'backToWelcomePage2' ||
            btnId === 'backToWelcomePage3' ||
            btnId === 'backToWelcomePage4' ||
            btnId === 'backToWelcomePage5') {
            // Display welcome page
            _observers.notify({
                type: pm5.signal.toWelcomePage
            });
        } else if (btnId === 'goToMainMenu' || btnId === 'backToMainMenu') {
            // Display mainmenu + checkoutcart
            _observers.notify({
                type: pm5.signal.toMainMenuPage
            });
        } else if (btnId === 'goToCheckoutPage') {
            // Display checkout page
            _observers.notify({
                type: pm5.signal.toCheckoutPage
            });
        } else if (btnId === 'goToOrderNumberPage') {
            // Display finish payment screen
            _observers.notify({
                type: pm5.signal.toOrderNumberPage
            });
        } else if (btnId === 'exit') {
            // reset system & go to welcome page.
            _observers.notify({
                type: pm5.signal.orderFinished
            });
        }
    });

    return {
        register: function(fxn) { _observers.add(fxn); }
    };
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// makeWelcomePageView function
var makeWelcomePageView = function(model, viewId) {
    var _observers = makeSignaller();

    showWelcomePage = function() {
        document.getElementById('welcomePage').style.display = 'block';
        document.getElementById('mainMenuPage').style.display = 'none';
        document.getElementById('checkoutPage').style.display = 'none';
        document.getElementById('orderNumberPage').style.display = 'none';
    }

    return {
        render: function() {
            if (model.getCurrPage() === pm5.views.welcomePage) {
                showWelcomePage();
            }
        },
        register: function(fxn) { _observers.add(fxn); }
    };
}


/////////////////////////////////////////////////////////////////////////////////////////////////
// make custom tabs
var makeCustomTabs = function(model, tab) {
    var _btn = document.getElementById(tab);
    var _observers = makeSignaller();
    _btn.addEventListener('click', function() {
        var i;
        var customTabs;
        customTabs = document.getElementsByClassName('customTab');
        for (i = 0; i < customTabs.length; i++) {
            customTabs[i].style.display = 'none';
        }
        document.getElementById(tab + 'Tab').style.display = 'block';
    });
    return {
        render: function() {},
        register: function(fxn) { _observers.add(fxn); }
    };
}


// make broth buttons
var makeBrothButtons = function(model, btnId) {
    var _btn = document.getElementById(btnId);
    var _observers = makeSignaller();

    _btn.addEventListener('click', function() {
        if (btnId === 'guilinBroth') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Guilin Broth',
            });
        } else if (btnId == 'chickenBroth') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Chicken Broth',
            });
        } else if (btnId == 'beefBroth') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Beef Broth',
            });
        } else if (btnId == 'tonkotsuBroth') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Tonkotsu Broth',
            });
        } else if (btnId == 'misoBroth') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Miso Broth',
            });
        } else if (btnId == 'soyBroth') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Soy Broth',
            });
        }
    });

    return {
        register: function(fxn) { _observers.add(fxn); }
    };
}

var makeNoodleButtons = function(model, btnId) {
    var _btn = document.getElementById(btnId);
    var _observers = makeSignaller();

    _btn.addEventListener('click', function() {
        if (btnId === 'glassNoodle') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Glass Noodles',
            });
        } else if (btnId == 'wheatNoodle') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Wheat Noodles',
            });
        } else if (btnId == 'udonNoodle') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Udon Noodles',
            });
        } else if (btnId == 'riceNoodle') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Rice Noodles',
            });
        } else if (btnId == 'sobaNoodle') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Soba Noodles',
            });
        } else if (btnId == 'eggNoodle') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Egg Noodles',
            });
        }
    });

    return {
        register: function(fxn) { _observers.add(fxn); }
    };
}

var makeProteinButtons = function(model, btnId) {
    var _btn = document.getElementById(btnId);
    var _observers = makeSignaller();

    _btn.addEventListener('click', function() {
        if (btnId === 'beef') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Beef',
            });
        } else if (btnId == 'pork') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Pork',
            });
        } else if (btnId == 'chicken') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Chicken',
            });
        } else if (btnId == 'shrimp') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Shrimp',
            });
        } else if (btnId == 'talapia') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Talapia',
            });
        } else if (btnId == 'tofu') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Tofu',
            });
        }
    });

    return {
        register: function(fxn) { _observers.add(fxn); }
    };
}


var makeVegetableButtons = function(model, btnId) {
    var _btn = document.getElementById(btnId);
    var _observers = makeSignaller();

    _btn.addEventListener('click', function() {
        if (btnId === 'beanSprouts') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Bean Sprouts',
            });
        } else if (btnId == 'mushroom') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Mushroom',
            });
        } else if (btnId == 'babyBokChoy') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Baby Bok Choy',
            });
        } else if (btnId == 'cabbage') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Cabbage',
            });
        } else if (btnId == 'carrot') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Carrots',
            });
        } else if (btnId == 'basil') {
            _observers.notify({
                type: pm5.signal.addItemCustomCart,
                name: 'Basil',
            });
        }
    });

    return {
        register: function(fxn) { _observers.add(fxn); }
    };
}

// make custom cart view
var makeCustomCartView = function(model, viewId) {
    var _list = document.getElementById('customList')
    var _observers = makeSignaller();

    // local function to show main menu page
    var _showMainMenuPage = function() {
        document.getElementById('welcomePage').style.display = 'none';
        document.getElementById('mainMenuPage').style.display = 'block';
        document.getElementById('checkoutPage').style.display = 'none';
        document.getElementById('orderNumberPage').style.display = 'none';
    }

    var _addItemToCustomCart = function(item, num) {

        var deleteButton = document.createElement('input');
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('class', 'editBtn')
        deleteButton.setAttribute('value', '✘');
        deleteButton.addEventListener('click', function() {
            _observers.notify({
                type: pm5.signal.removeCustomItem,
                value: item,
            });
        });

        var newDiv = document.createElement('div');
        if (num % 2 === 0) {
            newDiv.setAttribute('class', 'listItem listGreen');
        } else {
            newDiv.setAttribute('class', 'listItem listBrown');
        }
        newDiv.appendChild(deleteButton);
        var newSpan = document.createElement('span');
        newSpan.append(document.createTextNode('    ' + item['item'] + ' x' + item['quantity']));
        newDiv.append(newSpan);

        _list.appendChild(newDiv);
    }
    return {
        render: function() {
            if (model.getCurrPage() === pm5.views.mainMenuPage) {
                _showMainMenuPage();
            }

            // update the list of items in checkout cart displayed
            if (model.getMenuFlag() === true) {
                while (_list.firstChild) {
                    _list.removeChild(_list.firstChild);
                }
                var items = model.getCustomCart();
                for (var i = 0; i < items.length; i++) {
                    _addItemToCustomCart(items[i], i);
                }
            }


        },

        register: function(fxn) { _observers.add(fxn); }
    };
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// makeMainMenuPageView function
var makeMainMenuPageView = function(model, viewId) {
    var _priceDisplay = document.getElementById('totalCost');
    var _list = document.getElementById('orderList')
    var _observers = makeSignaller();

    // local function to show main menu page
    var _showMainMenuPage = function() {
        document.getElementById('welcomePage').style.display = 'none';
        document.getElementById('mainMenuPage').style.display = 'block';
        document.getElementById('checkoutPage').style.display = 'none';
        document.getElementById('orderNumberPage').style.display = 'none';
    }

    // local open tab function
    var _openTab = function(tabName) {
        var i;
        var tabcontent;
        tabcontent = document.getElementsByClassName('tabcontent');
        for (i = 0; i < tabcontent.length; i++) {

            tabcontent[i].style.display = 'none';
        }
        document.getElementById(tabName).style.display = 'block';
    }

    // add/delete items from the checkout cart.
    var _addItemToShoppingCartList = function(item, num) {

        var deleteButton = document.createElement('input');
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('class', 'editBtn')
        deleteButton.setAttribute('value', '✘');
        deleteButton.addEventListener('click', function() {
            _observers.notify({
                type: pm5.signal.removeItem,
                value: item
            });
        });

        var newDiv = document.createElement('div');
        if (num % 2 === 0) {
            newDiv.setAttribute('class', 'listItem listWhite');
        } else {
            newDiv.setAttribute('class', 'listItem listGray');
        }
        newDiv.appendChild(deleteButton);
        var newSpan = document.createElement('span');

        if (item['type'] == 'custom') {
            newSpan.append(document.createTextNode('    ' + item['item'] + ' $' + item['cost']));
            newDiv.append(newSpan);

            var ingredientList = document.createElement('p');
            ingredientList.setAttribute('class', 'customOrderItemInCheckoutCart');
            newDiv.append(ingredientList);

            var i;
            for (i = 0; i < item['order'].length; i++) {
                var ingredientToAdd = document.createTextNode(' -' + item['order'][i]['item']);

                ingredientList.appendChild(ingredientToAdd);
                ingredientList.appendChild(document.createElement('br'));
            }
        } else {
            newSpan.append(document.createTextNode('    ' + item['item'] + ' x' + item['quantity'] + ' $' + item['cost']));
            newDiv.append(newSpan);
        }


        _list.appendChild(newDiv);
    }

    var _updateTotalCost = function() {
        _priceDisplay.append(document.createTextNode(model.getTotalCost() + '.00'));
    }

    return {
        render: function() {

            // open the main menu page
            if (model.getCurrPage() === pm5.views.mainMenuPage) {
                console.log('#2 in makeMainMenuPageView');
                _showMainMenuPage();
            }

            // open selected tab in main menu
            if (model.getCurrPage() === pm5.views.mainMenuPage && model.getMenuFlag() === true) {
                _openTab(model.getCurrTab());
            }

            // update the list of items in checkout cart displayed
            if (model.getMenuFlag() === true) {
                while (_list.firstChild) {
                    _list.removeChild(_list.firstChild);
                }

                if (_priceDisplay.firstChild) {
                    _priceDisplay.removeChild(_priceDisplay.firstChild);
                }

                var items = model.getShoppingCart();
                for (var i = 0; i < items.length; i++) {
                    _addItemToShoppingCartList(items[i], i);
                }

                _updateTotalCost();
            }

        },
        register: function(fxn) { _observers.add(fxn); }
    };
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// makeCheckoutPageView function
var makeCheckoutPageView = function(model, viewId) {
    var _priceDisplay = document.getElementById('finalTotalCost');
    var _list = document.getElementById('finalOrderList')
    var _observers = makeSignaller();



    showCheckoutPage = function() {
        document.getElementById('welcomePage').style.display = 'none';
        document.getElementById('mainMenuPage').style.display = 'none';
        document.getElementById('checkoutPage').style.display = 'block';
        document.getElementById('orderNumberPage').style.display = 'none';
    }

    // add/delete items from the checkout cart.
    var _addItemToShoppingCartList = function(item, num) {

        var deleteButton = document.createElement('input');
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('class', 'editBtn')
        deleteButton.setAttribute('value', '✘');
        deleteButton.addEventListener('click', function() {
            _observers.notify({
                type: pm5.signal.removeItem,
                value: item
            });
        });

        var newDiv = document.createElement('div');
        if (num % 2 === 0) {
            newDiv.setAttribute('class', 'listItem listWhite');
        } else {
            newDiv.setAttribute('class', 'listItem listGray');
        }
        newDiv.appendChild(deleteButton);
        var newSpan = document.createElement('span');

        if (item['type'] == 'custom') {
            newSpan.append(document.createTextNode('    ' + item['item'] + ' $' + item['cost']));
            newDiv.append(newSpan);

            var ingredientList = document.createElement('p');
            ingredientList.setAttribute('class', 'customOrderItemInCheckoutCart');
            newDiv.append(ingredientList);

            var i;
            for (i = 0; i < item['order'].length; i++) {
                var ingredientToAdd = document.createTextNode(' -' + item['order'][i]['item']);

                ingredientList.appendChild(ingredientToAdd);
                ingredientList.appendChild(document.createElement('br'));
            }
        } else {
            newSpan.append(document.createTextNode('    ' + item['item'] + ' x' + item['quantity'] + ' $' + item['cost']));
            newDiv.append(newSpan);
        }


        _list.appendChild(newDiv);
    }

    var _updateTotalCost = function() {
        _priceDisplay.append(document.createTextNode(model.getTotalCost() + '.00'));
    }

    return {
        render: function() {
            if (model.getCurrPage() === pm5.views.checkoutPage) {
                console.log('#3 in makeCheckoutPageView');
                showCheckoutPage();
            }

            // update the list of items in checkout cart displayed
            if (model.getMenuFlag() === true) {
                while (_list.firstChild) {
                    _list.removeChild(_list.firstChild);
                }

                if (_priceDisplay.firstChild) {
                    _priceDisplay.removeChild(_priceDisplay.firstChild);
                }

                var items = model.getShoppingCart();
                for (var i = 0; i < items.length; i++) {
                    _addItemToShoppingCartList(items[i], i);
                }

                _updateTotalCost();
            }


        },

        register: function(fxn) { _observers.add(fxn); }
    };
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// makePaymentConfirmationPageView function
var makePaymentConfirmationPageView = function(model, viewId) {
    var _observers = makeSignaller();

    showOrderNumberPage = function() {
        document.getElementById('welcomePage').style.display = 'none';
        document.getElementById('mainMenuPage').style.display = 'none';
        document.getElementById('checkoutPage').style.display = 'none';
        document.getElementById('orderNumberPage').style.display = 'block';
    }

    return {
        render: function() {
            if (model.getCurrPage() === pm5.views.orderNumberPage) {
                console.log('#4 in makePaymentConfirmationPageView');
                showOrderNumberPage();
            }
        },
        register: function(fxn) { _observers.add(fxn); }
    };
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Create MVC system here once the DOM Content is loaded.
document.addEventListener('DOMContentLoaded', function(event) {
    var model = makeModel();
    var controller = makeController(model);

    // Pages.
    var customCartView = makeCustomCartView(model, 'customCartView');
    var welcomePageView = makeWelcomePageView(model, 'welcomePage'); // 1
    var mainMenuView = makeMainMenuPageView(model, 'mainMenuPage'); // 2 
    var checkoutPageView = makeCheckoutPageView(model, 'checkoutPage'); // 3
    var paymentConfirmationView = makePaymentConfirmationPageView(model, 'orderNumberPage'); // 4 

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // CREATE BUTTONS

    // Create page buttons to navigate from order beginning to finish.
    var welcomeToMainMenuBtn = makePageButtons(model, 'goToMainMenu')
    var checkoutToMainMenuBtn = makePageButtons(model, 'backToMainMenu');
    var mainMenuToCheckoutBtn = makePageButtons(model, 'goToCheckoutPage');
    var checkoutToOrderNumberBtn = makePageButtons(model, 'goToOrderNumberPage');
    var orderFinished = makePageButtons(model, 'exit');

    // Create Main Menu buttons to navigate Tabs.
    var entreeBtn = makeMenuButtons(model, 'entreeButton');
    var customBtn = makeMenuButtons(model, 'customButton');
    var sidesBtn = makeMenuButtons(model, 'sidesButton');
    var dessertsBtn = makeMenuButtons(model, 'dessertsButton');
    var drinksBtn = makeMenuButtons(model, 'drinksButton');

    // Create Entree info/add buttons
    var taiwanBeef = makeEntreeButtons(model, 'taiwanBeef');
    var misoRamen = makeEntreeButtons(model, 'misoRamen');
    var beefHotpot = makeEntreeButtons(model, 'beefHotpot');
    var guilinSpicy = makeEntreeButtons(model, 'guilinSpicy');
    var hakataRamen = makeEntreeButtons(model, 'hakataRamen');
    var porkHotpot = makeEntreeButtons(model, 'porkHotpot');
    var chowMein = makeEntreeButtons(model, 'chowMein');
    var udonRamen = makeEntreeButtons(model, 'udonRamen');
    var seafoodHotpot = makeEntreeButtons(model, 'seafoodHotpot');

    // Create Custom subTabs------------------------------------------------------ TODO
    var broth = makeCustomTabs(model, 'broth');
    var noodles = makeCustomTabs(model, 'noodles');
    var protein = makeCustomTabs(model, 'protein');
    var vegetables = makeCustomTabs(model, 'vegetables');

    // Create Custom item buttons-------------------------------------------------- TODO

    // custom order button
    var customOrderButton = makeCustomOrderButton(model, 'customOrderButton');

    // broth
    var guilinBroth = makeBrothButtons(model, 'guilinBroth');
    var chickenBroth = makeBrothButtons(model, 'chickenBroth');
    var beefBroth = makeBrothButtons(model, 'beefBroth');
    var tonkotsuBroth = makeBrothButtons(model, 'tonkotsuBroth');
    var misoBroth = makeBrothButtons(model, 'misoBroth');
    var soyBroth = makeBrothButtons(model, 'soyBroth');

    // noodles
    var glassNoodle = makeNoodleButtons(model, 'glassNoodle');
    var wheatNoodle = makeNoodleButtons(model, 'wheatNoodle');
    var udonNoodle = makeNoodleButtons(model, 'udonNoodle');
    var riceNoodle = makeNoodleButtons(model, 'riceNoodle');
    var sobaNoodle = makeNoodleButtons(model, 'sobaNoodle');
    var eggNoodle = makeNoodleButtons(model, 'eggNoodle');

    // protein
    var beef = makeProteinButtons(model, 'beef');
    var pork = makeProteinButtons(model, 'pork');
    var chicken = makeProteinButtons(model, 'chicken');
    var shrimp = makeProteinButtons(model, 'shrimp');
    var talapia = makeProteinButtons(model, 'talapia');
    var tofu = makeProteinButtons(model, 'tofu');

    // vegetables
    var beanSprouts = makeVegetableButtons(model, 'beanSprouts');
    var basil = makeVegetableButtons(model, 'basil');
    var mushroom = makeVegetableButtons(model, 'mushroom');
    var babyBokChoy = makeVegetableButtons(model, 'babyBokChoy');
    var cabbage = makeVegetableButtons(model, 'cabbage');
    var carrot = makeVegetableButtons(model, 'carrot');

    // Create Sides info/add buttons
    var steamedDumplings = makeSidesButtons(model, 'steamedDumplings');
    var panFriedDumplings = makeSidesButtons(model, 'panFriedDumplings');
    var veggieEggRolls = makeSidesButtons(model, 'veggieEggRolls');
    var chaoshouDumplings = makeSidesButtons(model, 'chaoshouDumplings');
    var bokChoy = makeSidesButtons(model, 'bokChoy');
    var crabPuffs = makeSidesButtons(model, 'crabPuffs');
    var saltPepperFriedWings = makeSidesButtons(model, 'saltPepperFriedWings');
    var kimchee = makeSidesButtons(model, 'kimchee');
    var garlicCucumber = makeSidesButtons(model, 'garlicCucumber'); // create button ID's that are the name of the item we are adding

    // Create Desserts info/add buttons
    var cremebrulee = makeDessertsButtons(model, 'cremebrulee');
    var eggTarts = makeDessertsButtons(model, 'eggTarts');
    var friedIceCream = makeDessertsButtons(model, 'friedIceCream');
    var fruitGyoza = makeDessertsButtons(model, 'fruitGyoza');
    var sesameBalls = makeDessertsButtons(model, 'sesameBalls');
    var stickyMangoRice = makeDessertsButtons(model, 'stickyMangoRice');

    // Create Drinks info/add buttons
    var cannedSoda = makeDrinksButtons(model, 'cannedSoda');
    var cannedBeer = makeDrinksButtons(model, 'cannedBeer');
    var domesticDraft = makeDrinksButtons(model, 'domesticDraft');
    var marbleSoda = makeDrinksButtons(model, 'marbleSoda');
    var mexicanSoda = makeDrinksButtons(model, 'mexicanSoda');
    var icedTea = makeDrinksButtons(model, 'icedTea');
    var koolAidBursts = makeDrinksButtons(model, 'koolAidBursts');
    var littleHugs = makeDrinksButtons(model, 'littleHugs');
    var water = makeDrinksButtons(model, 'water');
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // REGISTER 

    // Register views to model.
    model.register(welcomePageView.render);
    model.register(mainMenuView.render);
    model.register(checkoutPageView.render);
    model.register(paymentConfirmationView.render);
    model.register(customCartView.render);

    // broth tabs rendering
    model.register(broth.render);
    model.register(noodles.render);
    model.register(protein.render);
    model.register(vegetables.render);

    // Register controller to views.
    welcomePageView.register(controller.dispatch);
    mainMenuView.register(controller.dispatch);
    checkoutPageView.register(controller.dispatch);
    paymentConfirmationView.register(controller.dispatch);
    customCartView.register(controller.dispatch);

    // Register page buttons to controller.
    welcomeToMainMenuBtn.register(controller.dispatch);
    checkoutToMainMenuBtn.register(controller.dispatch);
    mainMenuToCheckoutBtn.register(controller.dispatch);
    checkoutToOrderNumberBtn.register(controller.dispatch);
    orderFinished.register(controller.dispatch);

    // Register Menu buttons to controller.
    entreeBtn.register(controller.dispatch);
    customBtn.register(controller.dispatch);
    sidesBtn.register(controller.dispatch);
    dessertsBtn.register(controller.dispatch);
    drinksBtn.register(controller.dispatch);

    // Register entree item buttons
    taiwanBeef.register(controller.dispatch);
    misoRamen.register(controller.dispatch);
    beefHotpot.register(controller.dispatch);
    guilinSpicy.register(controller.dispatch);
    hakataRamen.register(controller.dispatch);
    porkHotpot.register(controller.dispatch);
    chowMein.register(controller.dispatch);
    udonRamen.register(controller.dispatch);
    seafoodHotpot.register(controller.dispatch);

    // Register custom subtab buttons
    broth.register(controller.dispatch);
    noodles.register(controller.dispatch);
    protein.register(controller.dispatch);
    vegetables.register(controller.dispatch);

    // register custom item buttons

    // broths
    guilinBroth.register(controller.dispatch);
    chickenBroth.register(controller.dispatch);
    beefBroth.register(controller.dispatch);
    tonkotsuBroth.register(controller.dispatch);
    misoBroth.register(controller.dispatch);
    soyBroth.register(controller.dispatch);

    // noodles
    glassNoodle.register(controller.dispatch);
    wheatNoodle.register(controller.dispatch);
    riceNoodle.register(controller.dispatch);
    sobaNoodle.register(controller.dispatch);
    eggNoodle.register(controller.dispatch);
    udonNoodle.register(controller.dispatch);

    // protein
    beef.register(controller.dispatch);
    pork.register(controller.dispatch);
    chicken.register(controller.dispatch);
    shrimp.register(controller.dispatch);
    talapia.register(controller.dispatch);
    tofu.register(controller.dispatch);

    // vegetables
    beanSprouts.register(controller.dispatch);
    cabbage.register(controller.dispatch);
    carrot.register(controller.dispatch);
    basil.register(controller.dispatch);
    mushroom.register(controller.dispatch);
    babyBokChoy.register(controller.dispatch);


    // checkout 
    customOrderButton.register(controller.dispatch);

    // Register side item buttons
    steamedDumplings.register(controller.dispatch);
    panFriedDumplings.register(controller.dispatch);
    veggieEggRolls.register(controller.dispatch);
    chaoshouDumplings.register(controller.dispatch);
    bokChoy.register(controller.dispatch);
    crabPuffs.register(controller.dispatch);
    saltPepperFriedWings.register(controller.dispatch);
    kimchee.register(controller.dispatch);
    garlicCucumber.register(controller.dispatch);

    // Register dessert item buttons
    cremebrulee.register(controller.dispatch);
    eggTarts.register(controller.dispatch);
    friedIceCream.register(controller.dispatch);
    fruitGyoza.register(controller.dispatch);
    sesameBalls.register(controller.dispatch);
    stickyMangoRice.register(controller.dispatch);

    // Register drink item buttons
    cannedSoda.register(controller.dispatch);
    cannedBeer.register(controller.dispatch);
    domesticDraft.register(controller.dispatch);
    marbleSoda.register(controller.dispatch);
    mexicanSoda.register(controller.dispatch);
    icedTea.register(controller.dispatch);
    koolAidBursts.register(controller.dispatch);
    littleHugs.register(controller.dispatch);
    water.register(controller.dispatch);

    // Entree Modal buttons
    var tbModal = makeModalButtons('tbModal', 'tbInfo', 'tbClose');
    var mrModal = makeModalButtons('mrModal', 'mrInfo', 'mrClose');
    var bhModal = makeModalButtons('bhModal', 'bhInfo', 'bhClose');
    var gsModal = makeModalButtons('gsModal', 'gsInfo', 'gsClose');
    var hrModal = makeModalButtons('hrModal', 'hrInfo', 'hrClose');
    var phModal = makeModalButtons('phModal', 'phInfo', 'phClose');
    var urModal = makeModalButtons('urModal', 'urInfo', 'urClose');
    var cmModal = makeModalButtons('cmModal', 'cmInfo', 'cmClose');
    var sfModal = makeModalButtons('sfModal', 'sfInfo', 'sfClose');

    // Side Modal buttons
    var sdModal = makeModalButtons('sdModal', 'sdInfo', 'sdClose');
    var pfModal = makeModalButtons('pfModal', 'pfInfo', 'pfClose');
    var verModal = makeModalButtons('verModal', 'verInfo', 'verClose');
    var cdModal = makeModalButtons('cdModal', 'cdInfo', 'cdClose');
    var bcModal = makeModalButtons('bcModal', 'bcInfo', 'bcClose');
    var cpModal = makeModalButtons('cpModal', 'cpInfo', 'cpClose');
    var spfwModal = makeModalButtons('spfwModal', 'spfwInfo', 'spfwClose');
    var kModal = makeModalButtons('kModal', 'kInfo', 'kClose');
    var gcModal = makeModalButtons('gcModal', 'gcInfo', 'gcClose');

    // Drink Modal buttons
    var csModal = makeModalButtons('csModal', 'csInfo', 'csClose');
    var cbModal = makeModalButtons('cbModal', 'cbInfo', 'cbClose');
    var ddModal = makeModalButtons('ddModal', 'ddInfo', 'ddClose');
    var msModal = makeModalButtons('msModal', 'msInfo', 'msClose');
    var mexModal = makeModalButtons('mexModal', 'mexInfo', 'mexClose');
    var itModal = makeModalButtons('itModal', 'itInfo', 'itClose');
    var kabModal = makeModalButtons('kabModal', 'kabInfo', 'kabClose');
    var lhModal = makeModalButtons('lhModal', 'lhInfo', 'lhClose');
    var wModal = makeModalButtons('wModal', 'wInfo', 'wClose');

    // Dessert Modal buttons
    var cremeModal = makeModalButtons('cremeModal', 'cremeInfo', 'cremeClose');
    var etModal = makeModalButtons('etModal', 'etInfo', 'etClose');
    var fiModal = makeModalButtons('fiModal', 'fiInfo', 'fiClose');
    var fgModal = makeModalButtons('fgModal', 'fgInfo', 'fgClose');
    var sbModal = makeModalButtons('sbModal', 'sbInfo', 'sbClose');
    var smModal = makeModalButtons('smModal', 'smInfo', 'smClose');

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // Initial Appearance.
    document.getElementById('mainMenuPage').style.display = 'none';
    document.getElementById('checkoutPage').style.display = 'none';
    document.getElementById('orderNumberPage').style.display = 'none';

    // intial custom
    document.getElementById('noodlesTab').style.display = 'none';
    document.getElementById('proteinTab').style.display = 'none';
    document.getElementById('vegetablesTab').style.display = 'none';

});