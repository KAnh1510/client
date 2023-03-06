import classnames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { getOrder, updateOrder } from "~/api/ordersApi";
import styles from "./OrderDone.module.scss";
import OrderItem from "./OrderItem";
const cx = classnames.bind(styles);

const OrderDone = () => {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.users.currentUser);

	const { _id, name, email } = currentUser;
	const orders = useSelector((state) => state.orders.orders);
	const [filterOption, setFilterOption] = useState(0);

	const handelCancelOrder = async (id) => {
		const orderUpdate = orders.filter((item) => item._id === id);
		const { _id, ...newObj } = orderUpdate[0];
		await updateOrder(dispatch, id, { ...newObj, status: 3 });
		getOrder(dispatch, _id, { status: 0 });
	};

	const handleChange = (event) => {
		setFilterOption(event.target.value);
	};

	useEffect(() => {
		getOrder(dispatch, _id, { status: parseInt(filterOption) });
	}, [filterOption]);

	return (
		<div style={{ margin: "20px 0" }}>
			<h1 className={cx("header")}>Your Orders</h1>
			<div
				className={cx("button-right")}
				style={{ justifyContent: "end", width: "100%" }}
			>
				<select
					onChange={(event) => handleChange(event)}
					style={{ width: "200px", fontSize: 14 }}
					className="form-select"
				>
					<option value={0}>All</option>
					<option value={1}>Pending</option>
					<option value={2}>Delivery</option>
					<option value={3}>Cancel</option>
					<option value={4}>Complete</option>
				</select>
			</div>
			{orders?.length !== 0 ? (
				orders?.map((order) => {
					return (
						<OrderItem
							order={order}
							username={name}
							email={email}
							handelCancelOrder={handelCancelOrder}
							key={order._id}
						/>
					);
				})
			) : (
				<div className={cx("no-item-order")}>
					<div className={cx("no-item-order-title")}>
						You don't have any orders yet.
					</div>
					<div className={cx("no-item-order-continue")}>
						<Link to="/collection/all">
							<ion-icon
								name="arrow-undo-outline"
								style={{ margin: "0 4px" }}
							></ion-icon>
							Continue shopping
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrderDone;
