:: Uses TygemTiledPacker (in this directory) to pack Tiled map and tileset files into a file that adds them to TiledMap.

@echo off
setlocal


:: The reference path line that gets put on top of the output file.
set REFERENCE_PATH_LINE="/// <reference path=\"../app.ts\" />"

:: The tileset image directory, where TexPackManager holds the images for the tilesets.
set TILESET_IMAGE_DIRECTORY=Tilesets/

:: The directory to search for .json tilemap files.  This is NON-RECURSIVE, i.e. this is the only folder that should contain the tilemap files.
set TILEMAP_DIRECTORY="%~dp0/Tiledmaps"

:: The directory to search for .json tileset files.  This is NON-RECURSIVE, i.e. this is the only folder that should contain the tileset files.
set TILESET_DIRECTORY="%~dp0/Tiledmaps/Tilesets"

:: The output file.
set OUTPUT_FILE="../../Tygem/Code/add_Tilemaps.ts"


:: Calling TiledPacker (note: add -quick to skip the user input prompt)
call "%~dp0TygemTiledPacker.exe" -r %REFERENCE_PATH_LINE% -tid %TILESET_IMAGE_DIRECTORY% -tm %TILEMAP_DIRECTORY% -ts %TILESET_DIRECTORY% -o %OUTPUT_FILE% -quick


:: more info on cmd scripts:
:: - http://steve-jansen.github.io/guides/windows-batch-scripting/index.html
:: - call /?
:: - use %~dp0 to get the directory of this file.
:: - KDiff3 command line: http://kdiff3.sourceforge.net/doc/documentation.html
