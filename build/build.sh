#!/bin/bash
set -e

title='啃萝卜' # dmg文件mount了之后在文件系统中显示的名称
background_picture_name='mac_bg.png' # dmg文件在mount了之后界面中显示的背景图片路径
application_name='啃萝卜.app' # 应用程序的名称
size='370M' # 大小
product_name='kenrobot' # 产品名
version='0.1.1' # 版本号

window_left=200
window_top=100
app_icon_width=128  # 应用的 logo 大小
app_icon_left=150   # 应用的 logo 在窗口中的 x 坐标
app_icon_top=200    # 应用的 logo 在窗口中的 y 坐标
applications_link_left=450 # Application 文件链接在窗口中的 x 坐标
applications_link_top=200  # Application 文件链接在窗口中的 y 坐标

output_dir='output'
output_name='kenrobot.dmg'
app_folder_name='kenrobot'

mkdir -p ${output_dir}
rm -f ${output_dir}/${output_name}
hdiutil create -size ${size} -volname "${title}" -fs HFS+ -fsargs "-c c=64,a=16,e=16" ${output_dir}/${output_name}

# 如果有 mount 了其他的 dmg 文件在 Finder 里面了，先弹出掉
if [ -d /Volumes/${title} ]; then
  ejectDmgMount
fi
hdiutil mount ${output_dir}/${output_name}

image_width=`sips -g pixelWidth ${background_picture_name} | tail -n 1 | grep -oE '[0-9]+$'`
image_height=`sips -g pixelHeight ${background_picture_name} | tail -n 1 | grep -oE '[0-9]+$'`

# 复制编译好的app目录
rm -rf /Volumes/${title}/${app_folder_name}
cp -R ${app_folder_name} /Volumes/${title}/${app_folder_name}

mkdir -p /Volumes/${title}/.background
rm -f /Volumes/${title}/.background/*
cp ./${background_picture_name} /Volumes/${title}/.background/bg.png

buildDmg
rm -rf ./${output_dir}/${output_name}
exit 0

function ejectDmgMount() {
  # 弹出临时的 dmg mount
  echo '
     tell application "Finder"
       tell disk "'${title}'"
             open
             delay 2
             eject
             delay 2
       end tell
     end tell
  ' | osascript
}

function setDmgFinderInfo() {
  window_right=$(($image_width+$window_left))
  window_bottom=$(($image_height+$window_top))
  echo '
     tell application "Finder"
       tell disk "'${title}'"
             open
             set current view of container window to icon view
             set toolbar visible of container window to false
             set statusbar visible of container window to false
             set the bounds of container window to {'$window_left', '$window_top', '$window_right', '$window_bottom'}
             set theViewOptions to the icon view options of container window
             set arrangement of theViewOptions to not arranged
             set icon size of theViewOptions to '$app_icon_width'
             set background picture of theViewOptions to file ".background:bg.png"
             set position of item "'${application_name}'" of container window to {'$app_icon_left', '$app_icon_top'}
             update without registering applications
             close
       end tell
     end tell
  ' | osascript
}

# 打包dmg
function buildDmg() {
  # mount 临时的 dmg 文件
  if [ -d /Volumes/${title} ]; then
    ejectDmgMount
  fi
  hdiutil mount ${output_dir}/${output_name}

  setDmgFinderInfo
  ejectDmgMount
  
  # 导出只读的 dmg 文件
  today=`date '+%Y-%m-%d.%H'`
  hdiutil convert ./${output_dir}/${output_name} -format UDZO -imagekey zlib-level=9 \
  -o "./${output_dir}/${product_name}-${version}-${today}.dmg"
}