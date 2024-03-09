import {
  reactExtension,
  useExtensionCapability,
  useBuyerJourneyIntercept,
  useCartLines,
} from '@shopify/ui-extensions-react/checkout';

import { useState,useEffect} from 'react'

export default reactExtension(
  'purchase.checkout.contact.render-after',
  () => <Extension />,
);

function Extension() {
  
  const cart = useCartLines()

  const targetedAmount = 100;
  const targetedCur = "USD";

  const [validationError,setValidationError] = useState("")

  const [myTotalCost,setMyTotalCost] = useState(0);
  const [myCurrency,setMyCurrency] = useState(null);

  useEffect(()=>{
    let tempCost = 0;
    if(cart.length > 0){
      cart.forEach(elem => {
        if(!myCurrency){
          setMyCurrency(elem['cost']['totalAmount']['currencyCode'])
        }
        const mCost = elem['cost']['totalAmount']['amount'];
        tempCost += mCost;
      })
    }
    console.log(tempCost)
    setMyTotalCost(tempCost);
  },[]);

  const clearValidationErrors = () =>{
    setValidationError("");
  }

  useBuyerJourneyIntercept(({canBlockProgress}) => {
    if(canBlockProgress && !myTotalCost){
      return{
        behavior: "block",
        reason: "No cart data available",
        perform: (result) =>{
          if(result.behavior === "block"){
            setValidationError("Something went wrong")
          }
        }
      }
    }

    if(canBlockProgress && myTotalCost < targetedAmount){
      return{
        behavior: "block",
        reason: `Please buy atleast equivalent amount to ${targetedAmount} ${targetedCur}`,
        errors: [
          {
            message: `Please buy atleast equivalent amount to ${targetedAmount} ${targetedCur}`
          }
        ]
      }
    }

    return{
      behavior: "allow",
      perform: () =>{
        clearValidationErrors()
      }
    }
  })

  return null;
}