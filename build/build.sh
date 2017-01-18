#!/bin/bash
set -e

title='啃萝卜' # dmg 文件 mount 了之后在文件系统中显示的名称
background_picture_name='mac-dmg-bg.png' # dmg 文件在 mount 了之后界面中显示的背景图片路径
application_name='啃萝卜.app' # 应用程序的名称

window_left=200
window_top=100
app_icon_width=128  # 应用的 logo 大小
app_icon_left=150   # 应用的 logo 在窗口中的 x 坐标
app_icon_top=200    # 应用的 logo 在窗口中的 y 坐标
applications_link_left=450 # Application 文件链接在窗口中的 x 坐标
applications_link_top=200  # Application 文件链接在窗口中的 y 坐标

mkdir -p dmg-releases
rm -f dmg-releases/pack.temp.dmg
hdiutil create -size 370M -volname "${title}" -fs HFS+ -fsargs "-c c=64,a=16,e=16" dmg-releases/pack.temp.dmg

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
# 如果有 mount 了其他的 dmg 文件在 Finder 里面了，先弹出掉
if [ -d /Volumes/${title} ]; then
  ejectDmgMount
fi
hdiutil mount dmg-releases/pack.temp.dmg

image_width=`sips -g pixelWidth ${background_picture_name} | tail -n 1 | grep -oE '[0-9]+$'`
image_height=`sips -g pixelHeight ${background_picture_name} | tail -n 1 | grep -oE '[0-9]+$'`

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
             set position of item "Applications" of container window to {'$applications_link_left', '$applications_link_top'}
             update without registering applications
             close
       end tell
     end tell
  ' | osascript
}


# 打包某一个渠道的 dmg 版本
function buildDmgForChannel() {
  local channel=$1
  
  # mount 临时的 dmg 文件
  if [ -d /Volumes/${title} ]; then
    ejectDmgMount
  fi
  hdiutil mount dmg-releases/pack.temp.dmg
  
  # 变更渠道标识文件，我们是使用一个文本文件做的记录，这样分渠道打包时，不需要重新编译
  echo $channel &gt; "/Volumes/${title}/${app_folder_name}/Contents/Resources/configuration_source.txt"

  setDmgFinderInfo
  ejectDmgMount
  
  # 导出只读的 dmg 文件
  today=`date '+%Y-%m-%d.%H'`
  hdiutil convert ./dmg-releases/pack.temp.dmg -format UDZO -imagekey zlib-level=9 \
  -o "./dmg-releases/${project_name}-${version}-${channel}-${today}.dmg"
}

buildDmgForChannel 1kxun

rm -rf ./dmg-releases/pack.temp.dmg
