#!/bin/sh
RESOURCE_NAME=kenrobot-krobot

SCRIPT_PATH=$( cd $(dirname $0) ; pwd )
cd "${SCRIPT_PATH}"
UNINSTALL=false

XDG_DESKTOP_DIR="${HOME}/Desktop"
if [ -f "${XDG_CONFIG_HOME:-${HOME}/.config}/user-dirs.dirs" ]; then
  . "${XDG_CONFIG_HOME:-${HOME}/.config}/user-dirs.dirs"
fi

xdg_install_f() {

  TMP_DIR=`mktemp --directory`

  sed -e "s,<BINARY_LOCATION>,${SCRIPT_PATH}/krobot,g" \
      -e "s,<ICON_NAME>,${RESOURCE_NAME},g" "${SCRIPT_PATH}/resources/desktop.template" > "${TMP_DIR}/${RESOURCE_NAME}.desktop"

  xdg-icon-resource install --context apps --size 16 "${SCRIPT_PATH}/resources/icons/16x16.png" $RESOURCE_NAME
  xdg-icon-resource install --context apps --size 24 "${SCRIPT_PATH}/resources/icons/24x24.png" $RESOURCE_NAME
  xdg-icon-resource install --context apps --size 32 "${SCRIPT_PATH}/resources/icons/32x32.png" $RESOURCE_NAME
  xdg-icon-resource install --context apps --size 48 "${SCRIPT_PATH}/resources/icons/48x48.png" $RESOURCE_NAME
  xdg-icon-resource install --context apps --size 64 "${SCRIPT_PATH}/resources/icons/64x64.png" $RESOURCE_NAME
  xdg-icon-resource install --context apps --size 72 "${SCRIPT_PATH}/resources/icons/72x72.png" $RESOURCE_NAME
  xdg-icon-resource install --context apps --size 96 "${SCRIPT_PATH}/resources/icons/96x96.png" $RESOURCE_NAME
  xdg-icon-resource install --context apps --size 128 "${SCRIPT_PATH}/resources/icons/128x128.png" $RESOURCE_NAME
  xdg-icon-resource install --context apps --size 256 "${SCRIPT_PATH}/resources/icons/256x256.png" $RESOURCE_NAME

  xdg-desktop-menu install "${TMP_DIR}/${RESOURCE_NAME}.desktop"

  xdg-desktop-icon install "${TMP_DIR}/${RESOURCE_NAME}.desktop"

  xdg-mime install "${SCRIPT_PATH}/resources/${RESOURCE_NAME}.xml"

  xdg-icon-resource install --context mimetypes --size 16 "${SCRIPT_PATH}/resources/icons/16x16.png" text-x-krobot
  xdg-icon-resource install --context mimetypes --size 24 "${SCRIPT_PATH}/resources/icons/24x24.png" text-x-krobot
  xdg-icon-resource install --context mimetypes --size 32 "${SCRIPT_PATH}/resources/icons/32x32.png" text-x-krobot
  xdg-icon-resource install --context mimetypes --size 48 "${SCRIPT_PATH}/resources/icons/48x48.png" text-x-krobot
  xdg-icon-resource install --context mimetypes --size 64 "${SCRIPT_PATH}/resources/icons/64x64.png" text-x-krobot
  xdg-icon-resource install --context mimetypes --size 72 "${SCRIPT_PATH}/resources/icons/72x72.png" text-x-krobot
  xdg-icon-resource install --context mimetypes --size 96 "${SCRIPT_PATH}/resources/icons/96x96.png" text-x-krobot
  xdg-icon-resource install --context mimetypes --size 128 "${SCRIPT_PATH}/resources/icons/128x128.png" text-x-krobot
  xdg-icon-resource install --context mimetypes --size 256 "${SCRIPT_PATH}/resources/icons/256x256.png" text-x-krobot

  xdg-mime default ${RESOURCE_NAME}.desktop text/x-krobot

  rm "${TMP_DIR}/${RESOURCE_NAME}.desktop"
  rmdir "$TMP_DIR"
}

simple_install_f() {
  TMP_DIR=`mktemp --directory`

  sed -e "s,<BINARY_LOCATION>,${SCRIPT_PATH}/krobot,g" \
      -e "s,<ICON_NAME>,${SCRIPT_PATH}/resources/krobot.png,g" "${SCRIPT_PATH}/resources/desktop.template" > "${TMP_DIR}/${RESOURCE_NAME}.desktop"

  mkdir -p "${HOME}/.local/share/applications"
  cp "${TMP_DIR}/${RESOURCE_NAME}.desktop" "${HOME}/.local/share/applications/"

  mkdir -p "${HOME}/.local/share/metainfo"
  cp "${SCRIPT_PATH}/resources/appdata.xml" "${HOME}/.local/share/metainfo/${RESOURCE_NAME}.appdata.xml"

  if [ -d "${XDG_DESKTOP_DIR}" ]; then
   cp "${TMP_DIR}/${RESOURCE_NAME}.desktop" "${XDG_DESKTOP_DIR}/"
   chmod u+x "${XDG_DESKTOP_DIR}/${RESOURCE_NAME}.desktop"
  fi

  rm "${TMP_DIR}/${RESOURCE_NAME}.desktop"
  rmdir "${TMP_DIR}"
}

