playerPed = GetPlayerPed(-1)


ShyAdvancedPickups.AddPickup = function(pickupId, label, coords, type, name, components, tintIndex)
    SendNUIMessage({
        action = "AddPickup",
        data = {
            id = pickupId,
            imgUrl = ShyAdvancedPickups.Config.getImageUrl(name),
            label = label,
            pos = coords
        }  
    })
end

ShyAdvancedPickups.RemovePickup = function(id)
    SendNUIMessage({
        action = "RemovePickup",
        data = id
    })
end

ShyAdvancedPickups.Initialize = function()
    Citizen.CreateThread(function()
        -- Wait some milliseconds until Three.js and modules are mounted
        Wait(100)
    
        SendNUIMessage({
            action  = "Init",
            data    = {
                fov                         = GetFinalRenderedCamFov(),
                near                        = GetFinalRenderedCamNearClip(),
                far                         = GetFinalRenderedCamFarClip(),
                maxDistance                 = ShyAdvancedPickups.Config.maxDistance,
                pickItemText                = ShyAdvancedPickups.Config.pickItemText,
                animation                   = ShyAdvancedPickups.Config.Animation,
                hidePickupsWhileAiming      = ShyAdvancedPickups.Config.HidePickupsWhileAiming
            }
        })
    end)
end

ShyAdvancedPickups.StartThreads = function()    
    Citizen.CreateThread(function() 
        while true do
            local playerCoords = GetEntityCoords(playerPed)
            local camCoords, camRot = GetFinalRenderedCamCoord(), GetFinalRenderedCamRot(2) * (math.pi / 180)
            local camRotDir = vector3(
                -math.sin(camRot.z) * math.cos(camRot.x),
                math.cos(camRot.z) * math.cos(camRot.x),
                math.sin(camRot.x)
            );
            
            SendNUIMessage({
                action = "OnGameTick",
                data = {
                    camPos = camCoords,
                    camDirVector = camRotDir,
                    playerPos = playerCoords + vector3(0,0,1)
                }
            })

            
            Wait(0)
        end
    end)

    Citizen.CreateThread(function()
        while true do
            playerPed = GetPlayerPed(-1)


            SendNUIMessage({
                action = "UpdateCamMeta",
                data = {
                    fov             = GetFinalRenderedCamFov(),
                    near            = GetFinalRenderedCamNearClip(),
                    far             = GetFinalRenderedCamFarClip(),
                    isAiming        = IsPlayerFreeAiming(PlayerId())
                }
            })

            -- Data rarely changes here, so only update cam meta data every 100ms to optimise performance
            -- Though this will cause camera changes to appear laggy
            Wait(100)
        end
    end)
end

ShyAdvancedPickups.OnThreeReady = function(_, cb) 
    ShyAdvancedPickups.StartThreads()

    cb("ok")
end

-- [[ NUI Handlers ]]
RegisterNUICallback('ready', ShyAdvancedPickups.OnThreeReady)

-- [[ Event Handlers ]]
RegisterNetEvent("esx:createPickup", ShyAdvancedPickups.AddPickup)
RegisterNetEvent("esx:removePickup", ShyAdvancedPickups.RemovePickup)

-- [[ Start Script ]]
ShyAdvancedPickups.Initialize()

-- [[ Debug ]]
RegisterCommand("testpickup", function()
    ShyAdvancedPickups.AddPickup("Test", "Test", GetEntityCoords(GetPlayerPed(-1)))
end)

RegisterCommand("debug_spampickups", function()
    CreateThread(function() 
        while true do 
            ShyAdvancedPickups.AddPickup(math.random(1, 9999999), "Brot", GetEntityCoords(GetPlayerPed(-1)), nil, "bread")

            Wait(500)
        end
    end)
end)