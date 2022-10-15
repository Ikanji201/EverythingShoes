import React from "react";
import { useState } from "react";

const Shoes = (props) => {
	const [newImage, setnewImage] = useState("");
	const [newBrand, setnewBrand] = useState("");
	const submitHandler = (e) => {
		e.preventDefault();
	};

	return (
			<section className="container d-flex justify-content-center mt-50 mb-50">
				<div className="row">
					{props.products.map((shoee) => (
						<div className="col-md-4 mt-2" key={shoee.index}>
							<div className="card">
								<div className="card-body">
									<div className="card-img-actions">
										<img
											src={shoee.image}
											className="card-img img-fluid"
											width="96"
											height="350"
											alt="img"
										/>
									</div>
								</div>

								<div className="card-body bg-light text-center">
									<div className="mb-2">
										<h6 className="font-weight-semibold mb-2">
											<a
												href="/#"
												className="text-default mb-2"
												data-abc="true"
											>
												Brand {shoee.brand}
											</a>
										</h6>

										<a
											href="/#"
											className="text-muted"
											data-abc="true"
										>
											Shoe Size {shoee.size}
										</a>
									</div>

									<h3 className="mb-0 font-weight-semibold">
										Price{" "}
										{shoee.price / 1000000000000000000}cUSD
									</h3>

									<button
										type="button"
										className="btn bg-cart"
										onClick={() =>
											props.buyProduct(shoee.index)
										}
									>
										<i className="fa fa-cart-plus mr-2"></i> Buy
										Now
									</button>

									{props.onlyOwner === shoee.owner && (
										<div>
											<input
												className="form-control form-control-lg"
												onChange={(e) =>
													setnewImage(e.target.value)
												}
												type="text"
												placeholder="Update Image"
											/>
											<input
												className="form-control form-control-lg"
												onChange={(e) =>
													setnewBrand(e.target.value)
												}
												type="text"
												placeholder="Update Brand"
											/>
											<button
												className="btn btn-primary mb-2"
												onClick={() =>
													props.updateShoe(
														shoee.index,
														newImage,
														newBrand
													)
												}
											>
												Update Shoe
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		
	);
};
export default Shoes;
