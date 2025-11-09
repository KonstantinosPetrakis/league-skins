/**
 * ┌───────────────────────────────────────────────────────────────┐
 * │ This module includes constants used by other modules.         │
 * └───────────────────────────────────────────────────────────────┘
 */

import { app } from 'electron'

const USER_DATA = app.getPath('userData')

export const CONFIG_PATH = USER_DATA + '/config.json'

export const CSLOL_MANAGER_URL =
  'https://github.com/LeagueToolkit/cslol-manager/releases/latest/download/cslol-manager.zip'

export const LOL_SKINS_URL = 'https://github.com/darkseal-org/lol-skins/archive/refs/heads/main.zip'

export const CSLOL_MANAGER_DESTINATION = USER_DATA // no need for directory, zip contains a directory
export const CSLOL_MANAGER_LOCATION = USER_DATA + '\\cslol-manager'
export const CSLOL_MANAGER_EXECUTABLE = CSLOL_MANAGER_LOCATION + '\\cslol-tools\\mod-tools.exe'
export const CSLOL_MANAGER_CONFIG = CSLOL_MANAGER_LOCATION + '\\config.ini'

export const LOL_SKINS_DESTINATION = USER_DATA // no need for directory, zip contains a directory
export const LOL_SKINS_LOCATION = USER_DATA + '\\lol-skins-main\\skins'

export const LOL_SKINS_METADATA_URL =
  'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json'
export const LOL_SKINS_METADATA_LOCATION = USER_DATA + '\\skins_metadata.json'

export const TEMP_DIR = USER_DATA + '\\temp'
