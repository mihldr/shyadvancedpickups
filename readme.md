## Installation


```lua 
-- ./es_extended/client/main.lua - In a global scope add 
RegisterNetEvent('esx:getAllPickups')
AddEventHandler('esx:getAllPickups', function(cb) 
	cb(pickups)
end)
```

```lua 
-- ./es_extended/client/main.lua:289 - Replace the table insert with (Added `name` here)
pickups[pickupId] = {
	obj = object,
	name = name, 
	label = label,
	inRange = false,
	coords = vector3(coords.x, coords.y, coords.z)
}
```
