local isInventoryOpen = false

function ToggleInventory(show)
    isInventoryOpen = show
    SetNuiFocus(show, show)
    SendNUIMessage({
        action = 'setVisible',
        data = show
    })

    if show then
        TriggerServerEvent('meu-inventario:server:openInventory')
    end
end

RegisterCommand('inventario', function()
    ToggleInventory(not isInventoryOpen)
end, false)

RegisterKeyMapping('inventario', 'Abrir Inventário', 'keyboard', 'TAB')

RegisterNetEvent('meu-inventario:client:updateInventory', function(data)
    SendNUIMessage({
        action = 'setInventoryData',
        data = data
    })
end)

-- NUI Callbacks
RegisterNUICallback('closeInventory', function(_, cb)
    ToggleInventory(false)
    cb('ok')
end)

RegisterNUICallback('useItem', function(data, cb)
    TriggerServerEvent('meu-inventario:server:useItem', data.slot, data.item)
    cb('ok')
end)

RegisterNUICallback('dropItem', function(data, cb)
    TriggerServerEvent('meu-inventario:server:dropItem', data.slot, data.amount)
    cb('ok')
end)