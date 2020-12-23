import { Button } from "@blueprintjs/core";
import { IStockWithDollarValue, IOwnedStock } from "@stochastic-exchange/api";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { Routes } from "../../../common/routes";
import { BuyStocksDialog, SellStocksDialog } from "./stocksDialog";
import styles from "./transactStocks.module.scss";

export const TransactStock: React.FC<{
    cashOnHand: number | undefined;
    setViewTransactionsForStock: (stockWithDollarValue: IStockWithDollarValue) => void;
    totalOwnedStock: number;
    userOwnedStockOfStockWithLatestPrice: IOwnedStock | undefined;
    viewStockWithLatestPrice: IStockWithDollarValue;
}> = ({
    cashOnHand,
    setViewTransactionsForStock,
    totalOwnedStock,
    userOwnedStockOfStockWithLatestPrice,
    viewStockWithLatestPrice,
}) => {
    const history = useHistory();

    const [isBuyDialogOpen, setBuyDialogOpenState] = React.useState<boolean>(false);
    const [isSellDialogOpen, setSellDialogOpenState] = React.useState<boolean>(false);

    const openBuyStocksDialog = () => setBuyDialogOpenState(true);
    const closeBuyStocksDialog = () => setBuyDialogOpenState(false);

    const openSellStocksDialog = () => setSellDialogOpenState(true);
    const closeSellStocksDialog = () => setSellDialogOpenState(false);

    const viewTransactionHistory = () => {
        setViewTransactionsForStock(viewStockWithLatestPrice);
        history.push(Routes.TRANSACTIONS);
    };

    return (
        <div className={styles.transactContainer}>
            <span className={styles.yourPortfolioLabel}>Your portfolio</span>
            <div className={styles.transactInformationContainer}>
                <div className={styles.rowContainer}>
                    <div className={styles.transactColumnContainer}>
                        <div className={styles.transactRowContainer}>
                            <div className={styles.transactLabel}>
                                <span className={styles.label}>Cash on hand:</span>
                                <span>${cashOnHand?.toLocaleString()}</span>
                            </div>
                            <div className={styles.transactButtonContainer}>
                                <Button
                                    className={styles.transactButton}
                                    disabled={
                                        (cashOnHand ?? 0) < viewStockWithLatestPrice.dollarValue ||
                                        viewStockWithLatestPrice.totalQuantity - totalOwnedStock === 0
                                    }
                                    intent="success"
                                    text="Buy"
                                    onClick={openBuyStocksDialog}
                                />
                                <BuyStocksDialog
                                    isOpen={isBuyDialogOpen}
                                    onClose={closeBuyStocksDialog}
                                    stock={viewStockWithLatestPrice}
                                    totalOwnedStock={totalOwnedStock}
                                />
                            </div>
                        </div>
                        <div className={styles.transactRowContainer}>
                            <div className={styles.transactLabel}>
                                <span className={styles.label}>You own:</span>
                                <span>{userOwnedStockOfStockWithLatestPrice?.quantity ?? 0} shares</span>
                            </div>
                            <div className={styles.transactButtonContainer}>
                                <Button
                                    className={styles.transactButton}
                                    disabled={
                                        userOwnedStockOfStockWithLatestPrice?.quantity === undefined ||
                                        userOwnedStockOfStockWithLatestPrice.quantity <= 0
                                    }
                                    intent="primary"
                                    text="Sell"
                                    onClick={openSellStocksDialog}
                                />
                                <Button className={styles.transactButton} disabled text="Limit order" />
                                <SellStocksDialog
                                    isOpen={isSellDialogOpen}
                                    onClose={closeSellStocksDialog}
                                    stock={viewStockWithLatestPrice}
                                    totalOwnedStock={totalOwnedStock}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    className={styles.viewTransactionHistory}
                    minimal
                    onClick={viewTransactionHistory}
                    text="View your transaction history"
                />
            </div>
        </div>
    );
};