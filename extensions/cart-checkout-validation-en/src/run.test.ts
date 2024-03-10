import { ProductVariant } from './../../../../checkout-one-app/extensions/order-discount/generated/api';
import { describe, it, expect } from 'vitest';
import { run } from './run';
import { BuyerJourneyStep, FunctionRunResult } from "../generated/api";

describe('cart checkout validation function', () => {
  it('returns an error when quantity exceeds one', () => {
    const result = run({
      buyerJourney : {
        step : BuyerJourneyStep.CheckoutInteraction
      },
      cart : {
        buyerIdentity : {
          customer :{
            numberOfOrders : 5
          }
        },
        cost : {
          subtotalAmount  :{
            amount : 15
          },
        },
        lines : {
          quantity : 2
        }
      }
    });
    const expected: FunctionRunResult = { errors: [
      {
        localizedMessage: "minimum value is 100 USD",
        target: "cart"
      }
    ] };

    expect(result).toEqual(expected);
  });

  it('returns no errors when quantity is one', () => {
    const result = run({
      buyerJourney : {
        step : BuyerJourneyStep.CheckoutInteraction
      },
      cart : {
        buyerIdentity : {
          customer :{
            numberOfOrders : 5
          }
        },
        cost : {
          subtotalAmount  :{
            amount : 100
          },
        },
        lines : {
          quantity : 3
        },
      }
    });
    const expected: FunctionRunResult = { errors: [] };

    expect(result).toEqual(expected);
  });
});