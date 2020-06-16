var system = server.registerSystem(0,0);


var TimerVars = {};
TimerVars.timer = 0;
TimerVars.timer_increase = 50;
TimerVars.timer_starting = 600;
TimerVars.time_between_waves = 80;


var GameStateVars = {};
GameStateVars.startSetup = false;
GameStateVars.startGame = false;
//GameStateVars.startWave = false;
//GameStateVars.inWave = false;
GameStateVars.inBetweenWaves = false;
//GameStateVars.endGame = false;

/*
var GameplayVars = {};
GameplayVars.BaseY = 5;
GameplayVars.BoundsX = 14;
GameplayVars.BoundsZ = 14;

var enemyNameList = ["minecraft:zombie", "minecraft:skeleton", "minecraft:creeper", "minecraft:zombie_pigman", "minecraft:ghast", "minecraft:slime", "minecraft:evoker"];
var enemyPoints = ["10", "25", "50", "15", "75", "5", "60"];
var waveEnemies = ["0 0 0 0", "0 0 0 1 1 1", "0 0 1 1 2", "3 3 3 3 3", "0 0 1 2 3 3", "4 0 0 0 0 0 0", "5 5 5 5 2 2", "2 2 2 6"];
var waveEntities = [];
*/

var player;
//var startGameChicken;

//var customQuery = {};

system.initialize = function() {

    // Tracks the amount of points that an enemy gives on death.
    this.registerComponent("BubbleScripts:EnemyPoints", { Points: 0 });
    // Tracks Data on the player
    this.registerComponent("BubbleScripts:PlayerStats", { Score: 0, CurrentWave: 0, MaxWave: 7});

    this.listenForEvent("BubbleScripts:startSetup", (eventData) => this.onStartServerSetup(eventData));
    this.listenForEvent("minecraft:entity_death", (eventData) => this.onEntityDeath(eventData));

    //customQuery = this.registerQuery();

};

system.update = function () {

    // Game Setup ++++++++++++++++++++++++++++++++++++++++++++++++++
    if (GameStateVars.startSetup === true) {
        this.SetUpGame();
    }

    
    // Game Start +++++++++++++++++++++++++++++++++++++++++++++++++++
    if (GameStateVars.startGame === true) {
        this.StartGame();
    }

    /*
    // Wave Setup +++++++++++++++++++++++++++++++++++++++++++++++++++
    if (GameStateVars.startWave === true) {
        this.SetUpWave();
    }

    // In A Wave ++++++++++++++++++++++++++++++++++++++++++++++++++++
    if (GameStateVars.inWave === true) {
        this.Wave();
    }
    */

    // Between Waves ++++++++++++++++++++++++++++++++++++++++++++++++
    if (GameStateVars.inBetweenWaves === true) {
        this.BetweenWaves();
    }
    
};

system.SetUpGame = function () {
    let BroadcastEventData = this.createEventData("minecraft:display_chat_event");
    BroadcastEventData.data.message = "Entering Bubblegum World";
    this.broadcastEvent("minecraft:display_chat_event", BroadcastEventData);

    /*
    // clear all other entities
    let customEntities = this.getEntitiesFromQuery(customQuery);
    let size = customEntities.length;
    for (let index = 0; index < size; ++index) {
        if (customEntities[index].id !== player.id) {
            this.destroyEntity(customEntities[index]);
        }
    }
    // Make it day
    let ExecuteEventData = this.createEventData("minecraft:execute_command");
    ExecuteEventData.data.command = "/time set day";
    this.broadcastEvent("minecraft:execute_command", ExecuteEventData);

    // Build a roof to prevent mobs from catching on fire. 
    ExecuteEventData.data.command = "/fill 16 100 16 -16 100 -16 obsidian";
    this.broadcastEvent("minecraft:execute_command", ExecuteEventData);

    // Reset the walls of the Start Room
    ExecuteEventData.data.command = "/fill -3 8 3 3 5 3 obsidian";
    this.broadcastEvent("minecraft:execute_command", ExecuteEventData);
    ExecuteEventData.data.command = "/fill 3 5 3 3 8 -3 obsidian";
    this.broadcastEvent("minecraft:execute_command", ExecuteEventData);
    ExecuteEventData.data.command = "/fill 3 5 -3 -3 8 -3 obsidian";
    this.broadcastEvent("minecraft:execute_command", ExecuteEventData);
    ExecuteEventData.data.command = "/fill -3 5 -3 -3 8 3 obsidian";
    this.broadcastEvent("minecraft:execute_command", ExecuteEventData);

    ExecuteEventData.data.command = "/tp @p 0 6 0";
    this.broadcastEvent("minecraft:execute_command", ExecuteEventData);
*/

    // Spawn the start game chicken
    startGameChicken = this.createEntity("entity", "minecraft:chicken");
    let name = this.createComponent(startGameChicken, "minecraft:nameable");
    name.data.alwaysShow = true;
    name.data.name = "Kill me to Start";
    this.applyComponentChanges(startGameChicken, name);

    GameStateVars.startSetup = false;
};