xdg_uninstall_f() {
  xdg-desktop-menu uninstall ${RESOURCE_NAME}.desktop

  xdg-desktop-icon uninstall ${RESOURCE_NAME}.desktop

  xdg-icon-resource uninstall --size 16 ${RESOURCE_NAME}
  xdg-icon-resource uninstall --size 24 ${RESOURCE_NAME}
  xdg-icon-resource uninstall --size 32 ${RESOURCE_NAME}
  xdg-icon-resource uninstall --size 48 ${RESOURCE_NAME}
  xdg-icon-resource uninstall --size 64 ${RESOURCE_NAME}
  xdg-icon-resource uninstall --size 72 ${RESOURCE_NAME}
  xdg-icon-resource uninstall --size 96 ${RESOURCE_NAME}
  xdg-icon-resource uninstall --size 128 ${RESOURCE_NAME}
  xdg-icon-resource uninstall --size 256 ${RESOURCE_NAME}

  xdg-icon-resource uninstall --size 16  text-x-krobot
  xdg-icon-resource uninstall --size 24  text-x-krobot
  xdg-icon-resource uninstall --size 32  text-x-krobot
  xdg-icon-resource uninstall --size 48  text-x-krobot
  xdg-icon-resource uninstall --size 64  text-x-krobot
  xdg-icon-resource uninstall --size 72  text-x-krobot
  xdg-icon-resource uninstall --size 96  text-x-krobot
  xdg-icon-resource uninstall --size 128  text-x-krobot
  xdg-icon-resource uninstall --size 256  text-x-krobot

  xdg-mime uninstall "${SCRIPT_PATH}/resources/${RESOURCE_NAME}.xml"
}

simple_uninstall_f() {
  if [ -f "${HOME}/.local/share/applications/krobot.desktop" ]; then
    rm "${HOME}/.local/share/applications/krobot.desktop"
  fi

  if [ -f "${HOME}/.local/share/applications/kenrobot-krobot.desktop" ]; then
    rm "${HOME}/.local/share/applications/kenrobot-krobot.desktop"
  fi

  if [ -f "${HOME}/.local/share/applications/${RESOURCE_NAME}.desktop" ]; then
    rm "${HOME}/.local/share/applications/${RESOURCE_NAME}.desktop"
  fi

  if [ -f "${HOME}/.local/share/metainfo/${RESOURCE_NAME}.appdata.xml" ]; then
    rm "${HOME}/.local/share/metainfo/${RESOURCE_NAME}.appdata.xml"
  fi

  if [ -f "${XDG_DESKTOP_DIR}/krobot.desktop" ]; then
    rm "${XDG_DESKTOP_DIR}/krobot.desktop"
  fi

  if [ -f "${XDG_DESKTOP_DIR}/${RESOURCE_NAME}.desktop" ]; then
    rm "${XDG_DESKTOP_DIR}/${RESOURCE_NAME}.desktop"
  fi
}

updatedbs_f() {
  if [ -d "${HOME}/.local/share/applications" ]; then
    if command -v update-desktop-database > /dev/null; then
      update-desktop-database "${HOME}/.local/share/applications"
    fi
  fi

  if [ -d "${HOME}/.local/share/mime" ]; then
    if command -v update-mime-database > /dev/null; then
      update-mime-database "${HOME}/.local/share/mime"
    fi
  fi
}

xdg_exists_f() {
  if ! command -v xdg-icon-resource > /dev/null; then return 1; fi
  if ! command -v xdg-desktop-menu > /dev/null; then return 1; fi
  if ! command -v xdg-desktop-icon > /dev/null; then return 1; fi
  if ! command -v xdg-mime > /dev/null; then return 1; fi
  return 0
}

display_help_f() {
  printf "\nThis script will add a KRobot desktop shortcut, menu item,\n"
  printf "icons and file associations for the current user.\n"
  if ! xdg_exists_f; then
    printf "\nxdg-utils are recommended to be installed, so this script can use them.\n"
  fi
  printf "\nOptional arguments are:\n\n"
  printf "\t-u, --uninstall\t\tRemoves shortcut, menu item and icons.\n\n"
  printf "\t-h, --help\t\tShows this help again.\n\n"
}

while [ $# -gt 0 ] ; do
  ARG="${1}"
  case $ARG in
      -u|--uninstall)
        UNINSTALL=true
        shift
      ;;
      -h|--help)
        display_help_f
        exit 0
      ;;
      *)
        printf "\nInvalid option -- '${ARG}'\n"
        display_help_f
        exit 1
      ;;
  esac
done

if xdg_exists_f; then
  if [ ${UNINSTALL} = true ]; then
    printf "Removing desktop shortcut and menu item for KRobot..."
    xdg_uninstall_f
    simple_uninstall_f
  else
    printf "Adding desktop shortcut, menu item and file associations for KRobot..."
    xdg_uninstall_f
    simple_uninstall_f
    xdg_install_f
  fi
else
  if [ ${UNINSTALL} = true ]; then
    printf "Removing desktop shortcut and menu item for KRobot..."
    simple_uninstall_f
  else
    printf "Adding desktop shortcut and menu item for KRobot..."
    simple_uninstall_f
    simple_install_f
  fi
fi
updatedbs_f
printf " done!\n"

exit 0
