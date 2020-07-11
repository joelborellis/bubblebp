var system = client.registerSystem(0,0);

system.initialize = function() {
    //Listen for when client enters the world
    this.listenForEvent("minecraft:client_entered_world", (eventData) => this.onClientEnteredWorld(eventData)); 
    // Setup callback for UI events from the custom screens
    this.listenForEvent("minecraft:ui_event", (eventData) => this.onUIMessage(eventData));
    
    this.registerEventData("BubbleScripts:startSetup", {});
    this.registerEventData("BubbleScripts:setupChoicesSelected", {setup_choices: null});
    // Register to get the event from the html page
    this.registerEventData("gtl_game:click", {});

};

system.update = function() {
};

system.onClientEnteredWorld = function(eventData) { 
    
    /*
    // get the eventData into playerdata anbd let server know about this data
    let playerData = this.createEventData("BubbleScript:loadPlayerData");
    playerData.data = eventData.data;
    this.broadcastEvent("BubbleScript:loadPlayerData", playerData);
    */

    let loadEventData = this.createEventData("minecraft:load_ui");
    loadEventData.data.path = "bubble_start.html";
    loadEventData.data.options.is_showing_menu = true;
    loadEventData.data.options.absorbs_input = true;
    this.broadcastEvent("minecraft:load_ui", loadEventData); 
    
};

system.onUIMessage = function (eventDataObject) {
    //Get the data out of the event data object. If there's no data, nothing to do inside here
    let eventData = eventDataObject.data;
    if(!eventData) {
        return;
    }

    if (eventData === "damageSingleTargetAbilityClicked" ||
        eventData === "damageWholeTeamAbilityClicked" ||
        eventData === "healSingleTargetAbilityClicked") {
        // An ability button was clicked. Send the setup choices event to the server script
        let setupData = this.createEventData("BubbleScripts:setupChoicesSelected");
        setupData.data.setup_choices = eventData;
        this.broadcastEvent("BubbleScripts:setupChoicesSelected", setupData);
    }

        this.startGame();

};

system.startGame = function () {
    // Remove any screens we might have loaded
    let unloadEventData = this.createEventData("minecraft:unload_ui");    
    unloadEventData.data.path = "bubble_start.html";
    this.broadcastEvent("minecraft:unload_ui", unloadEventData);
    
    // Notify the server script that the player has entered the world.
    let startEventData = this.createEventData("BubbleScripts:startSetup");
	this.broadcastEvent("BubbleScripts:startSetup", startEventData);

    //let loadEventData = this.createEventData("minecraft:load_ui");
    //loadEventData.data.path = "rpg_game.html";
    //loadEventData.data.options.is_showing_menu = false;
    //loadEventData.data.options.absorbs_input = true;
    //this.broadcastEvent("minecraft:load_ui", loadEventData);

    
};