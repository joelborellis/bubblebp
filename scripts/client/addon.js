var system = client.registerSystem(0,0);

system.initialize = function() {
	this.listenForEvent("minecraft:client_entered_world", (eventData) => this.onStartSetup(eventData));
	this.registerEventData("BubbleScripts:startSetup", {});
};

system.update = function() {

};

system.onStartSetup = function(eventData) {
    let playerData = this.createEventData("BubbleScripts:startSetup");
    playerData.data = eventData.data;
    this.broadcastEvent("BubbleScripts:startSetup", playerData);
};