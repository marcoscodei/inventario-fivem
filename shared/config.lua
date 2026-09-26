Config = {}

Config.MaxWeight = 50.0 -- Capacidade máxima em kg
Config.MaxSlots = 30    -- Quantidade total de slots na mochila

Config.Items = {
    ["water"] = { name = "water", label = "Água", weight = 0.5, type = "useable" },
    ["bread"] = { name = "bread", label = "Pão", weight = 0.3, type = "useable" },
    ["weapon_pistol"] = { name = "weapon_pistol", label = "Pistola 9mm", weight = 2.5, type = "weapon" },
    ["weapon_assaultrifle"] = { name = "weapon_assaultrifle", label = "Fuzil de Assalto", weight = 5.0, type = "weapon" },
    ["medkit"] = { name = "medkit", label = "Kit Médico", weight = 1.0, type = "useable" },
    ["radio"] = { name = "radio", label = "Rádio Comunicador", weight = 0.8, type = "useable" }
}