system.StartGame = function () {

    // set the walls to air
    //let ExecuteEventData = this.createEventData("minecraft:execute_command");
    //ExecuteEventData.data.command = "/fill -3 5 -3 3 8 3 gtl:bubblegum";
    //this.broadcastEvent("minecraft:execute_command", ExecuteEventData);

    // Drop the weapons and armor
    this.createEntity("item_entity", "gtl:bubblegum_piece");
    this.createEntity("item_entity", "gtl:gelatin");
    
    //this.createEntity("item_entity", "minecraft:iron_leggings");
    //this.createEntity("item_entity", "minecraft:iron_boots");

    //this.createEntity("item_entity", "minecraft:iron_sword");
    //this.createEntity("item_entity", "minecraft:iron_axe");
    //this.createEntity("item_entity", "minecraft:trident");

    GameStateVars.startGame = false;
    GameStateVars.inBetweenWaves = true;
};

/*
system.SetUpWave = function () {
    let playerStats = this.getComponent(player, "MiniGameTest:PlayerStats");

    let BroadcastEventData = this.createEventData("minecraft:display_chat_event");
    BroadcastEventData.data.message = "Starting Wave: " + playerStats.data.CurrentWave;
    this.broadcastEvent("minecraft:display_chat_event", BroadcastEventData);

    // Clear the list of entities
    waveEntities.length = 0;

    // get the list of enemies to spawn
    let enemyString = waveEnemies[playerStats.data.CurrentWave - 1];
    let enemyList = enemyString.split(" ");
    // Spawn the enemies for the player to fight
    for (let i = 0; i < enemyList.length; ++i) {
        // create entity
        waveEntities[i] = this.createEntity("entity", enemyNameList[enemyList[i]]);
        // Give them a random position in the arena 
        let positioncomponent = this.getComponent(waveEntities[i], "minecraft:position");
        positioncomponent.data.x = Math.floor(Math.random() * (GameplayVars.BoundsX * 2)) - GameplayVars.BoundsX;
        positioncomponent.data.z = Math.floor(Math.random() * (GameplayVars.BoundsZ * 2)) - GameplayVars.BoundsZ;
        positioncomponent.data.y = 6;
        this.applyComponentChanges(waveEntities[i], positioncomponent);

        // Give the entities a custom score component based on their type
        let pointscomponent = this.createComponent(waveEntities[i], "MiniGameTest:EnemyPoints");
        pointscomponent.data.Points = enemyPoints[enemyList[i]];
        this.applyComponentChanges(waveEntities[i], pointscomponent);

        // Have their score display on their nametag
        let nametag = this.getComponent(waveEntities[i], "minecraft:nameable");
        nametag.data.alwaysShow = true;
        nametag.data.name = pointscomponent.Points;
        this.applyComponentChanges(waveEntities[i], nametag);
    }

    TimerVars.timer = 0;
    GameStateVars.startWave = false;
    GameStateVars.inWave = true;
};

system.Wave = function () {
    TimerVars.timer++;

    let playerStats = this.getComponent(player, "MiniGameTest:PlayerStats");
    // If the timer runs out move to next wave
    if (TimerVars.timer === TimerVars.timer_starting + (TimerVars.timer_increase * playerStats.data.CurrentWave)) {
        // clear all other entities
        let customEntities = this.getEntitiesFromQuery(customQuery);
        let size = customEntities.length;
        for (let index = 0; index < size; ++index) {
            if (customEntities[index].id !== player.id) {
                this.destroyEntity(customEntities[index]);
            }
        }

        TimerVars.timer = 0;
        GameStateVars.inWave = false;
        if (playerStats.data.CurrentWave === playerStats.data.MaxWave) {
            GameStateVars.endGame = true;
        }
        else {
            GameStateVars.inBetweenWaves = true;
        }
    }
}
*/
system.BetweenWaves = function () {
    TimerVars.timer++;

    // End the time Between Waves
    if (TimerVars.timer === TimerVars.time_between_waves) {
        let playerStats = this.getComponent(player, "BubbleScripts:PlayerStats");
        playerStats.data.CurrentWave++;
        this.applyComponentChanges(player, playerStats);

        TimerVars.timer = 0;
        GameStateVars.inBetweenWaves = false;
        //GameStateVars.startWave = true;
    }
};

system.onEntityDeath = function (eventData) {
    // check for the start chicken
    let name = this.getComponent(eventData.data.entity, "minecraft:nameable");
    if (name !== null) {
        if (name.data.name === "Kill me to Start") {
            GameStateVars.startGame = true;
            return;
        }
    }

    // check the point value for the entity
    let playerStats = this.getComponent(player, "BubbleScripts:PlayerStats");
    if (this.hasComponent(eventData.data.entity, "BubbleScripts:EnemyPoints")) {
        let enemyPoints = this.getComponent(eventData.data.entity, "BubbleScripts:EnemyPoints");
        // give the player a score
        playerStats.data.Score += Number(enemyPoints.data.Points);
        this.applyComponentChanges(player, playerStats);
        // display the score
        let BroadcastEventData = this.createEventData("minecraft:display_chat_event");
        BroadcastEventData.data.message = "Current Score: " + playerStats.data.Score;
        this.broadcastEvent("minecraft:display_chat_event", BroadcastEventData);
    }
};


system.onStartServerSetup = function (eventData) {
    player = eventData.data.player;
    if (!this.hasComponent(player, "BubbleScripts:PlayerStats")) {
        let statscomponent = this.createComponent(player, "BubbleScripts:PlayerStats");
        statscomponent.data.Score = 0;
        statscomponent.data.CurrentWave = 1;
        this.applyComponentChanges(player, statscomponent);
    }

    GameStateVars.startSetup = true;
};