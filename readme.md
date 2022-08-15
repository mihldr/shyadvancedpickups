## Introduction
ShyAdvancedPickups is a script that adds a visual tooltip above dropped items in an
ESX based FiveM server. This is implemented by using a WebGL based 3D Engine (Three.js) and synchronizing the Three.js worldspace aswell as the main camera to GTA. Using the CSS3DRenderer any html, here the tooltips, can be shown in the CEF layer above the game layer.

## Example
To be created

## Installation
In order to use this scrips there's a few modifications required which are listed below  
  

- ```lua 
  -- ShyAdvancedPickups needs to be able to pull all existing pickups,
  -- so that pickups that were created before the player joined can 
  -- be shown aswell 
  -- 
  -- ./es_extended/client/main.lua - Add in a global scope
  -- CodeRef: -

  RegisterNetEvent('esx:getAllPickups')
  AddEventHandler('esx:getAllPickups', function(cb) 
	cb(pickups)
  end)
  ```

- ```lua 
  -- In relation to aboves modification. The (unique) item name is required to
  -- show an items image.
  --
  -- ./es_extended/client/main.lua:L340 - Replace the table insert with (Added `name` here)
  -- CodeRef: https://github.com/esx-framework/esx-legacy/blob/b6ba3bb294d1d9cba53859c6dbd3b1d1a57f48a4/%5Besx%5D/es_extended/client/main.lua#L340

  pickups[pickupId] = {
	obj = object,
	name = name, 
	label = label,
	inRange = false,
	coords = vector3(coords.x, coords.y, coords.z)
  }
  ```

- ```lua 
  -- (Optional) Outcomment the call to DrawText3D to prevent ESX default pickup texts
  --
  -- ./es_extended/client/main.lua:520 
  -- CodeRef: https://github.com/esx-framework/esx-legacy/blob/b6ba3bb294d1d9cba53859c6dbd3b1d1a57f48a4/%5Besx%5D/es_extended/client/main.lua#L520

  --[[ESX.Game.Utils.DrawText3D({
		x = pickup.coords.x,
		y = pickup.coords.y,
		z = pickup.coords.z + 0.25
	}, label, 1.2, 1)]]--
  ```
