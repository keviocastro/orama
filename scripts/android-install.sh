#!/bin/sh

# install on all devices

function install_job { 

    adb -s ${x[0]} install -r PATH_TO_YOUR_APK
    adb -s ${x[0]} shell am start -n "com.example.MainActivity" -a android.intent.action.MAIN -c android.intent.category.LAUNCHER

}


#iterate over devices IP-addresses or serial numbers and start a job 

while read LINE
do
    eval x=($LINE)
    install_job ${x[0]} > /dev/null 2>&1 &
done <<< "`adb devices |  cut -sf 1`"

echo "WATING FOR INSTALLATION PROCESSES TO COMPLETE"
wait

echo "DONE INSTALLING"