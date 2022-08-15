## Installation


```lua 
-- ./es_extended/client/main.lua: In a global scope add 
RegisterNetEvent('esx:getAllPickups')
AddEventHandler('esx:getAllPickups', function(cb) 
	cb(pickups)
end)
```
