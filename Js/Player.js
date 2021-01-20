class Player {
    constructor (ID, name, previousWeapon, currentWeapon, playerPositionClass) {
        this.ID = ID
        this.name = name
        this.previousWeapon = previousWeapon
        this.currentWeapon = currentWeapon
        this.playerPositionClass = playerPositionClass
        this.x = -1
        this.y = -1
        this.health = 100
        this.defend = false
    }

    setPosition (x, y) { 
        this.x = x
        this.y = y
    }
    
    takeDamage (damage) {
        if (this.defend === true) {
            this.health = this.health - Math.round(damage / 2)
            this.defend = false
        } else {
            this.health = this.health - damage
        }
    }
}