/**
 * Cookie Clicker Optimal Return on Investment Highlighter / Auto Player
 * @version            0.3
 * @author             nietdaan
 * @description        - Highlights the name of the building with the highest
                         ROI in green. Can also auto-play the game for you.
                       - Displays the total number of cookies inside the
                         currently active wrinklers below your name.
 * @usage              Copy-paste into console. Stop with CCAP_stop();
                       Alternative: use window.Game.LoadMod(link_to_this_script);
 * @option autoBuy     Set autoBuy to true to let script buy buildings
                       automatically
 * @option autoUpgrade Set autoUpgrade to true to let script buy available
                       upgrades automatically.
 * @option logging     Set logging to true to log best option to console
                       each cycle (very resource intensive)
 * @info               After rougly 9,5 hours of play with no manual clicks and
                       100 cookies in the bank to start with, this is the result:
                                               -------------------------------
                                               |   Total cookies |       Cps |
                       -------------------------------------------------------
                       | autoBuy               |   5.630.996.175 |   464.653 |
                       | autoBuy + autoUpgrade |  66.296.531.736 | 5.245.552 |
                       -------------------------------------------------------
 */

// Declare global variables
var currentHighlight = -1;
var autoBuy          = false;
var autoUpgrade      = false;
var logging          = false;
var intervals        = {};

function determineOptimalROI() {
    var buyMe = {id: 0, price: 0, ROI: 0, name: ""};

    // Loop through buildings and select option with best ROI
    for (var i = 0; i < window.Game.ObjectsById.length; i++) {
        var object = window.Game.ObjectsById[i];
        var ROI    = object.storedCps / object.price;

        if (ROI > buyMe.ROI) {
            buyMe.id    = i;
            buyMe.price = object.price;
            buyMe.ROI   = ROI;
            buyMe.name  = object.name;
        }
    }

    // Highlight buidling with best ROI
    if (buyMe.id != currentHighlight) {
        if (currentHighlight != -1) {
            document.getElementById("productName" + currentHighlight).style.color = "#FFFFFF";
        }
        document.getElementById("productName" + buyMe.id).style.color = "#77FF77";
        currentHighlight = buyMe.id;
    }

    // Autobuy buidling with best ROI
    if (autoBuy && buyMe.price <= window.Game.cookies) {
        window.Game.ObjectsById[buyMe.id].buy(1);
    }

    // Log building with best ROI to console
    if (logging) {
        console.log("Best option: " + buyMe.name + " with ROI " + buyMe.ROI);
    }

    // Loop through available upgrades and buy every one we can afford
    var upgrades = window.Game.UpgradesInStore;
    if (autoUpgrade && upgrades.length > 0) {
        for (i = 0; i < upgrades.length; i++) {
            if (upgrades[i].getPrice() <= window.Game.cookies) {
                upgrades[i].buy();
            }
        }
    }
}

// Display total number of cookies inside current wrinklers below your name
function displayWrinklerTotal() {
    // Add DOM element if necessary
    if (document.getElementById("wrinklerTotal") === null) {
        var wrinklerTotal            = document.createElement("div");
        wrinklerTotal.id             = "wrinklerTotal";
        wrinklerTotal.style.fontSize = "60%";
        document.getElementById("bakeryName").appendChild(wrinklerTotal);
    }

    var total = 0;
    for (var i = 0; i < window.Game.wrinklers.length; i++) {
        total += window.Game.wrinklers[i].sucked;
    }
    document.getElementById("wrinklerTotal").innerHTML = "Wrinkler total: " + Beautify(total);
}

// Add style to make CpS more legible when there are wrinklers on screen
var style       = document.createElement('style');
style.type      = 'text/css';
style.innerHTML = '#cookies .warning {background-color: white; padding: 5px; position: absolute; width: 250px; left: 50%; margin-left: -130px;}';
document.getElementsByTagName('head')[0].appendChild(style);

// Stop all functionality
function CCAP_stop() {
    for (var key in intervals) {
        clearInterval(intervals[key]);
    }
}

// Execute ROI loop every 100 milliseconds
intervals.ROI = setInterval(determineOptimalROI, 100);

// Execute Wrinkler loop every 10.000 milliseconds
displayWrinklerTotal();
intervals.wrinkler = setInterval(displayWrinklerTotal, 10000);

// Win 'Third-party' achievement for using a mod
window.Game.Win('Third-party');
