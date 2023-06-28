#/bin/bash
#Installer for linux
npm install
read -p "Do you want to run the program? > "
if [ $REPLY == "y" ];
then
    node index.js
elif [ $REPLY == "n" ];
then
    echo "Okay! Happy hacking!"
fi

