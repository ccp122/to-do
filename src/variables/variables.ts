import mainLogo from './../assets/main/logo.svg'
import mainLogoSimple from './../assets/main/logo_simple.svg'
import settingsLogo from './../assets/user/settings.svg'
import notificationsLogo from './../assets/user/notifications.svg'
import userStaticLogo from './../assets/user/user.svg'
import rightArrowLogo from './../assets/sidebar/rightArrow.svg'
import plusLogo from './../assets/sidebar/plus.svg'
import trashLogo from './../assets/sidebar/trash.svg'

export const generalVariables: Record<string, string> = {
    "name": "To - Do",
    "logo": mainLogo,
    "logoSimple": mainLogoSimple,
    "settingsLogo": settingsLogo,
    "notificationsLogo": notificationsLogo,
    "userStaticLogo": userStaticLogo,
    "rightArrowLogo": rightArrowLogo,
    "plusLogo": plusLogo,
    "trashLogo": trashLogo
}

export const cssVariables: Record<string, string> = {
    mainCol: "#" + "4f46e5",
    mainColHover: "#" + "4338ca",
    mainColLighter: "#" + "5b55ce",
    bgr1: "#" + "F2F0EF",
    bgr2: "#" + "E5E3E2 ",
    secondary1: "#" + "DCDCDC",
    secondary2: "#" + "858484",
    third1: "#" + "C0C0C0", 
    text1: "#" + "404040", 
    text2: "#" + "737373",
    text3: "#" + "a5a5a5",
    border1: "#" + "4e45ff",
    link1: "#" + "A9A9A9",
    svg: "#" + "838383",
    whiteCol: "#" + "ffffff",
    whiteColLowOpacity: "255, 255, 255, 0.5",
    blackCol: "#" + "000000",
    blackColLowOpacity: "0, 0, 0, 0.5",
    grayCol: "#" + "808080",
    errorCol: "#" + "da0000",
    errorLightCol: "#" + "d32f2f"
}

export const validateVariables: Record<string, number> = {
    userNameCharMax: 12,
    userNameCharMin: 3,
    emailCharMax: 64,
    emailCharMin: 6,
    passwordCharMax: 44,
    passwordCharMin: 8,
    boardCharMax: 12,
    boardCharMin: 1,
    columnCharMax: 12,
    columnCharMin: 1,
    taskTitleCharMax: 50,
    taskTitleCharMin: 1,
    descriptionCharMax: 200,
    descriptionCharMin: 5
}