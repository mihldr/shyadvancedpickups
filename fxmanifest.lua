fx_version 'adamant'
games { 'gta5' }

version '1.0.0'
author 'ShynoX'
description 'Provides a more advanced way to display pickups generated by esx'

ui_page 'web/index.html'

client_scripts {
    'Config.lua',
    'client/**.*'
}

files {
  'web/**.*'
}