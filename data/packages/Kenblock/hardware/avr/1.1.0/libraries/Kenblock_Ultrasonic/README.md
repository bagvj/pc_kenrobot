# Kenblock Library v0.1.0

Arduino Library for Kenblock Electronic Modules

This library is v0.1.0. We strongly recommend that all Kenblock customers use the new version.

How to use:

1. Download the source from the git https://github.com

2. copy the Kenblock folder to your arduino default library. Your Arduino library folder should now look like this 
   (on Windows): [arduino installation directory]\libraries\Kenblock\src
   (On MACOS): [arduino Package Contents]\contents\Jave\libraries\Kenblock\src

3. Open the Arduino Application. (If it's already open, you will need to restart it to see changes.)

4. Click "File-> Examples". Here are some test programs in Kenblock -> examples

5. Depending on the type of board you're using, you need to modify the header file to match.
   For example, if you're using a Kenblock ATmega328 Main-board. You should include "#include <Kenblock.h>"
   Corresponding boards and there header file are:

   Kenblock ATmega328 Main-board ：
		Kenblock.h
		Kenblock_Ultrasonic.h

