ShyAdvancedPickups = {}

ShyAdvancedPickups.Config = {
    Animation = {
        -- Whether or not to use animations on pickup tooltips
        enable = true,

        -- The name of the animation ("pulse"|"bounce"|"gelatine")
        name = "bounce",

        -- The time in seconds an animation takes until it ends and
        -- starts another iteration
        duration = 3
    },

    HidePickupsWhileAiming = true,
    
    -- Pickup Item text (HTML possible)
    pickItemText = 'Press <span style="color: yellow">[E]</span> to pickup item.',  

    -- Sets the max distance for which 3D item should be shown
    maxDistance = 10.0,

    -- Helper function which transforms an itemName to an URI
    getImageUrl = function(itemName) 
        return string.format("https://cfx-nui-%s/web/itemimages/%s.png", GetCurrentResourceName(), itemName)
    end
}