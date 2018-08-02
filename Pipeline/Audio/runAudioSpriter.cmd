:: Uses AudioSpriter (in this directory) to concatenate all .wav files in a source directory into an audio sprite (large .mp3 and .ogg files with a .json detailing its contents)
:: NAudio.dll, NAudio.xml, ffmpeg.exe all need to be in the same directory as AudioSpriter.exe

:: Currently, all .wav files must have a sample rate of 44100 and be mono channel.


@echo off
setlocal

:: The directory containing the source .wav files:
set SOURCE_DIRECTORY=./Source

:: Absolute directory to place the completed audio sprites:
set DESTINATION_DIRECTORY="../../Tygem/Assets/Audiosprites"

:: Directory that will store .wav versions of the audio sprite
set WAV_DIRECTORY=./wav-audiosprites

:: Calling AudioSpriter
call AudioSpriter -s %SOURCE_DIRECTORY% -d %DESTINATION_DIRECTORY% -w %WAV_DIRECTORY%



:: more info on cmd scripts:
:: - http://steve-jansen.github.io/guides/windows-batch-scripting/index.html
:: - call /?
:: - use %~dp0 to get the directory of this file.
:: - KDiff3 command line: http://kdiff3.sourceforge.net/doc/documentation.html
