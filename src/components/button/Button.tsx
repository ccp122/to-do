import './Button.css'

interface ButtonProps {
    textProp: string
    onClick?: () => void
}

function Button({textProp, onClick}: ButtonProps) {
    return (
        <button className='Button capitalize' onClick={onClick}>
            {textProp}
        </button>
    )
}

export default Button