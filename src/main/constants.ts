/**
 * ┌───────────────────────────────────────────────────────────────┐
 * │ This module includes constants used by other modules.         │
 * └───────────────────────────────────────────────────────────────┘
 */

import { app } from 'electron'
import path from 'path'

const USER_DATA = app.getPath('userData')

export const CONFIG_PATH = path.join(USER_DATA, 'config.json')

export const LOL_SKINS_URL = 'https://github.com/darkseal-org/lol-skins/archive/refs/heads/main.zip'

export const CSLOL_MANAGER_DESTINATION = USER_DATA

export const CSLOL_MANAGER_LOCATION = app.isPackaged
  ? path.join(process.resourcesPath, 'cslol')
  : path.join(__dirname, '..', '..', 'cslol')

export const CSLOL_MANAGER_EXECUTABLE = path.join(CSLOL_MANAGER_LOCATION, 'mod-tools.exe')
export const CSLOL_MANAGER_CONFIG = path.join(CSLOL_MANAGER_LOCATION, 'config.ini')

export const LOL_SKINS_DESTINATION = USER_DATA

export const LOL_SKINS_LOCATION = path.join(USER_DATA, 'lol-skins-main', 'skins')

export const LOL_SKINS_METADATA_URL =
  'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json'

export const LOL_SKINS_METADATA_LOCATION = path.join(USER_DATA, 'skins_metadata.json')

export const TEMP_DIR = path.join(USER_DATA, 'temp')
