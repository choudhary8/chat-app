interface buttonType{
    buttonText:string,
    cls:string,

}

export const CustomButton=({buttonText, cls}:buttonType)=>{
    return <>
    <button className={cls}>{buttonText}</button>
    </>
}