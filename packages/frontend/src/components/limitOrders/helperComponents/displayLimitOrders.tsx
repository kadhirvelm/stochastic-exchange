import { Button, Icon, NonIdealState, Spinner } from "@blueprintjs/core";
import { ILimitOrder, ILimitOrderId } from "@stochastic-exchange/api";
import classNames from "classnames";
import * as React from "react";
import { getLimitOrderPrice } from "../../../utils/getLimitOrderPrice";
import styles from "./displayLimitOrder.module.scss";

interface IProps {
    isLoading: boolean;
    limitOrders: ILimitOrder[];
    onLimitOrderDelete: (id: ILimitOrderId) => void;
}

export const DisplayLimitOrders: React.FC<IProps> = ({ isLoading, limitOrders, onLimitOrderDelete }) => {
    if (isLoading) {
        return (
            <div className={styles.spinnerContainer}>
                <Spinner />
            </div>
        );
    }

    if (limitOrders.length === 0) {
        return <NonIdealState className={styles.nonIdealHeight} description="None to display." />;
    }

    const deleteThisLimitOrder = (id: ILimitOrderId) => () => onLimitOrderDelete(id);

    return (
        <div className={styles.mainContainer}>
            {limitOrders.map(order => (
                <div className={styles.limitOrder} key={order.id}>
                    <div className={styles.directionContainer}>
                        {order.direction === "higher" ? (
                            <Icon icon="arrow-up" intent={order.status === "CANCELLED" ? "danger" : "none"} />
                        ) : (
                            <Icon icon="arrow-down" intent={order.status === "CANCELLED" ? "danger" : "none"} />
                        )}
                    </div>
                    <div className={styles.content}>
                        <span className={styles.timestamp}>{new Date(order.timestamp).toLocaleString()}</span>
                        <span
                            className={classNames(styles.summaryText, {
                                [styles.cancelledSummaryText]: order.status === "CANCELLED",
                            })}
                        >
                            {order.type === "buy-limit" ? "Buy" : "Sell"}{" "}
                            <span className={styles.importantValue}>{order.quantity.toLocaleString()}</span> shares when
                            the price {order.direction === "higher" ? "raises above" : "drops below"}{" "}
                            <span className={styles.importantValue}>{getLimitOrderPrice(order)}</span>.
                        </span>
                        {order.status === "CANCELLED" && (
                            <span className={styles.cancelledLimitOrderText}>
                                This limit order could not be executed.
                            </span>
                        )}
                    </div>
                    <Button icon="cross" minimal onClick={deleteThisLimitOrder(order.id)} />
                </div>
            ))}
        </div>
    );
};
