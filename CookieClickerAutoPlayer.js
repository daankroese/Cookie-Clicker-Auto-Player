/**
 * Cookie Clicker Optimal Return on Investment Highlighter / Auto Player

 * @version            0.2
 * @author             nietdaan
 * @description        Highlights the name of the building with the highest
                       ROI in green. Can also auto-play the game for you.
 * @usage              Copy-paste into console. Stop with clearInterval(loop);
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
 
var currentHighlight = -1;
var autoBuy          = false;
var autoUpgrade      = false;
var logging          = false;
 
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

// Execute loop every 100 milliseconds
var loop = setInterval(determineOptimalROI, 100);