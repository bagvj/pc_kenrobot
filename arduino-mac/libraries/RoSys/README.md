# RoSys Library v1.01

Arduino Library for RoSys Electronic Modules

This library is v1.01. We strongly recommend that all RoSys customers use the new version.

How to use:

1. Download the source from the git https://github.com

2. copy the RoSys folder to your arduino default library. Your Arduino library folder should now look like this 
   (on Windows): [arduino installation directory]\libraries\RoSys\src
   (On MACOS): [arduino Package Contents]\contents\Jave\libraries\RoSys\src

3. Open the Arduino Application. (If it's already open, you will need to restart it to see changes.)

4. Click "File-> Examples". Here are some test programs in RoSysDrive-> example

5. Depending on the type of board you're using, you need to modify the header file to match.
   For example, if you're using a RoSys Basic. You should include "#include <RoSys.h>"
   Corresponding boards and there header file are:

   RoSys ATmega328 Main-board <-------->  RoSys.h
