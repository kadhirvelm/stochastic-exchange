import { IStockPriceReturnType } from "../../types";
import { stabilizeNextDollarValue } from "../stabilizeDollar";

describe("stabilize dollar", () => {
    it("leaves the price alone", () => {
        const nextDollarValue: IStockPriceReturnType<{}> = {
            dollarValue: 10,
            calculationNotes: { someObjectHere: "test-field" },
        };
        const stock = { totalQuantity: 10000 } as any;
        const totalOwnedStock = 0;
        const previousPricePoint = { dollarValue: 9 } as any;

        const { calculationNotes, stabilizedDollar } = stabilizeNextDollarValue(
            nextDollarValue,
            stock,
            totalOwnedStock,
            previousPricePoint,
        );

        expect(calculationNotes).toEqual(
            JSON.stringify({
                someObjectHere: "test-field",
                adjustedChangeByPercentOwnership: 1,
                didRandomlyAssign: false,
            }),
        );
        expect(stabilizedDollar).toEqual(10);
    });

    it("stabilizes the price with more than a 20% decrease", () => {
        const nextDollarValue: IStockPriceReturnType<{}> = {
            dollarValue: 10,
            calculationNotes: { someObjectHere: "test-field" },
        };
        const stock = { totalQuantity: 10000 } as any;
        const totalOwnedStock = 0;
        const previousPricePoint = { dollarValue: 20 } as any;

        const { calculationNotes, stabilizedDollar } = stabilizeNextDollarValue(
            nextDollarValue,
            stock,
            totalOwnedStock,
            previousPricePoint,
        );

        expect(calculationNotes).toEqual(
            JSON.stringify({
                someObjectHere: "test-field",
                adjustedChangeByPercentOwnership: 1,
                didRandomlyAssign: false,
            }),
        );
        expect(stabilizedDollar).toEqual(15);
    });

    it("stabilizes the price with more than a 20% increase", () => {
        const nextDollarValue: IStockPriceReturnType<{}> = {
            dollarValue: 20,
            calculationNotes: { someObjectHere: "test-field" },
        };
        const stock = { totalQuantity: 10000 } as any;
        const totalOwnedStock = 0;
        const previousPricePoint = { dollarValue: 10 } as any;

        const { calculationNotes, stabilizedDollar } = stabilizeNextDollarValue(
            nextDollarValue,
            stock,
            totalOwnedStock,
            previousPricePoint,
        );

        expect(calculationNotes).toEqual(
            JSON.stringify({
                someObjectHere: "test-field",
                adjustedChangeByPercentOwnership: 1,
                didRandomlyAssign: false,
            }),
        );
        expect(stabilizedDollar).toEqual(12.5);
    });

    it("decreases the change when the percent ownership is up and stock is up", () => {
        const nextDollarValue: IStockPriceReturnType<{}> = {
            dollarValue: 10,
            calculationNotes: { someObjectHere: "test-field" },
        };
        const stock = { totalQuantity: 10000 } as any;
        const totalOwnedStock = 10000;
        const previousPricePoint = { dollarValue: 9 } as any;

        const { calculationNotes, stabilizedDollar } = stabilizeNextDollarValue(
            nextDollarValue,
            stock,
            totalOwnedStock,
            previousPricePoint,
        );

        expect(calculationNotes).toEqual(
            JSON.stringify({
                someObjectHere: "test-field",
                adjustedChangeByPercentOwnership: 0.1,
                didRandomlyAssign: false,
            }),
        );
        expect(stabilizedDollar).toEqual(9.1);
    });

    it("decreases the change when the percent ownership is up and stock is down", () => {
        const nextDollarValue: IStockPriceReturnType<{}> = {
            dollarValue: 9,
            calculationNotes: { someObjectHere: "test-field" },
        };
        const stock = { totalQuantity: 10000 } as any;
        const totalOwnedStock = 10000;
        const previousPricePoint = { dollarValue: 10 } as any;

        const { calculationNotes, stabilizedDollar } = stabilizeNextDollarValue(
            nextDollarValue,
            stock,
            totalOwnedStock,
            previousPricePoint,
        );

        expect(calculationNotes).toEqual(
            JSON.stringify({
                someObjectHere: "test-field",
                adjustedChangeByPercentOwnership: 0.1,
                didRandomlyAssign: false,
            }),
        );
        expect(stabilizedDollar).toEqual(9.9);
    });

    it("randomly changes the stock when the change is less than 0.5%", () => {
        const nextDollarValue: IStockPriceReturnType<{}> = {
            dollarValue: 9.95,
            calculationNotes: { someObjectHere: "test-field" },
        };
        const stock = { totalQuantity: 10000 } as any;
        const totalOwnedStock = 0;
        const previousPricePoint = { dollarValue: 10 } as any;

        const { calculationNotes, stabilizedDollar } = stabilizeNextDollarValue(
            nextDollarValue,
            stock,
            totalOwnedStock,
            previousPricePoint,
        );

        expect(calculationNotes).toEqual(
            JSON.stringify({
                someObjectHere: "test-field",
                adjustedChangeByPercentOwnership: 1,
                didRandomlyAssign: true,
            }),
        );
        expect(stabilizedDollar).not.toEqual(9.95);
    });
});
