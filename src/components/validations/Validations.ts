import { validateVariables } from './../../variables/variables'

export function validateUsername(value: string) {
    const specialCharRegex = /[^a-zA-Z0-9 _]/
    let cleanValue = value.trim()
    cleanValue = cleanValue.replace(/\s/g, "_")
    if (cleanValue.length === 0) {
        return { status: false, message: `Username is empty.`}
    } else if (cleanValue.length > validateVariables.userNameCharMax) {
        return { status: false, message: `Username can't have more character than ${validateVariables.userNameCharMax}.` }
    } else if (cleanValue.length < validateVariables.userNameCharMin) {
        return { status: false, message: `Username can't have less character than ${validateVariables.userNameCharMin}.` }
    } else if (specialCharRegex.test(cleanValue)) {
        return { status: false, message: `Username can't include special characters.`}
    }
    return { status: true, message: "" , cleanValue: cleanValue}
}

export function validateEmail(value: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    let cleanValue = value.trim()
    cleanValue = cleanValue.replace(/\s/g, "")
    if (cleanValue.length === 0) {
        return { status: false, message: `Email is empty.`}
    } else if (cleanValue.length > validateVariables.emailCharMax) {
        return { status: false, message: `Email can't have more characters than ${validateVariables.emailCharMax}.`}
    } else if (cleanValue.length < validateVariables.emailCharMin) {
        return { status: false, message: `Email can't have more characters than ${validateVariables.emailCharMin}`}
    } else if (!emailRegex.test(cleanValue)) {
        return { status: false, message: `Email is not valid.`}
    }
    return { status: true, message: "" }
}

export function validatePassword(value: string) {
    const repeatedLetterRegex = /([a-zA-Z])\1{2,}/
    const specialCharRegex = /[^a-zA-Z0-9]/
    const doubleSpecialCharRegex = /[^a-zA-Z0-9].*[^a-zA-Z0-9]/
    const numberRegex = /\d/
    const lowercaseRegex = /[a-z]/
    const uppercaseRegex = /[A-Z]/
    let cleanValue = value.trim()
    cleanValue = cleanValue.replace(/\s/g, "")
    if (cleanValue.length === 0) {
        return { status: false, message: `Password is empty.`}
    } else if (cleanValue.length > validateVariables.passwordCharMax) {
        return { status: false, message: `Password can't have more characters than ${validateVariables.passwordCharMax}.`}
    } else if (cleanValue.length < validateVariables.passwordCharMin) {
        return { status: false, message: `Password can't have less characters than ${validateVariables.passwordCharMin}.`}
    } else if (repeatedLetterRegex.test(cleanValue)) {
        return { status: false, message: `Password has too much repeated characters.`}
    } else if (!specialCharRegex.test(cleanValue)) {
        return { status: false, message: `Password does not contain any special characters.`}
    } else if (!doubleSpecialCharRegex.test(cleanValue)) {
        return { status: false, message: `Password needs to contain atleast two special characters.`}
    } else if (!numberRegex.test(cleanValue)) {
        return { status: false, message: `Password does not contain any number characters.`}
    } else if (!lowercaseRegex.test(cleanValue)) {
        return { status: false, message: `Password does not contain any underscore characters.`}
    } else if (!uppercaseRegex.test(cleanValue)) {
        return { status: false, message: `Password does not contain any uppercase characters.`}
    }
    return { status: true, message: "" }
}

export function validateBoard(value: string) {
    let cleanValue = value.trim()
    cleanValue = cleanValue.replace(/\s/g, "_")
    if (cleanValue.length === 0) {
        return { status: false, message: `Board name is empty.`}
    } else if (cleanValue.length > validateVariables.boardCharMax) {
        return { status: false, message: `Board name can't have more characters than ${validateVariables.boardCharMax}`}
    } else if (cleanValue.length < validateVariables.boardCharMin) {
        return { status: false, message: `Board name can't have less characters than ${validateVariables.boardCharMin}`}
    }
    return { status: true, message: "", cleanValue: cleanValue }
}