import { useState } from "react";


const useFormInput = (intialValue) => {
  const [state, setState] = useState(intialValue);

  const handlleChange = e => {
    const { name, value } = e.target;
    setState(state => ({ ...state, [name]: value }))
  }
  const reset = intialValue => setState(intialValue)

  return [state, handlleChange, reset]

}

export default useFormInput;