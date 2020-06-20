var system = client.registerSystem(0,0);

system.initialize = function() {
    this.listenForEvent("minecraft:client_entered_world", (eventData) => this.onStartSetup(eventData)); 
    this.registerEventData("BubbleScripts:startSetup", {});

    // Setup callback for UI events from the custom screens
    this.listenForEvent("minecraft:ui_event", (eventData) => this.onUIMessage(eventData));

};

system.update = function() {

};

system.onStartSetup = function(eventData) {
    //let playerData = this.createEventData("BubbleScripts:startSetup");
    //playerData.data = eventData.data;
    //this.broadcastEvent("BubbleScripts:startSetup", playerData);

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

    if (eventData === "startPressed") {
        // Start or restart button was pressed on a screen. Start up the game.
        this.startGame();
    }
    
};

system.startGame = function () {
    // Remove any screens we might have loaded
    let unloadEventData = this.createEventData("minecraft:unload_ui");    
    unloadEventData.data.path = "bubble_start.html";
    this.broadcastEvent("minecraft:unload_ui", unloadEventData);

    // Load and show the game screen
    //let loadEventData = this.createEventData("minecraft:load_ui");
    //loadEventData.data.path = "rpg_game.html";
    //loadEventData.data.options.is_showing_menu = false;
    //loadEventData.data.options.absorbs_input = true;
    //this.broadcastEvent("minecraft:load_ui", loadEventData);

    // Tell the server to start the game   
    // Notify the server script that the player has finished loading in.
    let clientEnteredEventData = this.createEventData("BubbleScripts:startSetupUI");
	aClientSystem.broadcastEvent("BubbleScripts:startSetupUI", clientEnteredEventData);
};