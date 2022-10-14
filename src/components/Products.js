import React from 'react';
import { useState } from 'react';

const Shoes = (props) => {
  const [newImage, setnewImage] = useState('');
  const [newBrand, setnewBrand] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();}

  return (
	<body>
	<section class="container d-flex justify-content-center mt-50 mb-50">
	  <div class="row">
	 {props.products.map((shoee) => (
	   
		<div class="col-md-4 mt-2"  key={shoee.index}>
		<div class="card">
		<div class="card-body">
                                        <div class="card-img-actions">
                                            
                                                <img src= {shoee.image}class="card-img img-fluid" width="96" height="350" alt="img"/>
                                              
                                           
                                        </div>
                                    </div>


									<div class="card-body bg-light text-center">
                                        <div class="mb-2">
                                            <h6 class="font-weight-semibold mb-2">
                                                <a href="/#" class="text-default mb-2" data-abc="true">Brand {shoee.brand}</a>
                                            </h6>

                                            <a href="/#" class="text-muted" data-abc="true">Shoe Size {shoee.size}</a>
                                        </div>

										<h3 class="mb-0 font-weight-semibold">Price {shoee.price /  1000000000000000000}cUSD</h3>


										<button type="button" class="btn bg-cart" onClick={() =>
													props.buyProduct(shoee.index)
												}><i class="fa fa-cart-plus mr-2"></i> Buy Now</button>

{props.onlyOwner === shoee.owner && (
               <div><input class="form-control form-control-lg"  onChange={(e) => setnewImage(e.target.value)} type="text" placeholder="Update Image"></input>
               <button class="btn btn-primary mb-2"  onClick={() => props.UpdateShoeImage(shoee.index, newImage)}>Update image</button>
               </div>
			   )}

			   {props.onlyOwner === shoee.owner && (
               <div><input class="form-control form-control-lg"  onChange={(e) => setnewBrand(e.target.value)} type="text" placeholder="Update Brand"></input>
               <button class="btn btn-primary mb-2"  onClick={() => props.UpdateShoeBrand(shoee.index, newBrand)}>Update Brand</button>
               </div>
			   )}



										</div>

									 

		</div>
		</div>

		))}
		</div>
 
		</section>
		</body>
		  );
		}
		export default Shoes;
		 