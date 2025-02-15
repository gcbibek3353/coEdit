import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  

const UserTypeSelector = ({userType,setUserType,onClickHandler}: UserTypeSelectorParams ) => {

  const accessChangeHandler = (type: UserType) => {
    setUserType(type);
  
    if (onClickHandler) {
      onClickHandler(type);
    }
  };
  

  return (
    <Select value={userType} onValueChange={(type : UserType) => accessChangeHandler(type)}>
  <SelectTrigger className="shad-select">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="viewer" className='shad-select-item'>can View </SelectItem>
    <SelectItem value="editor" className='shad-select-item'>can Edit </SelectItem>
  </SelectContent>
</Select>

  )
}

export default UserTypeSelector