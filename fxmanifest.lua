fx_version 'cerulean'
game 'gta5'

author 'Marcos Boni'
description 'Inventario NUI Customizavel para FiveM'
version '1.0.0'

ui_page 'dist/index.html'

files {
    'dist/index.html',
    'dist/assets/**/*'
}

shared_scripts {
    'shared/config.lua'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    'server/main.lua'
}