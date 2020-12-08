import { Button, Spinner } from "@blueprintjs/core";
import { IOwnedStock, IStockWithDollarValue, StocksFrontendService } from "@stochastic-exchange/api";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import { Routes } from "../../common/routes";
import { selectUserOwnedStock } from "../../selectors/selectUserOwnedStock";
import { SetViewStockWithLatestPrice, SetViewTransactionsForStock } from "../../store/interface/actions";
import { IStoreState } from "../../store/state";
import { callOnPrivateEndpoint } from "../../utils/callOnPrivateEndpoint";
import { formatNumber } from "../../utils/formatNumber";
import styles from "./stockInformation.module.scss";
import { BuyStocksDialog, SellStocksDialog } from "./stocksDialog";

interface IStoreProps {
    cashOnHand: number | undefined;
    userOwnedStockOfStockWithLatestPrice: IOwnedStock | undefined;
    viewStockWithLatestPrice: IStockWithDollarValue | undefined;
}

interface IDispatchProps {
    removeViewStockWithLatestPrice: () => void;
    setViewTransactionsForStock: (stockWithDollarValue: IStockWithDollarValue) => void;
}

const TransactStock: React.FC<{
    cashOnHand: number | undefined;
    viewStockWithLatestPrice: IStockWithDollarValue;
    setViewTransactionsForStock: (stockWithDollarValue: IStockWithDollarValue) => void;
    userOwnedStockOfStockWithLatestPrice: IOwnedStock | undefined;
}> = ({ cashOnHand, viewStockWithLatestPrice, setViewTransactionsForStock, userOwnedStockOfStockWithLatestPrice }) => {
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
                                    disabled={(cashOnHand ?? 0) < viewStockWithLatestPrice.dollarValue}
                                    intent="success"
                                    text="Buy"
                                    onClick={openBuyStocksDialog}
                                />
                                <BuyStocksDialog
                                    isOpen={isBuyDialogOpen}
                                    onClose={closeBuyStocksDialog}
                                    stock={viewStockWithLatestPrice}
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

const UnconnectedStockInformation: React.FC<IStoreProps & IDispatchProps> = ({
    cashOnHand,
    removeViewStockWithLatestPrice,
    viewStockWithLatestPrice,
    setViewTransactionsForStock,
    userOwnedStockOfStockWithLatestPrice,
}) => {
    const history = useHistory();
    if (viewStockWithLatestPrice === undefined) {
        history.push(Routes.PORTFOLIO);
        return null;
    }

    const stockInformation = callOnPrivateEndpoint(StocksFrontendService.getSingleStockInformation, {
        stock: viewStockWithLatestPrice.id,
        bucket: "week",
    });

    const goBackToPortfolioManager = () => {
        removeViewStockWithLatestPrice();
        history.push(Routes.PORTFOLIO);
    };

    const renderBackButton = () => {
        return (
            <div className={styles.backArrowContainer}>
                <Button icon="arrow-left" minimal onClick={goBackToPortfolioManager} />
            </div>
        );
    };

    if (stockInformation === undefined) {
        return (
            <div className={styles.stockInformationContainer}>
                {renderBackButton()}
                <div className={styles.spinnerContainer}>
                    <Spinner />
                </div>
            </div>
        );
    }

    const maybeRenderTransactStock = () => {
        if (viewStockWithLatestPrice.status === "ACQUIRED") {
            return null;
        }

        return (
            <TransactStock
                cashOnHand={cashOnHand}
                viewStockWithLatestPrice={viewStockWithLatestPrice}
                setViewTransactionsForStock={setViewTransactionsForStock}
                userOwnedStockOfStockWithLatestPrice={userOwnedStockOfStockWithLatestPrice}
            />
        );
    };

    const stockPrices = stockInformation.priceHistory.map(p => p.dollarValue);

    return (
        <div className={styles.stockInformationContainer}>
            {renderBackButton()}
            <div className={styles.stockDetailsContainer}>
                <span className={styles.stockName}>{viewStockWithLatestPrice.name}</span>
                <span className={styles.stockLatestPrice}>${viewStockWithLatestPrice.dollarValue.toFixed(2)}</span>
            </div>
            <div className={styles.pricePointsContainer}>
                {stockInformation.priceHistory.map(price => (
                    <div className={styles.singlePricePoint} key={price.id}>
                        <span>${price.dollarValue.toFixed(2)}</span>
                        <span>{new Date(price.timestamp).toLocaleString()}</span>
                    </div>
                ))}
            </div>
            <div className={styles.basicInformationContainer}>
                <div className={styles.columnContainer}>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>Market cap:</span>
                        <span>
                            $
                            {formatNumber(
                                viewStockWithLatestPrice.dollarValue * viewStockWithLatestPrice.totalQuantity,
                            )}
                        </span>
                    </div>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>Total shares:</span>
                        <span>{formatNumber(viewStockWithLatestPrice.totalQuantity)}</span>
                    </div>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>Available shares:</span>
                        <span>
                            {formatNumber(viewStockWithLatestPrice.totalQuantity - stockInformation.ownedStockQuantity)}
                        </span>
                    </div>
                </div>
                <div className={styles.columnContainer}>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>High:</span>
                        <span>${Math.max(...stockPrices).toFixed(2)}</span>
                    </div>
                    <div className={styles.rowContainer}>
                        <span className={styles.label}>Low:</span>
                        <span>${Math.min(...stockPrices).toFixed(2)}</span>
                    </div>
                </div>
            </div>
            {maybeRenderTransactStock()}
            <Button className={styles.moveToOtherPanels} disabled minimal text="See stock information" />
        </div>
    );
};

function mapStateToProps(store: IStoreState): IStoreProps {
    return {
        cashOnHand: store.account.userAccount?.cashOnHand,
        userOwnedStockOfStockWithLatestPrice: selectUserOwnedStock(store.interface.viewStockWithLatestPrice)(store),
        viewStockWithLatestPrice: store.interface.viewStockWithLatestPrice,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    const boundActions = bindActionCreators(
        {
            setViewTransactionsForStock: SetViewTransactionsForStock,
        },
        dispatch,
    );

    return {
        ...boundActions,
        removeViewStockWithLatestPrice: () => dispatch(SetViewStockWithLatestPrice(undefined)),
    };
}

export const StockInformation = connect(mapStateToProps, mapDispatchToProps)(UnconnectedStockInformation);
